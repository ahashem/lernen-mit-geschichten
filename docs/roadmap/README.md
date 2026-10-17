# Roadmap

What "Lernen mit Geschichten" is becoming and how to get there. These files are the spec an agent works from.
Pick the file for the job; each stands on its own and links to the others where it depends on them.

| File                                                       | Use it for                                                               |
| ---------------------------------------------------------- | ------------------------------------------------------------------------ |
| [01-vision.md](01-vision.md)                               | Mission, audiences, what "world-class" means, measurable quality bars    |
| [02-content-model.md](02-content-model.md)                 | The story and asset schema: required vs optional, publish gates          |
| [03-editorial-moderation.md](03-editorial-moderation.md)   | Moderator workflow, review checklists, AI-art pipeline, translation flow |
| [04-reader-and-discovery.md](04-reader-and-discovery.md)   | Reading experience and finding stories: capabilities and acceptance      |
| [05-parents-and-educators.md](05-parents-and-educators.md) | Bedtime, circle time, printables, discussion material                    |
| [06-reach-and-trust.md](06-reach-and-trust.md)             | Privacy, accessibility, performance, offline, SEO, brand                 |
| [07-community-and-growth.md](07-community-and-growth.md)   | Contributors, feedback, partners, measuring without tracking             |
| [08-workstreams.md](08-workstreams.md)                     | Ordered, budgeted work for a coding agent                                |
| [09-parked-ideas.md](09-parked-ideas.md)                   | Ideas deliberately not now, with where the old code lives                |
| [ux/](ux/)                                                 | UX direction: principles, visual language, screens, motion, art style    |

## Milestones

✅ = built by the cloud agent (see [08](08-workstreams.md)). The rest is the owner's or the moderators'.

| Milestone                          | "World-class" at this point means                                                                                                                            | Why it comes here                                                                           |  Agent   |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- | :------: |
| **M1 A story worth opening**       | One story reads and sounds finished: pictures or a designed fallback, narration with word highlight, calm ending and talk cards, two languages, bedtime mode | Stories are the product; Leyla and Maria judge the whole site by this                       | ✅ Run 1 |
| **M2 It grows with the child**     | A 4-year-old and an 11-year-old each land on a home that fits; chapter reader for older children; find a story by feeling                                    | Without it the site is a toddler site; discovery makes the library usable                   | ✅ Run 2 |
| **M3 Classroom and world**         | Educators can run it on a projector and print it; accessible, private, offline-ready (flagged), shareable and findable                                       | Reach and trust come once the reading is excellent                                          | ✅ Run 3 |
| **M4 Editorial engine**            | CMS live, 2–3 moderators, AI-art pipeline, bands assigned, a library across all four bands (today every story is band 1 or 2), the review queue cleared      | Without stories and people to keep them, nothing above matters; runs in parallel with M1–M3 |  owner   |
| **M5 Reach and community**         | Partner kitas and schools, feedback loop, a measurement choice, a UI translation platform, recorded human narration                                          | Growth is trust spreading, so it follows quality                                            |  owner   |
| **M6 Richer interactivity, later** | More than the one "practice" page per story, short interactive video, drawing activities, classroom features that need a backend                             | Parked on evidence and cost (below)                                                         |    —     |

**Interactivity.** The UX spec keeps what supports the story (page turns, narration highlight, tap-a-word, talk and
think cards, bilingual tap-to-hear, at most one "practice" page per story such as breathing together or a choice
that returns to the story, colouring) and leaves out hotspots, games, scoring and open branching, because the
research it cites finds matched narration helps comprehension while hotspots and games distract. Richer
interactivity is a deliberate M6 decision for the owner, not an oversight.

## Precedence

1. `AGENTS.md` (how to work in this repo) wins on tooling, routing, base path, i18n and commits.
2. `ux/` wins on how anything looks, moves or is laid out. Do not copy the current CSS; it is being replaced.
3. These specs win on what to build and what it must achieve.
4. Existing code and content show what exists, not what is right.

## Decisions still open

- **UI strings** (decided): the freeze is lifted for this work; the agent writes all five locales and records `ar`/`tr`/`ur` drafts in `src/locales/review-queue.json` for later native review.
- **Analytics** (decided): Google Tag Manager is active in production and stays for now; replacing it is open (`07`).
- **CMS** is set up by the owner in parallel, outside the agent's scope; the content model in `02` is its contract. See `03`.
- **No rewards, at any age.** The UX spec bans points, stars, badges, streaks and read counts, which drops
  the sticker album and daily surprise from the old backlog. It is evidence-based and fits the non-goals; the
  owner should confirm it is the intended product stance.
- **Recorded narration.** `ux/07` recommends publishing bands 1–2 in a locale only with recorded narration, and
  never using cloud TTS. That is a content-capacity decision for the owner (it gates what can ship).
- **Remaining UX open questions** (fonts for Urdu, digits, gendered Arabic address, host character, free-text
  reflections on shared devices, print route) are in `ux/07-open-questions.md` with recommendations an agent may
  follow until the owner decides.
- **Measurement.** Whether to run cookieless anonymous analytics at all. See `07`.
- **Art and audio rights.** Who owns and may reuse AI-generated art and recorded narration. See `03`.

## Provenance

Distilled from the product documents written for the project in January 2026 (business and product
requirements, personas, roadmap), the localization and rollout analysis of September 2026, and the
44-commit feature backlog on `origin/catchup/44-commits`. Anything from those that depended on a backend,
accounts, Netlify, or a games/shop economy has been dropped or parked; see `09`.
