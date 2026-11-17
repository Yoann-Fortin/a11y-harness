import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { describingText, namingText } from '../testing/accessible-text'
import { LoginForm } from './LoginForm'

const EMAIL_FIELD_NAME = /adresse e-mail/i
const PASSWORD_FIELD_LABEL = /^mot de passe/i
const VISIBLE_REQUIRED_INDICATION = /obligatoire|requis|\*/i

const emailField = () => screen.getByRole('textbox', { name: EMAIL_FIELD_NAME })
const passwordField = () => screen.getByLabelText(PASSWORD_FIELD_LABEL)

const REQUIRED_FIELDS = [
  ['email', emailField],
  ['password', passwordField],
] as const

describe('LoginForm, RGAA 4.1.2 only', () => {
  it.each(REQUIRED_FIELDS)(
    'RGAA 11.10.1 and 11.10.2: shows that the %s field is required before submission, in its label or its linked text',
    (_, field) => {
      render(<LoginForm />)

      expect(`${namingText(field())} ${describingText(field())}`).toMatch(VISIBLE_REQUIRED_INDICATION)
    },
  )
})
