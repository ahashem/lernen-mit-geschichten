import {
  getPublishedStories,
  getStoryAvailability,
  getStoryMetaMap,
  readMinutes,
  type StoryMeta,
} from './stories';
import { firstSentence, paginate } from './story-pages';
import type { Locale } from './i18n';

export interface CatalogueItem {
  slug: string;
  storyId: string;
  title: string;
  summary: string;
  band: number;
  minutes: number;
  /** Storybook pages (bands 1-2), for "Page 5 of 10" on the continue card. */
  pageCount: number;
  languages: Locale[];
  skills: string[];
  emoji?: string;
  meta?: StoryMeta;
}

/** Every published story in one language, with what the library and the home shelves both need. */
export async function getCatalogue(locale: Locale): Promise<CatalogueItem[]> {
  const stories = await getPublishedStories(({ id }) => id.startsWith(`${locale}/`));
  const metas = await getStoryMetaMap();
  const availability = await getStoryAvailability();
  return stories.map(s => {
    const meta = metas.get(s.data.storyId);
    return {
      slug: s.id.replace(`${locale}/`, ''),
      storyId: s.data.storyId,
      title: s.data.title,
      summary: s.data.summary ?? firstSentence(s.body ?? '', locale),
      band: meta?.band ?? 1,
      minutes: readMinutes(s.body),
      pageCount: paginate(s.body ?? '', locale, meta?.band ?? 1, s.data.pages).pages.length,
      languages: availability.get(s.data.storyId) ?? [locale],
      skills: s.data.skills ?? meta?.skills ?? [],
      emoji: s.data.emoji ?? meta?.emoji,
      meta,
    };
  });
}

/** Shelf names by band; the strings are the ones Settings already uses. */
export const SHELF_KEY = {
  1: 'shelfPicture',
  2: 'shelfReadAlong',
  3: 'shelfChapter',
  4: 'shelfLong',
} as const;
