import { userEvent } from 'vitest/browser'

const PSEUDO_ELEMENTS = [null, '::before', '::after']
const NO_OUTLINE = 'none'
const NO_OUTLINE_WIDTH = '0px'
const PROPERTY_SEPARATOR = '|'
const ELEMENT_SEPARATOR = '/'

const outlineOf = (style: CSSStyleDeclaration) =>
  style.outlineStyle === NO_OUTLINE || style.outlineWidth === NO_OUTLINE_WIDTH
    ? NO_OUTLINE
    : [style.outlineStyle, style.outlineWidth, style.outlineColor, style.outlineOffset].join(PROPERTY_SEPARATOR)

const appearanceOf = (element: Element) =>
  PSEUDO_ELEMENTS.map((pseudoElement) => {
    const style = getComputedStyle(element, pseudoElement)
    return [
      outlineOf(style),
      style.boxShadow,
      style.borderColor,
      style.borderWidth,
      style.borderStyle,
      style.backgroundColor,
      style.color,
      style.textDecorationLine,
    ].join(PROPERTY_SEPARATOR)
  }).join(ELEMENT_SEPARATOR)

const ancestryOf = (element: Element, container: Element): Element[] =>
  element === container || element.parentElement === null
    ? [element]
    : [element, ...ancestryOf(element.parentElement, container)]

const appearanceWithin = (element: Element, container: Element) =>
  ancestryOf(element, container).map(appearanceOf).join(ELEMENT_SEPARATOR)

type FocusedAppearance = { element: Element; appearance: string }

const tabSequenceWithin = async (container: Element) => {
  const reached: FocusedAppearance[] = []
  for (const _ of container.querySelectorAll('*')) {
    await userEvent.tab()
    const focused = document.activeElement
    if (focused === null || !container.contains(focused) || reached.some(({ element }) => element === focused)) {
      return reached
    }
    reached.push({ element: focused, appearance: appearanceWithin(focused, container) })
  }
  return reached
}

export const elementsWithoutVisibleFocus = async (container: Element) => {
  const unfocused = new Map(
    Array.from(container.querySelectorAll('*')).map((element) => [element, appearanceWithin(element, container)]),
  )
  const reached = await tabSequenceWithin(container)
  return reached
    .filter(({ element, appearance }) => appearance === unfocused.get(element))
    .map(({ element }) => element)
}
