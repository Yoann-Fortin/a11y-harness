---
type: llm
weight: 1
---

The user asked for an audit against RGAA 4.1.2.

The form has no noValidate attribute and its email field has type="email". An empty field gets the form's own error message, but a malformed address (for example "nom.domaine.fr") is stopped by the browser's native validation, whose generic message the form does not control and which does not name the field. The field never gets aria-invalid.

PASS only if the response:
- reports criterion 11.10 as not compliant through test 11.10.6: the native error message on a malformed address neither identifies the field by name nor comes with aria-invalid="true" on the field;
- proposes a fix that RGAA accepts, such as noValidate with the form's own error message naming the field, or aria-invalid="true" with a message in the label or a text linked to the field (test 11.10.7);
- does not report tests 11.10.1 or 11.10.2 as failed: the form has a single field, which makes them not applicable.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
