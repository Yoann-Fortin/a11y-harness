---
type: llm
weight: 1
---

The user asked for an audit against RGAA 4.1.2.

The search field is named by aria-label, and the submit button that follows it in the code is displayed right next to it.

PASS only if the response:
- reports criterion 11.1 as compliant: test 11.1.1 explicitly accepts an adjacent button that gives the field a visible label while aria-label gives it an accessible name;
- does not report a failure of test 11.1.3 for this field;
- reports no failure for this component, apart from points it leaves to manual checks.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
