const WATCHED_TOOLS = ['Write', 'Edit']

export type ToolEvent = {
  tool_name: string
  tool_input: { file_path: string }
  cwd: string
}

export type CheckPlan = {
  filePath: string
  cwd: string
}

export function planChecks(event: ToolEvent): CheckPlan | null {
  const filePath = event.tool_input.file_path
  return WATCHED_TOOLS.includes(event.tool_name) ? { filePath, cwd: event.cwd } : null
}
