import type { FailingTest, LintError } from './format-feedback.ts'

const FAILED_STATUS = 'failed'
const LINE_BREAK = '\n'

type BiomeDiagnostic = {
  message: string
  category: string
  location: { path: string; start: { line: number } }
}

type EslintFileReport = {
  filePath: string
  messages: { ruleId: string; message: string; line: number }[]
}

type JestFormatAssertion = {
  fullName: string
  status: string
  failureMessages: string[]
}

type JestFormatReport = {
  numTotalTests: number
  testResults: { assertionResults: JestFormatAssertion[] }[]
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

export function readEslintReport(report: string): LintError[] {
  const files: EslintFileReport[] = JSON.parse(report)
  return files.flatMap((file) =>
    file.messages.map((message) => ({
      file: file.filePath,
      line: message.line,
      rule: message.ruleId,
      message: message.message,
    })),
  )
}

export function readJestFormatReport(report: string): FailingTest[] {
  const { testResults }: JestFormatReport = JSON.parse(report)
  return testResults.flatMap((file) =>
    file.assertionResults
      .filter((assertion) => assertion.status === FAILED_STATUS)
      .map((assertion) => ({
        name: assertion.fullName,
        message: assertion.failureMessages.join(LINE_BREAK).split(LINE_BREAK)[0],
      })),
  )
}

type PackageManifest = {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
}

export function readDependencies(packageJson: string): string[] {
  const { dependencies = {}, devDependencies = {} }: PackageManifest = JSON.parse(packageJson)
  return [...Object.keys(dependencies), ...Object.keys(devDependencies)]
}

export function countJestFormatTests(report: string): number {
  const { numTotalTests }: JestFormatReport = JSON.parse(report)
  return numTotalTests
}
