---
runs: 1
max_turns: 20
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill]
---

Audit the accessibility of this React component against RGAA 4.1.2. It is rendered on its own: no heading, icon or text is displayed around it.

```tsx
export function ProductFilter({ onFilter }: { onFilter: (query: string) => void }) {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input
        type="text"
        aria-label="Filtrer les produits"
        onChange={(event) => onFilter(event.target.value)}
      />
    </form>
  )
}
```
