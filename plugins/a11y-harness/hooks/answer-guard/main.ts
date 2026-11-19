import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { text } from 'node:stream/consumers'
import type { CriteriaTable } from '../../skills/a11y-component-audit/scripts/inventory.ts'
import { guardAnswer } from './guard-answer.ts'

const TEXT_ENCODING = 'utf8'
const TRANSCRIPT_EXTENSION = '.jsonl'
const SUBAGENTS_DIR = 'subagents'
const LINE_BREAK = '\n'
const SILENCE = ''
const FORM_CRITERIA_FILE = join(import.meta.dirname, '../../skills/a11y-component-audit/reference/form-criteria.json')
const STANDARDS = ['wcag-2.2', 'rgaa-4.1.2']

type StopEvent = { transcript_path: string; last_assistant_message: string; stop_hook_active: boolean }

const readLines = async (path: string) =>
  (await readFile(path, TEXT_ENCODING).catch(() => '')).split(LINE_BREAK).filter((line) => line.trim() !== '')

const subagentTranscripts = async (transcriptPath: string) => {
  const dir = join(transcriptPath.slice(0, -TRANSCRIPT_EXTENSION.length), SUBAGENTS_DIR)
  const files = await readdir(dir).catch(() => [])
  return files.filter((file) => file.endsWith(TRANSCRIPT_EXTENSION)).map((file) => join(dir, file))
}

const tableCriteria = async () => {
  const table: CriteriaTable = JSON.parse(await readFile(FORM_CRITERIA_FILE, TEXT_ENCODING))
  return Object.fromEntries(
    STANDARDS.map((standard) => [standard, [...new Set(table.elements.flatMap(({ criteria }) => criteria[standard] ?? []))]]),
  )
}

const decisionFor = async (input: string) => {
  try {
    const event: StopEvent = JSON.parse(input)
    const files = [event.transcript_path, ...(await subagentTranscripts(event.transcript_path))]
    const transcript = (await Promise.all(files.map(readLines))).flat()
    return guardAnswer({
      answer: event.last_assistant_message,
      transcript,
      tableCriteria: await tableCriteria(),
      stopHookActive: event.stop_hook_active,
    })
  } catch {
    return null
  }
}

const decision = await decisionFor(await text(process.stdin))
process.stdout.write(decision === null ? SILENCE : JSON.stringify(decision))
