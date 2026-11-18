---
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Audit the accessibility of this React component against WCAG 2.2 AA. It is rendered on its own: no heading, icon or text is displayed around it.

```tsx
export function PhoneField() {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input type="tel" name="phone" autoComplete="tel" title="Numéro de téléphone" />
    </form>
  )
}
```
