import {
  type ActReference,
  findActRules,
  findRgaaCriteria,
  findWcagCriteria,
  type RgaaReference,
  type WcagReference,
} from './find-criterion.ts'
import { type CriterionId, RGAA_STANDARD, type Standard, WCAG_STANDARD, type WcagLevel } from './standard.ts'

const UNKNOWN_CRITERION = 'unknown-criterion'
const WRONG_LEVEL = 'wrong-level'
const QUOTE_MISMATCH = 'quote-mismatch'
const UNRELATED_EVIDENCE = 'unrelated-evidence'
const MISSING_CRITERION = 'missing-criterion'
const UNOPENED_CRITERION = 'unopened-criterion'
const TECHNIQUE_ID_OPENING = '"id":"'
const TECHNIQUE_ID_CLOSING = '"'
const NO_BREAK_SPACES = ['\u00a0', '\u202f']
const SPACE = ' '

export type Finding = {
  criterion?: CriterionId
  level?: WcagLevel
  quote: string
  evidence?: string[]
}

type ProblemCode =
  | typeof UNKNOWN_CRITERION
  | typeof WRONG_LEVEL
  | typeof QUOTE_MISMATCH
  | typeof UNRELATED_EVIDENCE
  | typeof MISSING_CRITERION
  | typeof UNOPENED_CRITERION

export type Report = {
  standard: Standard
  findings: Finding[]
}

export type References = {
  wcag: WcagReference
  rgaa: RgaaReference
  act: ActReference
}

export type Problem = {
  criterion: CriterionId
  problem: ProblemCode
  evidence?: string
}

type CheckedFinding = Finding & { criterion: CriterionId }

type Checks = Problem[][]

const unknownCriterion = (finding: CheckedFinding, officials: object[]): Problem[] =>
  officials.length === 0 ? [{ criterion: finding.criterion, problem: UNKNOWN_CRITERION }] : []

const mismatch = (finding: CheckedFinding, isExact: boolean, problem: ProblemCode): Problem[] =>
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

const STANDARD_CHECKS = [
  { standard: WCAG_STANDARD, checks: wcagChecks },
  { standard: RGAA_STANDARD, checks: rgaaChecks },
]

export function validateReport(report: Report, references: References): Problem[] {
  return report.findings
    .filter((finding): finding is CheckedFinding => finding.criterion !== undefined)
    .flatMap((finding) =>
      STANDARD_CHECKS.filter(({ standard }) => standard === report.standard).flatMap(({ checks }) => checks(finding, references)),
    )
    .flat()
}

export const missingCriteria = (report: Report, expected: CriterionId[]): Problem[] =>
  expected
    .filter((criterion) => !report.findings.map((finding) => finding.criterion).includes(criterion))
    .map((criterion) => ({ criterion, problem: MISSING_CRITERION }))

export const unopenedCriteria = (
  cited: (CriterionId | undefined)[],
  opened: CriterionId[],
  tableCriteria: CriterionId[],
): Problem[] =>
  cited
    .filter(
      (criterion): criterion is CriterionId =>
        tableCriteria.some((inTable) => inTable === criterion) && !opened.some((inInventory) => inInventory === criterion),
    )
    .map((criterion) => ({ criterion, problem: UNOPENED_CRITERION }))

export type Inventory = { opened: CriterionId[]; tableCriteria: CriterionId[] }

export const reportProblems = (report: Report, references: References, inventory: Inventory): Problem[] => [
  ...validateReport(report, references),
  ...missingCriteria(report, inventory.opened),
  ...unopenedCriteria(
    report.findings.map(({ criterion }) => criterion),
    inventory.opened,
    inventory.tableCriteria,
  ),
]
