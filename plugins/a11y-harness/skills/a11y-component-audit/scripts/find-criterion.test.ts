import { describe, expect, it } from 'vitest'
import {
  type ActReference,
  findActRules,
  findRgaaCriterion,
  findWcagCriterion,
  type RgaaReference,
} from './find-criterion.ts'

const LABELS_TECHNIQUES = {
  sufficient: [{ id: 'G131', technology: 'general', title: 'Providing descriptive labels' }],
  failure: [{ id: 'F82', technology: 'failures', title: 'Failure by not including a text label' }],
}

const WCAG_REFERENCE = {
  principles: [
    {
      guidelines: [
        {
          successcriteria: [
            { id: 'non-text-content', num: '1.1.1', handle: 'Non-text Content', title: 'Non-text title', level: 'A' },
            {
              id: 'labels-or-instructions',
              num: '3.3.2',
              handle: 'Labels or Instructions',
              title: 'Labels or instructions are provided when content requires user input.',
              level: 'A',
              techniques: LABELS_TECHNIQUES,
            },
          ],
        },
      ],
    },
  ],
}

const RGAA_REFERENCE: RgaaReference = {
  topics: [
    {
      number: 1,
      criteria: [
        { criterium: { number: 1, title: 'Image title', tests: { 1: ['Image test'] } } },
        { criterium: { number: 10, title: 'Other topic title', tests: { 1: ['Other topic test'] } } },
      ],
    },
    {
      number: 11,
      criteria: [
        { criterium: { number: 1, title: 'Label title', tests: { 1: ['Label test'] } } },
        { criterium: { number: 10, title: 'Required title', tests: { 1: ['First test'], 2: ['Second test'] } } },
      ],
    },
  ],
}

describe('findWcagCriterion', () => {
  it.each([
    [
      '3.3.2',
      {
        standard: 'wcag-2.2',
        id: '3.3.2',
        handle: 'Labels or Instructions',
        title: 'Labels or instructions are provided when content requires user input.',
        level: 'A',
        understanding: 'https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html',
        techniques: LABELS_TECHNIQUES,
      },
    ],
    ['9.9.9', null],
  ])('finds %s', (id, expected) => {
    expect(findWcagCriterion(WCAG_REFERENCE, id)).toEqual(expected)
  })
})

describe('findRgaaCriterion', () => {
  it.each([
    [
      '11.10',
      {
        standard: 'rgaa-4.1.2',
        id: '11.10',
        title: 'Required title',
        tests: { '11.10.1': ['First test'], '11.10.2': ['Second test'] },
      },
    ],
    ['12.1', null],
  ])('finds %s', (id, expected) => {
    expect(findRgaaCriterion(RGAA_REFERENCE, id)).toEqual(expected)
  })
})

const ACT_REFERENCE: ActReference = {
  'act-rules': [
    {
      deprecated: false,
      proposed: false,
      frontmatter: {
        id: 'e086e5',
        accessibility_requirements: {
          'wcag20:4.1.2': { forConformance: true },
          'wcag20:1.3.1': { secondary: 'This success criterion is more strict than this rule.' },
        },
      },
    },
    {
      deprecated: true,
      proposed: false,
      frontmatter: { id: 'old001', accessibility_requirements: { 'wcag20:4.1.2': { forConformance: true } } },
    },
    {
      deprecated: false,
      proposed: true,
      frontmatter: { id: 'new001', accessibility_requirements: { 'wcag20:4.1.2': { forConformance: true } } },
    },
    { deprecated: false, proposed: false, frontmatter: { id: 'none01', accessibility_requirements: null } },
  ],
}

describe('findActRules', () => {
  it.each([
    ['4.1.2', ['e086e5']],
    ['1.3.1', []],
  ])('lists the approved ACT rules written for %s', (id, expected) => {
    expect(findActRules(ACT_REFERENCE, id)).toEqual(expected)
  })
})
