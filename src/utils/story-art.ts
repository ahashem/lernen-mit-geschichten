import { existsSync, readFileSync } from 'node:fs';
import { BASE_PATH } from './site';
import type { Locale } from './i18n';
import type { StoryMeta } from './stories';

const TINTS: [string, string][] = [
  ['var(--poppy-tint)', 'var(--honey-tint)'],
  ['var(--lagoon-tint)', 'var(--sky-tint)'],
  ['var(--plum-tint)', 'var(--poppy-tint)'],
  ['var(--moss-tint)', 'var(--honey-tint)'],
  ['var(--sky-tint)', 'var(--plum-tint)'],
  ['var(--honey-tint)', 'var(--lagoon-tint)'],
];

/** Fallback palette: the story's own, else a stable pick from the six tints (no per-story special cases). */
export function paletteFor(storyId: string, meta?: StoryMeta): [string, string] {
  if (meta?.palette) return meta.palette;
  let hash = 0;
  for (const ch of storyId) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return TINTS[hash % TINTS.length];
}

export interface Picture {
  src: string;
  alt: string;
  /** Set when the alt text is not in the reader's language. */
  altLang?: string;
}

function picture(
  art: { src: string; alt: Record<string, string> } | undefined,
  locale: Locale
): Picture | undefined {
  if (!art) return undefined;
  const own = art.alt[locale];
  const fallbackLang = own ? undefined : Object.keys(art.alt)[0];
  return {
    src: `${BASE_PATH}${art.src}`,
    alt: own ?? (fallbackLang ? art.alt[fallbackLang] : ''),
    altLang: fallbackLang && fallbackLang !== locale ? fallbackLang : undefined,
  };
}

export const coverOf = (meta: StoryMeta | undefined, locale: Locale) =>
  picture(meta?.cover, locale);

/** Frame for a 1-based page: an explicit `pageRef` wins, else the frame at that position. */
export function frameFor(meta: StoryMeta | undefined, page: number, locale: Locale) {
  const frames = meta?.frames ?? [];
  return picture(
    frames.find(f => f.pageRef === page) ?? frames.filter(f => !f.pageRef)[page - 1],
    locale
  );
}

export interface Narration {
  /** One URL per page, or '' where that page has no recording. */
  audio: string[];
  /** Per-page word timings `[{ w, start, end }]`, or null. */
  timings: ({ w: number; start: number; end: number }[] | null)[];
}

/**
 * Recordings pair with pages by number (02 Assets): `audio/{locale}/{storyId}/{nn}.m4a`, optional `{nn}.json`.
 * Only trusted when pages are the author's own breaks; derived pages would pair the wrong audio.
 */
export function narrationFor(
  storyId: string,
  locale: Locale,
  pageCount: number,
  explicit: boolean
): Narration | null {
  if (!explicit) return null;
  const dir = `public/assets/audio/${locale}/${storyId}`;
  const audio: string[] = [];
  const timings: Narration['timings'] = [];
  for (let i = 1; i <= pageCount; i++) {
    const nn = String(i).padStart(2, '0');
    audio.push(
      existsSync(`${dir}/${nn}.m4a`)
        ? `${BASE_PATH}/assets/audio/${locale}/${storyId}/${nn}.m4a`
        : ''
    );
    timings.push(
      existsSync(`${dir}/${nn}.json`) ? JSON.parse(readFileSync(`${dir}/${nn}.json`, 'utf8')) : null
    );
  }
  return audio.some(Boolean) ? { audio, timings } : null;
}
