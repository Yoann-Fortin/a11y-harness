import { describe, expect, it } from 'vitest'
import { testFileOf } from './files.ts'

describe('testFileOf', () => {
  it('reads a test or spec file of any script extension, and nothing from another file', () => {
    expect(
      ['src/Form.test.tsx', 'src/Form.wcag.spec.ts', 'src/Form.browser.test.jsx', 'src/Form.test.js', 'src/Form.tsx', 'src/Form.test.tsx.bak'].map(
        testFileOf,
      ),
    ).toEqual(['src/Form.test.tsx', 'src/Form.wcag.spec.ts', 'src/Form.browser.test.jsx', 'src/Form.test.js', null, null])
  })
})
