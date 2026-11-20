import type { VariantPlan } from './verify-variants.ts'

const CONFORMING_FLAG = '--conforming'
const FAULTY_FLAG = '--faulty'
const CONFORMING_KIND = 'conforming'
const FAULTY_KIND = 'faulty'

type Variants = VariantPlan['variants']
type VariantKind = Variants[number]['kind']

const KIND_OF_FLAG = new Map<string, VariantKind>([
  [CONFORMING_FLAG, CONFORMING_KIND],
  [FAULTY_FLAG, FAULTY_KIND],
])

const lastFlagBefore = (args: string[], index: number) => args.slice(0, index).findLast((argument) => KIND_OF_FLAG.has(argument))

const kindAt = (args: string[], index: number): VariantKind => KIND_OF_FLAG.get(String(lastFlagBefore(args, index))) ?? CONFORMING_KIND

export const variantsOf = (args: string[]): Variants =>
  args.flatMap((argument, index) => (KIND_OF_FLAG.has(argument) ? [] : [{ file: argument, kind: kindAt(args, index) }]))
