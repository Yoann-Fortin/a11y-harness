const RGAA_CRITERION = /\d{1,2}\.\d{1,2}/g

export const citedCriteria = (answer: string, _standard: string) => answer.match(RGAA_CRITERION)
