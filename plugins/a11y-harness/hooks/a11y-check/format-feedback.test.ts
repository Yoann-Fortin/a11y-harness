import { describe, expect, it } from 'vitest'
import { formatFeedback } from './format-feedback.ts'

const NO_RESULTS = { lintErrors: [], failingTests: [], toolFailures: [] }

describe('formatFeedback', () => {
  it('gives no feedback when every check passes', () => {
    expect(formatFeedback(NO_RESULTS)).toBeNull()
  })
})
