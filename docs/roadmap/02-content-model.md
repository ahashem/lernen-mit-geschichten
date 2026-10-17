# Content model

Derived from what a world-class story needs (`01`), not from the Markdown that exists today. Existing files are
migrated to it; they do not constrain it.

## Shape

A **story** is language-neutral: its identity, cast, skills, and **all art** (no image carries text, so the same
picture serves every locale and RTL). A **translation** is one language's text, audio and questions, reviewed by a
human. Today both live in one frontmatter per locale file, joined by `storyId`, which lets shared fields drift.

Recommended: a `story-meta` collection (`src/content/story-meta/{storyId}.yaml`) for the language-neutral part, and
the existing per-locale Markdown for the text. A published translation must reference an existing meta entry
(build fails otherwise). The CMS edits both.

## Story (language-neutral) — `story-meta`

| Field                     | Req            | Notes                                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storyId`                 | yes            | Slug, immutable once published                                                                                                                                                                                                                                                                                                          |
| `skills`                  | yes            | 1–3 ids from `skills-taxonomy.ts`; build validates                                                                                                                                                                                                                                                                                      |
| `band`                    | yes            | `1` Picture books (≈3–5), `2` Read-along (≈6–7), `3` Chapter stories (≈8–9), `4` Long reads (≈10–12). Set by editors from the length and density table in `ux/01`; same across locales (a translator may flag "harder in my language"). Drives reader layout, type, narration default and question style. Ages are shown to adults only |
| `feelings` / `situations` | no             | Parent-language intents for find-by-feeling (e.g. angry, new sibling, first day)                                                                                                                                                                                                                                                        |
| `characters`              | no             | Ids into a character registry (name, species, art reference); keeps the cast consistent                                                                                                                                                                                                                                                 |
| `series`, `order`         | no             | For recurring-cast arcs                                                                                                                                                                                                                                                                                                                 |
| `occasion`                | no             | Seasonal or cultural (Ramadan, Christmas, Spring); drives shelves, not required                                                                                                                                                                                                                                                         |
| `cover`                   | no*            | `src`, `alt` per locale or neutral description. *Required to be featured                                                                                                                                                                                                                                                                |
| `frames[]`                | no             | Ordered story pictures: `src`, `alt`, optional `pageRef` linking to a text page                                                                                                                                                                                                                                                         |
| `colouring[]`             | no             | Line-art for children to colour/print: `src`, `title`, `difficulty`                                                                                                                                                                                                                                                                     |
| `palette`                 | no             | Two hex colours extracted from the cover; tints cards and the reader, so art-less stories still look designed                                                                                                                                                                                                                           |
| `art`                     | yes if any art | `generator`, `styleVersion`, `promptTemplate`, `reviewedBy`, `reviewedAt`, `aiGenerated: true`                                                                                                                                                                                                                                          |
| `video`                   | no             | Short silent or captioned loop; later                                                                                                                                                                                                                                                                                                   |
| `status`                  | yes            | `draft` / `published`; see gates                                                                                                                                                                                                                                                                                                        |

## Translation (per locale) — Markdown

| Field                      | Req                        | Notes                                                                                                                  |
| -------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `storyId`, `locale`        | yes                        | Locale is the folder; the file may use any slug                                                                        |
| `title`                    | yes                        | Replaces `titleAr/En/Tr/Ur`; each locale carries its own                                                               |
| `summary`                  | yes                        | 1–2 sentences for cards, previews and SEO                                                                              |
| `keyMessage`               | yes                        | The one idea (BR-3); shown at the end                                                                                  |
| body or `pages[]`          | yes                        | Standard: Markdown. Interactive: pages of text; picture comes from `frames[]`                                          |
| `emoji`                    | yes                        | Fallback identity when there is no cover                                                                               |
| `questions[]`              | no (≥2 advised)            | Reflection and talk prompts, comprehension for bands 3–4; nothing is scored; reflection questions have no wrong answer |
| `discussion[]`             | no                         | Prompts for the adult reading along                                                                                    |
| `narration`                | no                         | `audio` file, `narrator` credit, `consent` note, optional `timing` (word offsets) for highlight sync                   |
| `reviewedBy`, `reviewedAt` | yes for non-source locales | The human who vouches for the translation                                                                              |
| `status`                   | yes                        | `draft` / `published`                                                                                                  |
| `readTime`                 | derived                    | Computed from text length; never hand-entered                                                                          |

Older levels (8–12) may use longer `pages[]`, chapters (`## ` headings become chapter breaks) and richer
questions (`type: open`); the schema must not assume a story is a few short paragraphs.

Removed from today's schema: `titleAr/En/Tr/Ur`, hand-entered `estimatedReadTime`, `languages[]` (derived),
`provider*`, `characterType` (replaced by `characters`).

## Reading modes, not formats

Every story reads in scroll mode and in page-by-page mode. `storyFormat: standard|interactive` goes away. Pages come
from `---` breaks in the Markdown (and chapters from `##` headings); `pages[]` stays only as an optional explicit
override. The draft `de/001-bruno-interactive.md` folds into `001-bruno` (one `storyId`, frames mapped to pages).
The CMS is being configured in parallel against this schema; treat field names as a contract.

## Publish gates

Phase-in: the existing stories lack `summary`, `keyMessage` and `reviewedBy`. Gates therefore _report_ what is
missing (counts per locale in the build log) and fail only when `CONTENT_STRICT=1`; the owner turns that on once
content is complete. No story disappears because a new field is empty. (build or CMS validation, not convention)

A translation can be `published` only if: story meta exists and is `published`; 1–3 valid skills; non-empty title,
summary, keyMessage and body; every image present has alt text; `reviewedBy` is set unless the locale is `de`;
no image or audio file is missing or oversized (limits below).

A story is **launch-ready** at `de` plus two reviewed translations. It is **featured-eligible** with a cover.

## Assets

Naming and formats follow `ux/06-illustration-and-asset-style-guide.md` §7, which wins on any conflict. Masters (PNG,
WAV) stay out of the repo; only web deliveries are committed.

| Kind                    | Delivered as                                                               | Path under `public/assets/`                            |
| ----------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------ |
| Cover                   | WebP (AVIF optional), 1200 w, ≤ 120 KB                                     | `stories/{story-id}/{story-id}_cover.webp`             |
| Colour frame            | WebP, 1200 w, ≤ 120 KB; drawn over its own line art                        | `stories/{story-id}/{story-id}_frame-{nn}_colour.webp` |
| Line frame (**master**) | SVG, closed paths, ≤ 80 KB (bands 1–2), ≤ 250 KB (bands 3–4)               | `stories/{story-id}/{story-id}_frame-{nn}_line.svg`    |
| Colouring or print page | SVG, A4, per band                                                          | `stories/{story-id}/{story-id}_print-{nn}_b{1-4}.svg`  |
| Narration, one per page | Opus/WebM 48 kbps mono plus M4A fallback                                   | `audio/{locale}/{story-id}/{nn}.opus`, `{nn}.m4a`      |
| Word timings, per page  | JSON `[{ "w", "start", "end" }]` from forced alignment; optional           | `audio/{locale}/{story-id}/{nn}.json`                  |
| Provenance              | One `manifest.json` per story: tool, model, seed, prompt, reviewer, checks | `stories/{story-id}/manifest.json`                     |

`{nn}` is the page or frame number, two digits, and pages and frames pair by number. A page without a frame uses the
generated fallback; a page without audio simply has no narration; audio without timings plays without word
highlight (sentence highlight on device voices). Both are valid states the reader must handle, so a story can be
published partly illustrated.

Rules: no text inside images; leave a calm region for text overlay; every image has alt text written for a
screen-reader user, not a caption, stored in `story-meta`; provenance lives in the manifest and `story-meta` points
to it. Style, prompts and the review checklist are in `ux/06` and `03`.

## Migration

An editor assigns each existing story a `band` (all current stories are ≈3–7, so band 1 or 2), then one script maps the existing 66 story files to `story-meta` + translations (`title*` fields move to their locale
files; `languages[]` and read time drop out), then the schema in `src/content.config.ts` tightens. Run
`node scripts/content-report.mjs` before and after to prove nothing was lost.
