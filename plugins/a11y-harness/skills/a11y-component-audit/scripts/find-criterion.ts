const WCAG_STANDARD = 'wcag-2.2'
const WCAG_VERSION = '2.2'
const UNDERSTANDING_URL = 'https://www.w3.org/WAI/WCAG22/Understanding/'
const UNDERSTANDING_EXTENSION = '.html'
const RGAA_STANDARD = 'rgaa-4.1.2'
const NUMBER_SEPARATOR = '.'
const REQUIREMENT_SEPARATOR = ':'

export type WcagTechniques = Record<string, unknown>

type WcagSuccessCriterion = {
  id: string
  num: string
  handle: string
  title: string
  level: string
  versions: string[]
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

type RgaaCriteriumReferences = { wcag?: string[]; techniques?: string[] }[]

type RgaaCriterium = {
  number: number
  title: string
  tests: Record<string, string[]>
  references: RgaaCriteriumReferences
}

export type RgaaReference = {
  topics: { number: number; criteria: { criterium: RgaaCriterium }[] }[]
}

export type RgaaCriterion = {
  standard: string
  id: string
  title: string
  tests: Record<string, string[]>
  references: { wcag: string[]; techniques: string[] }
}

export function findWcagCriteria(reference: WcagReference, id: string): WcagCriterion[] {
  return reference.principles.flatMap((principle) =>
    principle.guidelines.flatMap((guideline) =>
      guideline.successcriteria
        .filter((successCriterion) => successCriterion.num === id && successCriterion.versions.includes(WCAG_VERSION))
        .map((criterion) => ({
          standard: WCAG_STANDARD,
          id: criterion.num,
          handle: criterion.handle,
          title: criterion.title,
          level: criterion.level,
          understanding: `${UNDERSTANDING_URL}${criterion.id}${UNDERSTANDING_EXTENSION}`,
          techniques: criterion.techniques ?? {},
        })),
    ),
  )
}

export function findRgaaCriteria(reference: RgaaReference, id: string): RgaaCriterion[] {
  const [topicNumber, criterionNumber] = id.split(NUMBER_SEPARATOR).map(Number)
  return reference.topics
    .filter((topic) => topic.number === topicNumber)
    .flatMap((topic) =>
      topic.criteria
        .filter(({ criterium }) => criterium.number === criterionNumber)
        .map(({ criterium }) => ({
          standard: RGAA_STANDARD,
          id,
          title: criterium.title,
          tests: Object.assign(
            {},
            ...Object.entries(criterium.tests).map(([test, lines]) => ({ [`${id}${NUMBER_SEPARATOR}${test}`]: lines })),
          ),
          references: {
            wcag: criterium.references.flatMap((reference) => reference.wcag ?? []),
            techniques: criterium.references.flatMap((reference) => reference.techniques ?? []),
          },
        })),
    )
}

export type RgaaMethodologies = Record<string, string>

export function findRgaaMethodologies(
  methodologies: RgaaMethodologies,
  criterion: Pick<RgaaCriterion, 'tests'>,
): RgaaMethodologies {
  return Object.fromEntries(
    Object.entries(methodologies).filter(([test]) => Object.keys(criterion.tests).includes(test)),
  )
}

type ActRequirement = { forConformance?: boolean; secondary?: string }

export type ActReference = {
  'act-rules': {
    deprecated: boolean
    proposed: boolean
    frontmatter: { id: string; accessibility_requirements: Record<string, ActRequirement> | null }
  }[]
}

export function findActRules({ 'act-rules': rules }: ActReference, id: string): string[] {
  return rules
    .filter((rule) => !rule.deprecated && !rule.proposed)
    .filter((rule) =>
      Object.entries(rule.frontmatter.accessibility_requirements ?? {}).some(
        ([requirement, mapping]) =>
          requirement.split(REQUIREMENT_SEPARATOR)[1] === id && mapping.forConformance === true,
      ),
    )
    .map((rule) => rule.frontmatter.id)
}
