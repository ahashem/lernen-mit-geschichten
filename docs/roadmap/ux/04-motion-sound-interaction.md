# 04 Motion, sound and interaction

## Motion principles

1. **Paper physics, not app physics.** Things slide, settle and lift like card on a table. Nothing
   bounces, spins, zooms or wobbles.
2. **Motion explains place.** It is used only to show where something came from or went (a page
   turned, a card lifted, a panel opened). Motion is never decoration or reward.
3. **Calm ceiling.** At most one moving thing on screen at a time. No looping animation anywhere,
   except the breathing circle on a practice page, which is the exercise itself.
4. **Less with age.** Band 1-2 page turns are visible and tactile. In bands 3-4 transitions are
   short and nearly invisible, the way a good e-reader behaves.
5. **Transform and opacity only.** No animated layout, filter or box-shadow on the 2019-tablet
   baseline.

## Tokens

| Token           | Value                        | Use                                                                           |
| --------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| `--dur-instant` | 80 ms                        | Press feedback                                                                |
| `--dur-quick`   | 160 ms                       | Highlight fade, chip toggle, tooltip                                          |
| `--dur-base`    | 240 ms                       | Panels, sheets, dialogs                                                       |
| `--dur-page`    | 360 ms                       | Storybook page turn (bands 1-2). Chapter page in bands 3-4 uses `--dur-base`. |
| `--dur-gentle`  | 600 ms                       | Room change (Day ⇄ Lamp), single invitation pulse                             |
| `--dur-breath`  | 4000 ms                      | One breathing phase on a practice page                                        |
| `--ease-out`    | `cubic-bezier(.22,.8,.32,1)` | Entering                                                                      |
| `--ease-in-out` | `cubic-bezier(.65,0,.35,1)`  | Page turns, room fades                                                        |
| `--ease-settle` | `cubic-bezier(.3,1.3,.5,1)`  | Only "card lands" on press release (≤ 4 px overshoot)                         |

## Signature motions

| Motion                                                            | Spec                                                                                                                                                                                                                                                                                                                                                    | Reduced motion                                                                          |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **Page turn (bands 1-2)**                                         | The outgoing page slides 24% toward the reading start and fades to 0. The incoming page slides from 24% at the reading end to 0 with a solid `--e-2` shadow on its leading edge that drops to `--e-0`. 360 ms `--ease-in-out`. In RTL the direction flips. **No 3D page curl**: it is costly on cheap GPUs, and the curl hides the next image mid-turn. | 120 ms crossfade                                                                        |
| **Page turn (bands 3-4)**                                         | 240 ms horizontal slide of 12%, no shadow. On phone scroll there is no animation.                                                                                                                                                                                                                                                                       | Instant                                                                                 |
| **Card lift (press)**                                             | Press: `translate(2px,3px)` with `--e-press` (80 ms). Release on a selectable item: back to `--e-1` with `--ease-settle`.                                                                                                                                                                                                                               | Colour/outline change only                                                              |
| **Sheet / drawer**                                                | Slides from its edge, 240 ms, with the scrim fading to 40%.                                                                                                                                                                                                                                                                                             | Fade, 120 ms                                                                            |
| **Room change to Lamp**                                           | Full-screen crossfade over 600 ms.                                                                                                                                                                                                                                                                                                                      | 120 ms fade                                                                             |
| **Lights out**                                                    | Fade to black over 4 s, so it does not startle in a dark room.                                                                                                                                                                                                                                                                                          | Same: it is a fade, not motion                                                          |
| **Invitation pulse** (next arrow after narration ends, bands 1-2) | Scale 1 → 1.06 → 1 once, over 600 ms. Never repeated.                                                                                                                                                                                                                                                                                                   | A static honey halo                                                                     |
| **Breathing circle** (practice page)                              | Scale 0.6 → 1 for 4 s, hold 1 s, 1 → 0.6 for 4 s, for 3 cycles, with spoken "in… and out…".                                                                                                                                                                                                                                                             | The circle stays static and a text counter "Breathe in: 1, 2, 3, 4" is spoken and shown |

`prefers-reduced-motion: reduce` is honoured automatically. There is also an in-app "Less motion"
setting for devices where the OS setting is not reachable (shared kita tablets).

## Sound

### Narration

- **Source priority:** (1) a recorded human voice per locale (Opus in WebM, with AAC fallback,
  mono, 48 kbps, normalised to -16 LUFS); (2) device speech synthesis, labelled "device voice",
  used only if a voice for that exact language exists (`speechSynthesis.getVoices()` matching
  `lang`). If there is no matching voice, play nothing and say "No voice for Türkçe on this device"
  rather than reading Turkish with a German voice.
- **Choosing the device voice:** the site cannot install or improve voices, only choose among the device's voices
  for the exact language, or not read. Prefer names with "Natural", "Enhanced" or "Premium" (Edge's online Microsoft
  voices, Apple's downloadable enhanced voices), then the rest. Do not prefer `localService`: it skips Edge's best
  voices. Edge's online voices send the text to Microsoft from the family's browser; the site makes no request, so
  the no-cloud rule holds, and the privacy page says so. Look the voice up again before each sentence, because a
  voice object can go stale after `voiceschanged`. Arabic and Urdu: `07` #19.
- **Word timings:** generated offline with forced alignment of the recording against the text
  (e.g. aeneas or Montreal Forced Aligner) and stored as JSON per page:
  `[{ "w": 0, "start": 0.42, "end": 0.71 }]`, where `w` is the index of the word in the page's
  tokenised text. Highlight is driven by `audio.currentTime` in a `requestAnimationFrame` loop, not
  by timers. With device TTS, use `boundary` events where they fire (often unreliable for ar/ur) and
  otherwise highlight the sentence instead of the word.
- **Highlight rendering:** see 05 (CSS Custom Highlight API). The highlight lags speech by 0 ms and
  leads by at most 50 ms.
- **Speed:** 0.75×, 0.9×, 1× and 1.15×, with `preservesPitch`. DaZ and "language I'm learning"
  readers default to 0.9×.
- **Tap a word:** plays that word's timed span (start - 30 ms to end + 60 ms). It is available in
  bands 1-2, and in bands 3-4 only with second-language tools on.
- **Pauses:** 400 ms after a page settles before narration starts, and 700 ms between sentences in
  band 1 (the aligner can insert silence), so children can look at the picture.

### Recording your own voice

A grown-up records a story in the family language so the child hears that voice. It lives in the grown-ups panel
on the cover, never on a child screen, and works per locale.

- **Before the first recording** one card: "This stays on this device. Nothing is uploaded. Anyone using this
  device can hear it; you can delete it any time." Only then does the browser ask for the microphone. If it is
  refused, say so plainly and stop; no retry loop.
- **One page at a time.** The page text sits above a 64 px record button. While recording: a stop button, an
  elapsed time in text (no pulsing, no level meter), at most 3 minutes per page. After stopping: Play, Keep, Record
  again. Then the next page.
- **Pages.** A recording belongs to the page it was made against. If the story's text later changes, that page
  falls back to the device voice. Recordings are used only for pages they match, which settles `07` #17 for a
  parent's own voice.
- **Playback.** A recording replaces the device voice for that page on this device. There are no word timings, so
  the page is highlighted but not the words. A missing page falls back to the device voice.
- **Delete.** Per page and for the whole story, with one confirm. There are no counts, scores or praise copy.
- **Accessibility.** The record button names its state; a live region announces "Recording", "Saved" and errors;
  Space and Enter work; under reduced motion nothing animates.

### Ambient, music and effects

- **Bands 1-2 (Day):** an optional, story-specific music bed at least 18 LU below narration. It
  ducks a further 6 dB while narration speaks. **Off by default.** Takacs et al. found music
  congruent with the story helpful, but it hurts children who are listening in a second language,
  and every kita already has noise. It can be turned on in ⋯.
- **Sound effects:** at most 3 per story, only where they are in the narrative (thunder in the
  thunder story). There are no UI sounds for taps or turns. Exception: band 1 cover tiles and
  feeling faces _speak_ their label, which is content, not a "bleep".
- **Bands 3-4:** no music, no effects and no UI sound. Narration only.
- **Lamp:** music and effects are off and cannot be enabled.
- **Audio focus:** one audio element at a time. Opening a new page stops the previous narration.
  The audio ducks for spoken feedback. The Media Session API is used for lock-screen and headphone
  controls.

## Gestures and input

### Small hands (bands 1-2)

| Allowed                                                                             | Not used                                                                    |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Tap (single, ≥ 64 px or 56 px targets)                                              | Double-tap (3-year-olds produce it by accident and cannot do it on purpose) |
| Horizontal swipe on the stage for page turn (threshold 48 px, velocity-independent) | Long-press, pinch, rotate, drag-and-drop, multi-finger                      |
| Tap the start or end 25% of the stage as previous/next (mirrored in RTL)            | Edge swipes that fight OS gestures                                          |

- **Tap tolerance:** a touch that moves under 10 px is a tap. Start the action on `pointerup`
  inside the target, and accept the whole target plus 8 px of slop.
- **Accidental-turn protection:** ignore a second page turn within 500 ms. Ignore multi-touch
  (a resting palm). Pinch-zoom of the page is not blocked (accessibility), but no feature depends
  on it.
- **No dead ends:** home is always visible or one tap away when controls are hidden. No gesture is
  the _only_ way to do anything.

### Older readers (bands 3-4) and adults

- Full keyboard support (03, section 5b), trackpad scrolling and swipe paging. Touch targets are at
  least 48 px for readers and 44 px for shell controls.
- Text selection is allowed in the chapter reader, so readers can copy a quote for school.
- Clicker and presenter remotes are supported in the Class room (PageUp/PageDown, B, period).

## Feedback without shame

| Moment              | Band 1-2 behaviour                                                                                                                                                                    | Band 3-4 behaviour                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Correct recall      | The selected frame lifts with a `--mark` outline and a specific spoken line. No sound effect, no confetti.                                                                            | `--mark` on the sentence and one specific line.                      |
| Incorrect recall    | The frame settles back with no colour change. "Let's look again." The correct frame gets a honey glow for 2 s. A second miss reveals the answer with the same line as a right answer. | "That's close…" with a pointer back into the text. No reveal timer.  |
| Open/feeling answer | Every answer is accepted and mirrored by the character ("Sometimes I feel scared too.")                                                                                               | Every answer is accepted, then the story's own perspective is given. |
| Idle                | Nothing. Characters never prompt or nag. After 60 s idle on a question, show only a quiet "Skip" link.                                                                                | Nothing.                                                             |
| Finishing a story   | "The End" spoken, then the choices.                                                                                                                                                   | "The End" plus the choices.                                          |

Never use red, ✕ icons, buzzers, shaking, sad faces in response to answers, scores, "x of y",
streak or "perfect" messages, or celebration that depends on performance.
