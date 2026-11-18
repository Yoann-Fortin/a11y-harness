import { describe, expect, it } from 'vitest'
import { formatFeedback } from './format-feedback.ts'

const NO_RESULTS = { lintErrors: [], failingTests: [], toolFailures: [], untestedBy: [], holdsForm: false }
const LINT_ERROR = {
  file: 'src/Form.tsx',
  line: 3,
  rule: 'lint/a11y/useAltText',
  message: 'Provide a text alternative.',
}
const FAILING_TEST = { name: 'Form > names the email field', message: 'Unable to find the textbox' }
const TOOL_FAILURE = { tool: 'vitest', message: 'command not found' }
const readFeedback = (feedback: string | null) => (feedback === null ? null : JSON.parse(feedback))

describe('formatFeedback', () => {
  it('gives no feedback when every check passes', () => {
    expect(formatFeedback(NO_RESULTS)).toBeNull()
  })

  it('reports a lint error', () => {
    const results = { ...NO_RESULTS, lintErrors: [LINT_ERROR] }

    expect(readFeedback(formatFeedback(results))).toEqual(results)
  })

  it('reports a failing test', () => {
    const results = { ...NO_RESULTS, failingTests: [FAILING_TEST] }

    expect(readFeedback(formatFeedback(results))).toEqual({ ...results, failingTestsRule: expect.any(String) })
  })

  it('reports a tool that could not run', () => {
    const results = { ...NO_RESULTS, toolFailures: [TOOL_FAILURE] }

    expect(readFeedback(formatFeedback(results))).toEqual(results)
  })

  it('asks for accessibility tests written with the test-writing skill when no test covers the file', () => {
    const results = { ...NO_RESULTS, untestedBy: ['vitest'] }

    expect(readFeedback(formatFeedback(results))).toEqual({
      ...results,
      instruction: expect.stringContaining('a11y-test-writer'),
    })
  })

  it('asks for an audit with the audit skill when the file holds a form', () => {
    const results = { ...NO_RESULTS, holdsForm: true }

    expect(readFeedback(formatFeedback(results))).toEqual({
      ...results,
      audit: expect.stringContaining('a11y-component-audit'),
    })
  })

  it('asks Claude to write the tests only with the agreement of the user', () => {
    const feedback = readFeedback(formatFeedback({ ...NO_RESULTS, untestedBy: ['vitest'] }))

    expect(feedback.instruction).toMatch(/only with (?:the|their) agreement/)
  })

  it('asks Claude to apply the fixes of the audit only with the agreement of the user', () => {
    const feedback = readFeedback(formatFeedback({ ...NO_RESULTS, holdsForm: true }))

    expect(feedback.audit).toMatch(/only with (?:the|their) agreement/)
  })

  it('asks Claude to keep the existing tests and to ask the user, explaining why, before changing one', () => {
    const feedback = readFeedback(formatFeedback({ ...NO_RESULTS, failingTests: [FAILING_TEST] }))

    expect(feedback.failingTestsRule).toMatch(/do not change a test[\s\S]*ask the user[\s\S]*why/i)
  })
})
