import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginForm } from './LoginForm'

const EMAIL_FIELD_NAME = /adresse e-mail/i
const PASSWORD_FIELD_LABEL = /^mot de passe/i
const VISIBILITY_TOGGLE_NAME = /afficher le mot de passe/i

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
})
