import { describe, expect, it } from 'vitest'
import { planChecks } from './plan-checks.ts'

const PROJECT_DIR = '/project'
const COMPONENT_PATH = '/project/src/LoginForm.tsx'
const MODULE_PATH = '/project/src/format-date.ts'
const JSX_COMPONENT_PATH = '/project/src/LoginForm.jsx'
const VARIANT_PATH = '/project/src/a11y-variants/label.tsx'
const WCAG_STANDARD = 'wcag-2.2'
const RGAA_STANDARD = 'rgaa-4.1.2'

describe('planChecks', () => {
  it('plans the checks of a component written with Write', () => {
    const plan = planChecks({ tool_name: 'Write', tool_input: { file_path: COMPONENT_PATH }, cwd: PROJECT_DIR })

    expect(plan).toMatchObject({ filePath: COMPONENT_PATH, cwd: PROJECT_DIR })
  })

  it('ignores tools other than Write and Edit', () => {
    const plan = planChecks({ tool_name: 'Read', tool_input: { file_path: COMPONENT_PATH }, cwd: PROJECT_DIR })

    expect(plan).toBeNull()
  })

  it('plans the checks of a component changed with Edit', () => {
    const plan = planChecks({ tool_name: 'Edit', tool_input: { file_path: COMPONENT_PATH }, cwd: PROJECT_DIR })

    expect(plan).toMatchObject({ filePath: COMPONENT_PATH, cwd: PROJECT_DIR })
  })

  it('ignores files that are not React components', () => {
    const plan = planChecks({ tool_name: 'Write', tool_input: { file_path: MODULE_PATH }, cwd: PROJECT_DIR })

    expect(plan).toBeNull()
  })

  it('plans the checks of a JSX component', () => {
    const plan = planChecks({ tool_name: 'Write', tool_input: { file_path: JSX_COMPONENT_PATH }, cwd: PROJECT_DIR })

    expect(plan).toMatchObject({ filePath: JSX_COMPONENT_PATH, cwd: PROJECT_DIR })
  })

  it('targets WCAG 2.2 by default', () => {
    const plan = planChecks({ tool_name: 'Write', tool_input: { file_path: COMPONENT_PATH }, cwd: PROJECT_DIR })

    expect(plan?.standard).toBe(WCAG_STANDARD)
  })

  it('targets RGAA 4.1.2 when it is the chosen standard', () => {
    const plan = planChecks(
      { tool_name: 'Write', tool_input: { file_path: COMPONENT_PATH }, cwd: PROJECT_DIR },
      RGAA_STANDARD,
    )

    expect(plan?.standard).toBe(RGAA_STANDARD)
  })

  it('ignores the variants written to check the accessibility tests', () => {
    const plan = planChecks({ tool_name: 'Write', tool_input: { file_path: VARIANT_PATH }, cwd: PROJECT_DIR })

    expect(plan).toBeNull()
  })
})
