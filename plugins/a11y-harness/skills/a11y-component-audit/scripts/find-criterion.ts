const WCAG_STANDARD = 'wcag-2.2'
const UNDERSTANDING_URL = 'https://www.w3.org/WAI/WCAG22/Understanding/'
const UNDERSTANDING_EXTENSION = '.html'
const RGAA_STANDARD = 'rgaa-4.1.2'
const NUMBER_SEPARATOR = '.'

export type WcagTechniques = Record<string, unknown>

type WcagSuccessCriterion = {
  id: string
  num: string
  handle: string
  title: string
  level: string
  techniques?: WcagTechniques
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
  techniques: WcagTechniques
}

type RgaaCriterium = {
  number: number
  title: string
  tests: Record<string, string[]>
}

export type RgaaReference = {
  topics: { number: number; criteria: { criterium: RgaaCriterium }[] }[]
}

export type RgaaCriterion = {
  standard: string
  id: string
  title: string
  tests: Record<string, string[]>
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
        techniques: criterion.techniques ?? {},
      }
}

export function findRgaaCriterion(reference: RgaaReference, id: string): RgaaCriterion | null {
  const [topicNumber, criterionNumber] = id.split(NUMBER_SEPARATOR).map(Number)
  const criterion = reference.topics
    .filter((topic) => topic.number === topicNumber)
    .flatMap((topic) => topic.criteria)
    .map((entry) => entry.criterium)
    .find((criterium) => criterium.number === criterionNumber)
  return criterion === undefined
    ? null
    : {
        standard: RGAA_STANDARD,
        id,
        title: criterion.title,
        tests: Object.fromEntries(
          Object.entries(criterion.tests).map(([test, lines]) => [`${id}${NUMBER_SEPARATOR}${test}`, lines]),
        ),
      }
}
