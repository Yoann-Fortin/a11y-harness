import { describe, expect, it } from 'vitest'
import { formatFeedback } from './format-feedback.ts'

const NO_RESULTS = { lintErrors: [], failingTests: [], toolFailures: [] }
const LINT_ERROR = {
  file: 'src/Form.tsx',
  line: 3,
  rule: 'lint/a11y/useAltText',
  message: 'Provide a text alternative.',
}
const readFeedback = (feedback: string | null) => (feedback === null ? null : JSON.parse(feedback))

describe('formatFeedback', () => {
  it('gives no feedback when every check passes', () => {
    expect(formatFeedback(NO_RESULTS)).toBeNull()
  })

  it('reports a lint error', () => {
    const results = { ...NO_RESULTS, lintErrors: [LINT_ERROR] }

    expect(readFeedback(formatFeedback(results))).toEqual(results)
  })
})
