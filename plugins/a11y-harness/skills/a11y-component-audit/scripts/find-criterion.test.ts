import { describe, expect, it } from 'vitest'
import { findWcagCriterion } from './find-criterion.ts'

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
            },
          ],
        },
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
      },
    ],
    ['9.9.9', null],
  ])('finds %s', (id, expected) => {
    expect(findWcagCriterion(WCAG_REFERENCE, id)).toEqual(expected)
  })
})
