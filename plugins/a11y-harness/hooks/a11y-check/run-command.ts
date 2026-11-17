import { execFile } from 'node:child_process'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)

export type CommandResult = { ok: true; stdout: string } | { ok: false; failure: string }

export async function runCommand(
  command: string,
  args: string[],
  cwd: string,
  _timeoutMs: number,
): Promise<CommandResult> {
  const { stdout } = await execFileAsync(command, args, { cwd })
  return { ok: true, stdout }
}
