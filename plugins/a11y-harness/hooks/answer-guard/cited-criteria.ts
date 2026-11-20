import { type CriterionId, type Standard, WCAG_STANDARD } from '../../skills/a11y-component-audit/scripts/standard.ts'

const STANDARD_VERSION = /(?:RGAA|WCAG) \d\.\d/
const RGAA_CRITERION = /\d{1,2}\.\d{1,2}/g
const WCAG_CRITERION = /\d\.\d\.\d/g

export const citedCriteria = (answer: string, standard: Standard): CriterionId[] =>
  answer
    .split(STANDARD_VERSION)
    .flatMap((part) => (part.match(standard === WCAG_STANDARD ? WCAG_CRITERION : RGAA_CRITERION) ?? []) as CriterionId[])
