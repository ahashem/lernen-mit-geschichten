# Parents and educators

The story is the start of a conversation. This is what turns reading into learning for Maria and Thomas.

## For parents (bedtime, heritage language)

- **Calm mode** (see `04`): one tap, dark and warm, no motion, sleep timer.
- **Two languages**: read the German story, tap to hear the family language, or the reverse. This is the feature
  that makes the site useful to bilingual families; treat it as core.
- **Read it in my voice** (stretch): record a story page by page on the device (MediaRecorder, stored in
  IndexedDB, never uploaded) and play it instead of the synthetic voice. Strongest idea for heritage-language
  families; only after the core is done.
- **Talk about it**: 2–4 questions per story from `discussion[]`, phrased for the adult to ask, with a tip for
  what to listen for. Hidden when a story has none.
- **Colouring page** per story to extend the story offline.

## For educators (kita to Klasse 6)

- **Find fast**: by skill, feeling, reading level or Klasse, language and length (a 5-minute circle-time slot or a lesson starter).
- **Klasse 1–6 use**: stories as discussion starters, reading-fluency practice, and German-as-second-language material with bilingual view; short writing prompts for older levels.
- **Class room** (`ux/03` §10): Kamishibai picture-first for kita to Klasse 2, shared text-first reading for Klasse 3–6, single-screen by default, two-screen as progressive enhancement; educator prep sheet; class links that set shelf and languages on pupil devices after a confirm card.
- **Teacher view**: reveals quiz answers and discussion prompts, with a short "what this story builds" note
  derived from the skills taxonomy.
- **Print**: booklet and worksheet from `booklet-export.ts`, single language per sheet (BR-8), QR code back to the
  digital story derived from `SITE_URL` (never a hard-coded domain), colouring pages.
- **Skill map**: a one-page view of which skills the library covers, in the educator's language, to align with the
  kita's own curriculum (Bildungsplan) language.
- **Parent letter**: a printable note a kita can hand out explaining the story and a home activity.

## Not building

Class accounts, student progress sync, assignments, teacher dashboards. They need a backend and personal data
(see `01`). If the demand is proven, the answer is a separate, opt-in project.
