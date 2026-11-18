import { describe, expect, it } from 'vitest'
import type { CommandResult } from '../../../hooks/a11y-check/run-command.ts'
import type { TestTool } from '../../../hooks/a11y-check/test-tools.ts'
import { passesTestFile } from './run-test-file.ts'

const PROJECT_DIR = '/project'
const TEST_FILE = '/project/src/ProductFilter.wcag.test.tsx'
const REPORT_FILE = '/tmp/a11y-verify/report.json'
const RUNNER_PATH = '/project/node_modules/.bin/runner'
const PASSING_REPORT = 'one passing test'
const FAILING_REPORT = 'one failing test'

const TEST_RUNNER: TestTool = {
  name: 'runner',
  package: 'runner',
  binary: 'node_modules/.bin/runner',
  args: () => [],
  fileArgs: (testFile, reportFile) => ['run', testFile, reportFile],
  readReport: (report) => (report === FAILING_REPORT ? [{ name: 'labels the field', message: 'Unable to find the label' }] : []),
  countTests: (report) => (report === PASSING_REPORT || report === FAILING_REPORT ? 1 : 0),
}

const fakeTools = (report: string) => ({
  run: async (command: string, args: string[], cwd: string): Promise<CommandResult> =>
    command === RUNNER_PATH && args.join(' ') === `run ${TEST_FILE} ${REPORT_FILE}` && cwd === PROJECT_DIR
      ? { ok: true, stdout: '' }
      : { ok: false, failure: 'command not found' },
  readText: async (path: string) => (path === REPORT_FILE ? report : ''),
  reportFile: REPORT_FILE,
  testRunners: [TEST_RUNNER],
})

describe('passesTestFile', () => {
  it('passes a test file whose tests all pass with the test runner of the package', async () => {
    expect(await passesTestFile(TEST_FILE, PROJECT_DIR, fakeTools(PASSING_REPORT))).toBe(true)
  })

  it('fails a test file with a failing test', async () => {
    expect(await passesTestFile(TEST_FILE, PROJECT_DIR, fakeTools(FAILING_REPORT))).toBe(false)
  })

  it('fails a test file that runs no test', async () => {
    expect(await passesTestFile(TEST_FILE, PROJECT_DIR, fakeTools(''))).toBe(false)
  })

  it('fails a test file that the test runner cannot run', async () => {
    const tools = { ...fakeTools(PASSING_REPORT), run: async (): Promise<CommandResult> => ({ ok: false, failure: 'command not found' }) }

    expect(await passesTestFile(TEST_FILE, PROJECT_DIR, tools)).toBe(false)
  })
})
