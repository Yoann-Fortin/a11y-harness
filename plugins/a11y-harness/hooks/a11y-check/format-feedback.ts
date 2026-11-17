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

export function formatFeedback(results: CheckResults): string | null {
  const hasFindings =
    results.lintErrors.length > 0 ||
    results.failingTests.length > 0
  return hasFindings ? JSON.stringify(results) : null
}
