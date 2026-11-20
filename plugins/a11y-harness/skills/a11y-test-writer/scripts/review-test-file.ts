const LINE_BREAK = '\n'
const OPENING_BRACE = '{'
const CLOSING_BRACE = '}'
const ROLE_QUERY_WITHOUT_NAME = /\b(?:get|query|find)(?:All)?ByRole\((['"`])[^'"`]*\1\)/
const LOOP_OR_CONDITION = /\b(?:if|for|while) \(|\.forEach\(/
const ASSERTION = /\bexpect\(/
const ROLE_WITHOUT_NAME_PROBLEM = 'role-query-without-name'
const ASSERTION_IN_LOOP_PROBLEM = 'assertion-in-loop-or-condition'

export type TestFileProblem = { problem: string; line: number }

const depthChangeOf = (text: string) => text.split(OPENING_BRACE).length - text.split(CLOSING_BRACE).length

const depthAfter = (lines: string[]) => lines.reduce((depth, text) => depth + depthChangeOf(text), 0)

const blockLengthOf = (lines: string[]) => lines.findIndex((_, index) => depthAfter(lines.slice(0, index + 1)) <= 0) + 1

const holdsAssertion = (lines: string[], start: number) =>
  lines.slice(start, start + blockLengthOf(lines.slice(start))).some((text) => ASSERTION.test(text))

export const testFileProblems = (source: string): TestFileProblem[] => {
  const lines = source.split(LINE_BREAK)
  return lines.flatMap((text, index) => [
    ...(ROLE_QUERY_WITHOUT_NAME.test(text) ? [{ problem: ROLE_WITHOUT_NAME_PROBLEM, line: index + 1 }] : []),
    ...(LOOP_OR_CONDITION.test(text) && holdsAssertion(lines, index)
      ? [{ problem: ASSERTION_IN_LOOP_PROBLEM, line: index + 1 }]
      : []),
  ])
}
