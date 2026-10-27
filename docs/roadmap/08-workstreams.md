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

Not in any run: Class room two-screen mode, My reading list, pre-built PDF class packs.

## Runs 4-6: the five test families (about $10 each)

Five test families use the site today, so these runs favour what they feel first and what lets the owner and
moderators fill the library. The CMS v1 is live; art, bands and `feelings` data are not. Each run still ends with
its tags. The milestone slugs wait until M1-M3 scope is closed.

### Run 4: "Tell us, and the library can grow"

Value: a family can tell the owner what to fix in two taps; moderators see what each story lacks and have the fields
the CMS needs next.

- **Feedback loop.** A "Tell us about this story" `mailto:` on every story page and on About, prefilled with the
  story title, locale and band (`07`). The address comes from `PUBLIC_FEEDBACK_EMAIL` at build time (never in
  source); with no address the link is not rendered. Never a third-party widget.
- **Moderator tooling.** Extend `scripts/publish-gates.mjs` to report per story what it lacks: band, summary,
  `keyMessage`, `reviewedBy`, and narration per locale. Add optional schema fields, each with `.describe()`:
  `feelings` (the six faces of `ux/07` #11), an editor's pick, curated situations, vocabulary glosses, think cards
  (`discussion` already exists). Say in the PR which fields to mirror in `.pages.yml`. No UI consumes them yet.
- Remaining hardcoded UI strings (`about`, `settings`, the booklet progress text) move to the locale files.

Read: `07-community-and-growth.md` Feedback loop; `03` Workflow; `02` Schema; `ux/03` §4, §7.

### Run 5: "The first tap speaks"

Value: a pre-reader hears what a control does and can ask for the tour; the Library opens faster.

- Spoken first-tap labels and the "?" tour on Picture home (`ux/05` Pre-reader navigation, `ux/03` §1b), spoken by
  the device voice: no audio files are added. Hide the "?" bubble in a locale where the device has no voice.
- Library performance: remove render-blocking CSS and unneeded work. Images stay as authored (responsive images
  wait for the art pipeline).

Read: `ux/05` Screen-reader experience, Pre-reader navigation; `ux/03` §1b; `ux/04` Gestures and input.

### Run 6: "Read it in my voice"

Value: a parent or grandparent records a story in the family language on the tablet; the child hears that voice.

- Record per page and locale on the device (`ux/04` "Recording your own voice"), stored in IndexedDB, never
  uploaded, played instead of the device voice. Rewrite `utils/voice-recorder.ts` from `catchup/44-commits`; never
  merge it.

Read: `ux/04` Sound, Recording your own voice; `ux/05` Screen-reader experience; `ux/07` #7, #17.

Blocked, do not start: Find by feeling and feeling filters (no `feelings` data), chapter-reader depth and shared
reading (no band 3-4 story), responsive images (no art pipeline), reviewer credit, skills wishlist and partner
handout (no reviewers or partners yet).

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

Handover state after Run 6 and the moderator work (2026-10-18), updated 2026-10-24.

### Since the handover (2026-10-24)

- **Publishing is opt-in (PR 80).** Only a story file with `status: published` goes to production; a missing status is a
  draft. Before this, 64 of 65 files had no status and were live. Staging (the Pages root) now shows drafts too, like
  `/preview/`. Each locale's file carries its own status, so a translation goes live only when it is marked.
- **Production shows only Bruno and Dino (German, PR 81).** They were published by the owner past the publishing gate
  and still lack `summary`, `keyMessage`, `reviewedBy`, `reviewedAt`; Bruno also lacks cover and picture alt texts and
  `art.generator`/`art.reviewedBy`. Every other story waits for a moderator to complete and publish it.
- **Gate fix.** `publish-gates.mjs` read `skills` only as `["a"]`; the CMS writes a block list, so every CMS-saved story
  was reported as having no skills.
- **Home and cards (PR 82).** No "moving up" tile on Reader home shelves (the next shelf is right below, so it repeated a
  story); the picture door reads "For little ones: listen and look" instead of repeating the first shelf's name; Library
  cards no longer list language endonyms (the "Available in" filter and the story page cover it). `ux/03` is updated.
- One blocked CMS save holds back every later one: the publish run is all or nothing.

### What exists

- **Reader (M1-M3 slices):** storybook, chapter reader, homes, Library, language switch, Class room, print pack and class links, privacy page, offline behind `PUBLIC_OFFLINE` (off), "Read it in my voice" (bands 1-2), spoken first tap and "?" tour on Picture home, feedback `mailto` (`PUBLIC_FEEDBACK_EMAIL`), the A4 folio at `/folio`.
- **Moderator tooling:** `scripts/readiness.mjs` (per story and language: needed before it can go live, and worth fixing), the preview-only status page in German, Arabic and English at `/preview/status/` (wording in `scripts/status-messages.mjs`) with `status.json` for tools, the publishing gate (now also blocks a published story whose pictures were never uploaded), the `characters` collection and a story `cast` field, `sync-editorial.yml` (merges `main` into `editorial` after every code merge; verified).
- **Story pipeline** (n8n, LiteLLM, Hermes; lives outside this repo, pack v3.1): moderators start from a short brief, from an already approved text, or from a character idea; everything after approval (translations, pictures, sizes, names, files) is automated, with human gates for the text, the pictures and the review. Not built or run yet. It reads allowed frontmatter keys from `.pages.yml`, drafts character sheets from the approved story, and never writes `reviewedBy`, `reviewedAt` or `author`.
- **Local tags** the sandbox could not push (SHAs in the PRs): `m4-feedback` 1eea470, `m4-moderator-gates` 8e7e048, `m4-booklet-strings` b2d50d8, `m5-first-tap` aad2ade, `m6-own-voice` 80ab3b9, `m4-story-readiness` 8d59902, `m4-characters` 51dc2c2, `m4-status-json` f2da7c5, `m3-folio` fed1bc6, `m3-folio-print` a7f8b39, `publish-opt-in` 476cc93.

### Known issues (found, not fixed)

Mobile, measured at 375 px unless noted. Issues 1-4 are fixed by the phone-usability PR (2026-10-24): a 56 px bar with
Library, language and a "For grown-ups" menu; the filters as a bottom sheet with "Show n stories" and row cards on
phones (about 165 px each); the storybook fits the screen and its text scrolls, so Prev and Next stay visible in `ar`
and `ur` at 320 and 375 px.

1. **Navbar is crowded.** The header takes about 260 px of a 740 px screen: site title, tagline, four links wrapping onto two rows, then the language button. `ux/03` §1a asks for a 56 px top bar with a "For grown-ups" menu.
2. **Library filters are crowded.** Opening "Filter" gives a panel about 800 px tall (skills, shelf, length, language), taller than the screen, with no "show results" or close control. Each story card is about 500 px tall, so 15 stories make a page of about 7,800 px. `ux/03` §2 asks for a bottom sheet "Filter (n)" with chips that stay on one row.
3. **Storybook Prev and Next fall below the fold in Arabic.** In `ar` at 375 x 740 the text panel grows and the two buttons sit at y = 814; in German they sit at 621. `ur` is probably the same. The page text needs its own scroll area or a smaller picture so the controls always stay on screen.
4. The language menu opens over the page title in the Library header.

Other:

5. **Library performance** was Lighthouse mobile 72 in Run 3 and has not been re-measured (no Lighthouse in the sandbox).
6. **About copy is stale** (standard and interactive formats, old features) and the cover's grown-ups panel sits under "Für Pädagoginnen und Pädagogen" although parents use it too.
7. **Folio:** text only (no pictures); checked as Chromium PDFs only (Chromium ignores right-hand page breaks, so no double-sided control); not tried on a printer, Safari or Firefox.
8. **Bruno:** the translations have 11-12 pages against German's 10, so Two languages reading does not work for it; its colour frame is a 1.3 MB PNG; alt texts and `---` page breaks are missing. The status page lists the same for every story (about 80 items).
9. **Machine drafts:** `ar`/`tr`/`ur` UI strings (`src/locales/review-queue.json`), the German and Arabic wording of the status page, and the privacy text all need a native read.

### Next steps, in order

1. **Owner, CMS mirror.** The repo's check rejects any frontmatter key that is not a `.pages.yml` form field. Mirror the `characters` collection and `cast` (snippets in PR 70), and `feelings`, `editorsPick`, `situations`, `glossary`, `thinkCards`. The pipeline needs these first. Add a CMS media folder for character references if they live in the repo (otherwise keep them in your own storage).
2. **Owner, release.** Push the local tags above. Set `PUBLIC_FEEDBACK_EMAIL` in the deploys that show the feedback link. Decide on `PUBLIC_OFFLINE=1` (needs a trial on real kita Wi-Fi). Staging and production still carry Google Tag Manager.
3. **Next engineering run: phone usability.** Fix known issues 1-3: the 56 px top bar and "For grown-ups" menu, the Library filter bottom sheet with compact cards, and the storybook controls staying on screen in `ar`/`ur`. Read `ux/03` §1a, §2, §5, `ux/05` Text expansion and Arabic and Urdu pitfalls; check de, ar and ur at 320 and 375 px. This benefits every user, so do it before more features.
4. **Build the story pipeline** from pack v3.1 on your n8n (Mode 2, "paste approved text", first), then run its quality gate per model alias.
5. **Moderator tools:** the review sheet (`/preview/review/`), the art-prep page (`/preview/art/`) and the moderators' guide (`/preview/guide/`) are live (2026-10-24). Owner: set the `CMS_URL` repository variable so the guide links the CMS, and add top-level `reviewedBy`/`reviewedAt` to the German form in `.pages.yml` (the gate requires them; today only the art section has them). Open decisions: a reviewer-name dropdown (puts moderator names in the public repo), and machine-drafted summaries and alt texts for moderators to accept.
6. **Owner, content and review.** Most urgent since opt-in publishing: production shows only what is marked
   `published`. Fix Bruno (page breaks, translation page counts, alt texts, a WebP frame), assign bands, write `summary` and `keyMessage`, supply a band 3-4 story, `feelings` and the first `thinkCards`. `node scripts/readiness.mjs` and the status page show what each story lacks. Rewrite the About page, then move its copy to the locale files.
7. **Try with the five families:** "Read it in my voice" on a real tablet, the first-tap labels with real device voices in `ar`, `tr`, `ur`.
8. **Once the data exists:** Find by feeling and the faces row (needs `feelings`), Library feeling and format filters, Klasse hint, language default from `navigator.languages`, skeleton loading states; chapter reader depth (paginated columns, Listen, think cards, glosses, second-language tools, add-to-list, Literata) and "Read it in my voice" for bands 3-4.
9. **Later:** Library performance (measure first), responsive images once the art pipeline exists, Class room, print and offline depth (narration toggle, per-page prompts, discussion card `D`, Letter paper, detail switch, "Keep on this device"), recall and feeling talk cards, Lamp shelf and door, "Listen in the dark", an in-app "Less motion" switch, `skills` into `story-meta`, remember the language pair per story.
