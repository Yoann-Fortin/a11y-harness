import { describe, expect, it } from 'vitest'
import { citedCriteria } from './cited-criteria.ts'

const RGAA = 'rgaa-4.1.2'
const WCAG = 'wcag-2.2'

describe('citedCriteria', () => {
  it('finds an RGAA criterion cited by its number', () => {
    expect(citedCriteria('The toggle also fails criterion 11.9.', RGAA)).toEqual(['11.9'])
  })

  it('reads every digit of a two-digit criterion number', () => {
    expect(citedCriteria('Criterion 11.10 fails.', RGAA)).toEqual(['11.10'])
  })

  it('does not read the version of a standard as a criterion', () => {
    expect(citedCriteria('Against RGAA 4.1.2 and WCAG 2.1, criterion 11.9 fails.', RGAA)).toEqual(['11.9'])
  })

  it('finds a WCAG success criterion cited by its number', () => {
    expect(citedCriteria('Under WCAG 2.2, the button fails 4.1.2 Name, Role, Value.', WCAG)).toEqual(['4.1.2'])
  })
})
