# Editorial and moderation

The system that lets 2–3 non-technical moderators add and manage stories safely. Moderation is the critical path:
no content, no product.

## Principles

- **Git stays the source of truth.** Every edit is a commit; history is the audit log. No separate database.
- **Moderators never see git.** They use a CMS with an email invite; the CMS commits on their behalf.
- **A second pair of eyes before anything is public, enforced by data.** Moderators save on the `editorial` branch. A
  story goes live only when it is `published`, complete, and `reviewedBy` is someone other than `author`; CI checks
  that on every changed file and publishes automatically when it passes. No admin merge, no waiting.
- **Nothing machine-made ships unreviewed**: text, translations and images all have a named human reviewer.

## The join key

A story is up to five files, one per language, tied together by the `storyId` in their frontmatter: three digits, a
dash and a lowercase name, for example `023-nora`. It must be **exactly the same** in every language file.

- The German file is required. It is the only file that holds the shared fields (`band`, `cover`, `frames`,
  `art`); every other language carries its own text and its own alt text (`coverAlt`, `frameAlts`).
- The CMS checks the pattern when a file is saved. `scripts/publish-gates.mjs` (part of `npm run quality`, so part of
  the PR check) **fails** if a translation's `storyId` has no German file, or if a translation repeats a shared field.
  In the CMS a translation picks its German original from a list, so a typo is not possible there; the gate catches it anywhere else.
- The file name defaults to `{storyId}.md` in every language but is not the join key. Each page's URL comes from
  its file name, so rename a file only on purpose.
- Never change a `storyId` after publishing. Art folders, audio folders and readers' bookmarks all use it.

## Workflow for one new story

Moderators work in the CMS on the `editorial` branch and never see git. Steps 1 to 5 happen outside it.

1. **Brief.** One short note: skills (1 to 3), band, the one key message, the cast, and whether a character is new.
2. **Characters.** Reuse an existing character sheet. A new recurring character needs a sheet and a second moderator's
   approval first, because every later story depends on it. Sheets and prompt notes live in a shared folder, not in
   the repo.
3. **Art in fal.** Generate the cover and one picture per page from the templates in `ux/06` with the character sheet
   attached. Check each picture against the Art checklist.
4. **Prepare files.** 1200 px wide, WebP, named `023-nora_cover.webp` and `023-nora_frame-01_colour.webp`. Line
   drawings and SVG vectorising are an owner job for later and are optional.
5. **Audio (optional).** One recording per page, trimmed and named `01.m4a`, `02.m4a`. Word timings are optional and
   need a technical tool; without them the reader highlights sentences.
6. **German entry.** In the CMS: Stories (German), New. Fill `storyId`, title, emoji, skills (pick from the list), band, summary, key
   message. Skills and emoji are set here only; translations inherit them. Write the text in the editor like a document; a horizontal line starts a new page (page _n_ pairs with picture _n_ and recording _n_). Chapter stories use headings instead. Add questions and the grown-up prompts. `status` is `draft`.
7. **Art and audio.** Upload the cover and page pictures to `assets/stories/023-nora/` and the recordings to
   `assets/audio/de/023-nora/`, choose them in the Cover and Page pictures fields, and write the German alt text.
   Fill "How the art was made" (tool, model, who reviewed it).
8. **Review.** A second moderator checks the text and art against the checklists below and fills in the reviewer
   fields. The CMS cannot force this to be a different person.
9. **Translate.** In each language's collection add a file and pick the German original from the list (the `storyId` is then guaranteed to match): title, summary, key message,
   pages or body, questions and the alt text in that language (`coverAlt`, `frameAlts` in the same order as the
   German pictures). A native speaker reads it and fills `reviewedBy` and `reviewedAt`. Recordings for that language
   go in `assets/audio/<language>/023-nora/`.
10. **Preview.** Every save rebuilds the preview at `…/preview/` (drafts visible, `noindex`). A reviewer opens the
    story's sheet at `…/preview/review/` (all languages side by side with the pictures and the checklists below), reads
    the real page in the preview, with pictures and audio, and fills `reviewedBy` and `reviewedAt` in the CMS.
11. **Publish.** Set `status: published` on the files that are ready; leave unreviewed translations as `draft`. A few
    minutes after the save, CI merges the branch to `main` if everything passes and both sites update. The result,
    or the exact error, is on `…/preview/status/`, which also lists every story with its status in each language. To take a story down, set it to `draft`.
12. **Check the live page** in every published language, play a page of audio, and look at the Arabic and Urdu layouts.

## How it runs, and one-time setup (admin)

- **Save → preview.** The CMS commits to `editorial`. `deploy.yml` builds `main` at the site root (staging) and
  `editorial` at `/preview/` with `SHOW_DRAFTS=1` and `NOINDEX=1` (both are required; a build with only one of them
  still hides drafts), plus a check-result page at `/preview/status/` (`scripts/preview-status.mjs`).
- **Save → live.** `editorial-publish.yml` merges `main` into `editorial`, runs the changed-files publishing gate
  (`node scripts/publish-gates.mjs --changed=origin/main`), `npm run quality` and the build, then opens a pull request from `editorial` to `main` and squash-merges it with the built-in token.
  Untouched stories are never held to the gate, so the existing library stays as it is.
- **Set up once:**
  1. Create the branch: `git push origin origin/main:refs/heads/editorial`.
  2. Rulesets. Target branches **by name**, never "Default branch", because that follows the default when it moves.
     - `main`: block force pushes and deletion, require signed commits and linear history. No bypass is needed: the
       workflow merges with a squash, which GitHub signs and keeps linear.
     - `editorial`: block force pushes and deletion only. It must **not** require a pull request, because the CMS
       commits to it directly.
  3. Make `editorial` the repository's default branch, so the CMS opens on it with no bookmark. Open PRs keep their
     base. Dependabot targets `main`; anyone opening a code PR picks `main` as the base.
  4. Tick Settings > Actions > General > "Allow GitHub Actions to create and approve pull requests". No personal
     token and no secret are involved.
  5. Invite the moderators in the CMS.
- **Forks.** Anyone can open a pull request from a fork, but it is only a proposal: nothing here runs on pull
  requests with secrets or write access, and `editorial-publish.yml` listens to pushes only. Merging a pull request
  into `editorial` publishes it, so merge outside contributions into `main` instead.
- **Why a moderator can't do harm.** The CMS only edits the configured story and media folders, not workflows. A
  malformed file fails the checks and never reaches `main`; an incomplete or unreviewed published story is blocked
  by the gate; a bad story is fixed by setting it to `draft`.
- **The CMS rewrites a file from its form** unless `settings.content.merge` is on (it is; the setting is that exact
  key, and a plain `content: true` is silently ignored). With it a save keeps every key the form does not show.
  Without it, a frontmatter key that is not a field of the form is dropped on the next
  save (this happened once: `pages` and `difficulty` vanished from a draft). So every key in use must be a field of
  its language's collection in `.pages.yml`, hidden or visible, and `publish-gates.mjs` fails otherwise; on a changed
  file it also blocks a save that removed a key the form cannot edit. Adding a field to `src/content.config.ts` means
  adding it to `.pages.yml` too.
- **`editorial` carries no signature or pull-request rule.** The CMS saves straight to it, and a rule of either kind
  makes the save fail with "requires changes through a pull request".
- **What is still honor system.** `reviewedBy` is a typed name; CI checks it is present and not the author, not who
  typed it.
- Commit identity stays `app` and messages are `content: update {path}`: the repo is public and moderators' emails
  must not appear in it. Pause moderator edits while a code change migrates many story files; a merge conflict stops
  the pipeline and shows on the status page.
- **To confirm in the first test:** the CMS writes to the default branch and its commits start the workflows; email
  sign-in works; Pages publishes the preview folder. Not yet possible: automatic conversion of PNG to WebP, a naming
  check on uploads, and anything needing SVG or word-timing tools.

## Roles

| Role      | Can                                                                       |
| --------- | ------------------------------------------------------------------------- |
| Moderator | Draft and edit stories, translations, questions, alt text; request review |
| Reviewer  | A moderator who did not write it; signs `reviewedBy`/`reviewedAt`         |
| Admin     | Merges to `main`, manages invites and the character/style registries      |

The CMS has no per-user permissions for email collaborators yet, so the gate is the branch and the PR, not a role
check. Keep it that way until the tool grows roles.

## Review checklists

**Text (every language).** Fits the stated age range (sentence length, vocabulary, theme maturity; older levels are not babyish); one clear message; no fear without comfort;
no stereotypes, shaming or moralising; names and rhymes work in this culture; reads aloud well; the ending settles.
**Translation.** Retold, not word-for-word; terms consistent with the glossary; same events as the source; the
reviewer is fluent and not the translator.
**Art.** Characters match their sheet; anatomy and hands correct; no text, logos or watermarks in the image;
culturally and age appropriate; alt text accurate. Reject uncanny faces.
**Audio.** Clean, steady pace, correct language and pronunciation of names, narrator consent recorded.

## AI-generated art pipeline

All art is AI-generated in-house, currently one image at a time, later a pipeline.

1. A **character sheet** per recurring character fixes appearance (descriptors and reference image).
2. Draw the **line drawing first**; colour is added over it so frame and printable page are one picture. Prompts come from the **templates** in `ux/06-…style-guide.md` (cover, frame, colouring page, background) with
   placeholders filled from the story and the character sheet. Never freehand a prompt for published art.
3. Generate several candidates, pick one, retouch if needed, run the **Art checklist**.
4. Export to the formats in `02`, write alt text, record `art` provenance in the German file.
5. A second moderator reviews before the story is merged.
   Policy: AI imagery is labelled on the page (EU AI Act Art. 50, from 2 August 2026) and disclosed on the site ("illustrated with AI, reviewed by people"), never imitates a living
   artist's style, never depicts a real child. Rights and licence terms of the generator used are recorded in
   `art.generator`; the owner decides who may reuse the art (open decision).

## Adding a skill

Rare, and an editor's job: add an entry in the CMS "Skills" collection (an id, its group and the German name). It shows
up in every picker at once. Until its labels are added to `skillLabels` in `src/locales/*.json` (the usual UI
translation flow, listed in `review-queue.json`), the other languages show the German name.

## UI strings and translation

Story text goes through the CMS. UI strings (`src/locales/*.json`) are few and change with features, so they go
through the repository with a native reviewer on the pull request; a localization platform (Weblate on Hosted
Weblate, EU-hosted, email sign-in) is worth adding once translators outnumber maintainers.

## Quality bar for the library

Coverage matrix visible; no published story below launch-ready unless the owner accepts it; a story's languages
appear in listings only when reviewed; a quarterly pass retires or rewrites stories that no longer meet the
checklists.
