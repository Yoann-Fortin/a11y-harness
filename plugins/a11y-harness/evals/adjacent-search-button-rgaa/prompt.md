---
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Audit the accessibility of this React component against RGAA 4.1.2. The search button is displayed right next to the field, and nothing else surrounds them.

```tsx
export function SiteSearch() {
  return (
    <form role="search" action="/recherche">
      <input type="search" name="q" aria-label="Rechercher dans le site" />
      <button type="submit">Rechercher</button>
    </form>
  )
}
```
