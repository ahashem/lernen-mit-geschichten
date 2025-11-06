/**
 * Badge Collection System
 * 100+ unique badges that children earn through various activities and achievements
 */

import type { Locale } from './i18n';
import { starWallet } from './star-wallet';
import { confetti } from './confetti';
import { soundEffects } from './sound-effects';

export type BadgeCategory =
  | 'reading'
  | 'skill'
  | 'activity'
  | 'challenge'
  | 'seasonal'
  | 'secret';

export type BadgeRarity =
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond';

export interface BadgeCondition {
  type: 'count' | 'streak' | 'score' | 'time' | 'date' | 'composite';
  metric: string;
  operator: '>=' | '<=' | '==' | '>' | '<';
  value: number | string | boolean;
  conditions?: BadgeCondition[]; // For composite conditions (AND/OR)
  logic?: 'AND' | 'OR';
}

export interface Badge {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  hint: Record<Locale, string>; // Hint for locked badges
  icon: string; // Emoji or SVG path
  category: BadgeCategory;
  rarity: BadgeRarity;
  unlocked: boolean;
  earnedAt?: number;
  conditions: BadgeCondition[];
  progress?: {
    current: number;
    total: number;
  };
  starReward: number;
  relatedActivities?: string[];
  series?: string; // For progressive badges (Level 1, 2, 3)
  seriesOrder?: number;
}

export interface BadgeProgress {
  badges: Map<string, { unlocked: boolean; earnedAt?: number; progress?: { current: number; total: number } }>;
  pinnedBadges: string[]; // Max 6
  statistics: {
    totalEarned: number;
    totalBronze: number;
    totalSilver: number;
    totalGold: number;
    totalPlatinum: number;
    totalDiamond: number;
    byCategory: Record<BadgeCategory, number>;
  };
}

// Rarity star rewards and colors
export const RARITY_REWARDS: Record<BadgeRarity, number> = {
  bronze: 10,
  silver: 20,
  gold: 40,
  platinum: 75,
  diamond: 100,
};

export const RARITY_COLORS: Record<BadgeRarity, { primary: string; secondary: string; glow: string }> = {
  bronze: { primary: '#CD7F32', secondary: '#8B4513', glow: '#FFD700' },
  silver: { primary: '#C0C0C0', secondary: '#808080', glow: '#E8E8E8' },
  gold: { primary: '#FFD700', secondary: '#FFA500', glow: '#FFFF00' },
  platinum: { primary: '#E5E4E2', secondary: '#B9F2FF', glow: '#00CED1' },
  diamond: { primary: '#B9F2FF', secondary: '#4169E1', glow: '#00FFFF' },
};

// ============================================
// BADGE DEFINITIONS (100+ badges)
// ============================================

export const BADGES: Badge[] = [
  // ============================================
  // READING BADGES (25 badges)
  // ============================================
  {
    id: 'first-story',
    icon: '📖',
    category: 'reading',
    rarity: 'bronze',
    unlocked: false,
    starReward: RARITY_REWARDS.bronze,
    conditions: [{ type: 'count', metric: 'stories_read', operator: '>=', value: 1 }],
    name: {
      de: 'Erste Geschichte',
      ar: 'القصة الأولى',
      en: 'First Story',
      tr: 'İlk Hikaye',
      ur: 'پہلی کہانی',
    },
    description: {
      de: 'Deine erste Geschichte gelesen',
      ar: 'قرأت قصتك الأولى',
      en: 'Read your first story',
      tr: 'İlk hikayeni oku',
      ur: 'اپنی پہلی کہانی پڑھیں',
    },
    hint: {
      de: 'Lies eine Geschichte',
      ar: 'اقرأ قصة',
      en: 'Read a story',
      tr: 'Bir hikaye oku',
      ur: 'ایک کہانی پڑھیں',
    },
  },
  {
    id: 'bookworm-i',
    icon: '🐛',
    category: 'reading',
    rarity: 'bronze',
    unlocked: false,
    starReward: RARITY_REWARDS.bronze,
    series: 'bookworm',
    seriesOrder: 1,
    conditions: [{ type: 'count', metric: 'stories_read', operator: '>=', value: 10 }],
    name: {
      de: 'Bücherwurm I',
      ar: 'دودة الكتب I',
      en: 'Bookworm I',
      tr: 'Kitap Kurdu I',
      ur: 'کتاب کا کیڑا I',
    },
    description: {
      de: '10 Geschichten gelesen',
      ar: 'قرأت 10 قصص',
      en: 'Read 10 stories',
      tr: '10 hikaye oku',
      ur: '10 کہانیاں پڑھیں',
    },
    hint: {
      de: 'Lies 10 Geschichten',
      ar: 'اقرأ 10 قصص',
      en: 'Read 10 stories',
      tr: '10 hikaye oku',
      ur: '10 کہانیاں پڑھیں',
    },
  },
  {
    id: 'bookworm-ii',
    icon: '🐛✨',
    category: 'reading',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    series: 'bookworm',
    seriesOrder: 2,
    conditions: [{ type: 'count', metric: 'stories_read', operator: '>=', value: 25 }],
    name: {
      de: 'Bücherwurm II',
      ar: 'دودة الكتب II',
      en: 'Bookworm II',
      tr: 'Kitap Kurdu II',
      ur: 'کتاب کا کیڑا II',
    },
    description: {
      de: '25 Geschichten gelesen',
      ar: 'قرأت 25 قصة',
      en: 'Read 25 stories',
      tr: '25 hikaye oku',
      ur: '25 کہانیاں پڑھیں',
    },
    hint: {
      de: 'Lies 25 Geschichten',
      ar: 'اقرأ 25 قصة',
      en: 'Read 25 stories',
      tr: '25 hikaye oku',
      ur: '25 کہانیاں پڑھیں',
    },
  },
  {
    id: 'bookworm-iii',
    icon: '🐛🌟',
    category: 'reading',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    series: 'bookworm',
    seriesOrder: 3,
    conditions: [{ type: 'count', metric: 'stories_read', operator: '>=', value: 50 }],
    name: {
      de: 'Bücherwurm III',
      ar: 'دودة الكتب III',
      en: 'Bookworm III',
      tr: 'Kitap Kurdu III',
      ur: 'کتاب کا کیڑا III',
    },
    description: {
      de: '50 Geschichten gelesen',
      ar: 'قرأت 50 قصة',
      en: 'Read 50 stories',
      tr: '50 hikaye oku',
      ur: '50 کہانیاں پڑھیں',
    },
    hint: {
      de: 'Lies 50 Geschichten',
      ar: 'اقرأ 50 قصة',
      en: 'Read 50 stories',
      tr: '50 hikaye oku',
      ur: '50 کہانیاں پڑھیں',
    },
  },
  {
    id: 'library-master',
    icon: '📚',
    category: 'reading',
    rarity: 'diamond',
    unlocked: false,
    starReward: RARITY_REWARDS.diamond,
    conditions: [{ type: 'count', metric: 'stories_read_all', operator: '==', value: true }],
    name: {
      de: 'Bibliotheksmeister',
      ar: 'سيد المكتبة',
      en: 'Library Master',
      tr: 'Kütüphane Ustası',
      ur: 'لائبریری ماسٹر',
    },
    description: {
      de: 'Alle verfügbaren Geschichten gelesen',
      ar: 'قرأت جميع القصص المتاحة',
      en: 'Read all available stories',
      tr: 'Tüm mevcut hikayeleri oku',
      ur: 'تمام دستیاب کہانیاں پڑھیں',
    },
    hint: {
      de: 'Lies alle Geschichten',
      ar: 'اقرأ جميع القصص',
      en: 'Read all stories',
      tr: 'Tüm hikayeleri oku',
      ur: 'تمام کہانیاں پڑھیں',
    },
  },
  {
    id: 'quiz-champion-i',
    icon: '🏆',
    category: 'reading',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    series: 'quiz-champion',
    seriesOrder: 1,
    conditions: [{ type: 'count', metric: 'perfect_quizzes', operator: '>=', value: 10 }],
    name: {
      de: 'Quiz-Champion I',
      ar: 'بطل الاختبارات I',
      en: 'Quiz Champion I',
      tr: 'Test Şampiyonu I',
      ur: 'کوئز چیمپئن I',
    },
    description: {
      de: '10 perfekte Quiz',
      ar: '10 اختبارات مثالية',
      en: '10 perfect quizzes',
      tr: '10 kusursuz test',
      ur: '10 کامل کوئز',
    },
    hint: {
      de: 'Erreiche 100% in 10 Quiz',
      ar: 'احصل على 100% في 10 اختبارات',
      en: 'Get 100% in 10 quizzes',
      tr: '10 testte %100 al',
      ur: '10 کوئز میں 100% حاصل کریں',
    },
  },
  {
    id: 'quiz-champion-ii',
    icon: '🏆✨',
    category: 'reading',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    series: 'quiz-champion',
    seriesOrder: 2,
    conditions: [{ type: 'count', metric: 'perfect_quizzes', operator: '>=', value: 25 }],
    name: {
      de: 'Quiz-Champion II',
      ar: 'بطل الاختبارات II',
      en: 'Quiz Champion II',
      tr: 'Test Şampiyonu II',
      ur: 'کوئز چیمپئن II',
    },
    description: {
      de: '25 perfekte Quiz',
      ar: '25 اختبارًا مثاليًا',
      en: '25 perfect quizzes',
      tr: '25 kusursuz test',
      ur: '25 کامل کوئز',
    },
    hint: {
      de: 'Erreiche 100% in 25 Quiz',
      ar: 'احصل على 100% في 25 اختبارًا',
      en: 'Get 100% in 25 quizzes',
      tr: '25 testte %100 al',
      ur: '25 کوئز میں 100% حاصل کریں',
    },
  },
  {
    id: 'quiz-champion-iii',
    icon: '🏆🌟',
    category: 'reading',
    rarity: 'platinum',
    unlocked: false,
    starReward: RARITY_REWARDS.platinum,
    series: 'quiz-champion',
    seriesOrder: 3,
    conditions: [{ type: 'count', metric: 'perfect_quizzes', operator: '>=', value: 50 }],
    name: {
      de: 'Quiz-Champion III',
      ar: 'بطل الاختبارات III',
      en: 'Quiz Champion III',
      tr: 'Test Şampiyonu III',
      ur: 'کوئز چیمپئن III',
    },
    description: {
      de: '50 perfekte Quiz',
      ar: '50 اختبارًا مثاليًا',
      en: '50 perfect quizzes',
      tr: '50 kusursuz test',
      ur: '50 کامل کوئز',
    },
    hint: {
      de: 'Erreiche 100% in 50 Quiz',
      ar: 'احصل على 100% في 50 اختبارًا',
      en: 'Get 100% in 50 quizzes',
      tr: '50 testte %100 al',
      ur: '50 کوئز میں 100% حاصل کریں',
    },
  },
  {
    id: 'perfect-streak-5',
    icon: '🔥',
    category: 'reading',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'streak', metric: 'perfect_quiz_streak', operator: '>=', value: 5 }],
    name: {
      de: 'Perfekte Serie 5',
      ar: 'سلسلة مثالية 5',
      en: 'Perfect Streak 5',
      tr: 'Mükemmel Seri 5',
      ur: 'کامل سلسلہ 5',
    },
    description: {
      de: '5 perfekte Quiz hintereinander',
      ar: '5 اختبارات مثالية متتالية',
      en: '5 perfect quizzes in a row',
      tr: 'Arka arkaya 5 kusursuz test',
      ur: 'لگاتار 5 کامل کوئز',
    },
    hint: {
      de: 'Erreiche 100% in 5 Quiz hintereinander',
      ar: 'احصل على 100% في 5 اختبارات متتالية',
      en: 'Get 100% in 5 quizzes in a row',
      tr: 'Arka arkaya 5 testte %100 al',
      ur: 'لگاتار 5 کوئز میں 100% حاصل کریں',
    },
  },
  {
    id: 'perfect-streak-10',
    icon: '🔥🔥',
    category: 'reading',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{ type: 'streak', metric: 'perfect_quiz_streak', operator: '>=', value: 10 }],
    name: {
      de: 'Perfekte Serie 10',
      ar: 'سلسلة مثالية 10',
      en: 'Perfect Streak 10',
      tr: 'Mükemmel Seri 10',
      ur: 'کامل سلسلہ 10',
    },
    description: {
      de: '10 perfekte Quiz hintereinander',
      ar: '10 اختبارات مثالية متتالية',
      en: '10 perfect quizzes in a row',
      tr: 'Arka arkaya 10 kusursuz test',
      ur: 'لگاتار 10 کامل کوئز',
    },
    hint: {
      de: 'Erreiche 100% in 10 Quiz hintereinander',
      ar: 'احصل على 100% في 10 اختبارات متتالية',
      en: 'Get 100% in 10 quizzes in a row',
      tr: 'Arka arkaya 10 testte %100 al',
      ur: 'لگاتار 10 کوئز میں 100% حاصل کریں',
    },
  },
  {
    id: 'speed-reader',
    icon: '💨',
    category: 'reading',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'time', metric: 'story_completion_time', operator: '<=', value: 120 }],
    name: {
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
    hint: {
      de: 'Schließe eine Geschichte schnell ab',
      ar: 'أكمل قصة بسرعة',
      en: 'Complete a story quickly',
      tr: 'Bir hikayeyi hızlıca tamamla',
      ur: 'جلدی سے ایک کہانی مکمل کریں',
    },
  },
  {
    id: 'marathon-reader',
    icon: '🏃',
    category: 'reading',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{ type: 'time', metric: 'continuous_reading_time', operator: '>=', value: 60 }],
    name: {
      de: 'Marathon-Leser',
      ar: 'قارئ الماراثون',
      en: 'Marathon Reader',
      tr: 'Maraton Okuyucu',
      ur: 'میراتھن پڑھنے والا',
    },
    description: {
      de: '60 Minuten ohne Pause gelesen',
      ar: 'قرأت لمدة 60 دقيقة دون توقف',
      en: 'Read for 60 minutes straight',
      tr: 'Ara vermeden 60 dakika oku',
      ur: 'ایک ساتھ 60 منٹ پڑھیں',
    },
    hint: {
      de: 'Lies eine Stunde lang ohne Pause',
      ar: 'اقرأ لمدة ساعة دون توقف',
      en: 'Read for an hour without stopping',
      tr: 'Durmadan bir saat oku',
      ur: 'رکے بغیر ایک گھنٹہ پڑھیں',
    },
  },
  {
    id: 'early-bird',
    icon: '🌅',
    category: 'reading',
    rarity: 'bronze',
    unlocked: false,
    starReward: RARITY_REWARDS.bronze,
    conditions: [{ type: 'time', metric: 'reading_hour', operator: '<', value: 8 }],
    name: {
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
    hint: {
      de: 'Lies morgens früh eine Geschichte',
      ar: 'اقرأ قصة في الصباح الباكر',
      en: 'Read a story early in the morning',
      tr: 'Sabah erken bir hikaye oku',
      ur: 'صبح جلدی ایک کہانی پڑھیں',
    },
  },
  {
    id: 'night-owl',
    icon: '🦉',
    category: 'reading',
    rarity: 'bronze',
    unlocked: false,
    starReward: RARITY_REWARDS.bronze,
    conditions: [{ type: 'time', metric: 'reading_hour', operator: '>=', value: 20 }],
    name: {
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
    hint: {
      de: 'Lies abends spät eine Geschichte',
      ar: 'اقرأ قصة في وقت متأخر من المساء',
      en: 'Read a story late in the evening',
      tr: 'Akşam geç bir hikaye oku',
      ur: 'شام دیر سے ایک کہانی پڑھیں',
    },
  },
  {
    id: 'weekend-warrior',
    icon: '🎉',
    category: 'reading',
    rarity: 'bronze',
    unlocked: false,
    starReward: RARITY_REWARDS.bronze,
    conditions: [{ type: 'date', metric: 'is_weekend', operator: '==', value: true }],
    name: {
      de: 'Wochenend-Krieger',
      ar: 'محارب عطلة نهاية الأسبوع',
      en: 'Weekend Warrior',
      tr: 'Hafta Sonu Savaşçısı',
      ur: 'ویک اینڈ واریئر',
    },
    description: {
      de: 'Eine Geschichte am Wochenende gelesen',
      ar: 'قرأت قصة في عطلة نهاية الأسبوع',
      en: 'Read a story on weekend',
      tr: 'Hafta sonunda hikaye oku',
      ur: 'ویک اینڈ میں کہانی پڑھیں',
    },
    hint: {
      de: 'Lies am Samstag oder Sonntag',
      ar: 'اقرأ يوم السبت أو الأحد',
      en: 'Read on Saturday or Sunday',
      tr: 'Cumartesi veya Pazar oku',
      ur: 'ہفتہ یا اتوار کو پڑھیں',
    },
  },
  {
    id: 'multilingual-explorer',
    icon: '🌍',
    category: 'reading',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{ type: 'count', metric: 'languages_used', operator: '>=', value: 3 }],
    name: {
      de: 'Mehrsprachiger Entdecker',
      ar: 'مستكشف متعدد اللغات',
      en: 'Multilingual Explorer',
      tr: 'Çok Dilli Kaşif',
      ur: 'کثیر لسانی کھوجی',
    },
    description: {
      de: 'Geschichten in 3+ Sprachen gelesen',
      ar: 'قرأت قصصًا بـ 3+ لغات',
      en: 'Read stories in 3+ languages',
      tr: '3+ dilde hikaye oku',
      ur: '3+ زبانوں میں کہانیاں پڑھیں',
    },
    hint: {
      de: 'Lies Geschichten in verschiedenen Sprachen',
      ar: 'اقرأ قصصًا بلغات مختلفة',
      en: 'Read stories in different languages',
      tr: 'Farklı dillerde hikayeler oku',
      ur: 'مختلف زبانوں میں کہانیاں پڑھیں',
    },
  },
  {
    id: 'polyglot',
    icon: '🌐',
    category: 'reading',
    rarity: 'diamond',
    unlocked: false,
    starReward: RARITY_REWARDS.diamond,
    conditions: [{ type: 'count', metric: 'languages_used', operator: '>=', value: 5 }],
    name: {
      de: 'Polyglott',
      ar: 'متعدد اللغات',
      en: 'Polyglot',
      tr: 'Poliglot',
      ur: 'کثیر لسانی ماہر',
    },
    description: {
      de: 'Geschichten in allen 5 Sprachen gelesen',
      ar: 'قرأت قصصًا بجميع اللغات الخمس',
      en: 'Read stories in all 5 languages',
      tr: '5 dilde de hikaye oku',
      ur: 'تمام 5 زبانوں میں کہانیاں پڑھیں',
    },
    hint: {
      de: 'Lies Geschichten in Deutsch, Arabisch, Englisch, Türkisch und Urdu',
      ar: 'اقرأ قصصًا بالألمانية والعربية والإنجليزية والتركية والأردية',
      en: 'Read stories in German, Arabic, English, Turkish, and Urdu',
      tr: 'Almanca, Arapça, İngilizce, Türkçe ve Urduca hikayeleri oku',
      ur: 'جرمن، عربی، انگریزی، ترکی اور اردو میں کہانیاں پڑھیں',
    },
  },
  {
    id: 'character-fan-bear',
    icon: '🐻',
    category: 'reading',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'count', metric: 'character_bear_stories', operator: '>=', value: 5 }],
    name: {
      de: 'Bären-Fan',
      ar: 'معجب الدببة',
      en: 'Bear Fan',
      tr: 'Ayı Hayranı',
      ur: 'ریچھ کا پرستار',
    },
    description: {
      de: '5 Bären-Geschichten gelesen',
      ar: 'قرأت 5 قصص دببة',
      en: 'Read 5 bear stories',
      tr: '5 ayı hikayesi oku',
      ur: '5 ریچھ کی کہانیاں پڑھیں',
    },
    hint: {
      de: 'Lies Geschichten mit Bären',
      ar: 'اقرأ قصصًا عن الدببة',
      en: 'Read stories with bears',
      tr: 'Ayılarla ilgili hikayeler oku',
      ur: 'ریچھ والی کہانیاں پڑھیں',
    },
  },
  {
    id: 'character-collector',
    icon: '🎭',
    category: 'reading',
    rarity: 'platinum',
    unlocked: false,
    starReward: RARITY_REWARDS.platinum,
    conditions: [{ type: 'count', metric: 'unique_characters_met', operator: '>=', value: 20 }],
    name: {
      de: 'Charakter-Sammler',
      ar: 'جامع الشخصيات',
      en: 'Character Collector',
      tr: 'Karakter Koleksiyoncusu',
      ur: 'کردار جمع کرنے والا',
    },
    description: {
      de: '20+ verschiedene Charaktere kennengelernt',
      ar: 'قابلت 20+ شخصية مختلفة',
      en: 'Met 20+ different characters',
      tr: '20+ farklı karakterle tanış',
      ur: '20+ مختلف کرداروں سے ملیں',
    },
    hint: {
      de: 'Lies viele verschiedene Geschichten',
      ar: 'اقرأ العديد من القصص المختلفة',
      en: 'Read many different stories',
      tr: 'Birçok farklı hikaye oku',
      ur: 'بہت سی مختلف کہانیاں پڑھیں',
    },
  },
  {
    id: 'beginner-master',
    icon: '🎓',
    category: 'reading',
    rarity: 'bronze',
    unlocked: false,
    starReward: RARITY_REWARDS.bronze,
    conditions: [{ type: 'count', metric: 'beginner_stories_completed', operator: '>=', value: 10 }],
    name: {
      de: 'Anfänger-Meister',
      ar: 'سيد المبتدئين',
      en: 'Beginner Master',
      tr: 'Başlangıç Ustası',
      ur: 'ابتدائی ماسٹر',
    },
    description: {
      de: '10 Anfänger-Geschichten abgeschlossen',
      ar: 'أكملت 10 قصص للمبتدئين',
      en: 'Complete 10 beginner stories',
      tr: '10 başlangıç hikayesi tamamla',
      ur: '10 ابتدائی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Schließe einfache Geschichten ab',
      ar: 'أكمل قصصًا بسيطة',
      en: 'Complete simple stories',
      tr: 'Basit hikayeleri tamamla',
      ur: 'آسان کہانیاں مکمل کریں',
    },
  },
  {
    id: 'difficulty-climber',
    icon: '⛰️',
    category: 'reading',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{
      type: 'composite',
      logic: 'AND',
      conditions: [
        { type: 'count', metric: 'beginner_stories_completed', operator: '>=', value: 5 },
        { type: 'count', metric: 'intermediate_stories_completed', operator: '>=', value: 5 },
        { type: 'count', metric: 'advanced_stories_completed', operator: '>=', value: 5 },
      ],
    }],
    name: {
      de: 'Schwierigkeits-Bergsteiger',
      ar: 'متسلق الصعوبات',
      en: 'Difficulty Climber',
      tr: 'Zorluk Tırmanıcısı',
      ur: 'مشکل چڑھنے والا',
    },
    description: {
      de: 'Geschichten aller Schwierigkeitsgrade abgeschlossen',
      ar: 'أكملت قصصًا من جميع مستويات الصعوبة',
      en: 'Complete stories of all difficulty levels',
      tr: 'Tüm zorluk seviyelerinde hikayeler tamamla',
      ur: 'تمام مشکل سطحوں کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Schließe Geschichten verschiedener Schwierigkeiten ab',
      ar: 'أكمل قصصًا بمستويات صعوبة مختلفة',
      en: 'Complete stories of different difficulties',
      tr: 'Farklı zorluk seviyelerinde hikayeler tamamla',
      ur: 'مختلف مشکلات کی کہانیاں مکمل کریں',
    },
  },
  {
    id: 'interactive-pioneer',
    icon: '🎮',
    category: 'reading',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'count', metric: 'interactive_stories_read', operator: '>=', value: 5 }],
    name: {
      de: 'Interaktiv-Pionier',
      ar: 'رائد التفاعلية',
      en: 'Interactive Pioneer',
      tr: 'Etkileşimli Öncü',
      ur: 'انٹرایکٹو پائنیر',
    },
    description: {
      de: '5 interaktive Geschichten erlebt',
      ar: 'استمتعت بـ 5 قصص تفاعلية',
      en: 'Experience 5 interactive stories',
      tr: '5 etkileşimli hikaye deneyimle',
      ur: '5 انٹرایکٹو کہانیاں تجربہ کریں',
    },
    hint: {
      de: 'Probiere interaktive Geschichten aus',
      ar: 'جرب القصص التفاعلية',
      en: 'Try interactive stories',
      tr: 'Etkileşimli hikayeleri dene',
      ur: 'انٹرایکٹو کہانیاں آزمائیں',
    },
  },
  {
    id: 'tts-listener',
    icon: '🔊',
    category: 'reading',
    rarity: 'bronze',
    unlocked: false,
    starReward: RARITY_REWARDS.bronze,
    conditions: [{ type: 'count', metric: 'tts_stories_listened', operator: '>=', value: 10 }],
    name: {
      de: 'Zuhörer',
      ar: 'المستمع',
      en: 'Listener',
      tr: 'Dinleyici',
      ur: 'سننے والا',
    },
    description: {
      de: '10 Geschichten vorgelesen bekommen',
      ar: 'استمعت إلى 10 قصص',
      en: 'Listen to 10 stories',
      tr: '10 hikaye dinle',
      ur: '10 کہانیاں سنیں',
    },
    hint: {
      de: 'Nutze die Vorlese-Funktion',
      ar: 'استخدم ميزة القراءة بصوت عالٍ',
      en: 'Use the text-to-speech feature',
      tr: 'Sesli okuma özelliğini kullan',
      ur: 'آواز سے پڑھنے کی خصوصیت استعمال کریں',
    },
  },
  {
    id: 'reading-streak-7',
    icon: '📅',
    category: 'reading',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'streak', metric: 'daily_reading_streak', operator: '>=', value: 7 }],
    name: {
      de: '7-Tage Leseserie',
      ar: 'سلسلة قراءة 7 أيام',
      en: '7-Day Reading Streak',
      tr: '7 Günlük Okuma Serisi',
      ur: '7 دن پڑھنے کا سلسلہ',
    },
    description: {
      de: '7 Tage in Folge gelesen',
      ar: 'قرأت لمدة 7 أيام متتالية',
      en: 'Read for 7 days in a row',
      tr: '7 gün üst üste oku',
      ur: 'لگاتار 7 دن پڑھیں',
    },
    hint: {
      de: 'Lies jeden Tag eine Geschichte',
      ar: 'اقرأ قصة كل يوم',
      en: 'Read a story every day',
      tr: 'Her gün bir hikaye oku',
      ur: 'ہر روز ایک کہانی پڑھیں',
    },
  },
  {
    id: 'reading-streak-30',
    icon: '📅🔥',
    category: 'reading',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{ type: 'streak', metric: 'daily_reading_streak', operator: '>=', value: 30 }],
    name: {
      de: '30-Tage Leseserie',
      ar: 'سلسلة قراءة 30 يومًا',
      en: '30-Day Reading Streak',
      tr: '30 Günlük Okuma Serisi',
      ur: '30 دن پڑھنے کا سلسلہ',
    },
    description: {
      de: '30 Tage in Folge gelesen',
      ar: 'قرأت لمدة 30 يومًا متتالية',
      en: 'Read for 30 days in a row',
      tr: '30 gün üst üste oku',
      ur: 'لگاتار 30 دن پڑھیں',
    },
    hint: {
      de: 'Halte eine Leseserie von 30 Tagen',
      ar: 'حافظ على سلسلة قراءة لمدة 30 يومًا',
      en: 'Maintain a 30-day reading streak',
      tr: '30 günlük okuma serisini koru',
      ur: '30 دن پڑھنے کا سلسلہ برقرار رکھیں',
    },
  },
  {
    id: 'reading-streak-100',
    icon: '📅💎',
    category: 'reading',
    rarity: 'diamond',
    unlocked: false,
    starReward: RARITY_REWARDS.diamond,
    conditions: [{ type: 'streak', metric: 'daily_reading_streak', operator: '>=', value: 100 }],
    name: {
      de: '100-Tage Leseserie',
      ar: 'سلسلة قراءة 100 يوم',
      en: '100-Day Reading Streak',
      tr: '100 Günlük Okuma Serisi',
      ur: '100 دن پڑھنے کا سلسلہ',
    },
    description: {
      de: '100 Tage in Folge gelesen',
      ar: 'قرأت لمدة 100 يوم متتالية',
      en: 'Read for 100 days in a row',
      tr: '100 gün üst üste oku',
      ur: 'لگاتار 100 دن پڑھیں',
    },
    hint: {
      de: 'Eine außergewöhnliche Leseserie',
      ar: 'سلسلة قراءة استثنائية',
      en: 'An extraordinary reading streak',
      tr: 'Olağanüstü bir okuma serisi',
      ur: 'ایک غیر معمولی پڑھنے کا سلسلہ',
    },
  },

  // ============================================
  // SKILL BADGES (20 badges)
  // ============================================
  {
    id: 'emotion-expert',
    icon: '😊',
    category: 'skill',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{ type: 'count', metric: 'emotional_skills_stories', operator: '>=', value: 10 }],
    name: {
      de: 'Emotions-Experte',
      ar: 'خبير المشاعر',
      en: 'Emotion Expert',
      tr: 'Duygu Uzmanı',
      ur: 'جذبات کا ماہر',
    },
    description: {
      de: '10 Geschichten über emotionale Fähigkeiten abgeschlossen',
      ar: 'أكملت 10 قصص عن المهارات العاطفية',
      en: 'Complete 10 emotional skills stories',
      tr: '10 duygusal beceri hikayesi tamamla',
      ur: '10 جذباتی مہارت کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Lies Geschichten über Gefühle',
      ar: 'اقرأ قصصًا عن المشاعر',
      en: 'Read stories about emotions',
      tr: 'Duygular hakkında hikayeler oku',
      ur: 'جذبات کے بارے میں کہانیاں پڑھیں',
    },
  },
  {
    id: 'social-butterfly',
    icon: '🦋',
    category: 'skill',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{ type: 'count', metric: 'social_skills_stories', operator: '>=', value: 10 }],
    name: {
      de: 'Sozialer Schmetterling',
      ar: 'فراشة اجتماعية',
      en: 'Social Butterfly',
      tr: 'Sosyal Kelebek',
      ur: 'سماجی تتلی',
    },
    description: {
      de: '10 Geschichten über soziale Fähigkeiten abgeschlossen',
      ar: 'أكملت 10 قصص عن المهارات الاجتماعية',
      en: 'Complete 10 social skills stories',
      tr: '10 sosyal beceri hikayesi tamamla',
      ur: '10 سماجی مہارت کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Lies Geschichten über Freundschaft und Zusammenarbeit',
      ar: 'اقرأ قصصًا عن الصداقة والتعاون',
      en: 'Read stories about friendship and cooperation',
      tr: 'Arkadaşlık ve işbirliği hakkında hikayeler oku',
      ur: 'دوستی اور تعاون کے بارے میں کہانیاں پڑھیں',
    },
  },
  {
    id: 'problem-solver',
    icon: '🧩',
    category: 'skill',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{ type: 'count', metric: 'cognitive_skills_stories', operator: '>=', value: 10 }],
    name: {
      de: 'Problemlöser',
      ar: 'حلال المشاكل',
      en: 'Problem Solver',
      tr: 'Problem Çözücü',
      ur: 'مسئلہ حل کرنے والا',
    },
    description: {
      de: '10 Geschichten über kognitive Fähigkeiten abgeschlossen',
      ar: 'أكملت 10 قصص عن المهارات المعرفية',
      en: 'Complete 10 cognitive skills stories',
      tr: '10 bilişsel beceri hikayesi tamamla',
      ur: '10 ذہنی مہارت کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Lies Geschichten über Denken und Lernen',
      ar: 'اقرأ قصصًا عن التفكير والتعلم',
      en: 'Read stories about thinking and learning',
      tr: 'Düşünme ve öğrenme hakkında hikayeler oku',
      ur: 'سوچنے اور سیکھنے کے بارے میں کہانیاں پڑھیں',
    },
  },
  {
    id: 'behavior-champion',
    icon: '⭐',
    category: 'skill',
    rarity: 'gold',
    unlocked: false,
    starReward: RARITY_REWARDS.gold,
    conditions: [{ type: 'count', metric: 'behavioral_skills_stories', operator: '>=', value: 10 }],
    name: {
      de: 'Verhaltens-Champion',
      ar: 'بطل السلوك',
      en: 'Behavior Champion',
      tr: 'Davranış Şampiyonu',
      ur: 'رویہ چیمپئن',
    },
    description: {
      de: '10 Geschichten über Verhaltensfähigkeiten abgeschlossen',
      ar: 'أكملت 10 قصص عن المهارات السلوكية',
      en: 'Complete 10 behavioral skills stories',
      tr: '10 davranışsal beceri hikayesi tamamla',
      ur: '10 رویہ کی مہارت کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Lies Geschichten über gutes Verhalten',
      ar: 'اقرأ قصصًا عن السلوك الجيد',
      en: 'Read stories about good behavior',
      tr: 'İyi davranış hakkında hikayeler oku',
      ur: 'اچھے رویے کے بارے میں کہانیاں پڑھیں',
    },
  },
  {
    id: 'skill-master-self-awareness',
    icon: '🪞',
    category: 'skill',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'count', metric: 'skill_self_awareness', operator: '>=', value: 5 }],
    name: {
      de: 'Selbstbewusstsein-Meister',
      ar: 'سيد الوعي الذاتي',
      en: 'Self-Awareness Master',
      tr: 'Öz Farkındalık Ustası',
      ur: 'خود آگاہی ماسٹر',
    },
    description: {
      de: '5 Selbstbewusstseins-Geschichten gemeistert',
      ar: 'أتقنت 5 قصص عن الوعي الذاتي',
      en: 'Master 5 self-awareness stories',
      tr: '5 öz farkındalık hikayesinde ustalaş',
      ur: '5 خود آگاہی کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Schließe Geschichten über Selbstbewusstsein ab',
      ar: 'أكمل قصصًا عن الوعي الذاتي',
      en: 'Complete self-awareness stories',
      tr: 'Öz farkındalık hikayelerini tamamla',
      ur: 'خود آگاہی کی کہانیاں مکمل کریں',
    },
  },
  {
    id: 'skill-master-empathy',
    icon: '💝',
    category: 'skill',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'count', metric: 'skill_empathy', operator: '>=', value: 5 }],
    name: {
      de: 'Empathie-Meister',
      ar: 'سيد التعاطف',
      en: 'Empathy Master',
      tr: 'Empati Ustası',
      ur: 'ہمدردی ماسٹر',
    },
    description: {
      de: '5 Empathie-Geschichten gemeistert',
      ar: 'أتقنت 5 قصص عن التعاطف',
      en: 'Master 5 empathy stories',
      tr: '5 empati hikayesinde ustalaş',
      ur: '5 ہمدردی کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Schließe Geschichten über Empathie ab',
      ar: 'أكمل قصصًا عن التعاطف',
      en: 'Complete empathy stories',
      tr: 'Empati hikayelerini tamamla',
      ur: 'ہمدردی کی کہانیاں مکمل کریں',
    },
  },
  {
    id: 'skill-master-cooperation',
    icon: '🤝',
    category: 'skill',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'count', metric: 'skill_cooperation', operator: '>=', value: 5 }],
    name: {
      de: 'Zusammenarbeits-Meister',
      ar: 'سيد التعاون',
      en: 'Cooperation Master',
      tr: 'İşbirliği Ustası',
      ur: 'تعاون ماسٹر',
    },
    description: {
      de: '5 Zusammenarbeits-Geschichten gemeistert',
      ar: 'أتقنت 5 قصص عن التعاون',
      en: 'Master 5 cooperation stories',
      tr: '5 işbirliği hikayesinde ustalaş',
      ur: '5 تعاون کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Schließe Geschichten über Zusammenarbeit ab',
      ar: 'أكمل قصصًا عن التعاون',
      en: 'Complete cooperation stories',
      tr: 'İşbirliği hikayelerini tamamla',
      ur: 'تعاون کی کہانیاں مکمل کریں',
    },
  },
  {
    id: 'skill-master-patience',
    icon: '🧘‍♀️',
    category: 'skill',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'count', metric: 'skill_patience', operator: '>=', value: 5 }],
    name: {
      de: 'Geduld-Meister',
      ar: 'سيد الصبر',
      en: 'Patience Master',
      tr: 'Sabır Ustası',
      ur: 'صبر ماسٹر',
    },
    description: {
      de: '5 Geduld-Geschichten gemeistert',
      ar: 'أتقنت 5 قصص عن الصبر',
      en: 'Master 5 patience stories',
      tr: '5 sabır hikayesinde ustalaş',
      ur: '5 صبر کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Schließe Geschichten über Geduld ab',
      ar: 'أكمل قصصًا عن الصبر',
      en: 'Complete patience stories',
      tr: 'Sabır hikayelerini tamamla',
      ur: 'صبر کی کہانیاں مکمل کریں',
    },
  },
  {
    id: 'skill-master-honesty',
    icon: '🤲',
    category: 'skill',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'count', metric: 'skill_honesty', operator: '>=', value: 5 }],
    name: {
      de: 'Ehrlichkeits-Meister',
      ar: 'سيد الصدق',
      en: 'Honesty Master',
      tr: 'Dürüstlük Ustası',
      ur: 'ایمانداری ماسٹر',
    },
    description: {
      de: '5 Ehrlichkeits-Geschichten gemeistert',
      ar: 'أتقنت 5 قصص عن الصدق',
      en: 'Master 5 honesty stories',
      tr: '5 dürüstlük hikayesinde ustalaş',
      ur: '5 ایمانداری کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Schließe Geschichten über Ehrlichkeit ab',
      ar: 'أكمل قصصًا عن الصدق',
      en: 'Complete honesty stories',
      tr: 'Dürüstlük hikayelerini tamamla',
      ur: 'ایمانداری کی کہانیاں مکمل کریں',
    },
  },
  {
    id: 'skill-master-responsibility',
    icon: '🎯',
    category: 'skill',
    rarity: 'silver',
    unlocked: false,
    starReward: RARITY_REWARDS.silver,
    conditions: [{ type: 'count', metric: 'skill_responsibility', operator: '>=', value: 5 }],
    name: {
      de: 'Verantwortungs-Meister',
      ar: 'سيد المسؤولية',
      en: 'Responsibility Master',
      tr: 'Sorumluluk Ustası',
      ur: 'ذمہ داری ماسٹر',
    },
    description: {
      de: '5 Verantwortungs-Geschichten gemeistert',
      ar: 'أتقنت 5 قصص عن المسؤولية',
      en: 'Master 5 responsibility stories',
      tr: '5 sorumluluk hikayesinde ustalaş',
      ur: '5 ذمہ داری کی کہانیاں مکمل کریں',
    },
    hint: {
      de: 'Schließe Geschichten über Verantwortung ab',
      ar: 'أكمل قصصًا عن المسؤولية',
      en: 'Complete responsibility stories',
      tr: 'Sorumluluk hikayelerini tamamla',
      ur: 'ذمہ داری کی کہانیاں مکمل کریں',
    },
  },
  {
    id: 'all-skills-explorer',
    icon: '🌟',
    category: 'skill',
    rarity: 'platinum',
    unlocked: false,
    starReward: RARITY_REWARDS.platinum,
    conditions: [{ type: 'count', metric: 'unique_skills_explored', operator: '>=', value: 20 }],
    name: {
      de: 'Alle-Fähigkeiten-Entdecker',
      ar: 'مستكشف جميع المهارات',
      en: 'All-Skills Explorer',
      tr: 'Tüm Beceriler Kaşifi',
      ur: 'تمام مہارتوں کا کھوجی',
    },
    description: {
      de: 'Mindestens eine Geschichte zu 20 verschiedenen Fähigkeiten',
      ar: 'قصة واحدة على الأقل لـ 20 مهارة مختلفة',
      en: 'At least one story for 20 different skills',
      tr: '20 farklı beceri için en az bir hikaye',
      ur: '20 مختلف مہارتوں کے لیے کم از کم ایک کہانی',
    },
    hint: {
      de: 'Erkunde verschiedene Fähigkeiten',
      ar: 'استكشف مهارات مختلفة',
      en: 'Explore different skills',
      tr: 'Farklı becerileri keşfet',
      ur: 'مختلف مہارتوں کو دریافت کریں',
    },
  },
  {
    id: 'skill-perfectionist',
    icon: '💯',
    category: 'skill',
    rarity: 'diamond',
    unlocked: false,
    starReward: RARITY_REWARDS.diamond,
    conditions: [{
      type: 'composite',
      logic: 'AND',
      conditions: [
        { type: 'count', metric: 'emotional_skills_perfect', operator: '>=', value: 5 },
        { type: 'count', metric: 'social_skills_perfect', operator: '>=', value: 5 },
        { type: 'count', metric: 'cognitive_skills_perfect', operator: '>=', value: 5 },
        { type: 'count', metric: 'behavioral_skills_perfect', operator: '>=', value: 5 },
      ],
    }],
    name: {
      de: 'Fähigkeiten-Perfektionist',
      ar: 'الكمالي في المهارات',
      en: 'Skills Perfectionist',
      tr: 'Beceri Mükemmeliyetçisi',
      ur: 'مہارت کامل پسند',
    },
    description: {
      de: '5 perfekte Quiz in jeder Fähigkeitskategorie',
      ar: '5 اختبارات مثالية في كل فئة مهارات',
      en: '5 perfect quizzes in each skill category',
      tr: 'Her beceri kategorisinde 5 kusursuz test',
      ur: 'ہر مہارت زمرے میں 5 کامل کوئز',
    },
    hint: {
      de: 'Meistere alle Fähigkeitskategorien',
      ar: 'أتقن جميع فئات المهارات',
      en: 'Master all skill categories',
      tr: 'Tüm beceri kategorilerinde ustalaş',
      ur: 'تمام مہارت زمروں میں مہارت حاصل کریں',
    },
  },

];

// Import additional badges
import { ADDITIONAL_BADGES } from './badge-definitions-continued';
import { SPECIAL_BADGES } from './badge-definitions-special';
import { EXTRA_BADGES } from './badge-definitions-extra';

// Combine all badges
export const ALL_BADGES = [...BADGES, ...ADDITIONAL_BADGES, ...SPECIAL_BADGES, ...EXTRA_BADGES];
export const TOTAL_BADGES = ALL_BADGES.length;

// ============================================
// BADGE MANAGER CLASS
// ============================================

export class BadgeManager {
  private storageKey = 'badge-progress';
  private progress: BadgeProgress;

  constructor() {
    this.progress = this.loadProgress();
  }

  private loadProgress(): BadgeProgress {
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
        badges: new Map(Object.entries(parsed.badges || {})),
        pinnedBadges: parsed.pinnedBadges || [],
        statistics: parsed.statistics || this.getDefaultStatistics(),
      };
    } catch (error) {
      console.error('Failed to load badge progress:', error);
      return this.getDefaultProgress();
    }
  }

  private getDefaultProgress(): BadgeProgress {
    return {
      badges: new Map(),
      pinnedBadges: [],
      statistics: this.getDefaultStatistics(),
    };
  }

  private getDefaultStatistics() {
    return {
      totalEarned: 0,
      totalBronze: 0,
      totalSilver: 0,
      totalGold: 0,
      totalPlatinum: 0,
      totalDiamond: 0,
      byCategory: {
        reading: 0,
        skill: 0,
        activity: 0,
        challenge: 0,
        seasonal: 0,
        secret: 0,
      },
    };
  }

  private saveProgress(): void {
    if (typeof window === 'undefined') return;

    const serializable = {
      badges: Object.fromEntries(this.progress.badges),
      pinnedBadges: this.progress.pinnedBadges,
      statistics: this.progress.statistics,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(serializable));
  }

  /**
   * Check and unlock badges based on metrics
   */
  checkBadge(badgeId: string, metrics: Record<string, any>): boolean {
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    if (!badge) return false;

    const existing = this.progress.badges.get(badgeId);
    if (existing?.unlocked) return false; // Already unlocked

    // Evaluate conditions
    const unlocked = this.evaluateConditions(badge.conditions, metrics);

    if (unlocked) {
      return this.unlockBadge(badgeId);
    }

    // Update progress for progressive badges
    this.updateBadgeProgress(badgeId, metrics);
    this.saveProgress();

    return false;
  }

  /**
   * Evaluate badge conditions
   */
  private evaluateConditions(conditions: BadgeCondition[], metrics: Record<string, any>): boolean {
    for (const condition of conditions) {
      if (condition.type === 'composite') {
        const results = condition.conditions!.map(c => this.evaluateSingleCondition(c, metrics));
        if (condition.logic === 'AND') {
          if (!results.every(r => r)) return false;
        } else if (condition.logic === 'OR') {
          if (!results.some(r => r)) return false;
        }
      } else {
        if (!this.evaluateSingleCondition(condition, metrics)) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Evaluate a single condition
   */
  private evaluateSingleCondition(condition: BadgeCondition, metrics: Record<string, any>): boolean {
    const metricValue = metrics[condition.metric];
    if (metricValue === undefined) return false;

    switch (condition.operator) {
      case '>=':
        return metricValue >= condition.value;
      case '<=':
        return metricValue <= condition.value;
      case '==':
        return metricValue === condition.value;
      case '>':
        return metricValue > condition.value;
      case '<':
        return metricValue < condition.value;
      default:
        return false;
    }
  }

  /**
   * Update progress for progressive badges
   */
  private updateBadgeProgress(badgeId: string, metrics: Record<string, any>): void {
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    if (!badge || !badge.progress) return;

    const existing = this.progress.badges.get(badgeId);
    const condition = badge.conditions[0]; // Assume first condition for progress

    if (condition.type === 'count' || condition.type === 'streak' || condition.type === 'score') {
      const current = metrics[condition.metric] || 0;
      const total = typeof condition.value === 'number' ? condition.value : 0;

      this.progress.badges.set(badgeId, {
        unlocked: existing?.unlocked || false,
        earnedAt: existing?.earnedAt,
        progress: { current: Math.min(current, total), total },
      });
    }
  }

  /**
   * Unlock a badge
   */
  private unlockBadge(badgeId: string): boolean {
    const badge = ALL_BADGES.find(b => b.id === badgeId);
    if (!badge) return false;

    const now = Date.now();
    this.progress.badges.set(badgeId, {
      unlocked: true,
      earnedAt: now,
    });

    // Update statistics
    this.progress.statistics.totalEarned++;
    this.progress.statistics.byCategory[badge.category]++;

    // Update rarity statistics
    switch (badge.rarity) {
      case 'bronze':
        this.progress.statistics.totalBronze++;
        break;
      case 'silver':
        this.progress.statistics.totalSilver++;
        break;
      case 'gold':
        this.progress.statistics.totalGold++;
        break;
      case 'platinum':
        this.progress.statistics.totalPlatinum++;
        break;
      case 'diamond':
        this.progress.statistics.totalDiamond++;
        break;
    }

    // Award stars
    starWallet.earnStars('achievement-unlock', badge.starReward);

    // Play effects
    if (typeof window !== 'undefined') {
      confetti.fireworks(3, 500);
      soundEffects.playAchievement();

      // Dispatch event for notification
      window.dispatchEvent(
        new CustomEvent('badge-unlocked', {
          detail: { badge, earnedAt: now },
        })
      );
    }

    this.saveProgress();
    return true;
  }

  /**
   * Get all badges with their unlock status and progress
   */
  getAllBadges(): Badge[] {
    return ALL_BADGES.map(badge => {
      const savedBadge = this.progress.badges.get(badge.id);
      return {
        ...badge,
        unlocked: savedBadge?.unlocked || false,
        earnedAt: savedBadge?.earnedAt,
        progress: savedBadge?.progress || badge.progress,
      };
    });
  }

  /**
   * Get badges by category
   */
  getBadgesByCategory(category: BadgeCategory): Badge[] {
    return this.getAllBadges().filter(b => b.category === category);
  }

  /**
   * Get badges by rarity
   */
  getBadgesByRarity(rarity: BadgeRarity): Badge[] {
    return this.getAllBadges().filter(b => b.rarity === rarity);
  }

  /**
   * Get unlocked badges
   */
  getUnlockedBadges(): Badge[] {
    return this.getAllBadges().filter(b => b.unlocked);
  }

  /**
   * Get locked badges
   */
  getLockedBadges(): Badge[] {
    return this.getAllBadges().filter(b => !b.unlocked);
  }

  /**
   * Get badges by series
   */
  getBadgesBySeries(seriesName: string): Badge[] {
    return this.getAllBadges().filter(b => b.series === seriesName).sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));
  }

  /**
   * Get almost-unlocked badges (80%+ progress)
   */
  getAlmostUnlockedBadges(): Badge[] {
    return this.getAllBadges().filter(b => {
      if (b.unlocked || !b.progress) return false;
      const percent = (b.progress.current / b.progress.total) * 100;
      return percent >= 80;
    });
  }

  /**
   * Pin/unpin badge
   */
  togglePinBadge(badgeId: string): boolean {
    const badge = this.progress.badges.get(badgeId);
    if (!badge?.unlocked) return false;

    const index = this.progress.pinnedBadges.indexOf(badgeId);
    if (index > -1) {
      // Unpin
      this.progress.pinnedBadges.splice(index, 1);
    } else {
      // Pin (max 6)
      if (this.progress.pinnedBadges.length >= 6) {
        return false; // Max pinned reached
      }
      this.progress.pinnedBadges.push(badgeId);
    }

    this.saveProgress();
    return true;
  }

  /**
   * Get pinned badges
   */
  getPinnedBadges(): Badge[] {
    return this.progress.pinnedBadges
      .map(id => ALL_BADGES.find(b => b.id === id))
      .filter((b): b is Badge => b !== undefined);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      ...this.progress.statistics,
      totalBadges: TOTAL_BADGES,
      percentageComplete: (this.progress.statistics.totalEarned / TOTAL_BADGES) * 100,
    };
  }

  /**
   * Search badges
   */
  searchBadges(query: string, locale: string = 'de'): Badge[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllBadges().filter(badge => {
      const name = badge.name[locale as Locale]?.toLowerCase() || '';
      const description = badge.description[locale as Locale]?.toLowerCase() || '';
      return name.includes(lowerQuery) || description.includes(lowerQuery);
    });
  }

  /**
   * Get badge recommendation (what to do next)
   */
  getRecommendations(metrics: Record<string, any>): Badge[] {
    const locked = this.getLockedBadges();

    // Find badges that are close to being unlocked
    const recommendations = locked
      .map(badge => {
        let closeness = 0;

        for (const condition of badge.conditions) {
          if (condition.type === 'count' || condition.type === 'streak' || condition.type === 'score') {
            const current = metrics[condition.metric] || 0;
            const target = typeof condition.value === 'number' ? condition.value : 0;
            if (target > 0) {
              closeness += (current / target) * 100;
            }
          }
        }

        return { badge, closeness };
      })
      .filter(item => item.closeness > 50 && item.closeness < 100)
      .sort((a, b) => b.closeness - a.closeness)
      .map(item => item.badge)
      .slice(0, 5);

    return recommendations;
  }

  /**
   * Reset all progress (for testing)
   */
  reset(): void {
    this.progress = this.getDefaultProgress();
    this.saveProgress();
  }
}

// Global instance
export const badgeManager = new BadgeManager();
