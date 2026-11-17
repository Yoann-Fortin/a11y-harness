---
type: llm
weight: 1
---

The user asked for an audit against RGAA 4.1.2.

The visibility toggle is a button driven by JavaScript, whose only content is a hidden icon, and it has no accessible name.

PASS only if the response:
- reports criterion 7.1 as not compliant through test 7.1.1, because the RGAA glossary (image porteuse d'information, note 2) evaluates a button that only contains an image and is driven by JavaScript under the Scripts topic;
- does not use criterion 11.9 or test 1.1.5 as the criterion that this button fails;
- proposes a fix that gives the button a relevant name.

FAIL in every case if the response:
- cites a criterion, test, level or official title that does not exist in the standard it audits;
- reports a failure without saying which criterion (and, for RGAA, which test) it fails;
- treats as a failure something the standard does not require.
Points that a static read cannot settle (contrast, focus visibility, zoom, real screen reader behaviour) may be listed as to check manually, without a criterion verdict: this does not make the response fail.
