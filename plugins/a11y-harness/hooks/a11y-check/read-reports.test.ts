import { describe, expect, it } from 'vitest'
import { readBiomeReport } from './read-reports.ts'

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

describe('readBiomeReport', () => {
  it('turns each Biome diagnostic into a lint error', () => {
    expect(readBiomeReport(BIOME_REPORT)).toEqual([
      { file: 'src/Form.tsx', line: 3, rule: 'lint/a11y/useAltText', message: 'Provide a text alternative.' },
    ])
  })
})
