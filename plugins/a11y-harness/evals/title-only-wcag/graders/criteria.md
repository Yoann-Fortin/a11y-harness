---
type: llm
weight: 1
---

The user asked for an audit against WCAG 2.2 AA.

The field is named only by a title attribute.

PASS only if the response:
- reports a failure of WCAG 2.2 success criterion 3.3.2 Labels or Instructions (level A): the title only shows as a tooltip on mouse hover, never with the keyboard or on touch screens, so the label is not available to every user;
- does not report a failure of 4.1.2 Name, Role, Value: the title gives the field an accessible name;
- does not present the title attribute as a sufficient label under WCAG.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
