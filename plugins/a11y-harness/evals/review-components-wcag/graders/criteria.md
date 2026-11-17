---
type: llm
weight: 1
---

The user asked for a review against WCAG 2.2 AA.

The components folder holds PhoneField.tsx (a field named only by title), ProductFilter.tsx (a field named only by aria-label) and PasswordField.tsx (a labelled password field with an icon-only toggle button that has no accessible name).

PASS only if the response:
- reports PhoneField.tsx as failing 3.3.2 Labels or Instructions (A), the title only showing on mouse hover, and not as failing 4.1.2;
- reports ProductFilter.tsx as failing 3.3.2 Labels or Instructions (A), the label only reaching assistive technologies, and not as failing 4.1.2;
- reports the toggle button of PasswordField.tsx as failing 4.1.2 Name, Role, Value (A).

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails, or without naming the file;
- treats as a failure something the standard does not require.
Points that a static read cannot settle may be listed as to check manually, without a criterion verdict: this does not make the response fail.
