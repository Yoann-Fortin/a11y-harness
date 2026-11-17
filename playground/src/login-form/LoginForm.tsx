import { useId } from 'react'
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'

const EMAIL_LABEL = 'Adresse e-mail'
const PASSWORD_LABEL = 'Mot de passe'

export function LoginForm() {
  const emailFieldId = useId()
  const passwordFieldId = useId()

  return (
    <form>
      <label htmlFor={emailFieldId}>{EMAIL_LABEL}</label>
      <input id={emailFieldId} type="email" />
      <label htmlFor={passwordFieldId}>{PASSWORD_LABEL}</label>
      <input id={passwordFieldId} type="password" />
      <PasswordVisibilityToggle />
    </form>
  )
}
