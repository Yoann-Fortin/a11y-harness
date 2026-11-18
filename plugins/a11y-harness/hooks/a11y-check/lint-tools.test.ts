import { describe, expect, it } from 'vitest'
import { BIOME, ESLINT } from './lint-tools.ts'

const PLAN = { filePath: '/project/src/Form.tsx', cwd: '/project', standard: 'wcag-2.2' as const }
const BIOME_REPORT = JSON.stringify({
  diagnostics: [
    {
      message: 'Provide a text alternative.',
      category: 'lint/a11y/useAltText',
      location: { path: 'src/Form.tsx', start: { line: 3 } },
    },
  ],
})

describe('BIOME', () => {
  it('lints the planned file with the Biome of the package, in JSON', () => {
    expect(BIOME).toMatchObject({ name: 'biome', binary: 'node_modules/.bin/biome' })
    expect(BIOME.args(PLAN)).toEqual(['lint', '--reporter=json', '/project/src/Form.tsx'])
  })

  it('reads the lint errors from the Biome report', () => {
    expect(BIOME.readReport(BIOME_REPORT)).toEqual([
      { file: 'src/Form.tsx', line: 3, rule: 'lint/a11y/useAltText', message: 'Provide a text alternative.' },
    ])
  })
})

const ESLINT_REPORT = JSON.stringify([
  {
    filePath: '/project/src/Form.tsx',
    messages: [
      { ruleId: 'jsx-a11y/alt-text', severity: 2, message: 'img elements must have an alt prop.', line: 4, column: 7 },
    ],
  },
])

describe('ESLINT', () => {
  it('lints the planned file with the ESLint of the package, in JSON', () => {
    expect(ESLINT).toMatchObject({ name: 'eslint', package: 'eslint', binary: 'node_modules/.bin/eslint' })
    expect(ESLINT.args(PLAN)).toEqual(['--format', 'json', '/project/src/Form.tsx'])
  })

  it('reads the lint errors from the ESLint report', () => {
    expect(ESLINT.readReport(ESLINT_REPORT)).toEqual([
      { file: '/project/src/Form.tsx', line: 4, rule: 'jsx-a11y/alt-text', message: 'img elements must have an alt prop.' },
    ])
  })
})
