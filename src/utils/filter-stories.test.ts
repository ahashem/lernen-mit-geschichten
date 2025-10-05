import { describe, it, expect } from 'vitest';
import { matchesFilter, filterStories, type StoryFilterData } from './filter-stories';

describe('matchesFilter', () => {
  const testStories: StoryFilterData[] = [
    {
      title: 'Bruno\'s Colorful Feelings',
      skills: ['self-awareness', 'emotional-regulation'],
      languages: ['de', 'en', 'ar']
    },
    {
      title: 'Fritz and the Angry Squirrel',
      skills: ['patience', 'empathy', 'emotional-regulation'],
      languages: ['de', 'ar']
    },
    {
      title: 'Lina Learns to Share',
      skills: ['cooperation', 'empathy'],
      languages: ['de', 'en', 'tr', 'ur']
    },
    {
      title: 'Tobi\'s Big Decision',
      skills: ['decision-making', 'responsibility'],
      languages: ['de', 'en', 'ur']
    }
  ];

  describe('Search filtering', () => {
    it('should return true when no search query provided', () => {
      expect(matchesFilter(testStories[0], {})).toBe(true);
    });

    it('should return true when title matches search query (case insensitive)', () => {
      expect(matchesFilter(testStories[0], { searchQuery: 'bruno' })).toBe(true);
      expect(matchesFilter(testStories[0], { searchQuery: 'BRUNO' })).toBe(true);
      expect(matchesFilter(testStories[0], { searchQuery: 'colorful' })).toBe(true);
    });

    it('should return false when title does not match search query', () => {
      expect(matchesFilter(testStories[0], { searchQuery: 'fritz' })).toBe(false);
    });
  });

  describe('Skills filtering (OR logic)', () => {
    it('should return true when no skills selected', () => {
      expect(matchesFilter(testStories[0], { selectedSkills: [] })).toBe(true);
    });

    it('should return true when story has at least one selected skill', () => {
      expect(matchesFilter(testStories[0], { selectedSkills: ['self-awareness'] })).toBe(true);
      expect(matchesFilter(testStories[0], { selectedSkills: ['emotional-regulation'] })).toBe(true);
    });

    it('should return true when story has any of multiple selected skills (OR logic)', () => {
      expect(matchesFilter(testStories[1], {
        selectedSkills: ['patience', 'cooperation']
      })).toBe(true);
    });

    it('should return false when story has none of the selected skills', () => {
      expect(matchesFilter(testStories[0], {
        selectedSkills: ['patience', 'empathy']
      })).toBe(false);
    });
  });

  describe('Languages filtering (OR logic)', () => {
    it('should return true when no languages selected', () => {
      expect(matchesFilter(testStories[0], { selectedLanguages: [] })).toBe(true);
    });

    it('should return true when story has at least one selected language', () => {
      expect(matchesFilter(testStories[0], { selectedLanguages: ['de'] })).toBe(true);
      expect(matchesFilter(testStories[0], { selectedLanguages: ['en'] })).toBe(true);
    });

    it('should return true when story has any of multiple selected languages (OR logic)', () => {
      expect(matchesFilter(testStories[2], {
        selectedLanguages: ['tr', 'ar']
      })).toBe(true);
    });

    it('should return false when story has none of the selected languages', () => {
      expect(matchesFilter(testStories[1], {
        selectedLanguages: ['en', 'tr', 'ur']
      })).toBe(false);
    });
  });

  describe('Combined filtering (AND logic between types)', () => {
    it('should return true when all criteria match', () => {
      expect(matchesFilter(testStories[0], {
        searchQuery: 'bruno',
        selectedSkills: ['self-awareness'],
        selectedLanguages: ['de']
      })).toBe(true);
    });

    it('should return false when search matches but skills do not', () => {
      expect(matchesFilter(testStories[0], {
        searchQuery: 'bruno',
        selectedSkills: ['patience'],
        selectedLanguages: ['de']
      })).toBe(false);
    });

    it('should return false when skills match but languages do not', () => {
      expect(matchesFilter(testStories[1], {
        selectedSkills: ['patience'],
        selectedLanguages: ['en', 'tr']
      })).toBe(false);
    });

    it('should return false when search does not match', () => {
      expect(matchesFilter(testStories[0], {
        searchQuery: 'fritz',
        selectedSkills: ['self-awareness'],
        selectedLanguages: ['de']
      })).toBe(false);
    });

    it('should apply OR within skills AND OR within languages', () => {
      // Fritz has: patience, empathy, emotional-regulation; languages: de, ar
      expect(matchesFilter(testStories[1], {
        selectedSkills: ['patience', 'cooperation'], // has patience (OR match)
        selectedLanguages: ['ar', 'en'] // has ar (OR match)
      })).toBe(true);
    });
  });
});

describe('filterStories', () => {
  const testStories: StoryFilterData[] = [
    {
      title: 'Bruno\'s Colorful Feelings',
      skills: ['self-awareness', 'emotional-regulation'],
      languages: ['de', 'en', 'ar']
    },
    {
      title: 'Fritz and the Angry Squirrel',
      skills: ['patience', 'empathy', 'emotional-regulation'],
      languages: ['de', 'ar']
    },
    {
      title: 'Lina Learns to Share',
      skills: ['cooperation', 'empathy'],
      languages: ['de', 'en', 'tr', 'ur']
    }
  ];

  it('should return all stories when no filters applied', () => {
    const result = filterStories(testStories, {});
    expect(result).toHaveLength(3);
  });

  it('should filter by search query', () => {
    const result = filterStories(testStories, { searchQuery: 'bruno' });
    expect(result).toHaveLength(1);
    expect(result[0].title).toContain('Bruno');
  });

  it('should filter by single skill', () => {
    const result = filterStories(testStories, { selectedSkills: ['empathy'] });
    expect(result).toHaveLength(2);
    expect(result.map(s => s.title)).toContain('Fritz and the Angry Squirrel');
    expect(result.map(s => s.title)).toContain('Lina Learns to Share');
  });

  it('should filter by multiple skills (OR logic)', () => {
    const result = filterStories(testStories, {
      selectedSkills: ['self-awareness', 'cooperation']
    });
    expect(result).toHaveLength(2);
  });

  it('should filter by single language', () => {
    const result = filterStories(testStories, { selectedLanguages: ['tr'] });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Lina Learns to Share');
  });

  it('should filter by multiple languages (OR logic)', () => {
    const result = filterStories(testStories, {
      selectedLanguages: ['ar', 'ur']
    });
    expect(result).toHaveLength(3); // Bruno & Fritz have ar, Lina has ur
  });

  it('should apply AND logic between filter types', () => {
    const result = filterStories(testStories, {
      selectedSkills: ['empathy'], // Fritz & Lina
      selectedLanguages: ['ar'] // Bruno & Fritz
    });
    expect(result).toHaveLength(1); // Only Fritz matches both
    expect(result[0].title).toBe('Fritz and the Angry Squirrel');
  });

  it('should combine all filter types', () => {
    const result = filterStories(testStories, {
      searchQuery: 'fritz',
      selectedSkills: ['patience', 'empathy'],
      selectedLanguages: ['de', 'ar']
    });
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Fritz and the Angry Squirrel');
  });

  it('should return empty array when no matches', () => {
    const result = filterStories(testStories, {
      selectedSkills: ['decision-making'],
      selectedLanguages: ['ar']
    });
    expect(result).toHaveLength(0);
  });
});
