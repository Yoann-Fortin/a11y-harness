---
type: llm
weight: 1
---

The user asked for an audit against WCAG 2.2 AA.

The visibility toggle contains only a hidden icon and has no accessible name.

PASS only if the response:
- reports a failure of WCAG 2.2 success criterion 4.1.2 Name, Role, Value (level A) for the toggle button;
- proposes a fix that gives the button an accessible name, such as aria-label or a visually hidden text.
Citing 1.1.1 Non-text Content in addition is acceptable but not required.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
