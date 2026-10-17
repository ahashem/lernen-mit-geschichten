# 05 Accessibility, RTL and i18n

Baseline: **WCAG 2.1 AA** on every page, with these AAA-level choices where they are cheap: 7:1
body text in the day theme (achieved: 14.5:1), no timing on any task, and target size ≥ 44 px
everywhere.

## RTL mirroring

Set `dir` and `lang` on `<html>` per locale. Use logical CSS properties only. Set `dir` and `lang`
on every block whose language differs from the page (two-language view, glosses, endonyms).

| Mirrors                                                                              | Does not mirror                                                                                                                                                                        |
| ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Page and chapter order, turn direction, swipe direction, and the start/end tap zones | Play/pause, stop and record icons (media conventions are universal)                                                                                                                    |
| Back/next arrows, breadcrumb chevrons, the progress bar fill direction               | Clocks, the moon, checkmarks, the search magnifier (it may mirror, but don't bother)                                                                                                   |
| Layout: image on the end side, text on the start side, sidebar side, drawer edge     | **Illustrations.** Never CSS-flip a frame (06 explains direction-neutral composition)                                                                                                  |
| Offset shadow x-direction (`--shadow-x`)                                             | Logos, the wordmark                                                                                                                                                                    |
| Icon _placement_ inside buttons (icon at start)                                      | Numerals inside text and phone numbers (keep their LTR order, isolated)                                                                                                                |
| Keyboard arrows in readers                                                           | Audio scrubber / narration timeline (it follows media convention, per Material Design's bidirectionality guidance, and is separate from the _reading_ progress bar, which does mirror) |
| List bullets and indentation                                                         | Latin words embedded in RTL text (isolate them)                                                                                                                                        |

**Bidi hygiene:** wrap names, numbers and Latin fragments inside RTL text in `<bdi>` or
`dir="auto"`. Use `unicode-bidi: isolate` on any element that shows user-provided or
other-language strings (search terms, endonyms in the language menu).

## Arabic typography pitfalls

- **Never add letter-spacing**, never `text-transform`, never `font-variant: small-caps`. All of
  them break joining.
- **Don't split words into separate spans for highlight.** Wrapping parts of a word in elements can
  break contextual shaping in some engines, and wrapping whole words still fragments screen-reader
  output. Use the **CSS Custom Highlight API** (`CSS.highlights.set('read-along', new
Highlight(range))` with a `Range` over the text node, styled via `::highlight(read-along) {
background-color: var(--mark); color: var(--mark-ink); }`). Supported in current Chromium,
  Safari 17.2+ and Firefox 140+. Fallback: whole-word `<span>`s for Latin only. For ar/ur without
  support, highlight the **sentence** via a block-level class.
- **Tashkeel:** bands 1-2 story text is fully vocalised. Line height ≥ 1.9 prevents marks from
  colliding with the line above. Never clip text containers vertically (`overflow: hidden` on a
  line clamp cuts off marks). Use `text-box-trim` nowhere on Arabic.
- **Size:** Naskh's visual x-height is smaller than Andika's, so sizes are +12-15% (tokens in 02).
- **Digits:** see 07. The default is `Intl.NumberFormat(locale)` with Latin digits for page
  numbers in both RTL locales (`ar-u-nu-latn`), because children in German schools learn Western
  digits.
- **Punctuation:** use the Arabic comma ، and question mark ؟ from translators. Never generate
  them by replacing Latin punctuation.
- **Justification:** off. If ever enabled, it must use kashida-aware engines, and Nastaliq does not
  support kashida (W3C Urdu LReq).

## Urdu (Nastaliq) pitfalls

- Nastaliq descends diagonally, and words are tall and deep. Line height is 2.2-2.4 for story text
  and ≥ 2.0 in UI. Allow `overflow: visible` on every text box, and test buttons with 2-line Urdu
  labels.
- **Minimum size 17 px.** Nastaliq becomes illegible below that on low-dpi screens.
- Do not use Naskh as a stand-in for Urdu. If the Nastaliq font fails to load, show a quiet "Loading
  Urdu font" skeleton (font-display: block, max 3 s) rather than flashing Naskh, which looks like
  Arabic to Urdu readers.
- Truncation with ellipsis is ugly and error-prone in Nastaliq. **Never truncate Urdu titles.**
  Allow wrapping to 3 lines.
- Use ZWNJ (U+200C) where translators supply it, and never strip it during content processing.

## Text expansion

| From German UI string | Typical change                         |
| --------------------- | -------------------------------------- |
| en                    | -10% to -30%                           |
| tr                    | +0-20%, agglutinative long words       |
| ar                    | -10% to +10% in characters, but taller |
| ur                    | similar length, about 1.6× taller      |

Rules:

- Design every label for **+40% width and 2 lines**. Buttons grow vertically. They never shrink the
  font or truncate.
- German compounds: `hyphens: auto` with the correct `lang` on story text in bands 3-4 and in UI
  text. Bands 1-2 story text uses **no hyphenation**, because beginning readers decode whole words.
- Turkish: never uppercase (i/İ, ı/I). Locale-aware sorting uses `Intl.Collator(locale)` in the
  library.
- No text in images, ever (06), so art never needs localising.

## Screen-reader experience of the storybook

- The storybook is a `<main>` with `aria-roledescription="storybook"` (localised) and the story
  title as its label.
- Each page is a `<section aria-label="Page 3 of 8">`. Only the current page is in the
  accessibility tree. The others are `inert`.
- The image comes first, with alt text (06), then the text as a normal paragraph.
- On page turn, focus moves to the page section (`tabindex="-1"`), so the screen reader reads the
  new page's label, the image description and the text in order. There is no live-region
  duplication.
- **Narration versus screen reader:** narration is never auto-started on page turn if the user has
  started reading with keyboard/SR navigation in this session (heuristic: the last page turn came
  from a keyboard event, not a pointer). A "Read aloud" toggle with `aria-pressed` makes this
  explicit, and it is in the first tab stop of the storybook toolbar.
- Controls: the next/previous buttons have localised names ("Next page"). The page dots are a
  single "Page 3 of 8" status, not 8 buttons.
- Think cards: picture choices are a `radiogroup` with each frame's alt as the label. Feedback is
  announced via `aria-live="polite"`.
- The chapter reader (bands 3-4) is plain semantic HTML: `<article>`, chapter `<h2>`, paragraphs,
  and `<nav aria-label="Chapters">`. Pagination is visual only. The DOM holds the full chapter, so
  screen readers read continuously.

## Pre-reader navigation (bands 1-2)

- 2 taps from Picture home to a story, with no text required.
- Every child-facing control is an icon, illustration or face that **speaks its label on first
  tap** and acts on the second (covers, faces). For the 4 core icons it acts on the first tap,
  since actions are reversible and learnt after one use.
- A tappable "?" bubble plays a 10-second spoken tour of the 4 icons.
- Consistent placement: home is always top-start, play is top-end, and back/next are always the
  bottom corners.
- No essential information is in text only. "This story needs the internet" also shows the cloud
  character.

## Dyslexia and reading-support options

The evidence does not support "dyslexia fonts" (Wery & Diliberto 2017 found no gain with
OpenDyslexic). It does support spacing: Zorzi et al. (2012, _PNAS_) found that extra letter spacing
improved reading speed and accuracy in children with dyslexia.

Offered under **Aa** (and in Settings for bands 1-2):

| Option                    | Effect                                                                                                                 | Scripts                             |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Text size                 | -3 to +3 steps (±12% each)                                                                                             | All                                 |
| **Wider spacing**         | Latin: letter-spacing 0.12em, word-spacing 0.16em, line-height +0.2. ar/ur: word-spacing 0.25em, line-height +0.2 only | All (letter-spacing never in ar/ur) |
| Line focus                | Dims all but the current line or sentence (bands 3-4)                                                                  | All                                 |
| Font                      | Literata ⇄ Andika in bands 3-4                                                                                         | Latin                               |
| Highlight while listening | On or off                                                                                                              | All                                 |
| Background                | Paper / Card (brighter) / Lamp                                                                                         | All                                 |

All options are persisted in `reader-prefs`, and they meet WCAG 1.4.12 text-spacing overrides
without breaking layout.

## Second-language readers

- "A language I'm learning" (Settings or class link) turns on the 5b tools: narration at 0.9× with
  highlight, tap-a-word, editor-written glosses into the reader's first language, and two-language
  view one tap away.
- Glosses are human-written, 5-10 per chapter, and never machine translation.
- The UI language and the story language are independent: Selin can have a Turkish UI and German
  stories.

## Testing checklist (per release, per locale)

**Automated**

- [ ] axe-core with 0 violations on home, library, cover, storybook, chapter reader, think cards,
      print pack and settings, in all 5 locales
- [ ] Contrast tokens re-validated by script for Day, Lamp, HC light and HC dark
- [ ] No `letter-spacing`, `text-transform` or italic in ar/ur computed styles (lint script)
- [ ] Every `<img>` has an `alt` (empty only for decorative images)

**Manual (30 min per locale)**

- [ ] Keyboard only: home → story → end → think cards → print, with focus always visible and no
      traps
- [ ] VoiceOver (iPad) and TalkBack (Android tablet): read one band-1 storybook and one band-4
      chapter
- [ ] RTL: ar and ur page order, swipe, arrows and progress all go the right way, and no
      illustration is flipped
- [ ] Urdu: no clipped diacritics or descenders in buttons, cards or headings, and 2-line labels
      fit
- [ ] Arabic: tashkeel intact with the highlight on, at 200% zoom
- [ ] 200% browser zoom and 320 px width: no horizontal scroll, nothing truncated
- [ ] Reduced motion: no slide transitions, and the breathing page shows its static variant
- [ ] Lamp in a dark room at minimum brightness: readable, and no white flash between routes
- [ ] Offline (airplane mode) on a kept story, a non-kept story and print
- [ ] A 4-year-old (if available) reaches a story and turns 3 pages unaided. An 11-year-old is
      asked "Who is this website for?" and the answer should not be "little kids".
- [ ] Projector at the back of a room: the Kamishibai caption and shared-reading text are legible
      at 8 m
