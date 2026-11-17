import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vitest.config.ts'

const END_TO_END_TESTS = ['plugins/**/main.test.ts']

export default mergeConfig(baseConfig, defineConfig({ test: { exclude: END_TO_END_TESTS } }))
