import { describe, expect, it } from 'vitest'
import { testFileProblems } from './review-test-file.ts'

describe('testFileProblems', () => {
  it('flags a query by role without an accessible name, and accepts one with a name', () => {
    const source = [
      "const [field] = screen.getAllByRole('textbox')",
      "const button = screen.getByRole('button', { name: /se connecter/i })",
      "expect(screen.queryByRole('alert')).toBeInTheDocument()",
    ].join('\n')

    expect(testFileProblems(source)).toEqual([
      { problem: 'role-query-without-name', line: 1 },
      { problem: 'role-query-without-name', line: 3 },
    ])
  })
})
