# 02 Visual language: "Paper & Ink"

## Brand feel

The site looks like a **risograph-printed picture book that someone loved**: warm uncoated paper,
five flat spot inks that sometimes sit slightly off their outlines, fine grain, solid offset shadows
like a sheet of card lifted off the table. It is calm, tactile and handmade, and never glossy or
"app-like".

Three words for every review: **warm, clear, hand-made.**

This aesthetic was chosen because it **spans ages**. To a 4-year-old it is a picture book. To an
11-year-old it is the look of an indie comic, a zine or a museum-shop print, which they do not
experience as childish. Maturity across bands comes from illustration proportions, detail, density
and copy (01, 06). Palette and materials stay the same. The shell itself (nav, menus, settings) is
always set at the band-4 / adult density.

| Is                                                       | Is not                                               |
| -------------------------------------------------------- | ---------------------------------------------------- |
| Flat colour areas, visible paper grain, a confident line | Gradients, glassmorphism, neon, soft blurred shadows |
| Large type in generous space, like a picture book        | Dense cards, carousels, badges and counters          |
| One illustration per view, big                           | Collages, sticker clutter, confetti                  |
| Board-book corners (soft but not pill-shaped)            | Fully round "bubbly" UI everywhere                   |

Two-tone covers are **forbidden**: no rainbow cover grid. Each story chooses 2 lead inks from the 5
(stored in story metadata as `inks: [poppy, lagoon]`), so the library reads as one coherent print
run.

---

## Colour system

### Day theme ("Paper")

All ratios are WCAG 2.1 contrast ratios, computed against the background named in the table.

| Token         | Hex       | Role                                                     | Contrast                                         |
| ------------- | --------- | -------------------------------------------------------- | ------------------------------------------------ |
| `--paper`     | `#FBF5EA` | Page background                                          | n/a                                              |
| `--paper-2`   | `#F3EADA` | Recessed areas, panels, the reading band under frames    | ink 13.2:1                                       |
| `--card`      | `#FFFDF8` | Raised surfaces: covers, dialogs, question cards         | ink 15.5:1                                       |
| `--ink`       | `#24212E` | Body text, icons, line art                               | 14.5:1 on paper                                  |
| `--ink-2`     | `#5A5466` | Secondary text (adult UI only, never child reading text) | 6.7:1 paper, 6.1:1 paper-2                       |
| `--rule`      | `#D9CDB8` | Decorative dividers only (fails 3:1 on purpose)          | 1.45:1, decorative                               |
| `--edge`      | `#8C7F6A` | Borders of inputs and controls (non-text contrast)       | 3.6:1 paper, 3.85:1 card                         |
| `--poppy`     | `#C8402B` | Ink 1: warmth, primary action fill                       | white text on it 4.97:1                          |
| `--poppy-ink` | `#A3311F` | Poppy used as text or links                              | 6.4:1 paper                                      |
| `--lagoon`    | `#0F6E6A` | Ink 2: calm, links, "play"                               | 5.6:1 paper, white on it 6.1:1                   |
| `--honey`     | `#F2B33D` | Ink 3: light, focus halo, word highlight base            | ink on it 8.5:1, **never text on paper** (1.7:1) |
| `--plum`      | `#6B3E75` | Ink 4: night, wonder, bilingual secondary accent         | 7.5:1 paper                                      |
| `--moss`      | `#3F6B2E` | Ink 5: growth, outdoors                                  | 5.8:1 paper                                      |
| `--sky`       | `#2C5D9E` | Utility only (illustrations and info); not a brand ink   | 6.1:1 paper                                      |
| `--mark`      | `#FBD989` | Read-along word highlight (marker-pen)                   | ink on it 11.6:1                                 |
| `--focus`     | `#1F4FD1` | Keyboard focus ring (paired with a honey halo)           | 6.25:1 paper                                     |

**Tints** (feeling cards, category plates). Ink text on any tint is at least 11.3:1, and ink-2 is at
least 5.2:1.

| Token           | Hex       |     | Token         | Hex       |
| --------------- | --------- | --- | ------------- | --------- |
| `--poppy-tint`  | `#F8D9CF` |     | `--plum-tint` | `#E6D5E8` |
| `--lagoon-tint` | `#CFE7E3` |     | `--sky-tint`  | `#D3E0F2` |
| `--honey-tint`  | `#FBE3A8` |     | `--moss-tint` | `#DCE8CF` |

### Lamp theme (bedtime)

No blue and no white. The whole theme sits at long wavelengths, and the brightest surface is below
the paper of the day theme. This follows Hartstein et al. (2022) and is combined with the
brightness behaviour in 03 (Lamp mode).

| Token       | Hex                | Role                                                        | Contrast                |
| ----------- | ------------------ | ----------------------------------------------------------- | ----------------------- |
| `--paper`   | `#14100C`          | Background (warm near-black)                                | n/a                     |
| `--paper-2` | `#1E1812`          | Reading band                                                | ember 9.2:1             |
| `--card`    | `#261E16`          | Raised surfaces                                             | ember 8.6:1             |
| `--ink`     | `#E9B26A`          | Body text ("ember")                                         | 9.95:1 on paper         |
| `--ink-2`   | `#B98A55`          | Secondary text, control borders                             | 6.2:1 paper, 5.3:1 card |
| `--edge`    | `#B98A55`          | Control borders                                             | 6.2:1                   |
| `--rule`    | `#3A2E22`          | Decorative dividers                                         | decorative              |
| `--accent`  | `#FFCF8A` ("glow") | Primary button fill (paper-coloured text on it), focus ring | 13.1:1                  |
| `--mark`    | `#5A3E1E`          | Word highlight background (glow text on it)                 | 6.8:1                   |
| `--rose`    | `#D98263`          | The only second hue, for the "lights out" moon              | 6.6:1                   |

Illustrations in Lamp are not swapped for night art. They get
`filter: brightness(.62) sepia(.35) saturate(.8)`, so no new assets are needed. Line drawings are
inverted to ember on night (see 06).

### High-contrast theme

It is offered as a setting and is also applied automatically under `forced-colors: active` (which
uses system colours) and `prefers-contrast: more` (which uses this palette).

| Token                | Light HC               | Dark HC                | Contrast        |
| -------------------- | ---------------------- | ---------------------- | --------------- |
| `--paper` / `--card` | `#FFFFFF`              | `#000000`              | n/a             |
| `--ink`              | `#000000`              | `#FFFFFF`              | 21:1            |
| `--accent`           | `#0033CC`              | `#FFE600`              | 8.95:1 / 16.6:1 |
| `--mark`             | `#FFE600` (black text) | `#FFE600` (black text) | 16.6:1          |
| `--edge`             | `#000000`              | `#FFFFFF`              | 21:1            |
| Links (dark)         | n/a                    | `#7FD4FF`              | 12.8:1          |

In HC themes the grain, the tints and the offset shadows are removed, and every control gets a
2 px solid border.

### Semantic roles

| Role             | Day                                          | Lamp                            | Rule                                                                                                 |
| ---------------- | -------------------------------------------- | ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Primary action   | `--poppy` fill, `#FFF` text                  | `--accent` fill, `--paper` text | One per screen                                                                                       |
| Secondary action | `--card` fill, `--ink` text, `--edge` border | `--card` fill, `--ink` text     |                                                                                                      |
| Play / listen    | `--lagoon`                                   | `--accent`                      | Always the same hue, so "lagoon = sound"                                                             |
| Link             | `--lagoon` underlined                        | `--ink` underlined              | Underline is mandatory                                                                               |
| Info notice      | `--sky-tint` + ink                           | `--card` + ink                  |                                                                                                      |
| Problem notice   | `--honey-tint` + ink + icon                  | `--card` + ink + icon           | **There is no red error colour.** Problems are never alarming. Form validation uses ink text + icon. |
| Selected         | 3 px `--ink` outline + check icon            | 3 px `--accent` outline         | Never colour alone                                                                                   |

### Feelings colour mapping (secondary cue only)

Each feeling group gets a tint, loosely following the RULER Mood Meter quadrants. Colour is
**always** paired with a character face and a spoken word, so it is never the only cue.

| Group           | Example feelings           | Tint                            |
| --------------- | -------------------------- | ------------------------------- |
| Big and hot     | angry, frustrated, jealous | `--poppy-tint`                  |
| Bright          | happy, proud, excited      | `--honey-tint`                  |
| Quiet and heavy | sad, lonely, tired         | `--sky-tint`                    |
| Wobbly          | scared, worried, shy       | `--plum-tint`                   |
| Calm            | calm, safe, kind           | `--lagoon-tint` / `--moss-tint` |

---

## Typography

### Families (all OFL, self-hosted as WOFF2 and subset per script)

| Script             | Display (titles, covers)                                                                                | Reading, bands 1-2                                                                        | Reading, bands 3-4                                                                                                      | UI                        |
| ------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| Latin (de, en, tr) | **Fraunces** variable: `opsz` 72-144, `SOFT` 100 in bands 1-2 and 50 in bands 3-4, `WONK` 0, weight 600 | **Andika**: designed by SIL for new readers, with a single-storey a and g and clear I/l/1 | **Literata** variable (OFL, built for long-form screen reading, used by Google Play Books)                              | **Andika**                |
| Arabic (ar)        | **Baloo Bhaijaan 2** 600-700 in bands 1-2. **Noto Naskh Arabic** 700 in bands 3-4.                      | **Noto Naskh Arabic**, **fully vocalised** (tashkeel)                                     | **Noto Naskh Arabic**, **partially vocalised** (harakat only where ambiguous, as in school readers from about Klasse 3) | **Noto Naskh Arabic** 500 |
| Urdu (ur)          | **Gulzar** (Nastaliq)                                                                                   | **Gulzar**, with **Noto Nastaliq Urdu** as fallback (see 07)                              | Same                                                                                                                    | **Gulzar**                |

Why Literata for bands 3-4: at 10-12, readers move to "real books", and the single-storey Andika
reads as a primer. Literata gives the chapter reader a credible book voice while Andika stays the
UI font for all ages, so the shell does not change between bands.

Why these fonts:

- **Andika.** It was built for beginning readers. Its letterforms match the shapes children are
  taught to write, and it covers Turkish (ı İ ş ğ) and German. One family serves both reading and
  UI, which saves a download.
- **Fraunces SOFT.** Soft, ink-trap-like terminals give a printed picture-book voice. It is used
  only at 28 px and above.
- **Naskh for reading, not Kufi or geometric Arabic.** Arabic children's books and school primers
  are set in vocalised Naskh, so it is what children are learning to read. Noto Naskh positions
  harakat reliably.
- **Nastaliq for Urdu**, even in UI. Urdu readers expect it, and Naskh-set Urdu reads as foreign
  (W3C Urdu Layout Requirements). Gulzar is preferred because its vertical metrics are tighter than
  Noto Nastaliq Urdu's, which has very tall ascenders.
- **No dyslexia fonts.** See 05, and Wery & Diliberto (2017).

### Rules

- **No italics in any script.** For emphasis, use weight 600 or the `--mark` tint.
- **No `text-transform: uppercase`.** It breaks Turkish i/İ and does nothing for Arabic.
- **No `letter-spacing` on Arabic or Urdu, ever.** It breaks cursive joining. Latin may use it only
  on display text at 0 to -0.01em.
- The font stack falls back to `system-ui` within the same script, never across scripts.
- Font loading uses `font-display: swap` for UI and `optional` for display. Preload exactly one
  reading font, for the active locale.
- Budget: Latin under 90 KB (+45 KB Literata, loaded only by band 3-4 stories), Arabic under
  160 KB, Urdu under 450 KB. Nastaliq fonts are large and
  this is accepted. The font is cached for offline use on first visit to any ur page.

### Type scale

Child reading text is set larger than adult text. Hughes & Wilkins found that children read faster
with larger type and wider spacing, and pre-readers follow the words with a finger. Arabic Naskh and
Nastaliq have a smaller visual x-height than Andika at the same px size, so their sizes go up.

| Token                 | Latin                | Arabic (Naskh) | Urdu (Nastaliq) | Line height L / A / U | Use                                               |
| --------------------- | -------------------- | -------------- | --------------- | --------------------- | ------------------------------------------------- |
| `--t-story` (phone)   | 24 px                | 28 px          | 26 px           | 1.5 / 1.9 / 2.3       | Storybook text, phone                             |
| `--t-story` (tablet+) | 30 px                | 34 px          | 32 px           | 1.5 / 1.9 / 2.3       | Storybook text, tablet                            |
| `--t-story-projector` | 44 px                | 50 px          | 46 px           | 1.4 / 1.8 / 2.2       | Kamishibai caption                                |
| `--t-prose`           | 20 px                | 22 px          | 22 px           | 1.6 / 1.9 / 2.3       | Full-text view (adult reading aloud)              |
| `--t-display-1`       | 44 px / 56 px tablet | 40 / 52        | 38 / 48         | 1.1 / 1.5 / 1.9       | Story title on cover screen                       |
| `--t-display-2`       | 30 px                | 30 px          | 28 px           | 1.2 / 1.6 / 2.0       | Section titles                                    |
| `--t-ui`              | 17 px                | 18 px          | 18 px           | 1.45 / 1.7 / 2.0      | Buttons, body UI                                  |
| `--t-ui-sm`           | 15 px                | 16 px          | 17 px           | 1.4 / 1.7 / 2.0       | Meta (minutes, languages). Urdu never below 17 px |

The table above gives the band 1 storybook values. **Story type by band** (phone / tablet+; Arabic
+2 px, Urdu +1 px over Latin, with line heights as above):

| Band              | Latin story text | Line height (Latin) | Measure | Reader         |
| ----------------- | ---------------- | ------------------- | ------- | -------------- |
| 1 Picture books   | 24 / 30 px       | 1.5                 | ≤ 32 ch | Storybook      |
| 2 Read-along      | 24 / 28 px       | 1.5                 | ≤ 36 ch | Storybook      |
| 3 Chapter stories | 19 / 21 px       | 1.6                 | ≤ 58 ch | Chapter reader |
| 4 Long reads      | 18 / 19 px       | 1.6                 | ≤ 66 ch | Chapter reader |

Readers can step text size up or down 3 steps (±12% each) from the band default in any band.

Per page of storybook text: at most 3 sentences in band 1 and at most 5 in band 2. This is a
content rule that the layout assumes. Longer text breaks layout on phones in Urdu.

---

## Spacing, radius, elevation

**Spacing** uses a 4 px base. Only use these values.

`--s-1: 4px` `--s-2: 8px` `--s-3: 12px` `--s-4: 16px` `--s-5: 24px` `--s-6: 32px` `--s-7: 48px`
`--s-8: 64px` `--s-9: 96px`

Gutters: 16 px on phones, 32 px on tablets, 48 px on desktop. Touch targets and gaps scale by
band: 64/24 px (band 1), 56/16 px (band 2), 48/12 px (bands 3-4). Adult and shell targets are at
least 44 px with an 8 px gap.

**Radius** uses board-book corners.

| Token       | Value | Use                                             |
| ----------- | ----- | ----------------------------------------------- |
| `--r-s`     | 8px   | Inputs, small chips                             |
| `--r-m`     | 16px  | Buttons, panels                                 |
| `--r-l`     | 24px  | Covers, question cards, dialogs                 |
| `--r-round` | 999px | Only the circular play button and feeling faces |

**Elevation** uses solid offset "card lifted off paper" shadows and never blur.

| Token       | Value                                                  | Use                               |
| ----------- | ------------------------------------------------------ | --------------------------------- |
| `--e-0`     | none                                                   | Flat on paper                     |
| `--e-1`     | `3px 4px 0 rgb(36 33 46 / .14)`                        | Covers, cards                     |
| `--e-2`     | `5px 7px 0 rgb(36 33 46 / .16)`                        | Pressed-up: dialogs, active cover |
| `--e-press` | `1px 1px 0 rgb(36 33 46 / .14)` + `translate(2px,3px)` | Pressed state: the card "lands"   |

In RTL the shadow x-offset flips (`-3px`) so the light source mirrors with the reading direction.
In Lamp the shadow is `rgb(0 0 0 / .5)`.

**Grain.** One tiled 256×256 PNG of monochrome noise at 4% opacity with `mix-blend-mode: multiply`
on `--paper` and `--card`. It is disabled in HC themes and under `prefers-reduced-transparency`.

---

## Iconography

- A custom set drawn on a 24 grid with a 2.25 px stroke, round caps and joins, and slightly
  irregular "brush" terminals (a 0.25 px wobble), so the icons belong to the illustration world.
  Fills come only from the 5 inks.
- Icons are icon-led in bands 1-2 and text-led in bands 3-4. In bands 3-4 every control shows a
  text label next to its icon, the core set renders at 24 px, and spoken labels are off.
- **Child core set (4 icons, unlabelled after first run in band 1, labelled in band 2):** home (a house with a door), back/next
  page (a page corner with an arrow, mirrored in RTL), play/pause (a circle with a triangle, never
  mirrored), and the speaker/repeat for "say it again".
- Child icons are rendered at 40 px inside 64 px targets. Adult icons are 24 px inside 44 px
  targets and always have a visible text label.
- Feeling faces are not icons. They are the recurring characters' heads with the expression (see
  06): 96 px in pickers and 64 px in filters.
- No emoji in the UI. Rendering differs across devices, and the expressions are not ours.

---

## Layout grid

| Class            | Width                | Columns | Gutter | Notes                                                                   |
| ---------------- | -------------------- | ------- | ------ | ----------------------------------------------------------------------- |
| Compact          | < 600 px             | 4       | 16     | Phone portrait. Storybook stacks the image over the text.               |
| Medium           | 600-1023             | 8       | 24     | Tablet portrait, phone landscape                                        |
| Expanded         | 1024-1439            | 12      | 32     | Tablet landscape, laptop. Storybook places image and text side by side. |
| Wide / projector | ≥ 1440 or `?present` | 12      | 48     | Kamishibai: the image is full-bleed                                     |

Content max width is 1200 px. The storybook stage keeps a **3:2** image ratio in landscape and
**4:3** (cropped from the 3:2 master's safe area) in portrait.

Use logical properties only (`margin-inline-start`, `inset-inline-end`, `padding-block`) so that
RTL comes free.

---

## Imagery treatment

- Covers sit on `--card` with `--r-l` corners and `--e-1`. The title is set in HTML **below** the
  image, never baked into it, because titles change per locale.
- Story frames are shown at full stage width with no border and no rounded corners. A frame is a
  page, not a card.
- Line-art frames (the black-line variant) are shown on `--paper`. In Lamp they are drawn in
  `--ink` (ember) via an inline SVG `currentColor`, so line art needs no filter.
- Never crop a character's face. A focal point is stored per image (`focus: [x,y]` in 0-1) and
  used for `object-position`.

---

## Paste-ready tokens

```css
/* Paper & Ink tokens. Source of truth: docs/roadmap/ux/02-visual-language.md */
:root {
  color-scheme: light;
  --paper: #fbf5ea;
  --paper-2: #f3eada;
  --card: #fffdf8;
  --ink: #24212e;
  --ink-2: #5a5466;
  --rule: #d9cdb8;
  --edge: #8c7f6a;
  --poppy: #c8402b;
  --poppy-ink: #a3311f;
  --lagoon: #0f6e6a;
  --honey: #f2b33d;
  --plum: #6b3e75;
  --moss: #3f6b2e;
  --sky: #2c5d9e;
  --poppy-tint: #f8d9cf;
  --lagoon-tint: #cfe7e3;
  --honey-tint: #fbe3a8;
  --plum-tint: #e6d5e8;
  --sky-tint: #d3e0f2;
  --moss-tint: #dce8cf;
  --mark: #fbd989;
  --mark-ink: var(--ink);
  --focus: #1f4fd1;
  --focus-halo: var(--honey);
  --accent: var(--poppy);
  --on-accent: #ffffff;
  --listen: var(--lagoon);

  --font-display: 'Fraunces', 'Andika', system-ui, sans-serif;
  --font-read: 'Andika', system-ui, sans-serif;
  --font-ui: 'Andika', system-ui, sans-serif;
  --t-story: 24px;
  --lh-story: 1.5;
  --t-prose: 20px;
  --lh-prose: 1.6;
  --t-display-1: 44px;
  --t-display-2: 30px;
  --lh-display: 1.1;
  --t-ui: 17px;
  --t-ui-sm: 15px;
  --lh-ui: 1.45;
  --measure-story: 32ch;
  --measure-prose: 66ch;

  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 24px;
  --s-6: 32px;
  --s-7: 48px;
  --s-8: 64px;
  --s-9: 96px;
  --gutter: 16px;
  --r-s: 8px;
  --r-m: 16px;
  --r-l: 24px;
  --r-round: 999px;
  --shadow-x: 1; /* flipped to -1 in RTL */
  --e-1: calc(3px * var(--shadow-x)) 4px 0 rgb(36 33 46 / 0.14);
  --e-2: calc(5px * var(--shadow-x)) 7px 0 rgb(36 33 46 / 0.16);
  --e-press: calc(1px * var(--shadow-x)) 1px 0 rgb(36 33 46 / 0.14);
  --tap-child: 64px;
  --tap-adult: 44px;
  --tap-gap-child: 24px;
  --grain-opacity: 0.04;

  --dur-instant: 80ms;
  --dur-quick: 160ms;
  --dur-base: 240ms;
  --dur-page: 360ms;
  --dur-gentle: 600ms;
  --dur-breath: 4000ms;
  --ease-out: cubic-bezier(0.22, 0.8, 0.32, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-settle: cubic-bezier(0.3, 1.3, 0.5, 1); /* tiny overshoot, used only for "card lands" */
}
@media (min-width: 600px) {
  :root {
    --t-story: 30px;
    --gutter: 32px;
    --t-display-1: 56px;
  }
}
@media (min-width: 1440px) {
  :root {
    --gutter: 48px;
  }
}

:root:lang(ar) {
  --font-display: 'Baloo Bhaijaan 2', 'Noto Naskh Arabic', system-ui, sans-serif;
  --font-read: 'Noto Naskh Arabic', system-ui, serif;
  --font-ui: 'Noto Naskh Arabic', system-ui, sans-serif;
  --t-story: 28px;
  --lh-story: 1.9;
  --t-prose: 22px;
  --lh-prose: 1.9;
  --t-display-1: 40px;
  --lh-display: 1.5;
  --t-ui: 18px;
  --t-ui-sm: 16px;
  --lh-ui: 1.7;
}
:root:lang(ur) {
  --font-display: 'Gulzar', 'Noto Nastaliq Urdu', serif;
  --font-read: 'Gulzar', 'Noto Nastaliq Urdu', serif;
  --font-ui: 'Gulzar', 'Noto Nastaliq Urdu', serif;
  --t-story: 26px;
  --lh-story: 2.3;
  --t-prose: 22px;
  --lh-prose: 2.3;
  --t-display-1: 38px;
  --lh-display: 1.9;
  --t-ui: 18px;
  --t-ui-sm: 17px;
  --lh-ui: 2;
}
@media (min-width: 600px) {
  :root:lang(ar) {
    --t-story: 34px;
    --t-display-1: 52px;
  }
  :root:lang(ur) {
    --t-story: 32px;
    --t-display-1: 48px;
  }
}
[dir='rtl'] {
  --shadow-x: -1;
}

/* Reading bands: set data-band on the story root (from the story), or on <body> for shelf views.
   Bands switch density tokens only. Components must not branch on band. */
[data-band='1'] {
  --tap-child: 64px;
  --tap-gap-child: 24px;
  --measure-story: 32ch;
}
[data-band='2'] {
  --tap-child: 56px;
  --tap-gap-child: 16px;
  --measure-story: 36ch;
  --t-story: 24px;
}
[data-band='3'] {
  --tap-child: 48px;
  --tap-gap-child: 12px;
  --measure-story: 58ch;
  --font-read: 'Literata', Georgia, serif;
  --t-story: 19px;
  --lh-story: 1.6;
}
[data-band='4'] {
  --tap-child: 48px;
  --tap-gap-child: 12px;
  --measure-story: 66ch;
  --font-read: 'Literata', Georgia, serif;
  --t-story: 18px;
  --lh-story: 1.6;
}
@media (min-width: 600px) {
  [data-band='2'] {
    --t-story: 28px;
  }
  [data-band='3'] {
    --t-story: 21px;
  }
  [data-band='4'] {
    --t-story: 19px;
  }
}
:lang(ar)[data-band='3'],
:lang(ar) [data-band='3'],
:lang(ar)[data-band='4'],
:lang(ar) [data-band='4'] {
  --font-read: 'Noto Naskh Arabic', serif;
  --t-story: 21px;
  --lh-story: 1.9;
}
:lang(ur)[data-band='3'],
:lang(ur) [data-band='3'],
:lang(ur)[data-band='4'],
:lang(ur) [data-band='4'] {
  --font-read: 'Gulzar', 'Noto Nastaliq Urdu', serif;
  --t-story: 20px;
  --lh-story: 2.3;
}
/* User text-size step: --text-step is -3..3 */
.story-text {
  font-size: calc(var(--t-story) * (1 + 0.12 * var(--text-step, 0)));
}

/* Lamp (bedtime) */
:root[data-theme='lamp'] {
  color-scheme: dark;
  --paper: #14100c;
  --paper-2: #1e1812;
  --card: #261e16;
  --ink: #e9b26a;
  --ink-2: #b98a55;
  --rule: #3a2e22;
  --edge: #b98a55;
  --accent: #ffcf8a;
  --on-accent: #14100c;
  --listen: #ffcf8a;
  --mark: #5a3e1e;
  --mark-ink: #ffcf8a;
  --focus: #ffcf8a;
  --focus-halo: #5a3e1e;
  --poppy-tint: #261e16;
  --lagoon-tint: #261e16;
  --honey-tint: #261e16;
  --plum-tint: #261e16;
  --sky-tint: #261e16;
  --moss-tint: #261e16;
  --e-1: calc(3px * var(--shadow-x)) 4px 0 rgb(0 0 0 / 0.5);
  --e-2: calc(5px * var(--shadow-x)) 7px 0 rgb(0 0 0 / 0.5);
  --grain-opacity: 0.03;
}
:root[data-theme='lamp'] .frame img {
  filter: brightness(0.62) sepia(0.35) saturate(0.8);
}

/* High contrast */
:root[data-theme='hc-light'] {
  --paper: #ffffff;
  --paper-2: #ffffff;
  --card: #ffffff;
  --ink: #000000;
  --ink-2: #000000;
  --edge: #000000;
  --rule: #000000;
  --accent: #0033cc;
  --on-accent: #ffffff;
  --listen: #0033cc;
  --mark: #ffe600;
  --mark-ink: #000000;
  --focus: #000000;
  --focus-halo: #ffe600;
  --e-1: none;
  --e-2: none;
  --grain-opacity: 0;
}
:root[data-theme='hc-dark'] {
  color-scheme: dark;
  --paper: #000000;
  --paper-2: #000000;
  --card: #000000;
  --ink: #ffffff;
  --ink-2: #ffffff;
  --edge: #ffffff;
  --rule: #ffffff;
  --accent: #ffe600;
  --on-accent: #000000;
  --listen: #ffe600;
  --mark: #ffe600;
  --mark-ink: #000000;
  --focus: #ffe600;
  --focus-halo: #000000;
  --e-1: none;
  --e-2: none;
  --grain-opacity: 0;
}

:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 3px;
  box-shadow: 0 0 0 7px var(--focus-halo);
  border-radius: inherit;
}
@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-quick: 0ms;
    --dur-base: 120ms;
    --dur-page: 120ms;
    --dur-gentle: 120ms;
  }
}
```
