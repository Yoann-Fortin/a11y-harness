import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { findRgaaCriteria, findRgaaMethodologies, findWcagCriteria } from './find-criterion.ts'
import { inventoryOf } from './inventory.ts'
import { missingCriteria, validateReport } from './validate-report.ts'

const REFERENCE_DIR = join(import.meta.dirname, '../reference/standards')
const WCAG_FILE = 'wcag-2.2.json'
const RGAA_FILE = 'rgaa-4.1.2-criteres.json'
const RGAA_METHODOLOGIES_FILE = 'rgaa-4.1.2-methodologies.json'
const ACT_FILE = 'act-rules.json'
const FORM_CRITERIA_FILE = join(import.meta.dirname, '../reference/form-criteria.json')
const TEXT_ENCODING = 'utf8'
const SUCCESS_EXIT_CODE = 0
const FAILURE_EXIT_CODE = 1
const INLINE_REPORT_START = '{'

type Outcome = { output: unknown; failed: boolean }

const readJson = (path: string) => JSON.parse(readFileSync(path, TEXT_ENCODING))
const readReference = (file: string) => readJson(join(REFERENCE_DIR, file))
const readReport = (argument: string) =>
  argument.startsWith(INLINE_REPORT_START) ? JSON.parse(argument) : readJson(argument)

const FINDERS: Record<string, (id: string) => object[]> = {
  'wcag-2.2': (id) => findWcagCriteria(readReference(WCAG_FILE), id),
  'rgaa-4.1.2': (id) =>
    findRgaaCriteria(readReference(RGAA_FILE), id).map((criterion) => ({
      ...criterion,
      methodologies: findRgaaMethodologies(readReference(RGAA_METHODOLOGIES_FILE), criterion),
    })),
}

const lookUp = ([standard = '', id = '']: string[]): Outcome => {
  const [criterion = null] = FINDERS[standard]?.(id) ?? []
  return { output: criterion, failed: criterion === null }
}

const inventoryCriteria = (components: string[], standard: string) => [
  ...new Set(
    components.flatMap((component) =>
      inventoryOf(readJson(FORM_CRITERIA_FILE), readFileSync(component, TEXT_ENCODING), standard).flatMap(
        ({ criteria }) => criteria,
      ),
    ),
  ),
]

const validate = ([reportArgument = '', ...components]: string[]): Outcome => {
  const references = { wcag: readReference(WCAG_FILE), rgaa: readReference(RGAA_FILE), act: readReference(ACT_FILE) }
  const report = readReport(reportArgument)
  const problems = [
    ...validateReport(report, references),
    ...missingCriteria(report, inventoryCriteria(components, report.standard)),
  ]
  return { output: problems, failed: problems.length > 0 }
}

const inventory = ([standard = '', component = '']: string[]): Outcome => ({
  output: inventoryOf(readJson(FORM_CRITERIA_FILE), readFileSync(component, TEXT_ENCODING), standard),
  failed: false,
})

const COMMANDS: Record<string, (args: string[]) => Outcome> = { lookup: lookUp, validate, inventory }

const [command = '', ...args] = process.argv.slice(2)
const outcome = COMMANDS[command]?.(args) ?? { output: null, failed: true }
process.exitCode = outcome.failed ? FAILURE_EXIT_CODE : SUCCESS_EXIT_CODE
process.stdout.write(JSON.stringify(outcome.output))
