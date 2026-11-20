import { describe, expect, it } from 'vitest'
import type { LintTool } from './lint-tools.ts'
import { runChecks } from './run-checks.ts'
import type { CommandResult } from './run-command.ts'
import type { TestTool } from './test-tools.ts'

const FILE = '/project/src/Form.tsx'
const PROJECT_DIR = '/project'
const PLAN = { filePath: FILE, cwd: PROJECT_DIR, standard: 'wcag-2.2' as const }
const REPORT_FILE = '/tmp/a11y-check/report.json'
const LINT_OUTPUT = 'lint output'
const TEST_REPORT = 'test report'
const LINT_ERROR = { file: 'src/Form.tsx', line: 3, rule: 'a11y/alt-text', message: 'Provide a text alternative.' }
const FAILING_TEST = { name: 'Form names the field', message: 'Unable to find the label' }
const LINTER_PATH = '/project/node_modules/.bin/linter'
const RUNNER_PATH = '/project/node_modules/.bin/runner'
const CANNOT_RUN: CommandResult = { ok: false, failure: 'command not found' }

const LINTER: LintTool = {
  name: 'linter',
  package: 'linter',
  binary: 'node_modules/.bin/linter',
  args: (plan) => ['check', plan.filePath],
  readReport: (output) => (output === LINT_OUTPUT ? [LINT_ERROR] : []),
}

const TEST_RUNNER: TestTool = {
  name: 'runner',
  package: 'runner',
  binary: 'node_modules/.bin/runner',
  args: (plan, reportFile) => ['related', plan.filePath, reportFile],
  fileArgs: (testFile, reportFile) => ['run', testFile, reportFile],
  env: (reportFile) => ({ RUNNER_REPORT: reportFile }),
  readReport: (report) => (report === TEST_REPORT ? [FAILING_TEST] : []),
  countTests: (report) => (report === TEST_REPORT ? 1 : 0),
}

const OUTPUT = (stdout: string): CommandResult => ({ ok: true, stdout })

type Call = { command: string; args: string[]; cwd: string }

const fakeTools = (outputs: Record<string, CommandResult>, report = TEST_REPORT) => {
  const calls: Call[] = []
  const variables: Record<string, Record<string, string> | undefined> = {}
  return {
    calls,
    variables,
    run: async (command: string, args: string[], cwd: string, _timeoutMs: number, given?: Record<string, string>) => {
      calls.push({ command, args, cwd })
      variables[command] = given
      return outputs[command] ?? CANNOT_RUN
    },
    readText: async (path: string) => (path === REPORT_FILE ? report : ''),
    reportFile: REPORT_FILE,
    linters: [LINTER],
    testRunners: [TEST_RUNNER],
  }
}

describe('runChecks', () => {
  it('runs each linter on the planned file from the package folder and reports its errors', async () => {
    const tools = fakeTools({ [LINTER_PATH]: OUTPUT(LINT_OUTPUT), [RUNNER_PATH]: OUTPUT('') })

    const results = await runChecks(PLAN, tools)

    expect(tools.calls).toContainEqual({ command: LINTER_PATH, args: ['check', FILE], cwd: PROJECT_DIR })
    expect(results.lintErrors).toEqual([LINT_ERROR])
    expect(results.toolFailures).toEqual([])
  })

  it('reports a linter that cannot run as a tool failure', async () => {
    const tools = fakeTools({ [RUNNER_PATH]: OUTPUT('') })

    const results = await runChecks(PLAN, tools)

    expect(results).toEqual({
      lintErrors: [],
      failingTests: [FAILING_TEST],
      toolFailures: [{ tool: 'linter', message: 'command not found' }],
      untestedBy: [],
      withoutTestRunner: false,
    })
  })

  it('runs each test runner on the planned file and reads the failing tests from its report', async () => {
    const tools = fakeTools({ [LINTER_PATH]: OUTPUT(''), [RUNNER_PATH]: OUTPUT('') })

    const results = await runChecks(PLAN, tools)

    expect(tools.calls).toContainEqual({ command: RUNNER_PATH, args: ['related', FILE, REPORT_FILE], cwd: PROJECT_DIR })
    expect(results.failingTests).toEqual([FAILING_TEST])
  })

  it('runs each test runner with the variables it adds to the environment', async () => {
    const tools = fakeTools({ [LINTER_PATH]: OUTPUT(''), [RUNNER_PATH]: OUTPUT('') })

    await runChecks(PLAN, tools)

    expect(tools.variables[RUNNER_PATH]).toEqual({ RUNNER_REPORT: REPORT_FILE })
  })

  it('reports a test runner that cannot run as a tool failure', async () => {
    const tools = fakeTools({ [LINTER_PATH]: OUTPUT(LINT_OUTPUT) })

    const results = await runChecks(PLAN, tools)

    expect(results).toEqual({
      lintErrors: [LINT_ERROR],
      failingTests: [],
      toolFailures: [{ tool: 'runner', message: 'command not found' }],
      untestedBy: [],
      withoutTestRunner: false,
    })
  })

  it('names the test runner that found no test related to the planned file', async () => {
    const tools = fakeTools({ [LINTER_PATH]: OUTPUT(''), [RUNNER_PATH]: OUTPUT('') }, '')

    const results = await runChecks(PLAN, tools)

    expect(results.untestedBy).toEqual(['runner'])
  })

  it('reports a package that runs no test runner', async () => {
    const tools = { ...fakeTools({ [LINTER_PATH]: OUTPUT('') }), testRunners: [] }

    const results = await runChecks(PLAN, tools)

    expect(results.withoutTestRunner).toBe(true)
  })
})
