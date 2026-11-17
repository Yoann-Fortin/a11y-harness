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
  return { filePath, cwd: event.cwd }
}
