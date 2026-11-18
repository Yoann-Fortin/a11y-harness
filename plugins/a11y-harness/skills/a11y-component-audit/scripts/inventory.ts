export type FormElement = {
  id: string
  signals: string[]
  criteria: Record<string, string[]>
}

export type CriteriaTable = {
  form: { signals: string[] }
  elements: FormElement[]
}

const matchesAny = (signals: string[], source: string) => signals.some((signal) => new RegExp(signal).test(source))

export const holdsForm = (table: CriteriaTable, source: string) => matchesAny(table.form.signals, source)

export const inventoryOf = (table: CriteriaTable, sources: string[], standard: string) =>
  table.elements
    .filter(({ signals }) => holdsForm(table, sources[0]) && sources.some((source) => matchesAny(signals, source)))
    .map((element) => ({ element: element.id, criteria: element.criteria[standard] }))
