import type { CriterionId, Standard } from '../../skills/a11y-component-audit/scripts/standard.ts'
import type { Transcript } from './transcript.ts'

const INVENTORY_COMMAND = ' inventory '

type InventoryElement = { criteria: CriterionId[] }

const inventoriedCriteria = (transcript: Transcript, standard: Standard) => {
  const inventoryIds = transcript
    .filter((block) => String(block.input?.command).includes(`${INVENTORY_COMMAND}${standard} `))
    .map((block) => block.id)
  return transcript
    .filter((block) => inventoryIds.includes(block.tool_use_id))
    .flatMap((block): InventoryElement[] => JSON.parse(String(block.content)))
    .flatMap((element) => element.criteria)
}

export const openedCriteria = (transcript: Transcript, standard: Standard): CriterionId[] => {
  try {
    return inventoriedCriteria(transcript, standard)
  } catch {
    return []
  }
}
