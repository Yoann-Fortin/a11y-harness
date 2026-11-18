# a11y-harness

A Claude Code plugin that checks the accessibility of React components against WCAG 2.2 AA, or against the French RGAA 4.1.2.

It adds four things to Claude Code:

- **A hook, `a11y-check`.** After Claude writes or edits a `.tsx` or `.jsx` file, it runs the project's linter and the related tests, then hands the failures back to Claude, who fixes them before going on. When no test covers the component, it asks Claude to write its accessibility tests first.
- **A skill, `a11y-component-audit`.** It audits a component and quotes every criterion from the official texts bundled with it. A check rejects any report whose criterion, level, title or evidence is not in those texts.
- **A skill, `a11y-test-writer`.** It writes the accessibility tests of a component for the chosen standard, with Testing Library: they state what the standard requires, accept every conforming technique, and fail until the component meets them.
- **An agent, `a11y-reviewer`.** It reviews several components, a folder or the changes of a branch with the skill, without editing any file.

## Install

Requirements: Claude Code, Node.js 22.18 or later (the plugin runs TypeScript without a build step).

```bash
claude plugin marketplace add Yoann-Fortin/a11y-harness
```

```bash
claude plugin install a11y-harness@a11y-harness
```

The plugin follows WCAG 2.2 AA by default. To follow RGAA 4.1.2 instead:

```bash
echo '{"standard":"rgaa-4.1.2"}' | claude plugin configure a11y-harness@a11y-harness --values-stdin
```

## Use it in a project

The hook runs the tools of the package that holds the component, chosen from the dependencies in its `package.json`: Biome or ESLint to lint the file, Vitest or Jest to run the tests related to it. A package that uses none of them is left alone. The tests of the other standard are left out:

| Test file | Runs under WCAG 2.2 | Runs under RGAA 4.1.2 |
| --- | --- | --- |
| `*.test.tsx` | yes | yes |
| `*.wcag.test.tsx` | yes | no |
| `*.rgaa.test.tsx` | no | yes |

When a test runner finds no test related to the changed component, the hook blocks and asks Claude to write the component's accessibility tests with `a11y-test-writer`. A team without accessibility tests gets them, and the hook runs them from then on.

The skills and the agent need nothing else: ask Claude to audit a component, to write its accessibility tests, or to review a folder or a branch.

## See the two verdicts

The `playground` folder holds a login form built test-first against WCAG 2.2. It meets WCAG 2.2 AA but fails RGAA 4.1.2 on purpose, because it does not show which fields are required before submission (criterion 11.10).

```bash
pnpm install
```

```bash
pnpm --dir playground test
```

```bash
pnpm --dir playground test:rgaa
```

The first command passes, the second fails on 11.10. In a Claude Code session with the plugin, an edit of `LoginForm.tsx` goes through silently under WCAG 2.2, and is blocked under RGAA 4.1.2 with the failing tests named.

## How it is built

The hook follows a light hexagonal architecture:

| File | Role |
| --- | --- |
| `plan-checks.ts` | Domain: decides whether an event needs checks, and against which standard |
| `format-feedback.ts` | Domain: turns the check results into the feedback Claude reads |
| `handle-event.ts` | Use case: from the event to the decision |
| `run-command.ts` | Adapter: runs a tool, keeps its output on failure, reports a missing tool or a timeout |
| `find-package-root.ts` | Adapter: finds the package that holds the component |
| `run-checks.ts` | Adapter: runs each chosen linter and test runner |
| `lint-tools.ts`, `test-tools.ts` | Adapters: the command and report of Biome, ESLint, Vitest and Jest |
| `choose-tools.ts` | Factory: chooses those tools from the dependencies of the package |
| `read-reports.ts` | Anti-corruption layer: turns each tool's report, and the package dependencies, into domain types |
| `main.ts` | Composition root: reads the event, the plugin option and the package dependencies, wires the adapters |

The skill bundles the official texts it quotes, unmodified, with their sources and licences in [`NOTICE.md`](plugins/a11y-harness/skills/a11y-component-audit/reference/standards/NOTICE.md): WCAG 2.2 and the ACT rules mapping from the W3C, the RGAA 4.1.2 criteria and test methodology from the DINUM. Its rulings on forms, buttons and status messages, each with its source, are in [`reference/forms.md`](plugins/a11y-harness/skills/a11y-component-audit/reference/forms.md).

Everything was written test-first, one test at a time. Stryker requires a 100% mutation score in both places, and each mutant was replayed to check that a failing assertion kills it, not a crash.

## Evaluations

The skill and the agent have evaluation cases in `plugins/a11y-harness/evals`, run with and without the plugin:

```bash
claude plugin eval plugins/a11y-harness --scaffold --allow-tools "Bash(node:*)" --no-publish
```

`--scaffold` copies the components the agent reviews into each run, `--allow-tools` lets the skill run its scripts, and `--no-publish` keeps the report on your machine. Run it from a clean Claude Code profile (`CLAUDE_CONFIG_DIR`), so that no personal configuration skews the results.

On 17 November 2026, with Claude Code 2.1.326, this command and `--runs 3`, Claude passed 33 runs out of 33 with the plugin, and 14 out of 33 without it:

| Case | Standard | With the plugin | Without |
| --- | --- | --- | --- |
| Field named only by a placeholder | WCAG 2.2 | 3/3 | 0/3 |
| Field named only by `aria-label` | RGAA 4.1.2 | 3/3 | 2/3 |
| Search field and adjacent button | RGAA 4.1.2 | 3/3 | 1/3 |
| Field named only by `title` | WCAG 2.2 | 3/3 | 3/3 |
| Field named only by `title` | RGAA 4.1.2 | 3/3 | 2/3 |
| Login form | WCAG 2.2 | 3/3 | 0/3 |
| Login form | RGAA 4.1.2 | 3/3 | 0/3 |
| Icon-only button without a name | WCAG 2.2 | 3/3 | 3/3 |
| Icon-only button without a name | RGAA 4.1.2 | 3/3 | 1/3 |
| Review of three components (agent) | WCAG 2.2 | 3/3 | 2/3 |
| Review of three components (agent) | RGAA 4.1.2 | 3/3 | 0/3 |

## Limits

- **Conformance is not accessibility.** The skill separates failures, which the standard requires, from advice, which good practice suggests. WCAG accepts compromises: a target of 24 by 24 CSS pixels meets 2.5.8 at level AA, where 2.5.5 asks for 44 at level AAA.
- **The tests run in jsdom, without CSS.** They cannot judge contrast, visible focus, zoom or what a screen reader actually says, and a visually hidden label passes them. The skill lists these points as checks to make by hand.
- **The agent is read-only by instruction.** It has no `Write` or `Edit` tool, but it keeps `Bash` to run the skill's scripts and read-only git commands.
- **The WCAG references of the RGAA are WCAG 2.1.** The skill says so when it quotes them, and never presents them as WCAG 2.2 criteria.

## Roadmap

- Skills to fix a defect by offering the fixes the standard accepts, to fill a complete RGAA audit grid for a page, and to write the accessibility statement the RGAA requires.
- A generic set of tests, shipped with the plugin, that the hook runs on any component that renders without props.
- An agent that drives a real browser, for what jsdom cannot see.
- A hook that refuses a report until `validate` accepts it.
- Oxlint as a linter, and a plugin option to choose the tools instead of detecting them.
- Reference files for modals, menus and comboboxes.

## Licence

MIT. The bundled reference texts keep their own licences, listed in `NOTICE.md`.
