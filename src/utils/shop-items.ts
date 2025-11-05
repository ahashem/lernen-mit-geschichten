/**
 * Shop Items and Inventory Management
 * All purchasable items in the reward shop
 */

import type { Locale } from './i18n';

export type ShopCategory =
  | 'characters'
  | 'themes'
  | 'avatars'
  | 'decorations'
  | 'powerups'
  | 'certificates'
  | 'music'
  | 'stories'
  | 'special';

export type ItemRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface ShopItem {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  price: number;
  category: ShopCategory;
  rarity: ItemRarity;
  preview: string; // SVG icon or image path
  unlocked: boolean;
  equipped?: boolean;
  limited?: {
    until: number; // Timestamp
    quantity?: number;
  };
  new?: boolean;
  sale?: {
    discount: number; // Percentage
    until: number; // Timestamp
  };
}

export interface InventoryItem extends ShopItem {
  purchasedAt: number;
  transactionId: string;
}

// Rarity colors
export const RARITY_COLORS: Record<ItemRarity, string> = {
  common: '#4CAF50', // Green
  rare: '#2196F3', // Blue
  epic: '#9C27B0', // Purple
  legendary: '#FFD700', // Gold
};

// Shop item definitions
export const SHOP_ITEMS: ShopItem[] = [
  // CHARACTERS (100-500 stars)
  {
    id: 'char-mila',
    name: {
      de: 'Mila die Eule',
      ar: 'ميلا البومة',
      en: 'Mila the Owl',
      tr: 'Baykuş Mila',
      ur: 'میلا اُلّو',
    },
    description: {
      de: 'Schalte die weise Eule Mila frei und erlebe ihre spannenden Abenteuer',
      ar: 'افتح البومة الحكيمة ميلا واستمتع بمغامراتها المثيرة',
      en: 'Unlock the wise owl Mila and experience her exciting adventures',
      tr: 'Bilge baykuş Mila\'yı aç ve heyecan dolu maceralarını keşfet',
      ur: 'دانشمند اُلّو میلا کو کھولیں اور اس کی دلچسپ مہم جوئی کا تجربہ کریں',
    },
    price: 100,
    category: 'characters',
    rarity: 'rare',
    preview: '🦉',
    unlocked: false,
  },
  {
    id: 'char-fritz',
    name: {
      de: 'Fritz der Fuchs',
      ar: 'فريتز الثعلب',
      en: 'Fritz the Fox',
      tr: 'Tilki Fritz',
      ur: 'فرٹز لومڑی',
    },
    description: {
      de: 'Entdecke die schlauen Geschichten von Fritz dem Fuchs',
      ar: 'اكتشف قصص فريتز الثعلب الذكية',
      en: 'Discover the clever stories of Fritz the Fox',
      tr: 'Tilki Fritz\'in akıllı hikayelerini keşfet',
      ur: 'فرٹز لومڑی کی چالاک کہانیاں دریافت کریں',
    },
    price: 150,
    category: 'characters',
    rarity: 'rare',
    preview: '🦊',
    unlocked: false,
  },
  {
    id: 'char-holiday',
    name: {
      de: 'Weihnachts-Bär',
      ar: 'دب عيد الميلاد',
      en: 'Christmas Bear',
      tr: 'Noel Ayısı',
      ur: 'کرسمس ریچھ',
    },
    description: {
      de: 'Exklusiver Weihnachts-Charakter mit festlichen Geschichten',
      ar: 'شخصية عيد الميلاد الحصرية مع قصص احتفالية',
      en: 'Exclusive Christmas character with festive stories',
      tr: 'Şenlikli hikayelerle özel Noel karakteri',
      ur: 'تہوار کی کہانیوں کے ساتھ خصوصی کرسمس کردار',
    },
    price: 500,
    category: 'characters',
    rarity: 'legendary',
    preview: '🎅🐻',
    unlocked: false,
    limited: {
      until: new Date('2025-12-31').getTime(),
    },
  },

  // THEMES (50-200 stars)
  {
    id: 'theme-ocean',
    name: {
      de: 'Ozean-Thema',
      ar: 'موضوع المحيط',
      en: 'Ocean Theme',
      tr: 'Okyanus Teması',
      ur: 'سمندر کی تھیم',
    },
    description: {
      de: 'Tauche ein in eine wunderschöne Unterwasserwelt',
      ar: 'انغمس في عالم تحت الماء جميل',
      en: 'Dive into a beautiful underwater world',
      tr: 'Güzel bir su altı dünyasına dalın',
      ur: 'خوبصورت زیر آب دنیا میں غوطہ لگائیں',
    },
    price: 50,
    category: 'themes',
    rarity: 'common',
    preview: '🌊',
    unlocked: false,
  },
  {
    id: 'theme-space',
    name: {
      de: 'Weltraum-Thema',
      ar: 'موضوع الفضاء',
      en: 'Space Theme',
      tr: 'Uzay Teması',
      ur: 'خلائی تھیم',
    },
    description: {
      de: 'Erkunde die Sterne und Galaxien',
      ar: 'استكشف النجوم والمجرات',
      en: 'Explore the stars and galaxies',
      tr: 'Yıldızları ve galaksileri keşfedin',
      ur: 'ستاروں اور کہکشاؤں کو دریافت کریں',
    },
    price: 75,
    category: 'themes',
    rarity: 'rare',
    preview: '🚀',
    unlocked: false,
  },
  {
    id: 'theme-forest',
    name: {
      de: 'Wald-Thema',
      ar: 'موضوع الغابة',
      en: 'Forest Theme',
      tr: 'Orman Teması',
      ur: 'جنگل کی تھیم',
    },
    description: {
      de: 'Erlebe die Magie des Waldes',
      ar: 'اختبر سحر الغابة',
      en: 'Experience the magic of the forest',
      tr: 'Ormanın büyüsünü deneyimleyin',
      ur: 'جنگل کا جادو محسوس کریں',
    },
    price: 50,
    category: 'themes',
    rarity: 'common',
    preview: '🌲',
    unlocked: false,
  },
  {
    id: 'theme-rainbow',
    name: {
      de: 'Regenbogen-Thema',
      ar: 'موضوع قوس قزح',
      en: 'Rainbow Theme',
      tr: 'Gökkuşağı Teması',
      ur: 'قوس قزح کی تھیم',
    },
    description: {
      de: 'Bunte und fröhliche Farben überall',
      ar: 'ألوان ملونة ومبهجة في كل مكان',
      en: 'Colorful and cheerful colors everywhere',
      tr: 'Her yerde renkli ve neşeli renkler',
      ur: 'ہر جگہ رنگین اور خوشگوار رنگ',
    },
    price: 100,
    category: 'themes',
    rarity: 'epic',
    preview: '🌈',
    unlocked: false,
  },
  {
    id: 'theme-gold',
    name: {
      de: 'Gold-Premium-Thema',
      ar: 'موضوع الذهب المميز',
      en: 'Gold Premium Theme',
      tr: 'Altın Premium Tema',
      ur: 'گولڈ پریمیم تھیم',
    },
    description: {
      de: 'Luxuriöses goldenes Design für echte Champions',
      ar: 'تصميم ذهبي فاخر للأبطال الحقيقيين',
      en: 'Luxurious golden design for true champions',
      tr: 'Gerçek şampiyonlar için lüks altın tasarım',
      ur: 'حقیقی چیمپئنز کے لیے شاندار سنہری ڈیزائن',
    },
    price: 200,
    category: 'themes',
    rarity: 'legendary',
    preview: '✨',
    unlocked: false,
  },

  // AVATARS (25-100 stars)
  {
    id: 'avatar-hat-red',
    name: {
      de: 'Roter Hut',
      ar: 'قبعة حمراء',
      en: 'Red Hat',
      tr: 'Kırmızı Şapka',
      ur: 'سرخ ٹوپی',
    },
    description: {
      de: 'Ein schicker roter Hut für deinen Begleiter',
      ar: 'قبعة حمراء أنيقة لرفيقك',
      en: 'A stylish red hat for your companion',
      tr: 'Arkadaşınız için şık bir kırmızı şapka',
      ur: 'آپ کے ساتھی کے لیے ایک سجیلی سرخ ٹوپی',
    },
    price: 25,
    category: 'avatars',
    rarity: 'common',
    preview: '🎩',
    unlocked: false,
  },
  {
    id: 'avatar-glasses',
    name: {
      de: 'Coole Brille',
      ar: 'نظارات رائعة',
      en: 'Cool Glasses',
      tr: 'Havalı Gözlük',
      ur: 'ٹھنڈے چشمے',
    },
    description: {
      de: 'Sonnenbrille für den coolen Look',
      ar: 'نظارات شمسية لإطلالة رائعة',
      en: 'Sunglasses for a cool look',
      tr: 'Havalı bir görünüm için güneş gözlüğü',
      ur: 'ٹھنڈے انداز کے لیے دھوپ کے چشمے',
    },
    price: 30,
    category: 'avatars',
    rarity: 'common',
    preview: '🕶️',
    unlocked: false,
  },
  {
    id: 'avatar-bowtie',
    name: {
      de: 'Elegante Fliege',
      ar: 'ربطة عنق أنيقة',
      en: 'Elegant Bow Tie',
      tr: 'Zarif Papyon',
      ur: 'خوبصورت بو ٹائی',
    },
    description: {
      de: 'Für besonders schicke Anlässe',
      ar: 'للمناسبات الأنيقة بشكل خاص',
      en: 'For especially fancy occasions',
      tr: 'Özellikle şık durumlar için',
      ur: 'خاص طور پر شاندار مواقع کے لیے',
    },
    price: 30,
    category: 'avatars',
    rarity: 'common',
    preview: '🎀',
    unlocked: false,
  },
  {
    id: 'avatar-wings',
    name: {
      de: 'Feenflügel',
      ar: 'أجنحة الجنية',
      en: 'Fairy Wings',
      tr: 'Peri Kanatları',
      ur: 'پری کے پر',
    },
    description: {
      de: 'Magische Flügel zum Fliegen',
      ar: 'أجنحة سحرية للطيران',
      en: 'Magical wings for flying',
      tr: 'Uçmak için sihirli kanatlar',
      ur: 'اڑنے کے لیے جادوئی پر',
    },
    price: 50,
    category: 'avatars',
    rarity: 'rare',
    preview: '🦋',
    unlocked: false,
  },
  {
    id: 'avatar-cape',
    name: {
      de: 'Superhelden-Umhang',
      ar: 'عباءة الأبطال الخارقين',
      en: 'Superhero Cape',
      tr: 'Süper Kahraman Pelerini',
      ur: 'سپر ہیرو کیپ',
    },
    description: {
      de: 'Werde zum Superhelden!',
      ar: 'كن بطلاً خارقًا!',
      en: 'Become a superhero!',
      tr: 'Bir süper kahraman ol!',
      ur: 'ایک سپر ہیرو بنیں!',
    },
    price: 50,
    category: 'avatars',
    rarity: 'rare',
    preview: '🦸',
    unlocked: false,
  },
  {
    id: 'avatar-crown',
    name: {
      de: 'Goldene Krone',
      ar: 'تاج ذهبي',
      en: 'Golden Crown',
      tr: 'Altın Taç',
      ur: 'سونے کا تاج',
    },
    description: {
      de: 'Für echte Könige und Königinnen',
      ar: 'للملوك والملكات الحقيقيين',
      en: 'For true kings and queens',
      tr: 'Gerçek krallar ve kraliçeler için',
      ur: 'حقیقی بادشاہوں اور ملکہ کے لیے',
    },
    price: 100,
    category: 'avatars',
    rarity: 'legendary',
    preview: '👑',
    unlocked: false,
  },

  // DECORATIONS (10-50 stars)
  {
    id: 'deco-stickers-animals',
    name: {
      de: 'Tier-Sticker-Paket',
      ar: 'حزمة ملصقات الحيوانات',
      en: 'Animal Sticker Pack',
      tr: 'Hayvan Çıkartma Paketi',
      ur: 'جانوروں کے اسٹیکر پیک',
    },
    description: {
      de: '20 süße Tier-Sticker',
      ar: '20 ملصق حيوان لطيف',
      en: '20 cute animal stickers',
      tr: '20 sevimli hayvan çıkartması',
      ur: '20 پیارے جانوروں کے اسٹیکر',
    },
    price: 10,
    category: 'decorations',
    rarity: 'common',
    preview: '🐾',
    unlocked: false,
  },
  {
    id: 'deco-stickers-stars',
    name: {
      de: 'Sterne-Sticker-Paket',
      ar: 'حزمة ملصقات النجوم',
      en: 'Star Sticker Pack',
      tr: 'Yıldız Çıkartma Paketi',
      ur: 'ستارہ اسٹیکر پیک',
    },
    description: {
      de: '20 glitzernde Sterne',
      ar: '20 نجمة متلألئة',
      en: '20 sparkling stars',
      tr: '20 parlak yıldız',
      ur: '20 چمکتے ستارے',
    },
    price: 10,
    category: 'decorations',
    rarity: 'common',
    preview: '⭐',
    unlocked: false,
  },
  {
    id: 'deco-border-rainbow',
    name: {
      de: 'Regenbogen-Rahmen',
      ar: 'إطار قوس قزح',
      en: 'Rainbow Border',
      tr: 'Gökkuşağı Çerçevesi',
      ur: 'قوس قزح فریم',
    },
    description: {
      de: 'Bunte Seitenränder',
      ar: 'حواف صفحة ملونة',
      en: 'Colorful page borders',
      tr: 'Renkli sayfa kenarlıkları',
      ur: 'رنگین صفحہ بارڈرز',
    },
    price: 20,
    category: 'decorations',
    rarity: 'common',
    preview: '🎨',
    unlocked: false,
  },
  {
    id: 'deco-confetti',
    name: {
      de: 'Party-Konfetti',
      ar: 'قصاصات الحفلات',
      en: 'Party Confetti',
      tr: 'Parti Konfetisi',
      ur: 'پارٹی کنفیٹی',
    },
    description: {
      de: 'Feiere jeden Erfolg mit Konfetti',
      ar: 'احتفل بكل نجاح بالقصاصات',
      en: 'Celebrate every success with confetti',
      tr: 'Her başarıyı konfeti ile kutlayın',
      ur: 'ہر کامیابی کو کنفیٹی کے ساتھ منائیں',
    },
    price: 15,
    category: 'decorations',
    rarity: 'common',
    preview: '🎊',
    unlocked: false,
  },
  {
    id: 'deco-background-pattern',
    name: {
      de: 'Muster-Hintergrund',
      ar: 'خلفية منقوشة',
      en: 'Pattern Background',
      tr: 'Desenli Arka Plan',
      ur: 'پیٹرن پس منظر',
    },
    description: {
      de: 'Verschiedene Hintergrundmuster',
      ar: 'أنماط خلفية مختلفة',
      en: 'Various background patterns',
      tr: 'Çeşitli arka plan desenleri',
      ur: 'مختلف پس منظر کے نمونے',
    },
    price: 25,
    category: 'decorations',
    rarity: 'rare',
    preview: '🎭',
    unlocked: false,
  },

  // POWERUPS (20-100 stars)
  {
    id: 'power-hint',
    name: {
      de: 'Hinweis-Token',
      ar: 'رمز التلميح',
      en: 'Hint Token',
      tr: 'İpucu Jetonu',
      ur: 'اشارہ ٹوکن',
    },
    description: {
      de: 'Erhalte einen Tipp im Quiz',
      ar: 'احصل على تلميح في الاختبار',
      en: 'Get a hint in the quiz',
      tr: 'Testte ipucu al',
      ur: 'کوئز میں اشارہ حاصل کریں',
    },
    price: 20,
    category: 'powerups',
    rarity: 'common',
    preview: '💡',
    unlocked: false,
  },
  {
    id: 'power-freeze',
    name: {
      de: 'Streak-Freeze',
      ar: 'تجميد السلسلة',
      en: 'Streak Freeze',
      tr: 'Seri Dondurma',
      ur: 'سلسلہ منجمد',
    },
    description: {
      de: 'Rette deine Leseserie für 1 Tag',
      ar: 'احفظ سلسلة القراءة ليوم واحد',
      en: 'Save your reading streak for 1 day',
      tr: 'Okuma serinizi 1 gün boyunca koruyun',
      ur: 'اپنی پڑھنے کی لڑی کو 1 دن کے لیے بچائیں',
    },
    price: 50,
    category: 'powerups',
    rarity: 'rare',
    preview: '❄️',
    unlocked: false,
  },
  {
    id: 'power-autocomplete',
    name: {
      de: 'Auto-Vervollständigung',
      ar: 'الإكمال التلقائي',
      en: 'Auto-Complete',
      tr: 'Otomatik Tamamlama',
      ur: 'آٹو مکمل',
    },
    description: {
      de: 'Überspringe ein Quiz',
      ar: 'تخطي اختبار واحد',
      en: 'Skip one quiz',
      tr: 'Bir testi atla',
      ur: 'ایک کوئز چھوڑیں',
    },
    price: 100,
    category: 'powerups',
    rarity: 'epic',
    preview: '⚡',
    unlocked: false,
  },
  {
    id: 'power-double',
    name: {
      de: 'Doppelsterne',
      ar: 'نجوم مزدوجة',
      en: 'Double Stars',
      tr: 'Çift Yıldız',
      ur: 'دوہرے ستارے',
    },
    description: {
      de: 'Verdiene 2x Sterne für 1 Tag',
      ar: 'احصل على 2x نجوم ليوم واحد',
      en: 'Earn 2x stars for 1 day',
      tr: '1 gün boyunca 2x yıldız kazan',
      ur: '1 دن کے لیے 2x ستارے کمائیں',
    },
    price: 75,
    category: 'powerups',
    rarity: 'epic',
    preview: '✨',
    unlocked: false,
  },

  // CERTIFICATES (30 stars each)
  {
    id: 'cert-reading-master',
    name: {
      de: 'Lese-Meister Zertifikat',
      ar: 'شهادة سيد القراءة',
      en: 'Reading Master Certificate',
      tr: 'Okuma Ustası Sertifikası',
      ur: 'ریڈنگ ماسٹر سرٹیفکیٹ',
    },
    description: {
      de: 'Druckbares Zertifikat für Leseerfolge',
      ar: 'شهادة قابلة للطباعة لإنجازات القراءة',
      en: 'Printable certificate for reading achievements',
      tr: 'Okuma başarıları için yazdırılabilir sertifika',
      ur: 'پڑھنے کی کامیابیوں کے لیے پرنٹ ایبل سرٹیفکیٹ',
    },
    price: 30,
    category: 'certificates',
    rarity: 'rare',
    preview: '📜',
    unlocked: false,
  },
  {
    id: 'cert-quiz-champion',
    name: {
      de: 'Quiz-Champion Zertifikat',
      ar: 'شهادة بطل الاختبار',
      en: 'Quiz Champion Certificate',
      tr: 'Test Şampiyonu Sertifikası',
      ur: 'کوئز چیمپئن سرٹیفکیٹ',
    },
    description: {
      de: 'Für hervorragende Quiz-Leistungen',
      ar: 'لأداء الاختبار المتميز',
      en: 'For outstanding quiz performance',
      tr: 'Olağanüstü test performansı için',
      ur: 'شاندار کوئز کارکردگی کے لیے',
    },
    price: 30,
    category: 'certificates',
    rarity: 'rare',
    preview: '🏆',
    unlocked: false,
  },
];

/**
 * Inventory Manager
 */
export class InventoryManager {
  private storageKey = 'shop-inventory';
  private inventory: InventoryItem[] = [];

  constructor() {
    this.loadInventory();
  }

  private loadInventory(): void {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return;

    try {
      this.inventory = JSON.parse(saved);
    } catch (error) {
      console.error('Failed to load inventory:', error);
      this.inventory = [];
    }
  }

  private saveInventory(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.storageKey, JSON.stringify(this.inventory));
  }

  /**
   * Add item to inventory
   */
  addItem(item: ShopItem, transactionId: string): void {
    const inventoryItem: InventoryItem = {
      ...item,
      unlocked: true,
      purchasedAt: Date.now(),
      transactionId,
    };

    this.inventory.push(inventoryItem);
    this.saveInventory();

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('inventory-update', {
          detail: { action: 'add', item: inventoryItem },
        })
      );
    }
  }

  /**
   * Remove item from inventory (for refunds)
   */
  removeItem(itemId: string): boolean {
    const index = this.inventory.findIndex(item => item.id === itemId);
    if (index === -1) return false;

    const removedItem = this.inventory.splice(index, 1)[0];
    this.saveInventory();

    // Dispatch event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('inventory-update', {
          detail: { action: 'remove', item: removedItem },
        })
      );
    }

    return true;
  }

  /**
   * Check if item is owned
   */
  hasItem(itemId: string): boolean {
    return this.inventory.some(item => item.id === itemId);
  }

  /**
   * Get all owned items
   */
  getAll(): InventoryItem[] {
    return [...this.inventory];
  }

  /**
   * Get items by category
   */
  getByCategory(category: ShopCategory): InventoryItem[] {
    return this.inventory.filter(item => item.category === category);
  }

  /**
   * Get equipped items
   */
  getEquipped(): InventoryItem[] {
    return this.inventory.filter(item => item.equipped);
  }

  /**
   * Equip item
   */
  equipItem(itemId: string): boolean {
    const item = this.inventory.find(i => i.id === itemId);
    if (!item) return false;

    // Unequip other items in same category
    this.inventory.forEach(i => {
      if (i.category === item.category && i.id !== itemId) {
        i.equipped = false;
      }
    });

    item.equipped = true;
    this.saveInventory();

    return true;
  }

  /**
   * Unequip item
   */
  unequipItem(itemId: string): boolean {
    const item = this.inventory.find(i => i.id === itemId);
    if (!item) return false;

    item.equipped = false;
    this.saveInventory();

    return true;
  }

  /**
   * Get statistics
   */
  getStats(): {
    totalItems: number;
    itemsByCategory: Record<ShopCategory, number>;
    totalSpent: number;
    rarityBreakdown: Record<ItemRarity, number>;
  } {
    const itemsByCategory: Record<ShopCategory, number> = {
      characters: 0,
      themes: 0,
      avatars: 0,
      decorations: 0,
      powerups: 0,
      certificates: 0,
      music: 0,
      stories: 0,
      special: 0,
    };

    const rarityBreakdown: Record<ItemRarity, number> = {
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    let totalSpent = 0;

    this.inventory.forEach(item => {
      itemsByCategory[item.category]++;
      rarityBreakdown[item.rarity]++;
      totalSpent += item.price;
    });

    return {
      totalItems: this.inventory.length,
      itemsByCategory,
      totalSpent,
      rarityBreakdown,
    };
  }
}

// Global instance
export const inventory = new InventoryManager();
