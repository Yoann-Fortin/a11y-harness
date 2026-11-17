import {
  type ActReference,
  findActRules,
  findRgaaCriterion,
  findWcagCriterion,
  type RgaaReference,
  type WcagReference,
} from './find-criterion.ts'

const UNKNOWN_CRITERION = 'unknown-criterion'
const WRONG_LEVEL = 'wrong-level'
const QUOTE_MISMATCH = 'quote-mismatch'
const UNRELATED_EVIDENCE = 'unrelated-evidence'
const RGAA_STANDARD = 'rgaa-4.1.2'
const TECHNIQUE_ID_OPENING = '"id":"'
const TECHNIQUE_ID_CLOSING = '"'

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
  act: ActReference
}

export type Problem = {
  criterion: string
  problem: string
  evidence?: string
}

type CheckedFinding = Finding & { criterion: string }

type Issue = Omit<Problem, 'criterion'>

const issues = (...problems: string[]): Issue[] => problems.map((problem) => ({ problem }))

const unrelatedEvidence = (evidence: string[], isRelated: (item: string) => boolean): Issue[] =>
  evidence.filter((item) => !isRelated(item)).map((item) => ({ problem: UNRELATED_EVIDENCE, evidence: item }))

const listsTechnique = (techniques: object) => {
  const serialized = JSON.stringify(techniques)
  return (item: string) => serialized.includes(`${TECHNIQUE_ID_OPENING}${item}${TECHNIQUE_ID_CLOSING}`)
}

const wcagProblems = (wcag: WcagReference, act: ActReference) => (finding: CheckedFinding): Issue[] => {
  const official = findWcagCriterion(wcag, finding.criterion)
  return official === null
    ? issues(UNKNOWN_CRITERION)
    : [
        ...issues(...(official.level === finding.level ? [] : [WRONG_LEVEL])),
        ...issues(...(official.title === finding.quote ? [] : [QUOTE_MISMATCH])),
        ...unrelatedEvidence(finding.evidence ?? [], (item) => {
          const isTechnique = listsTechnique(official.techniques)
          return isTechnique(item) || findActRules(act, official.id).includes(item)
        }),
      ]
}

const rgaaProblems = (rgaa: RgaaReference) => (finding: CheckedFinding): Issue[] => {
  const official = findRgaaCriterion(rgaa, finding.criterion)
  if (official === null) {
    return issues(UNKNOWN_CRITERION)
  }
  return [
    ...issues(...(official.title === finding.quote ? [] : [QUOTE_MISMATCH])),
    ...unrelatedEvidence(
      finding.evidence ?? [],
      (item) => Object.keys(official.tests).includes(item) || official.references.techniques.includes(item),
    ),
  ]
}

export function validateReport(report: Report, references: References): Problem[] {
  const problemsOf = report.standard === RGAA_STANDARD ? rgaaProblems(references.rgaa) : wcagProblems(references.wcag, references.act)
  return report.findings
    .filter((finding): finding is CheckedFinding => finding.criterion !== undefined)
    .flatMap((finding) => problemsOf(finding).map((issue) => ({ criterion: finding.criterion, ...issue })))
}
