---
type: llm
weight: 1
focus:
  source: file
  path: src/SearchForm.browser.wcag.test.tsx
---

The user asked for the accessibility tests of src/SearchForm.tsx and its stylesheet against WCAG 2.2 AA. The project runs the `*.browser.*test.tsx` files in Chromium with the browser mode of Vitest, as its vite.config.js shows. This is the component:

```tsx
import './SearchForm.css'

export function SearchForm({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onSearch(String(new FormData(event.currentTarget).get('query')))
      }}
    >
      <label htmlFor="query">Rechercher un produit</label>
      <input id="query" name="query" type="search" />
      <button type="submit" aria-label="Lancer la recherche">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16">
          <path d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12z" />
        </svg>
      </button>
    </form>
  )
}
```

And its stylesheet, src/SearchForm.css:

```css
form {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: system-ui, sans-serif;
}

form label {
  font-size: 14px;
  color: #9ca3af;
}

form input {
  padding: 8px 12px;
  border: 1px solid #6b7280;
  border-radius: 6px;
}

form input:focus {
  outline: none;
  border-color: #2563eb;
}

form button {
  margin-left: -32px;
  padding: 0;
  color: #374151;
  background: none;
  border: 0;
}

form button:focus {
  outline: none;
}
```

The search button is 16 by 16 CSS pixels and overlaps the field, so it fails 2.5.8 Target Size (Minimum), a WCAG 2.2 criterion that RGAA 4.1.2 does not have.

PASS only if this test file has a test named after 2.5.8 that measures the targets in the browser and requires each one to be at least 24 by 24 CSS pixels, or spaced so that a 24 pixel circle centred on it intersects no other target, accepting both, so that it fails on the button above.

FAIL if the test only accepts one of these two ways, or reads sizes from the source instead of measuring the rendered targets.
