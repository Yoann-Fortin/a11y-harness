export type BashCall = {
  agent_type?: string
  tool_input: { command: string }
}

export const guardCommand = (_call: BashCall) => ({
  hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny' },
})
