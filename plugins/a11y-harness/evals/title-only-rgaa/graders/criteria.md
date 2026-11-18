---
type: llm
weight: 1
---

The user asked for an audit against RGAA 4.1.2.

The field is named only by a title attribute.

PASS only if the response:
- reports criterion 11.1 as compliant: test 11.1.1 accepts a title attribute as a label, and the title itself meets the first condition of test 11.1.3;
- does not report a failure of criterion 11.1 or 11.2 for this field, as long as the title describes the expected input;
- does not import the WCAG 3.3.2 requirement of a persistently visible label into the RGAA verdict.

Criterion 11.4 is not applicable to a field with no visible label: reporting it as not applicable, or not ruling on it, is correct; reporting it as failed is not.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
