const STANDARD_VERSION = /(?:RGAA|WCAG) \d\.\d/
const RGAA_CRITERION = /\d{1,2}\.\d{1,2}/g

export const citedCriteria = (answer: string, _standard: string) =>
  answer.split(STANDARD_VERSION).flatMap((part) => part.match(RGAA_CRITERION) ?? [])
