import { describe, expect, it } from 'vitest'
import type { CheckPlan } from './plan-checks.ts'
import { JEST, PLAYWRIGHT, VITEST } from './test-tools.ts'

const FILE = '/project/src/Form.tsx'
const REPORT_FILE = '/tmp/a11y-check/vitest.json'
const TEST_FILE = '/project/src/Form.wcag.test.tsx'
const WCAG_PLAN: CheckPlan = { filePath: FILE, cwd: '/project', standard: 'wcag-2.2' }
const TEST_REPORT = JSON.stringify({
  testResults: [
    {
      assertionResults: [
        { fullName: 'Form names the field', status: 'failed', failureMessages: ['Unable to find the label'] },
      ],
    },
  ],
})

describe('VITEST', () => {
  it('runs the tests related to the planned file with the Vitest of the package, leaving the RGAA-only tests out under WCAG', () => {
    expect(VITEST).toMatchObject({ name: 'vitest', binary: 'node_modules/.bin/vitest' })
    expect(VITEST.args(WCAG_PLAN, REPORT_FILE)).toEqual([
      'related',
      FILE,
      '--run',
      '--reporter=json',
      `--outputFile=${REPORT_FILE}`,
      '--passWithNoTests',
      '--exclude',
      '**/*.rgaa.test.tsx',
    ])
  })

  it('leaves the WCAG-only tests out under RGAA', () => {
    expect(VITEST.args({ ...WCAG_PLAN, standard: 'rgaa-4.1.2' }, REPORT_FILE).at(-1)).toBe('**/*.wcag.test.tsx')
  })

  it('reads the failing tests from the Vitest report', () => {
    expect(VITEST.readReport(TEST_REPORT)).toEqual([{ name: 'Form names the field', message: 'Unable to find the label' }])
  })

  it('runs a single test file with a JSON report', () => {
    expect(VITEST.fileArgs(TEST_FILE, REPORT_FILE)).toEqual(['run', TEST_FILE, '--reporter=json', `--outputFile=${REPORT_FILE}`])
  })
})

describe('JEST', () => {
  it('runs the tests related to the planned file with the Jest of the package, leaving the RGAA-only tests out under WCAG', () => {
    expect(JEST).toMatchObject({ name: 'jest', package: 'jest', binary: 'node_modules/.bin/jest' })
    expect(JEST.args(WCAG_PLAN, REPORT_FILE)).toEqual([
      '--findRelatedTests',
      FILE,
      '--json',
      `--outputFile=${REPORT_FILE}`,
      '--passWithNoTests',
      '--testPathIgnorePatterns',
      '/node_modules/',
      '\\.rgaa\\.test\\.tsx$',
    ])
  })

  it('leaves the WCAG-only tests out under RGAA', () => {
    expect(JEST.args({ ...WCAG_PLAN, standard: 'rgaa-4.1.2' }, REPORT_FILE).at(-1)).toBe('\\.wcag\\.test\\.tsx$')
  })

  it('reads the failing tests from the Jest report', () => {
    expect(JEST.readReport(TEST_REPORT)).toEqual([{ name: 'Form names the field', message: 'Unable to find the label' }])
  })

  it('runs a single test file with a JSON report', () => {
    expect(JEST.fileArgs(TEST_FILE, REPORT_FILE)).toEqual([TEST_FILE, '--json', `--outputFile=${REPORT_FILE}`])
  })
})

const failedSpec = (title: string, message: string) => ({
  title,
  ok: false,
  tests: [{ results: [{ status: 'failed', errors: [{ message: `${message}\n\nExpected: []` }] }] }],
})
const PLAYWRIGHT_REPORT = JSON.stringify({
  suites: [
    { title: 'Toggle.spec.tsx', specs: [failedSpec('has a name', 'Error: name missing')] },
    {
      title: 'Form.spec.tsx',
      specs: [],
      suites: [
        {
          title: 'Form',
          specs: [
            failedSpec('shows the focus', 'Error: focus not visible'),
            { title: 'has enough contrast', ok: true, tests: [{ results: [{ status: 'passed', errors: [] }] }] },
          ],
        },
      ],
    },
  ],
  stats: { expected: 1, unexpected: 2, flaky: 0, skipped: 0 },
})

describe('PLAYWRIGHT', () => {
  it('runs the spec files named after the planned component with the Playwright Test of the package, leaving the RGAA-only ones out under WCAG', () => {
    expect(PLAYWRIGHT).toMatchObject({ name: 'playwright', package: '@playwright/test', binary: 'node_modules/.bin/playwright' })
    expect(PLAYWRIGHT.args(WCAG_PLAN, REPORT_FILE)).toEqual([
      'test',
      '(?:^|[\\\\/])Form(?:\\.wcag)?\\.spec\\.[jt]sx?$',
      '--reporter=json',
      '--pass-with-no-tests',
    ])
  })

  it('matches the name of the component literally, even with characters that a regular expression reads otherwise', () => {
    const specFiles = new RegExp(PLAYWRIGHT.args({ ...WCAG_PLAN, filePath: '/project/src/Form.v2+.tsx' }, REPORT_FILE)[1])

    expect(['/project/src/Form.v2+.spec.tsx', '/project/src/Formxv22.spec.tsx'].map((file) => specFiles.test(file))).toEqual([
      true,
      false,
    ])
  })

  it('writes its JSON report to the report file, which Playwright Test only takes from the environment', () => {
    expect(PLAYWRIGHT.env(REPORT_FILE)).toEqual({ PLAYWRIGHT_JSON_OUTPUT_FILE: REPORT_FILE })
  })

  it('reads the failing tests from the Playwright report, inside describe blocks or not', () => {
    expect(PLAYWRIGHT.readReport(PLAYWRIGHT_REPORT)).toEqual([
      { name: 'has a name', message: 'Error: name missing' },
      { name: 'Form shows the focus', message: 'Error: focus not visible' },
    ])
  })

  it('removes the colour codes that Playwright Test keeps in its error messages', () => {
    const report = JSON.stringify({ suites: [{ title: 'Form.spec.tsx', specs: [failedSpec('shows the focus', 'Error: \u001b[2mexpect(\u001b[22m\u001b[31mreceived\u001b[39m)')] }] })

    expect(PLAYWRIGHT.readReport(report)).toEqual([{ name: 'shows the focus', message: 'Error: expect(received)' }])
  })

  it('reads no failing test from a report whose suites it cannot read', () => {
    expect(PLAYWRIGHT.readReport(JSON.stringify({ suites: [{ title: 'Form.spec.tsx' }] }))).toEqual([])
  })

  it('counts every test Playwright Test ran, skipped or flaky ones included', () => {
    expect(PLAYWRIGHT.countTests(JSON.stringify({ suites: [], stats: { expected: 1, unexpected: 2, flaky: 4, skipped: 8 } }))).toBe(15)
  })

  it('runs a single spec file, matched literally, with a JSON report', () => {
    expect(PLAYWRIGHT.fileArgs('src/Form.wcag.spec.tsx', REPORT_FILE)).toEqual([
      'test',
      'src/Form\\.wcag\\.spec\\.tsx$',
      '--reporter=json',
    ])
  })

  it('leaves the WCAG-only spec files out under RGAA', () => {
    expect(PLAYWRIGHT.args({ ...WCAG_PLAN, standard: 'rgaa-4.1.2' }, REPORT_FILE)[1]).toBe(
      '(?:^|[\\\\/])Form(?:\\.rgaa)?\\.spec\\.[jt]sx?$',
    )
  })
})

describe('test counts', () => {
  it.each([
    ['Vitest', VITEST],
    ['Jest', JEST],
  ])('counts the tests %s ran', (_, tool) => {
    expect(tool.countTests(JSON.stringify({ numTotalTests: 3, testResults: [] }))).toBe(3)
  })
})

describe('test environment', () => {
  it.each([
    ['Vitest', VITEST],
    ['Jest', JEST],
  ])('adds nothing to the environment of %s, which takes its report file as an argument', (_, tool) => {
    expect(tool.env?.(REPORT_FILE)).toEqual({})
  })
})
