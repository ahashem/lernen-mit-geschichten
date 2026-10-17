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

## Publish gates (build or CMS validation, not convention)

A translation can be `published` only if: story meta exists and is `published`; 1–3 valid skills; non-empty title,
summary, keyMessage and body; every image present has alt text; `reviewedBy` is set unless the locale is `de`;
no image or audio file is missing or oversized (limits below).

A story is **launch-ready** at `de` plus two reviewed translations. It is **featured-eligible** with a cover.

## Assets

| Kind      | Format and size                                                                                                                                              | Naming (under `public/assets/stories/{storyId}/`)  |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| Cover     | WebP or AVIF, 1600×1200 (4:3), ≤ 300 KB; JPEG fallback                                                                                                       | `cover.webp`                                       |
| Line art  | SVG or PNG, 1600×1200, closed shapes. **The master**: every colour frame is built on its own line drawing, so a frame and its printable page are one picture | `line-01.svg` …                                    |
| Frames    | WebP, 1600×1200, ≤ 250 KB each (coloured over the line art)                                                                                                  | `frame-01.webp` …                                  |
| Colouring | The line art itself, at print scale, or a richer page for bands 3–4 (patterns, comic panels with empty speech bubbles, story map)                            | `colour-01.svg` …                                  |
| Narration | Opus/AAC ≤ 64 kbps mono, plus MP3 fallback; `{locale}.m4a`                                                                                                   | `audio/{locale}.m4a`, `audio/{locale}.timing.json` |
| Video     | WebM/MP4 ≤ 2 MB, muted loop, captioned                                                                                                                       | `video-01.webm`                                    |

Rules: no text inside images; leave a calm region for text overlay; every image has alt text written for a
screen-reader user, not a caption; provenance (`art`) recorded at the story level. Style, prompt templates and the
review checklist live in `ux/06-illustration-and-asset-style-guide.md` and `03`.

## Migration

An editor assigns each existing story a `band` (all current stories are ≈3–7, so band 1 or 2), then one script maps the existing 66 story files to `story-meta` + translations (`title*` fields move to their locale
files; `languages[]` and read time drop out), then the schema in `src/content.config.ts` tightens. Run
`node scripts/content-report.mjs` before and after to prove nothing was lost.
