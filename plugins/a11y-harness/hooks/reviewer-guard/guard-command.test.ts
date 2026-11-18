import { describe, expect, it } from 'vitest'
import { guardCommand } from './guard-command.ts'

const REVIEWER = 'a11y-harness:a11y-reviewer'
const bashCall = (command: string, agentType?: string) => ({ agent_type: agentType, tool_input: { command } })

describe('guardCommand', () => {
  it('denies a command of the reviewer that could change a file', () => {
    expect(guardCommand(bashCall('rm -rf src', REVIEWER))).toMatchObject({
      hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny' },
    })
  })
})
