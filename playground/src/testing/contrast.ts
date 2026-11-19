import axe from 'axe-core'

const CONTRAST_RULE = 'color-contrast'
const SELECTOR_SEPARATOR = ' '

export const textWithoutEnoughContrast = async (container: Element) => {
  const { violations, incomplete } = await axe.run(container, { runOnly: [CONTRAST_RULE] })
  return [...violations, ...incomplete].flatMap(({ nodes }) => nodes.map(({ target }) => target.join(SELECTOR_SEPARATOR)))
}
