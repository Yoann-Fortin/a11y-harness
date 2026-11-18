import type { RunCommand } from '../../../hooks/a11y-check/run-checks.ts'
import type { TestTool } from '../../../hooks/a11y-check/test-tools.ts'

export type TestFileTools = {
  run: RunCommand
  readText: (path: string) => Promise<string>
  reportFile: string
  testRunners: TestTool[]
}

export const passesTestFile = async (_testFile: string, _cwd: string, _tools: TestFileTools) => true
