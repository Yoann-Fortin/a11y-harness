import { BIOME, type LintTool } from './lint-tools.ts'
import { type TestTool, VITEST } from './test-tools.ts'

const LINTERS = [BIOME]
const TEST_RUNNERS = [VITEST]

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
