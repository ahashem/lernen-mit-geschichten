import { describe, it, expect } from 'vitest';
import { localesByStoryId, type StoryAvailabilityEntry } from './story-availability';

const entry = (id: string, storyId: string): StoryAvailabilityEntry => ({ id, data: { storyId } });

describe('localesByStoryId', () => {
  it('groups translations of one story by their shared storyId', () => {
    const result = localesByStoryId([
      entry('de/001-bruno', '001-bruno'),
      entry('en/001-bruno', '001-bruno'),
      entry('ar/001-bruno', '001-bruno'),
    ]);

    expect(result.get('001-bruno')).toEqual(['de', 'ar', 'en']);
  });

  it('reports uneven availability per story', () => {
    const result = localesByStoryId([
      entry('de/001-bruno', '001-bruno'),
      entry('en/001-bruno', '001-bruno'),
      entry('de/019-finn', '019-finn'),
    ]);

    expect(result.get('001-bruno')).toEqual(['de', 'en']);
    expect(result.get('019-finn')).toEqual(['de']);
  });

  it('orders locales consistently regardless of entry order', () => {
    const forwards = localesByStoryId([entry('de/x', 'x'), entry('ar/x', 'x'), entry('ur/x', 'x')]);
    const backwards = localesByStoryId([
      entry('ur/x', 'x'),
      entry('ar/x', 'x'),
      entry('de/x', 'x'),
    ]);

    expect(forwards.get('x')).toEqual(['de', 'ar', 'ur']);
    expect(backwards.get('x')).toEqual(forwards.get('x'));
  });

  it('does not double-count a locale', () => {
    const result = localesByStoryId([
      entry('de/001-bruno', '001-bruno'),
      entry('de/001-bruno-interactive', '001-bruno'),
    ]);

    expect(result.get('001-bruno')).toEqual(['de']);
  });

  it('ignores entries whose id carries no known locale prefix', () => {
    const result = localesByStoryId([entry('001-bruno', '001-bruno'), entry('xx/y', 'y')]);

    expect(result.size).toBe(0);
  });

  it('returns an empty map for an empty collection', () => {
    expect(localesByStoryId([]).size).toBe(0);
  });
});
