# a11y-harness

Accessibility plugin for Claude Code, for React: a hook that feeds lint and accessibility test failures back to Claude, a component audit skill and a read-only reviewer agent. Target standard: WCAG 2.2 AA by default, or RGAA 4.1.2 through the plugin's `standard` option.

## Layout

- `.claude-plugin/marketplace.json`: the marketplace, in the same format as the `claude-code-plugins` repository.
- `plugins/a11y-harness/`: the installable plugin (manifest, hooks, skills, agents). Its code only imports Node built-in modules, so users install nothing. Tests sit next to the code as `*.test.ts`.
- Root `package.json`: a pnpm workspace that holds the development tools of the plugin (Vitest, Stryker, Biome, TypeScript) and includes `playground/`.
- `playground/`: Vite, React and Vitest sandbox. One folder per sample component, with its test next to it. Faulty versions of the sample components are not versioned: they come from Claude running without the harness, at evaluation time.
- `.claude/rules/`: rules scoped to part of the repository, loaded only when a matching file is read or edited.

## Commands

Run `pnpm install` once at the root.

- `pnpm test`, `pnpm test:mutation`, `pnpm lint`, `pnpm typecheck`: plugin tests, Stryker, Biome and TypeScript at the root
- `pnpm --dir playground test`, `pnpm --dir playground test:mutation`, `pnpm --dir playground build`: the same checks for the sandbox, against WCAG 2.2
- `pnpm --dir playground test:rgaa`: the sandbox tests against RGAA 4.1.2; the login form fails RGAA 11.10 on purpose, to show the two verdicts
- Stryker fails below a 100% mutation score in both places. In the sandbox it runs the tests of both standards, except the intended RGAA 11.10.1 and 11.10.2 failure
- `claude plugin validate .`: marketplace and plugin manifests

## Before each commit

- Update `CHANGELOG.md`.
- No figure without a source, no absolute path in the repository.
- Hooks, skills and agents are evaluated in a clean profile (`CLAUDE_CONFIG_DIR`), never with a personal `~/.claude` configuration.
