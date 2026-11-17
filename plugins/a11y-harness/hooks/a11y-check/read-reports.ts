import type { LintError } from './format-feedback.ts'

type BiomeDiagnostic = {
  message: string
  category: string
  location: { path: string; start: { line: number } }
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
