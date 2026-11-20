import { type SubmitEvent, useId, useState } from 'react'
import { flushSync } from 'react-dom'
import { PasswordVisibilityToggle } from './PasswordVisibilityToggle'
import './LoginForm.css'

const EMAIL_FIELD_NAME = 'email'
const EMAIL_LABEL = 'Adresse e-mail'
const EMAIL_AUTOCOMPLETE = 'email'
const PASSWORD_FIELD_NAME = 'password'
const PASSWORD_LABEL = 'Mot de passe'
const PASSWORD_AUTOCOMPLETE = 'current-password'
const SHOWN_PASSWORD_TYPE = 'text'
const HIDDEN_PASSWORD_TYPE = 'password'
const SUBMIT_LABEL = 'Se connecter'
const EMAIL_REQUIRED_ERROR = 'Saisissez votre adresse e-mail'
const EMAIL_FORMAT_ERROR = 'Saisissez une adresse e-mail valide, par exemple nom@domaine.fr'
const PASSWORD_REQUIRED_ERROR = 'Saisissez votre mot de passe'
const ERROR_SUMMARY = 'Le formulaire contient des erreurs'

const emailErrorOf = (field: HTMLInputElement) => {
  if (field.value === '') {
    return EMAIL_REQUIRED_ERROR
  }
  return field.validity.typeMismatch ? EMAIL_FORMAT_ERROR : undefined
}

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
    flushSync(() => setErrors({}))
    const formData = new FormData(event.currentTarget)
    setErrors({
      email: emailErrorOf(event.currentTarget.elements.namedItem(EMAIL_FIELD_NAME) as HTMLInputElement),
      password: formData.get(PASSWORD_FIELD_NAME) ? undefined : PASSWORD_REQUIRED_ERROR,
    })
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <p role="alert">{hasErrors && ERROR_SUMMARY}</p>
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
        type={isPasswordVisible ? SHOWN_PASSWORD_TYPE : HIDDEN_PASSWORD_TYPE}
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
