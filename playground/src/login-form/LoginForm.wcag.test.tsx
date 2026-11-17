import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { namingText } from '../testing/accessible-text'
import { LoginForm } from './LoginForm'

const EMAIL_FIELD_NAME = /adresse e-mail/i

describe('LoginForm, WCAG 2.2 only', () => {
  it('WCAG 3.3.2: names the email field with text shown on the page', () => {
    render(<LoginForm />)

    expect(namingText(screen.getByRole('textbox', { name: EMAIL_FIELD_NAME }))).toMatch(EMAIL_FIELD_NAME)
  })
})
