import { defineConfig } from 'vitest/config'

const TEST_ENVIRONMENT = 'node'
const TEST_FILES = ['plugins/**/*.test.ts']

export default defineConfig({
  test: {
    environment: TEST_ENVIRONMENT,
    include: TEST_FILES,
  },
})
