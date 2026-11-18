const CONFORMING = 'conforming'
const CONFORMING_VARIANT_REJECTED = 'conforming-variant-rejected'
const FAULTY_VARIANT_ACCEPTED = 'faulty-variant-accepted'

export type VariantRun = {
  variant: string
  kind: 'conforming' | 'faulty'
  passed: boolean
}

export const problemsOf = (runs: VariantRun[]) =>
  runs
    .filter(({ kind, passed }) => passed !== (kind === CONFORMING))
    .map(({ variant, kind }) => ({
      variant,
      problem: kind === CONFORMING ? CONFORMING_VARIANT_REJECTED : FAULTY_VARIANT_ACCEPTED,
    }))
