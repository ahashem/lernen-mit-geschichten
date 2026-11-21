# Print and the folio

Decided with the owner on 2026-11-21. It replaces the per-story print buttons that grew one at a time, and it
outranks `ux/03` §11 where the two differ (the print pack itself stays as §11 describes it).

## The outcome

A teacher plans Monday's circle time on _Geduld_. On paper they want the two or three stories that fit, the talk
prompts to read the night before, a way to put the picture version on the whiteboard, something for the children to
colour, and perhaps the same stories for a family in Arabic or Turkish. Every printed sheet serves one of those.

## The model

Every print answers two questions: who is it for, and how many stories?

|                                                      | One story                                 | A selection           |
| ---------------------------------------------------- | ----------------------------------------- | --------------------- |
| **Grown-up** (prepare, read aloud, keep in a binder) | the folio with one story (`/folio?s=018`) | the folio             |
| **Children** (colour, talk cards, a line for a name) | the print pack (`ux/03` §11)              | not built (see below) |
| **A finished little book** (fold and staple)         | "Export as Booklet" (A5, with pictures)   | —                     |

So a story page offers "Print story & prompts", the print pack and the booklet. The booklet stays because it is
the one print that will carry the story's pictures page by page; today it exports blank white pages, which is
investigated on its own. The Library finds the
stories; the folio prints them. The folio reads the Library's own URL parameters, so a filtered Library is one link
away from paper.

Story numbers are the number in the `storyId` (001, 002 …). They are the same in every language, which is what
lets a selection move between languages; the printed contents page says so.

## Removed

- **"Print prep sheet"**: the folio with one story and the story text switched off is the same sheet.
- **The on-screen preview of every folio sheet**: the browser's print preview already shows it.
- **The claim "single- or double-sided"**: Chromium ignores right-hand page breaks, so nothing controls which side a
  story starts on.

## The folio screen

A short chooser, not a preview:

- The starting selection comes from the link: the Library's filters (`skill`, `area`, `shelf`, `length`, `q`),
  an explicit list (`s=002,008,032`), or every story from the menu. The selection is written back to the URL.
- One list of stories with checkboxes, each title linking to its story; "All" and "None"; "Change the selection in
  the Library" with the same filters.
- One option: "With the story text". Off gives one preparation page per story.
- A sticky print button that says how much will print: "Print · 3 stories · about 4 pages".
- "Same selection in: العربية (3/3) · Türkçe (2/3)", keeping the selection (one language per sheet, BR-8).

## The printed folio

- A title page and a contents page only when more than one story is chosen. The title page carries the date of the
  build and a QR code and link to this exact selection ("newest version").
- Contents (number, title, minutes) and the skill index (skill, story numbers) are separate; in a saved PDF every
  row and number jumps to its story.
- Each story starts on a new page with a running header ("018 · Timmi und die Zauberuhr") on every one of its
  pages, so a loose sheet stays identifiable. The footer is the site name, the AI-illustration note and the page
  number.
- A story sheet keeps the grown-up's notes (summary, skills, minutes, QR with its short URL; at the end the key
  message and talk prompts) visibly apart from the text to read aloud, which is set larger. A small cover
  thumbnail helps children recognise the story.
- Most band 1-2 stories fit one page; the key message and the prompts never split from each other.

Chromium was checked for the two techniques this needs: named `@page` rules with margin boxes give each story its
own running header, and `<a href>` (internal and external) survives a saved PDF.

## Not now

- A teacher sheet with quiz answers: when band 3-4 stories exist in German.
- Children's packs for a whole selection, and a parent letter: only if teachers ask.
- Letter paper, bilingual sheets (BR-8), real double-sided control.

## Work, in order

| #   | Change                                                                                                                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Fixes: the Arabic 018 code block, a content check for indented lines, the layout guard, `noindex` and no sitemap entry, the footer font, page breaks and tighter type, honest lead text, a print-width check |
| 2   | Sheets print only; one list; footer and title page; the English label "Print stories"                                                                                                                        |
| 3   | Selection in the URL shared with the Library, the Library and story-page links, the prep sheet replaced, other languages, All/None, the page estimate, the text option                                       |
| 4   | Running headers, notes apart from the read-aloud text, PDF links, short URL, title-page QR, cover thumbnails                                                                                                 |
| —   | Separately: why "Export as Booklet" exports blank white pages                                                                                                                                                |
