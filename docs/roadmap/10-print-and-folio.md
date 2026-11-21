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
the one print that carries the story's pictures page by page (rebuilt in item 5 below). The Library finds the
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

- A cover and a contents page only when more than one story is chosen. The cover carries the site's mark and name,
  up to six of the chosen stories' pictures, the title and language, the build date, and a QR code and link to this
  exact selection ("newest version").
- Contents (number, title, minutes) and the skill index (skill, story numbers) are separate; in a saved PDF every
  row and number jumps to that story's page in the PDF (the QR codes are the way online), and each story sheet has
  a "↑ Contents" link back.
- Each story starts on a new page with a running header ("018 · Timmi und die Zauberuhr") on every one of its
  pages, so a loose sheet stays identifiable. The footer is the site name, the AI-illustration note and the page
  number.
- A story sheet keeps the grown-up's notes (summary, skills, minutes, QR with its short URL; at the end the key
  message and talk prompts) visibly apart from the text to read aloud, which is set larger. A small cover
  thumbnail helps children recognise the story.
- Most band 1-2 stories fit one page; the key message and the prompts never split from each other.

Chromium was checked for the two techniques this needs: named `@page` rules with margin boxes give each story its
own running header, and `<a href>` (internal and external) survives a saved PDF.

## Open

- Stories without `discussion` print their multiple-choice and fill-in-the-blank quiz items as talk prompts ("Benno
  ist ein kleiner ___."). On paper a blank can be filled in, so it stays; the real fix is `discussion` prompts per
  story (`readiness` could ask for them). Dropping blanks from `talkPrompts` would remove the end-of-story talk cards
  of 5 German, 8 Arabic and 7 English stories.

## Not now

- A teacher sheet with quiz answers: when band 3-4 stories exist in German.
- Children's packs for a whole selection, and a parent letter: only if teachers ask.
- Letter paper, bilingual sheets (BR-8), real double-sided control.

## Work, in order

Items 1-5 are built (PRs 171-174 and the booklet PR after them).

| #   | Change                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Fixes: the Arabic 018 code block, a content check for indented lines, the layout guard, `noindex` and no sitemap entry, the footer font, page breaks and tighter type, honest lead text, a print-width check                                                                                                                                                                                                  |
| 2   | Sheets print only; one list; footer and title page; the English label "Print stories"                                                                                                                                                                                                                                                                                                                         |
| 3   | Selection in the URL shared with the Library, the Library and story-page links, the prep sheet replaced, other languages, All/None, the page estimate, the text option                                                                                                                                                                                                                                        |
| 4   | Running headers, notes apart from the read-aloud text, PDF links, short URL, title-page QR, cover thumbnails                                                                                                                                                                                                                                                                                                  |
| 5   | "Export as Booklet" rebuilt: it exported a cover and blank pages (the placement check ignored the cover, the capture saw only the visible part of a scroll box, and the "imposition" shuffled single A5 pages). Now one A5 page per storybook page, picture above text, two to an A4 sheet in fold-and-staple order, mirrored for right-to-left; chaptered stories are cut into pages of about 650 characters |
