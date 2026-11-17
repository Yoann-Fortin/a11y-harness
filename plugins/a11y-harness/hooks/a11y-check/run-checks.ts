import type { CheckResults, ToolFailure } from './format-feedback.ts'
import type { CheckPlan } from './plan-checks.ts'
import { readBiomeReport } from './read-reports.ts'
import type { CommandResult } from './run-command.ts'

const BIOME_BINARY = 'node_modules/.bin/biome'
const BIOME_TOOL = 'biome'
const BIOME_ARGS = ['lint', '--reporter=json']
const TOOL_TIME_LIMIT_MS = 60_000

export type RunCommand = (command: string, args: string[], cwd: string, timeoutMs: number) => Promise<CommandResult>

export type Tools = {
  run: RunCommand
}

const failures = (result: CommandResult, tool: string): ToolFailure[] =>
  result.ok ? [] : [{ tool, message: result.failure }]

export async function runChecks(plan: CheckPlan, tools: Tools): Promise<CheckResults> {
  const lint = await tools.run(BIOME_BINARY, [...BIOME_ARGS, plan.filePath], plan.cwd, TOOL_TIME_LIMIT_MS)
  return {
    lintErrors: lint.ok ? readBiomeReport(lint.stdout) : [],
    failingTests: [],
    toolFailures: failures(lint, BIOME_TOOL),
  }
}
