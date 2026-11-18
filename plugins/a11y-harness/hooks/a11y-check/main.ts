import { existsSync } from 'node:fs'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { text } from 'node:stream/consumers'
import { findPackageRoot } from './find-package-root.ts'
import { handleEvent } from './handle-event.ts'
import { BIOME } from './lint-tools.ts'
import { runChecks } from './run-checks.ts'
import { runCommand } from './run-command.ts'
import { VITEST } from './test-tools.ts'

const STANDARD_OPTION = 'CLAUDE_PLUGIN_OPTION_STANDARD'
const REPORT_DIR_PREFIX = 'a11y-check-'
const REPORT_FILE = 'vitest.json'
const TEXT_ENCODING = 'utf8'

const reportDir = await mkdtemp(join(tmpdir(), REPORT_DIR_PREFIX))
const output = await handleEvent(await text(process.stdin), process.env[STANDARD_OPTION], {
  packageRootOf: (filePath) => findPackageRoot(filePath, existsSync),
  check: (plan) =>
    runChecks(plan, {
      run: runCommand,
      readText: (path) => readFile(path, TEXT_ENCODING),
      reportFile: join(reportDir, REPORT_FILE),
      linters: [BIOME],
      testRunners: [VITEST],
    }),
})
await rm(reportDir, { recursive: true, force: true })
process.stdout.write(output)
