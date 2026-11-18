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

  it.each([`rm -rf src; ${SCRIPTS} lookup rgaa-4.1.2 11.1`, `${SCRIPTS} lookup rgaa-4.1.2 11.1 && rm -rf src`])(
    'denies the reviewer an audit command chained with another one: %s',
    (command) => {
      expect(guardCommand(bashCall(command, REVIEWER))).not.toBeNull()
    },
  )

  it('denies the reviewer another program that takes an audit command as its arguments', () => {
    expect(guardCommand(bashCall(`rm -rf src ${SCRIPTS} lookup rgaa-4.1.2 11.1`, REVIEWER))).not.toBeNull()
  })

  it('lets the reviewer validate a report given inline, whose quotes hold parentheses', () => {
    const report = '{"standard":"rgaa-4.1.2","findings":[{"criterion":"11.10","quote":"(hors cas particuliers) ?"}]}'

    expect(guardCommand(bashCall(`${SCRIPTS} validate '${report}' src/Form.tsx`, REVIEWER))).toBeNull()
  })

  it('denies the reviewer an inline validation followed by another command', () => {
    const report = '{"standard":"wcag-2.2","findings":[]}'

    expect(guardCommand(bashCall(`${SCRIPTS} validate '${report}' && rm -rf src`, REVIEWER))).not.toBeNull()
  })
})
