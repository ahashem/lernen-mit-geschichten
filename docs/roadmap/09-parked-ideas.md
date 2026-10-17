# Parked ideas and the old backlog

`origin/catchup/44-commits` holds a 44-commit backlog (about 270 files: 61 pages, 85 components, 56 utilities)
that never shipped. It was built before the product was pared back to stories. Two thirds of it was unreachable
from the home page, and all of it was German-only. Treat it as a quarry: read a file with
`git show origin/catchup/44-commits:src/utils/<file>.ts`, rewrite to current conventions, never merge it.

## Adopt or adapt (they serve reading)

| Idea                  | Old code                                            | Use in                                                                                          |
| --------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Sticker per story     | `utils/sticker-album.ts`                            | **Rejected**: the UX spec bans points, badges and collecting at every age (`ux/01` principle 5) |
| Reading memory        | `utils/reading-tracker.ts`                          | Bookmark and optional reading list only, no counts or streaks                                   |
| Daily surprise        | `utils/daily-surprise.ts`                           | **Rejected**: "come back tomorrow" is a banned pattern                                          |
| Story sequencing      | `utils/story-sequencing.ts`, `SequencingGame.astro` | A comprehension activity: put the pages in order                                                |
| Voice recording       | `utils/voice-recorder.ts`                           | "Read it in my voice" (`05`)                                                                    |
| QR codes and printing | `utils/qr-code.ts`, `utils/print-cards.ts`          | Print flow (`05`); remove hard-coded domains                                                    |
| Story map             | `pages/story-map.astro`, `utils/story-map.ts`       | Possible visual shelf of skills                                                                 |
| Weather / season      | `WeatherOverlay.astro`, `SeasonalTheme.astro`       | Bedtime and seasonal themes, if `ux/` wants them                                                |
| Character companion   | `utils/character-companion.ts`                      | A recurring friend in the end-of-story moment                                                   |

## Park (revisit once reading is excellent and the content flow is steady)

Mini-games hub and the 18 games (memory, puzzles, mazes, fishing, fruit slicer, coloring app); creative studios
(animation, comic, music, puppet theatre); virtual pets; star shop and inventory; quests and daily-challenge
economy; fortune teller and magic garden; 3D book demo; card battle. They compete with stories for attention and
multiply the translation surface roughly forty-fold.

## Not without a backend (separate project, opt-in)

Class codes, student progress sync, teacher dashboards, assignments, community submissions, ratings.

## Content-ops ideas retired

Google Drive import and Keystatic were scaffolded for moderator authoring. They are replaced by the CMS in `03`.
