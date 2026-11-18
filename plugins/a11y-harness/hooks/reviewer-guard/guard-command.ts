const REVIEWER_SUFFIX = 'a11y-reviewer'

export type BashCall = {
  agent_type?: string
  tool_input: { command: string }
}

export const guardCommand = (call: BashCall) =>
  String(call.agent_type).endsWith(REVIEWER_SUFFIX)
    ? { hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny' } }
    : null
