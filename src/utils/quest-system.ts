/**
 * Adventure Quest System - RPG Mechanics
 * Comprehensive leveling, XP, skill trees, quests, and progression
 */

import type { Locale } from './i18n';
import { starWallet } from './star-wallet';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

export type QuestType = 'daily' | 'weekly' | 'story' | 'hidden' | 'chain';
export type QuestRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type QuestStatus = 'locked' | 'available' | 'active' | 'completed';

export interface Quest {
  id: string;
  type: QuestType;
  rarity: QuestRarity;
  status: QuestStatus;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: string;
  xpReward: number;
  starReward: number;
  itemRewards?: string[]; // Item IDs
  progress: {
    current: number;
    required: number;
  };
  requirements?: {
    level?: number;
    questsCompleted?: string[]; // Chain prerequisites
    skills?: string[]; // Required skills unlocked
  };
  expiresAt?: number; // Timestamp for daily/weekly quests
  discoveredAt?: number; // For hidden quests
  completedAt?: number;
}

export interface SkillTreeNode {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  category: 'emotional' | 'social' | 'cognitive' | 'behavioral';
  tier: number; // 1-10
  icon: string;
  cost: number; // Skill points needed
  unlocked: boolean;
  position: { x: number; y: number }; // For visual tree layout
  connections: string[]; // IDs of connected nodes
  bonus: {
    type: 'reading_speed' | 'star_multiplier' | 'quiz_hints' | 'unlock_stories' | 'pet_happiness' | 'music_slots' | 'animation_frames' | 'card_power' | 'xp_boost';
    value: number;
  };
}

export interface PlayerProfile {
  username: string;
  title: string;
  titleUnlocked: string[];
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  skillPoints: number;
  unlockedSkills: string[];
  equippedItems: {
    pet?: string;
    charm?: string;
    glasses?: string;
  };
  inventory: PlayerInventoryItem[];
  stats: {
    storiesRead: number;
    quizzesCompleted: number;
    perfectQuizzes: number;
    timePlayed: number; // minutes
    averageReadingSpeed: number; // words per minute
    favoriteSkill: string;
    favoriteCharacter: string;
  };
}

export interface PlayerInventoryItem {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  icon: string;
  rarity: QuestRarity;
  type: 'pet' | 'charm' | 'glasses' | 'book' | 'potion' | 'treasure';
  obtainedAt: number;
  equipped?: boolean;
  bonus?: {
    type: string;
    value: number;
  };
}

export interface SeasonalTrack {
  seasonId: string;
  seasonName: Record<Locale, string>;
  startDate: number;
  endDate: number;
  level: number; // Player's progress in this season (0-30)
  freeTier: TrackReward[];
  premiumTier: TrackReward[];
  premiumUnlocked: boolean;
  premiumCost: number; // In stars
}

export interface TrackReward {
  level: number;
  type: 'stars' | 'item' | 'character' | 'effect' | 'xp';
  amount?: number;
  itemId?: string;
  claimed: boolean;
}

export interface LevelMilestone {
  level: number;
  unlocks: {
    type: 'feature' | 'character' | 'game' | 'story' | 'skill_point';
    id: string;
    name: Record<Locale, string>;
  }[];
}

// ============================================================================
// XP & LEVELING CONFIGURATION
// ============================================================================

export const XP_SOURCES = {
  STORY_READ: 50,
  PERFECT_QUIZ: 100,
  ACHIEVEMENT_UNLOCK: 200,
  DAILY_CHALLENGE: 75,
  QUEST_COMPLETE: 150,
  HIDDEN_QUEST: 300,
  WEEKLY_CHALLENGE: 250,
  STORY_CREATE: 100,
  STORY_SHARE: 50,
  COLORING_COMPLETE: 30,
  GAME_WIN: 40,
} as const;

export const MAX_LEVEL = 50;

// XP required = level² × 100
export function calculateXpForLevel(level: number): number {
  if (level <= 1) return 0;
  return level * level * 100;
}

export function calculateTotalXpForLevel(level: number): number {
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += calculateXpForLevel(i);
  }
  return total;
}

// Milestone unlocks at specific levels
export const LEVEL_MILESTONES: LevelMilestone[] = [
  {
    level: 5,
    unlocks: [
      {
        type: 'feature',
        id: 'story-builder',
        name: {
          de: 'Geschichten-Werkstatt freigeschaltet',
          ar: 'ورشة القصص مفتوحة',
          en: 'Story Builder Unlocked',
          tr: 'Hikaye Oluşturucu Açıldı',
          ur: 'کہانی بنانے والا کھل گیا',
        },
      },
      { type: 'skill_point', id: 'sp-1', name: { de: '+1 Fertigkeitspunkt', ar: '+1 نقطة مهارة', en: '+1 Skill Point', tr: '+1 Yetenek Puanı', ur: '+1 مہارت پوائنٹ' } },
    ],
  },
  {
    level: 10,
    unlocks: [
      {
        type: 'character',
        id: 'dragon-character',
        name: {
          de: 'Drache-Charakter freigeschaltet',
          ar: 'شخصية التنين مفتوحة',
          en: 'Dragon Character Unlocked',
          tr: 'Ejderha Karakteri Açıldı',
          ur: 'ڈریگن کردار کھل گیا',
        },
      },
      { type: 'skill_point', id: 'sp-2', name: { de: '+1 Fertigkeitspunkt', ar: '+1 نقطة مهارة', en: '+1 Skill Point', tr: '+1 Yetenek Puanı', ur: '+1 مہارت پوائنٹ' } },
    ],
  },
  {
    level: 15,
    unlocks: [
      {
        type: 'game',
        id: 'advanced-puzzle',
        name: {
          de: 'Fortgeschrittenes Puzzle freigeschaltet',
          ar: 'اللغز المتقدم مفتوح',
          en: 'Advanced Puzzle Unlocked',
          tr: 'Gelişmiş Bulmaca Açıldı',
          ur: 'جدید پہیلی کھل گئی',
        },
      },
      { type: 'skill_point', id: 'sp-3', name: { de: '+1 Fertigkeitspunkt', ar: '+1 نقطة مهارة', en: '+1 Skill Point', tr: '+1 Yetenek Puanı', ur: '+1 مہارت پوائنٹ' } },
    ],
  },
  {
    level: 20,
    unlocks: [
      {
        type: 'feature',
        id: 'music-studio',
        name: {
          de: 'Musikstudio freigeschaltet',
          ar: 'استوديو الموسيقى مفتوح',
          en: 'Music Studio Unlocked',
          tr: 'Müzik Stüdyosu Açıldı',
          ur: 'موسیقی اسٹوڈیو کھل گیا',
        },
      },
      { type: 'skill_point', id: 'sp-4', name: { de: '+1 Fertigkeitspunkt', ar: '+1 نقطة مهارة', en: '+1 Skill Point', tr: '+1 Yetenek Puanı', ur: '+1 مہارت پوائنٹ' } },
    ],
  },
  {
    level: 25,
    unlocks: [
      {
        type: 'story',
        id: 'legendary-stories',
        name: {
          de: 'Legendäre Geschichten freigeschaltet',
          ar: 'قصص أسطورية مفتوحة',
          en: 'Legendary Stories Unlocked',
          tr: 'Efsanevi Hikayeler Açıldı',
          ur: 'افسانوی کہانیاں کھل گئیں',
        },
      },
      { type: 'skill_point', id: 'sp-5', name: { de: '+1 Fertigkeitspunkt', ar: '+1 نقطة مهارة', en: '+1 Skill Point', tr: '+1 Yetenek Puanı', ur: '+1 مہارت پوائنٹ' } },
    ],
  },
  {
    level: 30,
    unlocks: [
      {
        type: 'feature',
        id: 'battle-pass',
        name: {
          de: 'Battle Pass freigeschaltet',
          ar: 'البطاقة القتالية مفتوحة',
          en: 'Battle Pass Unlocked',
          tr: 'Savaş Geçişi Açıldı',
          ur: 'بیٹل پاس کھل گیا',
        },
      },
      { type: 'skill_point', id: 'sp-6', name: { de: '+1 Fertigkeitspunkt', ar: '+1 نقطة مهارة', en: '+1 Skill Point', tr: '+1 Yetenek Puanı', ur: '+1 مہارت پوائنٹ' } },
    ],
  },
  {
    level: 40,
    unlocks: [
      {
        type: 'character',
        id: 'wizard-character',
        name: {
          de: 'Zauberer-Charakter freigeschaltet',
          ar: 'شخصية الساحر مفتوحة',
          en: 'Wizard Character Unlocked',
          tr: 'Büyücü Karakteri Açıldı',
          ur: 'جادوگر کردار کھل گیا',
        },
      },
      { type: 'skill_point', id: 'sp-7', name: { de: '+1 Fertigkeitspunkt', ar: '+1 نقطة مهارة', en: '+1 Skill Point', tr: '+1 Yetenek Puanı', ur: '+1 مہارت پوائنٹ' } },
    ],
  },
  {
    level: 50,
    unlocks: [
      {
        type: 'feature',
        id: 'master-mode',
        name: {
          de: 'Meister-Modus freigeschaltet',
          ar: 'وضع الماجستير مفتوح',
          en: 'Master Mode Unlocked',
          tr: 'Usta Modu Açıldı',
          ur: 'ماسٹر موڈ کھل گیا',
        },
      },
      { type: 'skill_point', id: 'sp-8', name: { de: '+1 Fertigkeitspunkt', ar: '+1 نقطة مهارة', en: '+1 Skill Point', tr: '+1 Yetenek Puanı', ur: '+1 مہارت پوائنٹ' } },
    ],
  },
];

// Skill points awarded every 2 levels + milestone bonuses
export function calculateSkillPointsForLevel(level: number): number {
  const basePoints = Math.floor(level / 2);
  const milestonePoints = LEVEL_MILESTONES
    .filter(m => m.level <= level)
    .reduce((sum, m) => sum + m.unlocks.filter(u => u.type === 'skill_point').length, 0);
  return basePoints + milestonePoints;
}

// ============================================================================
// TITLE SYSTEM
// ============================================================================

export interface PlayerTitle {
  id: string;
  name: Record<Locale, string>;
  requirement: {
    type: 'level' | 'achievement' | 'quest' | 'stat';
    value: number | string;
  };
  unlocked: boolean;
}

export const PLAYER_TITLES: PlayerTitle[] = [
  {
    id: 'apprentice',
    name: {
      de: 'Lehrlings-Leser',
      ar: 'قارئ متدرب',
      en: 'Apprentice Reader',
      tr: 'Çırak Okuyucu',
      ur: 'تربیت یافتہ قاری',
    },
    requirement: { type: 'level', value: 1 },
    unlocked: true,
  },
  {
    id: 'story-scout',
    name: {
      de: 'Geschichten-Späher',
      ar: 'كشاف القصص',
      en: 'Story Scout',
      tr: 'Hikaye İzci',
      ur: 'کہانی اسکاؤٹ',
    },
    requirement: { type: 'level', value: 10 },
    unlocked: false,
  },
  {
    id: 'tale-master',
    name: {
      de: 'Geschichten-Meister',
      ar: 'سيد الحكايات',
      en: 'Tale Master',
      tr: 'Masal Ustası',
      ur: 'کہانی ماسٹر',
    },
    requirement: { type: 'level', value: 25 },
    unlocked: false,
  },
  {
    id: 'story-scholar',
    name: {
      de: 'Geschichten-Gelehrter',
      ar: 'عالم القصص',
      en: 'Story Scholar',
      tr: 'Hikaye Bilgini',
      ur: 'کہانی عالم',
    },
    requirement: { type: 'level', value: 35 },
    unlocked: false,
  },
  {
    id: 'master-storyteller',
    name: {
      de: 'Meister-Geschichtenerzähler',
      ar: 'راوي القصص الرئيسي',
      en: 'Master Storyteller',
      tr: 'Usta Hikaye Anlatıcısı',
      ur: 'ماسٹر کہانی سنانے والا',
    },
    requirement: { type: 'level', value: 45 },
    unlocked: false,
  },
  {
    id: 'legend',
    name: {
      de: 'Legende',
      ar: 'أسطورة',
      en: 'Legend',
      tr: 'Efsane',
      ur: 'افسانہ',
    },
    requirement: { type: 'level', value: 50 },
    unlocked: false,
  },
  {
    id: 'quiz-master',
    name: {
      de: 'Quiz-Großmeister',
      ar: 'السيد الأعظم للاختبار',
      en: 'Quiz Grandmaster',
      tr: 'Test Büyük Ustası',
      ur: 'کوئز گرینڈ ماسٹر',
    },
    requirement: { type: 'stat', value: 'perfectQuizzes:50' },
    unlocked: false,
  },
  {
    id: 'polyglot',
    name: {
      de: 'Polyglott',
      ar: 'متعدد اللغات',
      en: 'Polyglot',
      tr: 'Çok Dilci',
      ur: 'کثیر اللسانی',
    },
    requirement: { type: 'achievement', value: 'multilingual-master' },
    unlocked: false,
  },
];

// ============================================================================
// SKILL TREE CONFIGURATION
// ============================================================================

export const SKILL_TREE_NODES: SkillTreeNode[] = [
  // EMOTIONAL TREE (10 nodes)
  {
    id: 'emo-1',
    name: { de: 'Lesegeschwindigkeit I', ar: 'سرعة القراءة I', en: 'Reading Speed I', tr: 'Okuma Hızı I', ur: 'پڑھنے کی رفتار I' },
    description: { de: '+10% Lesegeschwindigkeit', ar: '+10% سرعة القراءة', en: '+10% Reading Speed', tr: '+10% Okuma Hızı', ur: '+10% پڑھنے کی رفتار' },
    category: 'emotional',
    tier: 1,
    icon: '📖',
    cost: 1,
    unlocked: false,
    position: { x: 100, y: 50 },
    connections: ['emo-2'],
    bonus: { type: 'reading_speed', value: 10 },
  },
  {
    id: 'emo-2',
    name: { de: 'Lesegeschwindigkeit II', ar: 'سرعة القراءة II', en: 'Reading Speed II', tr: 'Okuma Hızı II', ur: 'پڑھنے کی رفتار II' },
    description: { de: '+20% Lesegeschwindigkeit', ar: '+20% سرعة القراءة', en: '+20% Reading Speed', tr: '+20% Okuma Hızı', ur: '+20% پڑھنے کی رفتار' },
    category: 'emotional',
    tier: 2,
    icon: '📚',
    cost: 2,
    unlocked: false,
    position: { x: 150, y: 100 },
    connections: ['emo-1', 'emo-3'],
    bonus: { type: 'reading_speed', value: 20 },
  },
  {
    id: 'emo-3',
    name: { de: 'Empathie-Boost', ar: 'تعزيز التعاطف', en: 'Empathy Boost', tr: 'Empati Artışı', ur: 'ہمدردی میں اضافہ' },
    description: { de: 'Schalte Empathie-Geschichten frei', ar: 'فتح قصص التعاطف', en: 'Unlock Empathy Stories', tr: 'Empati Hikayelerini Aç', ur: 'ہمدردی کی کہانیاں کھولیں' },
    category: 'emotional',
    tier: 3,
    icon: '💝',
    cost: 2,
    unlocked: false,
    position: { x: 200, y: 150 },
    connections: ['emo-2', 'emo-4'],
    bonus: { type: 'unlock_stories', value: 3 },
  },
  {
    id: 'emo-4',
    name: { de: 'Geduld-Meister', ar: 'سيد الصبر', en: 'Patience Master', tr: 'Sabır Ustası', ur: 'صبر ماسٹر' },
    description: { de: 'Längere Geschichten = mehr XP', ar: 'قصص أطول = المزيد من XP', en: 'Longer stories = more XP', tr: 'Uzun hikayeler = daha fazla XP', ur: 'لمبی کہانیاں = زیادہ XP' },
    category: 'emotional',
    tier: 4,
    icon: '🧘',
    cost: 3,
    unlocked: false,
    position: { x: 250, y: 100 },
    connections: ['emo-3', 'emo-5'],
    bonus: { type: 'xp_boost', value: 15 },
  },
  {
    id: 'emo-5',
    name: { de: 'Gefühls-Guru', ar: 'غورو المشاعر', en: 'Emotion Guru', tr: 'Duygu Gurusu', ur: 'جذبات گرو' },
    description: { de: '+25% Sterne-Multiplikator', ar: '+25% مضاعف النجوم', en: '+25% Star Multiplier', tr: '+25% Yıldız Çarpanı', ur: '+25% ستارے کا ضرب' },
    category: 'emotional',
    tier: 5,
    icon: '⭐',
    cost: 3,
    unlocked: false,
    position: { x: 300, y: 50 },
    connections: ['emo-4', 'emo-6'],
    bonus: { type: 'star_multiplier', value: 25 },
  },
  {
    id: 'emo-6',
    name: { de: 'Impulskontrolle', ar: 'التحكم في الاندفاع', en: 'Impulse Control', tr: 'Dürtü Kontrolü', ur: 'جذباتی قابو' },
    description: { de: 'Schalte Quiz-Hinweise frei', ar: 'فتح تلميحات الاختبار', en: 'Unlock Quiz Hints', tr: 'Test İpuçlarını Aç', ur: 'کوئز اشارے کھولیں' },
    category: 'emotional',
    tier: 6,
    icon: '💡',
    cost: 4,
    unlocked: false,
    position: { x: 350, y: 100 },
    connections: ['emo-5', 'emo-7'],
    bonus: { type: 'quiz_hints', value: 3 },
  },
  {
    id: 'emo-7',
    name: { de: 'Selbstbewusstsein+', ar: 'الوعي الذاتي+', en: 'Self-Awareness+', tr: 'Öz Farkındalık+', ur: 'خود آگاہی+' },
    description: { de: 'Doppelte XP für perfekte Quiz', ar: 'XP مضاعف للاختبارات المثالية', en: 'Double XP for perfect quizzes', tr: 'Mükemmel testler için çift XP', ur: 'کامل کوئز کے لئے دوگنا XP' },
    category: 'emotional',
    tier: 7,
    icon: '🎯',
    cost: 4,
    unlocked: false,
    position: { x: 400, y: 150 },
    connections: ['emo-6', 'emo-8'],
    bonus: { type: 'xp_boost', value: 100 },
  },
  {
    id: 'emo-8',
    name: { de: 'Haustier-Glück', ar: 'سعادة الحيوانات الأليفة', en: 'Pet Happiness', tr: 'Evcil Hayvan Mutluluğu', ur: 'پالتو جانور خوشی' },
    description: { de: '+50% Haustier-Bonusse', ar: '+50% مكافآت الحيوانات الأليفة', en: '+50% Pet bonuses', tr: '+50% Evcil Hayvan bonusları', ur: '+50% پالتو جانور بونس' },
    category: 'emotional',
    tier: 8,
    icon: '🐾',
    cost: 5,
    unlocked: false,
    position: { x: 450, y: 100 },
    connections: ['emo-7', 'emo-9'],
    bonus: { type: 'pet_happiness', value: 50 },
  },
  {
    id: 'emo-9',
    name: { de: 'Gefühlsexperte', ar: 'خبير المشاعر', en: 'Emotion Expert', tr: 'Duygu Uzmanı', ur: 'جذبات ماہر' },
    description: { de: 'Schalte seltene emotionale Geschichten frei', ar: 'فتح قصص عاطفية نادرة', en: 'Unlock rare emotional stories', tr: 'Nadir duygusal hikayeleri aç', ur: 'نایاب جذباتی کہانیاں کھولیں' },
    category: 'emotional',
    tier: 9,
    icon: '🌟',
    cost: 5,
    unlocked: false,
    position: { x: 500, y: 50 },
    connections: ['emo-8', 'emo-10'],
    bonus: { type: 'unlock_stories', value: 5 },
  },
  {
    id: 'emo-10',
    name: { de: 'Emotionale Meisterschaft', ar: 'إتقان عاطفي', en: 'Emotional Mastery', tr: 'Duygusal Ustalık', ur: 'جذباتی مہارت' },
    description: { de: '+50% alle emotionalen Boni', ar: '+50% جميع المكافآت العاطفية', en: '+50% all emotional bonuses', tr: '+50% tüm duygusal bonuslar', ur: '+50% تمام جذباتی بونس' },
    category: 'emotional',
    tier: 10,
    icon: '👑',
    cost: 6,
    unlocked: false,
    position: { x: 550, y: 100 },
    connections: ['emo-9'],
    bonus: { type: 'xp_boost', value: 50 },
  },

  // SOCIAL TREE (10 nodes)
  {
    id: 'soc-1',
    name: { de: 'Kommunikation I', ar: 'التواصل I', en: 'Communication I', tr: 'İletişim I', ur: 'رابطہ I' },
    description: { de: '+10% Teilen-Boni', ar: '+10% مكافآت المشاركة', en: '+10% Sharing bonuses', tr: '+10% Paylaşım bonusları', ur: '+10% شیئرنگ بونس' },
    category: 'social',
    tier: 1,
    icon: '💬',
    cost: 1,
    unlocked: false,
    position: { x: 100, y: 250 },
    connections: ['soc-2'],
    bonus: { type: 'star_multiplier', value: 10 },
  },
  {
    id: 'soc-2',
    name: { de: 'Zusammenarbeit', ar: 'التعاون', en: 'Cooperation', tr: 'İşbirliği', ur: 'تعاون' },
    description: { de: 'Schalte Mehrspieler-Geschichten frei', ar: 'فتح قصص متعددة اللاعبين', en: 'Unlock multiplayer stories', tr: 'Çok oyunculu hikayeleri aç', ur: 'ملٹی پلیئر کہانیاں کھولیں' },
    category: 'social',
    tier: 2,
    icon: '🤝',
    cost: 2,
    unlocked: false,
    position: { x: 150, y: 300 },
    connections: ['soc-1', 'soc-3'],
    bonus: { type: 'unlock_stories', value: 2 },
  },
  {
    id: 'soc-3',
    name: { de: 'Konfliktlösung', ar: 'حل النزاعات', en: 'Conflict Resolution', tr: 'Çatışma Çözümü', ur: 'تنازعات کا حل' },
    description: { de: '+15% XP für schwierige Entscheidungen', ar: '+15% XP للقرارات الصعبة', en: '+15% XP for difficult choices', tr: 'Zor seçimler için +15% XP', ur: 'مشکل انتخابات کے لئے +15% XP' },
    category: 'social',
    tier: 3,
    icon: '⚖️',
    cost: 2,
    unlocked: false,
    position: { x: 200, y: 350 },
    connections: ['soc-2', 'soc-4'],
    bonus: { type: 'xp_boost', value: 15 },
  },
  {
    id: 'soc-4',
    name: { de: 'Führung', ar: 'القيادة', en: 'Leadership', tr: 'Liderlik', ur: 'قیادت' },
    description: { de: 'Verdopple Story-Builder-Slots', ar: 'مضاعفة فتحات بناء القصص', en: 'Double story-builder slots', tr: 'Hikaye oluşturucu slotları ikiye katla', ur: 'کہانی بنانے والے سلاٹ دوگنا' },
    category: 'social',
    tier: 4,
    icon: '👨‍💼',
    cost: 3,
    unlocked: false,
    position: { x: 250, y: 300 },
    connections: ['soc-3', 'soc-5'],
    bonus: { type: 'unlock_stories', value: 5 },
  },
  {
    id: 'soc-5',
    name: { de: 'Respekt-Meister', ar: 'سيد الاحترام', en: 'Respect Master', tr: 'Saygı Ustası', ur: 'احترام ماسٹر' },
    description: { de: '+20% Sterne von Geschichten', ar: '+20% نجوم من القصص', en: '+20% Stars from stories', tr: 'Hikayelerden +20% Yıldız', ur: 'کہانیوں سے +20% ستارے' },
    category: 'social',
    tier: 5,
    icon: '🙏',
    cost: 3,
    unlocked: false,
    position: { x: 300, y: 250 },
    connections: ['soc-4', 'soc-6'],
    bonus: { type: 'star_multiplier', value: 20 },
  },
  {
    id: 'soc-6',
    name: { de: 'Freundschafts-Bonus', ar: 'مكافأة الصداقة', en: 'Friendship Bonus', tr: 'Arkadaşlık Bonusu', ur: 'دوستی بونس' },
    description: { de: '+3 Charakter-Freunde', ar: '+3 أصدقاء الشخصية', en: '+3 Character friends', tr: '+3 Karakter arkadaşı', ur: '+3 کردار دوست' },
    category: 'social',
    tier: 6,
    icon: '👥',
    cost: 4,
    unlocked: false,
    position: { x: 350, y: 300 },
    connections: ['soc-5', 'soc-7'],
    bonus: { type: 'unlock_stories', value: 3 },
  },
  {
    id: 'soc-7',
    name: { de: 'Teilen ist Kümmern', ar: 'المشاركة هي الرعاية', en: 'Sharing is Caring', tr: 'Paylaşmak Sevgidir', ur: 'شیئرنگ فکر ہے' },
    description: { de: 'Doppelte Sterne für geteilte Geschichten', ar: 'نجوم مضاعفة للقصص المشتركة', en: 'Double stars for shared stories', tr: 'Paylaşılan hikayeler için çift yıldız', ur: 'شیئر کی گئی کہانیوں کے لئے دوگنے ستارے' },
    category: 'social',
    tier: 7,
    icon: '🎁',
    cost: 4,
    unlocked: false,
    position: { x: 400, y: 350 },
    connections: ['soc-6', 'soc-8'],
    bonus: { type: 'star_multiplier', value: 100 },
  },
  {
    id: 'soc-8',
    name: { de: 'Gemeinschafts-Champion', ar: 'بطل المجتمع', en: 'Community Champion', tr: 'Topluluk Şampiyonu', ur: 'کمیونٹی چیمپئن' },
    description: { de: 'Schalte Community-Geschichten frei', ar: 'فتح قصص المجتمع', en: 'Unlock community stories', tr: 'Topluluk hikayelerini aç', ur: 'کمیونٹی کہانیاں کھولیں' },
    category: 'social',
    tier: 8,
    icon: '🏘️',
    cost: 5,
    unlocked: false,
    position: { x: 450, y: 300 },
    connections: ['soc-7', 'soc-9'],
    bonus: { type: 'unlock_stories', value: 7 },
  },
  {
    id: 'soc-9',
    name: { de: 'Soziales Genie', ar: 'عبقري اجتماعي', en: 'Social Genius', tr: 'Sosyal Dahi', ur: 'سماجی ذہین' },
    description: { de: '+30% XP für soziale Quests', ar: '+30% XP للمهام الاجتماعية', en: '+30% XP for social quests', tr: 'Sosyal görevler için +30% XP', ur: 'سماجی کوئسٹ کے لئے +30% XP' },
    category: 'social',
    tier: 9,
    icon: '🌟',
    cost: 5,
    unlocked: false,
    position: { x: 500, y: 250 },
    connections: ['soc-8', 'soc-10'],
    bonus: { type: 'xp_boost', value: 30 },
  },
  {
    id: 'soc-10',
    name: { de: 'Soziale Meisterschaft', ar: 'إتقان اجتماعي', en: 'Social Mastery', tr: 'Sosyal Ustalık', ur: 'سماجی مہارت' },
    description: { de: '+50% alle sozialen Boni', ar: '+50% جميع المكافآت الاجتماعية', en: '+50% all social bonuses', tr: '+50% tüm sosyal bonuslar', ur: '+50% تمام سماجی بونس' },
    category: 'social',
    tier: 10,
    icon: '👑',
    cost: 6,
    unlocked: false,
    position: { x: 550, y: 300 },
    connections: ['soc-9'],
    bonus: { type: 'xp_boost', value: 50 },
  },

  // COGNITIVE TREE (10 nodes)
  {
    id: 'cog-1',
    name: { de: 'Problemlösung I', ar: 'حل المشكلات I', en: 'Problem-Solving I', tr: 'Problem Çözme I', ur: 'مسئلہ حل I' },
    description: { de: '+10% Puzzle-Geschwindigkeit', ar: '+10% سرعة الألغاز', en: '+10% Puzzle speed', tr: '+10% Bulmaca hızı', ur: '+10% پہیلی کی رفتار' },
    category: 'cognitive',
    tier: 1,
    icon: '🧩',
    cost: 1,
    unlocked: false,
    position: { x: 100, y: 450 },
    connections: ['cog-2'],
    bonus: { type: 'xp_boost', value: 10 },
  },
  {
    id: 'cog-2',
    name: { de: 'Entscheidungsfindung', ar: 'اتخاذ القرار', en: 'Decision-Making', tr: 'Karar Verme', ur: 'فیصلہ سازی' },
    description: { de: 'Schalte Entscheidungs-Geschichten frei', ar: 'فتح قصص القرار', en: 'Unlock decision stories', tr: 'Karar hikayelerini aç', ur: 'فیصلہ کہانیاں کھولیں' },
    category: 'cognitive',
    tier: 2,
    icon: '🤔',
    cost: 2,
    unlocked: false,
    position: { x: 150, y: 500 },
    connections: ['cog-1', 'cog-3'],
    bonus: { type: 'unlock_stories', value: 3 },
  },
  {
    id: 'cog-3',
    name: { de: 'Kritisches Denken', ar: 'التفكير النقدي', en: 'Critical Thinking', tr: 'Eleştirel Düşünme', ur: 'تنقیدی سوچ' },
    description: { de: '+15% XP für Quiz', ar: '+15% XP للاختبارات', en: '+15% XP for quizzes', tr: 'Testler için +15% XP', ur: 'کوئز کے لئے +15% XP' },
    category: 'cognitive',
    tier: 3,
    icon: '🔍',
    cost: 2,
    unlocked: false,
    position: { x: 200, y: 550 },
    connections: ['cog-2', 'cog-4'],
    bonus: { type: 'xp_boost', value: 15 },
  },
  {
    id: 'cog-4',
    name: { de: 'Anpassungsfähigkeit', ar: 'القدرة على التكيف', en: 'Adaptability', tr: 'Uyum Yeteneği', ur: 'موافقت' },
    description: { de: '+2 Animationsrahmen', ar: '+2 إطارات الرسوم المتحركة', en: '+2 Animation frames', tr: '+2 Animasyon karesi', ur: '+2 حرکت پذیری فریم' },
    category: 'cognitive',
    tier: 4,
    icon: '🔄',
    cost: 3,
    unlocked: false,
    position: { x: 250, y: 500 },
    connections: ['cog-3', 'cog-5'],
    bonus: { type: 'animation_frames', value: 2 },
  },
  {
    id: 'cog-5',
    name: { de: 'Zielsetzung', ar: 'تحديد الأهداف', en: 'Goal-Setting', tr: 'Hedef Belirleme', ur: 'مقصد مقرر کرنا' },
    description: { de: '+3 aktive Quests', ar: '+3 مهام نشطة', en: '+3 Active quests', tr: '+3 Aktif görev', ur: '+3 فعال کوئسٹ' },
    category: 'cognitive',
    tier: 5,
    icon: '🎯',
    cost: 3,
    unlocked: false,
    position: { x: 300, y: 450 },
    connections: ['cog-4', 'cog-6'],
    bonus: { type: 'xp_boost', value: 20 },
  },
  {
    id: 'cog-6',
    name: { de: 'Gedächtnis-Boost', ar: 'تعزيز الذاكرة', en: 'Memory Boost', tr: 'Hafıza Artışı', ur: 'یادداشت میں اضافہ' },
    description: { de: '+25% Memory-Game-Punkte', ar: '+25% نقاط لعبة الذاكرة', en: '+25% Memory game points', tr: '+25% Hafıza oyunu puanı', ur: '+25% میموری گیم پوائنٹس' },
    category: 'cognitive',
    tier: 6,
    icon: '🧠',
    cost: 4,
    unlocked: false,
    position: { x: 350, y: 500 },
    connections: ['cog-5', 'cog-7'],
    bonus: { type: 'xp_boost', value: 25 },
  },
  {
    id: 'cog-7',
    name: { de: 'Muster-Erkennung', ar: 'التعرف على الأنماط', en: 'Pattern Recognition', tr: 'Desen Tanıma', ur: 'نمونہ پہچان' },
    description: { de: 'Schalte versteckte Quests leichter frei', ar: 'فتح المهام المخفية بسهولة', en: 'Unlock hidden quests easier', tr: 'Gizli görevleri daha kolay aç', ur: 'چھپے کوئسٹ آسانی سے کھولیں' },
    category: 'cognitive',
    tier: 7,
    icon: '🔮',
    cost: 4,
    unlocked: false,
    position: { x: 400, y: 550 },
    connections: ['cog-6', 'cog-8'],
    bonus: { type: 'xp_boost', value: 30 },
  },
  {
    id: 'cog-8',
    name: { de: 'Logik-Master', ar: 'سيد المنطق', en: 'Logic Master', tr: 'Mantık Ustası', ur: 'منطق ماسٹر' },
    description: { de: '+3 Quiz-Hinweise pro Tag', ar: '+3 تلميحات اختبار يوميًا', en: '+3 Quiz hints per day', tr: 'Günde +3 test ipucu', ur: 'روزانہ +3 کوئز اشارے' },
    category: 'cognitive',
    tier: 8,
    icon: '💡',
    cost: 5,
    unlocked: false,
    position: { x: 450, y: 500 },
    connections: ['cog-7', 'cog-9'],
    bonus: { type: 'quiz_hints', value: 3 },
  },
  {
    id: 'cog-9',
    name: { de: 'Kreatives Denken', ar: 'التفكير الإبداعي', en: 'Creative Thinking', tr: 'Yaratıcı Düşünme', ur: 'تخلیقی سوچ' },
    description: { de: 'Doppelte XP für Story-Erstellung', ar: 'XP مضاعف لإنشاء القصص', en: 'Double XP for story creation', tr: 'Hikaye oluşturma için çift XP', ur: 'کہانی بنانے کے لئے دوگنا XP' },
    category: 'cognitive',
    tier: 9,
    icon: '✨',
    cost: 5,
    unlocked: false,
    position: { x: 500, y: 450 },
    connections: ['cog-8', 'cog-10'],
    bonus: { type: 'xp_boost', value: 100 },
  },
  {
    id: 'cog-10',
    name: { de: 'Kognitive Meisterschaft', ar: 'إتقان معرفي', en: 'Cognitive Mastery', tr: 'Bilişsel Ustalık', ur: 'ذہنی مہارت' },
    description: { de: '+50% alle kognitiven Boni', ar: '+50% جميع المكافآت المعرفية', en: '+50% all cognitive bonuses', tr: '+50% tüm bilişsel bonuslar', ur: '+50% تمام ذہنی بونس' },
    category: 'cognitive',
    tier: 10,
    icon: '👑',
    cost: 6,
    unlocked: false,
    position: { x: 550, y: 500 },
    connections: ['cog-9'],
    bonus: { type: 'xp_boost', value: 50 },
  },

  // BEHAVIORAL TREE (10 nodes)
  {
    id: 'beh-1',
    name: { de: 'Verantwortung I', ar: 'المسؤولية I', en: 'Responsibility I', tr: 'Sorumluluk I', ur: 'ذمہ داری I' },
    description: { de: '+10% tägliche Quest-Belohnungen', ar: '+10% مكافآت المهام اليومية', en: '+10% Daily quest rewards', tr: '+10% Günlük görev ödülleri', ur: '+10% روزانہ کوئسٹ انعامات' },
    category: 'behavioral',
    tier: 1,
    icon: '📅',
    cost: 1,
    unlocked: false,
    position: { x: 100, y: 650 },
    connections: ['beh-2'],
    bonus: { type: 'xp_boost', value: 10 },
  },
  {
    id: 'beh-2',
    name: { de: 'Ehrlichkeit', ar: 'الصدق', en: 'Honesty', tr: 'Dürüstlük', ur: 'ایمانداری' },
    description: { de: '+15% Sterne für Wahrheits-Antworten', ar: '+15% نجوم لإجابات الصدق', en: '+15% Stars for truth answers', tr: 'Gerçek cevaplar için +15% Yıldız', ur: 'سچ جوابات کے لئے +15% ستارے' },
    category: 'behavioral',
    tier: 2,
    icon: '💎',
    cost: 2,
    unlocked: false,
    position: { x: 150, y: 700 },
    connections: ['beh-1', 'beh-3'],
    bonus: { type: 'star_multiplier', value: 15 },
  },
  {
    id: 'beh-3',
    name: { de: 'Durchhaltevermögen', ar: 'المثابرة', en: 'Persistence', tr: 'Sebat', ur: 'استقامت' },
    description: { de: '+20% XP-Boost nach Fehlern', ar: '+20% تعزيز XP بعد الأخطاء', en: '+20% XP boost after mistakes', tr: 'Hatalardan sonra +20% XP artışı', ur: 'غلطیوں کے بعد +20% XP بوسٹ' },
    category: 'behavioral',
    tier: 3,
    icon: '💪',
    cost: 2,
    unlocked: false,
    position: { x: 200, y: 750 },
    connections: ['beh-2', 'beh-4'],
    bonus: { type: 'xp_boost', value: 20 },
  },
  {
    id: 'beh-4',
    name: { de: 'Selbstdisziplin', ar: 'الانضباط الذاتي', en: 'Self-Discipline', tr: 'Öz Disiplin', ur: 'خود نظم و ضبط' },
    description: { de: 'Verdopple Streak-Boni', ar: 'مضاعفة مكافآت السلسلة', en: 'Double streak bonuses', tr: 'Seri bonuslarını ikiye katla', ur: 'سلسلہ بونس دوگنا' },
    category: 'behavioral',
    tier: 4,
    icon: '🎖️',
    cost: 3,
    unlocked: false,
    position: { x: 250, y: 700 },
    connections: ['beh-3', 'beh-5'],
    bonus: { type: 'xp_boost', value: 50 },
  },
  {
    id: 'beh-5',
    name: { de: 'Zeitmanagement', ar: 'إدارة الوقت', en: 'Time Management', tr: 'Zaman Yönetimi', ur: 'وقت کا انتظام' },
    description: { de: '+2 Musikerstellungs-Slots', ar: '+2 فتحات إنشاء الموسيقى', en: '+2 Music creation slots', tr: '+2 Müzik oluşturma slotu', ur: '+2 موسیقی بنانے کے سلاٹ' },
    category: 'behavioral',
    tier: 5,
    icon: '⏰',
    cost: 3,
    unlocked: false,
    position: { x: 300, y: 650 },
    connections: ['beh-4', 'beh-6'],
    bonus: { type: 'music_slots', value: 2 },
  },
  {
    id: 'beh-6',
    name: { de: 'Gewohnheits-Builder', ar: 'بناء العادات', en: 'Habit Builder', tr: 'Alışkanlık Oluşturucu', ur: 'عادت بنانے والا' },
    description: { de: '+1 Streak-Freeze pro Woche', ar: '+1 تجميد السلسلة أسبوعيًا', en: '+1 Streak freeze per week', tr: 'Haftada +1 Seri dondurma', ur: 'ہفتہ وار +1 سلسلہ منجمد' },
    category: 'behavioral',
    tier: 6,
    icon: '❄️',
    cost: 4,
    unlocked: false,
    position: { x: 350, y: 700 },
    connections: ['beh-5', 'beh-7'],
    bonus: { type: 'xp_boost', value: 25 },
  },
  {
    id: 'beh-7',
    name: { de: 'Konsistenz-König', ar: 'ملك الاتساق', en: 'Consistency King', tr: 'Tutarlılık Kralı', ur: 'مستقل مزاجی بادشاہ' },
    description: { de: '+30% XP für 7-Tage-Streak', ar: '+30% XP لسلسلة 7 أيام', en: '+30% XP for 7-day streak', tr: '7 günlük seri için +30% XP', ur: '7 دن سلسلہ کے لئے +30% XP' },
    category: 'behavioral',
    tier: 7,
    icon: '🔥',
    cost: 4,
    unlocked: false,
    position: { x: 400, y: 750 },
    connections: ['beh-6', 'beh-8'],
    bonus: { type: 'xp_boost', value: 30 },
  },
  {
    id: 'beh-8',
    name: { de: 'Fokus-Master', ar: 'سيد التركيز', en: 'Focus Master', tr: 'Odaklanma Ustası', ur: 'توجہ ماسٹر' },
    description: { de: 'Entferne Ablenkungen automatisch', ar: 'إزالة التشتيت تلقائيًا', en: 'Auto-remove distractions', tr: 'Dikkat dağıtıcıları otomatik kaldır', ur: 'خلفشار خودکار ہٹائیں' },
    category: 'behavioral',
    tier: 8,
    icon: '🧘‍♂️',
    cost: 5,
    unlocked: false,
    position: { x: 450, y: 700 },
    connections: ['beh-7', 'beh-9'],
    bonus: { type: 'xp_boost', value: 35 },
  },
  {
    id: 'beh-9',
    name: { de: 'Verhaltens-Champion', ar: 'بطل السلوك', en: 'Behavior Champion', tr: 'Davranış Şampiyonu', ur: 'رویہ چیمپئن' },
    description: { de: '+2 Kartenstärke', ar: '+2 قوة البطاقة', en: '+2 Card power', tr: '+2 Kart gücü', ur: '+2 کارڈ طاقت' },
    category: 'behavioral',
    tier: 9,
    icon: '🃏',
    cost: 5,
    unlocked: false,
    position: { x: 500, y: 650 },
    connections: ['beh-8', 'beh-10'],
    bonus: { type: 'card_power', value: 2 },
  },
  {
    id: 'beh-10',
    name: { de: 'Verhaltens-Meisterschaft', ar: 'إتقان السلوك', en: 'Behavioral Mastery', tr: 'Davranışsal Ustalık', ur: 'رویہ مہارت' },
    description: { de: '+50% alle Verhaltens-Boni', ar: '+50% جميع مكافآت السلوك', en: '+50% all behavioral bonuses', tr: '+50% tüm davranışsal bonuslar', ur: '+50% تمام رویہ بونس' },
    category: 'behavioral',
    tier: 10,
    icon: '👑',
    cost: 6,
    unlocked: false,
    position: { x: 550, y: 700 },
    connections: ['beh-9'],
    bonus: { type: 'xp_boost', value: 50 },
  },
];

export const SKILL_TREE_RESET_COST = 500; // Stars

// ============================================================================
// QUEST MANAGER CLASS
// ============================================================================

export class QuestManager {
  private storageKey = 'adventure-quests';
  private profileKey = 'player-profile';
  private seasonKey = 'seasonal-track';

  /**
   * Get player profile
   */
  getPlayerProfile(): PlayerProfile {
    if (typeof window === 'undefined') {
      return this.getDefaultProfile();
    }

    const saved = localStorage.getItem(this.profileKey);
    if (!saved) {
      return this.getDefaultProfile();
    }

    try {
      return JSON.parse(saved);
    } catch {
      return this.getDefaultProfile();
    }
  }

  private getDefaultProfile(): PlayerProfile {
    return {
      username: 'Abenteurer',
      title: 'apprentice',
      titleUnlocked: ['apprentice'],
      avatar: '🐻',
      level: 1,
      xp: 0,
      xpToNextLevel: calculateXpForLevel(2),
      totalXp: 0,
      skillPoints: 0,
      unlockedSkills: [],
      equippedItems: {},
      inventory: [],
      stats: {
        storiesRead: 0,
        quizzesCompleted: 0,
        perfectQuizzes: 0,
        timePlayed: 0,
        averageReadingSpeed: 0,
        favoriteSkill: '',
        favoriteCharacter: '',
      },
    };
  }

  /**
   * Save player profile
   */
  private saveProfile(profile: PlayerProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.profileKey, JSON.stringify(profile));
    this.dispatchProfileUpdate(profile);
  }

  /**
   * Award XP to player
   */
  awardXP(amount: number, reason: string): {
    leveledUp: boolean;
    newLevel?: number;
    skillPointsAwarded?: number;
    unlockedFeatures?: LevelMilestone;
  } {
    const profile = this.getPlayerProfile();

    profile.xp += amount;
    profile.totalXp += amount;

    const result: any = { leveledUp: false };

    // Check for level up
    while (profile.xp >= profile.xpToNextLevel && profile.level < MAX_LEVEL) {
      profile.xp -= profile.xpToNextLevel;
      profile.level++;
      result.leveledUp = true;
      result.newLevel = profile.level;

      // Calculate new XP requirement
      profile.xpToNextLevel = calculateXpForLevel(profile.level + 1);

      // Award skill points (every 2 levels)
      if (profile.level % 2 === 0) {
        profile.skillPoints++;
        result.skillPointsAwarded = (result.skillPointsAwarded || 0) + 1;
      }

      // Check for milestone unlocks
      const milestone = LEVEL_MILESTONES.find(m => m.level === profile.level);
      if (milestone) {
        result.unlockedFeatures = milestone;
        // Award bonus skill points from milestones
        const bonusSkillPoints = milestone.unlocks.filter(u => u.type === 'skill_point').length;
        profile.skillPoints += bonusSkillPoints;
        result.skillPointsAwarded = (result.skillPointsAwarded || 0) + bonusSkillPoints;
      }

      // Check for title unlocks
      PLAYER_TITLES.forEach(title => {
        if (title.requirement.type === 'level' &&
            title.requirement.value === profile.level &&
            !profile.titleUnlocked.includes(title.id)) {
          profile.titleUnlocked.push(title.id);
          profile.title = title.id; // Auto-equip new title
        }
      });
    }

    this.saveProfile(profile);

    // Dispatch XP gain event
    this.dispatchXPGain(amount, reason, result);

    return result;
  }

  /**
   * Get skill tree nodes
   */
  getSkillTree(): SkillTreeNode[] {
    const profile = this.getPlayerProfile();
    return SKILL_TREE_NODES.map(node => ({
      ...node,
      unlocked: profile.unlockedSkills.includes(node.id),
    }));
  }

  /**
   * Unlock skill
   */
  unlockSkill(skillId: string): { success: boolean; message: string } {
    const profile = this.getPlayerProfile();
    const skill = SKILL_TREE_NODES.find(s => s.id === skillId);

    if (!skill) {
      return { success: false, message: 'Skill not found' };
    }

    if (profile.unlockedSkills.includes(skillId)) {
      return { success: false, message: 'Already unlocked' };
    }

    if (profile.skillPoints < skill.cost) {
      return { success: false, message: 'Not enough skill points' };
    }

    // Check if prerequisites are met (connected skills must be unlocked)
    const prerequisitesMet = skill.connections.length === 0 ||
      skill.connections.some(connId => profile.unlockedSkills.includes(connId));

    if (!prerequisitesMet) {
      return { success: false, message: 'Prerequisites not met' };
    }

    // Unlock skill
    profile.skillPoints -= skill.cost;
    profile.unlockedSkills.push(skillId);
    this.saveProfile(profile);

    this.dispatchSkillUnlock(skill);

    return { success: true, message: 'Skill unlocked!' };
  }

  /**
   * Reset skill tree
   */
  resetSkillTree(): { success: boolean; message: string } {
    const currentStars = starWallet.getBalance();

    if (currentStars < SKILL_TREE_RESET_COST) {
      return { success: false, message: 'Not enough stars' };
    }

    const profile = this.getPlayerProfile();
    const refundedPoints = profile.unlockedSkills.reduce((sum, skillId) => {
      const skill = SKILL_TREE_NODES.find(s => s.id === skillId);
      return sum + (skill?.cost || 0);
    }, 0);

    // Spend stars
    starWallet.spendStars(SKILL_TREE_RESET_COST, 'skill-reset', 'Skill Tree Reset');

    // Reset skills
    profile.unlockedSkills = [];
    profile.skillPoints += refundedPoints;
    this.saveProfile(profile);

    return { success: true, message: `Refunded ${refundedPoints} skill points!` };
  }

  /**
   * Get active quests
   */
  getActiveQuests(): Quest[] {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return [];

    try {
      const quests: Quest[] = JSON.parse(saved);
      return quests.filter(q => q.status === 'active' || q.status === 'available');
    } catch {
      return [];
    }
  }

  /**
   * Update quest progress
   */
  updateQuestProgress(questId: string, amount: number = 1): boolean {
    const quests = this.getActiveQuests();
    const quest = quests.find(q => q.id === questId);

    if (!quest || quest.status === 'completed') return false;

    quest.progress.current = Math.min(
      quest.progress.current + amount,
      quest.progress.required
    );

    if (quest.progress.current >= quest.progress.required) {
      quest.status = 'completed';
      quest.completedAt = Date.now();

      // Award rewards
      this.awardXP(quest.xpReward, `Quest: ${questId}`);
      starWallet.earnStars('quest-completion' as any, quest.starReward);

      // Add items to inventory
      if (quest.itemRewards && quest.itemRewards.length > 0) {
        this.addItemsToInventory(quest.itemRewards);
      }

      this.dispatchQuestComplete(quest);
    }

    this.saveQuests(quests);
    return quest.status === 'completed';
  }

  private saveQuests(quests: Quest[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(quests));
  }

  private addItemsToInventory(itemIds: string[]): void {
    // Placeholder - would load item definitions and add to profile
    const profile = this.getPlayerProfile();
    // Add items logic here
    this.saveProfile(profile);
  }

  /**
   * Seasonal Battle Pass
   */
  getSeasonalTrack(): SeasonalTrack {
    if (typeof window === 'undefined') {
      return this.getDefaultSeason();
    }

    const saved = localStorage.getItem(this.seasonKey);
    if (!saved) {
      return this.getDefaultSeason();
    }

    try {
      return JSON.parse(saved);
    } catch {
      return this.getDefaultSeason();
    }
  }

  private getDefaultSeason(): SeasonalTrack {
    const now = Date.now();
    const thirtyDaysLater = now + 30 * 24 * 60 * 60 * 1000;

    return {
      seasonId: 'season-1',
      seasonName: {
        de: 'Abenteuer-Saison 1',
        ar: 'موسم المغامرة 1',
        en: 'Adventure Season 1',
        tr: 'Macera Sezonu 1',
        ur: 'ایڈونچر سیزن 1',
      },
      startDate: now,
      endDate: thirtyDaysLater,
      level: 0,
      freeTier: this.generateTrackRewards('free'),
      premiumTier: this.generateTrackRewards('premium'),
      premiumUnlocked: false,
      premiumCost: 1000,
    };
  }

  private generateTrackRewards(tier: 'free' | 'premium'): TrackReward[] {
    const rewards: TrackReward[] = [];
    const maxLevel = 30;

    for (let i = 1; i <= maxLevel; i++) {
      if (tier === 'free') {
        // Free tier: Basic rewards every 5 levels
        if (i % 5 === 0) {
          rewards.push({
            level: i,
            type: i % 10 === 0 ? 'item' : 'stars',
            amount: i % 10 === 0 ? undefined : 50,
            itemId: i % 10 === 0 ? `free-item-${i}` : undefined,
            claimed: false,
          });
        }
      } else {
        // Premium tier: Rewards every level
        const rewardType = i % 10 === 0 ? 'character' :
                          i % 5 === 0 ? 'item' :
                          i % 3 === 0 ? 'effect' : 'stars';
        rewards.push({
          level: i,
          type: rewardType,
          amount: rewardType === 'stars' ? 100 : undefined,
          itemId: rewardType !== 'stars' ? `premium-${rewardType}-${i}` : undefined,
          claimed: false,
        });
      }
    }

    return rewards;
  }

  // Event dispatchers
  private dispatchProfileUpdate(profile: PlayerProfile): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('profile-update', { detail: profile }));
    }
  }

  private dispatchXPGain(amount: number, reason: string, result: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('xp-gain', {
        detail: { amount, reason, result }
      }));
    }
  }

  private dispatchSkillUnlock(skill: SkillTreeNode): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('skill-unlock', { detail: skill }));
    }
  }

  private dispatchQuestComplete(quest: Quest): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('quest-complete', { detail: quest }));
    }
  }
}

// Global instance
export const questManager = new QuestManager();
