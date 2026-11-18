---
type: llm
weight: 1
---

The user asked for an audit against RGAA 4.1.2.

Both fields are required (an empty field gets an error on submission) but nothing indicates it before submission, and the error summary uses role="status".

PASS only if the response:
- reports criterion 11.10 as not compliant through test 11.10.1: no visible indication names the required fields before submission, and the fields have neither required nor aria-required;
- does not report test 11.10.2 as failed: it only applies to fields that carry required or aria-required;
- proposes a fix that RGAA accepts, such as a visible indication in each label, possibly with required or aria-required;
- reports criterion 7.5 as not compliant through test 7.5.2: the error summary is a status message that warns of an error, so RGAA requires role="alert" (or aria-live="assertive" with aria-atomic="true"), and the form uses role="status".

Reporting in addition, under 4.1.3 (WCAG) or 7.5 (RGAA), that a repeated identical message is not announced again because React leaves its live region unchanged is correct: it is a failure the plugin reports for React components. It does not make the response fail.

Reporting in addition that the email field fails test 11.10.6, because the form has no noValidate and the browser's native message on a malformed address names no field and sets no aria-invalid, is correct. It does not make the response fail.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
