/**
 * Progress Tracking System
 * Aggregates and analyzes user learning progress from localStorage
 */

export interface StoryProgress {
  storyId: string;
  quizScore: number;
  totalQuestions: number;
  lastAccessed: number;
  completedAt?: number;
  characterType?: string;
  skills?: string[];
  language?: string;
  readTime?: number;
}

export interface ProgressStats {
  totalStoriesRead: number;
  totalQuizzesCompleted: number;
  totalCorrectAnswers: number;
  totalQuestions: number;
  favoriteCharacter: string;
  readingStreak: number;
  lastActivityDate: string;
  skillsEncountered: Set<string>;
  languagesExplored: Set<string>;
  totalReadingTime: number;
  completionRate: number;
  dailyActivity: Map<string, number>;
  recentStories: StoryProgress[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: number;
  type: 'stories' | 'quizzes' | 'streak' | 'skills' | 'languages';
}

export class ProgressTracker {
  /**
   * Get all story progress from localStorage
   */
  static getAllProgress(): StoryProgress[] {
    const progress: StoryProgress[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      // Parse quiz progress
      if (key.startsWith('quiz-progress-')) {
        const storyId = key.replace('quiz-progress-', '');
        const score = parseInt(localStorage.getItem(key) || '0', 10);

        // Get story metadata from localStorage
        const metadataKey = `story-metadata-${storyId}`;
        const metadata = this.getStoryMetadata(storyId);

        progress.push({
          storyId,
          quizScore: score,
          totalQuestions: metadata.totalQuestions || 0,
          lastAccessed: metadata.lastAccessed || Date.now(),
          completedAt: score === metadata.totalQuestions ? metadata.lastAccessed : undefined,
          characterType: metadata.characterType,
          skills: metadata.skills,
          language: metadata.language,
          readTime: metadata.estimatedReadTime || 3,
        });
      }

      // Parse story view tracking
      if (key.startsWith('story-view-')) {
        const storyId = key.replace('story-view-', '');
        const viewData = JSON.parse(localStorage.getItem(key) || '{}');

        // Check if we already have quiz progress for this story
        const existingIndex = progress.findIndex(p => p.storyId === storyId);
        if (existingIndex === -1) {
          const metadata = this.getStoryMetadata(storyId);
          progress.push({
            storyId,
            quizScore: 0,
            totalQuestions: metadata.totalQuestions || 0,
            lastAccessed: viewData.timestamp || Date.now(),
            characterType: metadata.characterType,
            skills: metadata.skills,
            language: metadata.language,
            readTime: metadata.estimatedReadTime || 3,
          });
        }
      }
    }

    return progress.sort((a, b) => b.lastAccessed - a.lastAccessed);
  }

  /**
   * Get story metadata from localStorage
   */
  private static getStoryMetadata(storyId: string): any {
    const key = `story-metadata-${storyId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  }

  /**
   * Save story metadata to localStorage
   */
  static saveStoryMetadata(storyId: string, metadata: {
    totalQuestions?: number;
    characterType?: string;
    skills?: string[];
    language?: string;
    estimatedReadTime?: number;
  }) {
    const key = `story-metadata-${storyId}`;
    const existing = this.getStoryMetadata(storyId);
    localStorage.setItem(key, JSON.stringify({
      ...existing,
      ...metadata,
      lastAccessed: Date.now(),
    }));
  }

  /**
   * Track story view
   */
  static trackStoryView(storyId: string) {
    const key = `story-view-${storyId}`;
    localStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
    }));
  }

  /**
   * Calculate comprehensive progress statistics
   */
  static getProgressStats(): ProgressStats {
    const allProgress = this.getAllProgress();

    // Total stories read (unique stories with any interaction)
    const totalStoriesRead = allProgress.length;

    // Completed quizzes (all questions answered correctly)
    const completedQuizzes = allProgress.filter(p =>
      p.quizScore === p.totalQuestions && p.totalQuestions > 0
    );
    const totalQuizzesCompleted = completedQuizzes.length;

    // Total correct answers
    const totalCorrectAnswers = allProgress.reduce((sum, p) => sum + p.quizScore, 0);
    const totalQuestions = allProgress.reduce((sum, p) => sum + p.totalQuestions, 0);

    // Favorite character (most read character type)
    const characterCounts = new Map<string, number>();
    allProgress.forEach(p => {
      if (p.characterType) {
        characterCounts.set(p.characterType, (characterCounts.get(p.characterType) || 0) + 1);
      }
    });
    const favoriteCharacter = Array.from(characterCounts.entries())
      .sort((a, b) => b[1] - a[1])[0]?.[0] || 'bear';

    // Skills encountered
    const skillsEncountered = new Set<string>();
    allProgress.forEach(p => {
      p.skills?.forEach(skill => skillsEncountered.add(skill));
    });

    // Languages explored
    const languagesExplored = new Set<string>();
    allProgress.forEach(p => {
      if (p.language) languagesExplored.add(p.language);
    });

    // Total reading time estimate
    const totalReadingTime = allProgress.reduce((sum, p) => sum + (p.readTime || 3), 0);

    // Completion rate
    const completionRate = totalQuestions > 0
      ? Math.round((totalCorrectAnswers / totalQuestions) * 100)
      : 0;

    // Daily activity
    const dailyActivity = new Map<string, number>();
    allProgress.forEach(p => {
      const date = new Date(p.lastAccessed).toISOString().split('T')[0];
      dailyActivity.set(date, (dailyActivity.get(date) || 0) + 1);
    });

    // Reading streak
    const readingStreak = this.calculateStreak(dailyActivity);

    // Last activity date
    const lastActivityDate = allProgress.length > 0
      ? new Date(allProgress[0].lastAccessed).toLocaleDateString()
      : '';

    // Recent stories (last 5)
    const recentStories = allProgress.slice(0, 5);

    // Achievements
    const achievements = this.calculateAchievements({
      totalStoriesRead,
      totalQuizzesCompleted,
      readingStreak,
      skillsEncountered,
      languagesExplored,
      completionRate,
    });

    return {
      totalStoriesRead,
      totalQuizzesCompleted,
      totalCorrectAnswers,
      totalQuestions,
      favoriteCharacter,
      readingStreak,
      lastActivityDate,
      skillsEncountered,
      languagesExplored,
      totalReadingTime,
      completionRate,
      dailyActivity,
      recentStories,
      achievements,
    };
  }

  /**
   * Calculate reading streak (consecutive days)
   */
  private static calculateStreak(dailyActivity: Map<string, number>): number {
    if (dailyActivity.size === 0) return 0;

    const sortedDates = Array.from(dailyActivity.keys()).sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let currentDate = new Date(today);

    for (const dateStr of sortedDates) {
      const date = new Date(dateStr);
      const expectedDate = new Date(currentDate);
      expectedDate.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === expectedDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Calculate achievements based on progress
   */
  private static calculateAchievements(stats: {
    totalStoriesRead: number;
    totalQuizzesCompleted: number;
    readingStreak: number;
    skillsEncountered: Set<string>;
    languagesExplored: Set<string>;
    completionRate: number;
  }): Achievement[] {
    const achievements: Achievement[] = [];
    const now = Date.now();

    // Story milestones
    if (stats.totalStoriesRead >= 1) {
      achievements.push({
        id: 'first-story',
        title: 'First Story!',
        description: 'Read your first story',
        icon: '📖',
        unlockedAt: now,
        type: 'stories',
      });
    }
    if (stats.totalStoriesRead >= 5) {
      achievements.push({
        id: 'story-explorer',
        title: 'Story Explorer',
        description: 'Read 5 different stories',
        icon: '🗺️',
        unlockedAt: now,
        type: 'stories',
      });
    }
    if (stats.totalStoriesRead >= 10) {
      achievements.push({
        id: 'bookworm',
        title: 'Bookworm',
        description: 'Read 10 different stories',
        icon: '🐛',
        unlockedAt: now,
        type: 'stories',
      });
    }

    // Quiz milestones
    if (stats.totalQuizzesCompleted >= 1) {
      achievements.push({
        id: 'quiz-master',
        title: 'Quiz Master',
        description: 'Complete your first quiz',
        icon: '🏆',
        unlockedAt: now,
        type: 'quizzes',
      });
    }
    if (stats.totalQuizzesCompleted >= 5) {
      achievements.push({
        id: 'knowledge-seeker',
        title: 'Knowledge Seeker',
        description: 'Complete 5 quizzes',
        icon: '🎓',
        unlockedAt: now,
        type: 'quizzes',
      });
    }

    // Perfect score
    if (stats.completionRate === 100 && stats.totalQuizzesCompleted > 0) {
      achievements.push({
        id: 'perfectionist',
        title: 'Perfectionist',
        description: '100% quiz accuracy!',
        icon: '⭐',
        unlockedAt: now,
        type: 'quizzes',
      });
    }

    // Streak achievements
    if (stats.readingStreak >= 3) {
      achievements.push({
        id: 'three-day-streak',
        title: '3-Day Streak',
        description: 'Read for 3 days in a row',
        icon: '🔥',
        unlockedAt: now,
        type: 'streak',
      });
    }
    if (stats.readingStreak >= 7) {
      achievements.push({
        id: 'week-warrior',
        title: 'Week Warrior',
        description: 'Read for 7 days straight',
        icon: '💪',
        unlockedAt: now,
        type: 'streak',
      });
    }

    // Skill diversity
    if (stats.skillsEncountered.size >= 5) {
      achievements.push({
        id: 'skill-collector',
        title: 'Skill Collector',
        description: 'Encountered 5 different skills',
        icon: '🌟',
        unlockedAt: now,
        type: 'skills',
      });
    }
    if (stats.skillsEncountered.size >= 10) {
      achievements.push({
        id: 'skill-master',
        title: 'Skill Master',
        description: 'Encountered 10 different skills',
        icon: '💎',
        unlockedAt: now,
        type: 'skills',
      });
    }

    // Language explorer
    if (stats.languagesExplored.size >= 2) {
      achievements.push({
        id: 'bilingual',
        title: 'Bilingual Reader',
        description: 'Read stories in 2 languages',
        icon: '🌍',
        unlockedAt: now,
        type: 'languages',
      });
    }
    if (stats.languagesExplored.size >= 3) {
      achievements.push({
        id: 'polyglot',
        title: 'Polyglot',
        description: 'Read stories in 3+ languages',
        icon: '🌎',
        unlockedAt: now,
        type: 'languages',
      });
    }

    return achievements;
  }

  /**
   * Clear all progress data
   */
  static clearAllProgress(): void {
    const keys: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (
        key.startsWith('quiz-progress-') ||
        key.startsWith('story-view-') ||
        key.startsWith('story-metadata-') ||
        key.startsWith('story-progress-')
      )) {
        keys.push(key);
      }
    }

    keys.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Export progress as JSON
   */
  static exportProgress(): string {
    const stats = this.getProgressStats();
    return JSON.stringify({
      exportDate: new Date().toISOString(),
      stats: {
        ...stats,
        skillsEncountered: Array.from(stats.skillsEncountered),
        languagesExplored: Array.from(stats.languagesExplored),
        dailyActivity: Array.from(stats.dailyActivity.entries()),
      },
      allProgress: this.getAllProgress(),
    }, null, 2);
  }
}
