import { basename } from 'node:path'
import type { TestFile } from '../a11y-check/files.ts'
import type { Transcript } from './transcript.ts'

const WRITE_TOOL = 'Write'
const TEST_WRITER_SKILL = 'a11y-test-writer'
const VERIFY_COMMAND = ' verify-tests '
const TEST_FILE = /\.(?:test|spec)\.[jt]sx?$/

const isTestFile = (file: string): file is TestFile => TEST_FILE.test(file)

export const unverifiedTestFiles = (transcript: Transcript): TestFile[] => {
  const usedTestWriter = transcript.some((block) => String({ ...block.input }.skill).endsWith(TEST_WRITER_SKILL))
  const verifyCommands = transcript
    .filter((block) => String({ ...block.input }.command).includes(VERIFY_COMMAND))
    .map((block) => ({ ...block.input }).command)
  return transcript
    .filter((block) => usedTestWriter && block.name === WRITE_TOOL)
    .map((block) => String({ ...block.input }.file_path))
    .filter(isTestFile)
    .filter((file) => !verifyCommands.some((command) => String(command).includes(basename(file))))
}
