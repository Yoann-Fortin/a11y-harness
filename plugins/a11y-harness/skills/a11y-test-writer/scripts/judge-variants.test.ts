import { describe, expect, it } from 'vitest'
import { problemsOf } from './judge-variants.ts'

describe('problemsOf', () => {
  it('flags a conforming variant that the tests reject', () => {
    const runs = [{ variant: 'with-label.tsx', kind: 'conforming' as const, passed: false }]

    expect(problemsOf(runs)).toEqual([{ variant: 'with-label.tsx', problem: 'conforming-variant-rejected' }])
  })
})
