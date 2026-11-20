import { blocksOf } from './opened-criteria.ts'

const READ_TOOL = 'Read'

export const readsAForm = (transcript: string[], formSignals: string[]) => {
  const blocks = blocksOf(transcript)
  const readIds = blocks.filter((block) => block.name === READ_TOOL).map((block) => block.id)
  return blocks
    .filter((block) => readIds.includes(block.tool_use_id))
    .some((block) => formSignals.some((signal) => new RegExp(signal).test(String(block.content))))
}
