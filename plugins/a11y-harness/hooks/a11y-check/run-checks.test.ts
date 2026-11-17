import { describe, expect, it } from 'vitest'
import { runChecks } from './run-checks.ts'
import type { CommandResult } from './run-command.ts'

const FILE = '/project/src/Form.tsx'
const PROJECT_DIR = '/project'
const WCAG_PLAN = { filePath: FILE, cwd: PROJECT_DIR, standard: 'wcag-2.2' as const }
const BIOME = 'node_modules/.bin/biome'
const VITEST = 'node_modules/.bin/vitest'
const REPORT_FILE = '/tmp/a11y-check/vitest.json'
const BIOME_REPORT = JSON.stringify({
  diagnostics: [
    {
      message: 'Provide a text alternative.',
      category: 'lint/a11y/useAltText',
      location: { path: 'src/Form.tsx', start: { line: 3 } },
    },
  ],
})
const NO_DIAGNOSTICS = JSON.stringify({ diagnostics: [] })
const VITEST_REPORT = JSON.stringify({
  testResults: [
    {
      assertionResults: [
        { fullName: 'Form names the field', status: 'failed', failureMessages: ['Unable to find the label'] },
      ],
    },
  ],
})
const NO_FAILURES = JSON.stringify({ testResults: [] })
const OUTPUT = (stdout: string): CommandResult => ({ ok: true, stdout })
const CANNOT_RUN: CommandResult = { ok: false, failure: 'command not found' }

type Call = { command: string; args: string[]; cwd: string }

const fakeTools = (outputs: Record<string, CommandResult>, vitestReport: string) => {
  const calls: Call[] = []
  return {
    calls,
    run: async (command: string, args: string[], cwd: string) => {
      calls.push({ command, args, cwd })
      return outputs[command]
    },
    readText: async () => vitestReport,
    reportFile: REPORT_FILE,
  }
}

describe('runChecks', () => {
  it('lints the planned file with Biome and reports its errors', async () => {
    const tools = fakeTools({ [BIOME]: OUTPUT(BIOME_REPORT), [VITEST]: OUTPUT('') }, NO_FAILURES)

    const results = await runChecks(WCAG_PLAN, tools)

    expect(tools.calls).toContainEqual({ command: BIOME, args: ['lint', '--reporter=json', FILE], cwd: PROJECT_DIR })
    expect(results).toEqual({
      lintErrors: [
        { file: 'src/Form.tsx', line: 3, rule: 'lint/a11y/useAltText', message: 'Provide a text alternative.' },
      ],
      failingTests: [],
      toolFailures: [],
    })
  })

  it('reports Biome as a tool failure when it cannot run', async () => {
    const tools = fakeTools({ [BIOME]: CANNOT_RUN, [VITEST]: OUTPUT('') }, NO_FAILURES)

    const results = await runChecks(WCAG_PLAN, tools)

    expect(results).toEqual({
      lintErrors: [],
      failingTests: [],
      toolFailures: [{ tool: 'biome', message: 'command not found' }],
    })
  })

  it('runs the tests related to the planned file, leaving the RGAA-only tests out under WCAG', async () => {
    const tools = fakeTools({ [BIOME]: OUTPUT(NO_DIAGNOSTICS), [VITEST]: OUTPUT('') }, VITEST_REPORT)

    const results = await runChecks(WCAG_PLAN, tools)

    expect(tools.calls).toContainEqual({
      command: VITEST,
      args: [
        'related',
        FILE,
        '--run',
        '--reporter=json',
        `--outputFile=${REPORT_FILE}`,
        '--passWithNoTests',
        '--exclude',
        '**/*.rgaa.test.tsx',
      ],
      cwd: PROJECT_DIR,
    })
    expect(results.failingTests).toEqual([{ name: 'Form names the field', message: 'Unable to find the label' }])
  })

  it('reports Vitest as a tool failure when it cannot run', async () => {
    const tools = fakeTools({ [BIOME]: OUTPUT(NO_DIAGNOSTICS), [VITEST]: CANNOT_RUN }, VITEST_REPORT)

    const results = await runChecks(WCAG_PLAN, tools)

    expect(results.failingTests).toEqual([])
    expect(results.toolFailures).toEqual([{ tool: 'vitest', message: 'command not found' }])
  })
})
