const STANDARD_VERSION = /(?:RGAA|WCAG) \d\.\d/
const RGAA_CRITERION = /\d{1,2}\.\d{1,2}/g
const WCAG_CRITERION = /\d\.\d\.\d/g
const WCAG_STANDARD = 'wcag-2.2'

export const citedCriteria = (answer: string, standard: string) =>
  answer
    .split(STANDARD_VERSION)
    .flatMap((part) => part.match(standard === WCAG_STANDARD ? WCAG_CRITERION : RGAA_CRITERION) ?? [])
