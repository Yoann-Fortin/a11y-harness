import { describe, expect, it } from 'vitest'
import { openedCriteria } from './opened-criteria.ts'

const RGAA = 'rgaa-4.1.2'
const INVENTORY_COMMAND = 'node "/plugins/a11y-harness/skills/a11y-component-audit/scripts/main.ts" inventory rgaa-4.1.2 src/Form.tsx'
const LOOKUP_COMMAND = 'node "/plugins/a11y-harness/skills/a11y-component-audit/scripts/main.ts" lookup rgaa-4.1.2 11.9'
const LOOKUP_RESULT = '{"standard":"rgaa-4.1.2","id":"11.9","tests":{}}'
const FIELD_INVENTORY = '[{"element":"form-field","criteria":["11.1","11.2"]}]'

const toolUse = (id: string, command: string) =>
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id, name: 'Bash', input: { command } }] } })
const toolResult = (id: string, content: string) =>
  JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content }] } })

describe('openedCriteria', () => {
  it('lists the criteria that an inventory run in the transcript opened', () => {
    const transcript = [toolUse('toolu_1', INVENTORY_COMMAND), toolResult('toolu_1', FIELD_INVENTORY)]

    expect(openedCriteria(transcript, RGAA)).toEqual(['11.1', '11.2'])
  })

  it('leaves out the results of the other commands', () => {
    const transcript = [
      toolUse('toolu_1', LOOKUP_COMMAND),
      toolResult('toolu_1', LOOKUP_RESULT),
      toolUse('toolu_2', INVENTORY_COMMAND),
      toolResult('toolu_2', FIELD_INVENTORY),
    ]

    expect(openedCriteria(transcript, RGAA)).toEqual(['11.1', '11.2'])
  })
})
