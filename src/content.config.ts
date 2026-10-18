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
    .describe('The answer the story supports, for recall questions.'),
  options: z.array(z.string()).optional().describe('Choices for multiplechoice.'),
});

const narrationSchema = z.object({
  audio: z.string().describe('Folder under public/assets/audio/{locale}/ holding one file per page.'),
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
        generator: z.string(),
        styleVersion: z.string(),
        reviewedBy: z.string(),
        reviewedAt: z.date(),
        aiGenerated: z.literal(true),
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
    de: z.string().describe('Label in German.'),
    en: z.string().describe('Label in English.'),
    ar: z.string().describe('Label in Arabic.'),
    tr: z.string().describe('Label in Turkish.'),
    ur: z.string().describe('Label in Urdu.'),
  }),
});

export const collections = {
  stories: storiesCollection,
  skills: skillsCollection,
};

