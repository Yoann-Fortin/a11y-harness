# Changelog

All notable changes to this project are documented here. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- Marketplace and plugin manifests (`a11y-harness` 0.1.0).
- Playground with a login form sample component, built test-first against WCAG 2.2 with a 100% mutation score: labelled fields, autocomplete tokens, a password visibility toggle with its own show and hide icons and an exposed state, errors linked to the empty fields and announced to assistive technologies.
- `CLAUDE.md` with the project layout and commands, and a rule file scoped to the playground tests.
- MIT licence.
- Root pnpm workspace with the plugin's development tools (Vitest, Stryker, Biome, TypeScript), a single lockfile and a single Biome configuration.
- `a11y-check` hook (PostToolUse on Write and Edit of `.tsx` and `.jsx` files): runs Biome and the related Vitest tests from the component's package, leaves out the tests of the other standard, and asks Claude to fix the findings through `decision: "block"` with a JSON report. Runs on Node 22.18 or later, without a build step.
- `standard` plugin option: `wcag-2.2` (default) or `rgaa-4.1.2`.
