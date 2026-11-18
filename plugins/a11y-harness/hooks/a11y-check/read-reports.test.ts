import { describe, expect, it } from 'vitest'
import { readBiomeReport, readDependencies, readJestFormatReport } from './read-reports.ts'

const BIOME_REPORT = JSON.stringify({
  diagnostics: [
    {
      severity: 'error',
      message: 'Provide a text alternative.',
      category: 'lint/a11y/useAltText',
      location: { path: 'src/Form.tsx', start: { line: 3, column: 5 }, end: { line: 3, column: 20 } },
    },
  ],
})

const VITEST_REPORT = JSON.stringify({
  testResults: [
    {
      assertionResults: [
        { fullName: 'Form names the email field', status: 'passed', failureMessages: [] },
        {
          fullName: 'Form names the password field',
          status: 'failed',
          failureMessages: ['Unable to find the label\n    at Form.test.tsx:12:5'],
        },
      ],
    },
  ],
})

describe('readBiomeReport', () => {
  it('turns each Biome diagnostic into a lint error', () => {
    expect(readBiomeReport(BIOME_REPORT)).toEqual([
      { file: 'src/Form.tsx', line: 3, rule: 'lint/a11y/useAltText', message: 'Provide a text alternative.' },
    ])
  })
})

describe('readJestFormatReport', () => {
  it('keeps each failed test with the first line of its message', () => {
    expect(readJestFormatReport(VITEST_REPORT)).toEqual([
      { name: 'Form names the password field', message: 'Unable to find the label' },
    ])
  })
})

describe('readDependencies', () => {
  it.each([
    ['its dependencies and development dependencies', { dependencies: { react: '^19.3.1' }, devDependencies: { vitest: '^5.1.0' } }, ['react', 'vitest']],
    ['no dependency when it declares none', {}, []],
  ])('lists %s from a package.json', (_, packageJson, expected) => {
    expect(readDependencies(JSON.stringify(packageJson))).toEqual(expected)
  })
})
