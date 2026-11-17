---
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Audit the accessibility of this React component against RGAA 4.1.2. It is rendered on its own: no heading, icon or text is displayed around it.

```tsx
export function PhoneField() {
  return <input type="tel" name="phone" autoComplete="tel" title="Numéro de téléphone" />
}
```
