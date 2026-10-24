# 03 Screens

Conventions in this file:

- **Child surface** means band-scaled targets (64 / 56 / 48 / 48 px), the 4 core icons, and spoken
  labels in bands 1-2. **Adult/shell surface** means 44 px targets with text labels, used
  identically for 11-year-olds and adults.
- Every screen lists its single **primary action**.
- Wireframes are drawn LTR. Every one mirrors in RTL except where a note says otherwise (rules in 05).
- Routes are illustrative.

## Information architecture

```
Home ── Reader home (default, text-led)  ⇄  Picture home (icon-led, bands 1-2)
 ├─ Shelf: Picture books | Read-along | Chapter stories | Long reads
 ├─ Story cover ─┬─ Band 1-2: Storybook ─┐
 │               ├─ Band 3-4: Chapter reader ─┤── End ── Talk cards ── Activity / Read again
 │               ├─ Full text                │
 │               └─ Two languages ───────────┘
 ├─ Find by feeling ── 3 picks ── (more)
 ├─ Library (search, filters by feeling, situation, shelf, length, language)
 ├─ My reading list (bands 3-4 readers; "Want to read", "Finished")
 ├─ Lamp (bedtime door) ── Lamp shelf ── reader in Lamp
 └─ For grown-ups ─┬─ For families
                   ├─ For teachers & educators ── Class room, print packs, prep sheets, class links
                   ├─ Settings (who reads here, languages, text size, theme, narration, offline, forget)
                   └─ About (stories, AI art statement, privacy)
```

The site has **three rooms**: Day (default), Lamp (bedtime) and Class (projector). A room is a
theme plus a behaviour preset. It is not a separate site. The room is stored on the device.
`prefers-color-scheme: dark` on first visit selects Lamp.

There are **two homes over one shell.** The top bar, menus, library and settings are identical in
both and always set at adult/band-4 density. Only the home body changes. Which home a device
shows is `reader-prefs.home`.

---

## 1a. Reader home (default)

**Purpose:** a credible front door for an 11-year-old, a teacher or a parent, and one obvious door
for little ones.
**Primary action:** continue reading, or open a story.

1. **Top bar (56 px):** wordmark at the start. At the end: search (an icon plus "Search" label on
   ≥ 600 px), language (speech bubble plus endonym), and "For grown-ups".
2. **Continue:** if there is a bookmark, show one horizontal card with the cover thumbnail, title,
   "Chapter 3 of 6" or "Page 5 of 10", and a Continue button. Hidden otherwise.
3. **Picture books door:** a full-width honey-tint band showing three band-1 character faces and
   the label "For little ones: listen and look" (not "Picture books", which is the first shelf's name). It switches to Picture home and is
   remembered. It is shown prominently because a pre-reader cannot find a text link.
4. **Shelves:** four labelled sections in band order, but the device's preferred shelf comes first.
   Each shows 4-6 covers in a row (wrapping on phone, not a carousel) and a "See all" link. No
   "moving up" cover here: the next shelf is on the same page, so it only repeats a story.
5. **Find by situation:** chips (as in the Library) using words, not faces: "Friendship trouble",
   "Being fair", "Big feelings", "New at school", "Making mistakes", "Online" and so on. These are
   editor-curated examples, not a taxonomy.
6. **Lamp door** and **footer** as in 1b.

Covers here use the cover image with the title in HTML. Band-3/4 covers show the chapter count, not
an age.

```
┌──────────────────────────────────────────────────────┐
│ Lernen mit Geschichten   [⌕ Search] [💬 Deutsch] [For grown-ups]│
├──────────────────────────────────────────────────────┤
│ [▣] The Note in the Locker · Chapter 3 of 6  [Continue]│
│ ▓▓ (face)(face)(face)  For little ones: listen, look ▓│
│ Chapter stories                              See all │
│ [cov][cov][cov][cov][cov][cov]                       │
│ Long reads                                   See all │
│ [cov][cov][cov][cov]                                 │
│ Read-along / Picture books …                         │
│ Find by situation: (Friendship trouble)(Being fair)… │
│ ▓▓▓▓▓▓▓▓▓ ☾ Bedtime stories ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└──────────────────────────────────────────────────────┘
```

**Don't:** show ages, levels, counts, or "recommended for you".

## 1b. Picture home (bands 1-2)

**Purpose:** get a child into a story in 2 taps.
**Primary action:** open the "next" or continued story.

The top bar is the same as on Reader home. A "Reader home" link sits in the For-grown-ups menu,
not on the child surface.

### Anatomy (in order)

1. **Top bar (adult surface, 56 px):** wordmark (Fraunces) at the start. At the end: language
   (endonym of the current language plus a speech-bubble icon) and "Grown-ups". No hamburger.
2. **Hero, "Your story":** one large cover, 60% of the viewport width on tablet and 100% on phone.
   If a story is in progress, its bookmark ribbon shows and tapping resumes it. Otherwise it is the
   editors' pick of the week (hand-set, not algorithmic). A round lagoon play button of 96 px sits
   on the cover, and tapping it starts the storybook with narration.
3. **"How do you feel?" row:** 6 feeling faces at 96 px (happy, angry, sad, scared, calm, proud).
   Tapping one speaks the word in the active language and opens Find by feeling (section 3) with
   that feeling preselected.
4. **"More stories" shelf:** 6 covers from Picture books and Read-along (with the device's preferred
   one first), in a 2×3 grid on phone and a 6×1 row on tablet. It is not a carousel. The fifth tile
   is a Chapter story ("moving up"), and the last tile is "All stories" and leads to Reader
   home's shelves.
5. **Lamp door:** a wide, low band at the bottom in plum, with a moon and "Bedtime". From 18:30
   local time it moves above the shelf. The device clock is the only signal used.
6. **Footer (adult):** About, Privacy ("We store nothing about you"), "Illustrations made with AI
   tools, checked by people", and Offline status.

```
┌──────────────────────────────────────────────────┐
│ Lernen mit Geschichten      [💬 Deutsch] [Grown-ups]│
├──────────────────────────────────────────────────┤
│  ┌──────────────────────────────┐                │
│  │         COVER ART            │   Bruno and the│
│  │                     ( ▶ )    │   Thunder Cloud│
│  │ ▌ribbon                      │   6 min · 4-6  │
│  └──────────────────────────────┘                │
│  How do you feel?                                │
│  (😊) (😠) (😢) (😨) (😌) (😎)   ← character faces │
│  More stories                                    │
│  [cov][cov][cov][cov][cov][All →]                │
│ ▓▓▓▓▓▓▓▓▓▓ ☾  Bedtime stories ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└──────────────────────────────────────────────────┘
```

(The emoji in the sketch are placeholders. Real faces are character art.)

**States:** on first visit there is no ribbon and a 10-second spoken welcome from the host character
plays only when the child taps the "?" bubble, never automatically. Offline: covers that are not
saved are shown at 40% opacity and a small cloud icon replaces their play button (see section 11).

**Large screen:** the hero sits next to the feelings row (hero on the start side, feelings stacked
2×3 on the end side).

**RTL:** the shelf order runs right to left. The play button stays at the bottom-end corner of the
cover.

**Don't:** show a "new!" badge, a count of stories read, or a personalised greeting with the
child's name.

---

## 2. Library (grown-ups)

**Purpose:** let Thomas or Maria find the right story for a moment in under 20 seconds.
**Primary action:** open a story.

### Anatomy

1. **Search field** (on submit, client-side over title, summary, characters and skills in the
   active language; no live dropdown).
2. **Situation chips** (single row, wraps): "Big feelings", "Making friends", "Sharing", "Being
   brave", "Bedtime", "New baby", "First day at kita", "Waiting", "Saying sorry". These are
   editor-curated tags in front of the 58-skill taxonomy. The full taxonomy is behind "All skills".
3. **Filter row:** shelf (Picture books / Read-along / Chapter stories / Long reads, with
   "Klasse 1-2" etc. shown as secondary adult text), feeling (a face plus a word), length (≤ 5 /
   ≤ 15 / ≤ 30 / 30+ min), format (storybook / chapters / two languages available), and
   "Available in…" (multi-select of endonyms). Within a filter type the
   logic is OR, and across types it is AND. A "Clear" button appears as soon as any filter is set.
4. **Result count:** "12 stories" in a polite live region.
5. **Results grid:** cover cards with title, a 1-line summary, a skill tag (1 shown, "+2" for more),
   shelf name and minutes. No language endonyms: most stories exist in most languages, so the row
   repeats on every card; "Available in…" and the story page's language links answer that question. A saved-offline indicator is a filled dot
   with the label "On this device".

**States:** with no results, the screen says "No story fits all of these. Remove _Long reads_?" and offers
a one-tap removal of the most restrictive filter. Loading shows skeleton covers in `--paper-2` with
no shimmer.

**Mobile:** filters sit in a bottom sheet opened by "Filter (2)", and the situation chips stay
visible above the grid. **Large:** a filter column on the start side and a 3-4 column grid.

Filters persist in the URL query string (shareable between educators) and not in storage.

---

## 3. Find by feeling (child)

**Purpose:** a child or parent names a feeling and gets a _small_ number of stories about it.
**Primary action:** pick a story.

1. A big face of the chosen feeling with the word under it and a speaker icon to repeat it.
2. The question in the narrator's voice (played on tap of the speaker icon only): "Stories about
   feeling _angry_".
3. **Exactly 3 covers**, chosen by editor ranking within the feeling, with available narration in
   the active language ranked first.
4. "Different feeling" (back to faces) and "More stories" (opens the Library pre-filtered).

Three choices respect autonomy without causing choice overload for a 4-year-old. Each cover speaks
its title on the first tap and opens on the second, and the selected cover lifts to `--e-2`.

**RTL:** the face is centred and does not mirror. Cover order is mirrored.

From Reader home, feelings are reached through the Library's feeling filter (word plus small face),
which returns the full filtered list rather than 3 picks. The 3-pick limit is for pre-readers.

---

## 4. Story cover screen

**Purpose:** confirm "this one", and choose how to read it.
**Primary action:** ▶ Read with me (storybook with narration).

1. The cover image (full width, 3:2).
2. The title (display-1) and the characters' faces, small, with names.
3. **Primary:** "▶ Read with me" (lagoon, 64 px). **Secondary row:** "Read myself" (storybook
   without narration), "Two languages", "Full text".
4. **For grown-ups** (collapsed by default, adult surface): skill tags, summary, minutes, age, and
   the 3 talk prompts as a preview. Also "Print pack", "Keep on this device (4.2 MB)" and "Use in
   class".
5. **Other languages:** endonym links to the same story in each available language.

**Bands 3-4 variant:** the primary action is "Start reading" (or "Continue, chapter 3"). Secondary
actions are "Listen", "Two languages" and "Add to my reading list". A chapter list (titles plus
minutes) replaces the character faces. The grown-ups panel is labelled "For teachers & families"
and adds discussion cards and the Class-room entry.

The story is the same one in every language, and the cover changes only the text. If no narration
exists in the active language, "Read with me" is relabelled "Read with device voice" and the
grown-ups panel notes "No recorded voice yet".

---

## 5. Storybook (page by page, bands 1-2)

**Purpose:** the core experience for young readers: one spread at a time, read aloud, with the
current word highlighted. Band 2 uses the same anatomy with 56 px targets, text labels under the
arrows ("Back", "Next"), and the text band at 44% instead of 38% of the landscape stage.
**Primary action:** next page.

### Anatomy

```
Tablet landscape (expanded)                         Phone portrait (compact)
┌──────────────────────────────────────────────┐   ┌────────────────────┐
│ [⌂]                                 [▶❚❚] [⋯] │   │[⌂]          [▶❚❚][⋯]│
│ ┌──────────────────────────┐                 │   │┌──────────────────┐│
│ │                          │  Bruno stamps   │   ││                  ││
│ │       FRAME (3:2)        │  his feet.      │   ││   FRAME (4:3)    ││
│ │                          │  ▒▒▒▒▒ "No!"    │   ││                  ││
│ │                          │  he shouts.     │   │└──────────────────┘│
│ └──────────────────────────┘                 │   │ Bruno stamps his   │
│ (‹)          ● ● ● ○ ○ ○ ○ ○            (›)  │   │ feet. ▒▒▒ he shouts│
└──────────────────────────────────────────────┘   │(‹)  ●●●○○○○○  (›)  │
                                                   └────────────────────┘
```

1. **Stage:** the frame image. It takes the start 62% in landscape and is on top in portrait.
2. **Text band:** `--paper-2`, story text in `--t-story`, at most 5 sentences. Text is never
   overlaid on the image.
3. **Page controls:** previous and next arrows at 64 px, at the bottom corners and inside the thumb
   zone. Between them a page dots row (not interactive for children, but keyboard reachable as
   "Page 3 of 8").
4. **Top controls (auto-hide after 3 s of no input, return on any tap of the stage):** home, the
   play/pause narration button, and ⋯ (adult menu: text size, narration speed, highlight on/off,
   language, switch to two languages, Lamp, exit).

### Behaviours

- **Narration:** when "Read with me" is chosen, narration of each page starts 400 ms after the turn
  settles. When a page's narration ends, the book **waits** and does not auto-turn by default. A
  pulsing next arrow (one gentle 600 ms pulse, then still) invites the turn. Auto-turn is an option
  in ⋯ and is on by default in Lamp.
- **Word highlight:** a `--mark` background behind the word being spoken, with rounded 4 px corners
  and no layout shift. It is implemented with the CSS Custom Highlight API (see 05). The previous
  word fades out over 160 ms.
- **Tap a word:** speaks that word only (recorded audio, using the word timing to seek and play just
  that span). This is the one text interaction allowed, because it supports decoding.
- **Tap the stage:** shows or hides the controls. Nothing else, and no hotspots.
- **Interactive pages** (`page.kind: practice`) are allowed only when the interaction is the taught
  skill: breathing with the character (expanding circle, 4 s in and 4 s out, 3 cycles), "show me
  your angry face" (no camera, just a pause with prompt audio), or a choice of what the character
  should do next (both branches return to the story). At most 1 per story.
- **Resume:** the bookmark ribbon stores `{storyId, locale, page}` locally. Reopening resumes and
  shows a small "Start again" link for 5 s.
- **Orientation change** keeps the current page and the narration position.

**States:** an image that has not loaded shows a `--paper-2` block with the story's lead ink as a
line-art silhouette placeholder, and the text is readable immediately. Audio that fails to load
shows the play button with a struck speaker and the label "No sound right now". Reading continues.

**RTL:** the page turns in the reading direction, so "next" is on the left and swipe direction
inverts. The image sits on the end side in landscape. The play icon does not mirror.

---

## 5b. Chapter reader (bands 3-4)

**Purpose:** sustained independent reading on a Chromebook, tablet or phone, without the feel of a
picture app.
**Primary action:** keep reading (next page or scroll).

### Anatomy

```
Chromebook / tablet landscape                      Phone
┌───────────────────────────────────────────────┐  ┌────────────────────┐
│ ← The Note in the Locker   Ch. 3 / 6  [Aa][🎧][⋯]│ │← Ch.3/6   [Aa][🎧][⋯]│
├───────────────────────────────────────────────┤  │ 3 · The Group Chat │
│        3 · The Group Chat                     │  │ ┌────────────────┐ │
│   ┌──────────────── opener frame ──────────┐  │  │ │ opener frame   │ │
│   └────────────────────────────────────────┘  │  │ └────────────────┘ │
│   Jonas read the message twice. Everyone      │  │ Jonas read the     │
│   had already reacted with a laughing face…   │  │ message twice…     │
│                     (≤ 66 ch measure)          │  │ (scrolls)          │
│ (‹ Back)        ▬▬▬▬▬▬▬░░░░░ 42%       (Next ›)│  │ [ Next chapter › ] │
└───────────────────────────────────────────────┘  └────────────────────┘
```

1. **Header (sticky, 48 px):** back to the cover, story title, "Ch. 3 / 6", and three controls:
   **Aa** (text size, line spacing, theme, font: Literata / Andika), **Listen**, and **⋯** (chapters,
   two languages, add to list, print, Class room).
2. **Chapter opener:** the chapter number and title in display-2, then the opener frame (3:2, at
   most 40% of the viewport height).
3. **Body:** Literata at band size, 66 ch measure, paragraphs spaced 0.8 em apart, no justification
   (it causes rivers in German compounds and is never used in Urdu). In-chapter frames or comic
   sequences appear inline where the story places them.
4. **Footer:** on tablet and laptop (≥ 600 px), the text is **paginated** into columns, with
   back/next and a thin position bar. On phones it **scrolls**, and a "Next chapter" button closes
   each chapter.

### Behaviours

- **Keyboard (Chromebook):** ←/→ turn pages (mirrored in RTL), space and PageDown go forward,
  `[` and `]` jump chapters, `L` toggles Listen, and Esc closes panels. Focus never lands on the body
  text.
- **Listen:** narration of the current page or paragraph with an optional highlight (off by default
  in band 4, on in band 3). Speed 0.75×-1.25×. The page follows the voice.
- **Second-language tools** (shown when Settings marks the story language as "a language I'm
  learning", or a class link sets it): tap or click a word to hear it, a "say the sentence again"
  button, and an optional gloss in the reader's other language _only for words the editors marked_
  (5-10 per chapter, written by translators, never machine-generated). The gloss opens as a small
  card and does not navigate. Takacs et al. found dictionaries distracting for young children, so
  glosses stay limited, off by default for L1 readers, and absent in bands 1-2.
- **Bookmark:** `{storyId, locale, chapter, offset}`. Reopening resumes there with no "Start
  again" pop-up. The chapter list on the cover handles restarting.
- **End of chapter:** a small "Chapter 3 done · Next: The Choice" card. It does not auto-advance and
  has no confetti.

**RTL:** pagination runs right to left. The progress bar fills from the right, and keyboard arrows
mirror.

## 6. Full text view (grown-ups reading aloud)

**Purpose:** an adult reads the whole story aloud from a phone, or skims it before circle time.
**Primary action:** none (reading). Secondary: "Open as book".

The story is one column at `--t-prose`, with frames inline at 100% width and a page marker in the
margin. Talk prompts are shown inline at the places where they fit, in a plum-tinted aside ("Ask:
How does Bruno's body feel right now?"). These come from the story's dialogic prompt fields and can
be hidden.

---

## 7. End of story and talk cards

**Purpose:** close the story calmly and start a conversation.
**Primary action:** "Let's talk" (cards). Alternatives have equal visual weight. The primary is
distinguished by its position, not by size.

### 7a. "The End" spread

The final frame shows the characters waving. "The End" is set in display type and spoken. After
1.5 s, three choices appear (64 px, illustrated icons with labels and spoken on first tap):

`(💬 Let's talk)   (🖍 Colour it)   (↻ Read again)`

A small adult link "Home" sits underneath. There is no next-story suggestion here, no countdown and
no autoplay.

### 7b. Talk cards (at most 3, one per screen)

```
┌────────────────────────────────────┐
│  (🔊)  Where was Bruno when he     │
│        felt the thunder inside?    │
│  ┌────────┐ ┌────────┐ ┌────────┐  │
│  │ frame 2│ │ frame 5│ │ frame 7│  │  ← picture choices, 160 px min
│  └────────┘ └────────┘ └────────┘  │
│                       [Next card ›]│
└────────────────────────────────────┘
```

| Card type               | Input                                                                                    | Feedback                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Recall** (CROWD R/Wh) | 2-3 frames from the story. The question is read aloud on entry, once.                    | **Right:** the chosen frame lifts, `--mark` outline, and a specific spoken line ("Yes, in the garden, by the big tree"). **Wrong:** the chosen frame gently settles back, no colour change, then "Let's look again" and the correct frame shows a soft honey glow for 2 s. A second wrong tap reveals the answer with the same spoken line. There is no "wrong" sound. |
| **Feeling** (CROWD O)   | 4 faces: "How did Bruno feel?" or "How would _you_ feel?"                                | Every face is accepted. The character mirrors it: "Sometimes I feel _scared_ too."                                                                                                                                                                                                                                                                                     |
| **Talk** (CROWD D)      | None. Grown-up text plus audio: "Tell your grown-up about a time you felt like thunder." | A "We talked" button simply moves on. Nothing is recorded.                                                                                                                                                                                                                                                                                                             |

After the cards, the 7a choices return without "Let's talk".

### 7c. Think cards (bands 3-4, at most 5, one per screen, text-led, 48 px)

| Card type                                    | Input                                                                                                                                   | Feedback                                                                                                                                                                                     |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Find the sentence** (recall with evidence) | "Where does Mira decide to tell the teacher?" A Find button opens the relevant chapter in a side sheet, and the reader taps a sentence. | Right: the sentence gets `--mark` and a one-line comment. Not right: "That's close. Mira is still deciding here. Read on a little." and the sheet scrolls to the paragraph. No reveal timer. |
| **What would you do?** (dilemma)             | 2-4 text options plus "Something else"                                                                                                  | Every choice is accepted. Then "Here is what Jonas did, and why." with a pointer to the chapter.                                                                                             |
| **Switch perspective**                       | "Tell chapter 2 as Lea." A free-text field (optional, kept only on this device) or "Talk about it".                                     | No evaluation. Text can be printed or deleted and is never sent.                                                                                                                             |
| **Two sides** (band 4)                       | A statement ("Jonas should have left the group chat.") with Agree / Not sure / Disagree.                                                | Shows a reason for each side drawn from the story, never a "correct" side.                                                                                                                   |
| **Talk / discuss**                           | None                                                                                                                                    | For class use, the card is also on the prep sheet.                                                                                                                                           |

The end screen for bands 3-4 offers **Think about it** / **Activity** (print) / **Add to
finished** (if the reading list is used) / **Back to shelf**.

Answers are **not stored**, except the optional free text, which the reader controls. There is no
history of right or wrong.

---

## 8. Two languages (bilingual reading)

**Purpose:** Maria reads in German while her daughter hears Turkish, or Leyla toggles between
German and Arabic.
**Primary action:** next page.

### Setup

The setup is a two-step picker using endonyms: "First language" and "Second language". It
remembers the last pair. Only pairs that both exist for this story can be chosen. Unavailable
languages show "not yet" and are disabled with an explanation, not hidden.

### Layout

- **Expanded, both LTR or both RTL:** the frame on top, two text columns underneath with equal size,
  colour and weight. Column order follows the _page_ direction of the first language.
- **Mixed direction (de + ar):** the page direction follows the first language. Each text block
  carries its own `dir` and `lang`, aligned to its own start edge. The blocks are stacked, not side
  by side, because side-by-side mixed-direction columns make eyes jump the wrong way.
- **Compact:** the frame, then the first-language block, then a 1 px `--rule`, then the
  second-language block. A small endonym label is shown above each block in `--ink-2`.

### Narration

The play button offers "First → second" (default), "Only first" and "Only second". Highlight runs
in whichever block is speaking, and the other block is shown at 100% opacity, never dimmed.

**Don't:** use flags, or label one language as the "translation".

---

## 9. Lamp mode (family and bedtime)

**Purpose:** a calm 10-15 minute ritual in a dark room on a phone, ending in sleep and not in
another story.
**Primary action:** ▶ Play.

### Entry

From the Lamp door or the ⋯ menu. The transition is a 600 ms crossfade to the Lamp palette (just a
fade under reduced motion).

### Lamp shelf

A shelf of 4-6 stories editors tag `bedtime: true` (calm arc, low arousal, no scary peak).
Duration is shown prominently: "7 min". The page also shows the reminder "Dim your screen.
Grown-up tip: put the phone down and just listen." with an "Okay" button. The site cannot set
device brightness, so it says so plainly.

### Reading in Lamp

- Same storybook, Lamp palette, frames filtered warm and dim. Narration is on, auto-turn is on, and
  the narration rate is the recorded rate (no speed-up). Any music bed and sound effects are off.
- **Lights out:** a large moon button in `--rose`. It fades the whole screen to `#000` over 4 s,
  leaving one 24 px moon at 20% opacity in the corner. Audio continues. A single tap anywhere
  brings the page back. Under the hood: Screen Wake Lock is released, `navigator.mediaSession`
  metadata is set so lock-screen controls work, and the audio element keeps playing if the device
  sleeps.
- **At the end:** narration says "Good night". The screen stays black (if lights-out is on), audio
  stops, and nothing else plays. With lights on, the end spread shows only "Good night" and a small
  home link. No talk cards appear at bedtime, because the questions are for daytime.

**Phone portrait** is the reference layout. **Tablet** uses the same layout, centred, at a maximum
width of 720 px.

**Bands 3-4 in Lamp:** the chapter reader in the Lamp palette. There is one extra mode, **"Listen
in the dark"**, which plays the chapter with lights-out, for older children who listen alone. It
plays one chapter, then says "End of chapter 3. Good night." and stops. It does not continue to the
next chapter.

---

## 10. Class room (kita circle time to Klasse 6)

The Class room has two modes, and the story's band picks the default:

- **Kamishibai** (bands 1-2, kita and Klasse 1-2): picture first, educator script separate.
- **Shared reading** (bands 3-4, Klasse 3-6): text first, readable from the back row, with
  discussion cards.

### 10a. Kamishibai

**Purpose:** Thomas shows a story to 20 children on a projector or a tablet held up, and reads
from his own script.
**Primary action:** next card.

### Single-screen mode (tablet held up, or projector only)

- The frame goes full-bleed with letterboxing in `--ink` (`#000` in Lamp). Text is hidden by
  default. A caption toggle shows text at `--t-story-projector` in a band at the bottom.
- An educator drawer swipes up from the bottom edge or opens with the `T` key. It shows the page
  text, 1-2 prompts for this page (CROWD), and a thumbnail of the next frame. It takes 40% of the
  height and leaves the frame visible above.
- Controls: arrows, space or PageDown advance; Shift+space goes back; a clicker (which sends
  PageDown/PageUp) works; `B` blacks out the screen; `N` toggles narration; `C` toggles captions.

### Two-screen mode (laptop plus projector)

"Open audience window" opens a second window in the same origin, which the educator drags to the
projector. The windows stay in sync over `BroadcastChannel`, so no network is needed. The educator
window shows the current text, prompts, the next thumbnail, a page list for jumping, and a quiet
elapsed-time display. The audience window shows only the frame and an optional caption.

### Educator prep (from the cover's grown-ups panel)

- **Prep sheet (print, 1 A4 page):** summary, skill and why it matters, 5 key words, all prompts by
  page, a 10-minute follow-up activity, and the matching colouring pages listed.
- **Circle folder:** "Add to my circle folder" keeps a local list of stories with an order. It can
  be exported as a `.json` file and imported on another device (no server). The list is shown at
  Grown-ups → For educators.

**Large-screen rules:** projector contrast is poor, so Kamishibai forces `--t-story-projector`,
ink-on-paper captions without grain, and image `filter: contrast(1.05)`.

### 10b. Shared reading (bands 3-4)

**Purpose:** Frau Yıldız reads a chapter with the class on the whiteboard and discusses it, with a
DaZ group following in Turkish or Arabic.
**Primary action:** next page.

- **Audience view:** the text is large (Latin 40 px, 1.5 line height, ≤ 50 ch), 6-9 lines per screen,
  with the chapter opener frame as a half-screen first page. The teacher can step the highlight
  sentence by sentence (`↓`), which marks the current sentence with `--mark` for choral or
  round-robin reading.
- **Two-language audience view:** stacked as in section 8, with the second language at equal size.
  This is used for DaZ.
- **Teacher view** (second window or drawer, as in 10a): page text, discussion questions for this
  chapter, vocabulary (editor-marked words with glosses), and the think cards.
- **Discussion card** (`D`): one think card full-screen for the class. "Two sides" shows
  Agree / Not sure / Disagree as large labels for a show-of-hands. **Nothing is counted or
  entered.**

### 10c. Class links (pupil devices)

From the For-teachers panel, "Set up pupil devices" builds a link and a QR code (generated
client-side) with `shelf`, `lang`, `second`, optional `story` and `narration=on`. Opening it on a
pupil device shows a confirm card ("This device will start with Chapter stories in Deutsch, with
Türkçe alongside.") and then stores the values in `reader-prefs`. The QR also prints on the prep
sheet. There is no roster, code or account.

---

## 11. Print and colouring

**Purpose:** a printed page in a child's hand within 3 taps.
**Primary action:** Print.

1. **Print pack screen:** thumbnails of what will print: cover sheet (title, characters, "Name:
   ______"), 4-6 colouring pages (the story's line frames), and 1 talk card sheet. Each item has a
   checkbox, and all are selected by default.
2. **Detail switch:** "Big shapes", "More detail" or "Fine detail". This chooses between the line-art
   variants that exist for the story (see 06). The default follows the story's band.
   **Band 3-4 packs** add or replace items: a comic page with the story's panels and empty speech
   bubbles ("Write what they say"), a story map (chapters as a path with spaces to draw or write), a
   character-perspective sheet, a pattern colouring page built from the story's motifs, and
   discussion cards (4 per A4, cut lines). Teacher packs include a version without the cover sheet
   for photocopying.
3. **Paper:** A4 by default, with a Letter option. Locale does not change the paper size.
4. **Print button:** calls `window.print()` with a print stylesheet. Each item is one page with
   `@page { margin: 12mm }`, the line art is vector SVG, the backgrounds are white, and no UI or
   grain is printed. The footer is small: the story title, the site name and "AI-assisted
   illustration".
5. **Single page:** each frame in the storybook ⋯ menu has "Print this as a colouring page".

**Lamp:** printing is not offered (it is bedtime). **Offline:** printing works if the story is kept
on the device.

---

## 12. Offline and install

**Purpose:** make the kita's flaky wifi irrelevant.
**Primary action:** "Keep on this device".

- A service worker precaches the app shell, fonts for the active locale and the home covers.
  Stories are runtime-cached as they are read, and explicitly kept via "Keep on this device".
- **Per story:** "Keep on this device (4.2 MB)" toggles to "On this device ✓ · Remove".
- **Packs (Grown-ups → Offline):** "All stories in Deutsch (≈ 60 MB)", "Bedtime shelf", "My circle
  folder". Packs show their size, and a progress bar shows "12 of 16" during download. A pack can be
  stopped and resumed.
- **Storage panel:** "Using 84 MB on this device", with per-pack removal and "Forget this device"
  (clears all storage and caches after a confirm dialog).
- **Install:** no automatic prompt. A "Put it on your home screen" card appears in Grown-ups →
  Offline, with platform-specific steps (iOS Share sheet, Android menu), and it uses
  `beforeinstallprompt` where available.
- **Offline banner:** honey-tint with a cloud icon: "Offline. Stories on this device still work."
  It is shown once per session and is dismissible. Covers that are not saved are dimmed and open an
  explanation instead of failing.

---

## 13. Language switch

**Purpose:** change the site language without losing your place.
**Primary action:** pick a language.

- The trigger is the speech-bubble icon plus the current endonym, always top-end.
- The panel is a list of 5 rows, each 56 px. Each row shows the endonym in its own script and font,
  with a speaker icon that says the language name in that language. The current language is marked
  with a check and the row is not a link.
- The selected language is stored locally, and the URL changes to the locale route.
- **Inside a story:** if the story exists in the target language, the same page opens and the
  current page is kept. If not, the dialog says "This story isn't in Türkçe yet", lists the
  languages it is available in, and offers "Go to Türkçe home".
- First visit: the default comes from `navigator.languages`, mapped to one of the 5, else Deutsch.
  There is no IP lookup and no splash "choose your language" wall.

---

## 14. System states

| State                                      | What the child sees                                                                                        | What the adult sees                                                                                                   | Rules                                                                                                                      |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Loading (route)**                        | Nothing for 300 ms, then a paper-2 skeleton of the target layout                                           | Same                                                                                                                  | No spinners. Skeletons match the final geometry, so there is zero layout shift.                                            |
| **Loading (image)**                        | Line-art silhouette placeholder in the story's lead ink                                                    | Same                                                                                                                  | Text never waits for images.                                                                                               |
| **404**                                    | A character holding an empty book: "This page got lost." Big home button (64 px) and a spoken line on tap. | "We couldn't find this page" plus links: Home, Library, "This story in other languages" when the slug matches a story | Shown in the language from the URL prefix. If there is no prefix, use the stored language, else Deutsch. No auto-redirect. |
| **Empty (library filters)**                | n/a                                                                                                        | Suggest removing a filter (section 2)                                                                                 |                                                                                                                            |
| **Empty (circle folder or offline packs)** | n/a                                                                                                        | One sentence plus an action: "Add stories from any story's grown-ups panel."                                          |                                                                                                                            |
| **Offline, page not cached**               | Friendly character with a cloud: "This story needs the internet." plus the 3 cached stories                | Same, plus "Keep stories on this device"                                                                              |                                                                                                                            |
| **Audio error**                            | Struck speaker icon. The story continues silently.                                                         | "Sound didn't load. Check your connection or use the device voice."                                                   | Never blocks reading.                                                                                                      |
| **Script error**                           | Content stays readable because pages are server-rendered HTML first                                        | Same                                                                                                                  | Progressive enhancement: the storybook degrades to the full text view.                                                     |
| **Story in draft**                         | Never visible                                                                                              | Never visible                                                                                                         |                                                                                                                            |

The illustrations for error states are a dedicated small set: 6 "spot" drawings of recurring
characters (see 06). They are drawn at band-2 proportions so they read neither as babyish nor as
too grown-up.

---

## 15. Settings: "Who reads on this device?"

**Purpose:** set the front shelf and the home once, without labelling a child.
**Primary action:** choose.

- There are five large choice cards. Each shows a typical page from that shelf, not an age:
  **Picture books** ("listen and look"), **Read-along** ("first reading, with a voice"), **Chapter
  stories**, **Long reads**, and **Mixed** ("family or kita: everything, pictures first").
- Adult-facing secondary text under each card: "often 3-5 / Kita", "often Klasse 1-2", "Klasse 3-4",
  "Klasse 5-6".
- Below: "Languages I read" (first and second) and "A language I'm learning" (which turns on the
  second-language tools in 5b).
- The setting is offered in a **first-run card** on Reader home ("Who reads here? You can change
  this any time.") with a "Skip" option. The card is dismissible and is never a blocking wall.
- Changing it reorders shelves and picks the home. It never hides content.

## 16. My reading list (optional, for bands 3-4 readers)

**Purpose:** a reader's own tool for choosing what to read next. It is not a log.
**Primary action:** open a story.

There are two tabs, **Want to read** and **Finished**. Each is a list of covers with titles, in the
order the reader added them, and the reader can drag to reorder. No counts, dates, totals, streaks
or charts are shown. Items can be removed. Export/import as `.json` uses the same mechanism as the
circle folder. "Forget this device" clears it. Reached from Reader home's top bar menu, and hidden
until the reader adds a first story.
