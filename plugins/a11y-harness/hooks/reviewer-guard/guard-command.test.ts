import { describe, expect, it } from 'vitest'
import { guardCommand } from './guard-command.ts'

const REVIEWER = 'a11y-harness:a11y-reviewer'
const SCRIPTS = 'node "/home/dev/.claude/plugins/a11y-harness/skills/a11y-component-audit/scripts/main.ts"'
const bashCall = (command: string, agentType?: string) => ({ agent_type: agentType, tool_input: { command } })

describe('guardCommand', () => {
  it('denies a command of the reviewer that could change a file', () => {
    expect(guardCommand(bashCall('rm -rf src', REVIEWER))).toMatchObject({
      hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny' },
    })
  })

  it('leaves the commands of other agents and of the main conversation alone', () => {
    expect(guardCommand(bashCall('rm -rf src'))).toBeNull()
  })

  it.each([`${SCRIPTS} lookup rgaa-4.1.2 11.1`, `${SCRIPTS} inventory wcag-2.2 src/LoginForm.tsx`])(
    'lets the reviewer run the audit command %s',
    (command) => {
      expect(guardCommand(bashCall(command, REVIEWER))).toBeNull()
    },
  )
})
