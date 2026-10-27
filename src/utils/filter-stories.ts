/**
 * Filter stories based on search query, skills, languages, shelf (band) and length
 * Logic: (skill1 OR skill2) AND (lang1 OR lang2) AND (shelf1 OR shelf2) AND (length1 OR length2) AND searchQuery
 */

export interface StoryFilterData {
  title: string;
  skills: string[];
  languages: string[];
  /** Extra words the search also looks in (summary, skill labels). */
  text?: string;
  band?: number;
  minutes?: number;
}

export interface FilterCriteria {
  searchQuery?: string;
  selectedSkills?: string[];
  selectedLanguages?: string[];
  selectedBands?: number[];
  selectedLengths?: LengthBucket[];
}

/** Upper bounds in minutes (ux/03 Library): "≤ 5", "≤ 15", "≤ 30", "30+". */
export type LengthBucket = '5' | '15' | '30' | '30+';
export const LENGTH_BUCKETS: LengthBucket[] = ['5', '15', '30', '30+'];

const inBucket = (minutes: number, bucket: LengthBucket) =>
  bucket === '30+' ? minutes > 30 : minutes <= Number(bucket);

/** Lower-case and drop diacritics so "Türkçe" is found by "turkce" and Arabic search ignores vowel marks. */
export const fold = (text: string) => text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase();

/**
 * Determines if a story matches the filter criteria
 * @param story - Story data (title, skills, languages)
 * @param criteria - Filter criteria
 * @returns true if story matches all criteria
 */
export function matchesFilter(story: StoryFilterData, criteria: FilterCriteria): boolean {
  const {
    searchQuery = '',
    selectedSkills = [],
    selectedLanguages = [],
    selectedBands = [],
    selectedLengths = [],
  } = criteria;

  const query = fold(searchQuery.trim());
  const haystack = fold(`${story.title} ${story.text ?? ''}`);
  const matchesSearch = !query || haystack.includes(query);

  // OR logic within one filter type
  const matchesSkills =
    selectedSkills.length === 0 || selectedSkills.some(skill => story.skills.includes(skill));
  const matchesLanguages =
    selectedLanguages.length === 0 ||
    selectedLanguages.some(lang => story.languages.includes(lang));
  const matchesBand =
    selectedBands.length === 0 || (story.band !== undefined && selectedBands.includes(story.band));
  const matchesLength =
    selectedLengths.length === 0 ||
    (story.minutes !== undefined && selectedLengths.some(b => inBucket(story.minutes!, b)));

  // AND logic between filter types
  return matchesSearch && matchesSkills && matchesLanguages && matchesBand && matchesLength;
}

/**
 * The skills an area selection stands for: a ticked area means all its skills, unless skills of that area are ticked
 * too, which narrow it to those. A ticked skill whose area is not ticked (a shared link) counts on its own.
 */
export function skillsForAreas(
  areas: string[],
  skills: string[],
  areaOf: Record<string, string>
): string[] {
  const out = new Set(skills.filter(id => !areas.includes(areaOf[id])));
  for (const area of areas) {
    const picked = skills.filter(id => areaOf[id] === area);
    const all = Object.keys(areaOf).filter(id => areaOf[id] === area);
    for (const id of picked.length ? picked : all) out.add(id);
  }
  return [...out];
}

/**
 * Filters an array of stories based on criteria
 */
export function filterStories<T extends StoryFilterData>(
  stories: T[],
  criteria: FilterCriteria
): T[] {
  return stories.filter(story => matchesFilter(story, criteria));
}

export type FilterKey =
  'searchQuery' | 'selectedSkills' | 'selectedLanguages' | 'selectedBands' | 'selectedLengths';

/**
 * The one filter whose removal brings back the most stories, for the "Remove X?" suggestion
 * on an empty result. Null when nothing is set, or when removing any single filter still leaves nothing.
 */
export function mostRestrictiveFilter(
  stories: StoryFilterData[],
  criteria: FilterCriteria
): FilterKey | null {
  const keys: FilterKey[] = [
    'searchQuery',
    'selectedSkills',
    'selectedLanguages',
    'selectedBands',
    'selectedLengths',
  ];
  let best: FilterKey | null = null;
  let bestCount = 0;
  for (const key of keys) {
    const value = criteria[key];
    if (!value || (Array.isArray(value) ? value.length === 0 : !value.trim())) continue;
    const count = filterStories(stories, { ...criteria, [key]: undefined }).length;
    if (count > bestCount) {
      best = key;
      bestCount = count;
    }
  }
  return best;
}
