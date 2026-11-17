---
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Audit the accessibility of this React component against RGAA 4.1.2. It is the whole login page content.

```tsx
import { type SubmitEvent, useId, useState } from 'react'

const EMAIL_REQUIRED_ERROR = 'Saisissez votre adresse e-mail'
const PASSWORD_REQUIRED_ERROR = 'Saisissez votre mot de passe'

type FieldErrors = { email?: string; password?: string }

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
      email: formData.get('email') ? undefined : EMAIL_REQUIRED_ERROR,
      password: formData.get('password') ? undefined : PASSWORD_REQUIRED_ERROR,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <p role="status">{hasErrors && 'Le formulaire contient des erreurs'}</p>
      <label htmlFor={emailFieldId}>Adresse e-mail</label>
      <input id={emailFieldId} type="email" name="email" autoComplete="email" aria-describedby={emailErrorId} />
      <p id={emailErrorId}>{errors.email}</p>
      <label htmlFor={passwordFieldId}>Mot de passe</label>
      <input
        id={passwordFieldId}
        type={isPasswordVisible ? 'text' : 'password'}
        name="password"
        autoComplete="current-password"
        aria-describedby={passwordErrorId}
      />
      <button
        type="button"
        aria-label="Afficher le mot de passe"
        aria-pressed={isPasswordVisible}
        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
          <path d="M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
        </svg>
      </button>
      <p id={passwordErrorId}>{errors.password}</p>
      <button type="submit">Se connecter</button>
    </form>
  )
}
```
