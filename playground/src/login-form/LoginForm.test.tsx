import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LoginForm } from './LoginForm'

const EMAIL_FIELD_NAME = /adresse e-mail/i
const PASSWORD_FIELD_LABEL = /^mot de passe/i
const VISIBILITY_TOGGLE_NAME = /afficher le mot de passe/i
const SUBMIT_BUTTON_NAME = /se connecter/i
const FILLED_EMAIL = 'nom@exemple.fr'
const FILLED_PASSWORD = 'motdepasse'
const EMAIL_REQUIRED_ERROR = /saisissez votre adresse e-mail/i
const PASSWORD_REQUIRED_ERROR = /saisissez votre mot de passe/i
const ERROR_SUMMARY = /le formulaire contient des erreurs/i
const ALERT_REGION_SELECTOR = '[role="alert"], [aria-live="assertive"]'

type User = ReturnType<typeof userEvent.setup>

const emailField = () => screen.getByRole('textbox', { name: EMAIL_FIELD_NAME })
const passwordField = () => screen.getByLabelText(PASSWORD_FIELD_LABEL)
const visibilityToggle = () => screen.getByRole('button', { name: VISIBILITY_TOGGLE_NAME })
const submitButton = () => screen.getByRole('button', { name: SUBMIT_BUTTON_NAME })
const alertRegions = () => Array.from(document.querySelectorAll(ALERT_REGION_SELECTOR))

const exposesNewState = (toggle: HTMLElement) =>
  toggle.getAttribute('aria-pressed') === 'true' ||
  screen.queryByRole('button', { name: VISIBILITY_TOGGLE_NAME }) === null

const announcesErrors = (regionsBeforeSubmission: Element[]) =>
  regionsBeforeSubmission.some(
    (region) => region.isConnected && ERROR_SUMMARY.test(region.textContent ?? ''),
  ) || [emailField(), passwordField()].some((field) => field === document.activeElement)

const TOGGLE_ACTIVATIONS = [
  ['a click', (user: User, toggle: HTMLElement) => user.click(toggle)],
  [
    'Enter',
    async (user: User, toggle: HTMLElement) => {
      toggle.focus()
      await user.keyboard('{Enter}')
    },
  ],
  [
    'Space',
    async (user: User, toggle: HTMLElement) => {
      toggle.focus()
      await user.keyboard(' ')
    },
  ],
] as const

const AUTOCOMPLETE_TOKENS = [
  ['email', emailField, 'email'],
  ['password', passwordField, 'current-password'],
] as const

const REQUIRED_FIELDS = [
  ['email', emailField, EMAIL_REQUIRED_ERROR],
  ['password', passwordField, PASSWORD_REQUIRED_ERROR],
] as const

const FILLED_FIELD_CASES = [
  ['email', emailField, FILLED_EMAIL, EMAIL_REQUIRED_ERROR, passwordField, PASSWORD_REQUIRED_ERROR],
  ['password', passwordField, FILLED_PASSWORD, PASSWORD_REQUIRED_ERROR, emailField, EMAIL_REQUIRED_ERROR],
] as const

describe('LoginForm', () => {
  it('exposes the email field as a textbox named by its label', () => {
    render(<LoginForm />)

    expect(screen.queryByRole('textbox', { name: EMAIL_FIELD_NAME })).toBeInTheDocument()
  })

  it('names the password field by its label', () => {
    render(<LoginForm />)

    expect(screen.queryByLabelText(PASSWORD_FIELD_LABEL)).toHaveAttribute('type', 'password')
  })

  it('gives the visibility toggle an accessible name', () => {
    render(<LoginForm />)

    expect(screen.queryByRole('button', { name: VISIBILITY_TOGGLE_NAME })).toBeInTheDocument()
  })

  it.each(TOGGLE_ACTIVATIONS)(
    'reveals the password and exposes the new toggle state on %s',
    async (_, activate) => {
      const user = userEvent.setup()
      render(<LoginForm />)
      const toggle = visibilityToggle()

      await activate(user, toggle)

      expect(exposesNewState(toggle)).toBe(true)
      expect(passwordField()).toHaveAttribute('type', 'text')
    },
  )

  it('changes the toggle icon when the password becomes visible', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    const toggle = visibilityToggle()
    const iconWhileHidden = toggle.innerHTML

    await user.click(toggle)

    expect(toggle.innerHTML).not.toBe(iconWhileHidden)
  })

  it.each(AUTOCOMPLETE_TOKENS)('identifies the purpose of the %s field', (_, field, token) => {
    render(<LoginForm />)

    expect(field()).toHaveAttribute('autocomplete', token)
  })

  it('gives the submit button an accessible name', () => {
    render(<LoginForm />)

    expect(screen.queryByRole('button', { name: SUBMIT_BUTTON_NAME })).toBeInTheDocument()
  })

  it.each(REQUIRED_FIELDS)(
    'describes the empty %s field error in a text linked to the field',
    async (_, field, error) => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await user.click(submitButton())

      expect(field()).toHaveAccessibleDescription(error)
    },
  )

  it('announces the errors through an alert region present before submission, or moves focus to them', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    const regionsBeforeSubmission = alertRegions()

    await user.click(submitButton())

    expect(announcesErrors(regionsBeforeSubmission)).toBe(true)
  })

  it.each(FILLED_FIELD_CASES)(
    'flags only the other field when the %s field is filled',
    async (_, filledField, value, filledFieldError, emptyField, emptyFieldError) => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await user.type(filledField(), value)
      await user.click(submitButton())

      expect(filledField()).not.toHaveAccessibleDescription(filledFieldError)
      expect(emptyField()).toHaveAccessibleDescription(emptyFieldError)
    },
  )

  it('announces nothing once every field is filled', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    const regionsBeforeSubmission = alertRegions()

    await user.type(emailField(), FILLED_EMAIL)
    await user.type(passwordField(), FILLED_PASSWORD)
    await user.click(submitButton())

    expect(announcesErrors(regionsBeforeSubmission)).toBe(false)
  })

  it('still announces the errors when only the email field is filled', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    const regionsBeforeSubmission = alertRegions()

    await user.type(emailField(), FILLED_EMAIL)
    await user.click(submitButton())

    expect(announcesErrors(regionsBeforeSubmission)).toBe(true)
  })

  it('still announces the errors when only the password field is filled', async () => {
    const user = userEvent.setup()
    render(<LoginForm />)
    const regionsBeforeSubmission = alertRegions()

    await user.type(passwordField(), FILLED_PASSWORD)
    await user.click(submitButton())

    expect(announcesErrors(regionsBeforeSubmission)).toBe(true)
  })

  it('does not reload the page on submission', () => {
    render(<LoginForm />)

    expect(fireEvent.submit(submitButton())).toBe(false)
  })
})
