import type { Locale } from './i18n';

export interface BookPage {
  sentences: string[];
}

export interface BookPages {
  pages: BookPage[];
  /** Pages come from the author's `---` breaks (or `pages[]`), so per-page assets such as recordings pair with them. */
  explicit: boolean;
}

/** Max sentences per storybook page, by band (ux/02 Typography). */
const SENTENCES_PER_PAGE: Record<number, number> = { 1: 3, 2: 5 };

const plain = (text: string) =>
  text
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function sentencesOf(text: string, locale: Locale): string[] {
  const segmenter = new Intl.Segmenter(locale, { granularity: 'sentence' });
  return [...segmenter.segment(text)].map(s => s.segment.trim()).filter(Boolean);
}

/** The words a reader can tap: whitespace-separated, the same split the narration timings use. */
export const wordsOf = (sentence: string): string[] => sentence.split(/\s+/).filter(Boolean);

/**
 * Pages for the storybook, derived at render time; nothing is stored.
 * Explicit `---` breaks win. Otherwise the first `##` section is the story (later sections are
 * the afterword, shown in the full text) and its paragraphs are grouped under the band's limit.
 */
export function paginate(
  rawBody: string,
  locale: Locale,
  band: number,
  explicitPages?: { text: string }[]
): BookPages {
  // The title is on the cover; a leading `# Title` line is not story text.
  const body = rawBody.replace(/^# .*$/gm, '');
  if (explicitPages?.length) {
    return {
      explicit: true,
      pages: explicitPages.map(p => ({ sentences: sentencesOf(plain(p.text), locale) })),
    };
  }

  if (/^\s*---\s*$/m.test(body)) {
    const parts = body
      .split(/^\s*---\s*$/m)
      .map(plain)
      .filter(Boolean);
    return { explicit: true, pages: parts.map(text => ({ sentences: sentencesOf(text, locale) })) };
  }

  const sections = body.split(/^## .*$/m).filter(s => s.trim());
  const story = body.trimStart().startsWith('## ')
    ? (sections[0] ?? '')
    : (body.split(/^## /m)[0] ?? '');
  const limit = SENTENCES_PER_PAGE[band] ?? 5;
  const pages: BookPage[] = [];
  let current: string[] = [];

  for (const paragraph of story
    .split(/\n\s*\n/)
    .map(plain)
    .filter(Boolean)) {
    const sentences = sentencesOf(paragraph, locale);
    if (current.length && current.length + sentences.length > limit) {
      pages.push({ sentences: current });
      current = [];
    }
    for (const sentence of sentences) {
      if (current.length === limit) {
        pages.push({ sentences: current });
        current = [];
      }
      current.push(sentence);
    }
  }
  if (current.length) pages.push({ sentences: current });
  return { pages, explicit: false };
}

/** A card or meta description when a story has no `summary`: derived, never stored. */
export function firstSentence(body: string, locale: Locale): string {
  const { pages } = paginate(body, locale, 1);
  return pages[0]?.sentences[0] ?? '';
}
