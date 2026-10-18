import type { Locale } from './i18n';

export interface BookPage {
  sentences: string[];
  /** Indices of the story paragraphs this page holds (derived pages only); used to align translations. */
  paragraphs?: number[];
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

  // Existing stories use `---` as a rule between `##` sections; only a body without sections has page breaks.
  if (!/^## /m.test(body) && /^\s*---\s*$/m.test(body)) {
    const parts = body
      .split(/^\s*---\s*$/m)
      .map(plain)
      .filter(Boolean);
    return { explicit: true, pages: parts.map(text => ({ sentences: sentencesOf(text, locale) })) };
  }

  const story = storySection(body);
  const limit = SENTENCES_PER_PAGE[band] ?? 5;
  const pages: BookPage[] = [];
  let current: BookPage = { sentences: [], paragraphs: [] };
  const flush = () => {
    if (current.sentences.length) pages.push(current);
    current = { sentences: [], paragraphs: [] };
  };

  paragraphsOf(story).forEach((paragraph, index) => {
    const sentences = sentencesOf(paragraph, locale);
    if (current.sentences.length && current.sentences.length + sentences.length > limit) flush();
    for (const sentence of sentences) {
      if (current.sentences.length === limit) flush();
      current.sentences.push(sentence);
      if (!current.paragraphs!.includes(index)) current.paragraphs!.push(index);
    }
  });
  flush();
  return { pages, explicit: false };
}

const paragraphsOf = (story: string) =>
  story
    .split(/\n\s*\n/)
    .map(plain)
    .filter(Boolean);

/** The story section of a Markdown body: the first `##` section, or everything before the first. */
function storySection(body: string): string {
  const sections = body.split(/^## .*$/m).filter(s => s.trim());
  return body.trimStart().startsWith('## ') ? (sections[0] ?? '') : (body.split(/^## /m)[0] ?? '');
}

/**
 * A translation cut into the same pages as `base`, or null when the two cannot be aligned honestly
 * (different paragraph count, or different explicit page count). Two-language reading needs this.
 */
export function alignTo(
  base: BookPages,
  rawBody: string,
  locale: Locale,
  band: number,
  explicitPages?: { text: string }[]
): BookPage[] | null {
  const body = rawBody.replace(/^# .*$/gm, '');
  if (base.explicit) {
    const other = paginate(rawBody, locale, band, explicitPages);
    return other.explicit && other.pages.length === base.pages.length ? other.pages : null;
  }
  const paragraphs = paragraphsOf(storySection(body));
  const total = base.pages.reduce((n, p) => Math.max(n, ...(p.paragraphs ?? [-1]), -1), -1) + 1;
  if (paragraphs.length !== total) return null;
  return base.pages.map(page => ({
    sentences: (page.paragraphs ?? []).flatMap(i => sentencesOf(paragraphs[i], locale)),
  }));
}

/** A card or meta description when a story has no `summary`: derived, never stored. */
export function firstSentence(body: string, locale: Locale): string {
  const { pages } = paginate(body, locale, 1);
  return pages[0]?.sentences[0] ?? '';
}

/** Chapter titles of a band 3-4 story: its `##` headings. Fewer than two means it is not chaptered. */
export function chapterTitles(rawBody: string): string[] {
  const titles = [...rawBody.matchAll(/^## +(.+?)\s*$/gm)].map(m => plain(m[1]));
  return titles.length >= 2 ? titles : [];
}
