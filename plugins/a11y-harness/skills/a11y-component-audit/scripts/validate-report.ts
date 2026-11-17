import {
  type ActReference,
  findActRules,
  findRgaaCriteria,
  findWcagCriteria,
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
const NO_BREAK_SPACES = ['\u00a0', '\u202f']
const SPACE = ' '

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

type Checks = Problem[][]

const unknownCriterion = (finding: CheckedFinding, officials: object[]): Problem[] =>
  officials.length === 0 ? [{ criterion: finding.criterion, problem: UNKNOWN_CRITERION }] : []

const mismatch = (finding: CheckedFinding, isExact: boolean, problem: string): Problem[] =>
  isExact ? [] : [{ criterion: finding.criterion, problem }]

const unrelatedEvidence = (finding: CheckedFinding, isRelated: (item: string) => boolean): Problem[] =>
  (finding.evidence ?? [])
    .filter((item) => !isRelated(item))
    .map((evidence) => ({ criterion: finding.criterion, problem: UNRELATED_EVIDENCE, evidence }))

const withPlainSpaces = (text: string) =>
  NO_BREAK_SPACES.reduce((plain, noBreakSpace) => plain.replaceAll(noBreakSpace, SPACE), text)

const listsTechnique = (techniques: object, item: string) =>
  JSON.stringify(techniques).includes(`${TECHNIQUE_ID_OPENING}${item}${TECHNIQUE_ID_CLOSING}`)

const wcagChecks = (finding: CheckedFinding, { wcag, act }: References): Checks => {
  const officials = findWcagCriteria(wcag, finding.criterion)
  return [
    unknownCriterion(finding, officials),
    ...officials.flatMap((official) => [
      mismatch(finding, official.level === finding.level, WRONG_LEVEL),
      mismatch(finding, official.title === finding.quote, QUOTE_MISMATCH),
      unrelatedEvidence(
        finding,
        (item) => listsTechnique(official.techniques, item) || findActRules(act, official.id).includes(item),
      ),
    ]),
  ]
}

const rgaaChecks = (finding: CheckedFinding, { rgaa }: References): Checks => {
  const officials = findRgaaCriteria(rgaa, finding.criterion)
  return [
    unknownCriterion(finding, officials),
    ...officials.flatMap((official) => [
      mismatch(finding, withPlainSpaces(official.title) === withPlainSpaces(finding.quote), QUOTE_MISMATCH),
      unrelatedEvidence(
        finding,
        (item) => Object.keys(official.tests).includes(item) || official.references.techniques.includes(item),
      ),
    ]),
  ]
}

export function validateReport(report: Report, references: References): Problem[] {
  const checksOf = report.standard === RGAA_STANDARD ? rgaaChecks : wcagChecks
  return report.findings
    .filter((finding): finding is CheckedFinding => finding.criterion !== undefined)
    .flatMap((finding) => checksOf(finding, references))
    .flat()
}
