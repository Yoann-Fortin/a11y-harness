import type { FailingTest, LintError } from './format-feedback.ts'

const FAILED_STATUS = 'failed'
const LINE_BREAK = '\n'
const TITLE_SEPARATOR = ' '
const ESCAPE_CHARACTER = String.fromCharCode(27)
const COLOUR_CODES = new RegExp(`${ESCAPE_CHARACTER}\\[[0-9;]*m`, 'g')
const NOTHING = ''

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

type PlaywrightSpec = { title: string; ok: boolean; tests: { results: { errors: { message: string }[] }[] }[] }
type PlaywrightSuite = { title: string; specs: PlaywrightSpec[]; suites?: PlaywrightSuite[] }
type PlaywrightReport = {
  suites: PlaywrightSuite[]
  stats: { expected: number; unexpected: number; flaky: number; skipped: number }
}

const firstErrorOf = (spec: PlaywrightSpec) =>
  spec.tests
    .flatMap((test) => test.results)
    .flatMap((result) => result.errors)
    .map((error) => error.message.replace(COLOUR_CODES, NOTHING))
    .join(LINE_BREAK)
    .split(LINE_BREAK)[0]

const failuresIn = (suite: PlaywrightSuite, titles: string[]): FailingTest[] => [
  ...suite.specs
    .filter((spec) => !spec.ok)
    .map((spec) => ({ name: [...titles, spec.title].join(TITLE_SEPARATOR), message: firstErrorOf(spec) })),
  ...(suite.suites ?? []).flatMap((child) => failuresIn(child, [...titles, child.title])),
]

export function readPlaywrightReport(report: string): FailingTest[] {
  const { suites }: PlaywrightReport = JSON.parse(report)
  try {
    return suites.flatMap((file) => failuresIn(file, []))
  } catch {
    return []
  }
}

export function countPlaywrightTests(report: string): number {
  const { stats }: PlaywrightReport = JSON.parse(report)
  return stats.expected + stats.unexpected + stats.flaky + stats.skipped
}
