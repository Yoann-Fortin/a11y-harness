import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vitest/config'

const TEST_ENVIRONMENT = 'jsdom'
const TEST_SETUP_FILE = './vitest.setup.ts'

export default defineConfig({
  plugins: [react(), svgr()],
  test: {
    environment: TEST_ENVIRONMENT,
    setupFiles: [TEST_SETUP_FILE],
  },
})
