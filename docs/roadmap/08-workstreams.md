# Cloud-agent runs

Three runs, in order, each shipping something a family or teacher can feel. Milestones and what "world-class"
means at each are in [README.md](README.md). **Total budget $30; run 1 about $11, run 2 about $10, run 3 about
$9.** A run stops when its scope is done or its budget is spent, whichever is first, and ends with a report.

## Rules (all runs)

- Read `AGENTS.md`, this file and `ux/README.md`'s "How to use this spec". Then only the sections the run lists
  below. `docs/roadmap/ux/` is about 21,000 words; never open it whole, and `ux/06` (art) is not needed.
- Serial small PRs, squashed into `main`, one conventional subject line, `npm run quality` green first.
- **The UX spec defines the look.** Replace the existing CSS with the tokens and components it defines; do not
  extend the old style or invent one. Implement the tokens and `data-band` once; do not fork components per band.
- Every new page ships in all 5 locales. New UI keys go in all five locales; list the `ar`/`tr`/`ur` keys in
  `src/locales/review-queue.json` (`AGENTS.md`) and add a small script that reports the queue per locale.
- No backend, accounts, personal data or third-party requests. State stays on the device.
- **You do not write or edit story content.** Stories, translations, `band` values, art, audio and alt text for
  published art are the owner's and the moderators'. You may draft alt text from images for review.
- Skip a feature rather than stub it. No new documentation beyond keeping `AGENTS.md` and `docs/roadmap/` true. No
  tests unless they guard data loss, filtering or the publish gates.
- The old backlog (`origin/catchup/44-commits`) is a quarry for ideas and code to rewrite, never to merge (`09`).

## Ship, verify, tag (after every PR)

1. `gh pr checks <n> --watch`; squash-merge only when green. This is the only test gate.
2. Wait for the GitHub Pages deploy of that commit. Production is the owner's concern; do not verify it.
3. Smoke-test staging cheaply: `node scripts/verify-build.mjs` on a fresh build, `curl` the pages you changed, and
   compare `<meta name="build" content="<short sha>">` (added in run 1) with your commit. Use a browser
   (Playwright) only for the screens you changed in `de`, `en` and `ar` at 375 px, and locate by role and label
   (`getByRole`), not test ids: the accessibility rules already require every control to have an accessible name.
   If a browser is not available, inspect the built HTML.
4. Tag the verified commit `roadmap-runN-<name>`. If it is broken, fix forward in a small PR or revert the merge.
   The site has no active visitors yet, so there is no backward-compatibility burden.

## Run 1 — A story worth opening (about $11)

Value: Leyla and Maria. One story, read in two ways, looks and sounds finished, with or without art.

- **Foundation.** Tokens, `data-band`, self-hosted fonts per script (drop the Google Fonts import; leave GTM),
  base components. The `story-meta` collection and tightened `src/content.config.ts` per `02`: `band`, line art,
  frames, narration, `reviewedBy`; `storyFormat` removed, pages from `---` breaks; the migration script (the owner
  assigns each story's `band` in frontmatter first; lift it, do not decide it); `.describe()` on every field; the
  emoji + palette fallback when art is missing. Build marker meta. Fix public copy that says "3–7".
- **Reading.** Cover screen, Storybook for bands 1–2 (pictures, narration with word highlight, tap a word, resume),
  End of story and talk cards, Two languages, Settings ("Who reads on this device?"), Lamp mode (bedtime). Pilot:
  Bruno, art in `public/assets/stories/001-bruno/` (`02`).

Read: `02-content-model.md`; `04-reader-and-discovery.md` Reading table; `ux/01` Reading bands; `ux/02` Colour
system, Typography, Spacing, Paste-ready tokens; `ux/03` §4, §5, §7, §8, §9, §15; `ux/04` all; `ux/05` Screen-reader
experience, Pre-reader navigation, Second-language readers, RTL mirroring; `06-reach-and-trust.md` Privacy.

## Run 2 — It grows with the child (about $10)

Value: a 4-year-old and an 11-year-old each land on a home that fits, and find a story fast.

- Reader home, Picture home, Library, Find by feeling, Chapter reader for bands 3–4 (think cards, second-language
  tools), Language switch, System states (empty, loading, error, offline notice), search and filters with URL state,
  language availability. Next-shelf tile, no autoplay. The footer states how art is made.

Read: `04-reader-and-discovery.md` Discovery table; `ux/03` §1a, §1b, §2, §3, §5b, §6, §13, §14; `ux/05` Text
expansion, Arabic and Urdu pitfalls, Dyslexia options; `ux/01` Voice and tone.

## Run 3 — Ready for the classroom and the world (about $9)

Value: Thomas and Frau Yıldız can use it in class, and everyone can trust it.

- Class room (single-screen: Kamishibai and shared reading) and class links, educator prep sheet, Print and
  colouring with a QR to the story derived from `SITE_URL`, discussion material.
- Offline with a service worker behind `PUBLIC_OFFLINE=1`, **off by default**, tested with the flag on in a local
  build. Accessibility verified (keyboard path, focus, contrast, reduced motion, live regions, RTL checks) and
  fixed; responsive images and budgets; Open Graph, `hreflang`, structured data; privacy page in five locales
  stating GTM plainly, and the "forget this device" control; remaining hardcoded strings to locale JSON.
- Re-run the audit from `01`'s quality bars; report fixed, deferred, rejected, with reasons. Report Lighthouse
  before and after.

Read: `05-parents-and-educators.md`; `ux/03` §10 (not two-screen mode), §11, §12; `ux/05` Testing checklist;
`06-reach-and-trust.md`; `01-vision.md` quality bars.

Not in any run: Class room two-screen mode, My reading list, pre-built PDF class packs, "Read it in my voice".

## Owner and parallel tasks

- **CMS** (Pages CMS, `03`) is being set up by the owner in parallel and is outside the agent's scope. The schema in
  `src/content.config.ts` is its contract: give every field a `.describe()` string and do not rename fields after
  run 1 without noting it in the PR.
- Generate the pilot art and audio (templates in `ux/06`); assign `band` to existing stories (`02`); native review
  of `review-queue.json`; invite moderators; the open decisions in `README.md`.
- Pilot story **Bruno** (`001-bruno`): `cover.webp`, `line-NN.svg`, `frame-NN.webp`, `colour-NN.svg` and
  `audio/{locale}.m4a` in `public/assets/stories/001-bruno/`.

## Next

(Filled in by the agent at the end of each run.)
