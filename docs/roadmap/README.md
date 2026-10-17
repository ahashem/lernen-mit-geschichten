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

## Precedence

1. `AGENTS.md` (how to work in this repo) wins on tooling, routing, base path, i18n and commits.
2. `ux/` wins on how anything looks, moves or is laid out. Do not copy the current CSS; it is being replaced.
3. These specs win on what to build and what it must achieve.
4. Existing code and content show what exists, not what is right.

## Decisions still open

- **String freeze.** `AGENTS.md` forbids merging new UI translation keys. The workstreams in `08` need new keys.
  Until the owner lifts or scopes the freeze, an agent adds keys only in PRs that list every new `ar`/`tr`/`ur`
  key for native review.
- **CMS hosting and deployment** for moderators (Pages CMS, branch-based review). See `03`.
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
