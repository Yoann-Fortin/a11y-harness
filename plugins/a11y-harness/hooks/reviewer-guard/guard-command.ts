const REVIEWER_SUFFIX = 'a11y-reviewer'
const AUDIT_COMMAND = /node "[^"]*\/skills\/a11y-component-audit\/scripts\/main\.ts" (?:lookup|validate|inventory) /

export type BashCall = {
  agent_type?: string
  tool_input: { command: string }
}

export const guardCommand = (call: BashCall) =>
  String(call.agent_type).endsWith(REVIEWER_SUFFIX) && !AUDIT_COMMAND.test(call.tool_input.command)
    ? { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny' } }
    : null
