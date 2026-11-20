import { blocksOf } from './opened-criteria.ts'

export const readsAForm = (transcript: string[], formSignals: string[]) =>
  blocksOf(transcript).some((block) => formSignals.some((signal) => new RegExp(signal).test(String(block.content))))
