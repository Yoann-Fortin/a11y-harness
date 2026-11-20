import { describe, expect, it } from 'vitest'
import { standardOf } from './standard.ts'

describe('standardOf', () => {
  it('reads a supported standard, and nothing from any other value', () => {
    expect(['wcag-2.2', 'rgaa-4.1.2', 'wcag-2.1'].map(standardOf)).toEqual(['wcag-2.2', 'rgaa-4.1.2', null])
  })
})
