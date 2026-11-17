---
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Audit the accessibility of this React component against WCAG 2.2 AA. The button only shows the eye icon.

```tsx
import { useId, useState } from 'react'

export function PasswordField() {
  const fieldId = useId()
  const [isVisible, setIsVisible] = useState(false)

  return (
    <>
      <label htmlFor={fieldId}>Mot de passe</label>
      <input id={fieldId} type={isVisible ? 'text' : 'password'} autoComplete="current-password" />
      <button type="button" aria-pressed={isVisible} onClick={() => setIsVisible(!isVisible)}>
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
          <path d="M12 5C5 5 2 12 2 12s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" />
        </svg>
      </button>
    </>
  )
}
```
