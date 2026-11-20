---
name: a11y-test-writer
description: Writes the accessibility tests of a React component and its stylesheet against WCAG 2.2 AA or RGAA 4.1.2, with Testing Library and the project's Vitest or Jest, and in a browser with the browser mode of Vitest or Playwright Test, before the component is fixed. Use when a component has no accessibility tests, when the a11y-check hook reports that none covers it, or when the user asks for accessibility tests.
allowed-tools: Read, Glob, Grep, Write, Edit, Bash(node:*)
---

# Accessibility tests for a component

The tests you write state what the standard requires of the component, so that they fail while it falls short and pass once it is fixed, whatever conforming technique the fix uses. Write them before any fix: they are the red step.

## Method

1. **Agreement.** Write tests only when the user asked for them or agreed to them. When the a11y-check hook reports that no test covers a component, offer the tests and wait for the user's answer: the team decides.
2. **Standard.** Use the standard the user or the hook names. When none is named, use WCAG 2.2 AA and say so.
3. **Requirements.** Read the component. List the criteria it touches, look each one up with `node "${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/scripts/main.ts" lookup <standard> <number>`, and rule on it with the `a11y-component-audit` skill: its checklist [forms.md](${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/reference/forms.md), and step 4 of the method in its SKILL.md. The forms-only scope of the audit does not apply to tests: when the component holds no form, `inventory` prints `[]`, so match the signals of [form-criteria.json](${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/reference/form-criteria.json) yourself, and under RGAA leave out the criteria that start with « Dans chaque formulaire », as forms.md states. Only a requirement the official text states becomes a test.
4. **Tests.** Write them as [reference/writing-tests.md](reference/writing-tests.md) describes: Testing Library queries by role and accessible name, one requirement per test, the test named after its criterion, each test in the file of its family. What depends on rendering, such as visible focus, target size or contrast, is tested in a browser when the package runs tests in one.
5. **Variants.** For each requirement, write one conforming variant of the component, or of its stylesheet for a test in a browser, per technique the standard accepts for it (from `lookup`, [forms.md](${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/reference/forms.md) and [react.md](${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/reference/react.md)), in an `a11y-variants` folder next to the component, one file per technique, such as `a11y-variants/label.tsx`. For a field, a visible `<label>`, `aria-labelledby` pointing at visible text and an adjacent button whose text gives the purpose are three variants. The component as it is, when it falls short, is a faulty variant.
6. **Verify.** Run `node "${CLAUDE_PLUGIN_ROOT}/skills/a11y-test-writer/scripts/main.ts" verify-tests <test file> <component file> --conforming <variant files> --faulty <component file>`, on its own as written, once per test file. It puts each variant in place of the component, runs the test file with the first test runner of the project that runs it (Vitest, Jest or Playwright Test), and puts the component back. Read what it prints:
   - `[]`: every conforming variant passes and every faulty one fails. The tests are checked.
   - A variant with `conforming-variant-rejected` or `faulty-variant-accepted`: fix the tests, never the variants, and run it again.
   - `role-query-without-name` or `assertion-in-loop-or-condition`, with a line: a fault of the test file itself, found before any variant runs. Fix it and run it again.
   - `no-test-runner`: the project has no test runner installed. Say that the tests could not be checked against the variants.
   - `not-a-test-file`: the first file is not a `.test` or `.spec` file.
   - Problems still printed after three runs: stop and show them to the user.

   The commands need Node.js 22.18 or later, which runs TypeScript without a build step. When `node` is missing, or fails on a `.ts` file, tell the user and stop: never rule from memory instead. If a run is stopped, the next one puts the component back from the `.a11y-backup` copy it keeps next to it.
7. **Run.** With Vitest or Jest, the a11y-check hook runs each test file you write and reports its failing tests by name: report which tests fail on the current component from that report. Without that report, say which tests you expect to fail, and that they were not run. Do not change the component: fixing it is the next step.

## Examples

- The a11y-check hook reports that no test covers `NewsletterForm.tsx`: offer the tests and wait for the user's answer, as step 1 says. Write nothing yet.
- « Write the accessibility tests of `NewsletterForm.tsx` », with no standard named: use WCAG 2.2 AA and say so. Write one variant per technique that names its email field with visible text, such as `a11y-variants/label.tsx` and `a11y-variants/aria-labelledby.tsx`, then run `verify-tests` on each test file.
- `verify-tests` prints `no-test-runner`: say that the tests were not checked against the variants, and which tests you expect to fail.

## Before answering

- [ ] Each test is named after its criterion and sits in the file of its family.
- [ ] Each requirement has one conforming variant per technique the standard accepts, and the faulty component.
- [ ] `verify-tests` printed `[]` for each test file, or you show the problems it still prints.
- [ ] The requirements no test can check are listed as checks to make by hand.

## Answer

List the test files you wrote and, for each test, the criterion it covers and whether it fails on the current component. Give the variants that `verify-tests` checked, and say that the `a11y-variants` folder can be deleted. Name the requirements you could not turn into a test, such as contrast and visible focus when the package runs no tests in a browser, or what a screen reader says, so that they are checked by hand.
