const ID_SEPARATOR = ' '
const LABELLED_BY = 'aria-labelledby'

const referencedElements = (field: HTMLElement, attribute: string) =>
  (field.getAttribute(attribute) ?? '')
    .split(ID_SEPARATOR)
    .flatMap((id) => {
      const element = id === '' ? null : document.getElementById(id)
      return element === null ? [] : [element]
    })

const textOf = (elements: Element[]) => elements.map((element) => element.textContent ?? '').join(ID_SEPARATOR)

const labelsOf = (field: HTMLElement) => (field instanceof HTMLInputElement ? Array.from(field.labels ?? []) : [])

export const namingText = (field: HTMLElement) =>
  textOf([...labelsOf(field), ...referencedElements(field, LABELLED_BY)])
