import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { findRgaaCriterion, findWcagCriterion } from './find-criterion.ts'

const REFERENCE_DIR = join(import.meta.dirname, '../reference/standards')
const WCAG_FILE = 'wcag-2.2.json'
const RGAA_FILE = 'rgaa-4.1.2-criteres.json'
const TEXT_ENCODING = 'utf8'
const NOT_FOUND_EXIT_CODE = 1

const readReference = (file: string) => JSON.parse(readFileSync(join(REFERENCE_DIR, file), TEXT_ENCODING))

const FINDERS: Record<string, (id: string) => object | null> = {
  'wcag-2.2': (id) => findWcagCriterion(readReference(WCAG_FILE), id),
  'rgaa-4.1.2': (id) => findRgaaCriterion(readReference(RGAA_FILE), id),
}

const [standard = '', id = ''] = process.argv.slice(2)
const criterion = FINDERS[standard]?.(id) ?? null
if (criterion === null) {
  process.exitCode = NOT_FOUND_EXIT_CODE
}
process.stdout.write(JSON.stringify(criterion))
