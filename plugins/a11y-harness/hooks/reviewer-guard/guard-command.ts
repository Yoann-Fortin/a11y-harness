const REVIEWER_SUFFIX = 'a11y-reviewer'
const READ_ONLY_REASON =
  'The a11y-reviewer agent is read-only: it may only run the node commands of the a11y-component-audit skill, and git diff, git log or git show without --output, each on its own.'
const SINGLE_QUOTED = /'[^']*'/g
const SHELL_OPERATOR = /[;&|<>`$()]/
const OUTPUT_OPTION = /--output/
const READ_ONLY_GIT = /^git (?:diff|log|show) /
const AUDIT_COMMAND = /^node "[^"]*\/skills\/a11y-component-audit\/scripts\/main\.ts" (?:lookup|validate|inventory) /

const isReadOnlyCommand = (command: string) =>
  (AUDIT_COMMAND.test(command) || (READ_ONLY_GIT.test(command) && !OUTPUT_OPTION.test(command))) &&
  !command.split(SINGLE_QUOTED).some((unquoted) => SHELL_OPERATOR.test(unquoted))

export type BashCall = {
  agent_type?: string
  tool_input: { command: string }
}

export const guardCommand = (call: BashCall) =>
  String(call.agent_type).endsWith(REVIEWER_SUFFIX) && !isReadOnlyCommand(call.tool_input.command)
    ? {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'deny',
          permissionDecisionReason: READ_ONLY_REASON,
        },
      }
    : null
