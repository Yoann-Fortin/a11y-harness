import { type CheckResults, formatFeedback } from './format-feedback.ts'
import { type CheckPlan, planChecks, type ToolEvent } from './plan-checks.ts'

const SILENCE = ''
const BLOCK_DECISION = 'block'

export type HookPorts = {
  packageRootOf: (filePath: string) => string | null
  check: (plan: CheckPlan) => Promise<CheckResults>
}

const planFrom = (
  rawInput: string,
  requestedStandard: string | undefined,
  packageRootOf: HookPorts['packageRootOf'],
): CheckPlan | null => {
  try {
    const event: ToolEvent = JSON.parse(rawInput)
    return planChecks({ ...event, cwd: packageRootOf(event.tool_input.file_path) ?? event.cwd }, requestedStandard)
  } catch {
    return null
  }
}

export async function handleEvent(
  rawInput: string,
  requestedStandard: string | undefined,
  ports: HookPorts,
): Promise<string> {
  const plan = planFrom(rawInput, requestedStandard, ports.packageRootOf)
  if (plan === null) {
    return SILENCE
  }
  const feedback = formatFeedback(await ports.check(plan))
  return feedback === null ? SILENCE : JSON.stringify({ decision: BLOCK_DECISION, reason: feedback })
}
