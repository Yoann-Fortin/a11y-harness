import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chooseTools } from '../../../hooks/a11y-check/choose-tools.ts'
import { findPackageRoot } from '../../../hooks/a11y-check/find-package-root.ts'
import { readDependencies } from '../../../hooks/a11y-check/read-reports.ts'
import { runCommand } from '../../../hooks/a11y-check/run-command.ts'
import { passesTestFile } from './run-test-file.ts'
import { type VariantPlan, verifyVariants } from './verify-variants.ts'

const TEXT_ENCODING = 'utf8'
const PACKAGE_FILE = 'package.json'
const REPORT_DIR_PREFIX = 'a11y-verify-'
const REPORT_FILE = 'report.json'
const CONFORMING_FLAG = '--conforming'
const FAULTY_FLAG = '--faulty'
const NO_TEST_RUNNER = [{ problem: 'no-test-runner' }]
const SUCCESS_EXIT_CODE = 0
const FAILURE_EXIT_CODE = 1

const readText = (path: string) => readFile(path, TEXT_ENCODING)
const writeText = (path: string, content: string) => writeFile(path, content, TEXT_ENCODING)

const variantsOf = (args: string[]) => {
  let kind: VariantPlan['variants'][number]['kind'] = 'conforming'
  return args.flatMap((arg) => {
    if (arg === CONFORMING_FLAG || arg === FAULTY_FLAG) {
      kind = arg === CONFORMING_FLAG ? 'conforming' : 'faulty'
      return []
    }
    return [{ file: arg, kind }]
  })
}

const verifyTests = async ([testFile = '', component = '', ...variantArgs]: string[]) => {
  const cwd = findPackageRoot(component, existsSync) ?? process.cwd()
  const dependencies = await readText(join(cwd, PACKAGE_FILE)).then(readDependencies, () => [])
  const { testRunners } = chooseTools(dependencies)
  if (testRunners.length === 0) {
    return NO_TEST_RUNNER
  }
  const reportDir = await mkdtemp(join(tmpdir(), REPORT_DIR_PREFIX))
  try {
    const tools = { run: runCommand, readText, reportFile: join(reportDir, REPORT_FILE), testRunners }
    return await verifyVariants(
      { component, variants: variantsOf(variantArgs) },
      { readText, writeText, runTests: () => passesTestFile(testFile, cwd, tools) },
    )
  } finally {
    await rm(reportDir, { recursive: true, force: true })
  }
}

const COMMANDS: Record<string, (args: string[]) => Promise<object[]>> = { 'verify-tests': verifyTests }

const [command = '', ...args] = process.argv.slice(2)
const problems = (await COMMANDS[command]?.(args)) ?? null
process.exitCode = problems !== null && problems.length === 0 ? SUCCESS_EXIT_CODE : FAILURE_EXIT_CODE
process.stdout.write(JSON.stringify(problems))
