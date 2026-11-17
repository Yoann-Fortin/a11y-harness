import { type ExecFileException, execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export type CommandResult = { ok: true; stdout: string } | { ok: false; failure: string }

export async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs: number,
): Promise<CommandResult> {
  try {
    const { stdout } = await execFileAsync(command, args, { cwd, timeout: timeoutMs })
    return { ok: true, stdout }
  } catch (error) {
    const failure = error as ExecFileException & { stdout: string }
    const couldNotRun = failure.killed || typeof failure.code === 'string'
    return couldNotRun ? { ok: false, failure: failure.message } : { ok: true, stdout: failure.stdout }
  }
}
