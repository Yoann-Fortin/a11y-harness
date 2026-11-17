import { describe, expect, it } from 'vitest'
import type { CheckResults } from './format-feedback.ts'
import { handleEvent } from './handle-event.ts'
import type { CheckPlan } from './plan-checks.ts'

const SESSION_DIR = '/repo'
const NO_RESULTS: CheckResults = { lintErrors: [], failingTests: [], toolFailures: [] }
const COMPONENT_PATH = '/repo/playground/src/Form.tsx'
const FINDINGS: CheckResults = {
  ...NO_RESULTS,
  failingTests: [{ name: 'Form names the field', message: 'Unable to find the label' }],
}
const WRITE_EVENT = JSON.stringify({ tool_name: 'Write', tool_input: { file_path: COMPONENT_PATH }, cwd: SESSION_DIR })

const fakePorts = (results: CheckResults, packageRoot: string | null = null) => {
  const plans: CheckPlan[] = []
  return {
    plans,
    packageRootOf: () => packageRoot,
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
    const output = await handleEvent(WRITE_EVENT, undefined, fakePorts(FINDINGS))

    expect(JSON.parse(output)).toEqual({ decision: 'block', reason: JSON.stringify(FINDINGS) })
  })

  it('stays silent on a Write event without a file path', async () => {
    const input = JSON.stringify({ tool_name: 'Write', tool_input: {}, cwd: SESSION_DIR })

    await expect(handleEvent(input, undefined, fakePorts(FINDINGS))).resolves.toBe('')
  })

  it('stays silent when every check passes', async () => {
    await expect(handleEvent(WRITE_EVENT, undefined, fakePorts(NO_RESULTS))).resolves.toBe('')
  })
})
