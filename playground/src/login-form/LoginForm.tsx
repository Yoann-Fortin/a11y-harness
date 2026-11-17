import { useId, useState } from 'react'
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'

const EMAIL_LABEL = 'Adresse e-mail'
const PASSWORD_LABEL = 'Mot de passe'

export function LoginForm() {
  const emailFieldId = useId()
  const passwordFieldId = useId()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <form>
      <label htmlFor={emailFieldId}>{EMAIL_LABEL}</label>
      <input id={emailFieldId} type="email" />
      <label htmlFor={passwordFieldId}>{PASSWORD_LABEL}</label>
      <input
        id={passwordFieldId}
        type={isPasswordVisible ? 'text' : 'password'}
      />
      <PasswordVisibilityToggle
        isPasswordVisible={isPasswordVisible}
        onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
      />
    </form>
  )
}
