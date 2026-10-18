import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';


const storyPageSchema = z.object({
  text: z.string().describe('The words on this page.'),
  image: z.string().optional().describe('Explicit picture for this page; normally frames[] supplies it.'),
});

const quizQuestionSchema = z.object({
  id: z.string().describe('Stable id within the story.'),
  text: z.string().describe('The question as shown.'),
  type: z
    .enum(['truefalse', 'multiplechoice', 'fillinblank'])
    .describe('Input style. Nothing is scored; reflection questions have no wrong answer.'),
  correctAnswer: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .describe('The answer the story supports, for recall questions. Talk questions have none.'),
  options: z.array(z.string()).optional().describe('Choices for multiplechoice.'),
});

const narrationSchema = z.object({
  audio: z.string().optional().describe('Folder under public/assets/audio/{locale}/ holding one file per page.'),
  narrator: z.string().optional().describe('Credit shown to grown-ups.'),
  consent: z.string().optional().describe('Note that the narrator agreed to this use.'),
  timing: z.boolean().default(false).describe('True when per-page word timings (nn.json) exist.'),
});

const storiesCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/stories' }),
  schema: z.object({
    storyId: z.string().describe('Joins the translations of one story. Immutable once published.'),
    // Shared fields: set in the German source file only, read from there by getStoryMeta().
    band: z.coerce
      .number()
      .int()
      .min(1)
      .max(4)
      .optional()
      .describe('SHARED, German file only. 1 picture book, 2 read-along, 3 chapter story, 4 long read.'),
    cover: z
      .object({ src: z.string().describe('Path under public/.'), alt: z.string().optional().describe('Alt text in German.') })
      .optional()
      .describe('SHARED, German file only. Required for a story to be featured.'),
    frames: z
      .array(
        z.object({
          src: z.string().describe('Path under public/.'),
          alt: z.string().optional().describe('Alt text in German.'),
          pageRef: z.number().int().optional().describe('1-based page this picture belongs to; defaults to its position.'),
        })
      )
      .optional()
      .describe('SHARED, German file only. Ordered story pictures; a page without one uses the generated fallback.'),
    palette: z
      .tuple([z.string(), z.string()])
      .optional()
      .describe('SHARED, German file only. Two hex colours; tint the fallback art and the reader.'),
    art: z
      .object({
        generator: z.string().optional(),
        styleVersion: z.string().optional(),
        reviewedBy: z.string().optional(),
        reviewedAt: z.date().optional(),
        aiGenerated: z.boolean().optional(),
      })
      .optional()
      .describe('SHARED, German file only. Provenance for any art; required once a story carries art.'),
    coverAlt: z.string().optional().describe("This locale's alt text for the cover (screen-reader text, not a caption)."),
    frameAlts: z
      .array(z.string())
      .optional()
      .describe("This locale's alt text for each frame, in the same order as the German file's frames."),
    title: z.string().describe("This locale's title."),
    summary: z.string().optional().describe('One or two sentences for cards, previews and SEO.'),
    keyMessage: z.string().optional().describe('The one idea, shown at the end of the story.'),
    emoji: z
      .string()
      .optional()
      .describe('SHARED, German file only. Fallback identity when the story has no cover.'),
    skills: z
      .array(z.string())
      .optional()
      .describe('SHARED, German file only. 1-3 ids of files in src/content/skills.'),
    feelings: z
      .array(z.enum(['happy', 'angry', 'sad', 'scared', 'calm', 'proud']))
      .optional()
      .describe('SHARED, German file only. The feelings this story helps with; Find by feeling will read them.'),
    editorsPick: z
      .boolean()
      .optional()
      .describe('SHARED, German file only. Ranks the story first within its feeling and shelf.'),
    situations: z
      .array(z.string())
      .optional()
      .describe("This locale's curated situation words, e.g. 'new at school'. Examples, not a taxonomy."),
    glossary: z
      .array(
        z.object({
          word: z.string().describe('The word as it appears in the story.'),
          meaning: z.string().describe('Its short meaning in this locale, written by a translator.'),
        })
      )
      .optional()
      .describe("Vocabulary glosses for bands 3-4, 5-10 per chapter, in this locale. Never machine-written."),
    thinkCards: z
      .array(z.string())
      .max(5)
      .optional()
      .describe('Bands 3-4: at most 5 short reflection prompts, one per screen. No wrong answers.'),
    cast: z
      .array(z.string())
      .optional()
      .describe('SHARED, German file only. Ids of the characters in this story: files in src/content/characters.'),
    ageGroup: z.string().default('3-7').describe('Guidance for adults only; never shown to children.'),
    status: z
      .enum(['draft', 'published'])
      .default('published')
      .describe("'draft' unpublishes: no page, no listing, no sitemap entry."),
    publishDate: z.date().optional().describe('First publication date.'),
    author: z.string().optional().describe('Author credit.'),
    difficulty: z.enum(['beginner', 'intermediate']).optional().describe('Legacy hint; the band replaces it.'),
    pages: z
      .array(storyPageSchema)
      .optional()
      .describe('Optional explicit pages. Normally pages come from --- breaks in the body.'),
    questions: z.array(quizQuestionSchema).optional().describe('Reflection and talk prompts.'),
    discussion: z.array(z.string()).optional().describe('Prompts for the adult reading along.'),
    narration: narrationSchema.optional().describe('Recorded narration for this locale.'),
    reviewedBy: z.string().optional().describe('The human who vouches for this translation (not needed for de).'),
    reviewedAt: z.date().optional().describe('When that review happened.'),
  }),
});

const skillsCollection = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/skills' }),
  schema: z.object({
    id: z.string().describe('Slug; the file name and the id stories use. Never change it once a story uses it.'),
    category: z
      .enum(['emotional', 'social', 'cognitive', 'behavioral'])
      .describe('The group it appears under in the filter.'),
    name: z
      .string()
      .describe('The name in German. Other languages are UI strings under skillLabels in src/locales/*.json.'),
  }),
});

const charactersCollection = defineCollection({
  // Files starting with an underscore are ignored, so a moderator can keep a template beside the real ones.
  loader: glob({ pattern: '[^_]*.yaml', base: './src/content/characters' }),
  schema: z.object({
    id: z.string().describe('Lowercase slug; the file name and the id stories list in cast. Never change it once a story uses it.'),
    name: z.string().describe('The name as shown in stories.'),
    status: z
      .enum(['draft', 'approved'])
      .default('draft')
      .describe("'approved' only after a second moderator has signed the sheet (docs/roadmap/03)."),
    descriptor: z
      .string()
      .describe('The fixed descriptor, pasted verbatim into every image prompt (docs/roadmap/ux/06 section 2).'),
    colourRecipe: z.string().describe('Body, accent and signature-item colours as named tokens or hex values.'),
    never: z.array(z.string()).optional().describe('What must never change or appear, e.g. never without the scarf.'),
    references: z
      .array(z.string())
      .optional()
      .describe('File names of the reference images, e.g. bruno_b1_front.png. They live in art/characters/{id}/ or in your own storage; they are never published.'),
    approvedBy: z.string().optional().describe('The second moderator who signed the sheet.'),
    approvedAt: z.date().optional().describe('When they signed it.'),
  }),
});

export const collections = {
  stories: storiesCollection,
  skills: skillsCollection,
  characters: charactersCollection,
};

