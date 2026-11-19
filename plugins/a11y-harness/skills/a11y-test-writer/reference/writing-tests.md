# Writing accessibility tests

## Files and families

Put the tests next to the component, in the family their requirement belongs to:

| File | Holds the tests that |
| --- | --- |
| `Component.test.tsx` | hold under both WCAG 2.2 and RGAA 4.1.2 |
| `Component.wcag.test.tsx` | WCAG 2.2 requires and RGAA 4.1.2 does not |
| `Component.rgaa.test.tsx` | RGAA 4.1.2 requires and WCAG 2.2 does not |

The a11y-check hook leaves out the family of the other standard. A requirement that both standards share goes in `Component.test.tsx`, even when only one standard was asked for: for instance errors identified in text (WCAG 3.3.1, RGAA 11.10) and errors announced without moving focus (WCAG 4.1.3, RGAA 7.5). A test whose criterion differs between the two standards goes in the family of the standard asked for. Start the name of a standard-specific test with its criterion or test number: `WCAG 3.3.2: names the email field with text shown on the page`, `RGAA 11.1.3: ...`.

## Queries

- Find elements as a user of assistive technologies does: `getByRole` and `queryByRole` with the expected accessible `name`, always, or `getByLabelText`. Never by role alone, test id, class, tag or DOM structure.
- A query that finds nothing means the accessible name is missing: that is a legitimate failure.
- To assert that an element exists, use `queryBy…` with an assertion such as `toBeInTheDocument()`, so that a missing element fails on an assertion.
- Every test must be able to fail: no assertion inside an `if`, no test that only checks something the component does not have.

## Test the requirement, not a technique

A test must not fail a solution the standard accepts. Before you write an assertion, list the techniques that meet the requirement, and check that a component using any one of them would pass the test.

- **A name shown on the page (WCAG 3.3.2).** A visible `<label>`, with `for` or around the field, `aria-labelledby` pointing at visible text, and an adjacent button whose text gives the purpose of the field (G167) all meet it; `aria-label`, `title` and `placeholder` alone do not. Collect the text of the field's labels, of the elements its `aria-labelledby` references and of a button right before or after it, and check that it gives the purpose of the field.
- **A field label under RGAA 11.1.** `<label for>`, `aria-label`, `aria-labelledby`, `title` and an adjacent button all meet 11.1.1. A label that is not visible (`aria-label`, hidden label) also needs, for 11.1.3, a `title` that explains the expected input, or a text passage next to the field, visible or made visible on focus. A text passage, in the RGAA glossary, is linked to the field by `aria-labelledby` or `aria-describedby`.
- **Required fields under RGAA 11.10.** Without `required` or `aria-required`, a visible indication must identify the field by name, in its label or in a text that names it: a general mention such as « Tous les champs sont obligatoires » is not enough on its own. With them, the indication must be in the label or in a text linked to the field, and a general mention linked by `aria-describedby` qualifies. A `*` must be explained before its first use.
- **Errors announced without moving focus (WCAG 4.1.3, RGAA 7.5.2).** The message must be in a region with `role="alert"` or `aria-live="assertive"` (RGAA also asks for `aria-atomic="true"` with `aria-live`), present before the submission. Moving focus to the errors is the other conforming way: accept it.
- **Repeated errors under React (WCAG 4.1.3, RGAA 7.5.2).** React leaves an alert region untouched when its text does not change, so test a second identical submission too: watch the alert regions with a `MutationObserver` that collects its records in its callback, and expect a change in them, or focus moved to the errors.
- **A toggle button.** Its state may be exposed by `aria-pressed` or by a name that changes; accept both.

## Cover every case

- **Each case on its own.** For a requirement that depends on what the user enters, test each case separately, for every requirement it touches: each required field left empty while the others are filled, a malformed value, and the case with no error, where nothing is flagged or announced. Errors that must be announced (4.1.3, 7.5.2) are tested in each of these cases too, not only when every field is empty. A message shown only when every field is empty, or a field always flagged, passes a test that only submits an empty form.
- **Through the form that renders it.** A child component, such as a toggle button, a field or an error summary, is tested by rendering the form and acting on it, so that a form that does not wire the child to its state fails. Testing the child on its own comes in addition, never instead.

## Behaviour

Drive interactions with `@testing-library/user-event`, by keyboard as well as by pointer when the requirement concerns operation (`Enter`, `Space`, `Tab`). Assert what the user perceives through the accessibility tree, never internal state.

## Tests in a browser

jsdom has no CSS, so a requirement that depends on rendering is tested in a browser, when the package runs tests in one:

- **The browser mode of Vitest**, when its config has a project with `browser.enabled`. Write the tests in the files that project includes, read from the config, and keep the families: `Component.browser.test.tsx`, `Component.browser.wcag.test.tsx` and `Component.browser.rgaa.test.tsx` when it includes `*.browser.*test.tsx`. Render with `vitest-browser-react`, find elements with its `getByRole`, and move the focus with `userEvent` from `vitest/browser`, which drives a real keyboard.
- **Playwright Test**, when the package depends on `@playwright/test` and its config points `baseURL` at a component gallery. Write `Component.spec.tsx`, `Component.wcag.spec.tsx` or `Component.rgaa.spec.tsx` in its `testDir`, named after the component so that the a11y-check hook finds them, and mount a story of the component with the `mount` fixture: `Component.story.tsx` next to it, one export per state. Write the story when there is none. Move the focus with `page.keyboard.press('Tab')`.

Without either, list these requirements in your answer as checks to make by hand, instead of writing a test that cannot fail. Zoom, reflow and what a screen reader says stay checks by hand in every case.

Test each requirement on what the browser renders, whatever technique meets it:

- **Visible focus (WCAG 2.4.7, RGAA 10.7).** Press Tab until the focus leaves the component. For each element it reaches, compare its computed look while it has the focus with its look before any focus: outline, box-shadow, border, background, colour and text decoration, of the element, of its `::before` and `::after`, and of its ancestors up to the component. Any change passes: an outline, a shadow, a border or a background all meet it. Record the look while the element has the focus, not once the focus has moved on.
- **Target size (WCAG 2.5.8, WCAG only).** Measure each target of the component with `getBoundingClientRect()`. It passes at 24 by 24 CSS pixels or more, or when a 24 pixel circle centred on it intersects no other target and no circle of another undersized target.
- **Text contrast (WCAG 1.4.3, RGAA 3.2).** Run the `color-contrast` rule of axe-core in the browser, in each state that shows text, such as before and after a submission with errors. Its incomplete results fail the test too: they need a check by hand.
- **Label position (RGAA 11.4.2, RGAA only).** Each visible label sits right above its field, overlapping it horizontally, or to its left on the same line, to its right for a right-to-left language. Checkboxes and radio buttons follow 11.4.3 instead.

For these tests the stylesheet is part of the component, so their variants are stylesheets: for each requirement, one conforming stylesheet per technique, such as an outline, a box-shadow and a border colour for the focus, or a padding and a spacing for a target. Run `verify-tests` with the stylesheet as the component file.
