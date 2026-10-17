# UX direction: Lernen mit Geschichten

This is the design spec for a free, multilingual storytelling site that grows with a child, from a
3-year-old who listens at kita to an 11-year-old in Klasse 6 reading alone or in a second language.
It is written so that an implementing agent can build the experience without further design input.
It was designed from first principles. It is not an audit of the current site, and nothing here
should be read as "keep what exists". Where this spec and the existing UI disagree, the spec wins.

| File                                                                                 | Contents                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [01-principles.md](01-principles.md)                                                 | 10 principles, each with "this means / this does not mean"; the four reading bands; voice and tone per band and per adult                                                                                  |
| [02-visual-language.md](02-visual-language.md)                                       | "Paper & Ink" brand, colour tokens (day, lamp, high-contrast) with contrast ratios, type per script and per band, scales, icons, grid, paste-ready CSS                                                     |
| [03-screens.md](03-screens.md)                                                       | Anatomy, states and behaviour of every key screen, incl. the two homes, shelf choice and the chapter reader                                                                                                |
| [04-motion-sound-interaction.md](04-motion-sound-interaction.md)                     | Motion tokens, page turn, narration and highlight sync, gestures, feedback without shame, all by band                                                                                                      |
| [05-accessibility-rtl-i18n.md](05-accessibility-rtl-i18n.md)                         | RTL mirroring rules, Arabic and Nastaliq pitfalls, screen-reader storybook, second-language reading, dyslexia options, test checklist                                                                      |
| [06-illustration-and-asset-style-guide.md](06-illustration-and-asset-style-guide.md) | Art direction and how it scales by band, character sheets with age variants, consistency pipeline, prompt templates with a `{BAND}` slot, line-art rules from 3 to 12, review checklist, AI policy, naming |
| [07-open-questions.md](07-open-questions.md)                                         | What evidence could not settle, with recommendations                                                                                                                                                       |

## Design thesis (one page)

**A library that grows with the reader: a picture book that reads itself aloud at 4, and a book you
choose for yourself at 11.**

Most children's apps compete for time. This one should compete for the _quality_ of the time spent
with it: ten minutes next to an adult at 4, a chapter alone at 9, or a story discussed in class at 11. Then it should end. The value lives in the story and in the conversation it starts. Everything
else is scaffolding.

Six commitments follow from that.

1. **One library, one shell, four shelves.** There are no separate "worlds" per age. One calm,
   editorial shell, credible to a Klasse 6 teacher, holds four shelves: _Picture books_ (3-5),
   _Read-along_ (6-7), _Chapter stories_ (8-9) and _Long reads_ (10-12). **The level belongs to the
   story, not to the child.** A story's band drives its reader layout, type, narration and
   questions. A device setting only decides which shelf is in front and whether home is
   icon-led ("Picture home") or text-led ("Reader home"). No child is ever shown a level number,
   and no shelf is ever locked.
2. **Paper & Ink.** The whole product looks like a risograph-printed book: warm paper, five flat
   inks, visible grain, solid offset shadows. This aesthetic is _not_ babyish. It reads as an indie
   graphic novel at 11 and a picture book at 4. Only the illustration's proportions and detail
   scale with the band. Every colour illustration is built on its own line drawing, so a story
   frame and its printable page are the same picture.
3. **Ears first, for those who need them.** A 4-year-old can start, follow and finish a story
   without reading: four icons, faces that speak, and a human voice with marker-pen word highlight.
   As bands rise, narration moves from default to optional, and at 10-12 it returns as a
   _language-learning_ tool for second-language readers.
4. **Talk, don't test.** Questions follow dialogic reading at 3-7 and become perspective-taking and
   evidence-from-the-text at 8-12. Nothing is ever scored.
5. **No points, no streaks, no badges, at any age.** Antolin-style quiz points are the dominant
   German reading pattern, and we deliberately do not follow it. Any memory is a bookmark or a
   reading list the reader made, never a reward. Moving up to a longer shelf is a door that is always
   open, offered without labels.
6. **Rooms for moments.** _Day_ (default), _Lamp_ (bedtime: amber on near-black, audio first,
   lights-out listening) and _Class_ (projector: Kamishibai picture-first for Klasse 1-2 and kita,
   shared text-first reading for Klasse 3-6).

All of this runs as a static site on a cheap kita tablet or a school Chromebook, works offline,
and sends nothing anywhere.

## People and what they imply

| Person                                                                 | Context                                         | Implication                                                                                                                          |
| ---------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Leyla, 6**, de/ar, Klasse 1                                          | Tablet, alone, 10-15 min                        | Picture home, Read-along shelf, recorded narration in both languages, two-language view                                              |
| **Maria, 32**, Turkish-heritage mother                                 | Phone, dark room, bedtime                       | Lamp room, lights-out listening, de/tr two-language reading                                                                          |
| **Thomas, 28**, kita educator, 20 children aged 3-6                    | Projector or tablet, prints                     | Class room (Kamishibai), prep sheets, colouring packs, offline packs                                                                 |
| **Emil, 11**, Klasse 5                                                 | School Chromebook, alone, keyboard and trackpad | Reader home, Long reads, text-led navigation, keyboard-first, reading list, nothing that looks "for little kids"                     |
| **Selin, 9**, arrived 18 months ago, Turkish L1, learning German (DaZ) | School tablet in a DaZ group                    | Chapter stories in German with Turkish alongside, narration and tap-a-word in German, slower narration speed                         |
| **Frau Yıldız, 41**, Klasse 3 teacher, mixed class with a DaZ group    | Interactive whiteboard, worksheets              | Class room in shared-reading mode, discussion cards, printable activities, class link that sets shelf and languages on pupil devices |
| **Moderators** (2-3, non-technical)                                    | Add stories, translations, art                  | The band is a required story detail. Templates per band (see 06).                                                                    |

Shared devices (kita tablets, school Chromebooks) are normal. All state is per device and contains
nothing personal, so a shared device needs no accounts.

## Benchmarks: what was learned and what we do differently

| Benchmark                                                                                                                        | Learned                                                                                                                                                                                     | Deliberately different                                                                                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **StoryWeaver** (Pratham Books), [storyweaver.org.in](https://storyweaver.org.in)                                                | Openly licensed multilingual stories. Levels 1-4 tied to reading development, not age ("10-year-olds most comfortable with Level 1, 6-year-olds reading Level 3"). Everything is printable. | StoryWeaver has a patchwork of illustrators. We hold one house style and one cast across all bands. Its levels are visible labels, and ours are shelf names that describe the format, not the child. |
| **Global Digital Library**, [digitallibrary.io](https://digitallibrary.io)                                                       | Offline-first reading for low-connectivity settings.                                                                                                                                        | Discovery is by level. Ours is by feeling and situation first, then by shelf.                                                                                                                        |
| **Antolin** (Westermann), [heise explainer](https://heise.de/-6136056)                                                           | It is what Klasse 1-6 teachers know: quizzes per book with three difficulty "caps".                                                                                                         | Points per quiz turn reading into earning, which is the overjustification risk (Lepper 1973). We give questions, never points, and no class accounts.                                                |
| **Onilo Boardstories**, [onilo.de concept](https://assets.onilo.de/app/uploads/2020/03/Onilo_P%C3%A4dagogisches-Konzept_PDF.pdf) | Picture books on the whiteboard for the whole class, with text revealed in steps and teaching materials alongside.                                                                          | Our Class room adds a separate educator script screen and print packs, and is free with no licence or login.                                                                                         |
| **Khan Academy Kids**                                                                                                            | Non-profit, no ads, characters as guides.                                                                                                                                                   | It still uses visual rewards and collectibles. We use none.                                                                                                                                          |
| **Epic!**, [Common Sense](https://www.commonsensemedia.org/app-reviews/epic-books-for-kids)                                      | Breadth, a tactile book metaphor.                                                                                                                                                           | Its badges and reading logs are an anti-pattern for us. We show a young child 3 picks, not 35,000.                                                                                                   |
| **Hey Duggee** (Studio AKA), [Design Museum](https://designmuseum.org/exhibitions/designing-duggee)                              | Flat shapes and no overlapping action, so a scene reads instantly. Humour for the adult watching.                                                                                           | We take the clarity, not the pace.                                                                                                                                                                   |
| **Toniebox**                                                                                                                     | At bedtime, the voice is the product.                                                                                                                                                       | The Lamp room's lights-out mode leaves only audio.                                                                                                                                                   |
| **Kamishibai** (paper theatre)                                                                                                   | The picture faces the audience and the script faces the narrator.                                                                                                                           | It is the model for the Class room's picture-first mode.                                                                                                                                             |
| **Oscar Stories** (AI bedtime stories)                                                                                           | Families want calm, personal rituals.                                                                                                                                                       | No generated text and no child names entered. Every story is written and translated by people. AI is only a drawing tool, and it is labelled.                                                        |

The anti-benchmark is Radesky et al. (2022), _JAMA Network Open_: 80% of apps used by 3-5-year-olds
contained manipulative design, and more so for lower-income children
([PMC9206186](https://pmc.ncbi.nlm.nih.gov/articles/PMC9206186/)). Every pattern listed there is
banned here (01, principle 5).

## Key evidence used throughout

- Hirsh-Pasek et al. (2015), _Putting Education in "Educational" Apps_: active, engaged, meaningful
  and socially interactive learning. [APS](https://www.psychologicalscience.org/publications/educational-apps.html)
- Takacs, Swart & Bus (2015), meta-analysis: narration, animation and music that match the story
  help comprehension, while hotspots, games and dictionaries distract.
  [SAGE](https://journals.sagepub.com/doi/pdf/10.3102/0034654314566989)
- Lepper, Greene & Nisbett (1973); Deci, Koestner & Ryan (1999): expected tangible rewards
  undermine intrinsic motivation.
- Whitehurst (1988) dialogic reading; [WWC report](https://ies.ed.gov/ncee/WWC/Docs/InterventionReports/wwc_dialogic_reading_042710.pdf).
- Hartstein et al. (2022): dim evening light suppresses melatonin by 70-99% in preschoolers.
  [CU Boulder](https://www.colorado.edu/today/node/47449)
- Hughes & Wilkins; Wilkins et al. (2009): larger type and spacing speed up young readers.
  [Essex](https://repository.essex.ac.uk/1476/)
- Wery & Diliberto (2017): OpenDyslexic gave no benefit.
  [PMC5629233](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5629233/) Zorzi et al. (2012, _PNAS_):
  extra letter spacing improved reading in children with dyslexia.
- UNICEF/LEGO RITEC: autonomy, competence, emotions and relationships as dimensions of child
  well-being. [UNICEF](https://www.unicef.org/innocenti/projects/responsible-innovation-technology-children)
- W3C Urdu Layout Requirements. [w3.org/TR/arab-ur-lreq](https://www.w3.org/TR/arab-ur-lreq/)
- EU AI Act Art. 50: published AI-generated images must be labelled from 2 August 2026.
  [overview](https://www.artificialintelligence-news.com/news/eu-ai-act-article-50-transparency-rules-enter-force/)

## How to use this spec (for the implementing agent)

- The tokens in 02 are the source of truth. The band is a `data-band` attribute that switches
  density tokens and nothing else. Do not fork components per band.
- Each screen in 03 lists its primary action. If a screen gains a second equally loud action, the
  build is wrong.
- The "Don't" lists override convenience. If a requirement looks impossible, record it in
  07-open-questions.md. Do not quietly drop it.
- Routes and component names are illustrative. Follow the project's routing rules.
