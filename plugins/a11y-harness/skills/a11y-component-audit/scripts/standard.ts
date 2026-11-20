export const WCAG_STANDARD = 'wcag-2.2'
export const RGAA_STANDARD = 'rgaa-4.1.2'

export type Standard = typeof WCAG_STANDARD | typeof RGAA_STANDARD

export type WcagLevel = 'A' | 'AA' | 'AAA'

export type WcagReferenceLevel = WcagLevel | ''

export type CriterionId = `${number}.${number}` | `${number}.${number}.${number}`
