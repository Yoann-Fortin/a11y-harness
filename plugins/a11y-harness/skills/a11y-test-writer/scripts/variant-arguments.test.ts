import { describe, expect, it } from 'vitest'
import { variantsOf } from './variant-arguments.ts'

describe('variantsOf', () => {
  it('gives each variant file the kind of the last flag before it, conforming before any flag', () => {
    expect(variantsOf(['label.tsx', '--faulty', 'Filter.tsx', '--conforming', 'labelledby.tsx', 'title.tsx'])).toEqual([
      { file: 'label.tsx', kind: 'conforming' },
      { file: 'Filter.tsx', kind: 'faulty' },
      { file: 'labelledby.tsx', kind: 'conforming' },
      { file: 'title.tsx', kind: 'conforming' },
    ])
  })
})
