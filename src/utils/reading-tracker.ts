/**
 * Reading Tracker Utility
 * Tracks stories started, in-progress, and completed
 * Integrates with existing progress-tracker and daily-challenges systems
 */

import { ProgressTracker, type StoryProgress } from './progress-tracker';
import { dailyChallengeManager } from './daily-challenges';

export interface ReadingHistory {
  storyId: string;
  status: 'started' | 'in-progress' | 'completed';
  startedAt: number;
  lastAccessedAt: number;
  completedAt?: number;
  progress: number; // 0-100
}

export class ReadingTrackerUtil {
  private static STORAGE_KEY = 'reading-history';

  /**
   * Mark a story as started
   */
  static markStoryStarted(storyId: string): void {
    const history = this.getHistory();
    const existing = history.find(h => h.storyId === storyId);

    if (!existing) {
      history.push({
        storyId,
        status: 'started',
        startedAt: Date.now(),
        lastAccessedAt: Date.now(),
        progress: 0,
      });
      this.saveHistory(history);
    }

    // Track view in existing system
    ProgressTracker.trackStoryView(storyId);
  }

  /**
   * Update story progress
   */
  static updateProgress(storyId: string, progress: number): void {
    const history = this.getHistory();
    const story = history.find(h => h.storyId === storyId);

    if (story) {
      story.progress = Math.min(100, Math.max(0, progress));
      story.status = progress >= 100 ? 'completed' : progress > 0 ? 'in-progress' : 'started';
      story.lastAccessedAt = Date.now();

      if (progress >= 100 && !story.completedAt) {
        story.completedAt = Date.now();
      }

      this.saveHistory(history);
    } else {
      this.markStoryStarted(storyId);
      this.updateProgress(storyId, progress);
    }
  }

  /**
   * Mark a story as completed
   */
  static markStoryCompleted(storyId: string): void {
    this.updateProgress(storyId, 100);

    // Update daily activity for streak tracking
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`daily-activity-${today}`, 'true');
  }

  /**
   * Get reading history
   */
  static getHistory(): ReadingHistory[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Save reading history
   */
  private static saveHistory(history: ReadingHistory[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
  }

  /**
   * Get stories in progress (0 < progress < 100)
   */
  static getInProgressStories(): ReadingHistory[] {
    return this.getHistory()
      .filter(h => h.progress > 0 && h.progress < 100)
      .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
      .slice(0, 3); // Top 3 most recent
  }

  /**
   * Get completed stories count
   */
  static getCompletedCount(): number {
    return this.getHistory().filter(h => h.status === 'completed').length;
  }

  /**
   * Get total stories started
   */
  static getTotalStarted(): number {
    return this.getHistory().length;
  }

  /**
   * Calculate reading streak (consecutive days with activity)
   */
  static getStreak(): number {
    const streak = dailyChallengeManager.getStreak();
    return streak.currentStreak;
  }

  /**
   * Get today's reading activity
   */
  static getTodayActivity(): {
    storiesRead: number;
    starsEarned: number;
  } {
    const today = new Date().toISOString().split('T')[0];
    const history = this.getHistory();
    const todayStories = history.filter(h => {
      const storyDate = new Date(h.lastAccessedAt).toISOString().split('T')[0];
      return storyDate === today;
    });

    return {
      storiesRead: todayStories.length,
      starsEarned: todayStories.filter(h => h.status === 'completed').length * 10,
    };
  }

  /**
   * Get next milestone info
   */
  static getNextMilestone(): { target: number; current: number; remaining: number } {
    const completed = this.getCompletedCount();
    const milestones = [5, 10, 15, 20, 25, 30, 40, 50];
    const nextMilestone = milestones.find(m => m > completed) || 100;

    return {
      target: nextMilestone,
      current: completed,
      remaining: nextMilestone - completed,
    };
  }

  /**
   * Get reading stats for dashboard
   */
  static getDashboardStats() {
    const progressStats = ProgressTracker.getProgressStats();
    const streak = this.getStreak();
    const todayActivity = this.getTodayActivity();
    const milestone = this.getNextMilestone();
    const inProgress = this.getInProgressStories();
    const completed = this.getCompletedCount();
    const totalStars = dailyChallengeManager.getTotalStars();

    return {
      totalStories: progressStats.totalStoriesRead,
      completedStories: completed,
      inProgressStories: inProgress,
      readingStreak: streak,
      todayStoriesRead: todayActivity.storiesRead,
      todayStarsEarned: todayActivity.starsEarned,
      totalStars,
      nextMilestone: milestone,
      recentStories: progressStats.recentStories,
      achievements: progressStats.achievements,
    };
  }

  /**
   * Clear all reading history
   */
  static clearHistory(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
