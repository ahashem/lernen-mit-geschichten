/**
 * Achievement Badge System
 * Tracks user progress and unlocks achievements across the educational webapp
 */

import type { Locale } from './i18n';
import { confetti } from './confetti';
import { soundEffects } from './sound-effects';
import { starWallet } from './star-wallet';

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  emoji: string;
  rarity: AchievementRarity;
  unlocked: boolean;
  unlockedAt?: number;
  progress?: {
    current: number;
    total: number;
  };
}

export interface UserProgress {
  storiesRead: string[];
  storiesCompleted: string[];
  languagesUsed: Set<string>;
  characterTypesRead: Set<string>;
  perfectQuizzes: string[];
  readingTimes: Map<string, number>;
  storyStartTimes: Map<string, number>;
  achievements: Map<string, { unlocked: boolean; unlockedAt?: number }>;
}

// Achievement definitions
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    emoji: '🎯',
    rarity: 'common',
    unlocked: false,
    title: {
      de: 'Erste Schritte',
      ar: 'الخطوات الأولى',
      en: 'First Steps',
      tr: 'İlk Adımlar',
      ur: 'پہلے قدم',
    },
    description: {
      de: 'Dein erstes Quiz abgeschlossen',
      ar: 'أكملت أول اختبار',
      en: 'Complete your first quiz',
      tr: 'İlk testini tamamla',
      ur: 'اپنا پہلا کوئز مکمل کریں',
    },
  },
  {
    id: 'quick-learner',
    emoji: '⚡',
    rarity: 'rare',
    unlocked: false,
    title: {
      de: 'Schnelllerner',
      ar: 'متعلم سريع',
      en: 'Quick Learner',
      tr: 'Hızlı Öğrenen',
      ur: 'تیز سیکھنے والا',
    },
    description: {
      de: 'Ein Quiz beim ersten Versuch mit 100% bestanden',
      ar: 'حصلت على 100% في الاختبار من المحاولة الأولى',
      en: 'Get 100% on first try',
      tr: 'İlk denemede %100 al',
      ur: 'پہلی کوشش میں 100% حاصل کریں',
    },
  },
  {
    id: 'story-explorer',
    emoji: '📚',
    rarity: 'common',
    unlocked: false,
    title: {
      de: 'Geschichtenforscher',
      ar: 'مستكشف القصص',
      en: 'Story Explorer',
      tr: 'Hikaye Kaşifi',
      ur: 'کہانی کا کھوجی',
    },
    description: {
      de: '5 verschiedene Geschichten gelesen',
      ar: 'قرأت 5 قصص مختلفة',
      en: 'Read 5 different stories',
      tr: '5 farklı hikaye oku',
      ur: '5 مختلف کہانیاں پڑھیں',
    },
    progress: {
      current: 0,
      total: 5,
    },
  },
  {
    id: 'multilingual-master',
    emoji: '🌍',
    rarity: 'epic',
    unlocked: false,
    title: {
      de: 'Mehrsprachiger Meister',
      ar: 'متعدد اللغات',
      en: 'Multilingual Master',
      tr: 'Çok Dilli Usta',
      ur: 'کثیر لسانی ماہر',
    },
    description: {
      de: 'Geschichten in 3 verschiedenen Sprachen gelesen',
      ar: 'قرأت القصص بـ3 لغات مختلفة',
      en: 'Read stories in 3+ languages',
      tr: '3+ dilde hikaye oku',
      ur: '3 سے زیادہ زبانوں میں کہانیاں پڑھیں',
    },
    progress: {
      current: 0,
      total: 3,
    },
  },
  {
    id: 'perfect-week',
    emoji: '🔥',
    rarity: 'legendary',
    unlocked: false,
    title: {
      de: 'Perfekte Woche',
      ar: 'أسبوع مثالي',
      en: 'Perfect Week',
      tr: 'Mükemmel Hafta',
      ur: 'کامل ہفتہ',
    },
    description: {
      de: '7 Geschichten in 7 Tagen abgeschlossen',
      ar: 'أكملت 7 قصص في 7 أيام',
      en: 'Complete 7 stories in 7 days',
      tr: '7 günde 7 hikaye tamamla',
      ur: '7 دنوں میں 7 کہانیاں مکمل کریں',
    },
    progress: {
      current: 0,
      total: 7,
    },
  },
  {
    id: 'night-owl',
    emoji: '🦉',
    rarity: 'rare',
    unlocked: false,
    title: {
      de: 'Nachteule',
      ar: 'بومة الليل',
      en: 'Night Owl',
      tr: 'Gece Kuşu',
      ur: 'رات کا الّو',
    },
    description: {
      de: 'Eine Geschichte nach 20 Uhr gelesen',
      ar: 'قرأت قصة بعد الساعة 8 مساءً',
      en: 'Read a story after 8pm',
      tr: 'Saat 20:00\'dan sonra hikaye oku',
      ur: 'رات 8 بجے کے بعد کہانی پڑھیں',
    },
  },
  {
    id: 'early-bird',
    emoji: '🌅',
    rarity: 'rare',
    unlocked: false,
    title: {
      de: 'Frühaufsteher',
      ar: 'طائر مبكر',
      en: 'Early Bird',
      tr: 'Erken Kalkan',
      ur: 'صبح سویرے اٹھنے والا',
    },
    description: {
      de: 'Eine Geschichte vor 8 Uhr gelesen',
      ar: 'قرأت قصة قبل الساعة 8 صباحًا',
      en: 'Read a story before 8am',
      tr: 'Saat 08:00\'dan önce hikaye oku',
      ur: 'صبح 8 بجے سے پہلے کہانی پڑھیں',
    },
  },
  {
    id: 'speed-reader',
    emoji: '💨',
    rarity: 'rare',
    unlocked: false,
    title: {
      de: 'Schnellleser',
      ar: 'قارئ سريع',
      en: 'Speed Reader',
      tr: 'Hızlı Okuyucu',
      ur: 'تیز پڑھنے والا',
    },
    description: {
      de: 'Eine Geschichte in unter 2 Minuten abgeschlossen',
      ar: 'أكملت قصة في أقل من دقيقتين',
      en: 'Complete a story in under 2 minutes',
      tr: '2 dakikadan kısa sürede hikaye tamamla',
      ur: '2 منٹ سے کم میں کہانی مکمل کریں',
    },
  },
  {
    id: 'patient-learner',
    emoji: '🧘',
    rarity: 'common',
    unlocked: false,
    title: {
      de: 'Geduldiger Lerner',
      ar: 'متعلم صبور',
      en: 'Patient Learner',
      tr: 'Sabırlı Öğrenci',
      ur: 'صبر کرنے والا طالب علم',
    },
    description: {
      de: '10 Minuten mit einer Geschichte verbracht',
      ar: 'قضيت 10 دقائق على قصة واحدة',
      en: 'Spend 10+ minutes on one story',
      tr: 'Bir hikayede 10+ dakika geçir',
      ur: 'ایک کہانی پر 10 منٹ سے زیادہ وقت گزاریں',
    },
  },
  {
    id: 'bear-collector',
    emoji: '🐻',
    rarity: 'epic',
    unlocked: false,
    title: {
      de: 'Bärensammler',
      ar: 'جامع الدببة',
      en: 'Bear Collector',
      tr: 'Ayı Koleksiyoncusu',
      ur: 'ریچھ جمع کرنے والا',
    },
    description: {
      de: 'Alle Bärengeschichten gelesen',
      ar: 'قرأت جميع قصص الدببة',
      en: 'Read all bear stories',
      tr: 'Tüm ayı hikayelerini oku',
      ur: 'تمام ریچھ کی کہانیاں پڑھیں',
    },
  },
  {
    id: 'completionist',
    emoji: '👑',
    rarity: 'legendary',
    unlocked: false,
    title: {
      de: 'Vollender',
      ar: 'المكمل',
      en: 'Completionist',
      tr: 'Tamamlayıcı',
      ur: 'مکمل کرنے والا',
    },
    description: {
      de: 'Alle verfügbaren Geschichten gelesen',
      ar: 'قرأت جميع القصص المتاحة',
      en: 'Read all available stories',
      tr: 'Tüm mevcut hikayeleri oku',
      ur: 'تمام دستیاب کہانیاں پڑھیں',
    },
  },
  {
    id: 'quiz-master',
    emoji: '🎓',
    rarity: 'epic',
    unlocked: false,
    title: {
      de: 'Quiz-Meister',
      ar: 'سيد الاختبار',
      en: 'Quiz Master',
      tr: 'Test Ustası',
      ur: 'کوئز ماسٹر',
    },
    description: {
      de: '10 Quizze perfekt abgeschlossen',
      ar: 'أكملت 10 اختبارات بشكل مثالي',
      en: 'Complete 10 quizzes perfectly',
      tr: '10 testi kusursuz tamamla',
      ur: '10 کوئز مکمل طور پر مکمل کریں',
    },
    progress: {
      current: 0,
      total: 10,
    },
  },
  {
    id: 'storyteller',
    emoji: '📣',
    rarity: 'rare',
    unlocked: false,
    title: {
      de: 'Geschichtenerzähler',
      ar: 'راوي القصص',
      en: 'Storyteller',
      tr: 'Hikaye Anlatıcısı',
      ur: 'کہانی سنانے والا',
    },
    description: {
      de: '5 Geschichten geteilt',
      ar: 'شاركت 5 قصص',
      en: 'Share 5 stories',
      tr: '5 hikaye paylaş',
      ur: '5 کہانیاں شیئر کریں',
    },
    progress: {
      current: 0,
      total: 5,
    },
  },
  {
    id: 'coloring-artist',
    emoji: '🎨',
    rarity: 'common',
    unlocked: false,
    title: {
      de: 'Künstler',
      ar: 'فنان',
      en: 'Artist',
      tr: 'Sanatçı',
      ur: 'فنکار',
    },
    description: {
      de: '10 Ausmalbilder fertiggestellt',
      ar: 'أكملت 10 صفحات تلوين',
      en: 'Complete 10 coloring pages',
      tr: '10 boyama sayfası tamamla',
      ur: '10 رنگ بھرنے کے صفحات مکمل کریں',
    },
    progress: {
      current: 0,
      total: 10,
    },
  },
  {
    id: 'rainbow-master',
    emoji: '🌈',
    rarity: 'rare',
    unlocked: false,
    title: {
      de: 'Regenbogenmeister',
      ar: 'سيد قوس قزح',
      en: 'Rainbow Master',
      tr: 'Gökkuşağı Ustası',
      ur: 'قوس قزح ماسٹر',
    },
    description: {
      de: 'Alle 20+ Farben in einem Bild verwendet',
      ar: 'استخدمت جميع الألوان الـ 20+ في صورة واحدة',
      en: 'Use all 20+ colors in one picture',
      tr: 'Bir resimde 20+ renk kullan',
      ur: 'ایک تصویر میں 20+ رنگ استعمال کریں',
    },
  },
  {
    id: 'perfectionist',
    emoji: '✨',
    rarity: 'epic',
    unlocked: false,
    title: {
      de: 'Perfektionist',
      ar: 'الكمالي',
      en: 'Perfectionist',
      tr: 'Mükemmeliyetçi',
      ur: 'کامل پسند',
    },
    description: {
      de: 'Ausmalbild ohne über die Linien zu malen fertiggestellt',
      ar: 'أكملت صفحة تلوين دون التلوين خارج الخطوط',
      en: 'Complete a coloring page without going outside lines',
      tr: 'Çizgilerin dışına taşmadan boyama sayfası tamamla',
      ur: 'لائنوں کے باہر جائے بغیر رنگ بھرنے کا صفحہ مکمل کریں',
    },
  },
  {
    id: 'coloring-collector',
    emoji: '🖼️',
    rarity: 'legendary',
    unlocked: false,
    title: {
      de: 'Sammler',
      ar: 'جامع',
      en: 'Collector',
      tr: 'Koleksiyoncu',
      ur: 'جمع کرنے والا',
    },
    description: {
      de: 'Alle 25+ Ausmalbilder fertiggestellt',
      ar: 'أكملت جميع صفحات التلوين الـ 25+',
      en: 'Complete all 25+ coloring pages',
      tr: 'Tüm 25+ boyama sayfasını tamamla',
      ur: 'تمام 25+ رنگ بھرنے کے صفحات مکمل کریں',
    },
  },
  {
    id: 'composer',
    emoji: '🎵',
    rarity: 'common',
    unlocked: false,
    title: {
      de: 'Komponist',
      ar: 'ملحن',
      en: 'Composer',
      tr: 'Besteci',
      ur: 'موسیقار',
    },
    description: {
      de: 'Erste Komposition erstellt',
      ar: 'إنشاء أول تكوين موسيقي',
      en: 'Create your first composition',
      tr: 'İlk kompozisyonunu oluştur',
      ur: 'اپنی پہلی کمپوزیشن بنائیں',
    },
  },
  {
    id: 'musician',
    emoji: '🎼',
    rarity: 'rare',
    unlocked: false,
    title: {
      de: 'Musiker',
      ar: 'موسيقي',
      en: 'Musician',
      tr: 'Müzisyen',
      ur: 'موسیقی کار',
    },
    description: {
      de: '5 Kompositionen erstellt',
      ar: 'أنشأت 5 مقطوعات موسيقية',
      en: 'Create 5 compositions',
      tr: '5 kompozisyon oluştur',
      ur: '5 کمپوزیشنز بنائیں',
    },
    progress: {
      current: 0,
      total: 5,
    },
  },
  {
    id: 'maestro',
    emoji: '🎹',
    rarity: 'epic',
    unlocked: false,
    title: {
      de: 'Maestro',
      ar: 'أستاذ',
      en: 'Maestro',
      tr: 'Maestro',
      ur: 'ماہر',
    },
    description: {
      de: '10 Kompositionen erstellt',
      ar: 'أنشأت 10 مقطوعات موسيقية',
      en: 'Create 10 compositions',
      tr: '10 kompozisyon oluştur',
      ur: '10 کمپوزیشنز بنائیں',
    },
    progress: {
      current: 0,
      total: 10,
    },
  },
  {
    id: 'instrument-master',
    emoji: '🎺',
    rarity: 'rare',
    unlocked: false,
    title: {
      de: 'Instrumentenmeister',
      ar: 'سيد الآلات',
      en: 'Instrument Master',
      tr: 'Enstrüman Ustası',
      ur: 'آلات کا ماہر',
    },
    description: {
      de: 'Alle 8 Instrumente in einer Komposition verwendet',
      ar: 'استخدمت جميع الآلات الثمانية في مقطوعة واحدة',
      en: 'Use all 8 instruments in one composition',
      tr: 'Bir kompozisyonda 8 enstrümanın hepsini kullan',
      ur: 'ایک کمپوزیشن میں تمام 8 آلات استعمال کریں',
    },
  },
];

// Rarity colors for visual styling
export const RARITY_COLORS: Record<AchievementRarity, string> = {
  common: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
};

// Achievement tracking class
export class AchievementTracker {
  private progress: UserProgress;
  private storageKey = 'achievements-progress';

  constructor() {
    this.progress = this.loadProgress();
  }

  private loadProgress(): UserProgress {
    if (typeof window === 'undefined') {
      return this.getDefaultProgress();
    }

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      return this.getDefaultProgress();
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        storiesRead: parsed.storiesRead || [],
        storiesCompleted: parsed.storiesCompleted || [],
        languagesUsed: new Set(parsed.languagesUsed || []),
        characterTypesRead: new Set(parsed.characterTypesRead || []),
        perfectQuizzes: parsed.perfectQuizzes || [],
        readingTimes: new Map(Object.entries(parsed.readingTimes || {})),
        storyStartTimes: new Map(Object.entries(parsed.storyStartTimes || {})),
        achievements: new Map(Object.entries(parsed.achievements || {})),
      };
    } catch (error) {
      console.error('Failed to load achievement progress:', error);
      return this.getDefaultProgress();
    }
  }

  private getDefaultProgress(): UserProgress {
    return {
      storiesRead: [],
      storiesCompleted: [],
      languagesUsed: new Set(),
      characterTypesRead: new Set(),
      perfectQuizzes: [],
      readingTimes: new Map(),
      storyStartTimes: new Map(),
      achievements: new Map(),
    };
  }

  private saveProgress(): void {
    if (typeof window === 'undefined') return;

    const serializable = {
      storiesRead: this.progress.storiesRead,
      storiesCompleted: this.progress.storiesCompleted,
      languagesUsed: Array.from(this.progress.languagesUsed),
      characterTypesRead: Array.from(this.progress.characterTypesRead),
      perfectQuizzes: this.progress.perfectQuizzes,
      readingTimes: Object.fromEntries(this.progress.readingTimes),
      storyStartTimes: Object.fromEntries(this.progress.storyStartTimes),
      achievements: Object.fromEntries(this.progress.achievements),
    };

    localStorage.setItem(this.storageKey, JSON.stringify(serializable));
  }

  // Track story reading start
  trackStoryStart(storyId: string): void {
    this.progress.storyStartTimes.set(storyId, Date.now());
    this.saveProgress();
  }

  // Track story reading completion
  trackStoryRead(storyId: string, language: string, characterType?: string): string[] {
    const unlockedAchievements: string[] = [];

    // Add to read stories if not already there
    if (!this.progress.storiesRead.includes(storyId)) {
      this.progress.storiesRead.push(storyId);
    }

    // Track language
    this.progress.languagesUsed.add(language);

    // Track character type
    if (characterType) {
      this.progress.characterTypesRead.add(characterType);
    }

    // Calculate reading time
    const startTime = this.progress.storyStartTimes.get(storyId);
    if (startTime) {
      const duration = (Date.now() - startTime) / 1000 / 60; // minutes
      this.progress.readingTimes.set(storyId, duration);
      this.progress.storyStartTimes.delete(storyId);

      // Check time-based achievements
      if (duration < 2) {
        const unlocked = this.unlockAchievement('speed-reader');
        if (unlocked) unlockedAchievements.push('speed-reader');
      }

      if (duration >= 10) {
        const unlocked = this.unlockAchievement('patient-learner');
        if (unlocked) unlockedAchievements.push('patient-learner');
      }
    }

    // Check time-of-day achievements
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) {
      const unlocked = this.unlockAchievement('night-owl');
      if (unlocked) unlockedAchievements.push('night-owl');
    }
    if (hour >= 5 && hour < 8) {
      const unlocked = this.unlockAchievement('early-bird');
      if (unlocked) unlockedAchievements.push('early-bird');
    }

    // Check story explorer (5 different stories)
    if (this.progress.storiesRead.length >= 5) {
      const unlocked = this.unlockAchievement('story-explorer');
      if (unlocked) unlockedAchievements.push('story-explorer');
    }

    // Check multilingual master (3+ languages)
    if (this.progress.languagesUsed.size >= 3) {
      const unlocked = this.unlockAchievement('multilingual-master');
      if (unlocked) unlockedAchievements.push('multilingual-master');
    }

    // Check perfect week (7 stories in 7 days)
    const recentCompletions = this.getStoriesInLastDays(7);
    if (recentCompletions >= 7) {
      const unlocked = this.unlockAchievement('perfect-week');
      if (unlocked) unlockedAchievements.push('perfect-week');
    }

    this.saveProgress();
    return unlockedAchievements;
  }

  // Track quiz completion
  trackQuizCompletion(storyId: string, isPerfect: boolean): string[] {
    const unlockedAchievements: string[] = [];

    // Add to completed stories
    if (!this.progress.storiesCompleted.includes(storyId)) {
      this.progress.storiesCompleted.push(storyId);
    }

    // First quiz achievement
    if (this.progress.storiesCompleted.length === 1) {
      const unlocked = this.unlockAchievement('first-steps');
      if (unlocked) unlockedAchievements.push('first-steps');
    }

    // Perfect quiz achievements
    if (isPerfect) {
      if (!this.progress.perfectQuizzes.includes(storyId)) {
        this.progress.perfectQuizzes.push(storyId);
      }

      // Quick learner (first perfect quiz)
      const unlocked = this.unlockAchievement('quick-learner');
      if (unlocked) unlockedAchievements.push('quick-learner');

      // Quiz master (10 perfect quizzes)
      if (this.progress.perfectQuizzes.length >= 10) {
        const unlocked = this.unlockAchievement('quiz-master');
        if (unlocked) unlockedAchievements.push('quiz-master');
      }
    }

    this.saveProgress();
    return unlockedAchievements;
  }

  // Track character collection achievements
  trackCharacterCollection(characterType: string, totalOfType: number): string[] {
    const unlockedAchievements: string[] = [];

    // Check if all stories of this character type are read
    const readOfType = this.progress.storiesRead.filter(id => {
      // This would need to be enhanced with actual character type checking
      return this.progress.characterTypesRead.has(characterType);
    }).length;

    if (characterType === 'bear' && readOfType >= totalOfType) {
      const unlocked = this.unlockAchievement('bear-collector');
      if (unlocked) unlockedAchievements.push('bear-collector');
    }

    this.saveProgress();
    return unlockedAchievements;
  }

  // Track story sharing
  trackStoryShare(storyId: string): string[] {
    const unlockedAchievements: string[] = [];

    // Get or create shared stories tracker
    const sharedStories = this.getSharedStories();
    if (!sharedStories.includes(storyId)) {
      sharedStories.push(storyId);
      localStorage.setItem('shared-stories', JSON.stringify(sharedStories));
    }

    // Check storyteller achievement (5 stories shared)
    if (sharedStories.length >= 5) {
      const unlocked = this.unlockAchievement('storyteller');
      if (unlocked) unlockedAchievements.push('storyteller');
    }

    this.saveProgress();
    return unlockedAchievements;
  }

  // Get list of shared stories
  private getSharedStories(): string[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('shared-stories');
    return stored ? JSON.parse(stored) : [];
  }

  // Unlock achievement
  private unlockAchievement(achievementId: string): boolean {
    const existing = this.progress.achievements.get(achievementId);
    if (existing?.unlocked) {
      return false; // Already unlocked
    }

    this.progress.achievements.set(achievementId, {
      unlocked: true,
      unlockedAt: Date.now(),
    });

    // Award stars for achievement unlock
    const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievement) {
      const starAmount = achievement.rarity === 'legendary' ? 50 :
                         achievement.rarity === 'epic' ? 30 :
                         achievement.rarity === 'rare' ? 20 : 15;
      starWallet.earnStars('achievement-unlock', starAmount);
    }

    this.saveProgress();
    return true;
  }

  // Get stories completed in last N days
  private getStoriesInLastDays(days: number): number {
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return this.progress.storiesCompleted.filter(id => {
      const completedTime = this.progress.achievements.get('first-steps')?.unlockedAt || 0;
      return completedTime >= cutoff;
    }).length;
  }

  // Get all achievements with progress
  getAchievements(): Achievement[] {
    return ACHIEVEMENTS.map(achievement => {
      const savedProgress = this.progress.achievements.get(achievement.id);

      // Calculate progress for progressive achievements
      let progress = achievement.progress ? { ...achievement.progress } : undefined;

      if (progress) {
        switch (achievement.id) {
          case 'story-explorer':
            progress.current = this.progress.storiesRead.length;
            break;
          case 'multilingual-master':
            progress.current = this.progress.languagesUsed.size;
            break;
          case 'perfect-week':
            progress.current = this.getStoriesInLastDays(7);
            break;
          case 'quiz-master':
            progress.current = this.progress.perfectQuizzes.length;
            break;
          case 'storyteller':
            progress.current = this.getSharedStories().length;
            break;
        }
      }

      return {
        ...achievement,
        unlocked: savedProgress?.unlocked || false,
        unlockedAt: savedProgress?.unlockedAt,
        progress,
      };
    });
  }

  // Get achievement by ID
  getAchievement(id: string): Achievement | undefined {
    return this.getAchievements().find(a => a.id === id);
  }

  // Get unlocked achievements count
  getUnlockedCount(): number {
    return Array.from(this.progress.achievements.values()).filter(a => a.unlocked).length;
  }

  // Get total achievements count
  getTotalCount(): number {
    return ACHIEVEMENTS.length;
  }

  // Show achievement unlock notification
  showAchievementUnlock(achievementId: string, locale: Locale = 'de'): void {
    const achievement = this.getAchievement(achievementId);
    if (!achievement || !achievement.unlocked) return;

    // Play sound and confetti
    soundEffects.playAchievement();
    confetti.fireworks(3, 400);

    // Dispatch custom event for toast notification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('achievement-unlocked', {
          detail: {
            achievement,
            locale,
          },
        })
      );
    }
  }
}

// Global instance
export const achievementTracker = new AchievementTracker();
