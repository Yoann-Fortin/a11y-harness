import { join } from 'node:path'
import type { RunCommand } from '../../../hooks/a11y-check/run-checks.ts'
import type { TestFile } from '../../../hooks/a11y-check/files.ts'
import type { TestTool } from '../../../hooks/a11y-check/test-tools.ts'

const TEST_RUN_TIME_LIMIT_MS = 120_000
const NO_VERDICT = null

export type TestFileTools = {
  run: RunCommand
  readText: (path: string) => Promise<string>
  reportFile: string
  testRunners: TestTool[]
}

async function verdictOf(testRunner: TestTool, testFile: TestFile, cwd: string, tools: TestFileTools) {
  const output = await tools.run(
    join(cwd, testRunner.binary),
    testRunner.fileArgs(testFile, tools.reportFile),
    cwd,
    TEST_RUN_TIME_LIMIT_MS,
    testRunner.env(tools.reportFile),
  )
  if (!output.ok) {
    return NO_VERDICT
  }
  try {
    const report = await tools.readText(tools.reportFile)
    return testRunner.countTests(report) === 0 ? NO_VERDICT : testRunner.readReport(report).length === 0
  } catch {
    return NO_VERDICT
  }
}

export async function passesTestFile(testFile: TestFile, cwd: string, tools: TestFileTools) {
  for (const testRunner of tools.testRunners) {
    const verdict = await verdictOf(testRunner, testFile, cwd, tools)
    if (verdict !== NO_VERDICT) {
      return verdict
    }
  }
  return false
}
