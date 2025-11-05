/**
 * Print Card Generator
 * Generates printable story cards in various formats with beautiful designs
 */

export type CardFormat = 'trading' | 'postcard' | 'bookmark';
export type CardDesign = 'colorful' | 'minimal' | 'elegant' | 'playful' | 'nature' | 'gradient';
export type CardRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface CardDimensions {
  width: number; // in inches
  height: number; // in inches
  ppi: number; // pixels per inch
}

export const CARD_FORMATS: Record<CardFormat, CardDimensions> = {
  trading: { width: 2.5, height: 3.5, ppi: 300 },
  postcard: { width: 4, height: 6, ppi: 300 },
  bookmark: { width: 2, height: 7, ppi: 300 },
};

export interface StoryCardData {
  storyId: string;
  title: string;
  emoji: string;
  characterType?: string;
  skills: string[];
  keyMessage: string;
  funFact?: string;
  quizQuestion?: {
    text: string;
    answer: string;
  };
  author?: string;
  completionDate?: Date;
  rarity: CardRarity;
}

export interface CardDesignOptions {
  format: CardFormat;
  design: CardDesign;
  backgroundColor?: string;
  patternColor?: string;
  borderColor?: string;
  includeQRCode: boolean;
  qrCodeUrl?: string;
  showBackSide: boolean;
}

export interface PrintLayoutOptions {
  cardsPerPage: 4 | 9;
  paperSize: 'A4' | 'Letter';
  includeGuideLines: boolean;
  includeBleed: boolean;
}

/**
 * Get rarity based on story completion stats
 */
export function calculateCardRarity(completionStats: {
  timesRead: number;
  quizScore: number;
  achievementUnlocked: boolean;
}): CardRarity {
  const { timesRead, quizScore, achievementUnlocked } = completionStats;

  if (achievementUnlocked && quizScore === 100 && timesRead >= 5) {
    return 'legendary';
  } else if (quizScore === 100 && timesRead >= 3) {
    return 'epic';
  } else if (quizScore >= 80 || timesRead >= 2) {
    return 'rare';
  }
  return 'common';
}

/**
 * Get design theme colors
 */
export function getDesignTheme(design: CardDesign): {
  background: string;
  pattern: string;
  border: string;
  accent: string;
  text: string;
} {
  const themes = {
    colorful: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pattern: '#ffffff20',
      border: '#667eea',
      accent: '#FFD93D',
      text: '#ffffff',
    },
    minimal: {
      background: '#ffffff',
      pattern: '#00000008',
      border: '#333333',
      accent: '#FF9F40',
      text: '#333333',
    },
    elegant: {
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      pattern: '#00000010',
      border: '#8b9dc3',
      accent: '#6BCF7F',
      text: '#2c3e50',
    },
    playful: {
      background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      pattern: '#ffffff30',
      border: '#ff9a76',
      accent: '#FF6B9D',
      text: '#333333',
    },
    nature: {
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      pattern: '#ffffff25',
      border: '#6bcf7f',
      accent: '#4CAF50',
      text: '#2d5016',
    },
    gradient: {
      background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      pattern: '#ffffff20',
      border: '#fa709a',
      accent: '#fee140',
      text: '#ffffff',
    },
  };

  return themes[design];
}

/**
 * Get rarity styling
 */
export function getRarityStyle(rarity: CardRarity): {
  color: string;
  glow: string;
  label: { de: string; ar: string; en: string; tr: string; ur: string };
} {
  const styles = {
    common: {
      color: '#9ca3af',
      glow: '0 0 10px rgba(156, 163, 175, 0.3)',
      label: {
        de: 'Gewöhnlich',
        ar: 'شائع',
        en: 'Common',
        tr: 'Yaygın',
        ur: 'عام',
      },
    },
    rare: {
      color: '#3b82f6',
      glow: '0 0 15px rgba(59, 130, 246, 0.5)',
      label: {
        de: 'Selten',
        ar: 'نادر',
        en: 'Rare',
        tr: 'Nadir',
        ur: 'نایاب',
      },
    },
    epic: {
      color: '#a855f7',
      glow: '0 0 20px rgba(168, 85, 247, 0.6)',
      label: {
        de: 'Episch',
        ar: 'ملحمي',
        en: 'Epic',
        tr: 'Destansı',
        ur: 'شاندار',
      },
    },
    legendary: {
      color: '#f59e0b',
      glow: '0 0 25px rgba(245, 158, 11, 0.8)',
      label: {
        de: 'Legendär',
        ar: 'أسطوري',
        en: 'Legendary',
        tr: 'Efsanevi',
        ur: 'افسانوی',
      },
    },
  };

  return styles[rarity];
}

/**
 * Generate SVG pattern for card background
 */
export function generatePattern(type: 'dots' | 'waves' | 'stars' | 'hearts' | 'geometric'): string {
  const patterns = {
    dots: `
      <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.2"/>
      </pattern>
    `,
    waves: `
      <pattern id="waves" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <path d="M 0 10 Q 10 5, 20 10 T 40 10" stroke="currentColor" fill="none" opacity="0.2" stroke-width="2"/>
      </pattern>
    `,
    stars: `
      <pattern id="stars" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 15 5 L 17 12 L 24 12 L 18 17 L 20 24 L 15 19 L 10 24 L 12 17 L 6 12 L 13 12 Z" fill="currentColor" opacity="0.15"/>
      </pattern>
    `,
    hearts: `
      <pattern id="hearts" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 15 25 C 10 20, 5 15, 10 10 C 12 8, 14 8, 15 10 C 16 8, 18 8, 20 10 C 25 15, 20 20, 15 25 Z" fill="currentColor" opacity="0.12"/>
      </pattern>
    `,
    geometric: `
      <pattern id="geometric" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
        <rect x="0" y="0" width="20" height="20" fill="currentColor" opacity="0.05"/>
        <rect x="20" y="20" width="20" height="20" fill="currentColor" opacity="0.05"/>
      </pattern>
    `,
  };

  return patterns[type];
}

/**
 * Generate QR code data URL using qr-code.ts utility
 */
export function generateQRCodeDataURL(url: string): string {
  // Use the QR code utility to generate a canvas
  import('./qr-code').then(({ generateQRCanvas }) => {
    const canvas = generateQRCanvas(url, { size: 200, margin: 4 });
    return canvas.toDataURL('image/png');
  });

  // Fallback placeholder for SSR
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect width="100" height="100" fill="white"/>
      <rect x="10" y="10" width="30" height="30" fill="black"/>
      <rect x="60" y="10" width="30" height="30" fill="black"/>
      <rect x="10" y="60" width="30" height="30" fill="black"/>
      <rect x="45" y="45" width="10" height="10" fill="black"/>
    </svg>
  `)}`;
}

/**
 * Convert dimensions to pixels
 */
export function dimensionsToPixels(format: CardFormat): { width: number; height: number } {
  const { width, height, ppi } = CARD_FORMATS[format];
  return {
    width: width * ppi,
    height: height * ppi,
  };
}

/**
 * Get page dimensions in pixels
 */
export function getPageDimensions(paperSize: 'A4' | 'Letter'): { width: number; height: number } {
  const sizes = {
    A4: { width: 8.27, height: 11.69 }, // inches
    Letter: { width: 8.5, height: 11 }, // inches
  };

  const size = sizes[paperSize];
  return {
    width: size.width * 72, // 72 DPI for screen/PDF
    height: size.height * 72,
  };
}

/**
 * Calculate card positions on a page
 */
export function calculateCardLayout(
  cardsPerPage: 4 | 9,
  pageSize: 'A4' | 'Letter',
  cardFormat: CardFormat
): Array<{ x: number; y: number; width: number; height: number }> {
  const page = getPageDimensions(pageSize);
  const card = dimensionsToPixels(cardFormat);

  // Scale card dimensions to fit page (72 DPI)
  const scaleFactor = 72 / CARD_FORMATS[cardFormat].ppi;
  const cardWidth = card.width * scaleFactor;
  const cardHeight = card.height * scaleFactor;

  const margin = 36; // 0.5 inch margin
  const spacing = 18; // 0.25 inch spacing

  const positions: Array<{ x: number; y: number; width: number; height: number }> = [];

  if (cardsPerPage === 4) {
    // 2x2 grid
    const cols = 2;
    const rows = 2;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          x: margin + col * (cardWidth + spacing),
          y: margin + row * (cardHeight + spacing),
          width: cardWidth,
          height: cardHeight,
        });
      }
    }
  } else if (cardsPerPage === 9) {
    // 3x3 grid
    const cols = 3;
    const rows = 3;
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        positions.push({
          x: margin + col * (cardWidth + spacing),
          y: margin + row * (cardHeight + spacing),
          width: cardWidth,
          height: cardHeight,
        });
      }
    }
  }

  return positions;
}

/**
 * Save card collection to localStorage
 */
export function saveCardToCollection(cardData: StoryCardData): void {
  const collection = getCardCollection();
  const existingIndex = collection.findIndex(card => card.storyId === cardData.storyId);

  if (existingIndex >= 0) {
    collection[existingIndex] = cardData;
  } else {
    collection.push(cardData);
  }

  localStorage.setItem('story-card-collection', JSON.stringify(collection));
}

/**
 * Get card collection from localStorage
 */
export function getCardCollection(): StoryCardData[] {
  const stored = localStorage.getItem('story-card-collection');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get collection statistics
 */
export function getCollectionStats(): {
  total: number;
  common: number;
  rare: number;
  epic: number;
  legendary: number;
} {
  const collection = getCardCollection();

  return {
    total: collection.length,
    common: collection.filter(c => c.rarity === 'common').length,
    rare: collection.filter(c => c.rarity === 'rare').length,
    epic: collection.filter(c => c.rarity === 'epic').length,
    legendary: collection.filter(c => c.rarity === 'legendary').length,
  };
}

/**
 * Check if Card Collector achievement is unlocked (25 cards)
 */
export function checkCardCollectorAchievement(): boolean {
  const stats = getCollectionStats();
  return stats.total >= 25;
}

/**
 * Check if Master Printer achievement is unlocked (100 cards printed)
 */
export function checkMasterPrinterAchievement(): boolean {
  const printCount = parseInt(localStorage.getItem('cards-printed-count') || '0');
  return printCount >= 100;
}

/**
 * Increment print counter
 */
export function incrementPrintCounter(count: number = 1): void {
  const current = parseInt(localStorage.getItem('cards-printed-count') || '0');
  localStorage.setItem('cards-printed-count', (current + count).toString());
}

/**
 * Get print statistics
 */
export function getPrintStats(): {
  totalPrinted: number;
  lastPrintDate?: Date;
} {
  const totalPrinted = parseInt(localStorage.getItem('cards-printed-count') || '0');
  const lastPrintDateStr = localStorage.getItem('last-print-date');

  return {
    totalPrinted,
    lastPrintDate: lastPrintDateStr ? new Date(lastPrintDateStr) : undefined,
  };
}

/**
 * Create story card data from CreatedStory
 */
export function createCardFromStory(
  story: any,
  locale: 'de' | 'ar' | 'en' | 'tr' | 'ur' = 'de'
): StoryCardData {
  // Calculate rarity based on story completion
  const completionStats = {
    timesRead: 1, // Default for created stories
    quizScore: 100,
    achievementUnlocked: false,
  };

  const rarity = calculateCardRarity(completionStats);

  // Generate fun fact from story events
  const funFact = story.events?.[0]?.text || 'Eine selbst erstellte Geschichte!';

  // Generate quiz question from story
  const quizQuestion = story.events?.length > 1
    ? {
        text: getQuizQuestionText(locale),
        answer: story.events[1]?.text || story.character,
      }
    : undefined;

  return {
    storyId: story.id,
    title: story.title,
    emoji: story.emoji || getCharacterEmoji(story.character),
    characterType: story.character,
    skills: story.skills || [],
    keyMessage: story.keyMessage || getKeyMessage(story, locale),
    funFact,
    quizQuestion,
    author: story.author,
    completionDate: story.createdAt ? new Date(story.createdAt) : new Date(),
    rarity,
  };
}

function getCharacterEmoji(character: string): string {
  const emojiMap: Record<string, string> = {
    bruno: '🐻',
    fritz: '🦊',
    lina: '🦁',
    mila: '🐭',
    tobi: '🐯',
    moritz: '🐶',
    leo: '🐰',
    timmi: '👦',
    elephant: '🐘',
    panda: '🐼',
    owl: '🦉',
    penguin: '🐧',
  };

  return emojiMap[character.toLowerCase()] || '⭐';
}

function getQuizQuestionText(locale: string): string {
  const questions: Record<string, string> = {
    de: 'Was passiert als Nächstes in der Geschichte?',
    ar: 'ماذا يحدث بعد ذلك في القصة؟',
    en: 'What happens next in the story?',
    tr: 'Hikayede sonra ne oluyor?',
    ur: 'کہانی میں اگلا کیا ہوتا ہے؟',
  };

  return questions[locale] || questions.de;
}

function getKeyMessage(story: any, locale: string): string {
  const messages: Record<string, string> = {
    de: `${story.character} erlebt ein spannendes Abenteuer!`,
    ar: `${story.character} يعيش مغامرة مثيرة!`,
    en: `${story.character} has an exciting adventure!`,
    tr: `${story.character} heyecan verici bir macera yaşıyor!`,
    ur: `${story.character} ایک دلچسپ مہم جوئی کا تجربہ کرتا ہے!`,
  };

  return messages[locale] || messages.de;
}
