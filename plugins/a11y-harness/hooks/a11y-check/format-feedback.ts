export type LintError = {
  file: string
  line: number
  rule: string
  message: string
}

export type FailingTest = {
  name: string
  message: string
}

export type ToolFailure = {
  tool: string
  message: string
}

export type CheckResults = {
  lintErrors: LintError[]
  failingTests: FailingTest[]
  toolFailures: ToolFailure[]
}

export function formatFeedback(_results: CheckResults): string | null {
  return null
}
