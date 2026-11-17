import { findRgaaCriterion, findWcagCriterion, type RgaaReference, type WcagReference } from './find-criterion.ts'

const UNKNOWN_CRITERION = 'unknown-criterion'
const WRONG_LEVEL = 'wrong-level'
const QUOTE_MISMATCH = 'quote-mismatch'
const UNRELATED_EVIDENCE = 'unrelated-evidence'
const RGAA_STANDARD = 'rgaa-4.1.2'

export type Finding = {
  criterion?: string
  level?: string
  quote: string
  evidence?: string[]
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
  evidence?: string
}

type CheckedFinding = Finding & { criterion: string }

type Issue = Omit<Problem, 'criterion'>

const issues = (...problems: string[]): Issue[] => problems.map((problem) => ({ problem }))

const unrelatedEvidence = (evidence: string[]): Issue[] =>
  evidence.map((item) => ({ problem: UNRELATED_EVIDENCE, evidence: item }))

const wcagProblems = (wcag: WcagReference) => (finding: CheckedFinding): Issue[] => {
  const official = findWcagCriterion(wcag, finding.criterion)
  return official === null
    ? issues(UNKNOWN_CRITERION)
    : [
        ...issues(...(official.level === finding.level ? [] : [WRONG_LEVEL])),
        ...issues(...(official.title === finding.quote ? [] : [QUOTE_MISMATCH])),
        ...unrelatedEvidence(finding.evidence ?? []),
      ]
}

const rgaaProblems = (rgaa: RgaaReference) => (finding: CheckedFinding): Issue[] => {
  const official = findRgaaCriterion(rgaa, finding.criterion)
  if (official === null) {
    return issues(UNKNOWN_CRITERION)
  }
  return issues(...(official.title === finding.quote ? [] : [QUOTE_MISMATCH]))
}

export function validateReport(report: Report, references: References): Problem[] {
  const problemsOf = report.standard === RGAA_STANDARD ? rgaaProblems(references.rgaa) : wcagProblems(references.wcag)
  return report.findings
    .filter((finding): finding is CheckedFinding => finding.criterion !== undefined)
    .flatMap((finding) => problemsOf(finding).map((issue) => ({ criterion: finding.criterion, ...issue })))
}
