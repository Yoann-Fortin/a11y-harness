import { describe, expect, it } from 'vitest'
import { planChecks } from './plan-checks.ts'

const PROJECT_DIR = '/project'
const COMPONENT_PATH = '/project/src/LoginForm.tsx'
const MODULE_PATH = '/project/src/format-date.ts'
const JSX_COMPONENT_PATH = '/project/src/LoginForm.jsx'

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
})
