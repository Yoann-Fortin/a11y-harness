import { join } from 'node:path'
import type { CheckResults, FailingTest, LintError, ToolFailure } from './format-feedback.ts'
import type { LintTool } from './lint-tools.ts'
import type { CheckPlan } from './plan-checks.ts'
import type { CommandResult } from './run-command.ts'
import type { TestTool } from './test-tools.ts'

const TOOL_TIME_LIMIT_MS = 60_000

export type RunCommand = (
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
  variables?: Record<string, string>,
) => Promise<CommandResult>

export type Tools = {
  run: RunCommand
  readText: (path: string) => Promise<string>
  reportFile: string
  linters: LintTool[]
  testRunners: TestTool[]
}

export async function runChecks(plan: CheckPlan, tools: Tools): Promise<CheckResults> {
  const lintErrors: LintError[] = []
  const failingTests: FailingTest[] = []
  const toolFailures: ToolFailure[] = []
  const untestedBy: string[] = []
  for (const linter of tools.linters) {
    const output = await tools.run(join(plan.cwd, linter.binary), linter.args(plan), plan.cwd, TOOL_TIME_LIMIT_MS)
    if (output.ok) {
      lintErrors.push(...linter.readReport(output.stdout))
    } else {
      toolFailures.push({ tool: linter.name, message: output.failure })
    }
  }
  for (const testRunner of tools.testRunners) {
    const output = await tools.run(
      join(plan.cwd, testRunner.binary),
      testRunner.args(plan, tools.reportFile),
      plan.cwd,
      TOOL_TIME_LIMIT_MS,
      testRunner.env(tools.reportFile),
    )
    if (output.ok) {
      const report = await tools.readText(tools.reportFile)
      failingTests.push(...testRunner.readReport(report))
      if (testRunner.countTests(report) === 0) {
        untestedBy.push(testRunner.name)
      }
    } else {
      toolFailures.push({ tool: testRunner.name, message: output.failure })
    }
  }
  return { lintErrors, failingTests, toolFailures, untestedBy }
}
