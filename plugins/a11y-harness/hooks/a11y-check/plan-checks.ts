import { extname, sep } from 'node:path'
import { STANDARDS, type Standard, WCAG_STANDARD } from '../../skills/a11y-component-audit/scripts/standard.ts'
import type { ComponentFile } from './files.ts'

const WATCHED_TOOLS = ['Write', 'Edit']
const COMPONENT_EXTENSIONS = ['.tsx', '.jsx']
const VARIANTS_FOLDER = `${sep}a11y-variants${sep}`
const DEFAULT_STANDARD = WCAG_STANDARD

export type ToolEvent = {
  tool_name: string
  tool_input: { file_path: string }
  cwd: string
}

export type CheckPlan = {
  filePath: ComponentFile
  cwd: string
  standard: Standard
}

const isComponentFile = (filePath: string): filePath is ComponentFile => COMPONENT_EXTENSIONS.includes(extname(filePath))

export function planChecks(event: ToolEvent, requestedStandard?: string): CheckPlan | null {
  const filePath = event.tool_input.file_path
  const isWatched =
    WATCHED_TOOLS.includes(event.tool_name) &&
    isComponentFile(filePath) &&
    !filePath.includes(VARIANTS_FOLDER)
  return isWatched ? { filePath, cwd: event.cwd, standard: STANDARDS.find((standard) => standard === requestedStandard) ?? DEFAULT_STANDARD } : null
}
