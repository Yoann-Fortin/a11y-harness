import { join } from 'node:path'
import type { RunCommand } from '../../../hooks/a11y-check/run-checks.ts'
import type { TestTool } from '../../../hooks/a11y-check/test-tools.ts'

const TEST_RUN_TIME_LIMIT_MS = 120_000

export type TestFileTools = {
  run: RunCommand
  readText: (path: string) => Promise<string>
  reportFile: string
  testRunners: TestTool[]
}

async function verdictOf(testRunner: TestTool, testFile: string, cwd: string, tools: TestFileTools) {
  const output = await tools.run(
    join(cwd, testRunner.binary),
    testRunner.fileArgs(testFile, tools.reportFile),
    cwd,
    TEST_RUN_TIME_LIMIT_MS,
    testRunner.env(tools.reportFile),
  )
  if (!output.ok) {
    return undefined
  }
  const report = await tools.readText(tools.reportFile)
  return testRunner.countTests(report) === 0 ? undefined : testRunner.readReport(report).length === 0
}

export async function passesTestFile(testFile: string, cwd: string, tools: TestFileTools) {
  for (const testRunner of tools.testRunners) {
    const verdict = await verdictOf(testRunner, testFile, cwd, tools)
    if (verdict !== undefined) {
      return verdict
    }
  }
  return false
}
