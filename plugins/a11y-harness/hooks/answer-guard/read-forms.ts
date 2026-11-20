import type { Transcript } from './transcript.ts'

const READ_TOOL = 'Read'

export const readsAForm = (transcript: Transcript, formSignals: RegExp[]) => {
  const readIds = transcript.filter((block) => block.name === READ_TOOL).map((block) => block.id)
  return transcript
    .filter((block) => readIds.includes(block.tool_use_id))
    .some((block) => formSignals.some((signal) => signal.test(String(block.content))))
}
