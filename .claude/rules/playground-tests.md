---
paths:
  - "playground/**/*.test.tsx"
---

# Playground tests

- Query by role and accessible name (`getByRole`, `getByLabelText`). A failing query means the accessible name is missing.
- Tests that hold under both standards go in `*.test.tsx`. Tests for one standard only go in `*.wcag.test.tsx` or `*.rgaa.test.tsx`, and their names cite the criterion.
- Test the requirement, not a technique: a test must not fail a solution that the standard accepts.
