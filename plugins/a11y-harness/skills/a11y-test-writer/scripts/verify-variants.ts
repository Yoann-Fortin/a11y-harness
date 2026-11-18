import type { VariantRun } from './judge-variants.ts'

export type VariantPlan = {
  component: string
  variants: { file: string; kind: VariantRun['kind'] }[]
}

export type ProjectPorts = {
  readText: (path: string) => Promise<string>
  writeText: (path: string, content: string) => Promise<void>
  runTests: () => Promise<boolean>
}

export async function verifyVariants(plan: VariantPlan, project: ProjectPorts) {
  const contents = await Promise.all(plan.variants.map(({ file }) => project.readText(file)))
  for (const content of contents) {
    await project.writeText(plan.component, content)
    await project.runTests()
  }
}
