import type { CriterionId, Standard } from './standard.ts'

type ElementCriteria = Partial<Record<Standard, CriterionId[]>>

export type CriteriaTableFile = {
  form: { signals: string[] }
  elements: { id: string; signals: string[]; criteria: ElementCriteria }[]
}

export type FormElement = {
  id: string
  signals: RegExp[]
  criteria: ElementCriteria
}

export type CriteriaTable = {
  form: { signals: RegExp[] }
  elements: FormElement[]
}

const patternsOf = (signals: string[]) => signals.map((signal) => new RegExp(signal))

export const criteriaTableFrom = (file: CriteriaTableFile): CriteriaTable => ({
  form: { signals: patternsOf(file.form.signals) },
  elements: file.elements.map((element) => ({ ...element, signals: patternsOf(element.signals) })),
})

const matchesAny = (signals: RegExp[], source: string) => signals.some((signal) => signal.test(source))

export const holdsForm = (table: CriteriaTable, source: string) => matchesAny(table.form.signals, source)

export const inventoryOf = (table: CriteriaTable, sources: string[], standard: Standard) =>
  table.elements
    .filter(({ signals }) => holdsForm(table, sources[0]) && sources.some((source) => matchesAny(signals, source)))
    .map((element) => ({ element: element.id, criteria: element.criteria[standard] }))

export const criteriaOf = (table: Pick<CriteriaTableFile, 'elements'> | CriteriaTable, standard: Standard): CriterionId[] => [
  ...new Set(table.elements.flatMap(({ criteria }) => criteria[standard] ?? [])),
]

export const inventoriedCriteria = (table: CriteriaTable, sources: string[], standard: Standard): CriterionId[] => [
  ...new Set(inventoryOf(table, sources, standard).flatMap(({ criteria }) => criteria ?? [])),
]

export const inventoryFor = (
  table: CriteriaTable,
  sources: string[],
  standard: Standard,
): { opened: CriterionId[]; tableCriteria: CriterionId[] } => ({
  opened: inventoriedCriteria(table, sources, standard),
  tableCriteria: sources.length === 0 ? [] : criteriaOf(table, standard),
})
