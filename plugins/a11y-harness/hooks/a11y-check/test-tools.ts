import type { FailingTest } from './format-feedback.ts'
import type { CheckPlan, Standard } from './plan-checks.ts'
import { readVitestReport } from './read-reports.ts'

const VITEST_NAME = 'vitest'
const VITEST_BINARY = 'node_modules/.bin/vitest'
const VITEST_EXCLUDED_TESTS: Record<Standard, string> = {
  'wcag-2.2': '**/*.rgaa.test.tsx',
  'rgaa-4.1.2': '**/*.wcag.test.tsx',
}

export type TestTool = {
  name: string
  binary: string
  args: (plan: CheckPlan, reportFile: string) => string[]
  readReport: (report: string) => FailingTest[]
}

export const VITEST: TestTool = {
  name: VITEST_NAME,
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
  readReport: readVitestReport,
}
