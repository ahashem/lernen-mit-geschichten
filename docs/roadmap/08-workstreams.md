# Workstreams

Ordered work for an autonomous coding agent. **Budget: $30 hard cap; stop and report at about $25.** Read
`AGENTS.md` first, then `ux/` and the spec each workstream names.

## Rules

- Serial, one squashed PR per workstream, one conventional subject line, `npm run quality` green before each PR.
  Shared files (`InteractiveStorybook`, `ReadingControls`, the story page, `BaseLayout`) collide.
- **The UX spec in `ux/` defines the look.** Do not extend the existing CSS; replace it with the tokens and
  components the spec defines. Do not invent a style.
- Every new page ships in all 5 locales. New UI keys: write `de` and `en`, draft `ar`/`tr`/`ur`, and list those
  keys in the PR for native review (string-freeze exemption, see `README.md`).
- No backend, accounts, personal data or third-party requests. All state on the device.
- Skip a feature rather than stub it. No new documentation beyond keeping `AGENTS.md` and `docs/roadmap/` true. No
  tests unless they guard data loss, filtering or the publish gates.
- The old backlog (`origin/catchup/44-commits`) is a source of ideas and code to rewrite, not to merge. See `09`.
- If a browser (Playwright) is available, verify in it; otherwise build and inspect the HTML.

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
text-only standard stories; draft Bruno story with placeholder images; Google Fonts import and GTM (`06`); English
`aria-label`s in four components; no manifest or service worker; reduced motion mostly ignored.

## 1. Foundation (about 20%)

- Implement the design tokens, self-hosted fonts per script, and base components from `ux/02`; retire the old
  global styles page by page as screens are rebuilt.
- Implement the reading-level model (4 levels, ages 3–12) in tokens, components and settings per `ux/`, so the
  shell works for a 4-year-old and a Klasse 6 reader. Fix public copy that says "3–7" (README, About page,
  meta descriptions, `package.json`).
- Implement the content model from `02`: tightened `src/content.config.ts`, `story-meta` collection, publish-gate
  validation, the migration script, and the generated fallback (emoji + palette) used when art is missing.
- Remove the Google Fonts import and ungated GTM.

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

`06`: accessibility verified and fixed, offline with service worker (base-path aware), responsive images and
budgets, Open Graph / `hreflang` / structured data, privacy page and clear-my-data control, remaining hardcoded
strings into locale JSON. Report Lighthouse before and after.

## 6. Close the loop (about 5%) and reserve (about 5%)

Re-run the audit; report fixed, deferred, rejected with reasons; update this file's "Next" list in place.

## Not in this budget (owner tasks)

CMS setup and hosting (`03`), generating the first art and audio (`ux/06` has the templates), invite moderators,
native review of drafted translations, decisions in `README.md`.

## Next

(Filled in by the agent at the end of the run.)
