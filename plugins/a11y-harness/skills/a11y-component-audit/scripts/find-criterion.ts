const WCAG_STANDARD = 'wcag-2.2'
const UNDERSTANDING_URL = 'https://www.w3.org/WAI/WCAG22/Understanding/'
const UNDERSTANDING_EXTENSION = '.html'

type WcagSuccessCriterion = {
  id: string
  num: string
  handle: string
  title: string
  level: string
}

export type WcagReference = {
  principles: { guidelines: { successcriteria: WcagSuccessCriterion[] }[] }[]
}

export type WcagCriterion = {
  standard: string
  id: string
  handle: string
  title: string
  level: string
  understanding: string
}

export function findWcagCriterion(reference: WcagReference, id: string): WcagCriterion | null {
  const criterion = reference.principles
    .flatMap((principle) => principle.guidelines)
    .flatMap((guideline) => guideline.successcriteria)
    .find((successCriterion) => successCriterion.num === id)
  return criterion === undefined
    ? null
    : {
        standard: WCAG_STANDARD,
        id: criterion.num,
        handle: criterion.handle,
        title: criterion.title,
        level: criterion.level,
        understanding: `${UNDERSTANDING_URL}${criterion.id}${UNDERSTANDING_EXTENSION}`,
      }
}
