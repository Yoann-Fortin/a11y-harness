const LINE_BREAK = '\n'
const ROLE_QUERY_WITHOUT_NAME = /\b(?:get|query|find)(?:All)?ByRole\((['"`])[^'"`]*\1\)/
const ROLE_WITHOUT_NAME_PROBLEM = 'role-query-without-name'

export type TestFileProblem = { problem: string; line: number }

export const testFileProblems = (source: string): TestFileProblem[] =>
  source
    .split(LINE_BREAK)
    .flatMap((text, index) => (ROLE_QUERY_WITHOUT_NAME.test(text) ? [{ problem: ROLE_WITHOUT_NAME_PROBLEM, line: index + 1 }] : []))
