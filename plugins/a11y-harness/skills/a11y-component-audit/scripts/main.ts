import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { findRgaaCriterion, findWcagCriterion } from './find-criterion.ts'
import { validateReport } from './validate-report.ts'

const REFERENCE_DIR = join(import.meta.dirname, '../reference/standards')
const WCAG_FILE = 'wcag-2.2.json'
const RGAA_FILE = 'rgaa-4.1.2-criteres.json'
const ACT_FILE = 'act-rules.json'
const TEXT_ENCODING = 'utf8'
const SUCCESS_EXIT_CODE = 0
const FAILURE_EXIT_CODE = 1

type Outcome = { output: unknown; failed: boolean }

const readJson = (path: string) => JSON.parse(readFileSync(path, TEXT_ENCODING))
const readReference = (file: string) => readJson(join(REFERENCE_DIR, file))

const FINDERS: Record<string, (id: string) => object | null> = {
  'wcag-2.2': (id) => findWcagCriterion(readReference(WCAG_FILE), id),
  'rgaa-4.1.2': (id) => findRgaaCriterion(readReference(RGAA_FILE), id),
}

const lookUp = ([standard = '', id = '']: string[]): Outcome => {
  const criterion = FINDERS[standard]?.(id) ?? null
  return { output: criterion, failed: criterion === null }
}

const validate = ([reportPath = '']: string[]): Outcome => {
  const references = { wcag: readReference(WCAG_FILE), rgaa: readReference(RGAA_FILE), act: readReference(ACT_FILE) }
  const problems = validateReport(readJson(reportPath), references)
  return { output: problems, failed: problems.length > 0 }
}

const COMMANDS: Record<string, (args: string[]) => Outcome> = { lookup: lookUp, validate }

const [command = '', ...args] = process.argv.slice(2)
const outcome = COMMANDS[command]?.(args) ?? { output: null, failed: true }
process.exitCode = outcome.failed ? FAILURE_EXIT_CODE : SUCCESS_EXIT_CODE
process.stdout.write(JSON.stringify(outcome.output))
