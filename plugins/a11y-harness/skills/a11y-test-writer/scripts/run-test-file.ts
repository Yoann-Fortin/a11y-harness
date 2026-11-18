import type { RunCommand } from '../../../hooks/a11y-check/run-checks.ts'
import type { TestTool } from '../../../hooks/a11y-check/test-tools.ts'

export type TestFileTools = {
  run: RunCommand
  readText: (path: string) => Promise<string>
  reportFile: string
  testRunners: TestTool[]
}

export async function passesTestFile(_testFile: string, _cwd: string, tools: TestFileTools) {
  const [testRunner] = tools.testRunners
  const report = await tools.readText(tools.reportFile)
  return testRunner.readReport(report).length === 0
}
