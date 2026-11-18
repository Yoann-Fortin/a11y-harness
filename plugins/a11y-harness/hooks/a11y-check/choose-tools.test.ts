import { describe, expect, it } from 'vitest'
import { chooseTools } from './choose-tools.ts'
import { BIOME, ESLINT } from './lint-tools.ts'
import { JEST, VITEST } from './test-tools.ts'

describe('chooseTools', () => {
  it.each([
    ['Biome', ['react', '@biomejs/biome'], { linters: [BIOME], testRunners: [] }],
    ['Vitest', ['react', 'vitest'], { linters: [], testRunners: [VITEST] }],
    ['ESLint', ['react', 'eslint'], { linters: [ESLINT], testRunners: [] }],
    ['Jest', ['react', 'jest'], { linters: [], testRunners: [JEST] }],
  ])('picks %s when the package depends on it', (_, dependencies, expected) => {
    expect(chooseTools(dependencies)).toEqual(expected)
  })
})
