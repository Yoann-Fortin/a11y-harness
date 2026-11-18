import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const HOOK = join(import.meta.dirname, 'main.ts')

const runHook = async (input: object) => {
  const child = execFileAsync(process.execPath, [HOOK])
  child.child.stdin?.end(JSON.stringify(input))
  const { stdout } = await child
  return stdout
}

describe('reviewer-guard hook, end to end', () => {
  it('denies a command of the reviewer that could change a file', async () => {
    const output = await runHook({
      agent_type: 'a11y-harness:a11y-reviewer',
      tool_name: 'Bash',
      tool_input: { command: 'rm -rf src' },
    })

    expect(JSON.parse(output).hookSpecificOutput.permissionDecision).toBe('deny')
  })
})
