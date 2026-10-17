# Editorial and moderation

The system that lets 2–3 non-technical moderators add and manage stories safely. Moderation is the critical path:
no content, no product.

## Principles

- **Git stays the source of truth.** Every edit is a commit; history is the audit log. No separate database.
- **Moderators never see git.** They use a CMS with an email invite; the CMS commits on their behalf.
- **A second pair of eyes before anything is public, enforced by data.** Moderators save on the `content` branch. A
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
  A typo is therefore caught before it can be merged.
- The file name defaults to `{storyId}.md` in every language but is not the join key. Each page's URL comes from
  its file name, so rename a file only on purpose.
- Never change a `storyId` after publishing. Art folders, audio folders and readers' bookmarks all use it.

## Workflow for one new story

Moderators work in the CMS on the `content` branch and never see git. Steps 1 to 5 happen outside it.

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
6. **German entry.** In the CMS: Stories (German), New. Fill `storyId`, title, emoji, skills, band, summary, key
   message. For picture books add one list item per page (page _n_ pairs with picture _n_ and recording _n_); for
   chapter stories write the body. Add questions and the grown-up prompts. `status` is `draft`.
7. **Art and audio.** Upload the cover and page pictures to `assets/stories/023-nora/` and the recordings to
   `assets/audio/de/023-nora/`, choose them in the Cover and Page pictures fields, and write the German alt text.
   Fill "How the art was made" (tool, model, who reviewed it).
8. **Review.** A second moderator checks the text and art against the checklists below and fills in the reviewer
   fields. The CMS cannot force this to be a different person.
9. **Translate.** In each language's collection add a file with the same `storyId`: title, summary, key message,
   pages or body, questions and the alt text in that language (`coverAlt`, `frameAlts` in the same order as the
   German pictures). A native speaker reads it and fills `reviewedBy` and `reviewedAt`. Recordings for that language
   go in `assets/audio/<language>/023-nora/`.
10. **Preview.** Every save rebuilds the preview at `…/preview/` (drafts visible, `noindex`). A reviewer reads the real
    page there, with pictures and audio, and fills `reviewedBy` and `reviewedAt` in the CMS.
11. **Publish.** Set `status: published` on the files that are ready; leave unreviewed translations as `draft`. A few
    minutes after the save, CI merges the branch to `main` if everything passes and both sites update. The result,
    or the exact error, is on `…/preview/status/`. To take a story down, set it to `draft`.
12. **Check the live page** in every published language, play a page of audio, and look at the Arabic and Urdu layouts.

## How it runs, and one-time setup (admin)

- **Save → preview.** The CMS commits to `content`. `deploy.yml` builds `main` at the site root (staging) and
  `content` at `/preview/` with `SHOW_DRAFTS=1` and `NOINDEX=1` (both are required; a build with only one of them
  still hides drafts), plus a check-result page at `/preview/status/` (`scripts/preview-status.mjs`).
- **Save → live.** `content-publish.yml` merges `main` into `content`, runs the changed-files publishing gate
  (`node scripts/publish-gates.mjs --changed=origin/main`), `npm run quality` and the build, then fast-forwards `main`.
  Untouched stories are never held to the gate, so the existing library stays as it is.
- **Set up once:**
  1. Create the branch: `git push origin origin/main:refs/heads/content`.
  2. Make `content` the repository's default branch, so the CMS opens on it with no bookmark. Dependabot already
     targets `main`; anyone opening a code PR picks `main` as the base.
  3. Protect `main`: pull request and the `quality` check required for people and the agent.
  4. Create a token for this repository only (contents: write) and store it as the secret `CONTENT_BOT_TOKEN`. Let
     it bypass the `main` rule (a ruleset bypass), because `content-publish.yml` pushes straight to `main`.
  5. Invite the moderators in the CMS.
- **Why a moderator can't do harm.** The CMS only edits the configured story and media folders, not workflows. A
  malformed file fails the checks and never reaches `main`; an incomplete or unreviewed published story is blocked
  by the gate; a bad story is fixed by setting it to `draft`.
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

## UI strings and translation

Story text goes through the CMS. UI strings (`src/locales/*.json`) are few and change with features, so they go
through the repository with a native reviewer on the pull request; a localization platform (Weblate on Hosted
Weblate, EU-hosted, email sign-in) is worth adding once translators outnumber maintainers.

## Quality bar for the library

Coverage matrix visible; no published story below launch-ready unless the owner accepts it; a story's languages
appear in listings only when reviewed; a quarterly pass retires or rewrites stories that no longer meet the
checklists.
