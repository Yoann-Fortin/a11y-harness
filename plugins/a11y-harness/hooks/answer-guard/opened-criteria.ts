const INVENTORY_COMMAND = ' inventory '

type Block = { type: string; id?: string; tool_use_id?: string; input?: { command?: string }; content?: string }
type Entry = { message: { content: Block[] } }
type InventoryElement = { criteria: string[] }

const blocksOf = (transcript: string[]) =>
  transcript.map((line): Entry => JSON.parse(line)).flatMap((entry) => entry.message.content)

const inventoriedCriteria = (transcript: string[], standard: string) => {
  const blocks = blocksOf(transcript)
  const inventoryIds = blocks
    .filter((block) => String(block.input?.command).includes(`${INVENTORY_COMMAND}${standard} `))
    .map((block) => block.id)
  return blocks
    .filter((block) => inventoryIds.includes(block.tool_use_id))
    .flatMap((block): InventoryElement[] => JSON.parse(String(block.content)))
    .flatMap((element) => element.criteria)
}

export const openedCriteria = (transcript: string[], standard: string): string[] => {
  try {
    return inventoriedCriteria(transcript, standard)
  } catch {
    return []
  }
}
