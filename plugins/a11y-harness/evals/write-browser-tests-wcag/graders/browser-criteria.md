---
type: llm
weight: 1
focus:
  source: file
  path: src/SearchForm.browser.test.tsx
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

The button loses its focus indicator (`outline: none` with nothing in its place), and the label is light grey on white (about 2.5:1). These are requirements that both WCAG 2.2 and RGAA 4.1.2 share.

PASS only if this test file:
- renders the component in the browser, with `vitest-browser-react` or Testing Library, not in jsdom;
- has a test named after 2.4.7 that moves the focus with the keyboard and requires a visible change on each element that gets it, accepting any indicator (outline, box-shadow, border, background or another visual change) instead of requiring an outline, so that it fails on the button above;
- has a test named after 1.4.3 that checks the contrast of the text against its background, for example with the `color-contrast` rule of axe-core, so that it fails on the label above.

FAIL if a test asserts a hard-coded technique that a conforming solution would fail, or if one of these two requirements is only listed as a manual check.
