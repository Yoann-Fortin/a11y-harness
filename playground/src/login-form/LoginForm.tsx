import { useId } from 'react'

const EMAIL_LABEL = 'Adresse e-mail'

export function LoginForm() {
  const emailFieldId = useId()

  return (
    <form>
      <label htmlFor={emailFieldId}>{EMAIL_LABEL}</label>
      <input id={emailFieldId} type="email" />
    </form>
  )
}
