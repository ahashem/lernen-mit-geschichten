# 06 Illustration and asset style guide

This guide covers every image, line drawing and audio asset produced in-house with AI tools. It is
model- and tool-agnostic. Wherever a capability (reference images, seeds, line-art conditioning)
is mentioned, use the equivalent in your tool, and record what you used in the asset manifest.

## 1. Style definition: "Riso picture book"

**One sentence (paste into every prompt):** *flat risograph-style illustration, limited spot-ink
palette on warm off-white paper, visible fine grain, slight ink misregistration, confident
hand-drawn ink outline, simple shapes, no gradients, no 3D.*

| Attribute | Rule |
| --- | --- |
| Shapes | Simple, geometric-organic. Objects readable as silhouettes. |
| Line | A black-blue ink outline (`#24212E`), slightly irregular hand pressure, **closed shapes** (this is required for colouring pages) |
| Colour | Flat fills from the 5 inks (poppy, lagoon, honey, plum, moss) plus paper. A story uses 2 lead inks plus at most 2 supporting ones. Tints (ink at 30-50%) are allowed as halftone dots. |
| Texture | Fine riso grain. 1-3 px misregistration between fill and line is welcome. |
| Light | Flat. There are no cast shadows except a simple ink-tint shadow shape under figures. |
| Backgrounds | Sparse. Mostly paper with 2-4 props. Bands 3-4 allow fuller environments. |
| Faces | Dot eyes with a highlight, simple brows that carry the emotion, a simple mouth. Emotions must be readable at 64 px (section 4, emotion legibility). |
| Never | Gradients, airbrush, glossy highlights, photorealism, 3D render, anime eyes, sparkles, lens effects, text or letters of any kind, logos, watermarks |

### How style scales by band

The world, palette and characters stay the same. Proportion, detail and composition mature.

| | Band 1 Picture books | Band 2 Read-along | Band 3 Chapter stories | Band 4 Long reads |
| --- | --- | --- | --- | --- |
| Character head : body | 1 : 1.6 (big heads) | 1 : 2 | 1 : 2.6 | 1 : 3.2 ("older sibling" proportions) |
| Shapes / props per frame | 1-2 figures, ≤ 4 props | ≤ 3 figures, ≤ 6 props | Groups allowed, room interiors, streets | Full scenes, crowds in silhouette, devices and screens (shown as blank glowing shapes) |
| Emotion | Exaggerated, one emotion per face | Clear, one per face | Mixed feelings allowed (e.g. smile with worried brows) | Subtle, body language carries meaning |
| Composition | Centred, eye-level, frontal | Centred or rule-of-thirds | Varied angles, over-the-shoulder | Cinematic: high/low angles, close-ups, panel sequences |
| Line weight (screen frames at 3000 px wide) | 9-10 px | 7-8 px | 5-6 px | 3-5 px with variable pressure |
| Palette use | 2 inks, large flat areas | 2-3 inks | 3-4 inks, halftone tints | 3-4 inks, halftone and hatching for depth, deliberate dark plum night scenes |
| Mood ceiling | Gentle. No scary peaks, and the problem is resolved on the page. | Mild tension | Real conflict (exclusion, unfairness) shown without cruelty | Real stakes (peer pressure, online meanness), dignity always kept, no violence or humiliation shown in detail |

The rule for band 4: **warm, not cute.** No blush circles, no sparkle eyes, no baby props
(rattles, giant bows). The humour comes from situation and expression.

## 2. Characters

### Rules for the recurring cast

1. **Silhouette test:** each character is recognisable as a solid black silhouette at 96 px.
2. **One signature item** that never changes across stories and bands (e.g. a poppy-red scarf, a
   lagoon backpack), in the same colour and the same side of the body. It must be symmetric enough
   to survive RTL compositions.
3. **Fixed colour recipe:** body fill, accent and signature item, all as named tokens.
4. **Age variants:** one locked design per band, B1-B4 (the cast "grows up"). Width ratios, eye size
   and limb length change. Colours, markings and the signature item never change.
5. **No human children in band 1-2 lead roles.** Animals keep stories culturally open across five
   language communities. Bands 3-4 may add humans (adults and children) of diverse backgrounds as
   supporting characters. They must be stylised, never photographic, and never resembling a real
   person.
6. **Cultural neutrality with specific warmth:** clothing and homes may reflect the families who
   read here (German, Turkish, Arabic-speaking and South Asian households in Germany). Each depiction
   must be reviewed by a speaker of that community (section 8).

### Character sheet template

Store one Markdown file plus reference images per character in `art/characters/{id}/`.

```markdown
# Character: {NAME}            id: {char-id}
Species: {e.g. brown bear cub}       Pronoun in stories: {he/she/they per locale notes}
Personality (3 words): {curious, impatient, kind}
Role in the cast: {the one who gets big feelings first}

## Fixed descriptor (paste verbatim into prompts)
"{NAME}, a small {species} with {body colour} fur, {distinct marking}, round dot eyes,
short rounded ears, wearing a {signature item + colour} on the {left/right}"

## Colour recipe
Body: {token/hex} · Accent: {token/hex} · Signature item: {token/hex} · Outline: #24212E

## Proportions per band
B1 head:body 1:1.6 · B2 1:2 · B3 1:2.6 · B4 1:3.2
(reference images: ref_B1_front.png, ref_B1_three-quarter.png, ref_B1_back.png, … per band)

## Expressions (required, B1 and B4 at minimum)
happy · angry · sad · scared · calm · proud · surprised · worried · embarrassed (B3+) · mixed (B3+)

## Never
{e.g. never without the scarf · never shown crying alone at the end of a story · never with teeth}

## Approved by
{reviewer} · {date} · {model/tool + version used for references}
```

### Emotion legibility test (mandatory for feeling faces)

Show the 6 core expressions at 64 px, unlabelled, to 3 adults who did not make them. Each
expression must be named correctly by at least 2 of 3. Repeat with children aged 4-6 when possible.
The feelings UI depends on this.

## 3. Consistency strategy across generations

The **line-first pipeline** is the backbone. The black-line drawing is the "key plate", and colour is
always added *onto* it, never generated separately.

```
1. Brief          → frame brief (scene, characters, emotion, band, inks)
2. Line drawing   → generate with character refs + LINE template → clean + review
3. Vectorise      → potrace/vtracer → SVG (closed paths) → manual fix of open shapes
4. Colour         → colourise the approved line art (line-art conditioning / reference image /
                    img2img at low strength) with the COLOUR template → review
5. Export         → master + web + print variants (section 7)
6. Manifest       → record prompt, negative, tool, model version, seed, refs, reviewer
```

Why line-first: (a) the colouring page *is* the story frame, (b) the line plate locks anatomy and
composition, so colour runs cannot drift, and (c) a failed colour run is cheap to redo.

Consistency levers, in order of strength:

1. **Reference images:** the character's band sheet (front, three-quarter, back) is attached to
   every generation.
2. **Fixed descriptor:** pasted verbatim. Never paraphrase it.
3. **Style block:** the same string for all assets (section 5).
4. **Palette lock:** name the hex values. After generation, quantise fills to the 5 inks plus tints
   (a script, or manual in an editor).
5. **Seeds:** record them, and reuse the seed of an approved frame for its sibling frames when the
   tool supports it. Seeds help within one model version only, and they are never a substitute for
   references.
6. **Model pinning:** record the model and version per story. Finish a story on one version. If the
   model changes, regenerate the character sheets first and get them approved.

### Tools with text-to-image and instruction edit only (e.g. fal.ai)

Some tools have no image-to-image strength control or line-art conditioning, only text-to-image and "edit" endpoints
that take a prompt plus one or more reference images (for example Nano Banana Edit, FLUX Kontext, FLUX.2 Edit,
Seedream Edit, Qwen Image Edit). The pipeline still works, with these changes:

1. **Character sheet:** text-to-image with the sheet template. Approve it, then crop the front and three-quarter
   views as the reference images.
2. **Line pass:** use an *edit* endpoint with the sheet attached and an instruction, not a description:
   "Using the attached character sheet for Bruno, draw scene {PAGE_NO}: {SCENE_DESCRIPTION}. Output a black ink line
   drawing only, #24212E on white, no fill or shading, every shape closed, thick outlines." Add the previous frame as
   a second reference for continuity.
3. **Colour pass:** edit the approved line drawing: "Colour this line drawing exactly. Do not change, add or remove
   any line or shape. Flat fills only, using only these inks: {PALETTE}. Bruno's colours follow the attached sheet."
4. **If the line pass keeps drifting,** invert the order: generate the colour frame with the sheet as reference, then
   derive the line drawing by edit ("Convert this image into a clean black ink outline drawing, same composition, no
   colour, no fill, every shape closed"). The colouring page is then derived from the frame, which is just as good.
5. **After every generation:** snap fills to the five inks (the model will drift), vectorise the line art, and run
   the flood-fill closed-shape test. Record the endpoint, model version, seed and prompt in the manifest.

## 4. Scene composition rules for story frames

- **Master ratio 3:2** (3000 × 2000). Keep a **safe area** in which every important element sits
  inside the central 4:3 (2667 × 2000) *and* the central 1:1 for portrait crops. Faces never sit
  within 8% of an edge.
- **No text in or over the image.** Text lives in the reading band (03) as HTML.
- **Direction-neutral composition for RTL:** movement is staged toward the viewer, upward, or
  centre-out, rather than left-to-right. When a story needs lateral movement (a journey), commission
  **two variants** (`-ltr` and `-rtl`), each drawn and reviewed. A CSS flip is not allowed: it
  mirrors the signature item, hands, any writing-like marks and culturally specific details.
- **One focal action per frame** (bands 1-2), following Hey Duggee's "no overlapping action" rule.
  Characters do not overlap one another in bands 1-2.
- **Emotion is visible:** the face of the character feeling the story's emotion is at least 8% of
  the frame height in bands 1-2 and at least 5% in bands 3-4.
- **Continuity:** keep the same location props in the same places across a story's frames, with the
  previous frame attached as a reference.
- **Band 4 panel sequences:** 2-4 panels in a 3:2 master with 40 px paper gutters. Speech bubbles
  are drawn **empty**. Dialogue is HTML text positioned over the bubble's coordinates (stored in
  the manifest), so it can be translated and read by screen readers.

## 5. Line drawings and colouring pages

| Rule | Band 1 (3-5) | Band 2 (6-7) | Band 3 (8-9) | Band 4 (10-12) |
| --- | --- | --- | --- | --- |
| Line weight at A4 print | 3 mm | 2 mm | 1.2-1.5 mm | 0.5-1 mm, variable |
| Closed regions | 8-15 | 15-30 | 30-80 | 80-250 |
| Smallest region | ≥ 15 mm | ≥ 10 mm | ≥ 6 mm | ≥ 3 mm |
| Background | None or 1 ground line | 2-3 simple props | Full simple setting | Full setting, patterns |
| Page types | Single character or simple scene | Scene + "draw what happens next" box | Detailed scene, story map, comic with empty bubbles | Pattern pages from story motifs (mandala-like, symmetric), detailed comic pages, character-perspective sheets |

Rules for every band:

- Every shape is **closed** (a flood-fill test in the vector file must not leak).
- Pure black on white for print, with no grey, no hatching (except band 4 decorative areas) and
  solid black areas under 5% of the page (to save ink in kitas and schools).
- 15 mm margin on all sides, and the drawing sits inside 180 × 267 mm, so it fits A4 and Letter.
- No text inside the art. The page footer (title, site, "AI-assisted illustration") is added in
  HTML/CSS.
- Band 4 pattern pages are built from motifs in the story (leaves from the garden scene, the
  chat-bubble shape), not generic mandalas.

## 6. Prompt templates

Placeholders are `{UPPER_CASE}`. `{BAND}` takes the value `B1`, `B2`, `B3` or `B4` and pulls in the
band block below. Always attach the reference images listed.

### Shared blocks

```text
STYLE = flat risograph-style illustration, limited spot-ink palette on warm off-white paper
(#FBF5EA), visible fine paper grain, slight ink misregistration, confident hand-drawn ink outline
in #24212E, simple shapes, flat colour fills, no gradients, no 3D

PALETTE = only these inks: poppy #C8402B, lagoon #0F6E6A, honey #F2B33D, plum #6B3E75,
moss #3F6B2E, plus paper #FBF5EA; lead inks for this story: {INK_1}, {INK_2}

BAND_B1 = picture book for ages 3-5, very simple shapes, large heads (head-to-body 1:1.6), one clear
emotion, 1-2 characters, at most 4 props, centred eye-level composition, thick outlines
BAND_B2 = picture book for ages 6-7, simple shapes, head-to-body 1:2, clear emotion, up to 3
characters, at most 6 props, thick-medium outlines
BAND_B3 = illustrated chapter book for ages 8-9, head-to-body 1:2.6, mixed emotions allowed,
fuller setting, varied camera angle, medium outlines, halftone tints
BAND_B4 = illustrated novel / graphic novel for ages 10-12, head-to-body 1:3.2, subtle body
language, cinematic composition, detailed setting, fine variable outlines, halftone and light
hatching for depth, warm but not cute

NEGATIVE = text, letters, words, numbers, signage, logo, watermark, signature, speech text,
gradient, airbrush, glossy, 3D render, photorealistic, photo, anime, chibi, sparkle eyes, blush
circles (B3-B4), extra limbs, extra fingers, fused fingers, missing signature item, deformed face,
duplicate character, cropped face, scary, gore, weapon, real person likeness, brand, flag
```

### Cover

```text
{STYLE}. {PALETTE}. {BAND_{BAND}}.
Book cover illustration for a story about {SKILL_IN_PLAIN_WORDS}.
{CHARACTER_DESCRIPTOR_1}{, and CHARACTER_DESCRIPTOR_2}, {POSE_AND_ACTION}, feeling {EMOTION}.
Setting: {SETTING}, sparse. Main subject inside the central square. Aspect ratio 3:2.
References: character sheet {CHAR_ID}_{BAND} (front, three-quarter).
Negative: {NEGATIVE}
```

### Story frame: line pass

```text
Black ink line drawing only, pure #24212E lines on white, no fill, no shading, every shape closed,
line weight {LINE_WEIGHT_FOR_BAND}. {BAND_{BAND}}.
Scene {PAGE_NO} of "{STORY_ID}": {SCENE_DESCRIPTION}.
Characters: {CHARACTER_DESCRIPTORS}. {CHAR_A} feels {EMOTION_A}{; CHAR_B} feels {EMOTION_B}.
Composition: {COMPOSITION_NOTE}; important elements inside the central 4:3; characters do not
overlap (B1-B2); movement {toward viewer | centred | {DIRECTION}-variant}.
Continuity: match props and positions in the attached previous frame.
References: {CHAR_SHEETS}, previous frame {PREV_FRAME_ID}.
Negative: {NEGATIVE}, fill, colour, grey, shading, hatching (B1-B3), open shapes
```

### Story frame: colour pass

```text
Colour the attached line drawing exactly; do not change, add or remove lines or shapes.
{STYLE}. {PALETTE}. Flat fills only; {CHAR_ID} colours exactly as the character sheet
({COLOUR_RECIPE}). Subtle ink tint shadow under figures. Mood: {MOOD}.
Input: {LINE_FRAME_FILE} (line-art conditioning / reference at high strength).
Negative: {NEGATIVE}, new objects, changed outlines
```

### Colouring page

```text
Colouring page for children {AGE_RANGE_FOR_BAND}. Pure black outlines on pure white, no fill, no
grey, every shape closed, line weight {LINE_WEIGHT_PRINT}, {REGION_COUNT} regions, smallest region
at least {MIN_REGION}. {BAND_{BAND}}.
Subject: {SUBJECT | "pattern page made only of these story motifs: {MOTIFS}, radially symmetric"}.
Margin of empty white around the drawing. Portrait A4 ratio (1:1.414).
References: {CHAR_SHEETS}.
Negative: {NEGATIVE}, colour, shading, solid black areas, tiny details below minimum, text
```

### Character sheet

```text
{STYLE}. {PALETTE}. {BAND_{BAND}}.
Character turnaround sheet of {CHARACTER_DESCRIPTOR}: front view, three-quarter view, side view,
back view, standing neutral pose, evenly spaced on plain paper, same scale, same colours in every
view, signature item {SIGNATURE_ITEM} on the {SIDE} in all views.
Second row: head close-ups with expressions: {EXPRESSION_LIST}.
Negative: {NEGATIVE}, inconsistent colours between views, background scenery
```

### Background / location plate

```text
{STYLE}. {PALETTE}. {BAND_{BAND}}.
Empty location plate, no characters: {LOCATION} at {TIME_OF_DAY}, {KEY_PROPS}, eye-level
camera, simple, room for characters in the {FOREGROUND_ZONE}. Aspect ratio 3:2.
Negative: {NEGATIVE}, people, animals, characters
```

### Spot illustration (UI states)

```text
{STYLE}. {PALETTE}. {BAND_B2}. Small spot illustration on plain paper, no background:
{CHARACTER_DESCRIPTOR} {ACTION, e.g. "holding an empty open book, puzzled but friendly"}.
Square 1:1. Negative: {NEGATIVE}
```

## 7. Formats, sizes, naming

| Asset | Master | Web delivery | Print |
| --- | --- | --- | --- |
| Colour frame / cover | PNG, sRGB, 3000 × 2000 | AVIF + WebP at 640, 1200, 2000 w; `srcset`; target ≤ 120 KB at 1200 w | n/a |
| Line frame / colouring | SVG (vectorised, closed paths, `currentColor` stroke), plus the source PNG | Inline SVG or `<img>` SVG, ≤ 80 KB (B1-B2), ≤ 250 KB (B3-B4) | Same SVG |
| Character refs | PNG 2048 × 2048 | not published | n/a |
| Spot illustrations | PNG 1024² | WebP 256 + 512 | n/a |
| Narration | WAV 48 kHz 24-bit | Opus/WebM 48 kbps mono + AAC/M4A fallback; `{page}.json` word timings | n/a |

**Naming** (lowercase ASCII, hyphens, no locale in art since art is language-neutral):

```
art/stories/{story-id}/{story-id}_cover.{ext}
art/stories/{story-id}/{story-id}_frame-{nn}[-ltr|-rtl]_{colour|line}.{ext}
art/stories/{story-id}/{story-id}_print-{nn}_{b1|b2|b3|b4}.svg
art/characters/{char-id}/{char-id}_{b1..b4}_{front|three-quarter|side|back|expr-{emotion}}.png
audio/{locale}/{story-id}/{nn}.{opus|m4a|json}
art/stories/{story-id}/manifest.json
```

**Manifest entry** (one per asset, required for publishing):

```json
{ "file": "bruno-thunder_frame-03_colour.png", "band": "B1", "kind": "frame-colour",
  "source_line": "bruno-thunder_frame-03_line.svg", "tool": "{tool}", "model": "{model@version}",
  "seed": 123456, "prompt": "…", "negative": "…", "refs": ["bruno_b1_front.png"],
  "focus": [0.42, 0.55], "ai_generated": true,
  "reviewed_by": "{name}", "reviewed_on": "2026-10-17", "checks": ["anatomy","text","culture","character"] }
```

Keep C2PA / content-credential metadata the tool embeds, and do not strip it during optimisation
where the format supports it.

## 8. Asset review checklist (two people: the maker plus one reviewer)

**Anatomy and craft**
- [ ] Correct number of limbs, fingers and paws, eyes and ears. No fusions.
- [ ] Faces symmetric where intended, and expression matches the brief and the text on that page
- [ ] Shapes closed (line art), and it passes the flood-fill test (colouring)

**Text-in-image**
- [ ] No letters, pseudo-letters, numbers or signage anywhere. Zoom to 200% and check backgrounds,
      books and screens.

**Character consistency**
- [ ] Silhouette, colour recipe and signature item match the band sheet
- [ ] Signature item on the correct side
- [ ] Same character looks the same across all frames of the story (view them side by side)

**Age and band appropriateness**
- [ ] Mood within the band's ceiling (section 1). Nothing frightening in B1-B2.
- [ ] B4 is not babyish: no blush circles, sparkle eyes or baby props
- [ ] No unsafe behaviour shown neutrally (climbing windows, sharp objects near small children)

**Cultural review** (reviewer from the relevant community where clothing, food, homes or rituals
appear)
- [ ] No stereotypes. Religious or cultural items depicted correctly and respectfully.
- [ ] No hand gestures or symbols with negative meanings in any of the 5 language communities
      (e.g. thumbs-up, the sole of the foot toward someone)
- [ ] No flags or national symbols
- [ ] Food, animals and settings acceptable across communities (avoid pigs as main characters and
      dogs inside homes as a central element; see 07)

**Composition**
- [ ] Safe areas respected, and faces not near the edges
- [ ] RTL variant exists if the scene has directional movement

**Accessibility**
- [ ] Emotion legibility test passed for feeling faces
- [ ] Alt text written per locale (below)

## 9. Policy on AI imagery for children

1. **Human-authored stories, AI-assisted pictures.** Text, translation and narration are made by
   people. AI generates images only.
2. **Label it.** Every story page footer says "Illustrations made with AI tools and checked by our
   team", in each locale. The About page explains the pipeline in plain language. This satisfies
   the spirit of EU AI Act Art. 50 (in force for deployers from 2 August 2026) without legal
   hair-splitting about what counts as a "deepfake".
3. **Nothing is published unreviewed.** Two-person review (section 8) is mandatory, and the
   manifest must record it.
4. **Never photorealistic. Never a real person, child or recognisable place. No uploaded photos of
   real children as references, ever.**
5. **No child input to generation.** The site never generates images at runtime, and children never
   prompt anything.
6. **Licensing:** use only tools whose terms permit publication and free redistribution of outputs
   (the site is non-profit and print-and-share). Record the terms version in the manifest.
7. **Correction path:** a "Report a problem with this picture" mailto link in the For-grown-ups
   panel. It is not a form and is not tracked.

## 10. Alt text

- Describe **what matters to the story on this page**, including the characters' feelings, in
  1-2 sentences (≤ 150 characters for B1-B2 and ≤ 250 for B3-B4).
- Begin with the subject, not "Image of…" or "Illustration of…".
- Name recurring characters by name, and state the emotion with the same word the story uses (it
  reinforces the vocabulary).
- Don't repeat the page text. Add what only the picture shows.
- Alt text is written per locale by the translator and reviewed with the translation.
- Decorative grain and ornaments get `alt=""`. Colouring-page thumbnails get "Colouring page:
  {short subject}".
- Example (B1, de): *"Bruno steht mit geballten Pfoten im Garten. Über seinem Kopf hängt eine
  dunkle Wolke. Er ist wütend."*
- Example (B4, en): *"Jonas sits alone on the stairs, phone face-down beside him, while the others
  laugh in the background, blurred."*
