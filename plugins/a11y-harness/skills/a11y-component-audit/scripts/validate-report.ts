import { findWcagCriterion, type WcagReference } from './find-criterion.ts'

const UNKNOWN_CRITERION = 'unknown-criterion'

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
}

export type Problem = {
  criterion: string
  problem: string
}

const wcagProblems = (wcag: WcagReference) => (finding: Finding): string[] => {
  const official = findWcagCriterion(wcag, finding.criterion)
  return official === null
    ? [UNKNOWN_CRITERION]
    : []
}

export function validateReport(report: Report, references: References): Problem[] {
  const problemsOf = wcagProblems(references.wcag)
  return report.findings.flatMap((finding) =>
    problemsOf(finding).map((problem) => ({ criterion: finding.criterion, problem })),
  )
}
