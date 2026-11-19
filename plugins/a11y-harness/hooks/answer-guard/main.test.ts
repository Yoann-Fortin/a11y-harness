import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const HOOK = join(import.meta.dirname, 'main.ts')
const INVENTORY = 'node "/plugins/a11y-harness/skills/a11y-component-audit/scripts/main.ts" inventory rgaa-4.1.2 components/PasswordField.tsx'
const TOGGLE_INVENTORY = '[{"element":"script-button","criteria":["7.1","7.3"]}]'

const toolUse = (id: string, command: string) =>
  JSON.stringify({ type: 'assistant', message: { content: [{ type: 'tool_use', id, name: 'Bash', input: { command } }] } })
const toolResult = (id: string, content: string) =>
  JSON.stringify({ type: 'user', message: { content: [{ type: 'tool_result', tool_use_id: id, content }] } })

const runHook = async (input: object) => {
  const child = execFileAsync(process.execPath, [HOOK])
  child.child.stdin?.end(JSON.stringify(input))
  const { stdout } = await child
  return stdout
}

describe('answer-guard hook, end to end', () => {
  it('sends back an answer citing a criterion that the reviewer agent did not open', async () => {
    const session = join(await mkdtemp(join(tmpdir(), 'a11y-answer-guard-')), 'session')
    await mkdir(join(session, 'subagents'), { recursive: true })
    await writeFile(`${session}.jsonl`, '')
    await writeFile(join(session, 'subagents', 'agent-1.jsonl'), [toolUse('toolu_1', INVENTORY), toolResult('toolu_1', TOGGLE_INVENTORY)].join('\n'))

    const output = await runHook({
      transcript_path: `${session}.jsonl`,
      last_assistant_message: 'The toggle fails 7.1, and many auditors would also fail 11.9.',
      stop_hook_active: false,
    })

    expect(JSON.parse(output)).toMatchObject({ decision: 'block', reason: expect.stringContaining('11.9') })
  })
})
