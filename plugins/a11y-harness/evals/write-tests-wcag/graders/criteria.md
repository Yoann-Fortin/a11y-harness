---
type: llm
weight: 1
focus:
  source: file
  path: src/ProductFilter.wcag.test.tsx
---

The user asked for the accessibility tests of src/ProductFilter.tsx against WCAG 2.2 AA. This is the component:

```tsx
export function ProductFilter({ onFilter }: { onFilter: (query: string) => void }) {
  return (
    <input
      type="text"
      aria-label="Filtrer les produits"
      onChange={(event) => onFilter(event.target.value)}
    />
  )
}
```

The field is named only by aria-label, with nothing visible around it, so it meets 4.1.2 Name, Role, Value but fails 3.3.2 Labels or Instructions.

PASS only if this test file:
- queries the field by its role and accessible name with Testing Library, not by test id, class or tag;
- has a test named after 3.3.2 that requires the field's name or instructions to come from text shown on the page, so that it fails on the component above;
- accepts every solution WCAG accepts, such as a visible label element or aria-labelledby pointing at visible text, instead of requiring one technique;
- does not accept aria-label, title or a placeholder alone as meeting 3.3.2.

FAIL if a test asserts a hard-coded technique that a conforming solution would fail.
