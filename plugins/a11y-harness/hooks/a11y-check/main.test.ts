import { execFile } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const REPO_DIR = join(import.meta.dirname, '../../../..')
const HOOK = join(import.meta.dirname, 'main.ts')
const LOGIN_FORM = join(REPO_DIR, 'playground/src/login-form/LoginForm.tsx')
const FIXTURE_DIR = join(REPO_DIR, 'playground/src/a11y-check-fixture')
const FIXTURE = join(FIXTURE_DIR, 'Fixture.tsx')
const FIXTURE_COMPONENT = 'export const Fixture = () => <input type="email" />\n'
const FIXTURE_TEST = [
  "import { render, screen } from '@testing-library/react'",
  "import { expect, it } from 'vitest'",
  "import { Fixture } from './Fixture'",
  '',
  "it('names the email field', () => {",
  '  render(<Fixture />)',
  "  expect(screen.queryByRole('textbox', { name: /email/i })).toBeInTheDocument()",
  '})',
  '',
].join('\n')
const END_TO_END_TIME_LIMIT_MS = 60_000

const runHook = async (filePath: string) => {
  const child = execFileAsync(process.execPath, [HOOK])
  child.child.stdin?.end(JSON.stringify({ tool_name: 'Write', tool_input: { file_path: filePath }, cwd: REPO_DIR }))
  const { stdout } = await child
  return stdout
}

describe('a11y-check hook, end to end on the playground', () => {
  afterEach(async () => {
    await rm(FIXTURE_DIR, { recursive: true, force: true })
  })

  it(
    'stays silent on the accessible login form',
    async () => {
      expect(await runHook(LOGIN_FORM)).toBe('')
    },
    END_TO_END_TIME_LIMIT_MS,
  )

  it(
    'asks Claude to fix a component whose test fails',
    async () => {
      await mkdir(dirname(FIXTURE), { recursive: true })
      await writeFile(FIXTURE, FIXTURE_COMPONENT)
      await writeFile(join(FIXTURE_DIR, 'Fixture.test.tsx'), FIXTURE_TEST)

      const output = JSON.parse(await runHook(FIXTURE))

      expect(output.decision).toBe('block')
      expect(JSON.parse(output.reason).failingTests).toEqual([
        { name: 'names the email field', message: expect.any(String) },
      ])
    },
    END_TO_END_TIME_LIMIT_MS,
  )
})
