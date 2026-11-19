const RGAA_CRITERION = /\d{1,2}\.\d/g

export const citedCriteria = (answer: string, _standard: string) => answer.match(RGAA_CRITERION)
