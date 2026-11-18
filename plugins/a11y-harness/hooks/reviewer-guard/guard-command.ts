const REVIEWER_SUFFIX = 'a11y-reviewer'
const SHELL_OPERATOR = /[;&|<>`$()]/
const AUDIT_COMMAND = /node "[^"]*\/skills\/a11y-component-audit\/scripts\/main\.ts" (?:lookup|validate|inventory) /

const isPlainAuditCommand = (command: string) => AUDIT_COMMAND.test(command) && !SHELL_OPERATOR.test(command)

export type BashCall = {
  agent_type?: string
  tool_input: { command: string }
}

export const guardCommand = (call: BashCall) =>
  String(call.agent_type).endsWith(REVIEWER_SUFFIX) && !isPlainAuditCommand(call.tool_input.command)
    ? { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny' } }
    : null
