---
paths:
  - "playground/**/*.test.tsx"
---

# Playground tests

- Query by role and accessible name (`getByRole`, `getByLabelText`). A failing query means the accessible name is missing.
- Tests that hold under both standards go in `*.test.tsx`. Tests for one standard only go in `*.wcag.test.tsx` or `*.rgaa.test.tsx`, and their names cite the criterion.
- What depends on rendering, such as visible focus, target size, contrast or where a label sits, is tested in Chromium, in `*.browser.test.tsx`, `*.browser.wcag.test.tsx` or `*.browser.rgaa.test.tsx`, with `vitest-browser-react`.
- Test the requirement, not a technique: a test must not fail a solution that the standard accepts.
