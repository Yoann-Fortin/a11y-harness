# a11y-harness

Accessibility plugin for Claude Code, for React: a hook that feeds lint and axe errors back to Claude, a component audit skill and a read-only reviewer agent. Target standard: WCAG 2.2 AA. RGAA 4.1.2 will be selectable through the plugin's `standard` option.

## Layout

- `.claude-plugin/marketplace.json`: the marketplace, in the same format as the `claude-code-plugins` repository.
- `plugins/a11y-harness/`: the installable plugin (manifest, hooks, skills, agents). No React or Vite dependency here.
- `playground/`: Vite, React and Vitest sandbox. One folder per sample component, with its test next to it. Faulty versions of the sample components are not versioned: they come from Claude running without the harness, at evaluation time.
- `.claude/rules/`: rules scoped to part of the repository, loaded only when a matching file is read or edited.

## Commands

- `pnpm --dir playground test`: Vitest tests
- `pnpm --dir playground lint`: Biome
- `pnpm --dir playground build`: type check and build
- `pnpm --dir playground test:mutation`: Stryker, the build fails below a 100% mutation score
- `claude plugin validate .`: marketplace and plugin manifests

## Before each commit

- Update `CHANGELOG.md`.
- No figure without a source, no absolute path in the repository.
- Hooks, skills and agents are evaluated in a clean profile (`CLAUDE_CONFIG_DIR`), never with a personal `~/.claude` configuration.
