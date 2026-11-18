import { describe, expect, it } from 'vitest'
import { problemsOf } from './judge-variants.ts'

describe('problemsOf', () => {
  it('flags a conforming variant that the tests reject', () => {
    const runs = [{ variant: 'with-label.tsx', kind: 'conforming' as const, passed: false }]

    expect(problemsOf(runs)).toEqual([{ variant: 'with-label.tsx', problem: 'conforming-variant-rejected' }])
  })

  it('accepts a conforming variant that the tests pass', () => {
    expect(problemsOf([{ variant: 'with-label.tsx', kind: 'conforming', passed: true }])).toEqual([])
  })

  it('flags a faulty variant that the tests accept', () => {
    expect(problemsOf([{ variant: 'original.tsx', kind: 'faulty', passed: true }])).toEqual([
      { variant: 'original.tsx', problem: 'faulty-variant-accepted' },
    ])
  })
})
