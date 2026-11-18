# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Marketplace and plugin manifests (`a11y-harness` 0.1.0).
- Playground with a login form sample component, built test-first against WCAG 2.2 with a 100% mutation score: labelled fields, autocomplete tokens, a password visibility toggle with its own show and hide icons and an exposed state, errors linked to the empty fields and announced to assistive technologies, again on each submission even when the errors have not changed.
- `CLAUDE.md` with the project layout and commands, and a rule file scoped to the playground tests.
- MIT licence.
- Root pnpm workspace with the plugin's development tools (Vitest, Stryker, Biome, TypeScript), a single lockfile and a single Biome configuration.
- `a11y-check` hook (PostToolUse on Write and Edit of `.tsx` and `.jsx` files): runs the linter (Biome or ESLint) and the related tests (Vitest or Jest) that the component's package depends on, skips a package that uses none of them, asks for accessibility tests written with `a11y-test-writer` when no test covers the component, leaves out the tests of the other standard, and asks Claude to fix the findings through `decision: "block"` with a JSON report, free of colour codes. Runs on Node 22.18 or later, without a build step.
- `standard` plugin option: `wcag-2.2` (default) or `rgaa-4.1.2`.
- `a11y-component-audit` skill: audits a component against WCAG 2.2 AA or RGAA 4.1.2 from the official texts it bundles (W3C WCAG 2.2 and ACT rules mapping, DINUM RGAA 4.1.2 criteria and methodology). A `lookup` command quotes a criterion, and a `validate` command rejects any report whose criterion, level, title or evidence does not match those texts. An `inventory` command lists the form elements of a component and the criteria each one opens, from a criteria table whose signals are tested on examples, and `validate` rejects a report that leaves one of them out. A forms checklist records rulings checked against the same sources, and a React reference the defects that come from how React renders, such as a repeated error that is not announced again. Evaluation cases under `evals/`.
- `a11y-test-writer` skill: writes the accessibility tests of a component for WCAG 2.2 or RGAA 4.1.2 with Testing Library, in the family of each requirement, before the component is fixed. Evaluation cases under `evals/`.
- `a11y-reviewer` agent: reviews several components, a folder or the changes of a branch with the audit skill, without changing any file.
- README: installation, choice of standard, the two verdicts of the playground, architecture, evaluations, limits and roadmap.
- WCAG-only tests for the login form (3.3.2, each field named by text shown on the page), written from the first cycle.
- RGAA-only tests for the login form: 7.5.2 (errors announced as an alert), 11.10.6 (a malformed email address gets an error naming the field, so the form turns off the browser's native validation), and 11.10.1 and 11.10.2 (required fields shown before submission), which the form fails on purpose. Under WCAG 2.2 the hook stays silent, under RGAA 4.1.2 it blocks and names the criterion.
