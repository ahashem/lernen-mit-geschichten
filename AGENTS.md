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

**Publishing is opt-in.** Only a story file with `status: published` goes live; a missing status is a
draft and gets no page, no listing and no sitemap entry in production. Each locale's file carries its own status. Read the collection through `getPublishedStories()` in `src/utils/stories.ts`;
calling `getCollection('stories')` directly bypasses the gate and leaks a draft into one surface
while the others hide it.

**UI strings for the roadmap.** The string freeze is lifted for the work in `docs/roadmap/`. The agent writes
every new key in all five locales. Its `ar`/`tr`/`ur` strings are machine drafts that go live before a native
review, which the owner has accepted for interface labels (never for story text). Each such key is recorded in
`src/locales/review-queue.json` (`{ "ar": ["key", …], "tr": […], "ur": […] }`) and removed once a native speaker
signs it off. Outside the roadmap work, a change that adds keys still needs a native reviewer on the PR.

**Folio.** `/folio` (and `/{locale}/folio`) lays out every published story of that language as A4 sheets for printing: a title page, an index of skills with the story numbers that practise them, then each story with its talk prompts and a QR code. It is built from the same catalogue as the Library, so it needs no upkeep; the browser's print dialog handles single- or double-sided.

**Feedback.** `PUBLIC_FEEDBACK_EMAIL` at build time turns on the "Tell us about this story" `mailto:` link on story pages and About; unset, nothing renders. The address never enters source.

**Own voice.** A grown-up's recordings ("Read it in my voice", bands 1-2) live in the browser's IndexedDB database `lmg-voice`, keyed by story, locale and page with a hash of the page text; a changed text drops the match. They never leave the device, and the privacy page's forget control deletes the database.

**Analytics.** `PUBLIC_GTM_ID` at build time enables Google Analytics through Google Tag Manager, behind a consent
gate (`ConsentBanner.astro`, `GTMTracking.astro`, `utils/consent.ts`): nothing loads from Google until a grown-up
allows it, the choice (`reader-consent`) is changed on the privacy page and cleared by "Forget this device", and the
banner never shows over a story being read. Only analytics storage is granted; advertising signals stay denied. The
GTM container itself must hold only the GA4 tag.

**Offline.** `PUBLIC_OFFLINE=1` at build time registers a service worker (`src/pages/sw.js.ts`) and links a manifest; it ships
off, and without it `sw.js` removes itself and its `lmg-*` caches. Never enable it in a deploy without the owner.

The moderators' pages open in English, with Arabic in `ar/` and German in `de/`. The status page (`preview/status/`; built from `editorial` by `scripts/preview-status.mjs`, preview only, never in production; the wording is in `scripts/status-messages.mjs`) has a machine-readable twin, `preview/status/status.json`: the checked `commit`, the `build` result and, per story and language, its `status` with `must` (needed before it can go live) and `should` items. Tools read that, never the HTML. Beside it, `preview/review/` (`scripts/review-sheet.mjs`, wording in
`scripts/review-messages.mjs`, same three languages, preview only) is the reviewers' sheet: per story, every language side
by side page by page with the pictures, alt texts, what is still needed and the review checklists from `03`.
`preview/guide/` (the moderators' guide) and `preview/art/` (pictures to 1200 px WebP with the right names, done in the
browser, nothing uploaded) come from `scripts/moderator-pages.mjs`, wording in `scripts/moderator-messages.mjs`; the
guide links the CMS from the `CMS_URL` repository variable and must change with the CMS labels in `.pages.yml`.

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

Static Astro site that teaches children values and behavioural skills through multilingual stories. It starts
with ages 3–7 and grows with the child up to Klasse 6 (about age 12). Locales: `de` (default), `ar`, `en`, `tr`,
`ur`; `ar`/`ur` are RTL. No backend, no accounts, no personal data; reader state lives on the device. Every
push to `main` deploys staging (GitHub Pages, subpath, `noindex`) and production (https://mitgeschichten.com/,
Hostinger, root, `npm run build` only), so the PR check is the only test gate.

Product direction, the UX spec and the work plan are in `docs/roadmap/`; start at its `README.md`. Those specs
outrank any existing look or feature.

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
- **Branches.** `editorial` is the default branch: the CMS commits to it and `editorial-publish.yml` squash-merges
  it into `main` through a pull request when the checks pass (`docs/roadmap/03`). Code changes go through pull requests with `--base main`. The
  Pages site shows `main` at the root and `editorial` at `/preview/`, both with drafts (`SHOW_DRAFTS=1` plus
  `NOINDEX=1`; a production build never shows them).
- **Stories.** `src/content.config.ts` defines `stories` (one Markdown file per locale, joined by `storyId`). Language-neutral fields (`band`, `cover`, `frames`, `palette`,
  `art`) live only in the German file and are read through `getStoryMeta()`; other locales carry `coverAlt` and
  `frameAlts`. `.pages.yml` configures the CMS from this schema (every frontmatter key must be a field of its language's form, hidden
  or visible, or the CMS drops it on save; the gate checks this); a field added, renamed or removed in
  `src/content.config.ts` has to be mirrored there (an agent notes it in the PR; the owner edits `.pages.yml`). Astro 7 semantics:
  `entry.id` (includes the locale, `de/bruno`) and `render(entry)`. Both story routes render
  `components/reader/StoryPage.astro`: a cover, then a page-by-page storybook for bands 1-2 (`reader.ts`), an end
  screen with talk cards, and the full text (also the no-JS view). Pages come from `---` breaks, else are derived
  per band by `utils/story-pages.ts`; recordings (`public/assets/audio/{locale}/{storyId}/{nn}.m4a`) are used only
  with explicit pages, otherwise the device voice reads. `scripts/publish-gates.mjs` reports what stories lack.
- **Shared logic** in `src/utils/`: the skills are files in `src/content/skills` (id, group and one German name; the CMS edits them), read through
  `skills-taxonomy.ts`. Their labels in the other languages are UI strings (`skillLabels`, `skillGroups` in
  `src/locales/*.json`), so they follow the usual translation and review-queue flow. A story's `skills` and `emoji` are set in the German file, like `band`; a translation may carry its own
  `skills` only if its story really differs (the gate reports it), and `publish-gates.mjs` fails on an unknown id. Changing a skill id breaks story frontmatter. `filter-stories.ts` (`matchesFilter`: AND across filter types, OR within one),
  `story-availability.ts`, `booklet-export.ts`.
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
- Ship machine-translated story text, or UI strings that are not listed in `src/locales/review-queue.json`.
- Skip or weaken tests to get a change through, or add a `prebuild` script (production does not tolerate
  it).
- Link to pages that do not exist, or add a German-only page.
- Abstract ahead of need.

## Known gaps

- Legacy `locale === 'de' ? …` ternaries still hold UI text in a few components.
- `de/001-bruno-interactive.md` is a draft with placeholder image URLs and its own page text; it is not folded into `001-bruno` yet.
