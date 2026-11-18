import { describe, expect, it } from 'vitest'
import { verifyVariants } from './verify-variants.ts'

const COMPONENT = 'src/ProductFilter.tsx'
const ORIGINAL = 'export const ProductFilter = () => <input aria-label="Filtrer" />'
const WITH_LABEL = 'with-label.tsx'
const LABELLED = 'export const ProductFilter = () => <><label htmlFor="q">Filtrer</label><input id="q" /></>'
const PLAN = {
  component: COMPONENT,
  variants: [
    { file: WITH_LABEL, kind: 'conforming' as const },
    { file: COMPONENT, kind: 'faulty' as const },
  ],
}

const RUNNER_CRASH = 'the test runner crashed'

const fakeProject = (passesOn: string[]) => {
  const files: Record<string, string> = { [COMPONENT]: ORIGINAL, [WITH_LABEL]: LABELLED }
  const tested: string[] = []
  return {
    files,
    tested,
    readText: async (path: string) => files[path] ?? '',
    writeText: async (path: string, content: string) => {
      files[path] = content
    },
    runTests: async () => {
      tested.push(files[COMPONENT] ?? '')
      return passesOn.includes(files[COMPONENT] ?? '')
    },
  }
}

describe('verifyVariants', () => {
  it('runs the tests on each variant in place of the component', async () => {
    const project = fakeProject([LABELLED])

    await verifyVariants(PLAN, project)

    expect(project.tested).toEqual([LABELLED, ORIGINAL])
  })

  it('reports a conforming variant that the tests reject', async () => {
    expect(await verifyVariants(PLAN, fakeProject([]))).toEqual([
      { variant: WITH_LABEL, problem: 'conforming-variant-rejected' },
    ])
  })

  it('puts the original component back once every variant has run', async () => {
    const project = fakeProject([LABELLED])

    await verifyVariants({ component: COMPONENT, variants: [{ file: WITH_LABEL, kind: 'conforming' }] }, project)

    expect(project.files[COMPONENT]).toBe(ORIGINAL)
  })

  it('puts the original component back even when the tests cannot run', async () => {
    const project = {
      ...fakeProject([]),
      runTests: async () => {
        throw new Error(RUNNER_CRASH)
      },
    }

    await expect(verifyVariants(PLAN, project)).rejects.toThrow(RUNNER_CRASH)
    expect(project.files[COMPONENT]).toBe(ORIGINAL)
  })
})
