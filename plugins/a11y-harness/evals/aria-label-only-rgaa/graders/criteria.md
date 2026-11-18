---
type: llm
weight: 1
---

The user asked for an audit against RGAA 4.1.2.

The field is named only by aria-label, with nothing visible next to it.

PASS only if the response:
- reports criterion 11.1 as not compliant, through test 11.1.3: the label is not visible, and the field has neither a title attribute nor a visible text placed next to it that explains the expected input;
- does not report test 11.1.1 as failed: RGAA accepts aria-label as a label;
- proposes a fix that RGAA accepts, such as a visible label, a title attribute or a visible text placed next to the field.

Criterion 11.4 is not applicable to a field with no visible label: reporting it as not applicable, or not ruling on it, is correct; reporting it as failed is not.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
