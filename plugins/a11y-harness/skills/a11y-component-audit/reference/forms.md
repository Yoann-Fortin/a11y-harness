# Forms, buttons and status messages

Rulings checked against the official texts. Each one names its source: rule on the code from these sources, and run `lookup` for the exact title, tests and methodology before citing a criterion.

## WCAG 2.2

### Labels: 3.3.2 Labels or Instructions (A) and 4.1.2 Name, Role, Value (A)

The two criteria are judged separately. Understanding 3.3.2 states that a control can have an accessible name, for example with `aria-label`, and so pass 4.1.2, "but still fail this success criterion (because the labels or instructions are not presented to all users, but only to those using assistive technologies)". It also states that labels and instructions "need to be persistently available to users".

| Field named only by | 4.1.2 | 3.3.2 | Source |
|---|---|---|---|
| `placeholder` | passes | fails | ACT rule e086e5 lists a placeholder among its passed examples; the HTML standard says the placeholder "should not be used as an alternative to a label", since it disappears on input |
| `aria-label`, nothing visible | passes | fails | ARIA14 is a sufficient technique of 4.1.2; Understanding 3.3.2 quoted above |
| `title` | passes | fails | H65 is a sufficient technique of 1.1.1, 1.3.1 and 4.1.2, not of 3.3.2; the tooltip only shows on mouse hover, never with the keyboard or on touch screens |
| `aria-label` and an adjacent button whose text gives the purpose | passes | passes | G167 is a sufficient technique of 3.3.2; Understanding 3.3.2 gives the search field paired with its button as an example |

Visual context can stand for a label (Understanding 3.3.2 examples): a wizard page whose heading names its only field, a quantity field between minus and plus buttons, phone number fields separated by punctuation, a chat field followed by a send icon. A field with no such context and no visible label fails 3.3.2.

### Required fields

WCAG 2.2 does not require required fields to be indicated before submission. H90 and ARIA2 are sufficient techniques of 3.3.2, not obligations. After submission, 3.3.1 Error Identification applies to the fields left empty.

### Buttons

A button needs an accessible name: 4.1.2, ACT rule 97a4e1 "Button has non-empty accessible name". For a button that only shows an icon, 1.1.1 may be cited as well (Understanding 1.1.1, "Controls, Input"), but 4.1.2 is the criterion that the button fails.

### Status messages: 4.1.3 Status Messages (AA)

The success criterion requires that a status message be exposed through a role or properties, so that assistive technologies present it without it receiving focus. F103 covers a message exposed by neither.

Understanding 4.1.3 sorts its sufficient techniques by kind of message: ARIA22, `role="status"`, for success and results (situation A); ARIA19 for suggestions and errors (situation B), whose test requires `role="alert"` or `aria-live="assertive"`. It notes that an alert role is needed where no change of context takes place.

Hence: an error message that appears while focus stays where it was must use `role="alert"` or `aria-live="assertive"`, and `role="status"` fails 4.1.3. Moving focus to the error summary or to the first field in error is a change of context (focus is part of its definition) and needs no alert.

## RGAA 4.1.2

The WCAG references listed under an RGAA criterion follow WCAG 2.1: `lookup` prints their version. Never present them as WCAG 2.2 criteria.

### Labels: criterion 11.1

- Test 11.1.1 accepts `<label for>`, `aria-label`, `aria-labelledby`, `title`, and a button adjacent to the field that gives it a visible label while a hidden `<label>`, `aria-label`, `aria-labelledby` or `title` gives it an accessible name. A placeholder alone is not accepted.
- Adjacent, per the glossary ("Lien ou bouton adjacent"): next to the field visually and in the code, right before or right after it.
- Test 11.1.3 concerns a label that is not visible or not next to the field (hidden label, `aria-label`, distant `aria-labelledby`). Such a field also needs a `title` that explains the expected input, or a text next to the field that becomes visible on focus, or a visible text next to the field. A field whose adjacent button already gives it a visible label passes 11.1.
- Hence: `title` alone passes 11.1 (it meets 11.1.1 and the first condition of 11.1.3); `aria-label` alone with nothing visible fails 11.1 through 11.1.3, while passing 11.1.1.

### Required fields: criterion 11.10

- Test 11.10.1: before submission, each required field either has a visible indication that identifies it by name, or carries `required` or `aria-required="true"`.
- Test 11.10.2 only concerns fields that carry `required` or `aria-required="true"`: their visible indication must be in the label or in a text linked to the field by `aria-labelledby` or `aria-describedby`.
- Glossary ("Indication de champ obligatoire"): an indication that is not explicit text, such as `*` or an icon, must be explained before its first use, visually and in the source order.
- Particular case: 11.10.1 and 11.10.2 are not applicable to a form with a single field, or one that marks its optional fields visibly in the label or legend. They remain applicable when every field is required.

### Status messages: criterion 7.5

RGAA turns the same distinction into tests, and asks for `aria-atomic="true"` alongside `aria-live`. Its methodology accepts, for each kind of message:

- success, result of an action or state of the application (test 7.5.1): `role="status"`, or `aria-live="polite"` with `aria-atomic="true"`;
- suggestion or error (test 7.5.2): `role="alert"`, or `aria-live="assertive"` with `aria-atomic="true"`;
- progress (test 7.5.3): `role="log"`, `role="progressbar"` or `role="status"`, or their `aria-live` equivalents.

An error summary in `role="status"` therefore fails 7.5.2.

### Buttons that only contain an image

Glossary, "Image porteuse d'information", note 2: when a `<button>` only contains an image (`<img>`, `<object>`, `<embed>`, `<canvas>` or `<svg>`), the alternative of the image is the name of the button, and the button is evaluated:

- under the Forms topic (criterion 11.9) when its type, such as `submit` or `reset`, controls it in a form;
- under the Scripts topic (criterion 7.1, test 7.1.1, which requires an explicit name) when JavaScript controls it.

Do not report the image itself under criterion 1.1 in that case. Criterion 11.9 only applies to buttons inside a form.
