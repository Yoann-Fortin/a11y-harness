import { execFile } from 'node:child_process'
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const SCRIPTS = join(import.meta.dirname, 'main.ts')
const FAILURE_EXIT_CODE = 1
const LABELS_TITLE = 'Labels or instructions are provided when content requires user input.'

const run = async (...args: string[]) => {
  const { stdout } = await execFileAsync(process.execPath, [SCRIPTS, ...args])
  return JSON.parse(stdout)
}

const LOGIN_FIELD = '<form>\n  <label htmlFor="email">Adresse e-mail</label>\n  <input id="email" type="email" autoComplete="email" />\n</form>\n'

const TOGGLE = '<button type="button" aria-pressed={isVisible}>\n'

const writeComponent = async (source: string) => {
  const path = join(await mkdtemp(join(tmpdir(), 'a11y-component-')), 'Component.tsx')
  await writeFile(path, source)
  return path
}

const writeReport = async (finding: object) => {
  const path = join(await mkdtemp(join(tmpdir(), 'a11y-report-')), 'report.json')
  await writeFile(path, JSON.stringify({ standard: 'wcag-2.2', findings: [finding] }))
  return path
}

describe('skill scripts, on the official reference files', () => {
  it('quotes the official title and level of a WCAG 2.2 success criterion', async () => {
    expect(await run('lookup', 'wcag-2.2', '3.3.2')).toMatchObject({ title: LABELS_TITLE, level: 'A' })
  })

  it('quotes the official tests of an RGAA 4.1.2 criterion', async () => {
    const criterion = await run('lookup', 'rgaa-4.1.2', '11.10')

    expect(criterion.tests['11.10.1'][0]).toMatch(/^Les \[indications du caractère obligatoire\]/)
  })

  it('gives the official methodology of each test of an RGAA 4.1.2 criterion', async () => {
    const criterion = await run('lookup', 'rgaa-4.1.2', '11.1')

    expect(criterion.methodologies).toMatchObject({
      '11.1.3': expect.stringMatching(/^1\. Retrouver dans le document les champs de formulaire dont l’étiquette n’est pas visible/),
    })
  })

  it('fails on a criterion that does not exist', async () => {
    await expect(run('lookup', 'rgaa-4.1.2', '99.1')).rejects.toMatchObject({ code: FAILURE_EXIT_CODE, stdout: 'null' })
  })

  it('accepts a report whose findings match the official criteria', async () => {
    const report = await writeReport({ criterion: '3.3.2', level: 'A', quote: LABELS_TITLE })

    expect(await run('validate', report)).toEqual([])
  })

  it('accepts a report given inline', async () => {
    const report = JSON.stringify({ standard: 'wcag-2.2', findings: [{ criterion: '3.3.2', level: 'A', quote: LABELS_TITLE }] })

    expect(await run('validate', report)).toEqual([])
  })

  it('rejects a report that misstates a criterion', async () => {
    const report = await writeReport({ criterion: '3.3.2', level: 'AA', quote: LABELS_TITLE })

    await expect(run('validate', report)).rejects.toMatchObject({
      code: FAILURE_EXIT_CODE,
      stdout: JSON.stringify([{ criterion: '3.3.2', problem: 'wrong-level' }]),
    })
  })

  it('lists the form elements of a component with their criteria, from the criteria table', async () => {
    const component = await writeComponent(LOGIN_FIELD)

    expect(await run('inventory', 'wcag-2.2', component)).toContainEqual({
      element: 'form-field',
      criteria: ['1.3.1', '2.4.6', '2.5.3', '3.3.2', '4.1.2'],
    })
  })

  it('lists the elements of the components rendered inside the form', async () => {
    const form = await writeComponent(LOGIN_FIELD)
    const toggle = await writeComponent(TOGGLE)

    expect(await run('inventory', 'rgaa-4.1.2', form, toggle)).toContainEqual({ element: 'script-button', criteria: ['7.1', '7.3'] })
  })

  it('rejects a report that leaves out a criterion of the inventory of the component', async () => {
    const report = await writeReport({ criterion: '3.3.2', level: 'A', quote: LABELS_TITLE })
    const component = await writeComponent(LOGIN_FIELD)

    await expect(run('validate', report, component)).rejects.toMatchObject({
      code: FAILURE_EXIT_CODE,
      stdout: expect.stringContaining(JSON.stringify({ criterion: '4.1.2', problem: 'missing-criterion' })),
    })
  })
})
