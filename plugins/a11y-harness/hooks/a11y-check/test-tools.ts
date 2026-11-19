import type { FailingTest } from './format-feedback.ts'
import type { CheckPlan, Standard } from './plan-checks.ts'
import { countJestFormatTests, readJestFormatReport } from './read-reports.ts'

const VITEST_NAME = 'vitest'
const VITEST_PACKAGE = 'vitest'
const VITEST_BINARY = 'node_modules/.bin/vitest'
const VITEST_EXCLUDED_TESTS: Record<Standard, string> = {
  'wcag-2.2': '**/*.rgaa.test.tsx',
  'rgaa-4.1.2': '**/*.wcag.test.tsx',
}

const JEST_NAME = 'jest'
const JEST_PACKAGE = 'jest'
const JEST_BINARY = 'node_modules/.bin/jest'
const JEST_DEFAULT_IGNORED_PATHS = '/node_modules/'
const JEST_EXCLUDED_TESTS: Record<Standard, string> = {
  'wcag-2.2': '\\.rgaa\\.test\\.tsx$',
  'rgaa-4.1.2': '\\.wcag\\.test\\.tsx$',
}

export type TestTool = {
  name: string
  package: string
  binary: string
  args: (plan: CheckPlan, reportFile: string) => string[]
  fileArgs: (testFile: string, reportFile: string) => string[]
  env: (reportFile: string) => Record<string, string>
  readReport: (report: string) => FailingTest[]
  countTests: (report: string) => number
}

export const VITEST: TestTool = {
  name: VITEST_NAME,
  package: VITEST_PACKAGE,
  binary: VITEST_BINARY,
  args: (plan, reportFile) => [
    'related',
    plan.filePath,
    '--run',
    '--reporter=json',
    `--outputFile=${reportFile}`,
    '--passWithNoTests',
    '--exclude',
    VITEST_EXCLUDED_TESTS[plan.standard],
  ],
  fileArgs: (testFile, reportFile) => ['run', testFile, '--reporter=json', `--outputFile=${reportFile}`],
  env: () => ({}),
  readReport: readJestFormatReport,
  countTests: countJestFormatTests,
}

export const JEST: TestTool = {
  name: JEST_NAME,
  package: JEST_PACKAGE,
  binary: JEST_BINARY,
  args: (plan, reportFile) => [
    '--findRelatedTests',
    plan.filePath,
    '--json',
    `--outputFile=${reportFile}`,
    '--passWithNoTests',
    '--testPathIgnorePatterns',
    JEST_DEFAULT_IGNORED_PATHS,
    JEST_EXCLUDED_TESTS[plan.standard],
  ],
  fileArgs: (testFile, reportFile) => [testFile, '--json', `--outputFile=${reportFile}`],
  env: () => ({}),
  readReport: readJestFormatReport,
  countTests: countJestFormatTests,
}
