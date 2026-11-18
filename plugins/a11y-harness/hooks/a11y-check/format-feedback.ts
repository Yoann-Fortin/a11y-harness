const AUDIT_REQUEST =
  'This file holds a form: audit it with the a11y-component-audit skill for the chosen standard, together with the components rendered inside it.'
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

export type FileReview = CheckResults & {
  holdsForm: boolean
}

export function formatFeedback(review: FileReview): string | null {
  const isUntested = review.untestedBy.length > 0
  const hasFindings =
    review.lintErrors.length > 0 ||
    review.failingTests.length > 0 ||
    review.toolFailures.length > 0 ||
    isUntested ||
    review.holdsForm
  if (!hasFindings) {
    return null
  }
  return JSON.stringify({
    ...review,
    ...(isUntested ? { instruction: WRITE_TESTS_INSTRUCTION } : {}),
    ...(review.holdsForm ? { audit: AUDIT_REQUEST } : {}),
  })
}
