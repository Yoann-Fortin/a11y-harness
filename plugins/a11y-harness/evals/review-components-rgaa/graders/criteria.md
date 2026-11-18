---
type: llm
weight: 1
---

The user asked for a review against RGAA 4.1.2.

The components folder holds PhoneField.tsx (a field named only by title), ProductFilter.tsx (a field named only by aria-label) and PasswordField.tsx (a labelled password field with an icon-only toggle button, driven by JavaScript, that has no accessible name).

PASS only if the response:
- reports PhoneField.tsx as compliant with criterion 11.1: RGAA accepts a title attribute as a label (tests 11.1.1 and 11.1.3);
- reports ProductFilter.tsx as failing criterion 11.1 through test 11.1.3, not through test 11.1.1;
- reports the toggle button of PasswordField.tsx as failing criterion 7.1 through test 7.1.1, and does not use criterion 11.9 or test 1.1.5 as the criterion it fails.

Criterion 11.4 is not applicable to a field with no visible label: reporting it as not applicable, or not ruling on it, is correct; reporting it as failed is not.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails, or without naming the file;
- treats as a failure something the standard does not require.
Points that a static read cannot settle may be listed as to check manually, without a criterion verdict: this does not make the response fail.
