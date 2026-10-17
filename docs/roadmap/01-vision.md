# Vision and quality bar

## Mission

A free, non-profit home for short stories that help children understand feelings and learn kind, brave,
patient behaviour, in the languages their families actually speak (German, Arabic, English, Turkish, Urdu). No
ads, no accounts, no tracking.

**Age scope.** The library starts with ages 3–7 (kita and Klasse 1–2) and grows with the child to **Klasse 6**
(about age 12). Everything below is a continuum of four reading levels, not a toddler site: 3–5 (listens and
looks), 6–7 (emerging reader, Klasse 1–2), 8–9 (independent reader, Klasse 3–4), 10–12 (confident reader,
Klasse 5–6). The experience must feel credible to an 11-year-old and a Klasse 6 teacher while a 4-year-old keeps a
clear, picture-and-sound-led path.

## Who it serves

| Person                                                  | Situation                                                       | Needs                                                                                                       |
| ------------------------------------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Leyla**, 6, bilingual de/ar                           | Alone on a tablet, 10–15 min, cannot yet read fluently          | Pictures, sound, big targets, no way to get lost                                                            |
| **Maria**, parent, Turkish                              | Bedtime on a phone in a dark room, 3–4 times a week             | Calm mode, her heritage language, one-tap resume, little to do                                              |
| **Thomas**, kita educator                               | Circle time, projector or tablet, 20 children, prints materials | Find the right story fast, big-screen mode, discussion prompts                                              |
| **Noah**, 10, Klasse 4–5, Chromebook at school and home | Reads alone, sometimes in German as a second language           | Text-led, grown-up-feeling shell; richer themes (fairness, friendship conflict, belonging); no babyish cues |
| **Moderators**, 2–3 editors                             | Add stories, translations and art without touching git          | A simple editor, clear gates, a worklist of what is missing                                                 |

Secondary: Klasse 1–6 teachers (including German-as-second-language settings), speech therapists, German-as-second-language teachers, librarians.

## What "world-class" means

Seven dimensions; a story or feature is world-class only if it clears the bar in every one that applies.

1. **Story craft.** Read-aloud rhythm, a recurring cast, one clear message, an ending that settles the child.
   Translations are retold, not converted word by word.
2. **Art and sound.** Cohesive illustration with consistent characters, real covers, colouring pages, optional
   narration. A story without art still looks designed.
3. **Reading experience.** Calm, tactile, readable by a pre-reader, equally good in RTL and on a weak tablet.
4. **Finding the right story.** By feeling, value, age, language and situation, not only by title.
5. **Reading together.** Material that turns a story into a conversation: questions, printables, big-screen mode.
6. **Editorial integrity.** Every published word is human-reviewed and age-appropriate; every image is reviewed;
   coverage per language is visible and managed.
7. **Trust.** Private by default, accessible, fast, works offline, honest about what AI made.

## Quality bars (checked before a workstream is called done)

| Area          | Bar                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------- |
| Accessibility | WCAG 2.1 AA verified by keyboard and screen-reader pass; Lighthouse a11y ≥ 95               |
| Performance   | Lighthouse perf ≥ 90 on mobile profile; story page ≤ 500 KB before lazy images (BR-13)      |
| Privacy       | Zero third-party requests on any page; no cookies; no PII                                   |
| Offline       | A story opened once reads fully offline, including its audio and images                     |
| Locales       | UI complete in 5 locales; RTL checked at 375 px for `ar` and `ur`                           |
| Content       | Every published story has a message, 1–3 skills, reviewed text; art alt text on every image |
| Coverage      | A story is "launch-ready" with `de` plus at least two reviewed translations                 |

## Non-goals

Accounts or logins, a backend, ads, social features for children, points, stars, badges, streaks or any reward economy (at any age, by design), a virtual economy (shops), or a games
arcade. The product is stories; anything else must earn its place by making reading better (see `09`).

## Success signals

Content: 40+ stories, every one of the 58 skills covered by the library over time. Reach: kita partnerships,
organic search for values and feelings in the five languages. Quality: the bars above stay green. Engagement is
measured only if `07` approves a privacy-preserving method; story completion is the signal that matters most.
