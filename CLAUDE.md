# CLAUDE.md

Read `AGENTS.md` first. It is the single source of project guidance; this file only adds what is specific
to Claude Code.

- Commit subjects are one conventional line, no body, no `Co-Authored-By` or "Generated with" trailer.
- Run `npm run quality` before committing; `npm run build` does not run the tests.
- Read stories through `getPublishedStories()`, never `getCollection('stories')` (ESLint errors on it).
- `CLAUDE-assets/` is local scratch material from earlier work and is gitignored. Do not rely on it or
  commit it; anything still true belongs in `docs/roadmap/`.
