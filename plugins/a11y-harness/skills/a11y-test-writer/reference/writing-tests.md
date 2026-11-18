# Writing accessibility tests

## Files and families

Put the tests next to the component, in the family their requirement belongs to:

| File | Holds the tests that |
| --- | --- |
| `Component.test.tsx` | hold under both WCAG 2.2 and RGAA 4.1.2 |
| `Component.wcag.test.tsx` | WCAG 2.2 requires and RGAA 4.1.2 does not |
| `Component.rgaa.test.tsx` | RGAA 4.1.2 requires and WCAG 2.2 does not |

The a11y-check hook leaves out the family of the other standard. A test whose criterion differs between the two standards goes in the family of the standard asked for. Start the name of a standard-specific test with its criterion or test number: `WCAG 3.3.2: names the email field with text shown on the page`, `RGAA 11.1.3: ...`.

## Queries

- Find elements as a user of assistive technologies does: `getByRole` and `queryByRole` with the expected accessible `name`, always, or `getByLabelText`. Never by role alone, test id, class, tag or DOM structure.
- A query that finds nothing means the accessible name is missing: that is a legitimate failure.
- To assert that an element exists, use `queryBy…` with an assertion such as `toBeInTheDocument()`, so that a missing element fails on an assertion.
- Every test must be able to fail: no assertion inside an `if`, no test that only checks something the component does not have.

## Test the requirement, not a technique

A test must not fail a solution the standard accepts. Before you write an assertion, list the techniques that meet the requirement, and check that every one of them passes.

- **A name shown on the page (WCAG 3.3.2).** A visible `<label>` and `aria-labelledby` pointing at visible text both meet it; `aria-label`, `title` and `placeholder` alone do not. Collect the text of the field's labels and of the elements its `aria-labelledby` references, and check that it matches the expected name.
- **A field label under RGAA 11.1.** `<label for>`, `aria-label`, `aria-labelledby`, `title` and an adjacent button all meet 11.1.1. A label that is not visible (`aria-label`, hidden label) also needs, for 11.1.3, a `title` that explains the expected input, or a text passage next to the field, visible or made visible on focus. A text passage, in the RGAA glossary, is linked to the field by `aria-labelledby` or `aria-describedby`.
- **Required fields under RGAA 11.10.** Without `required` or `aria-required`, a visible indication must name the field, or a mention of all the fields must come before them; with them, the indication must be in the label or in a text linked to the field. A `*` must be explained before its first use.
- **Errors announced without moving focus (WCAG 4.1.3, RGAA 7.5.2).** The message must be in a region with `role="alert"` or `aria-live="assertive"` (RGAA also asks for `aria-atomic="true"` with `aria-live`), present before the submission. Moving focus to the errors is the other conforming way: accept it.
- **A toggle button.** Its state may be exposed by `aria-pressed` or by a name that changes; accept both.

## Behaviour

Drive interactions with `@testing-library/user-event`, by keyboard as well as by pointer when the requirement concerns operation (`Enter`, `Space`, `Tab`). Assert what the user perceives through the accessibility tree, never internal state.

## Limits

jsdom has no CSS: contrast, visible focus, zoom and reflow cannot be tested this way, and a visually hidden label passes. List those requirements in your answer instead of writing a test that cannot fail.
