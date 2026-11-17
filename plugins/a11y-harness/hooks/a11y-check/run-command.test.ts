import { realpathSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { describe, expect, it } from 'vitest'
import { runCommand } from './run-command.ts'

const NODE = process.execPath
const WORKING_DIR = realpathSync(tmpdir())
const TIME_LIMIT_MS = 5000

describe('runCommand', () => {
  it('returns the output of a command run in the given directory', async () => {
    const result = await runCommand(NODE, ['-e', 'process.stdout.write(process.cwd())'], WORKING_DIR, TIME_LIMIT_MS)

    expect(result).toEqual({ ok: true, stdout: WORKING_DIR })
  })
})
