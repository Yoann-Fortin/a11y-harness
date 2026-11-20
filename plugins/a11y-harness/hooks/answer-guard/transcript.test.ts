import { describe, expect, it } from 'vitest'
import { transcriptOf } from './transcript.ts'

const TOOL_RESULT = JSON.stringify({
  type: 'user',
  message: { content: [{ type: 'tool_result', tool_use_id: 'toolu_1', content: '[]' }] },
})

describe('transcriptOf', () => {
  it('reads nothing from a transcript it cannot parse, so that the answer goes through', () => {
    expect(transcriptOf(['{"type":"assistant","message":', TOOL_RESULT])).toEqual([])
  })
})
