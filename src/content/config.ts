import { defineCollection, z } from 'astro:content';

const storyPageSchema = z.object({
  text: z.string(),
  image: z.string().optional(),
});

const quizQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['truefalse', 'multiplechoice', 'fillinblank']),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  options: z.array(z.string()).optional(),
});

const storiesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    titleAr: z.string().optional(),
    titleEn: z.string().optional(),
    titleTr: z.string().optional(),
    titleUr: z.string().optional(),
    emoji: z.string(),
    skills: z.array(z.string()),
    ageGroup: z.string().default('3-7'),
    languages: z.array(z.enum(['de', 'ar', 'en', 'tr', 'ur'])),
    storyId: z.string(),
    publishDate: z.date().optional(),
    author: z.string().optional(),
    provider: z.enum(['local', 'google-drive', 'external']).default('local'),
    providerUrl: z.string().optional(),
    characterType: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate']).optional(),
    estimatedReadTime: z.number().optional(),
    // Interactive format fields
    storyFormat: z.enum(['standard', 'interactive']).default('standard'),
    pages: z.array(storyPageSchema).optional(),
    // Quiz questions
    questions: z.array(quizQuestionSchema).optional(),
  }),
});

export const collections = {
  stories: storiesCollection,
};
