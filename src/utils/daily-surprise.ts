/**
 * Daily Surprise System
 * Presents children with daily rotating surprises: featured stories, challenges,
 * lucky wheels, mystery boxes, and special events
 */

import type { Locale } from './i18n';
import { starWallet } from './star-wallet';
import { confetti } from './confetti';

export type SurpriseType =
  | 'featured-story'      // Monday
  | 'mystery-challenge'   // Tuesday
  | 'spin-wheel'          // Wednesday
  | 'character-spotlight' // Thursday
  | 'trivia-quiz'         // Friday
  | 'treasure-hunt'       // Saturday
  | 'bonus-bonanza';      // Sunday

export type WheelPrizeType =
  | 'stars'
  | 'card'
  | 'accessory'
  | 'pet'
  | 'music'
  | 'spin-again';

export type BoxContentType =
  | 'stars'
  | 'card'
  | 'pet-accessory'
  | 'story-unlock'
  | 'avatar-item'
  | 'emoji'
  | 'golden-reward';

export interface WheelPrize {
  id: string;
  type: WheelPrizeType;
  amount?: number; // For stars
  itemName: Record<Locale, string>;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  probability: number; // 0-100
  color: string;
}

export interface MysteryBox {
  id: string;
  date: string;
  type: 'standard' | 'golden';
  opened: boolean;
  contents: {
    type: BoxContentType;
    amount?: number;
    itemId?: string;
    itemName: Record<Locale, string>;
  };
}

export interface DailySurprise {
  id: string;
  date: string; // YYYY-MM-DD
  type: SurpriseType;
  claimed: boolean;
  claimedAt?: number;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  reward?: {
    stars?: number;
    items?: string[];
    special?: string;
  };
}

export interface StreakReward {
  days: number;
  reward: {
    stars?: number;
    item?: string;
    achievement?: string;
  };
  title: Record<Locale, string>;
  description: Record<Locale, string>;
}

export interface DailyStreak {
  currentStreak: number;
  longestStreak: number;
  lastVisit: string; // YYYY-MM-DD
  visitHistory: string[]; // Last 30 days
  milestones: number[]; // Achieved milestones
}

// Wheel prizes configuration
export const WHEEL_PRIZES: WheelPrize[] = [
  {
    id: 'stars-50',
    type: 'stars',
    amount: 50,
    itemName: { de: '50 Sterne', ar: '50 نجمة', en: '50 Stars', tr: '50 Yıldız', ur: '50 ستارے' },
    rarity: 'common',
    probability: 25,
    color: '#FFD93D',
  },
  {
    id: 'stars-100',
    type: 'stars',
    amount: 100,
    itemName: { de: '100 Sterne', ar: '100 نجمة', en: '100 Stars', tr: '100 Yıldız', ur: '100 ستارے' },
    rarity: 'common',
    probability: 20,
    color: '#FF9F40',
  },
  {
    id: 'stars-200',
    type: 'stars',
    amount: 200,
    itemName: { de: '200 Sterne', ar: '200 نجمة', en: '200 Stars', tr: '200 Yıldız', ur: '200 ستارے' },
    rarity: 'rare',
    probability: 15,
    color: '#FF6B35',
  },
  {
    id: 'stars-500',
    type: 'stars',
    amount: 500,
    itemName: { de: '500 Sterne', ar: '500 نجمة', en: '500 Stars', tr: '500 Yıldız', ur: '500 ستارے' },
    rarity: 'legendary',
    probability: 5,
    color: '#FFD700',
  },
  {
    id: 'rare-card',
    type: 'card',
    itemName: { de: 'Seltene Karte', ar: 'بطاقة نادرة', en: 'Rare Card', tr: 'Nadir Kart', ur: 'نایاب کارڈ' },
    rarity: 'rare',
    probability: 12,
    color: '#9B59B6',
  },
  {
    id: 'accessory',
    type: 'accessory',
    itemName: { de: 'Accessoire', ar: 'إكسسوار', en: 'Accessory', tr: 'Aksesuar', ur: 'لوازمات' },
    rarity: 'common',
    probability: 10,
    color: '#3498DB',
  },
  {
    id: 'pet',
    type: 'pet',
    itemName: { de: 'Haustier', ar: 'حيوان أليف', en: 'Pet', tr: 'Evcil Hayvan', ur: 'پالتو جانور' },
    rarity: 'epic',
    probability: 8,
    color: '#E74C3C',
  },
  {
    id: 'music',
    type: 'music',
    itemName: { de: 'Musik-Track', ar: 'مسار موسيقي', en: 'Music Track', tr: 'Müzik Parçası', ur: 'موسیقی ٹریک' },
    rarity: 'rare',
    probability: 10,
    color: '#1ABC9C',
  },
  {
    id: 'spin-again',
    type: 'spin-again',
    itemName: { de: 'Nochmal drehen!', ar: 'دوران مرة أخرى!', en: 'Spin Again!', tr: 'Tekrar Çevir!', ur: 'دوبارہ گھمائیں!' },
    rarity: 'legendary',
    probability: 5,
    color: '#F39C12',
  },
];

// Surprise type templates
const SURPRISE_TEMPLATES: Record<SurpriseType, {
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  emoji: string;
}> = {
  'featured-story': {
    emoji: '⭐',
    title: {
      de: 'Geschichte des Tages',
      ar: 'قصة اليوم',
      en: 'Featured Story',
      tr: 'Günün Hikayesi',
      ur: 'آج کی کہانی',
    },
    description: {
      de: 'Lies diese besondere Geschichte und verdiene doppelte Sterne!',
      ar: 'اقرأ هذه القصة الخاصة واحصل على نجوم مضاعفة!',
      en: 'Read this special story and earn double stars!',
      tr: 'Bu özel hikayeyi oku ve çift yıldız kazan!',
      ur: 'یہ خاص کہانی پڑھیں اور دوگنے ستارے حاصل کریں!',
    },
  },
  'mystery-challenge': {
    emoji: '🎯',
    title: {
      de: 'Geheime Mission',
      ar: 'مهمة سرية',
      en: 'Mystery Challenge',
      tr: 'Gizli Görev',
      ur: 'پراسرار چیلنج',
    },
    description: {
      de: 'Erfülle die mysteriöse Quest und gewinne Bonussterne!',
      ar: 'أكمل المهمة الغامضة واحصل على نجوم إضافية!',
      en: 'Complete the mystery quest and win bonus stars!',
      tr: 'Gizemli görevi tamamla ve bonus yıldızlar kazan!',
      ur: 'پراسرار کوئسٹ مکمل کریں اور بونس ستارے جیتیں!',
    },
  },
  'spin-wheel': {
    emoji: '🎡',
    title: {
      de: 'Glücksrad',
      ar: 'عجلة الحظ',
      en: 'Lucky Wheel',
      tr: 'Şans Çarkı',
      ur: 'قسمت کا پہیہ',
    },
    description: {
      de: 'Drehe das Glücksrad und gewinne fantastische Preise!',
      ar: 'أدر عجلة الحظ واربح جوائز رائعة!',
      en: 'Spin the wheel and win amazing prizes!',
      tr: 'Çarkı çevir ve harika ödüller kazan!',
      ur: 'پہیہ گھمائیں اور حیرت انگیز انعامات جیتیں!',
    },
  },
  'character-spotlight': {
    emoji: '🌟',
    title: {
      de: 'Charakter im Rampenlicht',
      ar: 'شخصية في دائرة الضوء',
      en: 'Character Spotlight',
      tr: 'Karakter Spot',
      ur: 'کردار کی روشنی',
    },
    description: {
      de: 'Lerne heute alles über diesen besonderen Charakter!',
      ar: 'تعلم كل شيء عن هذه الشخصية الخاصة اليوم!',
      en: 'Learn all about this special character today!',
      tr: 'Bugün bu özel karakter hakkında her şeyi öğren!',
      ur: 'آج اس خاص کردار کے بارے میں سب کچھ سیکھیں!',
    },
  },
  'trivia-quiz': {
    emoji: '🧠',
    title: {
      de: 'Mega-Quiz',
      ar: 'اختبار كبير',
      en: 'Trivia Quiz',
      tr: 'Bilgi Yarışması',
      ur: 'معلومات کوئز',
    },
    description: {
      de: '10 Fragen über alle Geschichten - große Belohnung!',
      ar: '10 أسئلة حول جميع القصص - مكافأة كبيرة!',
      en: '10 questions about all stories - big reward!',
      tr: 'Tüm hikayeler hakkında 10 soru - büyük ödül!',
      ur: 'تمام کہانیوں کے بارے میں 10 سوالات - بڑا انعام!',
    },
  },
  'treasure-hunt': {
    emoji: '🗺️',
    title: {
      de: 'Schatzsuche',
      ar: 'البحث عن الكنز',
      en: 'Treasure Hunt',
      tr: 'Hazine Avı',
      ur: 'خزانہ تلاش',
    },
    description: {
      de: 'Finde versteckte Gegenstände in 3 zufälligen Geschichten!',
      ar: 'اعثر على عناصر مخفية في 3 قصص عشوائية!',
      en: 'Find hidden items in 3 random stories!',
      tr: '3 rastgele hikayede gizli eşyaları bul!',
      ur: '3 بے ترتیب کہانیوں میں چھپی چیزیں تلاش کریں!',
    },
  },
  'bonus-bonanza': {
    emoji: '🎁',
    title: {
      de: 'Bonus-Bonanza',
      ar: 'عيد الجوائز',
      en: 'Bonus Bonanza',
      tr: 'Bonus Cümbüşü',
      ur: 'بونس بونانزا',
    },
    description: {
      de: 'Alle Aktivitäten geben heute 50% mehr Sterne!',
      ar: 'جميع الأنشطة تمنح 50% نجوم إضافية اليوم!',
      en: 'All activities give 50% more stars today!',
      tr: 'Tüm aktiviteler bugün %50 daha fazla yıldız veriyor!',
      ur: 'تمام سرگرمیاں آج 50% زیادہ ستارے دیتی ہیں!',
    },
  },
};

// Streak milestones
const STREAK_REWARDS: StreakReward[] = [
  {
    days: 3,
    reward: { stars: 50 },
    title: {
      de: '3-Tage-Serie',
      ar: 'سلسلة 3 أيام',
      en: '3-Day Streak',
      tr: '3 Günlük Seri',
      ur: '3 دن کی لکیر',
    },
    description: {
      de: '50 Bonussterne!',
      ar: '50 نجمة إضافية!',
      en: '50 Bonus Stars!',
      tr: '50 Bonus Yıldız!',
      ur: '50 بونس ستارے!',
    },
  },
  {
    days: 7,
    reward: { stars: 100, item: 'rare-card-pack' },
    title: {
      de: '7-Tage-Serie',
      ar: 'سلسلة 7 أيام',
      en: '7-Day Streak',
      tr: '7 Günlük Seri',
      ur: '7 دن کی لکیر',
    },
    description: {
      de: '100 Sterne + Seltenes Kartenpaket!',
      ar: '100 نجمة + حزمة بطاقات نادرة!',
      en: '100 Stars + Rare Card Pack!',
      tr: '100 Yıldız + Nadir Kart Paketi!',
      ur: '100 ستارے + نایاب کارڈ پیک!',
    },
  },
  {
    days: 14,
    reward: { stars: 200, item: 'exclusive-pet' },
    title: {
      de: '14-Tage-Serie',
      ar: 'سلسلة 14 يومًا',
      en: '14-Day Streak',
      tr: '14 Günlük Seri',
      ur: '14 دن کی لکیر',
    },
    description: {
      de: '200 Sterne + Exklusives Haustier!',
      ar: '200 نجمة + حيوان أليف حصري!',
      en: '200 Stars + Exclusive Pet!',
      tr: '200 Yıldız + Özel Evcil Hayvan!',
      ur: '200 ستارے + خصوصی پالتو جانور!',
    },
  },
  {
    days: 30,
    reward: { stars: 500, item: 'legendary-character-card' },
    title: {
      de: '30-Tage-Serie',
      ar: 'سلسلة 30 يومًا',
      en: '30-Day Streak',
      tr: '30 Günlük Seri',
      ur: '30 دن کی لکیر',
    },
    description: {
      de: '500 Sterne + Legendäre Charakterkarte!',
      ar: '500 نجمة + بطاقة شخصية أسطورية!',
      en: '500 Stars + Legendary Character Card!',
      tr: '500 Yıldız + Efsanevi Karakter Kartı!',
      ur: '500 ستارے + لیجنڈری کردار کارڈ!',
    },
  },
  {
    days: 100,
    reward: { stars: 1000, achievement: 'super-fan' },
    title: {
      de: '100-Tage-Serie',
      ar: 'سلسلة 100 يوم',
      en: '100-Day Streak',
      tr: '100 Günlük Seri',
      ur: '100 دن کی لکیر',
    },
    description: {
      de: '1000 Sterne + "Super-Fan" Auszeichnung + Trophäe!',
      ar: '1000 نجمة + إنجاز "معجب كبير" + كأس!',
      en: '1000 Stars + "Super Fan" Achievement + Trophy!',
      tr: '1000 Yıldız + "Süper Hayran" Başarısı + Kupa!',
      ur: '1000 ستارے + "سپر فین" کامیابی + ٹرافی!',
    },
  },
];

export class DailySurpriseManager {
  private storageKey = 'daily-surprise';
  private streakKey = 'daily-surprise-streak';
  private wheelKey = 'daily-wheel-spin';
  private boxKey = 'daily-mystery-box';

  /**
   * Generate today's surprise based on day of week
   */
  generateDailySurprise(date: Date = new Date()): DailySurprise {
    const dateStr = this.formatDate(date);
    const dayOfWeek = date.getDay();

    // Map day of week to surprise type (0 = Sunday)
    const typeMap: SurpriseType[] = [
      'bonus-bonanza',      // Sunday
      'featured-story',     // Monday
      'mystery-challenge',  // Tuesday
      'spin-wheel',         // Wednesday
      'character-spotlight',// Thursday
      'trivia-quiz',        // Friday
      'treasure-hunt',      // Saturday
    ];

    const type = typeMap[dayOfWeek];
    const template = SURPRISE_TEMPLATES[type];

    // Check if already claimed today
    const saved = this.loadSurprise();
    const claimed = saved?.date === dateStr ? saved.claimed : false;
    const claimedAt = saved?.date === dateStr ? saved.claimedAt : undefined;

    return {
      id: `surprise-${dateStr}`,
      date: dateStr,
      type,
      claimed,
      claimedAt,
      title: template.title,
      description: template.description,
      reward: this.getSurpriseReward(type, date),
    };
  }

  /**
   * Get reward for surprise type
   */
  private getSurpriseReward(type: SurpriseType, date: Date): DailySurprise['reward'] {
    const seed = this.dateSeed(date);

    switch (type) {
      case 'featured-story':
        return { stars: 20, special: '2x stars multiplier' };
      case 'mystery-challenge':
        return { stars: 100 };
      case 'spin-wheel':
        return { special: 'wheel-spin' };
      case 'character-spotlight':
        return { stars: 50, items: ['exclusive-content'] };
      case 'trivia-quiz':
        return { stars: 150 };
      case 'treasure-hunt':
        return { stars: 75, items: ['treasure-badge'] };
      case 'bonus-bonanza':
        return { special: '50% multiplier' };
    }
  }

  /**
   * Claim today's surprise
   */
  claimSurprise(): boolean {
    const surprise = this.generateDailySurprise();
    if (surprise.claimed) return false;

    surprise.claimed = true;
    surprise.claimedAt = Date.now();
    this.saveSurprise(surprise);

    // Award rewards
    if (surprise.reward?.stars) {
      starWallet.earnStars('daily-challenge', surprise.reward.stars);
    }

    // Update streak
    this.updateStreak();

    // Dispatch event
    this.dispatchEvent('surprise-claimed', surprise);

    return true;
  }

  /**
   * Spin the wheel (Wednesday only)
   */
  spinWheel(): WheelPrize | null {
    const today = this.formatDate(new Date());
    const lastSpin = this.loadWheelSpin();

    // Check if already spun today
    if (lastSpin?.date === today) {
      return null;
    }

    // Select prize based on probability
    const prize = this.selectWheelPrize();

    // Save spin
    this.saveWheelSpin(today, prize.id);

    // Award prize
    this.awardWheelPrize(prize);

    // Confetti celebration
    confetti();

    return prize;
  }

  /**
   * Select wheel prize using weighted random
   */
  private selectWheelPrize(): WheelPrize {
    const random = Math.random() * 100;
    let cumulative = 0;

    for (const prize of WHEEL_PRIZES) {
      cumulative += prize.probability;
      if (random <= cumulative) {
        return prize;
      }
    }

    return WHEEL_PRIZES[0]; // Fallback
  }

  /**
   * Award wheel prize to player
   */
  private awardWheelPrize(prize: WheelPrize): void {
    switch (prize.type) {
      case 'stars':
        if (prize.amount) {
          starWallet.earnStars('daily-challenge', prize.amount);
        }
        break;
      case 'spin-again':
        // Allow another spin (handled in UI)
        break;
      case 'card':
      case 'accessory':
      case 'pet':
      case 'music':
        // Add to inventory (handled by shop system)
        this.dispatchEvent('item-won', { prizeId: prize.id, type: prize.type });
        break;
    }
  }

  /**
   * Open daily mystery box
   */
  openMysteryBox(): MysteryBox | null {
    const today = this.formatDate(new Date());
    const saved = this.loadBox();

    // Check if already opened today
    if (saved?.date === today && saved.opened) {
      return null;
    }

    // Determine if golden box (1% chance)
    const isGolden = Math.random() < 0.01;

    // Generate box contents
    const box: MysteryBox = {
      id: `box-${today}`,
      date: today,
      type: isGolden ? 'golden' : 'standard',
      opened: true,
      contents: this.generateBoxContents(isGolden),
    };

    // Save box
    this.saveBox(box);

    // Award contents
    this.awardBoxContents(box.contents);

    // Confetti for golden box
    if (isGolden) {
      confetti();
    }

    return box;
  }

  /**
   * Generate mystery box contents
   */
  private generateBoxContents(isGolden: boolean): MysteryBox['contents'] {
    const random = Math.random();

    if (isGolden) {
      // Golden box always gives premium rewards
      return {
        type: 'golden-reward',
        amount: 1000,
        itemName: {
          de: 'Goldene Belohnung',
          ar: 'مكافأة ذهبية',
          en: 'Golden Reward',
          tr: 'Altın Ödül',
          ur: 'سنہری انعام',
        },
      };
    }

    // Standard box
    if (random < 0.4) {
      // 40% stars
      const amount = [50, 100, 150, 200][Math.floor(Math.random() * 4)];
      return {
        type: 'stars',
        amount,
        itemName: {
          de: `${amount} Sterne`,
          ar: `${amount} نجمة`,
          en: `${amount} Stars`,
          tr: `${amount} Yıldız`,
          ur: `${amount} ستارے`,
        },
      };
    } else if (random < 0.65) {
      // 25% card
      return {
        type: 'card',
        itemId: `card-${Math.floor(Math.random() * 100)}`,
        itemName: {
          de: 'Zufällige Karte',
          ar: 'بطاقة عشوائية',
          en: 'Random Card',
          tr: 'Rastgele Kart',
          ur: 'بے ترتیب کارڈ',
        },
      };
    } else if (random < 0.80) {
      // 15% pet accessory
      return {
        type: 'pet-accessory',
        itemId: `accessory-${Math.floor(Math.random() * 50)}`,
        itemName: {
          de: 'Haustier-Accessoire',
          ar: 'إكسسوار حيوان أليف',
          en: 'Pet Accessory',
          tr: 'Evcil Hayvan Aksesuarı',
          ur: 'پالتو جانور لوازمات',
        },
      };
    } else if (random < 0.90) {
      // 10% avatar item
      return {
        type: 'avatar-item',
        itemId: `avatar-${Math.floor(Math.random() * 30)}`,
        itemName: {
          de: 'Avatar-Artikel',
          ar: 'عنصر الصورة الرمزية',
          en: 'Avatar Item',
          tr: 'Avatar Öğesi',
          ur: 'اوتار آئٹم',
        },
      };
    } else {
      // 10% special emoji
      return {
        type: 'emoji',
        itemId: `emoji-${Math.floor(Math.random() * 20)}`,
        itemName: {
          de: 'Spezielles Emoji',
          ar: 'رمز تعبيري خاص',
          en: 'Special Emoji',
          tr: 'Özel Emoji',
          ur: 'خاص ایموجی',
        },
      };
    }
  }

  /**
   * Award box contents to player
   */
  private awardBoxContents(contents: MysteryBox['contents']): void {
    if (contents.type === 'stars' && contents.amount) {
      starWallet.earnStars('daily-challenge', contents.amount);
    } else {
      // Other items handled by inventory system
      this.dispatchEvent('item-won', {
        itemId: contents.itemId,
        type: contents.type
      });
    }
  }

  /**
   * Update visit streak
   */
  updateStreak(): void {
    const streak = this.loadStreak();
    const today = this.formatDate(new Date());

    // Check if already visited today
    if (streak.lastVisit === today) {
      return;
    }

    // Calculate streak
    if (streak.lastVisit) {
      const daysDiff = this.daysBetween(streak.lastVisit, today);

      if (daysDiff === 1) {
        // Continue streak
        streak.currentStreak++;
      } else if (daysDiff > 1) {
        // Streak broken
        streak.currentStreak = 1;
      }
    } else {
      // First visit
      streak.currentStreak = 1;
    }

    // Update longest streak
    streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);

    // Update visit history
    streak.visitHistory.push(today);
    if (streak.visitHistory.length > 30) {
      streak.visitHistory.shift();
    }

    // Check for milestone rewards
    this.checkStreakMilestones(streak);

    streak.lastVisit = today;
    this.saveStreak(streak);

    // Dispatch event
    this.dispatchEvent('streak-updated', streak);
  }

  /**
   * Check and award streak milestones
   */
  private checkStreakMilestones(streak: DailyStreak): void {
    for (const reward of STREAK_REWARDS) {
      if (
        streak.currentStreak === reward.days &&
        !streak.milestones.includes(reward.days)
      ) {
        streak.milestones.push(reward.days);

        // Award milestone reward
        if (reward.reward.stars) {
          starWallet.earnStars('streak-milestone', reward.reward.stars);
        }

        // Confetti celebration
        confetti();

        // Dispatch milestone event
        this.dispatchEvent('streak-milestone', reward);
      }
    }
  }

  /**
   * Get current streak
   */
  getStreak(): DailyStreak {
    return this.loadStreak();
  }

  /**
   * Get time until next surprise
   */
  getTimeUntilNext(): number {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow.getTime() - now.getTime();
  }

  /**
   * Check if surprise can be claimed today
   */
  canClaimToday(): boolean {
    const surprise = this.generateDailySurprise();
    return !surprise.claimed;
  }

  /**
   * Check if wheel can be spun today
   */
  canSpinWheel(): boolean {
    const today = this.formatDate(new Date());
    const lastSpin = this.loadWheelSpin();
    return lastSpin?.date !== today;
  }

  /**
   * Check if box can be opened today
   */
  canOpenBox(): boolean {
    const today = this.formatDate(new Date());
    const saved = this.loadBox();
    return !saved || saved.date !== today || !saved.opened;
  }

  /**
   * Get surprise calendar (last 30 days)
   */
  getCalendar(): { date: string; visited: boolean; surprise: SurpriseType }[] {
    const calendar: { date: string; visited: boolean; surprise: SurpriseType }[] = [];
    const today = new Date();
    const streak = this.loadStreak();

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = this.formatDate(date);

      calendar.push({
        date: dateStr,
        visited: streak.visitHistory.includes(dateStr),
        surprise: this.getSurpriseTypeForDate(date),
      });
    }

    return calendar;
  }

  /**
   * Get surprise type for any date
   */
  private getSurpriseTypeForDate(date: Date): SurpriseType {
    const dayOfWeek = date.getDay();
    const typeMap: SurpriseType[] = [
      'bonus-bonanza', 'featured-story', 'mystery-challenge',
      'spin-wheel', 'character-spotlight', 'trivia-quiz', 'treasure-hunt'
    ];
    return typeMap[dayOfWeek];
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

  private dispatchEvent(type: string, data: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(`daily-surprise-${type}`, {
          detail: data,
        })
      );
    }
  }

  // LocalStorage methods

  private loadSurprise(): DailySurprise | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(this.storageKey);
    return saved ? JSON.parse(saved) : null;
  }

  private saveSurprise(surprise: DailySurprise): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(surprise));
  }

  private loadStreak(): DailyStreak {
    if (typeof window === 'undefined') {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: '',
        visitHistory: [],
        milestones: [],
      };
    }

    const saved = localStorage.getItem(this.streakKey);
    return saved ? JSON.parse(saved) : {
      currentStreak: 0,
      longestStreak: 0,
      lastVisit: '',
      visitHistory: [],
      milestones: [],
    };
  }

  private saveStreak(streak: DailyStreak): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.streakKey, JSON.stringify(streak));
  }

  private loadWheelSpin(): { date: string; prizeId: string } | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(this.wheelKey);
    return saved ? JSON.parse(saved) : null;
  }

  private saveWheelSpin(date: string, prizeId: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.wheelKey, JSON.stringify({ date, prizeId }));
  }

  private loadBox(): MysteryBox | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(this.boxKey);
    return saved ? JSON.parse(saved) : null;
  }

  private saveBox(box: MysteryBox): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.boxKey, JSON.stringify(box));
  }
}

// Global instance
export const dailySurpriseManager = new DailySurpriseManager();
