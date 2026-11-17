import { execFile } from 'node:child_process'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { describe, expect, it } from 'vitest'

const execFileAsync = promisify(execFile)
const LOOKUP = join(import.meta.dirname, 'main.ts')
const NOT_FOUND_EXIT_CODE = 1

const lookUp = async (standard: string, id: string) => {
  const { stdout } = await execFileAsync(process.execPath, [LOOKUP, standard, id])
  return JSON.parse(stdout)
}

describe('criterion lookup, on the official reference files', () => {
  it('quotes the official title and level of a WCAG 2.2 success criterion', async () => {
    expect(await lookUp('wcag-2.2', '3.3.2')).toMatchObject({
      title: 'Labels or instructions are provided when content requires user input.',
      level: 'A',
    })
  })

  it('quotes the official tests of an RGAA 4.1.2 criterion', async () => {
    const criterion = await lookUp('rgaa-4.1.2', '11.10')

    expect(criterion.tests['11.10.1'][0]).toMatch(/^Les \[indications du caractère obligatoire\]/)
  })

  it('fails on a criterion that does not exist', async () => {
    await expect(lookUp('rgaa-4.1.2', '99.1')).rejects.toMatchObject({ code: NOT_FOUND_EXIT_CODE, stdout: 'null' })
  })
})
