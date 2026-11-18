# React components

Defects that come from how React renders, checked against the official texts and the React documentation. Report each one as a failure of the criterion it breaks, with its fix: a team that works with React has to correct it.

## A repeated message is not announced again: 4.1.3 Status Messages (WCAG), 7.5 (RGAA)

React only changes the DOM nodes that differ between two renders ("React only changes the DOM nodes if there's a difference between renders", react.dev, Render and Commit). When the user triggers the same error twice, for example by submitting the same empty form again, the text of the alert region is identical: React leaves it untouched, and assistive technologies, which announce changes in the content of a live region (MDN, ARIA live regions), announce nothing. Plain JavaScript that sets the same text again replaces the text node, so the defect is specific to React.

- Report it under WCAG 4.1.3, and under RGAA 7.5 through test 7.5.2 for an error or a suggestion (7.5.1 for a success or a result, 7.5.3 for progress).
- It applies when focus stays where it was. Moving focus to the error summary or to the first field in error is a change of context and does not need the region to be announced.
- Fixes, any one of them:
  - clear the message in a synchronous render before setting it again: `flushSync(() => setErrors({}))` from `react-dom`, then `setErrors(...)`;
  - give the message text a `key` that changes on each submission, so that React replaces its node;
  - move focus to the error summary or to the first field in error.
- Keep the alert region rendered from the first render, empty: MDN advises establishing a live region before updating its content, and a region with `aria-live` inserted already filled may not be announced.
- What a screen reader actually says stays a point to check manually.
