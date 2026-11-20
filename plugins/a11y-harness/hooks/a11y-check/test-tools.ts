import { basename, extname } from 'node:path'
import type { FailingTest } from './format-feedback.ts'
import { RGAA_STANDARD, type Standard, WCAG_STANDARD } from '../../skills/a11y-component-audit/scripts/standard.ts'
import type { TestFile } from './files.ts'
import type { CheckPlan } from './plan-checks.ts'
import { countJestFormatTests, countPlaywrightTests, readJestFormatReport, readPlaywrightReport } from './read-reports.ts'

const VITEST_NAME = 'vitest'
const VITEST_PACKAGE = 'vitest'
const VITEST_BINARY = 'node_modules/.bin/vitest'
const VITEST_RELATED = 'related'
const VITEST_RUN = 'run'
const VITEST_RUN_ONCE = '--run'
const VITEST_JSON_REPORTER = '--reporter=json'
const VITEST_OUTPUT_FILE = '--outputFile='
const VITEST_PASS_WITH_NO_TESTS = '--passWithNoTests'
const VITEST_EXCLUDE = '--exclude'
const VITEST_EXCLUDED_TESTS: Record<Standard, string> = {
  [WCAG_STANDARD]: '**/*.rgaa.test.tsx',
  [RGAA_STANDARD]: '**/*.wcag.test.tsx',
}

const JEST_NAME = 'jest'
const JEST_PACKAGE = 'jest'
const JEST_BINARY = 'node_modules/.bin/jest'
const JEST_FIND_RELATED_TESTS = '--findRelatedTests'
const JEST_JSON = '--json'
const JEST_OUTPUT_FILE = '--outputFile='
const JEST_PASS_WITH_NO_TESTS = '--passWithNoTests'
const JEST_IGNORED_PATHS = '--testPathIgnorePatterns'
const JEST_DEFAULT_IGNORED_PATHS = '/node_modules/'
const JEST_EXCLUDED_TESTS: Record<Standard, string> = {
  [WCAG_STANDARD]: '\\.rgaa\\.test\\.tsx$',
  [RGAA_STANDARD]: '\\.wcag\\.test\\.tsx$',
}

const PLAYWRIGHT_NAME = 'playwright'
const PLAYWRIGHT_PACKAGE = '@playwright/test'
const PLAYWRIGHT_BINARY = 'node_modules/.bin/playwright'
const PLAYWRIGHT_REPORT_VARIABLE = 'PLAYWRIGHT_JSON_OUTPUT_FILE'
const PLAYWRIGHT_TEST = 'test'
const PLAYWRIGHT_JSON_REPORTER = '--reporter=json'
const PLAYWRIGHT_PASS_WITH_NO_TESTS = '--pass-with-no-tests'
const PLAYWRIGHT_FAMILIES: Record<Standard, string> = {
  [WCAG_STANDARD]: 'wcag',
  [RGAA_STANDARD]: 'rgaa',
}

const REGEX_SPECIAL_CHARACTERS = /[.*+?^${}()|[\]\\]/g
const ESCAPED_MATCH = '\\$&'
const END_OF_PATH = '$'

const addsNoVariables = () => ({})

const escapeRegex = (text: string) => text.replace(REGEX_SPECIAL_CHARACTERS, ESCAPED_MATCH)

const specFilesOf = (plan: CheckPlan) =>
  `(?:^|[\\\\/])${escapeRegex(basename(plan.filePath, extname(plan.filePath)))}(?:\\.${PLAYWRIGHT_FAMILIES[plan.standard]})?\\.spec\\.[jt]sx?$`

export type TestTool = {
  name: string
  package: string
  binary: string
  args: (plan: CheckPlan, reportFile: string) => string[]
  fileArgs: (testFile: TestFile, reportFile: string) => string[]
  env: (reportFile: string) => Record<string, string>
  readReport: (report: string) => FailingTest[]
  countTests: (report: string) => number
}

export const VITEST: TestTool = {
  name: VITEST_NAME,
  package: VITEST_PACKAGE,
  binary: VITEST_BINARY,
  args: (plan, reportFile) => [
    VITEST_RELATED,
    plan.filePath,
    VITEST_RUN_ONCE,
    VITEST_JSON_REPORTER,
    `${VITEST_OUTPUT_FILE}${reportFile}`,
    VITEST_PASS_WITH_NO_TESTS,
    VITEST_EXCLUDE,
    VITEST_EXCLUDED_TESTS[plan.standard],
  ],
  fileArgs: (testFile, reportFile) => [VITEST_RUN, testFile, VITEST_JSON_REPORTER, `${VITEST_OUTPUT_FILE}${reportFile}`],
  env: addsNoVariables,
  readReport: readJestFormatReport,
  countTests: countJestFormatTests,
}

export const JEST: TestTool = {
  name: JEST_NAME,
  package: JEST_PACKAGE,
  binary: JEST_BINARY,
  args: (plan, reportFile) => [
    JEST_FIND_RELATED_TESTS,
    plan.filePath,
    JEST_JSON,
    `${JEST_OUTPUT_FILE}${reportFile}`,
    JEST_PASS_WITH_NO_TESTS,
    JEST_IGNORED_PATHS,
    JEST_DEFAULT_IGNORED_PATHS,
    JEST_EXCLUDED_TESTS[plan.standard],
  ],
  fileArgs: (testFile, reportFile) => [testFile, JEST_JSON, `${JEST_OUTPUT_FILE}${reportFile}`],
  env: addsNoVariables,
  readReport: readJestFormatReport,
  countTests: countJestFormatTests,
}

export const PLAYWRIGHT: TestTool = {
  name: PLAYWRIGHT_NAME,
  package: PLAYWRIGHT_PACKAGE,
  binary: PLAYWRIGHT_BINARY,
  args: (plan) => [PLAYWRIGHT_TEST, specFilesOf(plan), PLAYWRIGHT_JSON_REPORTER, PLAYWRIGHT_PASS_WITH_NO_TESTS],
  fileArgs: (testFile) => [PLAYWRIGHT_TEST, `${escapeRegex(testFile)}${END_OF_PATH}`, PLAYWRIGHT_JSON_REPORTER],
  env: (reportFile) => ({ [PLAYWRIGHT_REPORT_VARIABLE]: reportFile }),
  readReport: readPlaywrightReport,
  countTests: countPlaywrightTests,
}
