import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { namingText } from '../testing/accessible-text'
import { LoginForm } from './LoginForm'

const EMAIL_FIELD_NAME = /adresse e-mail/i
const PASSWORD_FIELD_LABEL = /^mot de passe/i

describe('LoginForm, WCAG 2.2 only', () => {
  it('WCAG 3.3.2: names the email field with text shown on the page', () => {
    render(<LoginForm />)

    expect(namingText(screen.getByRole('textbox', { name: EMAIL_FIELD_NAME }))).toMatch(EMAIL_FIELD_NAME)
  })

  it('WCAG 3.3.2: names the password field with text shown on the page', () => {
    render(<LoginForm />)

    expect(namingText(screen.getByLabelText(PASSWORD_FIELD_LABEL))).toMatch(PASSWORD_FIELD_LABEL)
  })
})
