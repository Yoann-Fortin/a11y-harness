---
type: llm
weight: 1
focus: trace
---

The user asked for the accessibility tests of src/ProductFilter.tsx against RGAA 4.1.2. The field is named only by aria-label, with nothing visible around it, so it passes test 11.1.1 but fails test 11.1.3.

PASS only if the test files written in the session:
- query the field by its role and accessible name with Testing Library, not by test id, class or tag;
- include a test, named after 11.1.3 or criterion 11.1, that fails on the current component because the label is not visible and the field has neither a title attribute that explains the expected input nor a visible text next to it;
- put that RGAA-only test in a file ending in .rgaa.test.tsx, and any test that holds under both WCAG and RGAA in a file ending in .test.tsx without a standard;
- accept every solution RGAA accepts for 11.1.3: a title attribute that explains the expected input, a text next to the field that becomes visible on focus, a visible text next to the field, or a visible label.

FAIL if the session changes src/ProductFilter.tsx, or if a test asserts a hard-coded technique that a conforming solution would fail.
