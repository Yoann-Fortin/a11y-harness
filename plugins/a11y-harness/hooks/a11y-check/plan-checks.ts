import { extname } from 'node:path'

const WATCHED_TOOLS = ['Write', 'Edit']
const COMPONENT_EXTENSION = '.tsx'

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
  const isWatched = WATCHED_TOOLS.includes(event.tool_name) && extname(filePath) === COMPONENT_EXTENSION
  return isWatched ? { filePath, cwd: event.cwd } : null
}
