import type { CheckResults } from './format-feedback.ts'
import type { CheckPlan } from './plan-checks.ts'

export type HookPorts = {
  packageRootOf: (filePath: string) => string | null
  check: (plan: CheckPlan) => Promise<CheckResults>
}

export async function handleEvent(
  _rawInput: string,
  _requestedStandard: string | undefined,
  _ports: HookPorts,
): Promise<string> {
  return ''
}
