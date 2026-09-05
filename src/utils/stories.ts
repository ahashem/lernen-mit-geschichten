import { getCollection, type CollectionEntry } from 'astro:content';

export type Story = CollectionEntry<'stories'>;

/**
 * The only way to read the story collection.
 *
 * A story with `status: draft` is unpublished: it gets no page, no listing and
 * no sitemap entry. Calling `getCollection('stories')` directly bypasses that
 * and leaks the draft into one surface while the others hide it — which reads
 * as a broken link rather than as unfinished content.
 */
export async function getPublishedStories(filter?: (entry: Story) => boolean): Promise<Story[]> {
  return getCollection(
    'stories',
    entry => entry.data.status !== 'draft' && (filter ? filter(entry) : true)
  );
}
