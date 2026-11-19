import { BIOME, ESLINT, type LintTool } from './lint-tools.ts'
import { JEST, PLAYWRIGHT, type TestTool, VITEST } from './test-tools.ts'

const LINTERS = [BIOME, ESLINT]
const TEST_RUNNERS = [VITEST, JEST, PLAYWRIGHT]

export type ToolChoice = {
  linters: LintTool[]
  testRunners: TestTool[]
}

export function chooseTools(dependencies: string[]): ToolChoice {
  return {
    linters: LINTERS.filter((linter) => dependencies.includes(linter.package)),
    testRunners: TEST_RUNNERS.filter((testRunner) => dependencies.includes(testRunner.package)),
  }
}
