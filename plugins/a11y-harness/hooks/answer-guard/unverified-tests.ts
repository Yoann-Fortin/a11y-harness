import { blocksOf } from './opened-criteria.ts'

const TEST_FILE = /\.test\./

export const unverifiedTestFiles = (transcript: string[]) =>
  blocksOf(transcript)
    .map((block) => String({ ...block.input }.file_path))
    .filter((file) => TEST_FILE.test(file))
