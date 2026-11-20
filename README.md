# a11y-harness

A Claude Code plugin that checks the accessibility of React components against WCAG 2.2 AA, or against the French RGAA 4.1.2.

It adds three hooks, two skills and an agent to Claude Code. The main ones:

- **A hook, `a11y-check`.** After Claude writes or edits a `.tsx` or `.jsx` file, it runs the project's linter and the related tests, then hands the failures back to Claude, who fixes them before going on. When no test covers the component, it asks Claude to offer its accessibility tests to the user. When the file holds a form, it asks Claude to audit the form with the skill. Claude writes tests and applies fixes only with the agreement of the user: the team decides. When existing tests fail, Claude changes the new code, not the tests, unless a test freezes a behaviour the standard does not accept: then it asks the user first and explains why.
- **A skill, `a11y-component-audit`.** It audits a form, with the components rendered inside it, and quotes every criterion from the official texts bundled with it. It first lists, from a table of form elements and the criteria they open, every criterion the component calls for. A check rejects any report whose criterion, level, title or evidence is not in those texts, or that leaves out one of those criteria.
- **A skill, `a11y-test-writer`.** It writes the accessibility tests of a component for the chosen standard, with Testing Library: they state what the standard requires, accept every conforming technique, and fail until the component meets them. What depends on rendering, such as visible focus, target size or contrast, is tested in a browser when the project runs tests in one. A `verify-tests` command checks it: it runs the tests on one variant of the component per conforming technique, and on the faulty component, and reports every variant they misjudge.
- **An agent, `a11y-reviewer`.** It reviews the forms of several components, a folder or the changes of a branch with the skill, without editing any file.

## Install

Requirements: Claude Code, Node.js 22.18 or later (the plugin runs TypeScript without a build step).

```bash
claude plugin marketplace add Yoann-Fortin/a11y-harness
```

```bash
claude plugin install a11y-harness@a11y-harness
```

The plugin follows WCAG 2.2 AA by default. To follow RGAA 4.1.2 instead, set its option when you install it:

```bash
claude plugin install a11y-harness@a11y-harness --config standard=rgaa-4.1.2
```

Or change it later, then restart Claude Code:

```bash
echo '{"standard":"rgaa-4.1.2"}' | claude plugin configure a11y-harness@a11y-harness --values-stdin
```

## Use it in a project

The hook runs the tools of the package that holds the component, chosen from the dependencies in its `package.json`: Biome or ESLint to lint the file, Vitest, Jest or Playwright Test to run the tests related to it. When the package uses none of these test runners, the hook asks Claude to offer the team one that also tests in a browser, the browser mode of Vitest or Playwright Test, and to install it only with their agreement. The tests of the other standard are left out:

| Test file | Runs under WCAG 2.2 | Runs under RGAA 4.1.2 |
| --- | --- | --- |
| `*.test.tsx`, `*.browser.test.tsx`, `*.spec.tsx` | yes | yes |
| `*.wcag.test.tsx`, `*.browser.wcag.test.tsx`, `*.wcag.spec.tsx` | yes | no |
| `*.rgaa.test.tsx`, `*.browser.rgaa.test.tsx`, `*.rgaa.spec.tsx` | no | yes |

What jsdom cannot see, such as visible focus, target size, contrast or where a label sits, is tested in a browser. With the browser mode of Vitest, a `browser` project runs the `*.browser.*test.tsx` files, as in the playground. With Playwright Test, the spec files are named after the component and mount its story through a component gallery, as the [Playwright documentation](https://playwright.dev/docs/test-components) describes: the hook runs those named after the edited component.

When a test runner finds no test related to the changed component, the hook asks Claude to offer the component's accessibility tests, written with `a11y-test-writer`. Once the team agrees, it gets them, and the hook runs them from then on.

The audit only covers forms for now: a `<form>` element or an element with `role="form"`, as the RGAA glossary defines a form, with the components rendered inside it. When Claude writes or edits a file that holds a form, the hook asks for its audit even if every check passes.

When Claude's final answer cites a criterion of the table that the inventory of the audited form did not open, a `Stop` hook, `answer-guard`, sends the answer back once: the audit reports the criteria of its validated reports, never one more as a possibility. It also sends back an answer that rules on a form Claude read without running any audit inventory, towards the skill or, for several components, the agent. And it sends back the answer of a session of `a11y-test-writer` that wrote test files without checking them with `verify-tests`.

The skills and the agent need nothing else: ask Claude to audit a form, to write the accessibility tests of a component, or to review the forms of a folder or a branch.

## See the two verdicts

The `playground` folder holds a login form built test-first against WCAG 2.2. It meets WCAG 2.2 AA but fails RGAA 4.1.2 on purpose, because it does not show which fields are required before submission (criterion 11.10).

```bash
pnpm install
```

```bash
pnpm --dir playground exec playwright install chromium-headless-shell
```

```bash
pnpm --dir playground test
```

```bash
pnpm --dir playground test:rgaa
```

Both run the jsdom tests and the browser tests in Chromium. The first passes, the second fails on 11.10. In a Claude Code session with the plugin, an edit of `LoginForm.tsx` makes the hook ask for the audit of the form under both standards, and under RGAA 4.1.2 it also names the failing tests.

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
| `lint-tools.ts`, `test-tools.ts` | Adapters: the command and report of Biome, ESLint, Vitest, Jest and Playwright Test |
| `choose-tools.ts` | Factory: chooses those tools from the dependencies of the package |
| `read-reports.ts` | Anti-corruption layer: turns each tool's report, and the package dependencies, into domain types |
| `main.ts` | Composition root: reads the event, the plugin option and the package dependencies, wires the adapters |

The two other hooks keep the same split, with a pure function in the domain and a `main.ts` that reads the event:

| File | Role |
| --- | --- |
| `reviewer-guard/guard-command.ts` | Domain: allows a command of the `a11y-reviewer` agent only when it is a script of the audit skill or a read-only git command |
| `answer-guard/cited-criteria.ts`, `answer-guard/opened-criteria.ts` | Domain: the criteria the final answer cites, and those the inventories of the transcript opened |
| `answer-guard/guard-answer.ts` | Use case: sends the answer back when it cites a criterion that no inventory opened |

The skills keep the same split in their scripts:

| File | Role |
| --- | --- |
| `a11y-component-audit/scripts/find-criterion.ts` | Domain: finds a criterion, its tests and methodology in the official texts |
| `a11y-component-audit/scripts/inventory.ts` | Domain: finds the form and its elements in the code, with the criteria each one opens |
| `a11y-component-audit/scripts/validate-report.ts` | Domain: rejects a report that misquotes a criterion or leaves one of the inventory out |
| `a11y-test-writer/scripts/judge-variants.ts` | Domain: flags a conforming variant that the tests reject, or a faulty one they accept |
| `a11y-test-writer/scripts/verify-variants.ts` | Use case: puts each variant in place of the component, runs the tests, puts the component back |
| `a11y-test-writer/scripts/run-test-file.ts` | Adapter: runs a test file with the first test runner of the package that runs it |
| `main.ts` of each skill | Composition root: the `lookup`, `validate`, `inventory` and `verify-tests` commands |

The skill bundles the official texts it quotes, unmodified, with their sources and licences in [`NOTICE.md`](plugins/a11y-harness/skills/a11y-component-audit/reference/standards/NOTICE.md): WCAG 2.2 and the ACT rules mapping from the W3C, the RGAA 4.1.2 criteria and test methodology from the DINUM. Its rulings on forms, buttons and status messages, each with its source, are in [`reference/forms.md`](plugins/a11y-harness/skills/a11y-component-audit/reference/forms.md).

Everything was written test-first, one test at a time. Stryker requires a 100% mutation score in both places, and each mutant was replayed to check that a failing assertion kills it, not a crash.

The [CI workflow](.github/workflows/ci.yml) runs on each push to `main` and each pull request: type checking, lint and tests on Node 22.18 and 24, the validation of both manifests, the sandbox tests and build, and Stryker in both places.

## Evaluations

The skill and the agent have evaluation cases in `plugins/a11y-harness/evals`, run with and without the plugin:

```bash
claude plugin eval plugins/a11y-harness --scaffold --allow-tools "Bash(node:*)" Write --no-publish
```

`--scaffold` copies the components the agent reviews into each run, `--allow-tools` lets the skills run their scripts and write the tests, and `--no-publish` keeps the report on your machine. Run it from a clean Claude Code profile (`CLAUDE_CONFIG_DIR`), so that no personal configuration skews the results.

On 20 November 2026, with the 19 cases of the suite, Claude Code 2.1.326, this command, `--runs 3` and `-j 4`, Claude passed 54 runs out of 57 with the plugin, and 19 out of 57 without it. The hook that offers a test runner to a package without one came after this series; no case covers it yet.

| Case | Standard | With the plugin | Without |
| --- | --- | --- | --- |
| Field named only by a placeholder | WCAG 2.2 | 3/3 | 0/3 |
| Field named only by `aria-label` | RGAA 4.1.2 | 3/3 | 2/3 |
| Search field and adjacent button | RGAA 4.1.2 | 3/3 | 1/3 |
| Field named only by `title` | WCAG 2.2 | 3/3 | 3/3 |
| Field named only by `title` | RGAA 4.1.2 | 3/3 | 1/3 |
| Login form | WCAG 2.2 | 3/3 | 0/3 |
| Login form | RGAA 4.1.2 | 3/3 | 0/3 |
| Email field left to native validation | WCAG 2.2 | 3/3 | 2/3 |
| Email field left to native validation | RGAA 4.1.2 | 3/3 | 0/3 |
| Repeated error not announced again by React | WCAG 2.2 | 3/3 | 2/3 |
| Repeated error not announced again by React | RGAA 4.1.2 | 3/3 | 1/3 |
| Icon-only button without a name | WCAG 2.2 | 3/3 | 3/3 |
| Icon-only button without a name | RGAA 4.1.2 | 3/3 | 0/3 |
| A form written by Claude gets audited | WCAG 2.2 | 3/3 | 3/3 |
| Review of three components (agent) | WCAG 2.2 | 1/3 | 1/3 |
| Review of three components (agent) | RGAA 4.1.2 | 3/3 | 0/3 |
| Tests written for a component | WCAG 2.2 | 3/3 | 0/3 |
| Tests written for a component | RGAA 4.1.2 | 2/3 | 0/3 |
| Browser tests written for a form and its stylesheet | WCAG 2.2 | 3/3 | 0/3 |

Without the plugin, Claude never wrote the tests of a standard in their own file, so the grader of the test writing cases had nothing to read. The WCAG review timed out in four runs out of six under four parallel runs; run again on its own, it passed 2 runs out of 3 with the plugin and 2 out of 3 without, and the failed run with the plugin reviewed the files itself instead of handing them to the agent.

After this series, `verify-tests` started to review the test file itself, the `answer-guard` hook started to send back an answer on a form read without any audit inventory, or with tests that `verify-tests` never checked, and the test writer started to focus a field before checking a text passage. Run again one at a time with the plugin, the two review cases passed 6 runs out of 6, and the test writing cases 3 out of 3 under WCAG 2.2 and 1 out of 3 under RGAA 4.1.2. The RGAA case varied from 0 to 2 runs out of 3 across the runs of the day: its grader fails a test that rejects a conforming technique, which `verify-tests` would catch in a project whose test runner is installed, but not in the evaluation sandbox, where it can only answer `no-test-runner`.

## Limits

- **Conformance is not accessibility.** The audit reports conformance only: what the standard requires, never a good practice it does not require. WCAG accepts compromises: a target of 24 by 24 CSS pixels meets 2.5.8 at level AA, where 2.5.5 asks for 44 at level AAA.
- **What a screen reader says is not tested.** The tests check the accessibility tree that assistive technologies read, and, in a browser, what depends on rendering. The skill writes no test yet for zoom (1.4.4) or reflow (1.4.10), though a browser could check them: it lists them, with what a screen reader actually announces, as checks to make by hand.
- **The agent is read-only.** It has no `Write` or `Edit` tool, and a `PreToolUse` hook of the plugin only lets its `Bash` run the skill's scripts and `git diff`, `git log` or `git show`, each on its own. Claude Code ignores the hooks written in a plugin agent's own definition, so the hook is declared for the whole plugin and recognises the agent by its name.
- **The answer guard reads the transcripts of the agent where Claude Code stores them.** Claude Code does not document that folder, next to the session's transcript. If it moves, the guard finds no inventory and lets every answer through.
- **The WCAG references of the RGAA are WCAG 2.1.** The skill says so when it quotes them, and never presents them as WCAG 2.2 criteria.

## Roadmap

- Skills to fix a defect by offering the fixes the standard accepts, to fill a complete RGAA audit grid for a page, and to write the accessibility statement the RGAA requires.
- A generic set of tests, shipped with the plugin, that the hook runs on any component that renders without props.
- An agent that drives a real browser over a whole page, beyond the components that have tests.
- A hook that refuses a report until `validate` accepts it.
- Evaluation sandboxes that install the test runners, so that `verify-tests` checks the written tests against their variants during the evaluations too: without them, it can only answer `no-test-runner`.
- Oxlint as a linter, and a plugin option to choose the tools instead of detecting them.
- When the project already uses Stryker, a mutation run of the accessibility tests on the component, reporting only the survivors that touch accessibility attributes (`aria-*`, `role`, `label`, `htmlFor`).
- Reference files for modals, menus and comboboxes.

## Licence

MIT. The bundled reference texts keep their own licences, listed in `NOTICE.md`.
