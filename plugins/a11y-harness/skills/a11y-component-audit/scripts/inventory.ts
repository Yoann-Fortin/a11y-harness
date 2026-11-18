export type FormElement = {
  id: string
  signals: string[]
  criteria: Record<string, string[]>
}

export type CriteriaTable = {
  elements: FormElement[]
}

export const inventoryOf = (table: CriteriaTable, _source: string, standard: string) =>
  table.elements.map((element) => ({ element: element.id, criteria: element.criteria[standard] }))
