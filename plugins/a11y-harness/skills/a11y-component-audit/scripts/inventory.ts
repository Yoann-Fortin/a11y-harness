import type { CriterionId, Standard } from './standard.ts'

export type FormElement = {
  id: string
  signals: string[]
  criteria: Partial<Record<Standard, CriterionId[]>>
}

export type CriteriaTableFile = {
  form: { signals: string[] }
  elements: { id: string; signals: string[]; criteria: Partial<Record<Standard, CriterionId[]>> }[]
}

export type CompiledCriteriaTable = {
  form: { signals: RegExp[] }
  elements: { id: string; signals: RegExp[]; criteria: Partial<Record<Standard, CriterionId[]>> }[]
}

export const criteriaTableFrom = (_file: CriteriaTableFile): CompiledCriteriaTable => ({ form: { signals: [] }, elements: [] })

export type CriteriaTable = {
  form: { signals: string[] }
  elements: FormElement[]
}

const matchesAny = (signals: string[], source: string) => signals.some((signal) => new RegExp(signal).test(source))

export const holdsForm = (table: CriteriaTable, source: string) => matchesAny(table.form.signals, source)

export const inventoryOf = (table: CriteriaTable, sources: string[], standard: Standard) =>
  table.elements
    .filter(({ signals }) => holdsForm(table, sources[0]) && sources.some((source) => matchesAny(signals, source)))
    .map((element) => ({ element: element.id, criteria: element.criteria[standard] }))
