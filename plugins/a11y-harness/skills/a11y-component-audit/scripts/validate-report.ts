import { findRgaaCriterion, findWcagCriterion, type RgaaReference, type WcagReference } from './find-criterion.ts'

const UNKNOWN_CRITERION = 'unknown-criterion'
const WRONG_LEVEL = 'wrong-level'
const QUOTE_MISMATCH = 'quote-mismatch'
const RGAA_STANDARD = 'rgaa-4.1.2'

export type Finding = {
  criterion: string
  level?: string
  quote: string
}

export type Report = {
  standard: string
  findings: Finding[]
}

export type References = {
  wcag: WcagReference
  rgaa: RgaaReference
}

export type Problem = {
  criterion: string
  problem: string
}

const wcagProblems = (wcag: WcagReference) => (finding: Finding): string[] => {
  const official = findWcagCriterion(wcag, finding.criterion)
  return official === null
    ? [UNKNOWN_CRITERION]
    : [
        ...(official.level === finding.level ? [] : [WRONG_LEVEL]),
        ...(official.title === finding.quote ? [] : [QUOTE_MISMATCH]),
      ]
}

const rgaaProblems = (rgaa: RgaaReference) => (finding: Finding): string[] => {
  const official = findRgaaCriterion(rgaa, finding.criterion)
  if (official === null) {
    return [UNKNOWN_CRITERION]
  }
  return official.title === finding.quote ? [] : [QUOTE_MISMATCH]
}

export function validateReport(report: Report, references: References): Problem[] {
  const problemsOf = report.standard === RGAA_STANDARD ? rgaaProblems(references.rgaa) : wcagProblems(references.wcag)
  return report.findings.flatMap((finding) =>
    problemsOf(finding).map((problem) => ({ criterion: finding.criterion, problem })),
  )
}
