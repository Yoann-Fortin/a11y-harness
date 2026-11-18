const WRITE_TESTS_INSTRUCTION =
  'No test covers this component: write its accessibility tests with the a11y-test-writer skill for the chosen standard, then make them pass.'

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
  untestedBy: string[]
}

export function formatFeedback(results: CheckResults): string | null {
  const isUntested = results.untestedBy.length > 0
  const hasFindings =
    results.lintErrors.length > 0 ||
    results.failingTests.length > 0 ||
    results.toolFailures.length > 0 ||
    isUntested
  if (!hasFindings) {
    return null
  }
  return JSON.stringify(isUntested ? { ...results, instruction: WRITE_TESTS_INSTRUCTION } : results)
}
