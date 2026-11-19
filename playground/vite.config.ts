import react from '@vitejs/plugin-react'
import { playwright } from '@vitest/browser-playwright'
import svgr from 'vite-plugin-svgr'
import { defineConfig, type TestProjectInlineConfiguration } from 'vitest/config'

const JSDOM_PROJECT = 'jsdom'
const BROWSER_PROJECT = 'browser'
const TEST_ENVIRONMENT = 'jsdom'
const TEST_SETUP_FILE = './vitest.setup.ts'
const JSDOM_TESTS = ['src/**/!(*.browser.*).test.tsx']
const BROWSER_TESTS = ['src/**/*.browser.*test.tsx']
const BROWSER = 'chromium'

export const jsdomProject: TestProjectInlineConfiguration = {
  extends: true,
  test: {
    name: JSDOM_PROJECT,
    environment: TEST_ENVIRONMENT,
    setupFiles: [TEST_SETUP_FILE],
    include: JSDOM_TESTS,
  },
}

export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    projects: [
      jsdomProject,
      {
        extends: true,
        test: {
          name: BROWSER_PROJECT,
          include: BROWSER_TESTS,
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: BROWSER }] },
        },
      },
    ],
  },
})
