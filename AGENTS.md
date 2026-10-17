# AGENTS.md

## This repository is public

No origins, credentials, personal data, or analytics IDs in source. Every deploy
supplies its own through the environment.

## Once per clone

Git does not clone hooks. `make hooks` points `core.hooksPath` at `.githooks/`, which checks the
conventional prefix on every commit subject. Commit format is `CONTRIBUTING.md`; the short version
is that branch commits are squashed, so the squash subject is the one that has to read as a single
conventional line.

## Deployment

One variable describes a deploy. `SITE_URL` is its public URL, and any subpath
becomes Astro's `base`:

| `SITE_URL`                       | site                      | base      |
| -------------------------------- | ------------------------- | --------- |
| `https://example.com`            | `https://example.com`     | `/`       |
| `https://owner.github.io/a-repo` | `https://owner.github.io` | `/a-repo` |

`NOINDEX=1` keeps a deploy out of search results. `BASE_PATH` overrides the
derived base, which is only needed behind a proxy.

Real environment variables win over `.env.local`, which wins over `.env`. The
production host and CI set the first; local work uses the second.

There is one build script, and every deploy is a different environment for it.

Rules:

- A build with no `SITE_URL` fails. Never add a domain as a fallback.
- An unconfigured `npm run build` must stay production-shaped: root-mounted and
  indexable. The production host picks which script runs and we cannot change
  that, so the default has to be the safe one. Deviations opt in.
- Never rename the `build` script, and never put a domain in a package script.
- Branch on `import.meta.env.NOINDEX`, never on a hostname.
- `astro preview` re-reads the config, so it needs the same environment as the
  build that produced `dist`. Keeping it in `.env.local` is what makes
  `npm run build && npm run preview` agree.
- A wrong base shows up only as 404s on every asset. After touching
  `astro.config.mjs`, build once at a root URL and once at a subpath URL, then
  check the asset hrefs in `dist/index.html`.

## Localization

Stories live at `src/content/stories/<locale>/<slug>.md` and are joined across locales by the
`storyId` in their frontmatter, not by filename. Coverage is uneven, so check before assuming a
translation exists:

```sh
node scripts/content-report.mjs            # which stories are missing which languages
node scripts/content-report.mjs --matrix   # the full per-story grid
```

**Unpublishing.** Set `status: draft` in a story's frontmatter — it then gets no page, no listing
and no sitemap entry. Read the collection through `getPublishedStories()` in `src/utils/stories.ts`;
calling `getCollection('stories')` directly bypasses the gate and leaks a draft into one surface
while the others hide it.

**Current policy — string freeze.** Do not merge work that adds new UI translation keys. The string
surface is the binding constraint on shipping the feature backlog, and it is being routed through a
translation pipeline before it is allowed to grow. Fixing or translating existing keys is always
fine. This lifts when the pipeline lands; until then, a change that needs new keys is a conversation,
not a merge.

## Verifying a build

`scripts/verify-build.mjs` walks every HTML file in `dist/`, resolves internal `href`/`src` against
real output, and cross-checks the sitemap. It detects the base path from the build itself, so it
works for a root deploy and a subpath deploy alike.

```sh
SITE_URL=https://example.com npm run build && node scripts/verify-build.mjs
```

It exits non-zero only on leaked runtime error strings. Broken links are reported without failing,
because pages that exist in German but not the other four locales would fail every run. Use it as a
diff against the previous run, not as a gate.

## Project

Static Astro site that teaches children values and behavioural skills through multilingual stories. It
starts with ages 3–7 (kita and early primary) and grows with the child up to Klasse 6 (about age 12). Locales: `de` (default), `ar`, `en`, `tr`, `ur`; `ar`/`ur` are RTL. No backend, no accounts, no
personal data; reader state lives in `localStorage`. Stories are the product. Staging is GitHub Pages
(`.github/workflows/deploy.yml`, builds `main` under a subpath, `NOINDEX=1`); production is
https://mitgeschichten.com/ on Hostinger, root-mounted, built from the same commit by `npm run build`
only, so CI is the only place tests run.

Where the product is going, and what "world-class" means here, is specified in `docs/roadmap/`. Start
at its `README.md`; the specs there outrank any existing look or feature.

## Commands

```sh
npm run dev             # http://localhost:4321 (needs SITE_URL in .env.local)
npm run quality         # format:check + lint + test; run before every commit
npm run test -- -t "name"        # single test; vitest only collects src/**/*.test.ts
npm run build && node scripts/verify-build.mjs
node scripts/content-report.mjs  # translation coverage per story
```

Node >= 24.

## Architecture

- **i18n.** `src/locales/{de,ar,en,tr,ur}.json`, read with `getTranslation(locale, key)` from
  `src/utils/i18n.ts` (typed against the German keys, falls back to German). A new key goes in all five
  files. Never hardcode UI text; `locale === 'de' ? … : …` is for building URLs only.
- **Routing, two files per route.** `prefixDefaultLocale: false`: German at `/route`, others at
  `/{locale}/route`. Add `src/pages/{route}.astro` and `src/pages/[locale]/{route}.astro` (one
  `getStaticPaths` over `ar`, `en`, `tr`, `ur`); copy `about`. Every page ships in all five locales in
  the same change. `404.astro` is the one exception: hosts serve a single error document.
- **Base path.** Import `BASE_PATH` from `@utils/site` and prefix every root-relative `href`, `src` and
  `window.location` assignment. Astro rewrites markup but not JS string literals.
- **Stories.** `src/content.config.ts` defines one `stories` collection over
  `src/content/stories/{locale}/*.md`. Astro 7 semantics: `entry.id` (includes the locale, `de/bruno`) and
  `render(entry)`. Translations of a story are separate files joined by `storyId`.
  `src/pages/stories/[...slug].astro` builds the German pages plus bilingual pairs
  (`/stories/{slug}-{primary}-{secondary}`, whitelisted in `commonPairs`); the `[locale]/` twin covers the
  rest. Formats: `standard` (markdown + `QuizInteractive`) and `interactive` (`pages[]` driving
  `InteractiveStorybook.astro`).
- **Shared logic** in `src/utils/`: `skills-taxonomy.ts` (58 skills; changing an id breaks story
  frontmatter), `filter-stories.ts` (`matchesFilter`: AND across filter types, OR within one),
  `story-availability.ts`, `text-to-speech.ts`, `booklet-export.ts`.
- `src/layouts/BaseLayout.astro` is the only layout (`lang`/`dir`, meta/OG, language selector). Pages must
  not hand-roll `<html>`.

## Conventions

- `.astro` components with scoped `<style>`; React islands only where state earns it; no Vue/Svelte, no CSS
  framework. Path aliases: `@components`, `@utils`, `@layouts`, `@styles`, `@/`.
- Scoped CSS, custom properties for theming, mobile-first, `[dir="rtl"]` overrides; check Arabic and Urdu
  after any layout change. The visual direction comes from `docs/roadmap/ux/`, not from existing CSS.
- Accessibility is a requirement: WCAG 2.1 AA, keyboard reachable, labelled controls, 4.5:1 contrast, 44px
  targets, `prefers-reduced-motion`.
- Prettier: single quotes, semicolons, 2 spaces, 100 cols, `arrowParens: avoid`, `trailingComma: es5`.
  TypeScript is `astro/tsconfigs/strict`.
- Comments say why, only where it is non-obvious. One line where one line does.
- Commits an AI writes: one conventional subject line, no body, no author or attribution trailer
  (`CONTRIBUTING.md` has the full rule; `make hooks` installs the check). Types are the Conventional
  Commits set plus `content:`.

## Don't

- Add accounts, a backend or any personal-data collection to the site.
- Ship machine-translated UI strings or story text without a human reviewer.
- Skip or weaken tests to get a change through, or add a `prebuild` script (production does not tolerate
  it).
- Link to pages that do not exist, or add a German-only page.
- Abstract ahead of need.

## Known gaps

- Legacy `locale === 'de' ? …` ternaries still hold UI text in a few components.
- `GTMTracking.astro` is wired into `BaseLayout.astro` with no consent gate.
- `de/001-bruno-interactive.md` is a draft with placeholder image URLs.
