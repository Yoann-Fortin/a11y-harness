const AUDIT_REQUEST =
  'This file holds a form: audit it with the a11y-component-audit skill for the chosen standard, together with the components rendered inside it. Report the failures and their fixes, and apply a fix only with the agreement of the user.'
const FAILING_TESTS_RULE =
  'Existing tests fail: change the new code so that they pass again, and do not change a test. If a test freezes a behaviour that the accessibility standard does not accept, ask the user before changing it, and explain why it must change.'
const WRITE_TESTS_INSTRUCTION =
  'No test covers this component. Offer the user to write its accessibility tests with the a11y-test-writer skill for the chosen standard, and write them only with their agreement.'

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
  withoutTestRunner: boolean
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
    ...(review.failingTests.length > 0 ? { failingTestsRule: FAILING_TESTS_RULE } : {}),
    ...(isUntested ? { instruction: WRITE_TESTS_INSTRUCTION } : {}),
    ...(review.holdsForm ? { audit: AUDIT_REQUEST } : {}),
  })
}
