import type { VariantPlan } from './verify-variants.ts'

const CONFORMING_FLAG = '--conforming'
const FAULTY_FLAG = '--faulty'
const CONFORMING_KIND = 'conforming'
const FAULTY_KIND = 'faulty'

type Variants = VariantPlan['variants']
type VariantKind = Variants[number]['kind']
type Reading = { kind: VariantKind; variants: Variants }

const KIND_OF_FLAG = new Map<string, VariantKind>([
  [CONFORMING_FLAG, CONFORMING_KIND],
  [FAULTY_FLAG, FAULTY_KIND],
])

const readArgument = ({ kind, variants }: Reading, argument: string): Reading => {
  const flagKind = KIND_OF_FLAG.get(argument)
  return flagKind === undefined ? { kind, variants: [...variants, { file: argument, kind }] } : { kind: flagKind, variants }
}

export const variantsOf = (args: string[]): Variants =>
  args.reduce(readArgument, { kind: CONFORMING_KIND, variants: [] }).variants
