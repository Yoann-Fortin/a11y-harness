import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { text } from 'node:stream/consumers'
import { chooseTools } from './choose-tools.ts'
import { findPackageRoot } from './find-package-root.ts'
import { handleEvent } from './handle-event.ts'
import { readDependencies } from './read-reports.ts'
import { runChecks } from './run-checks.ts'
import { runCommand } from './run-command.ts'

const STANDARD_OPTION = 'CLAUDE_PLUGIN_OPTION_STANDARD'
const REPORT_DIR_PREFIX = 'a11y-check-'
const REPORT_FILE = 'report.json'
const PACKAGE_FILE = 'package.json'
const TEXT_ENCODING = 'utf8'
const NO_DEPENDENCIES: string[] = []

const readText = (path: string) => readFile(path, TEXT_ENCODING)
const dependenciesOf = (cwd: string) =>
  readText(join(cwd, PACKAGE_FILE)).then(readDependencies, () => NO_DEPENDENCIES)

const reportDir = await mkdtemp(join(tmpdir(), REPORT_DIR_PREFIX))
const output = await handleEvent(await text(process.stdin), process.env[STANDARD_OPTION], {
  packageRootOf: (filePath) => findPackageRoot(filePath, existsSync),
  check: async (plan) =>
    runChecks(plan, {
      run: runCommand,
      readText,
      reportFile: join(reportDir, REPORT_FILE),
      ...chooseTools(await dependenciesOf(plan.cwd)),
    }),
})
await rm(reportDir, { recursive: true, force: true })
process.stdout.write(output)
