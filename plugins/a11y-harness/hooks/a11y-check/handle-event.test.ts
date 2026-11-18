import { describe, expect, it } from 'vitest'
import type { CheckResults } from './format-feedback.ts'
import { handleEvent } from './handle-event.ts'
import type { CheckPlan } from './plan-checks.ts'

const SESSION_DIR = '/repo'
const NO_RESULTS: CheckResults = { lintErrors: [], failingTests: [], toolFailures: [], untestedBy: [] }
const COMPONENT_PATH = '/repo/playground/src/Form.tsx'
const FINDINGS: CheckResults = {
  ...NO_RESULTS,
  failingTests: [{ name: 'Form names the field', message: 'Unable to find the label' }],
}
const WRITE_EVENT = JSON.stringify({ tool_name: 'Write', tool_input: { file_path: COMPONENT_PATH }, cwd: SESSION_DIR })
const PACKAGE_DIR = '/repo/playground'

const fakePorts = (results: CheckResults, packageRoot: string | null = null, formFile = '') => {
  const plans: CheckPlan[] = []
  return {
    plans,
    packageRootOf: () => packageRoot,
    holdsForm: async (filePath: string) => filePath === formFile,
    check: async (plan: CheckPlan) => {
      plans.push(plan)
      return results
    },
  }
}

describe('handleEvent', () => {
  it.each([
    ['input that is not JSON', 'not json'],
    [
      'a file the hook does not check',
      JSON.stringify({ tool_name: 'Read', tool_input: { file_path: '/repo/src/Form.tsx' }, cwd: SESSION_DIR }),
    ],
  ])('stays silent on %s', async (_, input) => {
    await expect(handleEvent(input, undefined, fakePorts(FINDINGS))).resolves.toBe('')
  })

  it('asks Claude to fix a component with findings', async () => {
    const decision = JSON.stringify({ decision: 'block', reason: JSON.stringify({ ...FINDINGS, holdsForm: false }) })

    await expect(handleEvent(WRITE_EVENT, undefined, fakePorts(FINDINGS))).resolves.toBe(decision)
  })

  it('stays silent on a Write event without a file path', async () => {
    const input = JSON.stringify({ tool_name: 'Write', tool_input: {}, cwd: SESSION_DIR })

    await expect(handleEvent(input, undefined, fakePorts(FINDINGS))).resolves.toBe('')
  })

  it('stays silent when every check passes', async () => {
    await expect(handleEvent(WRITE_EVENT, undefined, fakePorts(NO_RESULTS))).resolves.toBe('')
  })

  it('runs the checks from the package folder of the component', async () => {
    const ports = fakePorts(NO_RESULTS, PACKAGE_DIR)

    await handleEvent(WRITE_EVENT, undefined, ports)

    expect(ports.plans[0]?.cwd).toBe(PACKAGE_DIR)
  })

  it('checks against the standard chosen in the plugin options', async () => {
    const ports = fakePorts(NO_RESULTS)

    await handleEvent(WRITE_EVENT, 'rgaa-4.1.2', ports)

    expect(ports.plans[0]?.standard).toBe('rgaa-4.1.2')
  })

  it('asks for an audit when the written file holds a form', async () => {
    const output = JSON.parse(await handleEvent(WRITE_EVENT, undefined, fakePorts(NO_RESULTS, null, COMPONENT_PATH)))

    expect(JSON.parse(output.reason)).toMatchObject({ holdsForm: true, audit: expect.stringContaining('a11y-component-audit') })
  })
})
