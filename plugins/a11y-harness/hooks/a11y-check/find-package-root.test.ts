import { describe, expect, it } from 'vitest'
import { findPackageRoot } from './find-package-root.ts'

const COMPONENT_PATH = '/repo/playground/src/login-form/LoginForm.tsx'
const CASES: [string, string[], string | null][] = [
  ['the nearest folder holding a package.json', ['/repo/playground/package.json'], '/repo/playground'],
  ['nothing when no folder holds one', [], null],
]

describe('findPackageRoot', () => {
  it.each(CASES)('finds %s', (_, packageFiles, expected) => {
    expect(findPackageRoot(COMPONENT_PATH, (path) => packageFiles.includes(path))).toBe(expected)
  })
})
