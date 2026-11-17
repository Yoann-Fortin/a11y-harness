import type { FailingTest, LintError } from './format-feedback.ts'

const FAILED_STATUS = 'failed'
const LINE_BREAK = '\n'

type BiomeDiagnostic = {
  message: string
  category: string
  location: { path: string; start: { line: number } }
}

type VitestAssertion = {
  fullName: string
  status: string
  failureMessages: string[]
}

type VitestReport = {
  testResults: { assertionResults: VitestAssertion[] }[]
}

export function readBiomeReport(report: string): LintError[] {
  const { diagnostics }: { diagnostics: BiomeDiagnostic[] } = JSON.parse(report)
  return diagnostics.map((diagnostic) => ({
    file: diagnostic.location.path,
    line: diagnostic.location.start.line,
    rule: diagnostic.category,
    message: diagnostic.message,
  }))
}

export function readVitestReport(report: string): FailingTest[] {
  const { testResults }: VitestReport = JSON.parse(report)
  return testResults
    .flatMap((file) => file.assertionResults)
    .filter((assertion) => assertion.status === FAILED_STATUS)
    .map((assertion) => ({
      name: assertion.fullName,
      message: assertion.failureMessages[0].split(LINE_BREAK)[0],
    }))
}
