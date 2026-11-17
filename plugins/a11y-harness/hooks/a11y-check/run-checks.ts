import { join } from 'node:path'
import type { CheckResults, ToolFailure } from './format-feedback.ts'
import type { CheckPlan, Standard } from './plan-checks.ts'
import { readBiomeReport, readVitestReport } from './read-reports.ts'
import type { CommandResult } from './run-command.ts'

const BIOME_BINARY = 'node_modules/.bin/biome'
const BIOME_TOOL = 'biome'
const BIOME_ARGS = ['lint', '--reporter=json']
const VITEST_BINARY = 'node_modules/.bin/vitest'
const VITEST_TOOL = 'vitest'
const EXCLUDED_TESTS: Record<Standard, string> = {
  'wcag-2.2': '**/*.rgaa.test.tsx',
  'rgaa-4.1.2': '**/*.wcag.test.tsx',
}
const TOOL_TIME_LIMIT_MS = 60_000

export type RunCommand = (command: string, args: string[], cwd: string, timeoutMs: number) => Promise<CommandResult>

export type Tools = {
  run: RunCommand
  readText: (path: string) => Promise<string>
  reportFile: string
}

const failures = (result: CommandResult, tool: string): ToolFailure[] =>
  result.ok ? [] : [{ tool, message: result.failure }]

const vitestArgs = (plan: CheckPlan, reportFile: string) => [
  'related',
  plan.filePath,
  '--run',
  '--reporter=json',
  `--outputFile=${reportFile}`,
  '--passWithNoTests',
  '--exclude',
  EXCLUDED_TESTS[plan.standard],
]

export async function runChecks(plan: CheckPlan, tools: Tools): Promise<CheckResults> {
  const lint = await tools.run(join(plan.cwd, BIOME_BINARY), [...BIOME_ARGS, plan.filePath], plan.cwd, TOOL_TIME_LIMIT_MS)
  const tests = await tools.run(
    join(plan.cwd, VITEST_BINARY),
    vitestArgs(plan, tools.reportFile),
    plan.cwd,
    TOOL_TIME_LIMIT_MS,
  )
  return {
    lintErrors: lint.ok ? readBiomeReport(lint.stdout) : [],
    failingTests: tests.ok ? readVitestReport(await tools.readText(tools.reportFile)) : [],
    toolFailures: [...failures(lint, BIOME_TOOL), ...failures(tests, VITEST_TOOL)],
  }
}
