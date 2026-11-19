import { unopenedCriteria } from '../../skills/a11y-component-audit/scripts/validate-report.ts'
import { citedCriteria } from './cited-criteria.ts'
import { openedCriteria } from './opened-criteria.ts'

const BLOCK_DECISION = 'block'

export type AnswerCheck = {
  answer: string
  transcript: string[]
  tableCriteria: Record<string, string[]>
  stopHookActive: boolean
}

export const guardAnswer = ({ answer, transcript, tableCriteria }: AnswerCheck) => {
  const unopened = Object.entries(tableCriteria).flatMap(([standard, criteria]) =>
    unopenedCriteria(citedCriteria(answer, standard), openedCriteria(transcript, standard), criteria),
  )
  return unopened.length === 0 ? null : { decision: BLOCK_DECISION, reason: unopened.map(({ criterion }) => criterion).join() }
}
