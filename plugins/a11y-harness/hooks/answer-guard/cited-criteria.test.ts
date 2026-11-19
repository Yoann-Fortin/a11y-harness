import { describe, expect, it } from 'vitest'
import { citedCriteria } from './cited-criteria.ts'

const RGAA = 'rgaa-4.1.2'

describe('citedCriteria', () => {
  it('finds an RGAA criterion cited by its number', () => {
    expect(citedCriteria('The toggle also fails criterion 11.9.', RGAA)).toEqual(['11.9'])
  })

  it('reads every digit of a two-digit criterion number', () => {
    expect(citedCriteria('Criterion 11.10 fails.', RGAA)).toEqual(['11.10'])
  })
})
