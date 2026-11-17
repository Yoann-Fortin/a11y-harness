import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vite.config.ts'

const OTHER_STANDARD_TESTS = ['**/*.rgaa.test.tsx']

export default mergeConfig(
  baseConfig,
  defineConfig({ test: { exclude: [...configDefaults.exclude, ...OTHER_STANDARD_TESTS] } }),
)
