import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { findRgaaCriteria, findRgaaMethodologies, findWcagCriteria } from './find-criterion.ts'
import { criteriaTableFrom, inventoryFor, inventoryOf } from './inventory.ts'
import { RGAA_STANDARD, standardOf, WCAG_STANDARD } from './standard.ts'
import { reportProblems } from './validate-report.ts'

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
const readSource = (path: string) => readFileSync(path, TEXT_ENCODING)
const formCriteriaTable = () => criteriaTableFrom(readJson(FORM_CRITERIA_FILE))
const readReport = (argument: string) =>
  argument.startsWith(INLINE_REPORT_START) ? JSON.parse(argument) : readJson(argument)

const FINDERS: Record<string, (id: string) => object[]> = {
  [WCAG_STANDARD]: (id) => findWcagCriteria(readReference(WCAG_FILE), id),
  [RGAA_STANDARD]: (id) =>
    findRgaaCriteria(readReference(RGAA_FILE), id).map((criterion) => ({
      ...criterion,
      methodologies: findRgaaMethodologies(readReference(RGAA_METHODOLOGIES_FILE), criterion),
    })),
}

const lookUp = ([standard = '', id = '']: string[]): Outcome => {
  const [criterion = null] = FINDERS[standard]?.(id) ?? []
  return { output: criterion, failed: criterion === null }
}

const validate = ([reportArgument = '', ...components]: string[]): Outcome => {
  const references = { wcag: readReference(WCAG_FILE), rgaa: readReference(RGAA_FILE), act: readReference(ACT_FILE) }
  const report = readReport(reportArgument)
  const problems = reportProblems(report, references, inventoryFor(formCriteriaTable(), components.map(readSource), report.standard))
  return { output: problems, failed: problems.length > 0 }
}

const NO_OUTCOME: Outcome = { output: null, failed: true }

const inventory = ([standardArgument = '', ...components]: string[]): Outcome => {
  const standard = standardOf(standardArgument)
  return standard === null
    ? NO_OUTCOME
    : { output: inventoryOf(formCriteriaTable(), components.map(readSource), standard), failed: false }
}

const COMMANDS: Record<string, (args: string[]) => Outcome> = { lookup: lookUp, validate, inventory }

const [command = '', ...args] = process.argv.slice(2)
const outcome = COMMANDS[command]?.(args) ?? NO_OUTCOME
process.exitCode = outcome.failed ? FAILURE_EXIT_CODE : SUCCESS_EXIT_CODE
process.stdout.write(JSON.stringify(outcome.output))
