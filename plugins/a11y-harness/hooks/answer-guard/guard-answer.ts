import type { CriterionId, Standard } from '../../skills/a11y-component-audit/scripts/standard.ts'
import { unopenedCriteria } from '../../skills/a11y-component-audit/scripts/validate-report.ts'
import { citedCriteria } from './cited-criteria.ts'
import { openedCriteria } from './opened-criteria.ts'
import { readsAForm } from './read-forms.ts'
import type { Transcript } from './transcript.ts'
import { unverifiedTestFiles } from './unverified-tests.ts'

const BLOCK_DECISION = 'block'
const UNOPENED_REASON = 'The answer cites criteria that the inventory of the audited form did not open:'
const UNAUDITED_REASON =
  'The answer rules on criteria of a form that no audit inventoried. Audit the form with the a11y-component-audit skill, or hand several components to the a11y-reviewer agent, and answer from their validated reports.'
const UNVERIFIED_REASON = 'These accessibility tests were written without being checked by verify-tests:'
const VERIFY_TESTS = 'Run verify-tests on each of them, with the conforming and faulty variants, and fix the tests until it prints [], before answering.'
const WHAT_TO_DO =
  'Remove them from the answer: the audit only reports the criteria of its validated reports, never as a possibility.'

const unopenedIn = (answer: string, opened: CriterionId[], standard: Standard, criteria: CriterionId[]) =>
  opened.length === 0
    ? []
    : unopenedCriteria(citedCriteria(answer, standard), opened, criteria).map((problem) => problem.criterion)

export type AnswerCheck = {
  answer: string
  transcript: Transcript
  tableCriteria: Record<Standard, CriterionId[]>
  formSignals: RegExp[]
  stopHookActive: boolean
}

export const guardAnswer = ({ answer, transcript, tableCriteria, formSignals, stopHookActive }: AnswerCheck) => {
  const unopened = (Object.entries(tableCriteria) as [Standard, CriterionId[]][]).flatMap(([standard, criteria]) =>
    unopenedIn(answer, openedCriteria(transcript, standard), standard, criteria),
  )
  if (stopHookActive) {
    return null
  }
  if (unopened.length > 0) {
    return { decision: BLOCK_DECISION, reason: `${UNOPENED_REASON} ${unopened.join()}. ${WHAT_TO_DO}` }
  }
  const unverified = [unverifiedTestFiles(transcript)].flat()
  if (unverified.length > 0) {
    return { decision: BLOCK_DECISION, reason: `${UNVERIFIED_REASON} ${unverified.join()}. ${VERIFY_TESTS}` }
  }
  return readsAForm(transcript, formSignals) ? { decision: BLOCK_DECISION, reason: UNAUDITED_REASON } : null
}
