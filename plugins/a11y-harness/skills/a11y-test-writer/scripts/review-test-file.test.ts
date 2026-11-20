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

  it('flags an assertion inside a loop or a condition, which may check nothing, and accepts one outside', () => {
    const source = [
      "it('names each label', () => {",
      '  for (const label of visibleLabels(field)) {',
      '    expect(label).toBeVisible()',
      '  }',
      '  if (field.title !== "") {',
      '    title = field.title',
      '  }',
      "  labels.forEach((label) => expect(label).toBeVisible())",
      '  if (hasError) expect(alert).toBeVisible()',
      '  expect(field).toBeVisible()',
      '})',
    ].join('\n')

    expect(testFileProblems(source)).toEqual([
      { problem: 'assertion-in-loop-or-condition', line: 2 },
      { problem: 'assertion-in-loop-or-condition', line: 8 },
      { problem: 'assertion-in-loop-or-condition', line: 9 },
    ])
  })
})
