import { basename } from 'node:path'
import { blocksOf } from './opened-criteria.ts'

const WRITE_TOOL = 'Write'
const TEST_WRITER_SKILL = 'a11y-test-writer'
const VERIFY_COMMAND = ' verify-tests '
const TEST_FILE = /\.(?:test|spec)\.[jt]sx?$/

export const unverifiedTestFiles = (transcript: string[]) => {
  const blocks = blocksOf(transcript)
  const usedTestWriter = blocks.some((block) => String({ ...block.input }.skill).endsWith(TEST_WRITER_SKILL))
  const verifyCommands = blocks
    .filter((block) => String({ ...block.input }.command).includes(VERIFY_COMMAND))
    .map((block) => ({ ...block.input }).command)
  return blocks
    .filter((block) => usedTestWriter && block.name === WRITE_TOOL)
    .map((block) => String({ ...block.input }.file_path))
    .filter((file) => TEST_FILE.test(file) && !verifyCommands.some((command) => String(command).includes(basename(file))))
}
