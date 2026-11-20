import { type CriterionId, RGAA_STANDARD, type Standard, WCAG_STANDARD } from '../../skills/a11y-component-audit/scripts/standard.ts'

const STANDARD_VERSION = /(?:RGAA|WCAG) \d\.\d/
const CRITERION_PATTERNS: Record<Standard, RegExp> = {
  [WCAG_STANDARD]: /\d\.\d\.\d/g,
  [RGAA_STANDARD]: /\d{1,2}\.\d{1,2}/g,
}

export const citedCriteria = (answer: string, standard: Standard): CriterionId[] =>
  answer
    .split(STANDARD_VERSION)
    .flatMap((part) => (part.match(CRITERION_PATTERNS[standard]) ?? []) as CriterionId[])
