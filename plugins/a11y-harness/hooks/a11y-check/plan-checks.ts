import { extname, sep } from 'node:path'
import { RGAA_STANDARD, type Standard, WCAG_STANDARD } from '../../skills/a11y-component-audit/scripts/standard.ts'

const WATCHED_TOOLS = ['Write', 'Edit']
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx']
const VARIANTS_FOLDER = `${sep}a11y-variants${sep}`

export type ToolEvent = {
  tool_name: string
  tool_input: { file_path: string }
  cwd: string
}

export type CheckPlan = {
  filePath: string
  cwd: string
  standard: Standard
}

export function planChecks(event: ToolEvent, requestedStandard?: string): CheckPlan | null {
  const filePath = event.tool_input.file_path
  const isWatched =
    WATCHED_TOOLS.includes(event.tool_name) &&
    COMPONENT_EXTENSIONS.includes(extname(filePath)) &&
    !filePath.includes(VARIANTS_FOLDER)
  return isWatched ? { filePath, cwd: event.cwd, standard: requestedStandard === RGAA_STANDARD ? RGAA_STANDARD : WCAG_STANDARD } : null
}
