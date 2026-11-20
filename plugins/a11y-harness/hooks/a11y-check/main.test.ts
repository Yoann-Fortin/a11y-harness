import { execFile } from 'node:child_process'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const REPO_DIR = join(import.meta.dirname, '../../../..')
const HOOK = join(import.meta.dirname, 'main.ts')
const LOGIN_FORM = join(REPO_DIR, 'playground/src/login-form/LoginForm.tsx')
const VISIBILITY_TOGGLE = join(REPO_DIR, 'playground/src/login-form/PasswordVisibilityToggle.tsx')
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
const BARE_PACKAGE_DIR = join(REPO_DIR, 'playground/src/a11y-check-bare-package')
const BARE_COMPONENT = join(BARE_PACKAGE_DIR, 'Bare.tsx')
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
    await rm(BARE_PACKAGE_DIR, { recursive: true, force: true })
  })

  it(
    'stays silent on an accessible component that holds no form',
    async () => {
      expect(await runHook(VISIBILITY_TOGGLE)).toBe('')
    },
    END_TO_END_TIME_LIMIT_MS,
  )

  it(
    'asks for an audit of the login form, although its checks pass',
    async () => {
      const output = JSON.parse(await runHook(LOGIN_FORM))

      expect(JSON.parse(output.reason)).toMatchObject({
        lintErrors: [],
        failingTests: [],
        holdsForm: true,
        audit: expect.stringContaining('a11y-component-audit'),
      })
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

  it(
    'offers a test runner that tests in a browser to a package that uses none of the supported ones',
    async () => {
      await mkdir(BARE_PACKAGE_DIR, { recursive: true })
      await writeFile(join(BARE_PACKAGE_DIR, 'package.json'), '{}')
      await writeFile(BARE_COMPONENT, FIXTURE_COMPONENT)

      const output = JSON.parse(await runHook(BARE_COMPONENT))

      expect(output.decision).toBe('block')
      expect(JSON.parse(output.reason)).toMatchObject({ withoutTestRunner: true, testRunnerOffer: expect.any(String) })
    },
    END_TO_END_TIME_LIMIT_MS,
  )
})
