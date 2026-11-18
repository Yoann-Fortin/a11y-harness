import { text } from 'node:stream/consumers'
import { guardCommand } from './guard-command.ts'

const SILENCE = ''

const decisionFor = (input: string) => {
  try {
    return guardCommand(JSON.parse(input))
  } catch {
    return null
  }
}

const decision = decisionFor(await text(process.stdin))
process.stdout.write(decision === null ? SILENCE : JSON.stringify(decision))
