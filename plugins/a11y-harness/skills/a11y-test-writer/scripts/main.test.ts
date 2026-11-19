import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { afterEach, describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const REPO_DIR = join(import.meta.dirname, '../../../../..')
const SCRIPTS = join(import.meta.dirname, 'main.ts')
const FIXTURE_DIR = join(REPO_DIR, 'playground/src/verify-tests-fixture')
const COMPONENT = join(FIXTURE_DIR, 'Filter.tsx')
const TEST_FILE = join(FIXTURE_DIR, 'Filter.test.tsx')
const WITH_LABEL = join(FIXTURE_DIR, 'with-label.variant.tsx')
const END_TO_END_TIME_LIMIT_MS = 120_000
const TEXT_ENCODING = 'utf8'

const NAMED_BY_ARIA_LABEL = 'export const Filter = () => <input type="text" aria-label="Filtrer les produits" />\n'
const LABELLED = [
  'export const Filter = () => (',
  '  <>',
  '    <label htmlFor="filter">Filtrer les produits</label>',
  '    <input id="filter" type="text" />',
  '  </>',
  ')',
  '',
].join('\n')
const SHOWS_ITS_LABEL = [
  "import { render, screen } from '@testing-library/react'",
  "import { expect, it } from 'vitest'",
  "import { Filter } from './Filter'",
  '',
  "it('shows the label of the field', () => {",
  '  render(<Filter />)',
  "  expect(screen.queryByText(/filtrer les produits/i)).toBeInTheDocument()",
  '})',
  '',
].join('\n')

const writeFixture = async (component: string, test: string, variant: string) => {
  await mkdir(FIXTURE_DIR, { recursive: true })
  await writeFile(COMPONENT, component)
  await writeFile(TEST_FILE, test)
  await writeFile(WITH_LABEL, variant)
}

const verify = async (...args: string[]) => {
  const { stdout } = await execFileAsync(process.execPath, [SCRIPTS, 'verify-tests', ...args])
  return JSON.parse(stdout)
}

describe('verify-tests, end to end on the playground', () => {
  afterEach(async () => {
    await rm(FIXTURE_DIR, { recursive: true, force: true })
  })

  it(
    'accepts tests that pass every conforming variant and fail the faulty one, and puts the component back',
    async () => {
      await writeFixture(NAMED_BY_ARIA_LABEL, SHOWS_ITS_LABEL, LABELLED)

      expect(await verify(TEST_FILE, COMPONENT, '--conforming', WITH_LABEL, '--faulty', COMPONENT)).toEqual([])
      expect(await readFile(COMPONENT, TEXT_ENCODING)).toBe(NAMED_BY_ARIA_LABEL)
    },
    END_TO_END_TIME_LIMIT_MS,
  )

  it('reports no test runner when the package names one that is not installed', async () => {
    const projectDir = await mkdtemp(join(tmpdir(), 'a11y-verify-uninstalled-'))
    await writeFile(join(projectDir, 'package.json'), JSON.stringify({ devDependencies: { vitest: '^5.1.1' } }))
    await writeFile(join(projectDir, 'Filter.tsx'), NAMED_BY_ARIA_LABEL)
    const component = join(projectDir, 'Filter.tsx')

    const { stdout } = await execFileAsync(process.execPath, [
      SCRIPTS,
      'verify-tests',
      join(projectDir, 'Filter.test.tsx'),
      component,
      '--faulty',
      component,
    ]).catch((error: { stdout: string }) => error)
    await rm(projectDir, { recursive: true, force: true })

    expect(JSON.parse(stdout)).toEqual([{ problem: 'no-test-runner' }])
  })
})
