---
runs: 1
max_turns: 60
timeout_seconds: 1200
allowed_tools: [Read, Glob, Grep, Skill]
---

src/SearchForm.tsx and its stylesheet have no accessibility tests yet. Write them against WCAG 2.2 AA. It is rendered on its own: no heading, icon or text is displayed around it.
