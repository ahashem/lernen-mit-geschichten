/**
 * Filter stories based on search query, skills, and languages
 * Logic: (skill1 OR skill2) AND (lang1 OR lang2) AND searchQuery
 */

export interface StoryFilterData {
  title: string;
  skills: string[];
  languages: string[];
}

export interface FilterCriteria {
  searchQuery?: string;
  selectedSkills?: string[];
  selectedLanguages?: string[];
}

/**
 * Determines if a story matches the filter criteria
 * @param story - Story data (title, skills, languages)
 * @param criteria - Filter criteria (searchQuery, selectedSkills, selectedLanguages)
 * @returns true if story matches all criteria
 */
export function matchesFilter(story: StoryFilterData, criteria: FilterCriteria): boolean {
  const { searchQuery = '', selectedSkills = [], selectedLanguages = [] } = criteria;

  // Search filter (match in title)
  const matchesSearch =
    !searchQuery || story.title.toLowerCase().includes(searchQuery.toLowerCase());

  // Skills filter (OR logic within skills)
  const matchesSkills =
    selectedSkills.length === 0 || selectedSkills.some(skill => story.skills.includes(skill));

  // Languages filter (OR logic within languages)
  const matchesLanguages =
    selectedLanguages.length === 0 ||
    selectedLanguages.some(lang => story.languages.includes(lang));

  // AND logic between filter types
  return matchesSearch && matchesSkills && matchesLanguages;
}

/**
 * Filters an array of stories based on criteria
 * @param stories - Array of stories to filter
 * @param criteria - Filter criteria
 * @returns Filtered array of stories
 */
export function filterStories<T extends StoryFilterData>(
  stories: T[],
  criteria: FilterCriteria
): T[] {
  return stories.filter(story => matchesFilter(story, criteria));
}
