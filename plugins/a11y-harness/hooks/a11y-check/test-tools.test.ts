import { describe, expect, it } from 'vitest'
import { JEST, VITEST } from './test-tools.ts'

const FILE = '/project/src/Form.tsx'
const REPORT_FILE = '/tmp/a11y-check/vitest.json'
const TEST_FILE = '/project/src/Form.wcag.test.tsx'
const WCAG_PLAN = { filePath: FILE, cwd: '/project', standard: 'wcag-2.2' as const }
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

describe('test counts', () => {
  it.each([
    ['Vitest', VITEST],
    ['Jest', JEST],
  ])('counts the tests %s ran', (_, tool) => {
    expect(tool.countTests(JSON.stringify({ numTotalTests: 3, testResults: [] }))).toBe(3)
  })
})
