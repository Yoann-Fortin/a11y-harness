const TOOL_RESULT = 'tool_result'

type Block = { type: string; content?: string }
type Entry = { message: { content: Block[] } }
type InventoryElement = { criteria: string[] }

export const openedCriteria = (transcript: string[], _standard: string) =>
  transcript
    .map((line): Entry => JSON.parse(line))
    .flatMap((entry) => entry.message.content)
    .filter((block) => block.type === TOOL_RESULT)
    .flatMap((block): InventoryElement[] => JSON.parse(String(block.content)))
    .flatMap((element) => element.criteria)
