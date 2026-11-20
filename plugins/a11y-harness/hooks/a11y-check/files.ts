export type ComponentFile = `${string}.tsx` | `${string}.jsx`

export type TestFile = `${string}.${'test' | 'spec'}.${'ts' | 'tsx' | 'js' | 'jsx'}`

const TEST_FILE = /\.(?:test|spec)\.[jt]sx?$/

const isTestFile = (path: string): path is TestFile => TEST_FILE.test(path)

export const testFileOf = (path: string): TestFile | null => (isTestFile(path) ? path : null)
