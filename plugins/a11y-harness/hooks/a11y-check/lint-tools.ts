import type { LintError } from './format-feedback.ts'
import type { CheckPlan } from './plan-checks.ts'
import { readBiomeReport, readEslintReport } from './read-reports.ts'

const BIOME_NAME = 'biome'
const BIOME_PACKAGE = '@biomejs/biome'
const BIOME_BINARY = 'node_modules/.bin/biome'
const BIOME_ARGS = ['lint', '--reporter=json']
const ESLINT_NAME = 'eslint'
const ESLINT_PACKAGE = 'eslint'
const ESLINT_BINARY = 'node_modules/.bin/eslint'
const ESLINT_ARGS = ['--format', 'json']

export type LintTool = {
  name: string
  package: string
  binary: string
  args: (plan: CheckPlan) => string[]
  readReport: (output: string) => LintError[]
}

export const BIOME: LintTool = {
  name: BIOME_NAME,
  package: BIOME_PACKAGE,
  binary: BIOME_BINARY,
  args: (plan) => [...BIOME_ARGS, plan.filePath],
  readReport: readBiomeReport,
}

export const ESLINT: LintTool = {
  name: ESLINT_NAME,
  package: ESLINT_PACKAGE,
  binary: ESLINT_BINARY,
  args: (plan) => [...ESLINT_ARGS, plan.filePath],
  readReport: readEslintReport,
}
