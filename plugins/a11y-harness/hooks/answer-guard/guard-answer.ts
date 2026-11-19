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

export const guardAnswer = ({ answer, transcript, tableCriteria, stopHookActive }: AnswerCheck) => {
  const unopened = Object.entries(tableCriteria).flatMap(([standard, criteria]) => {
    const opened = openedCriteria(transcript, standard)
    return opened.length === 0 ? [] : unopenedCriteria(citedCriteria(answer, standard), opened, criteria)
  })
  return stopHookActive || unopened.length === 0 ? null : { decision: BLOCK_DECISION, reason: unopened.map(({ criterion }) => criterion).join() }
}
