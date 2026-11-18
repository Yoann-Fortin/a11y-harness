---
name: a11y-test-writer
description: Writes the accessibility tests of a React component against WCAG 2.2 AA or RGAA 4.1.2, with Testing Library and the project's Vitest or Jest, before the component is fixed. Use when a component has no accessibility tests, when the a11y-check hook reports that none covers it, or when the user asks for accessibility tests.
allowed-tools: Read, Glob, Grep, Write, Bash(node:*)
---

# Accessibility tests for a component

The tests you write state what the standard requires of the component, so that they fail while it falls short and pass once it is fixed, whatever conforming technique the fix uses. Write them before any fix: they are the red step.

## Method

1. **Agreement.** Write tests only when the user asked for them or agreed to them. When the a11y-check hook reports that no test covers a component, offer the tests and wait for the user's answer: the team decides.
2. **Standard.** Use the standard the user or the hook names. When none is named, use WCAG 2.2 AA and say so.
3. **Requirements.** Read the component. List the criteria it touches, look each one up and rule on it with the `a11y-component-audit` skill: its `lookup` command, its checklist [forms.md](${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/reference/forms.md), and the method in its SKILL.md. Only a requirement the official text states becomes a test.
4. **Tests.** Write them as [reference/writing-tests.md](reference/writing-tests.md) describes: Testing Library queries by role and accessible name, one requirement per test, the test named after its criterion, each test in the file of its family.
5. **Variants.** For each requirement, write one conforming variant of the component per technique the standard accepts for it (from `lookup`, [forms.md](${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/reference/forms.md) and [react.md](${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/reference/react.md)), in an `a11y-variants` folder next to the component, one file per technique, such as `a11y-variants/label.tsx`. For a field, a visible `<label>`, `aria-labelledby` pointing at visible text and an adjacent button whose text gives the purpose are three variants. The component as it is, when it falls short, is a faulty variant.
6. **Verify.** Run `node "${CLAUDE_PLUGIN_ROOT}/skills/a11y-test-writer/scripts/main.ts" verify-tests <test file> <component file> --conforming <variant files> --faulty <component file>`, on its own as written. For each variant it puts the variant in place of the component, runs the test file with the project's Vitest or Jest, and puts the component back. It prints `[]` when every conforming variant passes and every faulty one fails, or each variant the tests misjudge: fix the tests, never the variants, and run it again until it prints `[]`. Run it once per test file. When it prints `no-test-runner`, the project has neither Vitest nor Jest: say that the tests could not be checked against the variants.
7. **Run.** Report which tests fail on the current component. Do not change the component: fixing it is the next step.

## Answer

List the test files you wrote and, for each test, the criterion it covers and whether it fails on the current component. Give the variants that `verify-tests` checked, and say that the `a11y-variants` folder can be deleted. Name the requirements you could not turn into a test (contrast, visible focus, what a screen reader says), so that they are checked by hand.
