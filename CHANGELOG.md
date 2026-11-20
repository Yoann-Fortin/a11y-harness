# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

#### Plugin

- Marketplace and plugin manifests (`a11y-harness` 0.1.0), and the `standard` plugin option: `wcag-2.2` (default) or `rgaa-4.1.2`.
- `a11y-check` hook (PostToolUse on Write and Edit of `.tsx` and `.jsx` files): runs the linter (Biome or ESLint) and the related tests (Vitest, Jest or Playwright Test) that the component's package depends on, leaving out the tests of the other standard, and asks Claude to fix the findings through `decision: "block"` with a JSON report free of colour codes. With Playwright Test, it runs the spec files named after the edited component. When the package uses none of these test runners, it asks Claude to offer the team the browser mode of Vitest or Playwright Test, to install only with their agreement. When no test covers the component, it asks Claude to offer accessibility tests written with `a11y-test-writer`, to write only with the agreement of the user. It asks to keep failing existing tests unless they freeze an inaccessible behaviour, which needs the user's agreement and an explanation, asks for an audit with `a11y-component-audit` when the file holds a form, and ignores the variants written in an `a11y-variants` folder. A tool that cannot run, or whose report cannot be read, is reported to Claude as a tool failure. Runs on Node 22.18 or later, without a build step.
- `reviewer-guard` hook (PreToolUse on Bash): keeps the `a11y-reviewer` agent read-only by denying any command but the audit skill's `node` commands and `git diff`, `git log` or `git show`, run on their own and without `--output`.
- `answer-guard` hook (Stop), which sends Claude's final answer back once when it cites a criterion of the criteria table that the inventory of the audited form did not open, when it rules on a form Claude read without any audit inventory, towards the audit skill or the `a11y-reviewer` agent, or when a session of the test-writing skill wrote test files without running `verify-tests` on them. It reads the session's transcript and its agents' transcripts.
- `a11y-component-audit` skill: audits a form, and the components rendered inside it, against WCAG 2.2 AA or RGAA 4.1.2 from the official texts it bundles (W3C WCAG 2.2 and ACT rules mapping, DINUM RGAA 4.1.2 criteria and methodology), and rules on nothing beyond the form. A `lookup` command quotes a criterion, and a `validate` command rejects any report whose criterion, level, title or evidence does not match those texts. An `inventory` command lists the form elements of a component and the criteria each one opens, from a criteria table whose signals are tested on examples, and fails on a standard it does not support. `validate` also rejects a report that leaves one of them out, or that cites a criterion of the table that the inventory did not open. A forms checklist records rulings checked against the same sources, and a React reference the defects that come from how React renders, such as a repeated error that is not announced again. Contrast, visible focus and target size are settled from the component's browser tests when it has some.
- `a11y-test-writer` skill: writes the accessibility tests of a component and its stylesheet for WCAG 2.2 or RGAA 4.1.2 with Testing Library, in the family of each requirement, before the component is fixed. What depends on rendering, such as visible focus, target size, contrast and label position, is tested in a browser when the package runs tests in one, with the browser mode of Vitest or Playwright Test; otherwise the skill offers to add one, with the team's agreement. A `verify-tests` command first reviews the test file, and rejects a query by role without an accessible name or an assertion inside a loop or a condition, with its line. It then runs the tests, with the first test runner of the package that runs them, on one variant of the component or of its stylesheet per conforming technique and on the faulty component, and reports every variant they misjudge, or `no-test-runner` when no test runner is installed, and `not-a-test-file` when the file it is given is not a test file. It keeps an `.a11y-backup` copy of the component while the variants run, and puts the component back from it when a previous run was stopped. writing-tests.md shows an example test from the playground.
- `a11y-reviewer` agent: reviews the forms of several components, a folder or the changes of a branch with the audit skill, without changing any file.
- The skills and the agent stop after three runs of `validate` or `verify-tests` that still print problems, and show them, and stop when `node` is missing or too old, instead of ruling from memory.
- Evaluation cases under `plugins/a11y-harness/evals`, run with and without the plugin.

#### Project

- Domain types shared across the plugin for the standards, criterion ids, problem codes, transcript blocks, component and test files, and the form signals, compiled once from the criteria table.
- Root pnpm workspace with the plugin's development tools (Vitest, Stryker, Biome, TypeScript), a single lockfile and a single Biome configuration.
- `CLAUDE.md` with the project layout and commands, and a rule file scoped to the playground tests.
- GitHub Actions workflow: type checking, lint and tests of the plugin on Node 22.18 and 24, validation of the marketplace and plugin manifests, tests and build of the sandbox, and a 100% mutation score in both places.
- README: installation, choice of standard, the two verdicts of the playground, architecture, evaluations with the series of 20 November 2026 (54 runs out of 57 with the plugin, 19 without), limits and roadmap.
- MIT licence.

#### Playground

- A login form sample component, built test-first against WCAG 2.2 with a 100% mutation score: labelled fields, autocomplete tokens, a password visibility toggle with its own show and hide icons and an exposed state, errors linked to the empty fields and announced to assistive technologies, again on each submission even when the errors have not changed.
- WCAG-only tests for the login form (3.3.2, each field named by text shown on the page), written from the first cycle.
- RGAA-only tests for the login form: 7.5.2 (errors announced as an alert), 11.10.6 (a malformed email address gets an error naming the field, so the form turns off the browser's native validation), and 11.10.1 and 11.10.2 (required fields shown before submission), which the form fails on purpose. Under WCAG 2.2 the hook only asks for the audit of the form, under RGAA 4.1.2 it also names the failing tests and their criterion.
- Browser tests: a `browser` Vitest project runs the `*.browser.*test.tsx` files in Chromium through Playwright, next to the `jsdom` project, and both leave out the tests of the other standard. Stryker only runs the `jsdom` project, since it does not mutate CSS.
- A stylesheet for the login form, as a design would hand it over, with the eye icon inside the password field.
- Browser test against WCAG 2.5.8: every target is at least 24 by 24 CSS pixels, or spaced as the criterion allows. The design's 16 pixel eye icon failed it, and its button now has a 4 pixel padding.
- Browser test against WCAG 2.4.7 and RGAA 10.7: every element reached with the Tab key looks different while it has the focus, whatever the technique. The design's `outline: none` on the buttons failed it, and the rule is gone.
- Browser test against WCAG 1.4.3 and RGAA 3.2, with axe-core: the text has enough contrast before and after a submission with errors. The design's light grey labels, light red errors and white on indigo button failed it, and their colours are darker.
