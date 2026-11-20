const INVENTORY_COMMAND = ' inventory '

type Block = {
  type: string
  id?: string
  name?: string
  tool_use_id?: string
  input?: { command?: string; file_path?: string; skill?: string }
  content?: string
}
type Entry = { message?: { content?: Block[] | string } }
type MessageEntry = { message: { content: Block[] } }
type InventoryElement = { criteria: string[] }

export const blocksOf = (transcript: string[]) =>
  transcript
    .map((line): Entry => JSON.parse(line))
    .filter((entry): entry is MessageEntry => Array.isArray(entry.message?.content))
    .flatMap((entry) => entry.message.content)

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
