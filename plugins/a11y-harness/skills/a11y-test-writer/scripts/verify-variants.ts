import { problemsOf, type VariantRun } from './judge-variants.ts'

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
  const original = await project.readText(plan.component)
  const contents = await Promise.all(plan.variants.map(({ file }) => project.readText(file)))
  const runs: VariantRun[] = []
  for (const [index, variant] of plan.variants.entries()) {
    await project.writeText(plan.component, contents[index])
    runs.push({ ...variant, variant: variant.file, passed: await project.runTests() })
  }
  await project.writeText(plan.component, original)
  return problemsOf(runs)
}
