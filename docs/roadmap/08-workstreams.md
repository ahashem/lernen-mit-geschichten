# Cloud-agent runs

Three runs, in order, each shipping something a family or teacher can feel. Milestones and what "world-class"
means at each are in [README.md](README.md). **Total budget $30; run 1 about $11, run 2 about $10, run 3 about
$9.** A run stops when its scope is done or its budget is spent, whichever is first, and ends with a report.

## Rules (all runs)

- Read `AGENTS.md`, this file and `ux/README.md`'s "How to use this spec". Then only the sections the run lists
  below. `docs/roadmap/ux/` is about 21,000 words; never open it whole, and `ux/06` (art) is not needed.
- Serial small PRs, squashed into `main` (the default branch is `editorial`, so open them with `--base main`), one conventional subject line, `npm run quality` green first.
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

## Do not

The failure modes of an autonomous agent with merge rights. If a requirement seems to force one of these, stop and
record it in `ux/07-open-questions.md` or the run report; do not improvise.

**Content and assets**

- Do not write or edit story content: text, titles, summaries, key messages, quiz or discussion questions,
  translations, `band`. Frontmatter migrations are mechanical (rename, move, remove fields); never change a value or
  a body.
- Do not generate, download, hotlink or commit images, audio or video, and never use placeholder services. Missing
  art uses the generated fallback. Do not special-case Bruno (or any `storyId`) in code.
- Do not hide existing stories because they lack new fields. Publish gates report counts for what existing stories
  lack (`summary`, `keyMessage`, `reviewedBy`) and fail only with `CONTENT_STRICT=1`, which the owner switches on
  later. Missing summaries fall back to a derived first sentence at render time and are never stored.

**Scope**

- Do not start work from another run, and do not build the CMS (no `.pages.yml`, Keystatic, Drive import).
- Do not merge, rebase or cherry-pick `catchup/44-commits` or the old stash; rewrite an idea from it if the run
  needs one.
- Do not reintroduce games, points, stars, streaks, badges, read counts, leaderboards, shops, pets, quests,
  stickers, autoplay of the next story, or "come back tomorrow" copy.
- Do not touch production or hosting: `.htaccess`, deploy logic in `astro.config.mjs`, `.github/workflows/*`,
  repository settings, branch protection, secrets, Dependabot. Do not verify production.

**Privacy and dependencies**

- Do not add accounts, a backend, cookies, analytics, or any third-party request (CDNs, web fonts, embeds). Do not
  remove or extend GTM. Recordings and bookmarks never leave the device.
- Do not add a CSS framework, a third UI framework, animation libraries, or any dependency beyond self-hosted font
  packages without saying why in the PR. Interaction JS stays under 60 KB gzip per page. Do not bump major
  versions or run `npm audit fix --force`.

**Code and repo hygiene**

- Do not call `getCollection('stories')` directly, disable ESLint rules, skip or weaken tests, use `--no-verify`,
  add a `prebuild` script, rename `build`, force-push, rewrite `main`, or delete branches and tags you did not
  create.
- Do not edit `.pages.yml`: the CMS configuration belongs to the owner, and you cannot see the CMS. If you add,
  rename or remove a field in `src/content.config.ts`, say so in the PR description so the owner can mirror it.
- Do not hardcode UI text, domains or the base path; every internal URL goes through `BASE_PATH`. Do not add
  German-only pages or links to pages that do not exist. Do not rename existing story slugs, `storyId`s or skill ids.
- Do not reformat or refactor files you are not changing. Do not edit the UX spec or roadmap docs except the
  "Next" list, open questions and keeping `AGENTS.md` true. Do not create other documentation, notes or summary files,
  and do not commit screenshots or scratch output.
- Do not enable `PUBLIC_OFFLINE`; it ships off.

**Cost and honesty**

- Do not read more than the run lists, re-read files you have, take screenshots in loops, rerun Lighthouse
  repeatedly, or fan out sub-agents. Do not merge on red or pending checks. Do not leave a PR half done when you
  stop. Do not report something as verified that you did not verify.

## Ship, verify, tag (after every PR)

1. `gh pr checks <n> --watch`; squash-merge only when green. This is the only test gate.
2. Wait for the GitHub Pages deploy of that commit. Production is the owner's concern; do not verify it.
3. Smoke-test staging cheaply: `node scripts/verify-build.mjs` on a fresh build, `curl` the pages you changed, and
   compare `<meta name="build" content="<short sha>">` (added in run 1) with your commit. Use a browser
   (Playwright) only for the screens you changed in `de`, `en` and `ar` at 375 px, and locate by role and label
   (`getByRole`), not test ids: the accessibility rules already require every control to have an accessible name.
   If a browser is not available, inspect the built HTML.
4. Tag every verified feature with an annotated tag named for the milestone and the user-facing feature, not the
   run: `m1-storybook`, `m1-foundation`, `m2-chapter-reader`, `m3-class-room`. The one-line tag message says what a
   reader can now do (`git tag -a m1-storybook -m "Bands 1-2 storybook with narration and word highlight"`). When a
   milestone's scope is complete, tag that commit with the milestone slug from `README.md`
   (`m1-story-worth-opening`, `m2-grows-with-the-child`, `m3-classroom-and-world`). Maintainers use these tags as
   restore points and as release history. If a merge is broken, fix forward in a small PR or revert it. The site has
   no active visitors yet, so there is no backward-compatibility burden.

## Run 1 — M1: A story worth opening (about $11)

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

## Run 2 — M2: It grows with the child (about $10)

Value: a 4-year-old and an 11-year-old each land on a home that fits, and find a story fast.

- Reader home, Picture home, Library, Find by feeling, Chapter reader for bands 3–4 (think cards, second-language
  tools), Language switch, System states (empty, loading, error, offline notice), search and filters with URL state,
  language availability. Next-shelf tile, no autoplay. The footer states how art is made.

Read: `04-reader-and-discovery.md` Discovery table; `ux/03` §1a, §1b, §2, §3, §5b, §6, §13, §14; `ux/05` Text
expansion, Arabic and Urdu pitfalls, Dyslexia options; `ux/01` Voice and tone.

## Run 3 — M3: Ready for the classroom and the world (about $9)

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
- Pilot story **Bruno** (`001-bruno`), assets as in `02` Assets: art in `public/assets/stories/001-bruno/`, German
  narration in `public/assets/audio/de/001-bruno/`. A partial set (cover, a few frames, matching audio pages) is
  enough: the reader must handle the gaps.

## Technical debt (owner, after Run 3)

- Remove the optional `skills` field from the four translation forms in `.pages.yml` so skills are picked once, in
  the German file. Keep the schema override: a genuine adaptation must stay possible.
- Decide as a content question whether the English and Urdu `004-tobi` is a deliberate adaptation or drift. The
  same pass should look at `021-emil-flattergeist` (the German file is in Turkish), `007-fritz-flamingo` (the English
  file holds only German exercises), and the much longer English `009-milo` and `002-fritz`.

## Next

Run 2 shipped the Library, both homes, the chapter reader, the language switch and the 404 in all five locales. In order:

1. **Owner, content.** As before: `---` page breaks for `de/001-bruno`, review of the draft alt text, paragraph structure matching `de` for Two languages. New: no published story is band 3-4 yet, so the chapter reader has only been tried with a throwaway story (`##` headings become chapters); assign a band 3-4 story to see it live. Stories need `summary` for the Library line; until then a derived first sentence shows.
2. **Owner, review.** Native review of `src/locales/review-queue.json` (`node scripts/review-queue.mjs`); it grew by about 45 keys per language.
3. **Owner, CMS.** If you want an editor's pick for the Picture home hero, a `feelings` field, or curated "situations", they need schema fields and `.pages.yml` entries; today the hero is the first picture book (or the one in progress) and situations are the most used skills. Tags `m2-library`, `m2-homes` and `m2-chapter-reader` are local to the Run 2 session (the sandbox cannot push tags): push them from the SHAs in the Run 2 PR.
4. **Run 3** as scoped above. It also inherits the not-yet-possible Run 2 items that need offline: the offline notice, "On this device" marks and offline covers.
5. **M2 leftovers (small).** Chapter reader: paginated columns at 600 px and up, Listen, think cards (7c), second-language tools and editor-marked glosses, add-to-list, Literata for band 3-4 text. Discovery: "How do you feel?" faces and Find by feeling (need character art and a feelings field), feeling and format filters, "Klasse" hint, language default from `navigator.languages`, the 56 px top bar and "For grown-ups" menu, skeleton loading states, 404 "this story in other languages".
6. **M1 leftovers (small).** Spoken first-tap labels and the "?" icon tour; recall and feeling talk cards; the Lamp shelf (`bedtime` tag) and Lamp door on Picture home; "Listen in the dark" for bands 3-4; an in-app "Less motion" switch; preload the one reading font; move `skills` into `story-meta`; fold `001-bruno-interactive` into `001-bruno`; remember the language pair per story.
