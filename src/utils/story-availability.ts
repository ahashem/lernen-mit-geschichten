import type { Locale } from './i18n';

/**
 * Locale order used for every availability list, so the rendered attribute is
 * stable across builds regardless of collection iteration order.
 */
export const LOCALES: Locale[] = ['de', 'ar', 'en', 'tr', 'ur'];

const isLocale = (value: string): value is Locale => (LOCALES as string[]).includes(value);

export interface StoryAvailabilityEntry {
  /** Collection entry id, locale-prefixed: `de/001-bruno`. */
  id: string;
  data: { storyId: string };
}

/**
 * Which locales each story exists in, keyed by `storyId`.
 *
 * Translations of one story are separate files that share a `storyId`, so a
 * story's real language availability is only computable across the whole
 * collection. An entry's own `languages` frontmatter cannot answer this — it
 * has only ever held the locale of the file it sits in.
 *
 * Feed this the *published* stories: a draft translation is not available.
 */
export function localesByStoryId(entries: StoryAvailabilityEntry[]): Map<string, Locale[]> {
  const found = new Map<string, Set<Locale>>();

  for (const entry of entries) {
    const locale = entry.id.split('/')[0];
    if (!isLocale(locale)) continue;

    const locales = found.get(entry.data.storyId) ?? new Set<Locale>();
    locales.add(locale);
    found.set(entry.data.storyId, locales);
  }

  return new Map(
    [...found].map(([storyId, locales]) => [storyId, LOCALES.filter(l => locales.has(l))])
  );
}
