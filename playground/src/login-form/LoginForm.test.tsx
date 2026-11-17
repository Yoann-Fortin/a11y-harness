import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginForm } from './LoginForm'

const EMAIL_FIELD_NAME = /adresse e-mail/i

describe('LoginForm', () => {
  it('exposes the email field as a textbox named by its label', () => {
    render(<LoginForm />)

    expect(screen.queryByRole('textbox', { name: EMAIL_FIELD_NAME })).toBeInTheDocument()
  })
})
