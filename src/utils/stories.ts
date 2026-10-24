import { getCollection, type CollectionEntry } from 'astro:content';
import { localesByStoryId } from './story-availability';

export type Story = CollectionEntry<'stories'>;

// The moderators' preview build shows drafts so a reviewer can read the real page before it goes live. Both
// flags must be set, so an indexable production build can never leak a draft.
// Astro hands these over as the raw strings from the environment ("1"), or as booleans once defined in vite config.
const on = (value: unknown) => value === true || value === '1' || value === 'true';
const showDrafts = on(import.meta.env.SHOW_DRAFTS) && on(import.meta.env.NOINDEX);

/**
 * The only way to read the story collection.
 *
 * Only a story with `status: published` goes live; a missing status is a draft,
 * so a file the CMS created or an editor forgot never reaches production. A draft
 * gets no page, no listing and no sitemap entry. Calling `getCollection('stories')` directly bypasses that
 * and leaks the draft into one surface while the others hide it — which reads
 * as a broken link rather than as unfinished content.
 */
export async function getPublishedStories(filter?: (entry: Story) => boolean): Promise<Story[]> {
  return getCollection(
    'stories',
    entry => (showDrafts || entry.data.status === 'published') && (filter ? filter(entry) : true)
  );
}

/**
 * Which locales each published story exists in, keyed by `storyId`.
 *
 * Drafts are excluded, so an unpublished translation does not advertise a
 * language the visitor cannot actually read.
 */
export async function getStoryAvailability() {
  return localesByStoryId(await getPublishedStories());
}

/** The skills taxonomy files (src/content/skills); read here because this is the one module allowed to read collections. */
export const getSkillEntries = () => getCollection('skills');

type Alt = Record<string, string>;

/** Language-neutral part of a story, assembled from its German source file; alt text comes from each locale's own file. */
export interface StoryMeta {
  band: number;
  emoji?: string;
  skills?: string[];
  cover?: { src: string; alt: Alt };
  frames?: { src: string; alt: Alt; pageRef?: number }[];
  palette?: [string, string];
  art?: NonNullable<Story['data']['art']>;
}

let metaByStory: Promise<Map<string, StoryMeta>> | undefined;

function buildMeta(entries: Story[]): Map<string, StoryMeta> {
  const byId = new Map<string, Story[]>();
  for (const e of entries) byId.set(e.data.storyId, [...(byId.get(e.data.storyId) ?? []), e]);
  const out = new Map<string, StoryMeta>();
  for (const [storyId, group] of byId) {
    const source = group.find(e => e.id.startsWith('de/'));
    if (!source) continue;
    const d = source.data;
    const alts = (pick: (e: Story) => string | undefined) => {
      const a: Alt = {};
      for (const e of group) {
        const text = e.id.startsWith('de/') ? undefined : pick(e);
        if (text) a[e.id.split('/')[0]] = text;
      }
      return a;
    };
    out.set(storyId, {
      band: d.band ?? 1,
      emoji: d.emoji,
      skills: d.skills,
      palette: d.palette,
      art: d.art,
      cover: d.cover && {
        src: d.cover.src,
        alt: { ...(d.cover.alt ? { de: d.cover.alt } : {}), ...alts(e => e.data.coverAlt) },
      },
      frames: d.frames?.map((f, i) => ({
        src: f.src,
        pageRef: f.pageRef,
        alt: { ...(f.alt ? { de: f.alt } : {}), ...alts(e => e.data.frameAlts?.[i]) },
      })),
    });
  }
  return out;
}

/** Every story's shared fields at once, for list pages that need an emoji and skills for each card. */
export async function getStoryMetaMap(): Promise<Map<string, StoryMeta>> {
  metaByStory ??= getCollection('stories').then(buildMeta);
  return metaByStory;
}

/**
 * Shared fields (band, skills, art) of a story, or undefined when it has no German source file.
 * Reads drafts too: an unpublished German file must not strip the art from a published translation.
 */
export async function getStoryMeta(storyId: string): Promise<StoryMeta | undefined> {
  return (await getStoryMetaMap()).get(storyId);
}

/** Derived from the text, never hand-entered: 150 words a minute for a child being read to. */
export function readMinutes(body: string | undefined): number {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 150));
}
