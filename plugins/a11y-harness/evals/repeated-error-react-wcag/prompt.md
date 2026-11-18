---
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Audit the accessibility of this React component against WCAG 2.2 AA. It is the whole content of a newsletter sign-up block.

```tsx
import { type SubmitEvent, useId, useState } from 'react'

const EMPTY_EMAIL_ERROR = 'Saisissez votre adresse e-mail'
const ERROR_SUMMARY = 'Le formulaire contient une erreur'
const SUBSCRIBED = 'Merci, votre inscription est enregistrée'

export function NewsletterForm() {
  const fieldId = useId()
  const errorId = useId()
  const [error, setError] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const email = new FormData(event.currentTarget).get('email')
    setError(email ? '' : EMPTY_EMAIL_ERROR)
    setIsSubscribed(Boolean(email))
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <p role="alert">{error && ERROR_SUMMARY}</p>
      <label htmlFor={fieldId}>Adresse e-mail</label>
      <input id={fieldId} type="text" name="email" autoComplete="email" aria-describedby={errorId} />
      <p id={errorId}>{error}</p>
      <button type="submit">S'abonner</button>
      <p role="status">{isSubscribed && SUBSCRIBED}</p>
    </form>
  )
}
```
