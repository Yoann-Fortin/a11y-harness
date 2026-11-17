---
type: llm
weight: 1
---

The user asked for an audit against WCAG 2.2 AA.

The field has no label: its only text is a placeholder.

PASS only if the response:
- reports a failure of WCAG 2.2 success criterion 3.3.2 Labels or Instructions (level A), because a placeholder disappears as soon as the user types and is not a label;
- does not report a failure of 4.1.2 Name, Role, Value for this field: the placeholder gives it an accessible name;
- proposes a fix that WCAG accepts, such as a visible label element associated with the field.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
