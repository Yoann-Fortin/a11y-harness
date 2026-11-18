# Forms, buttons and status messages

Rulings checked against the official texts. Each one names its source: rule on the code from these sources, and run `lookup` for the exact title, tests and methodology before citing a criterion.

## Contents

- WCAG 2.2: labels, required fields, authentication, input purpose, native validation, buttons, toggle buttons, status messages
- RGAA 4.1.2: labels (11.1), required fields and error messages (11.10), input purpose (11.13), status messages (7.5), buttons that only contain an image

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

A `<label>` that contains its field, without `for`, passes 4.1.2: it is the first passed example of ACT rule e086e5 "Form field has non-empty accessible name". Its text stays visible, so it also meets 3.3.2. H44 only describes the association through `for` and `id`, but sufficient techniques are not a closed list.

### Required fields

WCAG 2.2 does not require required fields to be indicated before submission. H90, with G131, is a sufficient technique of 3.3.2, not an obligation, and ARIA2 is only an advisory technique of 3.3.2 and 1.3.1. After submission, 3.3.1 Error Identification applies to the fields left empty.

A general mention placed before the fields, such as « Tous les champs sont obligatoires », meets 3.3.2: G184, text instructions at the beginning of a form, is a sufficient technique with G131. It is also information available in text, which the normative text of 1.3.1 accepts. Understanding 1.3.1 strongly encourages determining relationships programmatically rather than describing them in text, but does not require it: `required` and `aria-required` are not mandatory under WCAG.

### Authentication: 3.3.8 Accessible Authentication (Minimum) (AA)

WCAG 2.2 only, with no RGAA equivalent. Remembering a password is a cognitive function test, allowed when a mechanism assists it: Understanding 3.3.8 names filling by the browser or a password manager, and copy and paste. H100, email and password fields marked up properly, is a sufficient technique; F109 covers preventing re-entry in the same format. Blocking paste, for example with an `onPaste` handler that cancels it, or preventing autofill fails the criterion. Masking the input opens no criterion.

### Input purpose: 1.3.5 Identify Input Purpose (AA)

A field that collects information about the user, with a purpose listed in section 7 of WCAG 2.2 ("Input Purposes for User Interface Components", which includes `email`, `username`, `current-password` and `new-password`), meets it with H98, the `autocomplete` attribute. F107 covers an incorrect value.

### Native validation: 3.3.1 Error Identification (A)

Understanding 3.3.1 states that the browser's native validation meets the success criterion, while warning that only the first error is exposed, that its messages are generic, and that its accessibility support must be checked. Do not fail 3.3.1 on native validation alone; list its support as a point to check.

### Buttons

A button needs an accessible name: 4.1.2, ACT rule 97a4e1 "Button has non-empty accessible name". For a button that only shows an icon, 1.1.1 may be cited as well (Understanding 1.1.1, "Controls, Input"), but 4.1.2 is the criterion that the button fails.

### Toggle buttons

A button that shows or hides something exposes its state in one of two ways, never both: a fixed name with `aria-pressed` (the ARIA Authoring Practices, Button pattern, ask that a toggle's label not change with its state), or a name that changes with the state and no `aria-pressed`. ARIA5, exposing the state through ARIA attributes, is a sufficient technique of 4.1.2. A changing name together with `aria-pressed` announces the state twice, or in contradiction. A name that changes must follow the state: F20 covers a text alternative that is not updated. Six variants conform, each needing a test case: a fixed `aria-label` with `aria-pressed`; the same `title` in both icons with `aria-pressed`; a `title` that changes with the state, without `aria-pressed`; an `<img>` with the same `alt` in both states with `aria-pressed`; an `<img>` whose `alt` changes with the state, without `aria-pressed`; an `aria-label` that changes with the state, without `aria-pressed`.

### Status messages: 4.1.3 Status Messages (AA)

The success criterion requires that a status message be exposed through a role or properties, so that assistive technologies present it without it receiving focus. F103 covers a message exposed by neither.

Understanding 4.1.3 sorts its sufficient techniques by kind of message: ARIA22, `role="status"`, for success and results (situation A); ARIA19 for suggestions and errors (situation B), whose test requires `role="alert"` or `aria-live="assertive"`. It notes that an alert role is needed where no change of context takes place.

Hence: an error message that appears while focus stays where it was must use `role="alert"` or `aria-live="assertive"`, and `role="status"` fails 4.1.3. Moving focus to the error summary or to the first field in error is a change of context (focus is part of its definition) and needs no alert.

## RGAA 4.1.2

The WCAG references listed under an RGAA criterion follow WCAG 2.1: `lookup` prints their version. Never present them as WCAG 2.2 criteria.

### Labels: criterion 11.1

- Test 11.1.1 accepts `<label for>`, `aria-label`, `aria-labelledby`, `title`, and a button adjacent to the field that gives it a visible label while a hidden `<label>`, `aria-label`, `aria-labelledby` or `title` gives it an accessible name. A placeholder alone is not accepted.
- The list of 11.1.1 is closed: the test and its methodology only name « un élément `<label>` ayant un attribut `for` ». A `<label>` that contains its field without `for` therefore fails 11.1.1 by the letter, while it passes WCAG. Fix that meets both: `for` on the label and the matching `id` on the field.
- Form field, per the glossary ("Champ de saisie de formulaire"): an `<input>` of any type but `submit`, `reset`, `button`, `image` and `hidden`, a `<textarea>`, `<select>`, `<datalist>`, `<output>`, `<progress>` or `<meter>`, or an element with an equivalent role. Buttons fall under "Bouton (formulaire)" instead.
- Adjacent, per the glossary ("Lien ou bouton adjacent"): next to the field visually and in the code, right before or right after it.
- Test 11.1.3 concerns a label that is not visible or not next to the field (hidden label, `aria-label`, distant `aria-labelledby`). Such a field also needs a `title` that explains the expected input, or a text passage next to the field, visible or made visible on focus. The glossary defines a text passage as one linked to the field by `aria-labelledby` or `aria-describedby`. A field whose adjacent button already gives it a visible label passes 11.1.
- Hence: `title` alone passes 11.1 (it meets 11.1.1 and the first condition of 11.1.3); `aria-label` alone with nothing visible fails 11.1 through 11.1.3, while passing 11.1.1.

### Required fields: criterion 11.10

- Test 11.10.1: before submission, each required field either has a visible indication that identifies it by name, or carries `required` or `aria-required="true"`. A general mention such as « Tous les champs sont obligatoires » names no field: on its own, it fails the test, wherever it is placed.
- That reading follows the letter of the test, and it is disputed: of two answers on the `rgaa` list of Renater (18 November 2026), one accepts the general mention when it comes before the fields, the other reads the test as above. When a form fails on this ground, say that the reading is disputed, and give first the fix that meets both: `required` on each field, and the mention linked to each field by `aria-describedby`, which also meets 11.10.2.
- Test 11.10.2 only concerns fields that carry `required` or `aria-required="true"`: their visible indication must be in the label or in a text linked to the field by `aria-labelledby` or `aria-describedby`.
- Glossary ("Indication de champ obligatoire"): an indication that is not explicit text, such as `*` or an icon, must be explained before its first use, visually and in the source order.
- Test 11.10.6: an error message about an expected data type or format must be visible and identify the field by name (the official methodology says « nommément »), or the field must carry `aria-invalid="true"`. The browser's native validation fails it: a field of `type` `email`, `url` or `number`, or with `pattern`, `min` or `max`, in a form without `noValidate`, gets a generic message that names no field, and the browser adds no `aria-invalid` attribute. Fixes: `noValidate` with the form's own message naming the field, or `aria-invalid="true"` with the format indicated in the label or a linked text (test 11.10.7).
- Particular case: 11.10.1 and 11.10.2 are not applicable to a form with a single field, or one that marks its optional fields visibly in the label or legend. They remain applicable when every field is required.

### Input purpose: criterion 11.13

Test 11.13.1 requires all of its conditions for a field that collects information about the user: an `autocomplete` attribute, a value from the glossary list ("Liste des valeurs possibles pour l'attribut autocomplete", taken from WCAG 2.1), and a value that matches the expected information, such as `current-password` to sign in and `new-password` to create an account or change a password.

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
