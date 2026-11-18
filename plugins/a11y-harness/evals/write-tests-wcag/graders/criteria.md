---
type: llm
weight: 1
focus: trace
---

The user asked for the accessibility tests of src/ProductFilter.tsx against WCAG 2.2 AA. The field is named only by aria-label, with nothing visible around it, so it meets 4.1.2 Name, Role, Value but fails 3.3.2 Labels or Instructions.

PASS only if the test files written in the session:
- query the field by its role and accessible name with Testing Library, not by test id, class or tag;
- include a test, named after 3.3.2, that requires the field's name or instructions to come from text shown on the page, so that it fails on the current component;
- put that WCAG-only test in a file ending in .wcag.test.tsx, and any test that holds under both WCAG and RGAA in a file ending in .test.tsx without a standard;
- accept every solution WCAG accepts, such as a visible label element or aria-labelledby pointing at visible text, instead of requiring one technique;
- do not accept aria-label, title or a placeholder alone as passing 3.3.2.

FAIL if the session changes src/ProductFilter.tsx, or if a test asserts a hard-coded technique that a conforming solution would fail.
