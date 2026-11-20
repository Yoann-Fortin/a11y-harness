---
name: a11y-component-audit
description: Audits the accessibility of a React form, and of the components rendered inside it, against WCAG 2.2 AA or RGAA 4.1.2, quoting every criterion from the official texts. Use when the user asks to audit, review or check the accessibility of a form, a component or JSX code, or when the a11y-check hook asks for the audit of a form.
allowed-tools: Read, Glob, Grep, Bash(node:*)
---

# Accessibility audit of a component

Every criterion, test, level and technique you cite comes from the official reference files bundled with this skill, never from memory. Three commands give access to them:

- **Look up a criterion**: `node "${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/scripts/main.ts" lookup <standard> <number>`, where `<standard>` is `wcag-2.2` or `rgaa-4.1.2` and `<number>` a criterion such as `3.3.2` or `11.1`. It prints the official title, the level and the techniques and failures of a WCAG success criterion, or the tests, their official methodology and the references of an RGAA criterion. It prints `null` for a criterion that does not exist.
- **Check a report**: `node "${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/scripts/main.ts" validate '<report>'`, with the report as JSON on one line between single quotes, where an apostrophe `'` is written `'\''`. It prints `[]` when every citation matches the official texts, or the list of problems.
- **List the criteria a component opens**: `node "${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/scripts/main.ts" inventory <standard> <form file> <component files>`, the file that holds the form first, then the files of the components rendered inside it. It finds their form elements with the signals of [reference/form-criteria.json](reference/form-criteria.json), and prints each element with the criteria it opens. It prints `[]` when the first file holds no form.

Run each command on its own, starting with `node` and written as above: no shell variable, loop or pipe, which the permission rules would refuse. The commands need Node.js 22.18 or later, which runs TypeScript without a build step. When `node` is missing, or fails on a `.ts` file, tell the user and stop: never rule from memory instead.

## Method

1. **Standard.** Audit against the standard the user names. When none is named, audit against WCAG 2.2 AA and say so.
2. **Scope.** The audit covers forms only, for now: a `<form>` element or an element with `role="form"`, as the RGAA glossary defines a form, with the components rendered inside it. Find the file that holds the form and read it, then the components it renders inside the form. When the code holds no form, answer that the audit only covers forms for now, and stop.
3. **Criteria.** Run `inventory` on the form file and the files of the components inside it, and rule on every criterion it prints. When the code is pasted instead of saved in a file, read [reference/form-criteria.json](reference/form-criteria.json) and match its signals yourself. Rule on nothing beyond the form: the audit does not check it yet.
4. **Verdicts.** When the component has form fields, buttons or status messages, read [reference/forms.md](reference/forms.md) first: it records rulings checked against the official texts, with their sources. For a React component, read [reference/react.md](reference/react.md) too: it records the defects that come from how React renders, to report as failures. Then run `lookup` for each criterion and rule from the official text only:
   - RGAA: apply the methodology of each test, step by step, and give the test number that decides the verdict.
   - WCAG: read the success criterion, then its sufficient techniques and documented failures.
   - Report only what the standard requires. A criterion fails when the official text requires what the code lacks; a missing good practice that the standard does not require is not reported.
5. **Report.** Write one finding per criterion you rule on, failed or compliant, and run `validate` until it prints `[]`. When it still prints problems after three runs, stop: show them to the user, give no verdict on those criteria, and never change a finding only so that `validate` accepts it. Pass the form file and the files of the components inside it after the report: `validate` then also rejects a report that leaves out a criterion of their inventory, or that cites a criterion of the table that their inventory did not open, such as 11.9 without a button that submits the form.

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
   - Leave out what a reading of the code cannot settle, such as contrast, visible focus or target size, unless the browser tests of the component settle it: then run them and rule from their result.

## Answer

Answer in the user's language, with:

1. **Verdict**: compliant or not, against which standard.
2. **Failures**, one per criterion: number and official title, level (WCAG) or deciding test (RGAA), the code that fails, why according to the official text, and the fixes the standard accepts. When several fixes are accepted, list them and let the developer choose: it is a design decision. Apply a fix only when the user asks for it or agrees to it.
3. **Compliant criteria** you checked, in one line each.
4. **To check manually**: what neither the code nor the component's browser tests settle, without a verdict, and the browser tests that would settle it.
