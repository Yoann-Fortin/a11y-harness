import { describe, expect, it } from 'vitest'
import { guardAnswer } from './guard-answer.ts'

const INVENTORY = 'node "/plugins/a11y-harness/skills/a11y-component-audit/scripts/main.ts" inventory rgaa-4.1.2 src/Form.tsx'
const TOGGLE_INVENTORY = '[{"element":"script-button","criteria":["7.1","7.3"]}]'
const TABLE_CRITERIA = { 'rgaa-4.1.2': ['7.1', '7.3', '11.9'], 'wcag-2.2': ['4.1.2'] }

const toolUse = (id: string, command: string) =>
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id, name: 'Bash', input: { command } }] } })
const toolResult = (id: string, content: string) =>
  JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content }] } })
const AUDITED_TOGGLE = [toolUse('toolu_1', INVENTORY), toolResult('toolu_1', TOGGLE_INVENTORY)]

describe('guardAnswer', () => {
  it('sends back an answer that cites a criterion of the table that the inventory did not open', () => {
    const answer = 'The toggle fails 7.1, and many auditors would also fail 11.9.'

    expect(
      guardAnswer({ answer, transcript: AUDITED_TOGGLE, tableCriteria: TABLE_CRITERIA, stopHookActive: false }),
    ).toMatchObject({ decision: 'block', reason: expect.stringContaining('11.9') })
  })
})
