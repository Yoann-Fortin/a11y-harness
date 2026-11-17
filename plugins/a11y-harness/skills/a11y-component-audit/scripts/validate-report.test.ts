import { describe, expect, it } from 'vitest'
import type { RgaaReference, WcagReference } from './find-criterion.ts'
import { validateReport } from './validate-report.ts'

const WCAG_TITLE = 'Labels or instructions are provided when content requires user input.'
const RGAA_TITLE = 'Required title'
const WCAG_REFERENCE: WcagReference = {
  principles: [
    {
      guidelines: [
        {
          successcriteria: [
            { id: 'labels-or-instructions', num: '3.3.2', handle: 'Labels or Instructions', title: WCAG_TITLE, level: 'A' },
          ],
        },
      ],
    },
  ],
}
const RGAA_REFERENCE: RgaaReference = {
  topics: [{ number: 11, criteria: [{ criterium: { number: 10, title: RGAA_TITLE, tests: { 1: ['First test'] } } }] }],
}
const REFERENCES = { wcag: WCAG_REFERENCE, rgaa: RGAA_REFERENCE }
const WCAG_FINDING = { criterion: '3.3.2', level: 'A', quote: WCAG_TITLE }

describe('validateReport', () => {
  it.each([
    ['an exact WCAG finding', WCAG_FINDING, []],
    ['an unknown WCAG criterion', { ...WCAG_FINDING, criterion: '9.9.9' }, [{ criterion: '9.9.9', problem: 'unknown-criterion' }]],
  ])('checks %s', (_, finding, expected) => {
    expect(validateReport({ standard: 'wcag-2.2', findings: [finding] }, REFERENCES)).toEqual(expected)
  })

  it('flags a WCAG level that differs from the official one', () => {
    const report = { standard: 'wcag-2.2', findings: [{ ...WCAG_FINDING, level: 'AA' }] }

    expect(validateReport(report, REFERENCES)).toEqual([{ criterion: '3.3.2', problem: 'wrong-level' }])
  })
})
