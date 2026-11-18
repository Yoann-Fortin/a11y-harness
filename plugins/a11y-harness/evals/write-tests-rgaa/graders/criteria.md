---
type: llm
weight: 1
focus:
  source: file
  path: src/ProductFilter.rgaa.test.tsx
---

The user asked for the accessibility tests of src/ProductFilter.tsx against RGAA 4.1.2. This is the component:

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

The field is named only by aria-label, with nothing visible around it, so it passes test 11.1.1 but fails test 11.1.3.

PASS only if this test file:
- queries the field by its role and accessible name with Testing Library, not by test id, class or tag;
- has a test named after 11.1.3 or criterion 11.1 that fails on the component above, because its label is not visible and it has neither a title attribute that explains the expected input nor a text passage next to it;
- accepts every solution RGAA accepts for 11.1.3: a title attribute that explains the expected input, a visible label, or a text passage next to the field, visible or made visible on focus. In the RGAA glossary, a text passage is linked to the field by aria-labelledby or aria-describedby, so a test may require that link.

FAIL if a test asserts a hard-coded technique that a conforming solution would fail.
