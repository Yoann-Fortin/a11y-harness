import { defineConfig, mergeConfig } from 'vitest/config'
import baseConfig from './vite.config.ts'

const ALL_BUT_THE_INTENDED_FAILURE = /^(?!.*RGAA 11\.10\.1 and 11\.10\.2)/

export default mergeConfig(baseConfig, defineConfig({ test: { testNamePattern: ALL_BUT_THE_INTENDED_FAILURE } }))
