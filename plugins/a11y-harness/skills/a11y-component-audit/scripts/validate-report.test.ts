import { describe, expect, it } from 'vitest'
import type { ActReference, RgaaReference, WcagReference } from './find-criterion.ts'
import { missingCriteria, unopenedCriteria, validateReport } from './validate-report.ts'

const WCAG_TITLE = 'Labels or instructions are provided when content requires user input.'
const RGAA_TITLE = 'Required\u202ftitle\u00a0?'
const NAME_TITLE = 'Name, role and value can be programmatically determined.'
const WCAG_REFERENCE: WcagReference = {
  principles: [
    {
      guidelines: [
        {
          successcriteria: [
            {
              id: 'labels-or-instructions',
              num: '3.3.2',
              handle: 'Labels or Instructions',
              title: WCAG_TITLE,
              level: 'A',
              versions: ['2.0', '2.1', '2.2'],
              techniques: {
                sufficient: [{ id: 'G131', technology: 'general', title: 'Providing descriptive labels' }],
                failure: [{ id: 'F82', technology: 'failures', title: 'Failure by not including a text label' }],
              },
            },
            {
              id: 'name-role-value',
              num: '4.1.2',
              handle: 'Name, Role, Value',
              title: NAME_TITLE,
              level: 'A',
              versions: ['2.0', '2.1', '2.2'],
            },
          ],
        },
      ],
    },
  ],
}
const RGAA_REFERENCES = [{ wcag: ['3.3.2 Labels or Instructions (A)'] }, { techniques: ['H90', 'F81'] }]
const RGAA_REFERENCE: RgaaReference = {
  wcag: { version: 2.1 },
  topics: [
    {
      number: 11,
      criteria: [{ criterium: { number: 10, title: RGAA_TITLE, tests: { 1: ['First test'] }, references: RGAA_REFERENCES } }],
    },
  ],
}
const ACT_REFERENCE: ActReference = {
  'act-rules': [
    {
      deprecated: false,
      proposed: false,
      frontmatter: { id: 'e086e5', accessibility_requirements: { 'wcag20:4.1.2': { forConformance: true } } },
    },
  ],
}
const REFERENCES = { wcag: WCAG_REFERENCE, rgaa: RGAA_REFERENCE, act: ACT_REFERENCE }
const WCAG_FINDING = { criterion: '3.3.2', level: 'A', quote: WCAG_TITLE }
const RGAA_FINDING = { criterion: '11.10', quote: RGAA_TITLE }

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

  it('flags a quote that differs from the official title', () => {
    const report = { standard: 'wcag-2.2', findings: [{ ...WCAG_FINDING, quote: 'Labels are required.' }] }

    expect(validateReport(report, REFERENCES)).toEqual([{ criterion: '3.3.2', problem: 'quote-mismatch' }])
  })

  it.each([
    ['an exact RGAA finding', RGAA_FINDING, []],
    [
      'an RGAA quote that differs from the official title',
      { ...RGAA_FINDING, quote: 'Required fields are marked.' },
      [{ criterion: '11.10', problem: 'quote-mismatch' }],
    ],
    [
      'a criterion that exists in WCAG but not in RGAA',
      { ...RGAA_FINDING, criterion: '3.3.2' },
      [{ criterion: '3.3.2', problem: 'unknown-criterion' }],
    ],
  ])('checks %s against RGAA 4.1.2', (_, finding, expected) => {
    expect(validateReport({ standard: 'rgaa-4.1.2', findings: [finding] }, REFERENCES)).toEqual(expected)
  })

  it('accepts a finding left for manual review without a criterion', () => {
    const report = { standard: 'wcag-2.2', findings: [{ quote: '' }] }

    expect(validateReport(report, REFERENCES)).toEqual([])
  })

  it.each([
    ['a technique that is not listed for the criterion', 'F68'],
    ['a prefix of a listed technique', 'G13'],
    ['words taken from a technique title', 'labels'],
  ])('flags %s as unrelated evidence', (_, evidence) => {
    const report = { standard: 'wcag-2.2', findings: [{ ...WCAG_FINDING, evidence: [evidence] }] }

    expect(validateReport(report, REFERENCES)).toEqual([{ criterion: '3.3.2', problem: 'unrelated-evidence', evidence }])
  })

  it('accepts the techniques and failures listed for the criterion as evidence', () => {
    const report = { standard: 'wcag-2.2', findings: [{ ...WCAG_FINDING, evidence: ['G131', 'F82'] }] }

    expect(validateReport(report, REFERENCES)).toEqual([])
  })

  it('accepts an approved ACT rule written for the criterion as evidence', () => {
    const finding = { criterion: '4.1.2', level: 'A', quote: NAME_TITLE, evidence: ['e086e5'] }

    expect(validateReport({ standard: 'wcag-2.2', findings: [finding] }, REFERENCES)).toEqual([])
  })

  it.each([
    ['a test number that the criterion does not have', '11.10.9'],
    ['a test of another criterion', '11.1.1'],
  ])('flags %s as unrelated RGAA evidence', (_, evidence) => {
    const report = { standard: 'rgaa-4.1.2', findings: [{ ...RGAA_FINDING, evidence: [evidence] }] }

    expect(validateReport(report, REFERENCES)).toEqual([{ criterion: '11.10', problem: 'unrelated-evidence', evidence }])
  })

  it('accepts the tests of the RGAA criterion as evidence', () => {
    const report = { standard: 'rgaa-4.1.2', findings: [{ ...RGAA_FINDING, evidence: ['11.10.1'] }] }

    expect(validateReport(report, REFERENCES)).toEqual([])
  })

  it('accepts an RGAA quote typed with plain spaces where the official title has no-break spaces', () => {
    const report = { standard: 'rgaa-4.1.2', findings: [{ ...RGAA_FINDING, quote: 'Required title ?' }] }

    expect(validateReport(report, REFERENCES)).toEqual([])
  })

  it('accepts the techniques and failures referenced by the RGAA criterion as evidence', () => {
    const report = { standard: 'rgaa-4.1.2', findings: [{ ...RGAA_FINDING, evidence: ['H90', 'F81'] }] }

    expect(validateReport(report, REFERENCES)).toEqual([])
  })
})

describe('missingCriteria', () => {
  it('flags a criterion of the inventory that the report does not rule on', () => {
    const report = { standard: 'wcag-2.2', findings: [WCAG_FINDING] }

    expect(missingCriteria(report, ['3.3.2', '4.1.2'])).toEqual([{ criterion: '4.1.2', problem: 'missing-criterion' }])
  })
})

describe('unopenedCriteria', () => {
  it('flags a criterion of the report that belongs to the criteria table but that the inventory of the component did not open', () => {
    expect(unopenedCriteria(['11.9'], ['7.1'], ['7.1', '11.9'])).toEqual([{ criterion: '11.9', problem: 'unopened-criterion' }])
  })
})
