---
name: a11y-component-audit
description: Audits the accessibility of a React component against WCAG 2.2 AA or RGAA 4.1.2, quoting every criterion from the official texts. Use when the user asks to audit, review or check the accessibility of a component, a form or JSX code.
allowed-tools: Read, Glob, Grep, Bash(node:*)
---

# Accessibility audit of a component

Every criterion, test, level and technique you cite comes from the official reference files bundled with this skill, never from memory. Two commands give access to them:

- **Look up a criterion**: `node "${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/scripts/main.ts" lookup <standard> <number>`, where `<standard>` is `wcag-2.2` or `rgaa-4.1.2` and `<number>` a criterion such as `3.3.2` or `11.1`. It prints the official title, the level and the techniques and failures of a WCAG success criterion, or the tests, their official methodology and the references of an RGAA criterion. It prints `null` for a criterion that does not exist.
- **Check a report**: `node "${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/scripts/main.ts" validate '<report>'`, with the report as JSON on one line between single quotes, where an apostrophe `'` is written `'\''`. It prints `[]` when every citation matches the official texts, or the list of problems.

Run each command on its own, starting with `node` and written as above: no shell variable, loop or pipe, which the permission rules would refuse.

## Method

1. **Standard.** Audit against the standard the user names. When none is named, audit against WCAG 2.2 AA and say so.
2. **Code.** Read the component and the components it renders.
3. **Criteria.** List the criteria the code touches: form fields, buttons, images and icons, state changes, error messages.
4. **Verdicts.** When the component has form fields, buttons or status messages, read [reference/forms.md](reference/forms.md) first: it records rulings checked against the official texts, with their sources. Then run `lookup` for each criterion and rule from the official text only: For a React component, read [reference/react.md](reference/react.md) too: it records the defects that come from how React renders, to report as failures.
   - RGAA: apply the methodology of each test, step by step, and give the test number that decides the verdict.
   - WCAG: read the success criterion, then its sufficient techniques and documented failures.
   - A criterion fails only when the official text requires what the code lacks. Good practice that the standard does not require is advice, never a failure.
5. **Report.** Write one finding per criterion you rule on, failed or compliant, and run `validate` until it prints `[]`:

   ```json
   {
     "standard": "rgaa-4.1.2",
     "findings": [
       { "criterion": "11.1", "quote": "<title printed by lookup, copied verbatim>", "evidence": ["11.1.3"] }
     ]
   }
   ```

   - `quote`: the `title` printed by `lookup`, copied character for character.
   - `level`: for WCAG only, the level printed by `lookup`.
   - `evidence`: for RGAA, the tests you applied or techniques listed in the criterion's references; for WCAG, techniques, failures or ACT rules listed for that success criterion.
   - Leave out what a reading of the code cannot settle: contrast, visible focus, zoom, screen reader rendering.

## Answer

Answer in the user's language, with:

1. **Verdict**: compliant or not, against which standard.
2. **Failures**, one per criterion: number and official title, level (WCAG) or deciding test (RGAA), the code that fails, why according to the official text, and the fixes the standard accepts. When several fixes are accepted, list them and let the developer choose: it is a design decision.
3. **Compliant criteria** you checked, in one line each.
4. **To check manually**: what the code alone cannot settle, without a verdict.
