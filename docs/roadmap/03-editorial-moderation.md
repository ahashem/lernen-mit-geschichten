# Editorial and moderation

The system that lets 2–3 non-technical moderators add and manage stories safely. Moderation is the critical path:
no content, no product.

## Principles

- **Git stays the source of truth.** Every edit is a commit; history is the audit log. No separate database.
- **Moderators never see git.** They use a CMS with an email invite; the CMS commits on their behalf.
- **A second pair of eyes before anything is public.** Moderators edit a `content` branch; the admin merges it to
  `main` through a pull request, CI runs tests and build, both deploys follow.
- **Nothing machine-made ships unreviewed**: text, translations and images all have a named human reviewer.

## Workflow

`draft` → author finishes → review request → reviewer checks against the checklists → admin merges → published.
`status: draft` unpublishes at any time (no page, listing or sitemap entry).

CMS: Pages CMS (git-native, email invites, config in `.pages.yml`), editing a `content` branch. The CMS instance
is hosted by the owner (hosted service or self-hosted); that choice is open (see `README.md`). The collections,
fields and validation come from `02`. The moderator worklist is `scripts/content-report.mjs` (stories × missing
languages) and should be surfaced in the CMS as a README on the content branch.

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
culturally and age appropriate; calm text area present; alt text accurate. Reject uncanny faces.
**Audio.** Clean, steady pace, correct language and pronunciation of names, narrator consent recorded.

## AI-generated art pipeline

All art is AI-generated in-house, currently one image at a time, later a pipeline.

1. A **character sheet** per recurring character fixes appearance (descriptors and reference image).
2. Draw the **line drawing first**; colour is added over it so frame and printable page are one picture. Prompts come from the **templates** in `ux/06-…style-guide.md` (cover, frame, colouring page, background) with
   placeholders filled from the story and the character sheet. Never freehand a prompt for published art.
3. Generate several candidates, pick one, retouch if needed, run the **Art checklist**.
4. Export to the formats in `02`, write alt text, record `art` provenance in the story meta.
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
