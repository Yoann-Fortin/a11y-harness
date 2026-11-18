export type FormElement = {
  id: string
  signals: string[]
  criteria: Record<string, string[]>
}

export type CriteriaTable = {
  form: { signals: string[] }
  elements: FormElement[]
}

export const holdsForm = (_table: CriteriaTable, _source: string) => true

export const inventoryOf = (table: CriteriaTable, source: string, standard: string) =>
  table.elements
    .filter(({ signals }) => signals.some((signal) => new RegExp(signal).test(source)))
    .map((element) => ({ element: element.id, criteria: element.criteria[standard] }))
