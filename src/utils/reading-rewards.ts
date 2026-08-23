/**
 * Reading Rewards System
 * Encourages children to read more through exciting rewards, streaks, and milestones
 */

import type { Locale } from './i18n';
import { starWallet } from './star-wallet';
import { confetti } from './confetti';
import { soundEffects } from './sound-effects';

export type RewardAnimationType = 'confetti' | 'fireworks' | 'sparkles' | 'rainbowConfetti' | 'hearts' | 'stars';
export type RewardType = 'stars' | 'badge' | 'unlock' | 'trophy' | 'character' | 'achievement';

export interface ReadingReward {
  type: RewardType;
  amount?: number;
  badgeId?: string;
  unlockId?: string;
  characterId?: string;
  message: Record<Locale, string>;
  animation: RewardAnimationType;
  sound?: 'applause' | 'cheer' | 'fanfare' | 'magic';
}

export interface ReadingStreak {
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string;
  totalDaysRead: number;
  streakBreaks: number;
  streakFreezeUsed: boolean;
}

export interface ReadingMilestone {
  id: string;
  type: 'story-count' | 'quiz-score' | 'streak' | 'skill' | 'time' | 'special';
  threshold: number;
  currentProgress: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: string;
  reward: ReadingReward;
  completed: boolean;
  completedAt?: number;
}

export interface ReadingSession {
  storyId: string;
  startTime: number;
  endTime?: number;
  quizScore?: number;
  totalQuestions?: number;
  readingMode: 'text' | 'interactive' | 'tts';
  language: string;
  skills: string[];
}

// ============================================
// REWARD AMOUNTS
// ============================================

export const STORY_REWARDS = {
  storyRead: 50,
  storyReread: 25,
  perfectQuiz: 100,
  goodQuiz: 50, // 80%+ correct
  completedQuiz: 25,
  fastReader: 75, // Completed in < 2 minutes
  slowReader: 100, // Took time to understand (> 5 minutes)
  interactiveStory: 60,
  ttsListened: 40,
};

export const STREAK_REWARDS = {
  3: { stars: 50, badge: 'three-day-streak' },
  7: { stars: 150, badge: 'week-warrior' },
  14: { stars: 300, badge: 'two-week-champion' },
  30: { stars: 1000, badge: 'monthly-legend', unlock: 'secret-story' },
  60: { stars: 2500, badge: 'sixty-day-master', unlock: 'character-designer' },
  90: { stars: 5000, badge: 'ninety-day-hero', unlock: 'animation-studio' },
  180: { stars: 10000, badge: 'half-year-scholar', trophy: 'platinum-reader' },
  365: { stars: 25000, badge: 'yearly-legend', trophy: 'diamond-reader', unlock: 'secret-ending' },
};

export const MILESTONE_REWARDS = {
  5: { stars: 100, badge: 'beginner-reader' },
  10: { stars: 200, badge: 'story-explorer' },
  15: { stars: 300, badge: 'book-lover' },
  20: { stars: 500, badge: 'reading-enthusiast', unlock: 'coloring-pages' },
  25: { stars: 1000, badge: 'master-reader', trophy: 'gold-trophy', unlock: 'all-games' },
};

// ============================================
// READING REWARDS MANAGER
// ============================================

export class ReadingRewardsManager {
  private storageKey = 'reading-rewards';
  private streakKey = 'reading-streak';
  private sessionKey = 'reading-session';
  private milestonesKey = 'reading-milestones';

  constructor() {
    this.initializeMilestones();
  }

  /**
   * Calculate rewards for completing a story
   */
  calculateStoryReward(
    storyId: string,
    quizScore: number,
    totalQuestions: number,
    readingTime: number,
    mode: 'text' | 'interactive' | 'tts'
  ): ReadingReward[] {
    const rewards: ReadingReward[] = [];

    // Base story completion reward
    const isReread = this.hasReadStory(storyId);
    const baseStars = isReread ? STORY_REWARDS.storyReread : STORY_REWARDS.storyRead;

    rewards.push({
      type: 'stars',
      amount: baseStars,
      message: {
        de: isReread ? `+${baseStars} Sterne für das Wiederlesen!` : `+${baseStars} Sterne für die Geschichte!`,
        ar: isReread ? `+${baseStars} نجمة لإعادة القراءة!` : `+${baseStars} نجمة للقصة!`,
        en: isReread ? `+${baseStars} stars for re-reading!` : `+${baseStars} stars for the story!`,
        tr: isReread ? `Tekrar okuma için +${baseStars} yıldız!` : `Hikaye için +${baseStars} yıldız!`,
        ur: isReread ? `دوبارہ پڑھنے کے لیے +${baseStars} ستارے!` : `کہانی کے لیے +${baseStars} ستارے!`,
      },
      animation: 'confetti',
      sound: 'applause',
    });

    // Quiz performance rewards
    if (totalQuestions > 0) {
      const percentage = (quizScore / totalQuestions) * 100;

      if (percentage === 100) {
        rewards.push({
          type: 'stars',
          amount: STORY_REWARDS.perfectQuiz,
          message: {
            de: `🌟 Perfekt! +${STORY_REWARDS.perfectQuiz} Sterne!`,
            ar: `🌟 مثالي! +${STORY_REWARDS.perfectQuiz} نجمة!`,
            en: `🌟 Perfect! +${STORY_REWARDS.perfectQuiz} stars!`,
            tr: `🌟 Mükemmel! +${STORY_REWARDS.perfectQuiz} yıldız!`,
            ur: `🌟 کامل! +${STORY_REWARDS.perfectQuiz} ستارے!`,
          },
          animation: 'fireworks',
          sound: 'fanfare',
        });
      } else if (percentage >= 80) {
        rewards.push({
          type: 'stars',
          amount: STORY_REWARDS.goodQuiz,
          message: {
            de: `Sehr gut! +${STORY_REWARDS.goodQuiz} Sterne!`,
            ar: `جيد جدًا! +${STORY_REWARDS.goodQuiz} نجمة!`,
            en: `Very good! +${STORY_REWARDS.goodQuiz} stars!`,
            tr: `Çok iyi! +${STORY_REWARDS.goodQuiz} yıldız!`,
            ur: `بہت اچھا! +${STORY_REWARDS.goodQuiz} ستارے!`,
          },
          animation: 'sparkles',
          sound: 'cheer',
        });
      } else if (quizScore > 0) {
        rewards.push({
          type: 'stars',
          amount: STORY_REWARDS.completedQuiz,
          message: {
            de: `Gut gemacht! +${STORY_REWARDS.completedQuiz} Sterne!`,
            ar: `أحسنت! +${STORY_REWARDS.completedQuiz} نجمة!`,
            en: `Well done! +${STORY_REWARDS.completedQuiz} stars!`,
            tr: `Aferin! +${STORY_REWARDS.completedQuiz} yıldız!`,
            ur: `شاباش! +${STORY_REWARDS.completedQuiz} ستارے!`,
          },
          animation: 'confetti',
        });
      }
    }

    // Reading speed rewards
    if (readingTime < 120) {
      rewards.push({
        type: 'stars',
        amount: STORY_REWARDS.fastReader,
        message: {
          de: `⚡ Schnellleser! +${STORY_REWARDS.fastReader} Sterne!`,
          ar: `⚡ قارئ سريع! +${STORY_REWARDS.fastReader} نجمة!`,
          en: `⚡ Speed reader! +${STORY_REWARDS.fastReader} stars!`,
          tr: `⚡ Hızlı okuyucu! +${STORY_REWARDS.fastReader} yıldız!`,
          ur: `⚡ تیز پڑھنے والا! +${STORY_REWARDS.fastReader} ستارے!`,
        },
        animation: 'sparkles',
      });
    } else if (readingTime > 300) {
      rewards.push({
        type: 'stars',
        amount: STORY_REWARDS.slowReader,
        message: {
          de: `📖 Gründlich gelesen! +${STORY_REWARDS.slowReader} Sterne!`,
          ar: `📖 قراءة دقيقة! +${STORY_REWARDS.slowReader} نجمة!`,
          en: `📖 Thorough reader! +${STORY_REWARDS.slowReader} stars!`,
          tr: `📖 Dikkatli okuyucu! +${STORY_REWARDS.slowReader} yıldız!`,
          ur: `📖 احتیاط سے پڑھنے والا! +${STORY_REWARDS.slowReader} ستارے!`,
        },
        animation: 'hearts',
      });
    }

    // Mode-based rewards
    if (mode === 'interactive') {
      rewards.push({
        type: 'stars',
        amount: STORY_REWARDS.interactiveStory,
        message: {
          de: `🎮 Interaktiv! +${STORY_REWARDS.interactiveStory} Sterne!`,
          ar: `🎮 تفاعلي! +${STORY_REWARDS.interactiveStory} نجمة!`,
          en: `🎮 Interactive! +${STORY_REWARDS.interactiveStory} stars!`,
          tr: `🎮 Etkileşimli! +${STORY_REWARDS.interactiveStory} yıldız!`,
          ur: `🎮 انٹرایکٹو! +${STORY_REWARDS.interactiveStory} ستارے!`,
        },
        animation: 'rainbowConfetti',
      });
    } else if (mode === 'tts') {
      rewards.push({
        type: 'stars',
        amount: STORY_REWARDS.ttsListened,
        message: {
          de: `🔊 Zugehört! +${STORY_REWARDS.ttsListened} Sterne!`,
          ar: `🔊 استماع! +${STORY_REWARDS.ttsListened} نجمة!`,
          en: `🔊 Listened! +${STORY_REWARDS.ttsListened} stars!`,
          tr: `🔊 Dinlendi! +${STORY_REWARDS.ttsListened} yıldız!`,
          ur: `🔊 سنا! +${STORY_REWARDS.ttsListened} ستارے!`,
        },
        animation: 'sparkles',
      });
    }

    // Award all star rewards
    rewards.forEach(reward => {
      if (reward.type === 'stars' && reward.amount) {
        starWallet.earnStars('story-read', reward.amount);
      }
    });

    // Save story completion
    this.saveStoryCompletion(storyId, quizScore, totalQuestions, readingTime, mode);

    return rewards;
  }

  /**
   * Check and update reading streak
   */
  checkStreakRewards(): ReadingReward[] {
    const streak = this.getStreak();
    const today = new Date().toISOString().split('T')[0];

    // Check if already read today
    if (streak.lastReadDate === today) {
      return []; // Already updated streak today
    }

    // Update streak
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastReadDate === yesterdayStr) {
      // Continue streak
      streak.currentStreak++;
    } else if (streak.lastReadDate !== today) {
      // Streak broken
      if (streak.currentStreak > streak.longestStreak) {
        streak.longestStreak = streak.currentStreak;
      }
      streak.streakBreaks++;
      streak.currentStreak = 1;
    }

    streak.lastReadDate = today;
    streak.totalDaysRead++;
    this.saveStreak(streak);

    // Check for streak milestone rewards
    const rewards: ReadingReward[] = [];
    const streakReward = STREAK_REWARDS[streak.currentStreak as keyof typeof STREAK_REWARDS];

    if (streakReward) {
      rewards.push({
        type: 'stars',
        amount: streakReward.stars,
        message: {
          de: `🔥 ${streak.currentStreak} Tage Serie! +${streakReward.stars} Sterne!`,
          ar: `🔥 سلسلة ${streak.currentStreak} يوم! +${streakReward.stars} نجمة!`,
          en: `🔥 ${streak.currentStreak} day streak! +${streakReward.stars} stars!`,
          tr: `🔥 ${streak.currentStreak} günlük seri! +${streakReward.stars} yıldız!`,
          ur: `🔥 ${streak.currentStreak} دن کا سلسلہ! +${streakReward.stars} ستارے!`,
        },
        animation: 'fireworks',
        sound: 'fanfare',
      });

      starWallet.earnStars('streak-milestone', streakReward.stars);

      if (streakReward.badge) {
        rewards.push({
          type: 'badge',
          badgeId: streakReward.badge,
          message: {
            de: `🏆 Abzeichen freigeschaltet: ${streakReward.badge}`,
            ar: `🏆 تم فتح الشارة: ${streakReward.badge}`,
            en: `🏆 Badge unlocked: ${streakReward.badge}`,
            tr: `🏆 Rozet kilidi açıldı: ${streakReward.badge}`,
            ur: `🏆 بیج کھل گیا: ${streakReward.badge}`,
          },
          animation: 'rainbowConfetti',
          sound: 'fanfare',
        });
      }

      if (streakReward.unlock) {
        rewards.push({
          type: 'unlock',
          unlockId: streakReward.unlock,
          message: {
            de: `🎁 Neu freigeschaltet: ${streakReward.unlock}`,
            ar: `🎁 جديد تم فتحه: ${streakReward.unlock}`,
            en: `🎁 Unlocked: ${streakReward.unlock}`,
            tr: `🎁 Kilidi açıldı: ${streakReward.unlock}`,
            ur: `🎁 کھل گیا: ${streakReward.unlock}`,
          },
          animation: 'fireworks',
          sound: 'magic',
        });
      }

      if (streakReward.trophy) {
        rewards.push({
          type: 'trophy',
          unlockId: streakReward.trophy,
          message: {
            de: `🏆 Trophäe verdient: ${streakReward.trophy}`,
            ar: `🏆 حصلت على الكأس: ${streakReward.trophy}`,
            en: `🏆 Trophy earned: ${streakReward.trophy}`,
            tr: `🏆 Kupa kazanıldı: ${streakReward.trophy}`,
            ur: `🏆 ٹرافی ملی: ${streakReward.trophy}`,
          },
          animation: 'fireworks',
          sound: 'fanfare',
        });
      }
    }

    return rewards;
  }

  /**
   * Check milestone rewards
   */
  checkMilestoneRewards(totalStoriesRead: number): ReadingReward[] {
    const rewards: ReadingReward[] = [];
    const milestoneReward = MILESTONE_REWARDS[totalStoriesRead as keyof typeof MILESTONE_REWARDS];

    if (milestoneReward) {
      rewards.push({
        type: 'stars',
        amount: milestoneReward.stars,
        message: {
          de: `📚 ${totalStoriesRead} Geschichten gelesen! +${milestoneReward.stars} Sterne!`,
          ar: `📚 قرأت ${totalStoriesRead} قصة! +${milestoneReward.stars} نجمة!`,
          en: `📚 ${totalStoriesRead} stories read! +${milestoneReward.stars} stars!`,
          tr: `📚 ${totalStoriesRead} hikaye okundu! +${milestoneReward.stars} yıldız!`,
          ur: `📚 ${totalStoriesRead} کہانیاں پڑھیں! +${milestoneReward.stars} ستارے!`,
        },
        animation: 'fireworks',
        sound: 'fanfare',
      });

      starWallet.earnStars('achievement-unlock', milestoneReward.stars);

      if (milestoneReward.badge) {
        rewards.push({
          type: 'badge',
          badgeId: milestoneReward.badge,
          message: {
            de: `🏆 Abzeichen: ${milestoneReward.badge}`,
            ar: `🏆 شارة: ${milestoneReward.badge}`,
            en: `🏆 Badge: ${milestoneReward.badge}`,
            tr: `🏆 Rozet: ${milestoneReward.badge}`,
            ur: `🏆 بیج: ${milestoneReward.badge}`,
          },
          animation: 'rainbowConfetti',
          sound: 'fanfare',
        });
      }

      if (milestoneReward.unlock) {
        rewards.push({
          type: 'unlock',
          unlockId: milestoneReward.unlock,
          message: {
            de: `🎁 Freigeschaltet: ${milestoneReward.unlock}`,
            ar: `🎁 تم فتح: ${milestoneReward.unlock}`,
            en: `🎁 Unlocked: ${milestoneReward.unlock}`,
            tr: `🎁 Açıldı: ${milestoneReward.unlock}`,
            ur: `🎁 کھل گیا: ${milestoneReward.unlock}`,
          },
          animation: 'fireworks',
          sound: 'magic',
        });
      }

      if (milestoneReward.trophy) {
        rewards.push({
          type: 'trophy',
          unlockId: milestoneReward.trophy,
          message: {
            de: `🏆 Trophäe: ${milestoneReward.trophy}`,
            ar: `🏆 كأس: ${milestoneReward.trophy}`,
            en: `🏆 Trophy: ${milestoneReward.trophy}`,
            tr: `🏆 Kupa: ${milestoneReward.trophy}`,
            ur: `🏆 ٹرافی: ${milestoneReward.trophy}`,
          },
          animation: 'fireworks',
          sound: 'fanfare',
        });
      }
    }

    return rewards;
  }

  /**
   * Get current reading streak
   */
  getStreak(): ReadingStreak {
    if (typeof window === 'undefined') {
      return this.getDefaultStreak();
    }

    const saved = localStorage.getItem(this.streakKey);
    if (!saved) {
      return this.getDefaultStreak();
    }

    try {
      return JSON.parse(saved);
    } catch {
      return this.getDefaultStreak();
    }
  }

  private getDefaultStreak(): ReadingStreak {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastReadDate: '',
      totalDaysRead: 0,
      streakBreaks: 0,
      streakFreezeUsed: false,
    };
  }

  private saveStreak(streak: ReadingStreak): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.streakKey, JSON.stringify(streak));

    // Dispatch event
    window.dispatchEvent(new CustomEvent('reading-streak-updated', { detail: streak }));
  }

  /**
   * Check if story has been read before
   */
  private hasReadStory(storyId: string): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(`story-read-${storyId}`) !== null;
  }

  /**
   * Save story completion
   */
  private saveStoryCompletion(
    storyId: string,
    quizScore: number,
    totalQuestions: number,
    readingTime: number,
    mode: string
  ): void {
    if (typeof window === 'undefined') return;

    const completion = {
      storyId,
      quizScore,
      totalQuestions,
      readingTime,
      mode,
      completedAt: Date.now(),
    };

    localStorage.setItem(`story-read-${storyId}`, JSON.stringify(completion));
  }

  /**
   * Get total stories read
   */
  getTotalStoriesRead(): number {
    if (typeof window === 'undefined') return 0;

    let count = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('story-read-')) {
        count++;
      }
    }
    return count;
  }

  /**
   * Initialize milestone tracking
   */
  private initializeMilestones(): void {
    // Milestones are checked dynamically based on progress
  }

  /**
   * Play reward animation and sound
   */
  playRewardEffects(reward: ReadingReward): void {
    if (typeof window === 'undefined') return;

    // Animation
    switch (reward.animation) {
      case 'confetti':
        confetti.standard();
        break;
      case 'fireworks':
        confetti.fireworks(3, 500);
        break;
      case 'sparkles':
        confetti.sparkle();
        break;
      case 'rainbowConfetti':
        confetti.rainbow();
        break;
      case 'hearts':
        confetti.hearts();
        break;
      case 'stars':
        confetti.stars();
        break;
    }

    // Sound
    if (reward.sound) {
      switch (reward.sound) {
        case 'applause':
          soundEffects.playSuccess();
          break;
        case 'cheer':
          soundEffects.playSuccess();
          break;
        case 'fanfare':
          soundEffects.playAchievement();
          break;
        case 'magic':
          soundEffects.playUnlock();
          break;
      }
    }
  }

  /**
   * Get reading statistics
   */
  getReadingStats(): {
    totalStoriesRead: number;
    currentStreak: number;
    longestStreak: number;
    totalStarsEarned: number;
    averageQuizScore: number;
    favoriteReadingTime: string;
  } {
    const totalStories = this.getTotalStoriesRead();
    const streak = this.getStreak();
    const starStats = starWallet.getStats();

    return {
      totalStoriesRead: totalStories,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalStarsEarned: starStats.totalEarned,
      averageQuizScore: 0, // Calculate from stored data
      favoriteReadingTime: 'morning', // Calculate from timestamps
    };
  }

  /**
   * Reset all reading data (for testing)
   */
  reset(): void {
    if (typeof window === 'undefined') return;

    // Clear all story completions
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('story-read-')) {
        keys.push(key);
      }
    }
    keys.forEach(key => localStorage.removeItem(key));

    // Reset streak
    localStorage.removeItem(this.streakKey);
  }
}

// Global instance
export const readingRewards = new ReadingRewardsManager();
