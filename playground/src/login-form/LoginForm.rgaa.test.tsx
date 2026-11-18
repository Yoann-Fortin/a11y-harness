import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { describingText, namingText } from '../testing/accessible-text'
import { LoginForm } from './LoginForm'

const EMAIL_FIELD_NAME = /adresse e-mail/i
const PASSWORD_FIELD_LABEL = /^mot de passe/i
const SUBMIT_BUTTON_NAME = /se connecter/i
const ALERT_SELECTOR = '[role="alert"], [aria-live="assertive"][aria-atomic="true"]'
const REQUIRED_WORDING = /obligatoire|requis/i
const ALL_FIELDS_WORDING = /tous les champs/i
const REQUIRED_SYMBOL = '*'
const REQUIRED_ATTRIBUTE = 'required'
const ARIA_REQUIRED_ATTRIBUTE = 'aria-required'
const ARIA_TRUE = 'true'
const ANY_ELEMENT = '*'

const emailField = () => screen.getByRole('textbox', { name: EMAIL_FIELD_NAME })
const passwordField = () => screen.getByLabelText(PASSWORD_FIELD_LABEL)

const REQUIRED_FIELDS = [
  ['email', emailField],
  ['password', passwordField],
] as const

const isMarkedRequired = (field: HTMLElement) =>
  field.hasAttribute(REQUIRED_ATTRIBUTE) || field.getAttribute(ARIA_REQUIRED_ATTRIBUTE) === ARIA_TRUE

const textsAround = (field: HTMLElement) =>
  Array.from(document.body.querySelectorAll(ANY_ELEMENT)).filter((element) => !element.contains(field))

const precedes = (element: Element, field: HTMLElement) =>
  (element.compareDocumentPosition(field) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0

const explainsSymbolBefore = (field: HTMLElement) =>
  textsAround(field).some((element) => {
    const text = element.textContent ?? ''
    return precedes(element, field) && text.includes(REQUIRED_SYMBOL) && REQUIRED_WORDING.test(text)
  })

const indicates = (text: string, field: HTMLElement) =>
  REQUIRED_WORDING.test(text) || (text.includes(REQUIRED_SYMBOL) && explainsSymbolBefore(field))

const namesAsRequiredElsewhere = (field: HTMLElement) => {
  const name = namingText(field).replace(REQUIRED_SYMBOL, '').trim().toLowerCase()
  return textsAround(field).some((element) => {
    const text = element.textContent ?? ''
    return text.toLowerCase().includes(name) && REQUIRED_WORDING.test(text)
  })
}

const statesAllRequiredBefore = (field: HTMLElement) =>
  textsAround(field).some((element) => {
    const text = element.textContent ?? ''
    return precedes(element, field) && ALL_FIELDS_WORDING.test(text) && REQUIRED_WORDING.test(text)
  })

const showsRequiredBeforeSubmission = (field: HTMLElement) =>
  isMarkedRequired(field)
    ? indicates(`${namingText(field)} ${describingText(field)}`, field)
    : indicates(namingText(field), field) || namesAsRequiredElsewhere(field) || statesAllRequiredBefore(field)

describe('LoginForm, RGAA 4.1.2 only', () => {
  it.each(REQUIRED_FIELDS)(
    'RGAA 11.10.1 and 11.10.2: shows that the %s field is required before submission, in its label or linked text when it has a required attribute, by name or by a mention of all the fields placed before them otherwise',
    (_, field) => {
      render(<LoginForm />)

      expect(showsRequiredBeforeSubmission(field())).toBe(true)
    },
  )

  it('RGAA 7.5.2: announces the errors of an empty submission as an alert', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)

    await user.click(screen.getByRole('button', { name: SUBMIT_BUTTON_NAME }))

    const alerts = Array.from(document.querySelectorAll(ALERT_SELECTOR))
    expect(alerts.some((alert) => (alert.textContent ?? '').trim() !== '')).toBe(true)
  })
})
