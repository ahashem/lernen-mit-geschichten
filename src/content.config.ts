import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';


const alt = z
  .record(z.string(), z.string())
  .describe('Alt text per locale, written for a screen-reader user, not a caption. Falls back to en.');

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
    storyId: z.string().describe('Joins this translation to its story-meta entry. Immutable once published.'),
    title: z.string().describe("This locale's title."),
    summary: z.string().optional().describe('One or two sentences for cards, previews and SEO.'),
    keyMessage: z.string().optional().describe('The one idea, shown at the end of the story.'),
    emoji: z.string().describe('Fallback identity when the story has no cover.'),
    skills: z.array(z.string()).describe('1-3 ids from skills-taxonomy.ts.'),
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

const storyMetaCollection = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/story-meta' }),
  schema: z.object({
    storyId: z.string().describe('Slug; matches the storyId of every translation.'),
    band: z
      .number()
      .int()
      .min(1)
      .max(4)
      .describe('1 picture book, 2 read-along, 3 chapter story, 4 long read. Set by editors; same in every locale.'),
    cover: z
      .object({ src: z.string().describe('Path under public/.'), alt })
      .optional()
      .describe('Required for a story to be featured.'),
    frames: z
      .array(
        z.object({
          src: z.string().describe('Path under public/.'),
          alt,
          pageRef: z.number().int().optional().describe('1-based page this picture belongs to; defaults to its position.'),
        })
      )
      .optional()
      .describe('Ordered story pictures. A page without one uses the generated fallback.'),
    palette: z
      .tuple([z.string(), z.string()])
      .optional()
      .describe('Two hex colours; tint the fallback art and the reader.'),
    art: z
      .object({
        generator: z.string(),
        styleVersion: z.string(),
        reviewedBy: z.string(),
        reviewedAt: z.date(),
        aiGenerated: z.literal(true),
      })
      .optional()
      .describe('Provenance for any art; required once a story carries art.'),
    status: z.enum(['draft', 'published']).default('published').describe('Publication state of the story.'),
  }),
});

export const collections = {
  stories: storiesCollection,
  'story-meta': storyMetaCollection,
};

