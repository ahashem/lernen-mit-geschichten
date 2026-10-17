# Workstreams

Ordered work for an autonomous coding agent. **Budget: $30 hard cap; stop and report at about $25.** Read
`AGENTS.md` first, then `ux/` and the spec each workstream names.

## Rules

- Serial. Each workstream is one or more small PRs, squashed into `main` with a single conventional subject line,
  `npm run quality` green first. Shared files (`InteractiveStorybook`, `ReadingControls`, the story page,
  `BaseLayout`) collide, so never run two workstreams at once.
- **The UX spec in `ux/` defines the look.** Do not extend the existing CSS; replace it with the tokens and
  components the spec defines. Do not invent a style.
- Every new page ships in all 5 locales. New UI keys: write all five locales, and list the `ar`/`tr`/`ur`
  keys in `src/locales/review-queue.json` (see `AGENTS.md`). Add a small script that reports the queue per locale.
- No backend, accounts, personal data or third-party requests. All state on the device.
- Skip a feature rather than stub it. No new documentation beyond keeping `AGENTS.md` and `docs/roadmap/` true. No
  tests unless they guard data loss, filtering or the publish gates.
- The old backlog (`origin/catchup/44-commits`) is a source of ideas and code to rewrite, not to merge. See `09`.
- If a browser (Playwright) is available, verify in it; otherwise build and inspect the HTML.

## Ship, verify, tag

Every merge to `main` deploys to both GitHub Pages (staging, `noindex`, under a subpath) and production
(https://mitgeschichten.com/, root). The owner tagged `main` before this roadmap started (`pre-roadmap`), so a
restore point exists. After each workstream:

1. Open a PR, wait for the PR check (`gh pr checks <n> --watch`), and squash-merge only when it is green. This is
   the only test gate: pushing to `main` deploys production without running tests. Never skip hooks or tests.
2. Wait for both deploys, then confirm each serves your commit: WS1 adds a `<meta name="build" content="<short
sha>">` to `BaseLayout`; fetch the home page of both sites and compare.
3. Verify on the live sites, not only in the PR: `node scripts/verify-build.mjs` against a fresh build, then a
   browser pass (Playwright if available) over the screens you changed in `de`, `en` and `ar` at 375 px, plus a
   check that a story page and the service worker still load.
4. Tag the verified commit `roadmap-wsN-<name>`. Report the result in the PR or a comment.
5. If verification fails, fix forward in a small PR if the cause is clear; otherwise revert the merge and retag
   nothing. The site has no active visitors yet, so there is no backward-compatibility burden.

## What to read (do not load `ux/` wholesale)

`docs/roadmap/ux/` is about 21,000 words. Read only the rows for the workstream you are on; grep headings rather
than opening whole files. `ux/06` (art) is not needed: you generate no images.

| Workstream   | Read                                                                                                                                                                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 Audit      | `01-vision.md` (quality bars), `ux/README.md` (thesis, people)                                                                                                                                                                                           |
| 1 Foundation | `ux/02` sections Colour system, Typography, Spacing, Paste-ready tokens; `ux/01` Reading bands; `02-content-model.md`; `06-reach-and-trust.md` (Privacy, Performance)                                                                                    |
| 2 Reading    | `ux/03` §4 Story cover, §5 Storybook, §5b Chapter reader, §6, §7 End of story, §8 Two languages, §15 Settings; `ux/04` all; `ux/05` Screen-reader experience, Pre-reader navigation, Second-language readers; `04-reader-and-discovery.md` Reading table |
| 3 Finding    | `ux/03` §1a Reader home, §1b Picture home, §2 Library, §3 Find by feeling; `04-reader-and-discovery.md` Discovery table                                                                                                                                  |
| 4 Together   | `ux/03` §9 Lamp mode, §10 Class room, §11 Print and colouring; `05-parents-and-educators.md`                                                                                                                                                             |
| 5 Trust      | `ux/03` §12 Offline, §13 Language switch, §14 System states; `ux/05` RTL mirroring, Arabic/Urdu pitfalls, Text expansion, Testing checklist; `06-reach-and-trust.md`                                                                                     |

Always: `AGENTS.md`, this file, and `ux/README.md`'s "How to use this spec".

## Scope of the UX spec

`ux/03-screens.md` defines more than $30 can build. Priority order: Reader home, Library, Story cover,
Storybook (bands 1–2), Chapter reader (bands 3–4), End of story and talk cards, Two languages, Settings ("Who
reads on this device?"), System states, Offline, Language switch; then Picture home, Find by feeling and Lamp
mode; then Print and colouring, Class room single-screen and class links. Not in this budget: Class room
two-screen mode, My reading list, pre-built PDF class packs. Implement tokens and the `data-band` mechanism once
(`ux/README.md`: do not fork components per band).

## 0. Audit (about 5%)

Walk every reader surface at 375 px and 1280 px in `de`, `en`, `ar`, keyboard only. Write a ranked list of what
stops it feeling world-class, measured against `01`. Put it in the first PR description. Known issues to confirm:
text-only standard stories; draft Bruno story with placeholder images; Google Fonts import (`06`); English
`aria-label`s in four components; no manifest or service worker; reduced motion mostly ignored.

## 1. Foundation (about 20%)

- Implement the design tokens, self-hosted fonts per script, and base components from `ux/02`; retire the old
  global styles page by page as screens are rebuilt.
- Implement the reading-level model (4 levels, ages 3–12) in tokens, components and settings per `ux/`, so the
  shell works for a 4-year-old and a Klasse 6 reader. Fix public copy that says "3–7" (README, About page,
  meta descriptions, `package.json`).
- Implement the content model from `02`: tightened `src/content.config.ts`, `story-meta` collection, publish-gate
  validation, the migration script, and the generated fallback (emoji + palette) used when art is missing.
- Remove the Google Fonts import (self-host the fonts). Leave GTM as it is.

## 2. The reading moment (about 25%)

`04` Reading table, screens from `ux/03`: reader modes, pictures with fallback, narration and read-aloud with
highlight, resume, quiet end, next story, bedtime theme, reading comfort.

## 3. Finding stories (about 10%)

`04` Discovery table: find by feeling, shelves, forgiving search and filters with URL state, language availability,
bookshelf, story of the day.

## 4. Reading together (about 10%)

`05`: discussion panel, teacher view, projector mode, print with QR from `SITE_URL`, colouring page flow,
bilingual-as-learning. "Read it in my voice" only if budget remains after 5.

## 5. Trust and delivery (about 20%)

`06`: accessibility verified and fixed, offline with a service worker (base-path aware) behind a build flag, `PUBLIC_OFFLINE=1`, **off by default**; test it
with the flag on in a local build and leave it off in the deployed config, responsive images and
budgets, Open Graph / `hreflang` / structured data, privacy page and clear-my-data control, remaining hardcoded
strings into locale JSON. Report Lighthouse before and after.

## 6. Close the loop (about 5%) and reserve (about 5%)

Re-run the audit; report fixed, deferred, rejected with reasons; update this file's "Next" list in place.

## Parallel and owner tasks

The moderator CMS (Pages CMS, `03`) is being set up by the owner in parallel and is **not** in the agent's scope.
The agent's schema work is its contract: keep `src/content.config.ts` the single source of truth, give every field
a `.describe()` string, and do not rename fields after WS1 lands without noting it in the PR.

Owner: generate art and audio (templates in `ux/06`), invite moderators, native review via
`src/locales/review-queue.json`, open decisions in `README.md`. The pilot story is **Bruno** (`001-bruno`); its
assets go in `public/assets/stories/001-bruno/` as `cover.webp`, `line-NN.svg`, `frame-NN.webp`, `colour-NN.svg`
and `audio/{locale}.m4a` (`02`). WS2 uses them to verify the reader. The agent drafts alt text from the images for
owner review.

## Next

(Filled in by the agent at the end of the run.)
