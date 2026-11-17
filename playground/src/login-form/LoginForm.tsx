import { type SubmitEvent, useId, useState } from 'react'
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'

const EMAIL_FIELD_NAME = 'email'
const EMAIL_LABEL = 'Adresse e-mail'
const EMAIL_AUTOCOMPLETE = 'email'
const PASSWORD_FIELD_NAME = 'password'
const PASSWORD_LABEL = 'Mot de passe'
const PASSWORD_AUTOCOMPLETE = 'current-password'
const SUBMIT_LABEL = 'Se connecter'
const EMAIL_REQUIRED_ERROR = 'Saisissez votre adresse e-mail'
const PASSWORD_REQUIRED_ERROR = 'Saisissez votre mot de passe'
const ERROR_SUMMARY = 'Le formulaire contient des erreurs'

type FieldErrors = {
  email?: string
  password?: string
}

export function LoginForm() {
  const emailFieldId = useId()
  const emailErrorId = useId()
  const passwordFieldId = useId()
  const passwordErrorId = useId()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const hasErrors = errors.email !== undefined || errors.password !== undefined

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    setErrors({
      email: formData.get(EMAIL_FIELD_NAME) ? undefined : EMAIL_REQUIRED_ERROR,
      password: formData.get(PASSWORD_FIELD_NAME) ? undefined : PASSWORD_REQUIRED_ERROR,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <p role="status">{hasErrors && ERROR_SUMMARY}</p>
      <label htmlFor={emailFieldId}>{EMAIL_LABEL}</label>
      <input
        id={emailFieldId}
        type="email"
        name={EMAIL_FIELD_NAME}
        autoComplete={EMAIL_AUTOCOMPLETE}
        aria-describedby={emailErrorId}
      />
      <p id={emailErrorId}>{errors.email}</p>
      <label htmlFor={passwordFieldId}>{PASSWORD_LABEL}</label>
      <input
        id={passwordFieldId}
        type={isPasswordVisible ? 'text' : 'password'}
        name={PASSWORD_FIELD_NAME}
        autoComplete={PASSWORD_AUTOCOMPLETE}
        aria-describedby={passwordErrorId}
      />
      <PasswordVisibilityToggle
        isPasswordVisible={isPasswordVisible}
        onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
      />
      <p id={passwordErrorId}>{errors.password}</p>
      <button type="submit">{SUBMIT_LABEL}</button>
    </form>
  )
}
