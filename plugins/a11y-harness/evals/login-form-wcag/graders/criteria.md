---
type: llm
weight: 1
---

The user asked for an audit against WCAG 2.2 AA.

This form is expected to fail WCAG 2.2 AA only on its error summary: it appears without moving focus, in role="status".

PASS only if the response:
- reports no failure for the required fields: WCAG 2.2 does not require required fields to be indicated before submission, and the empty fields get an error text linked to them;
- does not report the visually unlabelled password toggle as a failure: its aria-label names it and aria-pressed exposes its state;
- reports a failure of 4.1.3 Status Messages (AA) for the error summary: Understanding 4.1.3 documents ARIA19 for errors (situation B), with role="alert" or aria-live="assertive", and notes that an alert role is needed where no change of context takes place; role="status" is the technique for success and results;
- reports no other failure, apart from points it leaves to manual checks.

Reporting in addition, under 4.1.3 (WCAG) or 7.5 (RGAA), that a repeated identical message is not announced again because React leaves its live region unchanged is correct: it is a failure the plugin reports for React components. It does not make the response fail.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
