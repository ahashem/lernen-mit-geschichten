/**
 * Daily Challenge & Streak System
 * Generates deterministic daily challenges and tracks user streaks
 */

import type { Locale } from './i18n';

export type ChallengeType =
  | 'reading'
  | 'quiz-master'
  | 'explorer'
  | 'speed-reader'
  | 'collection'
  | 'social'
  | 'creative'
  | 'vocabulary'
  | 'skill-focus'
  | 'character-fan';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  type: ChallengeType;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  goal: number; // Target value to complete
  current: number; // Current progress
  completed: boolean;
  reward: number; // Stars earned
  difficulty: ChallengeDifficulty;
  skillFocus?: string; // For skill-focus challenges
  characterFocus?: string; // For character-fan challenges
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  freezeItemsAvailable: number;
  freezeActive: boolean;
  streakMilestones: number[]; // Days achieved: [7, 14, 30, 60, 100]
  totalChallengesCompleted: number;
  totalStarsEarned: number;
}

export interface WeeklyChallenge {
  id: string;
  weekStart: string; // YYYY-MM-DD (Monday)
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  tasks: {
    description: Record<Locale, string>;
    completed: boolean;
  }[];
  reward: number;
  completed: boolean;
}

// Challenge type definitions with translations
const CHALLENGE_TYPES: Record<
  ChallengeType,
  {
    baseReward: number;
    difficulty: Record<ChallengeDifficulty, { goal: number; multiplier: number }>;
  }
> = {
  reading: {
    baseReward: 5,
    difficulty: {
      easy: { goal: 1, multiplier: 1 },
      medium: { goal: 2, multiplier: 1.5 },
      hard: { goal: 3, multiplier: 2 },
    },
  },
  'quiz-master': {
    baseReward: 10,
    difficulty: {
      easy: { goal: 1, multiplier: 1 },
      medium: { goal: 3, multiplier: 1.5 },
      hard: { goal: 5, multiplier: 2 },
    },
  },
  explorer: {
    baseReward: 8,
    difficulty: {
      easy: { goal: 1, multiplier: 1 },
      medium: { goal: 2, multiplier: 1.5 },
      hard: { goal: 3, multiplier: 2 },
    },
  },
  'speed-reader': {
    baseReward: 12,
    difficulty: {
      easy: { goal: 5, multiplier: 1 },
      medium: { goal: 3, multiplier: 1.5 },
      hard: { goal: 2, multiplier: 2 },
    },
  },
  collection: {
    baseReward: 15,
    difficulty: {
      easy: { goal: 3, multiplier: 1 },
      medium: { goal: 5, multiplier: 1.5 },
      hard: { goal: 8, multiplier: 2 },
    },
  },
  social: {
    baseReward: 10,
    difficulty: {
      easy: { goal: 1, multiplier: 1 },
      medium: { goal: 2, multiplier: 1.5 },
      hard: { goal: 3, multiplier: 2 },
    },
  },
  creative: {
    baseReward: 20,
    difficulty: {
      easy: { goal: 1, multiplier: 1 },
      medium: { goal: 2, multiplier: 1.5 },
      hard: { goal: 3, multiplier: 2 },
    },
  },
  vocabulary: {
    baseReward: 8,
    difficulty: {
      easy: { goal: 5, multiplier: 1 },
      medium: { goal: 10, multiplier: 1.5 },
      hard: { goal: 15, multiplier: 2 },
    },
  },
  'skill-focus': {
    baseReward: 10,
    difficulty: {
      easy: { goal: 1, multiplier: 1 },
      medium: { goal: 2, multiplier: 1.5 },
      hard: { goal: 3, multiplier: 2 },
    },
  },
  'character-fan': {
    baseReward: 12,
    difficulty: {
      easy: { goal: 2, multiplier: 1 },
      medium: { goal: 3, multiplier: 1.5 },
      hard: { goal: 4, multiplier: 2 },
    },
  },
};

// Challenge templates with multilingual support
const CHALLENGE_TEMPLATES: Record<
  ChallengeType,
  {
    title: Record<Locale, string>;
    description: (goal: number, extra?: string) => Record<Locale, string>;
  }
> = {
  reading: {
    title: {
      de: 'Lesefreund',
      ar: 'صديق القراءة',
      en: 'Reading Buddy',
      tr: 'Okuma Dostu',
      ur: 'پڑھنے کا دوست',
    },
    description: (goal) => ({
      de: `Lies ${goal} ${goal === 1 ? 'Geschichte' : 'Geschichten'} heute`,
      ar: `اقرأ ${goal} ${goal === 1 ? 'قصة' : 'قصص'} اليوم`,
      en: `Read ${goal} ${goal === 1 ? 'story' : 'stories'} today`,
      tr: `Bugün ${goal} ${goal === 1 ? 'hikaye' : 'hikaye'} oku`,
      ur: `آج ${goal} ${goal === 1 ? 'کہانی' : 'کہانیاں'} پڑھیں`,
    }),
  },
  'quiz-master': {
    title: {
      de: 'Quiz-Champion',
      ar: 'بطل الاختبار',
      en: 'Quiz Champion',
      tr: 'Test Şampiyonu',
      ur: 'کوئز چیمپئن',
    },
    description: (goal) => ({
      de: `Schließe ${goal} ${goal === 1 ? 'Quiz' : 'Quizze'} perfekt ab`,
      ar: `أكمل ${goal} ${goal === 1 ? 'اختبار' : 'اختبارات'} بشكل مثالي`,
      en: `Complete ${goal} ${goal === 1 ? 'quiz' : 'quizzes'} perfectly`,
      tr: `${goal} ${goal === 1 ? 'testi' : 'testi'} kusursuz tamamla`,
      ur: `${goal} ${goal === 1 ? 'کوئز' : 'کوئز'} مکمل طور پر مکمل کریں`,
    }),
  },
  explorer: {
    title: {
      de: 'Sprachforscher',
      ar: 'مستكشف اللغات',
      en: 'Language Explorer',
      tr: 'Dil Kaşifi',
      ur: 'زبان کا کھوجی',
    },
    description: (goal) => ({
      de: `Lies eine Geschichte in ${goal === 1 ? 'einer neuen' : goal} Sprache${goal > 1 ? 'n' : ''}`,
      ar: `اقرأ قصة في ${goal === 1 ? 'لغة جديدة' : `${goal} لغات`}`,
      en: `Read a story in ${goal === 1 ? 'a new' : goal} language${goal > 1 ? 's' : ''}`,
      tr: `${goal === 1 ? 'Yeni bir' : goal} dil${goal > 1 ? 'de' : 'de'} hikaye oku`,
      ur: `${goal === 1 ? 'ایک نئی' : goal} زبان میں کہانی پڑھیں`,
    }),
  },
  'speed-reader': {
    title: {
      de: 'Blitzleser',
      ar: 'القارئ السريع',
      en: 'Speed Reader',
      tr: 'Hızlı Okuyucu',
      ur: 'تیز پڑھنے والا',
    },
    description: (goal) => ({
      de: `Beende eine Geschichte in unter ${goal} Minuten`,
      ar: `أنهِ قصة في أقل من ${goal} دقائق`,
      en: `Finish a story in under ${goal} minutes`,
      tr: `${goal} dakikadan kısa sürede hikaye bitir`,
      ur: `${goal} منٹ سے کم میں کہانی ختم کریں`,
    }),
  },
  collection: {
    title: {
      de: 'Schatzjäger',
      ar: 'صائد الكنوز',
      en: 'Treasure Hunter',
      tr: 'Hazine Avcısı',
      ur: 'خزانہ تلاش کرنے والا',
    },
    description: (goal) => ({
      de: `Finde ${goal} versteckte Details in Geschichten`,
      ar: `اعثر على ${goal} تفاصيل مخفية في القصص`,
      en: `Find ${goal} hidden details in stories`,
      tr: `Hikayelerde ${goal} gizli ayrıntı bul`,
      ur: `کہانیوں میں ${goal} چھپی تفصیلات تلاش کریں`,
    }),
  },
  social: {
    title: {
      de: 'Gemeinsam Lesen',
      ar: 'القراءة معًا',
      en: 'Read Together',
      tr: 'Birlikte Oku',
      ur: 'مل کر پڑھیں',
    },
    description: (goal) => ({
      de: `Lies ${goal} ${goal === 1 ? 'Geschichte' : 'Geschichten'} mit jemandem`,
      ar: `اقرأ ${goal} ${goal === 1 ? 'قصة' : 'قصص'} مع شخص آخر`,
      en: `Read ${goal} ${goal === 1 ? 'story' : 'stories'} with someone`,
      tr: `Biriyle ${goal} ${goal === 1 ? 'hikaye' : 'hikaye'} oku`,
      ur: `کسی کے ساتھ ${goal} ${goal === 1 ? 'کہانی' : 'کہانیاں'} پڑھیں`,
    }),
  },
  creative: {
    title: {
      de: 'Kreativer Geist',
      ar: 'الروح الإبداعية',
      en: 'Creative Spirit',
      tr: 'Yaratıcı Ruh',
      ur: 'تخلیقی روح',
    },
    description: (goal) => ({
      de: `Erstelle ${goal} eigene ${goal === 1 ? 'Geschichte' : 'Geschichten'}`,
      ar: `أنشئ ${goal} ${goal === 1 ? 'قصة خاصة' : 'قصص خاصة'}`,
      en: `Create ${goal} own ${goal === 1 ? 'story' : 'stories'}`,
      tr: `${goal} kendi ${goal === 1 ? 'hikayeni' : 'hikayeni'} oluştur`,
      ur: `${goal} اپنی ${goal === 1 ? 'کہانی' : 'کہانیاں'} بنائیں`,
    }),
  },
  vocabulary: {
    title: {
      de: 'Wortschatzsammler',
      ar: 'جامع المفردات',
      en: 'Word Collector',
      tr: 'Kelime Toplayıcı',
      ur: 'الفاظ جمع کرنے والا',
    },
    description: (goal) => ({
      de: `Lerne ${goal} neue Wörter`,
      ar: `تعلم ${goal} كلمات جديدة`,
      en: `Learn ${goal} new words`,
      tr: `${goal} yeni kelime öğren`,
      ur: `${goal} نئے الفاظ سیکھیں`,
    }),
  },
  'skill-focus': {
    title: {
      de: 'Fähigkeiten-Fokus',
      ar: 'التركيز على المهارات',
      en: 'Skill Focus',
      tr: 'Beceri Odağı',
      ur: 'مہارت کی توجہ',
    },
    description: (goal, skillName) => ({
      de: `Lies ${goal} ${goal === 1 ? 'Geschichte' : 'Geschichten'} über ${skillName || 'eine Fähigkeit'}`,
      ar: `اقرأ ${goal} ${goal === 1 ? 'قصة' : 'قصص'} حول ${skillName || 'مهارة'}`,
      en: `Read ${goal} ${goal === 1 ? 'story' : 'stories'} about ${skillName || 'a skill'}`,
      tr: `${skillName || 'bir beceri'} hakkında ${goal} ${goal === 1 ? 'hikaye' : 'hikaye'} oku`,
      ur: `${skillName || 'ایک مہارت'} کے بارے میں ${goal} ${goal === 1 ? 'کہانی' : 'کہانیاں'} پڑھیں`,
    }),
  },
  'character-fan': {
    title: {
      de: 'Charaktersammler',
      ar: 'جامع الشخصيات',
      en: 'Character Collector',
      tr: 'Karakter Toplayıcı',
      ur: 'کردار جمع کرنے والا',
    },
    description: (goal, characterName) => ({
      de: `Lies ${goal} ${characterName || 'Charakter'}-Geschichten`,
      ar: `اقرأ ${goal} قصص ${characterName || 'الشخصية'}`,
      en: `Read ${goal} ${characterName || 'character'} stories`,
      tr: `${goal} ${characterName || 'karakter'} hikayesi oku`,
      ur: `${goal} ${characterName || 'کردار'} کی کہانیاں پڑھیں`,
    }),
  },
};

export class DailyChallengeManager {
  private storageKey = 'daily-challenge';
  private streakKey = 'challenge-streak';
  private weeklyKey = 'weekly-challenge';

  /**
   * Generate deterministic challenge based on date
   * Same date always generates same challenge
   */
  generateDailyChallenge(date: Date = new Date()): DailyChallenge {
    const dateStr = this.formatDate(date);
    const seed = this.dateSeed(date);

    // Determine difficulty (easier on weekends)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const difficulty: ChallengeDifficulty = isWeekend ? 'easy' : seed % 3 === 0 ? 'hard' : 'medium';

    // Rotate through challenge types
    const challengeTypes = Object.keys(CHALLENGE_TYPES) as ChallengeType[];
    const typeIndex = seed % challengeTypes.length;
    const type = challengeTypes[typeIndex];

    // Get configuration
    const config = CHALLENGE_TYPES[type];
    const difficultyConfig = config.difficulty[difficulty];
    const template = CHALLENGE_TEMPLATES[type];

    // Special handling for skill-focus and character-fan
    let skillFocus: string | undefined;
    let characterFocus: string | undefined;
    let extraParam: string | undefined;

    if (type === 'skill-focus') {
      const skills = ['empathy', 'patience', 'cooperation', 'honesty', 'problem-solving'];
      skillFocus = skills[seed % skills.length];
      extraParam = skillFocus;
    } else if (type === 'character-fan') {
      const characters = ['Bruno', 'Fritz', 'Lina', 'Tobi', 'Mila'];
      characterFocus = characters[seed % characters.length];
      extraParam = characterFocus;
    }

    // Calculate reward
    const reward = Math.round(config.baseReward * difficultyConfig.multiplier);

    // Load saved progress
    const saved = this.loadChallenge();
    const current = saved?.date === dateStr ? saved.current : 0;
    const completed = saved?.date === dateStr ? saved.completed : false;

    return {
      id: `challenge-${dateStr}`,
      date: dateStr,
      type,
      title: template.title,
      description: template.description(difficultyConfig.goal, extraParam),
      goal: difficultyConfig.goal,
      current,
      completed,
      reward,
      difficulty,
      skillFocus,
      characterFocus,
    };
  }

  /**
   * Generate weekly challenge
   */
  generateWeeklyChallenge(date: Date = new Date()): WeeklyChallenge {
    const weekStart = this.getWeekStart(date);
    const weekStartStr = this.formatDate(weekStart);
    const seed = this.dateSeed(weekStart);

    const weeklyTypes = [
      {
        title: {
          de: 'Vielfältiger Leser',
          ar: 'قارئ متنوع',
          en: 'Diverse Reader',
          tr: 'Çeşitli Okuyucu',
          ur: 'متنوع قاری',
        },
        description: {
          de: 'Lies verschiedene Arten von Geschichten',
          ar: 'اقرأ أنواعًا مختلفة من القصص',
          en: 'Read different types of stories',
          tr: 'Farklı türde hikayeler oku',
          ur: 'مختلف قسم کی کہانیاں پڑھیں',
        },
        tasks: [
          {
            description: {
              de: 'Lies 5 verschiedene Charaktergeschichten',
              ar: 'اقرأ 5 قصص شخصيات مختلفة',
              en: 'Read 5 different character stories',
              tr: '5 farklı karakter hikayesi oku',
              ur: '5 مختلف کرداروں کی کہانیاں پڑھیں',
            },
            completed: false,
          },
          {
            description: {
              de: 'Schließe alle Quizze perfekt ab',
              ar: 'أكمل جميع الاختبارات بشكل مثالي',
              en: 'Complete all quizzes perfectly',
              tr: 'Tüm testleri kusursuz tamamla',
              ur: 'تمام کوئز مکمل طور پر مکمل کریں',
            },
            completed: false,
          },
          {
            description: {
              de: 'Lies in mindestens 2 Sprachen',
              ar: 'اقرأ بلغتين على الأقل',
              en: 'Read in at least 2 languages',
              tr: 'En az 2 dilde oku',
              ur: 'کم از کم 2 زبانوں میں پڑھیں',
            },
            completed: false,
          },
        ],
        reward: 25,
      },
      {
        title: {
          de: 'Quiz-Woche',
          ar: 'أسبوع الاختبار',
          en: 'Quiz Week',
          tr: 'Test Haftası',
          ur: 'کوئز ہفتہ',
        },
        description: {
          de: 'Werde zum Quiz-Meister',
          ar: 'كن سيد الاختبار',
          en: 'Become a quiz master',
          tr: 'Test ustası ol',
          ur: 'کوئز ماسٹر بنیں',
        },
        tasks: [
          {
            description: {
              de: 'Beantworte 50 Fragen richtig',
              ar: 'أجب على 50 سؤالاً بشكل صحيح',
              en: 'Answer 50 questions correctly',
              tr: '50 soruyu doğru cevapla',
              ur: '50 سوالات کے صحیح جوابات دیں',
            },
            completed: false,
          },
          {
            description: {
              de: 'Erreiche 100% in 3 Quizzen',
              ar: 'احصل على 100% في 3 اختبارات',
              en: 'Get 100% in 3 quizzes',
              tr: '3 testte %100 al',
              ur: '3 کوئز میں 100% حاصل کریں',
            },
            completed: false,
          },
        ],
        reward: 30,
      },
    ];

    const weeklyType = weeklyTypes[seed % weeklyTypes.length];
    const saved = this.loadWeeklyChallenge();

    return {
      id: `weekly-${weekStartStr}`,
      weekStart: weekStartStr,
      ...weeklyType,
      tasks:
        saved?.weekStart === weekStartStr
          ? saved.tasks
          : weeklyType.tasks.map((t) => ({ ...t, completed: false })),
      completed: saved?.weekStart === weekStartStr ? saved.completed : false,
    };
  }

  /**
   * Update challenge progress
   */
  updateProgress(amount: number = 1): boolean {
    const challenge = this.generateDailyChallenge();
    if (challenge.completed) return false;

    challenge.current = Math.min(challenge.current + amount, challenge.goal);
    challenge.completed = challenge.current >= challenge.goal;

    this.saveChallenge(challenge);

    // Update streak if completed
    if (challenge.completed) {
      this.updateStreak();
      this.addStars(challenge.reward);
    }

    return challenge.completed;
  }

  /**
   * Get current challenge
   */
  getTodayChallenge(): DailyChallenge {
    return this.generateDailyChallenge();
  }

  /**
   * Get streak data
   */
  getStreak(): StreakData {
    const saved = this.loadStreak();
    const today = this.formatDate(new Date());

    // Calculate current streak
    let currentStreak = saved.currentStreak;
    const lastDate = saved.lastActivityDate;

    if (lastDate) {
      const daysDiff = this.daysBetween(lastDate, today);
      if (daysDiff > 1 && !saved.freezeActive) {
        // Streak broken
        currentStreak = 0;
      } else if (daysDiff === 1 && saved.freezeActive) {
        // Freeze used
        saved.freezeActive = false;
        saved.freezeItemsAvailable = Math.max(0, saved.freezeItemsAvailable - 1);
      }
    }

    return {
      ...saved,
      currentStreak,
    };
  }

  /**
   * Update streak (called when challenge completed)
   */
  private updateStreak(): void {
    const streak = this.getStreak();
    const today = this.formatDate(new Date());
    const lastDate = streak.lastActivityDate;

    // Check if already updated today
    if (lastDate === today) return;

    const daysDiff = lastDate ? this.daysBetween(lastDate, today) : 0;

    if (daysDiff === 1 || !lastDate) {
      // Continue streak
      streak.currentStreak++;
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
    } else if (daysDiff === 0) {
      // Same day, no change
      return;
    } else {
      // Streak was broken, start new
      streak.currentStreak = 1;
    }

    // Check for milestone rewards
    const milestones = [7, 14, 30, 60, 100];
    for (const milestone of milestones) {
      if (
        streak.currentStreak === milestone &&
        !streak.streakMilestones.includes(milestone)
      ) {
        streak.streakMilestones.push(milestone);
        this.rewardMilestone(milestone);
      }
    }

    // 3-day streak bonus
    if (streak.currentStreak % 3 === 0 && streak.currentStreak >= 3) {
      this.addStars(5);
    }

    streak.lastActivityDate = today;
    streak.totalChallengesCompleted++;
    this.saveStreak(streak);
  }

  /**
   * Award milestone rewards
   */
  private rewardMilestone(days: number): void {
    const rewards: Record<number, number> = {
      7: 10,
      14: 20,
      30: 50,
      60: 100,
      100: 200,
    };

    const stars = rewards[days] || 0;
    this.addStars(stars);

    // Unlock freeze items at certain milestones
    if ([14, 30, 60].includes(days)) {
      const streak = this.loadStreak();
      streak.freezeItemsAvailable = Math.min(
        streak.freezeItemsAvailable + 1,
        3
      );
      this.saveStreak(streak);
    }
  }

  /**
   * Use freeze item to protect streak
   */
  useFreeze(): boolean {
    const streak = this.loadStreak();
    if (streak.freezeItemsAvailable <= 0 || streak.freezeActive) {
      return false;
    }

    streak.freezeActive = true;
    this.saveStreak(streak);
    return true;
  }

  /**
   * Get total stars earned
   */
  getTotalStars(): number {
    const streak = this.loadStreak();
    return streak.totalStarsEarned;
  }

  /**
   * Add stars to total
   */
  private addStars(amount: number): void {
    const streak = this.loadStreak();
    streak.totalStarsEarned += amount;
    this.saveStreak(streak);
  }

  /**
   * Get challenge history (last 30 days)
   */
  getHistory(): { date: string; completed: boolean }[] {
    const history: { date: string; completed: boolean }[] = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);

      const saved = this.loadChallenge(dateStr);
      history.push({
        date: dateStr,
        completed: saved?.completed || false,
      });
    }

    return history;
  }

  // Helper methods

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private dateSeed(date: Date): number {
    return date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();
  }

  private daysBetween(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private getWeekStart(date: Date): Date {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    return new Date(date.setDate(diff));
  }

  // LocalStorage methods

  private loadChallenge(date?: string): DailyChallenge | null {
    if (typeof window === 'undefined') return null;

    const dateStr = date || this.formatDate(new Date());
    const key = `${this.storageKey}-${dateStr}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
  }

  private saveChallenge(challenge: DailyChallenge): void {
    if (typeof window === 'undefined') return;

    const key = `${this.storageKey}-${challenge.date}`;
    localStorage.setItem(key, JSON.stringify(challenge));
  }

  private loadStreak(): StreakData {
    if (typeof window === 'undefined') {
      return this.getDefaultStreak();
    }

    const saved = localStorage.getItem(this.streakKey);
    return saved ? JSON.parse(saved) : this.getDefaultStreak();
  }

  private saveStreak(streak: StreakData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.streakKey, JSON.stringify(streak));
  }

  private getDefaultStreak(): StreakData {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: '',
      freezeItemsAvailable: 0,
      freezeActive: false,
      streakMilestones: [],
      totalChallengesCompleted: 0,
      totalStarsEarned: 0,
    };
  }

  private loadWeeklyChallenge(): WeeklyChallenge | null {
    if (typeof window === 'undefined') return null;

    const saved = localStorage.getItem(this.weeklyKey);
    return saved ? JSON.parse(saved) : null;
  }

  private saveWeeklyChallenge(challenge: WeeklyChallenge): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.weeklyKey, JSON.stringify(challenge));
  }
}

// Global instance
export const dailyChallengeManager = new DailyChallengeManager();
