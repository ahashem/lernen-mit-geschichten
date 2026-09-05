# AGENTS.md

## Project

**Lernen mit Geschichten** — a non-profit static site teaching children ages 3–7 values and
behavioural skills through multilingual stories. Astro + MDX, React only for interactive islands,
scoped CSS, TypeScript strict. Five locales: `de` (default), `ar`, `en`, `tr`, `ur`; Arabic and Urdu
render RTL. No backend, no auth, no personal data — all state is `localStorage`.

Stories are the product; games, creation tools, and gamification are secondary layers on top.

## Status: the site is mid-rework

Active development runs as a spike branch that gets split into features and rolled out
progressively, so large parts of the site are still changing. The constraints below — public repo,
deployment, the five rules — are settled and hold across that churn. **Architecture map** and
**Known gaps** are a snapshot of where the code stands today; check them against the code before
relying on either, and update them when a rollout lands.

## This repository is public

No origins, credentials, personal data, or analytics IDs in source. Every deploy supplies its own
through the environment.

## Deployment

One variable describes a deploy. `SITE_URL` is its public URL, and any subpath becomes Astro's
`base`:

| `SITE_URL`                       | site                      | base      |
| -------------------------------- | ------------------------- | --------- |
| `https://example.com`            | `https://example.com`     | `/`       |
| `https://owner.github.io/a-repo` | `https://owner.github.io` | `/a-repo` |

`NOINDEX=1` keeps a deploy out of search results. `BASE_PATH` overrides the derived base, needed only
behind a proxy. Real environment variables beat `.env.local`, which beats `.env`.

- A build with no `SITE_URL` fails. Never add a domain as a fallback.
- There is one build script and every deploy is a different environment for it. An unconfigured
  `npm run build` must stay production-shaped — root-mounted and indexable — because the production
  host chooses which script runs and we cannot change that. Deviations opt in.
- Never rename the `build` script, and never put a domain in a package script.
- Branch on `import.meta.env.NOINDEX`, never on a hostname.
- `astro preview` re-reads the config, so it needs the same environment as the build that produced
  `dist`. Keeping it in `.env.local` is what makes build and preview agree.
- A wrong base shows up only as 404s on every asset. After touching `astro.config.mjs`, build once
  at a root URL and once at a subpath URL, then check the asset hrefs in `dist/index.html`.

## Commands

| Task                        | Command                                          |
| --------------------------- | ------------------------------------------------ |
| Dev server (`:4321`)        | `npm run dev`                                    |
| Build                       | `npm run build` (needs `SITE_URL`)               |
| Preview `dist/`             | `npm run preview` (same env as the build)        |
| Tests                       | `npm run test`                                   |
| Lint / format               | `npm run lint` / `npm run format`                |
| Full gate                   | `npm run quality`                                |
| Audit built links & sitemap | `npm run build && node scripts/verify-build.mjs` |

Node version is pinned in `.nvmrc`. Nothing runs tests as a build hook, so run `npm run quality`
yourself before committing.

`astro dev` and `astro preview` run as background daemons. Stop them with `astro dev stop` /
`astro preview stop` — killing the npm wrapper leaves the server holding the port, and the stale
server then answers your next request and looks like a broken build.

## Five rules that break the build or the site if ignored

1. **Every page ships in all 5 locales.** Each route needs both `src/pages/{route}.astro` (German,
   unprefixed) and `src/pages/[locale]/{route}.astro` (a `getStaticPaths` covering `ar`/`en`/`tr`/`ur`).
   Model on `about.astro` + `[locale]/about.astro`.
2. **Prefix every internal URL with the base path.** `import { BASE_PATH as base } from '@utils/site'`,
   then `` `${base}/route` ``. Astro rewrites base paths in markup but not in JS string literals, so
   `window.location.href = '/foo'` inside a client `<script>` is a silent production bug — it works
   at the root and 404s under a subpath.
3. **No hardcoded UI strings.** Add the key to `src/locales/{locale}-{category}.json` for all five
   locales and read it with `getTranslation(locale, key)`. Categories are `core`, `stories`, `games`,
   `create`, `features`, merged into one flat namespace at runtime, so keys must be unique across
   categories. `i18n.ts` imports all 25 files statically — a new category needs code there, dropping
   a JSON file in the folder does nothing. The game-specific files in that folder are not merged.
4. **Accessibility is a requirement, not polish.** WCAG 2.1 AA: keyboard reachable, ARIA labels,
   4.5:1 contrast, 44×44px touch targets. Verify RTL with `[dir="rtl"]` after any layout change.
5. **Don't skip or weaken tests to get a build through.**

## Architecture map (snapshot)

- `src/utils/i18n.ts` — merges the locale JSON files; `getTranslation`, `isRTL`, `Locale` type.
- `src/utils/site.ts` — `BASE_PATH`, derived from `import.meta.env.BASE_URL` with the trailing slash
  stripped. The single source for link prefixing.
- `src/content.config.ts` — Zod schema for the `stories` collection, loaded with the Content Layer
  API: `entry.id` is locale-prefixed (e.g. `de/bruno`) and rendering goes through `render(entry)`.
- `src/pages/stories/[...slug].astro` — German story pages plus generated bilingual side-by-side
  routes (`{slug}-{primary}-{secondary}`), matched across locales by shared `storyId`.
  `src/pages/[locale]/stories/[...slug].astro` serves the other four locales.
- `src/utils/skills-taxonomy.ts` — skills grouped under `emotional`, `social`, `cognitive`,
  `behavioral` (US spelling in code), with per-locale labels; stories map to 1–3.
- `src/layouts/BaseLayout.astro` — the only layout; owns `lang`/`dir`, meta tags, global chrome.
- `src/utils/*` — self-contained feature modules (games, pets, quests, TTS, audio), each owning its
  own `localStorage` key.

Story frontmatter requires `title`, `emoji`, `skills`, `storyId`, `languages`; `storyFormat` selects
`standard` (markdown + quiz) or `interactive` (`pages[]` array driving `InteractiveStorybook.astro`).

## Style

Formatting and linting are enforced by config — run `npm run format`, don't hand-tune. Import through
the path aliases declared in `tsconfig.json`. Prefer `.astro` with scoped `<style>`; reach for a React
island only when state genuinely warrants it. CSS custom properties for theming, mobile-first.
Commits follow Conventional Commits.

## Known gaps (snapshot) — read before "fixing" a 404

1. **Most German pages have no `[locale]/` sibling.** Only `about`, `achievements`, `index`,
   `progress`, `story-map`, and `stories/[...slug]` exist for ar/en/tr/ur. Their nav links already
   point at `/{locale}/…`, so those URLs 404 today. `src/pages/404.astro` redirects client-side to
   the visitor's locale homepage — a stopgap, not a fix. Close the gap by adding `[locale]/` files;
   don't add new German-only pages on top of it.
2. **Routes with no page in any language.** The games hub links to `sliding-puzzles`,
   `building-blocks`, `emotion-matching`, `whack-a-mole`, `cooking-game`, `word-search`,
   `rhyme-time`; `CategoryDashboard.astro` links to `/create`, `/pets`, `/tools`; `my-comics.astro`
   links to `/comic-viewer`. These were never built — not a base-path or locale problem.
3. `keystatic.config.tsx` sits in the root but `@keystatic/core` is not installed. Dead config.
4. Lint and format debt predates most changes. Before assuming your edit caused a red gate, check the
   same command against the base commit.

`node scripts/verify-build.mjs` walks every HTML file in `dist/`, resolves internal `href`/`src`
against real output, and cross-checks the sitemap. It exits non-zero only on leaked runtime error
strings; broken links are reported but non-fatal, because gaps 1 and 2 would fail every run. Use it
to see whether a change opened or closed a gap — diff the report, don't treat it as a gate.

## Out of scope

No authentication, no backend or database, no analytics beyond the existing GTM hook, no CSS
framework, no third UI framework, no machine-translated strings or story content. Story content must
be age-appropriate for 3–7 and human-reviewed.
