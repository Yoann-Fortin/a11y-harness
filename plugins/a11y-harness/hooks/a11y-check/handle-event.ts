import { type CheckResults, formatFeedback } from './format-feedback.ts'
import { type CheckPlan, planChecks, type ToolEvent } from './plan-checks.ts'

const SILENCE = ''
const BLOCK_DECISION = 'block'

export type HookPorts = {
  packageRootOf: (filePath: string) => string | null
  check: (plan: CheckPlan) => Promise<CheckResults>
}

const parseEvent = (rawInput: string): ToolEvent | null => {
  try {
    return JSON.parse(rawInput)
  } catch {
    return null
  }
}

export async function handleEvent(
  rawInput: string,
  _requestedStandard: string | undefined,
  ports: HookPorts,
): Promise<string> {
  const event = parseEvent(rawInput)
  if (event === null || typeof event.tool_input.file_path !== 'string') {
    return SILENCE
  }
  const plan = planChecks({ ...event, cwd: ports.packageRootOf(event.tool_input.file_path) ?? event.cwd })
  if (plan === null) {
    return SILENCE
  }
  const feedback = formatFeedback(await ports.check(plan))
  return feedback === null ? SILENCE : JSON.stringify({ decision: BLOCK_DECISION, reason: feedback })
}
