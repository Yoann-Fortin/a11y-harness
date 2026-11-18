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

export async function passesTestFile(testFile: string, cwd: string, tools: TestFileTools) {
  const [testRunner] = tools.testRunners
  const output = await tools.run(
    join(cwd, testRunner.binary),
    testRunner.fileArgs(testFile, tools.reportFile),
    cwd,
    TEST_RUN_TIME_LIMIT_MS,
  )
  if (!output.ok) {
    return false
  }
  const report = await tools.readText(tools.reportFile)
  return testRunner.readReport(report).length === 0 && testRunner.countTests(report) > 0
}
