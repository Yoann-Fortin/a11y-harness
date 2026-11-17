import { realpathSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { runCommand } from './run-command.ts'

const NODE = process.execPath
const WORKING_DIR = realpathSync(tmpdir())
const TIME_LIMIT_MS = 5000
const SHORT_TIME_LIMIT_MS = 200

describe('runCommand', () => {
  it('returns the output of a command run in the given directory', async () => {
    const result = await runCommand(NODE, ['-e', 'process.stdout.write(process.cwd())'], WORKING_DIR, TIME_LIMIT_MS)

    expect(result).toEqual({ ok: true, stdout: WORKING_DIR })
  })

  it('keeps the output of a command that exits with an error code', async () => {
    const result = await runCommand(
      NODE,
      ['-e', 'process.stdout.write("report"); process.exit(1)'],
      WORKING_DIR,
      TIME_LIMIT_MS,
    )

    expect(result).toEqual({ ok: true, stdout: 'report' })
  })

  it('reports a command that cannot be found', async () => {
    const result = await runCommand('a11y-check-missing-tool', [], WORKING_DIR, TIME_LIMIT_MS)

    expect(result).toEqual({ ok: false, failure: expect.any(String) })
  })

  it('runs commands without colours so their reports stay readable', async () => {
    const result = await runCommand(
      NODE,
      ['-e', 'process.stdout.write(process.env.NO_COLOR ?? "")'],
      WORKING_DIR,
      TIME_LIMIT_MS,
    )

    expect(result).toEqual({ ok: true, stdout: '1' })
  })

  it('stops a command that runs past the time limit', async () => {
    const result = await runCommand(NODE, ['-e', 'setTimeout(() => {}, 10000)'], WORKING_DIR, SHORT_TIME_LIMIT_MS)

    expect(result).toEqual({ ok: false, failure: expect.any(String) })
  })
})
