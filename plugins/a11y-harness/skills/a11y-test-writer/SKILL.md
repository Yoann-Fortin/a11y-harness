---
name: a11y-test-writer
description: Writes the accessibility tests of a React component against WCAG 2.2 AA or RGAA 4.1.2, with Testing Library and the project's Vitest or Jest, before the component is fixed. Use when a component has no accessibility tests, when the a11y-check hook reports that none covers it, or when the user asks for accessibility tests.
allowed-tools: Read, Glob, Grep, Write, Bash(node:*)
---

# Accessibility tests for a component

The tests you write state what the standard requires of the component, so that they fail while it falls short and pass once it is fixed, whatever conforming technique the fix uses. Write them before any fix: they are the red step.

## Method

1. **Standard.** Use the standard the user or the hook names. When none is named, use WCAG 2.2 AA and say so.
2. **Requirements.** Read the component. List the criteria it touches, look each one up and rule on it with the `a11y-component-audit` skill: its `lookup` command, its checklist [forms.md](${CLAUDE_PLUGIN_ROOT}/skills/a11y-component-audit/reference/forms.md), and the method in its SKILL.md. Only a requirement the official text states becomes a test.
3. **Tests.** Write them as [reference/writing-tests.md](reference/writing-tests.md) describes: Testing Library queries by role and accessible name, one requirement per test, the test named after its criterion, each test in the file of its family.
4. **Run.** When the project's test runner is installed, run the new tests and report which fail. Do not change the component: fixing it is the next step.

## Answer

List the test files you wrote and, for each test, the criterion it covers and whether it fails on the current component. Name the requirements you could not turn into a test (contrast, visible focus, what a screen reader says), so that they are checked by hand.
