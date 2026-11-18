const CONFORMING_VARIANT_REJECTED = 'conforming-variant-rejected'

export type VariantRun = {
  variant: string
  kind: 'conforming' | 'faulty'
  passed: boolean
}

export const problemsOf = (runs: VariantRun[]) =>
  runs.filter(({ passed }) => !passed).map(({ variant }) => ({ variant, problem: CONFORMING_VARIANT_REJECTED }))
