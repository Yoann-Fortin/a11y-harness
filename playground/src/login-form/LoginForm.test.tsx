import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LoginForm } from './LoginForm'

const EMAIL_FIELD_NAME = /adresse e-mail/i
const PASSWORD_FIELD_LABEL = /^mot de passe/i
const VISIBILITY_TOGGLE_NAME = /afficher le mot de passe/i

type User = ReturnType<typeof userEvent.setup>

const passwordField = () => screen.getByLabelText(PASSWORD_FIELD_LABEL)
const visibilityToggle = () => screen.getByRole('button', { name: VISIBILITY_TOGGLE_NAME })

const exposesNewState = (toggle: HTMLElement) =>
  toggle.getAttribute('aria-pressed') === 'true' ||
  screen.queryByRole('button', { name: VISIBILITY_TOGGLE_NAME }) === null

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
})
