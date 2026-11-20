import { basename } from 'node:path'
import { blocksOf } from './opened-criteria.ts'

const SKILL_TOOL = 'Skill'
const TEST_FILE = /\.test\./

export const unverifiedTestFiles = (transcript: string[]) => {
  const blocks = blocksOf(transcript)
  const usedSkill = blocks.some((block) => block.name === SKILL_TOOL)
  const commands = blocks.map((block) => String({ ...block.input }.command))
  return blocks
    .filter(() => usedSkill)
    .map((block) => String({ ...block.input }.file_path))
    .filter((file) => TEST_FILE.test(file) && !commands.some((command) => command.includes(basename(file))))
}
