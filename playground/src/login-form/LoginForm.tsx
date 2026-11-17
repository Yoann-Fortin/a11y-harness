import { useId, useState } from 'react'
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'

const EMAIL_LABEL = 'Adresse e-mail'
const EMAIL_AUTOCOMPLETE = 'email'
const PASSWORD_LABEL = 'Mot de passe'
const PASSWORD_AUTOCOMPLETE = 'current-password'

export function LoginForm() {
  const emailFieldId = useId()
  const passwordFieldId = useId()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <form>
      <label htmlFor={emailFieldId}>{EMAIL_LABEL}</label>
      <input
        id={emailFieldId}
        type="email"
        autoComplete={EMAIL_AUTOCOMPLETE}
      />
      <label htmlFor={passwordFieldId}>{PASSWORD_LABEL}</label>
      <input
        id={passwordFieldId}
        type={isPasswordVisible ? 'text' : 'password'}
        autoComplete={PASSWORD_AUTOCOMPLETE}
      />
      <PasswordVisibilityToggle
        isPasswordVisible={isPasswordVisible}
        onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
      />
    </form>
  )
}
