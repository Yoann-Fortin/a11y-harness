import { basename } from 'node:path'
import type { Transcript } from './transcript.ts'

const WRITE_TOOL = 'Write'
const TEST_WRITER_SKILL = 'a11y-test-writer'
const VERIFY_COMMAND = ' verify-tests '
const TEST_FILE = /\.(?:test|spec)\.[jt]sx?$/

export const unverifiedTestFiles = (transcript: Transcript) => {
  const usedTestWriter = transcript.some((block) => String({ ...block.input }.skill).endsWith(TEST_WRITER_SKILL))
  const verifyCommands = transcript
    .filter((block) => String({ ...block.input }.command).includes(VERIFY_COMMAND))
    .map((block) => ({ ...block.input }).command)
  return transcript
    .filter((block) => usedTestWriter && block.name === WRITE_TOOL)
    .map((block) => String({ ...block.input }.file_path))
    .filter((file) => TEST_FILE.test(file) && !verifyCommands.some((command) => String(command).includes(basename(file))))
}
