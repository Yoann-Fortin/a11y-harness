# Forms: rulings

This file only holds what the official reference files do not: glossary definitions, readings of the texts, and statements from the Understanding pages, the ACT rules, the ARIA Authoring Practices and the `rgaa` list of Renater. Each ruling names its source. The tests, their methodology, the techniques, the failures and the levels come from `lookup`: never cite them from this file.

## Contents

- Scope: form, form field, adjacent, text passage, button that only contains an image
- Labels
- Required fields
- Error messages and native validation
- Authentication
- Input purpose
- Buttons and toggle buttons
- Status messages

## Scope

- **Form**, per the RGAA glossary (« Formulaire »): a `<form>` element, or an element with `role="form"`. The RGAA criteria that start with « Dans chaque formulaire » only apply inside one.
- **Form field**, per the glossary (« Champ de saisie de formulaire »): an `<input>` of any type but `submit`, `reset`, `button`, `image` and `hidden`, a `<textarea>`, `<select>`, `<datalist>`, `<output>`, `<progress>` or `<meter>`, or an element with an equivalent role. Buttons fall under « Bouton (formulaire) » instead.
- **Adjacent**, per the glossary (« Lien ou bouton adjacent »): next to the field visually and in the code, right before or right after it.
- **Text passage**, per the glossary: a text linked to the field by `aria-labelledby` or `aria-describedby`.
- **Button that only contains an image**, per the glossary (« Image porteuse d'information », note 2): the alternative of the image is the name of the button. The button is evaluated under 11.9 when its type, such as `submit` or `reset`, controls it in a form, and under 7.1 when JavaScript controls it. The image itself is not reported under 1.1.
- **WCAG references of the RGAA** follow WCAG 2.1: `lookup` prints their version. Never present them as WCAG 2.2 criteria.

## Labels

WCAG 2.2:

- 3.3.2 and 4.1.2 are judged separately. Understanding 3.3.2 states that a control can have an accessible name, for example with `aria-label`, and so pass 4.1.2, "but still fail this success criterion (because the labels or instructions are not presented to all users, but only to those using assistive technologies)", and that labels and instructions "need to be persistently available to users".
- A field named only by `placeholder`, `aria-label` or `title` fails 3.3.2: the placeholder disappears on input (the HTML standard says it "should not be used as an alternative to a label"), `aria-label` is never shown, and the `title` tooltip only shows on mouse hover. ACT rule e086e5 counts a placeholder among its passed examples for 4.1.2.
- An adjacent button whose text gives the purpose of the field meets 3.3.2: Understanding 3.3.2 gives the search field paired with its button as an example.
- Visual context can stand for a label (Understanding 3.3.2 examples): a wizard page whose heading names its only field, a quantity field between minus and plus buttons, phone number fields separated by punctuation, a chat field followed by a send icon. A field with no such context and no visible label fails 3.3.2.
- A `<label>` that contains its field, without `for`, passes 4.1.2: it is the first passed example of ACT rule e086e5. Its text stays visible, so it also meets 3.3.2. Sufficient techniques are not a closed list.

RGAA 4.1.2:

- The list of conditions of test 11.1.1 is closed, and its methodology only names « un élément `<label>` ayant un attribut `for` ». A `<label>` that contains its field without `for` therefore fails 11.1.1 by the letter, while it passes WCAG. Fix that meets both: `for` on the label and the matching `id` on the field.
- `title` alone passes 11.1, since it meets 11.1.1 and the first condition of 11.1.3. `aria-label` alone, with nothing visible, fails 11.1 through 11.1.3 while passing 11.1.1.
- A field whose adjacent button gives it a visible label passes 11.1.
- Criterion 11.4 is not applicable to a field with no visible label, such as one named only by `title` or `aria-label`. The glossary defines « accolés » as « visuellement proches », and G162, the technique RAWeb maps to 11.4, starts its test by checking for a visible label. Failing 11.4 there would make every field named by `title` fail, although 11.1.1 and 11.1.3 accept that technique; the missing visible label is already counted under 11.1.3. No text states it: say that the reading is disputed.

## Required fields

WCAG 2.2:

- Indicating required fields before submission is not required: no normative text asks for it, and the techniques that indicate them are ways to meet 3.3.2, not obligations. After submission, 3.3.1 applies to the fields left empty.
- A general mention placed before the fields, such as « Tous les champs sont obligatoires », meets 3.3.2, as instructions at the beginning of the form. It is also information available in text, which the normative text of 1.3.1 accepts. Understanding 1.3.1 strongly encourages determining relationships programmatically rather than describing them in text, but does not require it: `required` and `aria-required` are not mandatory under WCAG.

RGAA 4.1.2:

- A general mention such as « Tous les champs sont obligatoires » names no field: on its own, it fails test 11.10.1, wherever it is placed.
- That reading follows the letter of the test, and it is disputed: of two answers on the `rgaa` list of Renater (18 November 2026), one accepts the general mention when it comes before the fields, the other reads the test as above. When a form fails on this ground, say that the reading is disputed, and give first the fix that meets both: `required` on each field, and the mention linked to each field by `aria-describedby`, which also meets 11.10.2.
- The particular case of criterion 11.10 keeps tests 11.10.1 and 11.10.2 applicable when every field is required.
- Glossary (« Indication de champ obligatoire »): an indication that is not explicit text, such as `*` or an icon, must be explained before its first use, visually and in the source order.

## Error messages and native validation

- WCAG 2.2: Understanding 3.3.1 states that the browser's native validation meets the success criterion, while warning that only the first error is exposed, that its messages are generic, and that its accessibility support must be checked. Do not fail 3.3.1 on native validation alone; list its support as a point to check manually.
- RGAA 4.1.2: native validation fails test 11.10.6. A field of `type` `email`, `url` or `number`, or with `pattern`, `min` or `max`, in a form without `noValidate`, gets a generic message that names no field (the methodology says « nommément »), and the browser adds no `aria-invalid` attribute. Fixes: `noValidate` with the form's own message naming the field, or `aria-invalid="true"` with the format indicated in the label or a linked text (test 11.10.7).

## Authentication

WCAG 2.2 only, with no RGAA equivalent: 3.3.8. Remembering a password is a cognitive function test, allowed when a mechanism assists it: Understanding 3.3.8 names filling by the browser or a password manager, and copy and paste. Blocking paste, for example with an `onPaste` handler that cancels it, or preventing autofill fails the criterion. Masking the input opens no criterion.

## Input purpose

The purposes that call for `autocomplete` are listed in section 7 of WCAG 2.2, « Input Purposes for User Interface Components », and taken up by the RGAA glossary (« Liste des valeurs possibles pour l'attribut autocomplete », from WCAG 2.1). Both include `email`, `username`, `current-password` and `new-password`. The value must match the information: `current-password` to sign in, `new-password` to create an account or change a password.

## Buttons and toggle buttons

- A button without an accessible name fails 4.1.2: ACT rule 97a4e1 "Button has non-empty accessible name". For a button that only shows an icon, 1.1.1 may be cited as well (Understanding 1.1.1, « Controls, Input »).
- A toggle button exposes its state in one of two ways, never both: a fixed name with `aria-pressed`, since the ARIA Authoring Practices, Button pattern, ask that a toggle's label not change with its state, or a name that changes with the state, without `aria-pressed`. Both together announce the state twice, or in contradiction. A name that changes must follow the state.
- Six variants conform, each needing a test case: a fixed `aria-label` with `aria-pressed`; the same `title` in both icons with `aria-pressed`; a `title` that changes with the state, without `aria-pressed`; an `<img>` with the same `alt` in both states with `aria-pressed`; an `<img>` whose `alt` changes with the state, without `aria-pressed`; an `aria-label` that changes with the state, without `aria-pressed`.

## Status messages

- WCAG 2.2: Understanding 4.1.3 sorts its sufficient techniques by kind of message, success and results on one side, suggestions and errors on the other, and notes that an alert role is needed where no change of context takes place. Hence an error message that appears while focus stays where it was must use `role="alert"` or `aria-live="assertive"`, and `role="status"` fails 4.1.3. Moving focus to the error summary or to the first field in error is a change of context, since focus is part of its definition, and needs no alert.
- RGAA 4.1.2: the methodology of criterion 7.5 makes the same distinction test by test, and asks for `aria-atomic="true"` alongside `aria-live`. An error summary in `role="status"` fails 7.5.2.
