---
type: llm
weight: 1
---

The user asked for an audit against RGAA 4.1.2.

Both fields are required (an empty field gets an error on submission) but nothing indicates it before submission.

PASS only if the response:
- reports criterion 11.10 as not compliant through test 11.10.1: no visible indication names the required fields before submission, and the fields have neither required nor aria-required;
- does not report test 11.10.2 as failed: it only applies to fields that carry required or aria-required;
- proposes a fix that RGAA accepts, such as a visible indication in each label, possibly with required or aria-required.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
