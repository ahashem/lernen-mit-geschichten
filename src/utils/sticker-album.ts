/**
 * Sticker Album System
 * Collect, organize, and trade virtual stickers from stories
 * Features: 200+ stickers, rarity system, album pages, trading, packs
 */

import { starWallet } from './star-wallet';
import { achievementTracker } from './achievements';

export type StickerRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
export type StickerCategory =
  | 'characters'
  | 'emotions'
  | 'objects'
  | 'backgrounds'
  | 'effects'
  | 'rare';

export interface Sticker {
  id: string;
  name: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  category: StickerCategory;
  rarity: StickerRarity;
  storySource?: string; // Story ID where this sticker comes from
  emoji: string;
  isAnimated?: boolean;
  isHolographic?: boolean;
  svgPath?: string; // SVG data for the sticker
}

export interface CollectedSticker {
  stickerId: string;
  collectedAt: number;
  duplicates: number;
  timesTraded: number;
}

export interface AlbumPage {
  id: string;
  name: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  theme: StickerCategory;
  slots: string[]; // Array of 12 sticker IDs
  stickerIds: string[]; // Stickers that belong to this page
  completed: boolean;
  completedAt?: number;
}

export interface StickerPack {
  id: string;
  name: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  description: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  price: number; // Star cost
  stickerCount: number;
  rarityWeights: Record<StickerRarity, number>;
  categoryFilter?: StickerCategory;
  guaranteedRarity?: StickerRarity;
}

export interface TradeData {
  id: string;
  stickers: string[]; // Array of sticker IDs
  createdAt: number;
  expiresAt: number;
}

export interface AlbumProgress {
  collection: Map<string, CollectedSticker>; // stickerId -> CollectedSticker
  pages: AlbumPage[];
  wishlist: string[]; // Max 10 stickers
  totalStickersCollected: number;
  uniqueStickersCollected: number;
  albumCompletionPercentage: number;
  lastDailyReward: number;
  tradeHistory: { stickerId: string; timestamp: number; direction: 'sent' | 'received' }[];
  packsOpened: number;
}

// Rarity distribution percentages
export const RARITY_WEIGHTS: Record<StickerRarity, number> = {
  common: 60,
  uncommon: 25,
  rare: 10,
  epic: 4,
  legendary: 1,
};

// Rarity colors for UI
export const RARITY_COLORS: Record<StickerRarity, string> = {
  common: '#9E9E9E',
  uncommon: '#4CAF50',
  rare: '#2196F3',
  epic: '#9C27B0',
  legendary: '#FF9800',
};

// Star rewards for page completion
export const PAGE_COMPLETION_REWARD = 50;
export const ALBUM_COMPLETION_REWARD = 500;

// Generate all 200+ stickers
export const ALL_STICKERS: Sticker[] = [
  // Characters (50 stickers)
  ...generateCharacterStickers(),
  // Emotions (30 stickers)
  ...generateEmotionStickers(),
  // Objects (40 stickers)
  ...generateObjectStickers(),
  // Backgrounds (30 stickers)
  ...generateBackgroundStickers(),
  // Special Effects (25 stickers)
  ...generateEffectStickers(),
  // Rare Stickers (25 stickers)
  ...generateRareStickers(),
];

// Generate character stickers (50 total)
function generateCharacterStickers(): Sticker[] {
  const characters = [
    { id: 'bruno-bear', emoji: '🐻', name: 'Bruno', rarity: 'common' as StickerRarity, story: '001-bruno' },
    { id: 'fritz-fox', emoji: '🦊', name: 'Fritz', rarity: 'common' as StickerRarity, story: '002-fritz' },
    { id: 'lina-lion', emoji: '🦁', name: 'Lina', rarity: 'common' as StickerRarity, story: '003-lina' },
    { id: 'tobi-tiger', emoji: '🐯', name: 'Tobi', rarity: 'common' as StickerRarity, story: '004-tobi' },
    { id: 'mila-mouse', emoji: '🐭', name: 'Mila', rarity: 'common' as StickerRarity, story: '005-mila' },
    { id: 'moritz-monkey', emoji: '🐵', name: 'Moritz', rarity: 'uncommon' as StickerRarity, story: '006-moritz' },
    { id: 'leo-leopard', emoji: '🐆', name: 'Leo', rarity: 'uncommon' as StickerRarity, story: '010-leo' },
    { id: 'timmi-turtle', emoji: '🐢', name: 'Timmi', rarity: 'rare' as StickerRarity, story: '020-timmi-denkt' },
    { id: 'ellie-elephant', emoji: '🐘', name: 'Ellie', rarity: 'uncommon' as StickerRarity },
    { id: 'greta-giraffe', emoji: '🦒', name: 'Greta', rarity: 'uncommon' as StickerRarity },
    { id: 'peter-panda', emoji: '🐼', name: 'Peter', rarity: 'rare' as StickerRarity },
    { id: 'rita-rabbit', emoji: '🐰', name: 'Rita', rarity: 'common' as StickerRarity },
    { id: 'sam-squirrel', emoji: '🐿️', name: 'Sam', rarity: 'common' as StickerRarity },
    { id: 'dora-dog', emoji: '🐕', name: 'Dora', rarity: 'common' as StickerRarity },
    { id: 'cat-charlie', emoji: '🐈', name: 'Charlie', rarity: 'common' as StickerRarity },
    { id: 'hedgehog-henry', emoji: '🦔', name: 'Henry', rarity: 'uncommon' as StickerRarity },
    { id: 'owl-otto', emoji: '🦉', name: 'Otto', rarity: 'rare' as StickerRarity },
    { id: 'penguin-paul', emoji: '🐧', name: 'Paul', rarity: 'uncommon' as StickerRarity },
    { id: 'koala-kira', emoji: '🐨', name: 'Kira', rarity: 'rare' as StickerRarity },
    { id: 'zebra-zara', emoji: '🦓', name: 'Zara', rarity: 'uncommon' as StickerRarity },
    { id: 'pig-polly', emoji: '🐷', name: 'Polly', rarity: 'common' as StickerRarity },
    { id: 'frog-fred', emoji: '🐸', name: 'Fred', rarity: 'common' as StickerRarity },
    { id: 'bird-bella', emoji: '🐦', name: 'Bella', rarity: 'common' as StickerRarity },
    { id: 'duck-daisy', emoji: '🦆', name: 'Daisy', rarity: 'common' as StickerRarity },
    { id: 'bee-betty', emoji: '🐝', name: 'Betty', rarity: 'uncommon' as StickerRarity },
    { id: 'ladybug-lucy', emoji: '🐞', name: 'Lucy', rarity: 'uncommon' as StickerRarity },
    { id: 'butterfly-bonnie', emoji: '🦋', name: 'Bonnie', rarity: 'rare' as StickerRarity },
    { id: 'snail-simon', emoji: '🐌', name: 'Simon', rarity: 'common' as StickerRarity },
    { id: 'fish-finn', emoji: '🐟', name: 'Finn', rarity: 'common' as StickerRarity },
    { id: 'dolphin-dolly', emoji: '🐬', name: 'Dolly', rarity: 'rare' as StickerRarity },
    { id: 'whale-willy', emoji: '🐋', name: 'Willy', rarity: 'epic' as StickerRarity },
    { id: 'octopus-ollie', emoji: '🐙', name: 'Ollie', rarity: 'rare' as StickerRarity },
    { id: 'crab-carl', emoji: '🦀', name: 'Carl', rarity: 'uncommon' as StickerRarity },
    { id: 'dragon-draco', emoji: '🐉', name: 'Draco', rarity: 'legendary' as StickerRarity },
    { id: 'unicorn-una', emoji: '🦄', name: 'Una', rarity: 'legendary' as StickerRarity },
    { id: 'lion-king', emoji: '🦁', name: 'King Leo', rarity: 'epic' as StickerRarity },
    { id: 'robot-rex', emoji: '🤖', name: 'Rex', rarity: 'rare' as StickerRarity },
    { id: 'alien-alex', emoji: '👽', name: 'Alex', rarity: 'rare' as StickerRarity },
    { id: 'ghost-gary', emoji: '👻', name: 'Gary', rarity: 'uncommon' as StickerRarity },
    { id: 'fairy-fiona', emoji: '🧚', name: 'Fiona', rarity: 'epic' as StickerRarity },
    { id: 'mermaid-marina', emoji: '🧜', name: 'Marina', rarity: 'epic' as StickerRarity },
    { id: 'wizard-walter', emoji: '🧙', name: 'Walter', rarity: 'rare' as StickerRarity },
    { id: 'knight-kevin', emoji: '🤺', name: 'Kevin', rarity: 'uncommon' as StickerRarity },
    { id: 'princess-petra', emoji: '👸', name: 'Petra', rarity: 'rare' as StickerRarity },
    { id: 'prince-peter', emoji: '🤴', name: 'Prince Peter', rarity: 'rare' as StickerRarity },
    { id: 'astronaut-anna', emoji: '👩‍🚀', name: 'Anna', rarity: 'uncommon' as StickerRarity },
    { id: 'pirate-pete', emoji: '🏴‍☠️', name: 'Pete', rarity: 'uncommon' as StickerRarity },
    { id: 'superhero-sam', emoji: '🦸', name: 'Sam', rarity: 'epic' as StickerRarity },
    { id: 'teacher-tina', emoji: '👩‍🏫', name: 'Tina', rarity: 'common' as StickerRarity },
    { id: 'chef-charlie', emoji: '👨‍🍳', name: 'Chef Charlie', rarity: 'common' as StickerRarity },
  ];

  return characters.map(char => ({
    id: char.id,
    name: {
      de: char.name,
      ar: char.name,
      en: char.name,
      tr: char.name,
      ur: char.name,
    },
    category: 'characters' as StickerCategory,
    rarity: char.rarity,
    storySource: char.story,
    emoji: char.emoji,
  }));
}

// Generate emotion stickers (30 total)
function generateEmotionStickers(): Sticker[] {
  const emotions = [
    { id: 'happy-smile', emoji: '😊', name: { de: 'Glücklich', ar: 'سعيد', en: 'Happy', tr: 'Mutlu', ur: 'خوش' }, rarity: 'common' as StickerRarity },
    { id: 'sad-cry', emoji: '😢', name: { de: 'Traurig', ar: 'حزين', en: 'Sad', tr: 'Üzgün', ur: 'اداس' }, rarity: 'common' as StickerRarity },
    { id: 'excited-jump', emoji: '🤩', name: { de: 'Aufgeregt', ar: 'متحمس', en: 'Excited', tr: 'Heyecanlı', ur: 'پرجوش' }, rarity: 'common' as StickerRarity },
    { id: 'angry-mad', emoji: '😠', name: { de: 'Wütend', ar: 'غاضب', en: 'Angry', tr: 'Kızgın', ur: 'ناراض' }, rarity: 'common' as StickerRarity },
    { id: 'surprised-wow', emoji: '😲', name: { de: 'Überrascht', ar: 'مندهش', en: 'Surprised', tr: 'Şaşırmış', ur: 'حیران' }, rarity: 'common' as StickerRarity },
    { id: 'scared-fear', emoji: '😨', name: { de: 'Ängstlich', ar: 'خائف', en: 'Scared', tr: 'Korkmuş', ur: 'خوفزدہ' }, rarity: 'uncommon' as StickerRarity },
    { id: 'love-heart', emoji: '😍', name: { de: 'Verliebt', ar: 'عاشق', en: 'In Love', tr: 'Aşık', ur: 'محبت' }, rarity: 'uncommon' as StickerRarity },
    { id: 'silly-laugh', emoji: '🤪', name: { de: 'Albern', ar: 'سخيف', en: 'Silly', tr: 'Aptal', ur: 'مضحکہ' }, rarity: 'common' as StickerRarity },
    { id: 'thinking-hm', emoji: '🤔', name: { de: 'Nachdenklich', ar: 'مفكر', en: 'Thinking', tr: 'Düşünceli', ur: 'سوچتے ہوئے' }, rarity: 'common' as StickerRarity },
    { id: 'sleepy-tired', emoji: '😴', name: { de: 'Müde', ar: 'متعب', en: 'Sleepy', tr: 'Uykulu', ur: 'نیند' }, rarity: 'common' as StickerRarity },
    { id: 'proud-strong', emoji: '😤', name: { de: 'Stolz', ar: 'فخور', en: 'Proud', tr: 'Gururlu', ur: 'فخر' }, rarity: 'uncommon' as StickerRarity },
    { id: 'shy-blush', emoji: '😊', name: { de: 'Schüchtern', ar: 'خجول', en: 'Shy', tr: 'Utangaç', ur: 'شرمیلا' }, rarity: 'common' as StickerRarity },
    { id: 'brave-hero', emoji: '💪', name: { de: 'Mutig', ar: 'شجاع', en: 'Brave', tr: 'Cesur', ur: 'بہادر' }, rarity: 'uncommon' as StickerRarity },
    { id: 'curious-wonder', emoji: '🧐', name: { de: 'Neugierig', ar: 'فضولي', en: 'Curious', tr: 'Meraklı', ur: 'متجسس' }, rarity: 'common' as StickerRarity },
    { id: 'calm-peace', emoji: '😌', name: { de: 'Ruhig', ar: 'هادئ', en: 'Calm', tr: 'Sakin', ur: 'پرسکون' }, rarity: 'uncommon' as StickerRarity },
    { id: 'grateful-thanks', emoji: '🙏', name: { de: 'Dankbar', ar: 'ممتن', en: 'Grateful', tr: 'Minnettar', ur: 'شکر گزار' }, rarity: 'uncommon' as StickerRarity },
    { id: 'jealous-envy', emoji: '😒', name: { de: 'Eifersüchtig', ar: 'غيور', en: 'Jealous', tr: 'Kıskanç', ur: 'حسد' }, rarity: 'rare' as StickerRarity },
    { id: 'frustrated-grrr', emoji: '😤', name: { de: 'Frustriert', ar: 'محبط', en: 'Frustrated', tr: 'Hüsrana Uğramış', ur: 'مایوس' }, rarity: 'uncommon' as StickerRarity },
    { id: 'hopeful-dream', emoji: '🤞', name: { de: 'Hoffnungsvoll', ar: 'متفائل', en: 'Hopeful', tr: 'Umutlu', ur: 'امید' }, rarity: 'rare' as StickerRarity },
    { id: 'confused-huh', emoji: '😕', name: { de: 'Verwirrt', ar: 'مرتبك', en: 'Confused', tr: 'Kafası Karışmış', ur: 'الجھن' }, rarity: 'common' as StickerRarity },
    { id: 'determined-focus', emoji: '😠', name: { de: 'Entschlossen', ar: 'عازم', en: 'Determined', tr: 'Kararlı', ur: 'عزم' }, rarity: 'rare' as StickerRarity },
    { id: 'relaxed-chill', emoji: '😎', name: { de: 'Entspannt', ar: 'مسترخي', en: 'Relaxed', tr: 'Rahat', ur: 'آرام' }, rarity: 'uncommon' as StickerRarity },
    { id: 'worried-concern', emoji: '😟', name: { de: 'Besorgt', ar: 'قلق', en: 'Worried', tr: 'Endişeli', ur: 'پریشان' }, rarity: 'common' as StickerRarity },
    { id: 'playful-fun', emoji: '😜', name: { de: 'Verspielt', ar: 'مرح', en: 'Playful', tr: 'Oyuncu', ur: 'کھیل' }, rarity: 'common' as StickerRarity },
    { id: 'content-satisfied', emoji: '😊', name: { de: 'Zufrieden', ar: 'راضي', en: 'Content', tr: 'Memnun', ur: 'مطمئن' }, rarity: 'uncommon' as StickerRarity },
    { id: 'bored-yawn', emoji: '🥱', name: { de: 'Gelangweilt', ar: 'مُمل', en: 'Bored', tr: 'Sıkılmış', ur: 'بور' }, rarity: 'common' as StickerRarity },
    { id: 'embarrassed-oops', emoji: '😳', name: { de: 'Verlegen', ar: 'محرج', en: 'Embarrassed', tr: 'Utanmış', ur: 'شرمندہ' }, rarity: 'uncommon' as StickerRarity },
    { id: 'lonely-alone', emoji: '😔', name: { de: 'Einsam', ar: 'وحيد', en: 'Lonely', tr: 'Yalnız', ur: 'تنہا' }, rarity: 'rare' as StickerRarity },
    { id: 'confident-strong', emoji: '😎', name: { de: 'Selbstbewusst', ar: 'واثق', en: 'Confident', tr: 'Kendinden Emin', ur: 'پر اعتماد' }, rarity: 'rare' as StickerRarity },
    { id: 'friendly-wave', emoji: '👋', name: { de: 'Freundlich', ar: 'ودود', en: 'Friendly', tr: 'Arkadaş Canlısı', ur: 'دوستانہ' }, rarity: 'common' as StickerRarity },
  ];

  return emotions.map(emotion => ({
    id: emotion.id,
    name: emotion.name,
    category: 'emotions' as StickerCategory,
    rarity: emotion.rarity,
    emoji: emotion.emoji,
  }));
}

// Generate object stickers (40 total)
function generateObjectStickers(): Sticker[] {
  const objects = [
    { id: 'ball-red', emoji: '⚽', name: 'Ball', rarity: 'common' },
    { id: 'book-story', emoji: '📚', name: 'Book', rarity: 'common' },
    { id: 'toy-teddy', emoji: '🧸', name: 'Teddy Bear', rarity: 'common' },
    { id: 'balloon-blue', emoji: '🎈', name: 'Balloon', rarity: 'common' },
    { id: 'kite-flying', emoji: '🪁', name: 'Kite', rarity: 'uncommon' },
    { id: 'gift-present', emoji: '🎁', name: 'Gift', rarity: 'uncommon' },
    { id: 'cake-birthday', emoji: '🎂', name: 'Birthday Cake', rarity: 'uncommon' },
    { id: 'crown-gold', emoji: '👑', name: 'Crown', rarity: 'rare' },
    { id: 'magic-wand', emoji: '🪄', name: 'Magic Wand', rarity: 'epic' },
    { id: 'treasure-chest', emoji: '💎', name: 'Treasure', rarity: 'legendary' },
    { id: 'apple-red', emoji: '🍎', name: 'Apple', rarity: 'common' },
    { id: 'cookie-chocolate', emoji: '🍪', name: 'Cookie', rarity: 'common' },
    { id: 'ice-cream', emoji: '🍦', name: 'Ice Cream', rarity: 'uncommon' },
    { id: 'pizza-slice', emoji: '🍕', name: 'Pizza', rarity: 'common' },
    { id: 'sandwich-lunch', emoji: '🥪', name: 'Sandwich', rarity: 'common' },
    { id: 'backpack-school', emoji: '🎒', name: 'Backpack', rarity: 'common' },
    { id: 'pencil-write', emoji: '✏️', name: 'Pencil', rarity: 'common' },
    { id: 'crayon-color', emoji: '🖍️', name: 'Crayon', rarity: 'common' },
    { id: 'paint-palette', emoji: '🎨', name: 'Paint Palette', rarity: 'uncommon' },
    { id: 'scissors-cut', emoji: '✂️', name: 'Scissors', rarity: 'common' },
    { id: 'bike-ride', emoji: '🚲', name: 'Bicycle', rarity: 'uncommon' },
    { id: 'car-toy', emoji: '🚗', name: 'Car', rarity: 'common' },
    { id: 'train-choo', emoji: '🚂', name: 'Train', rarity: 'uncommon' },
    { id: 'plane-fly', emoji: '✈️', name: 'Airplane', rarity: 'rare' },
    { id: 'rocket-space', emoji: '🚀', name: 'Rocket', rarity: 'epic' },
    { id: 'telescope-stars', emoji: '🔭', name: 'Telescope', rarity: 'rare' },
    { id: 'microscope-lab', emoji: '🔬', name: 'Microscope', rarity: 'rare' },
    { id: 'clock-time', emoji: '⏰', name: 'Clock', rarity: 'common' },
    { id: 'key-gold', emoji: '🔑', name: 'Golden Key', rarity: 'rare' },
    { id: 'compass-navigate', emoji: '🧭', name: 'Compass', rarity: 'uncommon' },
    { id: 'map-treasure', emoji: '🗺️', name: 'Treasure Map', rarity: 'epic' },
    { id: 'magnifying-glass', emoji: '🔍', name: 'Magnifying Glass', rarity: 'uncommon' },
    { id: 'flashlight-bright', emoji: '🔦', name: 'Flashlight', rarity: 'common' },
    { id: 'camera-photo', emoji: '📷', name: 'Camera', rarity: 'uncommon' },
    { id: 'guitar-music', emoji: '🎸', name: 'Guitar', rarity: 'rare' },
    { id: 'drum-beat', emoji: '🥁', name: 'Drum', rarity: 'uncommon' },
    { id: 'microphone-sing', emoji: '🎤', name: 'Microphone', rarity: 'rare' },
    { id: 'trophy-winner', emoji: '🏆', name: 'Trophy', rarity: 'epic' },
    { id: 'medal-gold', emoji: '🏅', name: 'Gold Medal', rarity: 'epic' },
    { id: 'shield-hero', emoji: '🛡️', name: 'Shield', rarity: 'rare' },
  ];

  return objects.map(obj => ({
    id: obj.id,
    name: {
      de: obj.name,
      ar: obj.name,
      en: obj.name,
      tr: obj.name,
      ur: obj.name,
    },
    category: 'objects' as StickerCategory,
    rarity: obj.rarity as StickerRarity,
    emoji: obj.emoji,
  }));
}

// Generate background stickers (30 total)
function generateBackgroundStickers(): Sticker[] {
  const backgrounds = [
    { id: 'forest-green', emoji: '🌲', name: 'Forest', rarity: 'common' },
    { id: 'beach-sand', emoji: '🏖️', name: 'Beach', rarity: 'common' },
    { id: 'mountain-peak', emoji: '⛰️', name: 'Mountain', rarity: 'uncommon' },
    { id: 'desert-sand', emoji: '🏜️', name: 'Desert', rarity: 'uncommon' },
    { id: 'jungle-wild', emoji: '🌴', name: 'Jungle', rarity: 'uncommon' },
    { id: 'city-buildings', emoji: '🏙️', name: 'City', rarity: 'common' },
    { id: 'farm-barn', emoji: '🏡', name: 'Farm', rarity: 'common' },
    { id: 'castle-kingdom', emoji: '🏰', name: 'Castle', rarity: 'rare' },
    { id: 'space-stars', emoji: '🌌', name: 'Space', rarity: 'epic' },
    { id: 'underwater-ocean', emoji: '🌊', name: 'Underwater', rarity: 'rare' },
    { id: 'garden-flowers', emoji: '🌺', name: 'Garden', rarity: 'common' },
    { id: 'playground-fun', emoji: '🎪', name: 'Playground', rarity: 'common' },
    { id: 'school-class', emoji: '🏫', name: 'School', rarity: 'common' },
    { id: 'library-books', emoji: '📚', name: 'Library', rarity: 'uncommon' },
    { id: 'park-trees', emoji: '🌳', name: 'Park', rarity: 'common' },
    { id: 'zoo-animals', emoji: '🦁', name: 'Zoo', rarity: 'uncommon' },
    { id: 'circus-tent', emoji: '🎪', name: 'Circus', rarity: 'rare' },
    { id: 'bakery-shop', emoji: '🧁', name: 'Bakery', rarity: 'uncommon' },
    { id: 'toy-store', emoji: '🧸', name: 'Toy Store', rarity: 'uncommon' },
    { id: 'ice-rink', emoji: '⛸️', name: 'Ice Rink', rarity: 'rare' },
    { id: 'lake-peaceful', emoji: '🏞️', name: 'Lake', rarity: 'uncommon' },
    { id: 'volcano-hot', emoji: '🌋', name: 'Volcano', rarity: 'epic' },
    { id: 'cave-dark', emoji: '🕳️', name: 'Cave', rarity: 'rare' },
    { id: 'rainbow-sky', emoji: '🌈', name: 'Rainbow Sky', rarity: 'epic' },
    { id: 'night-stars', emoji: '🌃', name: 'Starry Night', rarity: 'rare' },
    { id: 'sunrise-dawn', emoji: '🌅', name: 'Sunrise', rarity: 'uncommon' },
    { id: 'sunset-dusk', emoji: '🌇', name: 'Sunset', rarity: 'uncommon' },
    { id: 'cloudy-sky', emoji: '☁️', name: 'Cloudy Sky', rarity: 'common' },
    { id: 'snow-winter', emoji: '❄️', name: 'Snowy Winter', rarity: 'uncommon' },
    { id: 'autumn-leaves', emoji: '🍂', name: 'Autumn Forest', rarity: 'uncommon' },
  ];

  return backgrounds.map(bg => ({
    id: bg.id,
    name: {
      de: bg.name,
      ar: bg.name,
      en: bg.name,
      tr: bg.name,
      ur: bg.name,
    },
    category: 'backgrounds' as StickerCategory,
    rarity: bg.rarity as StickerRarity,
    emoji: bg.emoji,
  }));
}

// Generate special effect stickers (25 total)
function generateEffectStickers(): Sticker[] {
  const effects = [
    { id: 'sparkles-magic', emoji: '✨', name: 'Sparkles', rarity: 'uncommon', animated: true },
    { id: 'stars-shine', emoji: '⭐', name: 'Stars', rarity: 'uncommon' },
    { id: 'rainbow-arc', emoji: '🌈', name: 'Rainbow', rarity: 'rare' },
    { id: 'fire-flame', emoji: '🔥', name: 'Fire', rarity: 'uncommon', animated: true },
    { id: 'lightning-bolt', emoji: '⚡', name: 'Lightning', rarity: 'rare', animated: true },
    { id: 'snow-flakes', emoji: '❄️', name: 'Snowflakes', rarity: 'uncommon', animated: true },
    { id: 'bubbles-pop', emoji: '🫧', name: 'Bubbles', rarity: 'common', animated: true },
    { id: 'hearts-love', emoji: '💕', name: 'Hearts', rarity: 'common', animated: true },
    { id: 'music-notes', emoji: '🎵', name: 'Music Notes', rarity: 'uncommon', animated: true },
    { id: 'confetti-party', emoji: '🎉', name: 'Confetti', rarity: 'rare', animated: true },
    { id: 'fireworks-boom', emoji: '🎆', name: 'Fireworks', rarity: 'epic', animated: true },
    { id: 'clouds-fluffy', emoji: '☁️', name: 'Clouds', rarity: 'common' },
    { id: 'sun-bright', emoji: '☀️', name: 'Sunshine', rarity: 'uncommon' },
    { id: 'moon-night', emoji: '🌙', name: 'Crescent Moon', rarity: 'uncommon' },
    { id: 'tornado-spin', emoji: '🌪️', name: 'Tornado', rarity: 'rare', animated: true },
    { id: 'waves-ocean', emoji: '🌊', name: 'Ocean Waves', rarity: 'uncommon', animated: true },
    { id: 'leaves-fall', emoji: '🍃', name: 'Falling Leaves', rarity: 'uncommon', animated: true },
    { id: 'smoke-puff', emoji: '💨', name: 'Smoke', rarity: 'common' },
    { id: 'wind-blow', emoji: '🌬️', name: 'Wind', rarity: 'common', animated: true },
    { id: 'comet-trail', emoji: '☄️', name: 'Comet', rarity: 'epic', animated: true },
    { id: 'magic-circle', emoji: '🔮', name: 'Magic Circle', rarity: 'epic', animated: true },
    { id: 'portal-warp', emoji: '🌀', name: 'Portal', rarity: 'legendary', animated: true },
    { id: 'aurora-lights', emoji: '🌌', name: 'Aurora', rarity: 'epic', animated: true },
    { id: 'galaxy-swirl', emoji: '🌌', name: 'Galaxy', rarity: 'legendary', animated: true },
    { id: 'crystal-shine', emoji: '💎', name: 'Crystal', rarity: 'epic' },
  ];

  return effects.map(effect => ({
    id: effect.id,
    name: {
      de: effect.name,
      ar: effect.name,
      en: effect.name,
      tr: effect.name,
      ur: effect.name,
    },
    category: 'effects' as StickerCategory,
    rarity: effect.rarity as StickerRarity,
    emoji: effect.emoji,
    isAnimated: effect.animated || false,
  }));
}

// Generate rare/legendary stickers (25 total)
function generateRareStickers(): Sticker[] {
  const rareStickers = [
    { id: 'golden-bruno', emoji: '🐻', name: 'Golden Bruno', rarity: 'legendary', holographic: true },
    { id: 'diamond-fritz', emoji: '🦊', name: 'Diamond Fritz', rarity: 'legendary', holographic: true },
    { id: 'rainbow-lina', emoji: '🦁', name: 'Rainbow Lina', rarity: 'legendary', holographic: true },
    { id: 'crystal-timmi', emoji: '🐢', name: 'Crystal Timmi', rarity: 'legendary', holographic: true },
    { id: 'cosmic-leo', emoji: '🐆', name: 'Cosmic Leo', rarity: 'legendary', holographic: true },
    { id: 'phoenix-bird', emoji: '🔥', name: 'Phoenix', rarity: 'legendary', animated: true, holographic: true },
    { id: 'ice-dragon', emoji: '🐉', name: 'Ice Dragon', rarity: 'legendary', animated: true, holographic: true },
    { id: 'sun-unicorn', emoji: '🦄', name: 'Sun Unicorn', rarity: 'legendary', animated: true, holographic: true },
    { id: 'moon-mermaid', emoji: '🧜', name: 'Moon Mermaid', rarity: 'legendary', holographic: true },
    { id: 'star-wizard', emoji: '🧙', name: 'Star Wizard', rarity: 'legendary', holographic: true },
    { id: 'ancient-scroll', emoji: '📜', name: 'Ancient Scroll', rarity: 'epic' },
    { id: 'magic-book', emoji: '📖', name: 'Magic Spellbook', rarity: 'epic', animated: true },
    { id: 'time-hourglass', emoji: '⏳', name: 'Time Hourglass', rarity: 'epic', animated: true },
    { id: 'wish-star', emoji: '🌟', name: 'Wishing Star', rarity: 'epic', animated: true },
    { id: 'rainbow-bridge', emoji: '🌈', name: 'Rainbow Bridge', rarity: 'epic' },
    { id: 'floating-island', emoji: '🏝️', name: 'Floating Island', rarity: 'epic' },
    { id: 'northern-lights', emoji: '🌌', name: 'Northern Lights', rarity: 'epic', animated: true },
    { id: 'enchanted-forest', emoji: '🌲', name: 'Enchanted Forest', rarity: 'epic' },
    { id: 'mystical-cave', emoji: '🕳️', name: 'Mystical Cave', rarity: 'epic' },
    { id: 'cloud-castle', emoji: '☁️', name: 'Cloud Castle', rarity: 'epic' },
    { id: 'underwater-city', emoji: '🏙️', name: 'Underwater City', rarity: 'epic' },
    { id: 'crystal-palace', emoji: '🏰', name: 'Crystal Palace', rarity: 'legendary', holographic: true },
    { id: 'starship-explorer', emoji: '🚀', name: 'Starship', rarity: 'epic', animated: true },
    { id: 'time-portal', emoji: '🌀', name: 'Time Portal', rarity: 'legendary', animated: true, holographic: true },
    { id: 'infinity-gem', emoji: '💎', name: 'Infinity Gem', rarity: 'legendary', holographic: true },
  ];

  return rareStickers.map(sticker => ({
    id: sticker.id,
    name: {
      de: sticker.name,
      ar: sticker.name,
      en: sticker.name,
      tr: sticker.name,
      ur: sticker.name,
    },
    category: 'rare' as StickerCategory,
    rarity: sticker.rarity as StickerRarity,
    emoji: sticker.emoji,
    isAnimated: sticker.animated || false,
    isHolographic: sticker.holographic || false,
  }));
}

// Define album pages (10 pages, 12 stickers each)
export const ALBUM_PAGES: AlbumPage[] = [
  {
    id: 'page-characters',
    name: {
      de: 'Charaktere',
      ar: 'الشخصيات',
      en: 'Characters',
      tr: 'Karakterler',
      ur: 'کردار',
    },
    theme: 'characters',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'characters').slice(0, 12).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-emotions',
    name: {
      de: 'Emotionen',
      ar: 'المشاعر',
      en: 'Emotions',
      tr: 'Duygular',
      ur: 'جذبات',
    },
    theme: 'emotions',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'emotions').slice(0, 12).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-nature',
    name: {
      de: 'Natur',
      ar: 'الطبيعة',
      en: 'Nature',
      tr: 'Doğa',
      ur: 'فطرت',
    },
    theme: 'backgrounds',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'backgrounds' && ['forest-green', 'mountain-peak', 'lake-peaceful', 'jungle-wild', 'garden-flowers', 'park-trees', 'desert-sand', 'volcano-hot', 'cave-dark', 'beach-sand', 'snow-winter', 'autumn-leaves'].includes(s.id)).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-home',
    name: {
      de: 'Zuhause',
      ar: 'المنزل',
      en: 'Home',
      tr: 'Ev',
      ur: 'گھر',
    },
    theme: 'objects',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'objects' && ['toy-teddy', 'book-story', 'backpack-school', 'crayon-color', 'paint-palette', 'pencil-write', 'scissors-cut', 'clock-time', 'flashlight-bright', 'camera-photo', 'apple-red', 'cookie-chocolate'].includes(s.id)).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-adventure',
    name: {
      de: 'Abenteuer',
      ar: 'المغامرة',
      en: 'Adventure',
      tr: 'Macera',
      ur: 'مہم جوئی',
    },
    theme: 'objects',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'objects' && ['compass-navigate', 'map-treasure', 'key-gold', 'magnifying-glass', 'telescope-stars', 'plane-fly', 'rocket-space', 'treasure-chest', 'shield-hero', 'trophy-winner', 'medal-gold', 'crown-gold'].includes(s.id)).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-fantasy',
    name: {
      de: 'Fantasy',
      ar: 'الخيال',
      en: 'Fantasy',
      tr: 'Fantezi',
      ur: 'خیال',
    },
    theme: 'characters',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'characters' && ['dragon-draco', 'unicorn-una', 'fairy-fiona', 'mermaid-marina', 'wizard-walter', 'princess-petra', 'prince-peter', 'knight-kevin', 'ghost-gary', 'robot-rex', 'alien-alex', 'lion-king'].includes(s.id)).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-animals',
    name: {
      de: 'Tiere',
      ar: 'الحيوانات',
      en: 'Animals',
      tr: 'Hayvanlar',
      ur: 'جانور',
    },
    theme: 'characters',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'characters' && ['bruno-bear', 'fritz-fox', 'lina-lion', 'tobi-tiger', 'mila-mouse', 'rita-rabbit', 'sam-squirrel', 'dora-dog', 'cat-charlie', 'hedgehog-henry', 'owl-otto', 'frog-fred'].includes(s.id)).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-food',
    name: {
      de: 'Essen',
      ar: 'الطعام',
      en: 'Food',
      tr: 'Yemek',
      ur: 'کھانا',
    },
    theme: 'objects',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'objects' && ['apple-red', 'cookie-chocolate', 'ice-cream', 'pizza-slice', 'sandwich-lunch', 'cake-birthday', 'gift-present', 'balloon-blue', 'kite-flying', 'ball-red', 'bike-ride', 'car-toy'].includes(s.id)).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-celebrations',
    name: {
      de: 'Feiern',
      ar: 'الاحتفالات',
      en: 'Celebrations',
      tr: 'Kutlamalar',
      ur: 'تقریبات',
    },
    theme: 'effects',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.category === 'effects' && ['confetti-party', 'fireworks-boom', 'sparkles-magic', 'stars-shine', 'rainbow-arc', 'hearts-love', 'music-notes', 'bubbles-pop', 'sun-bright', 'moon-night', 'clouds-fluffy', 'crystal-shine'].includes(s.id)).map(s => s.id),
    completed: false,
  },
  {
    id: 'page-legendary',
    name: {
      de: 'Legendär',
      ar: 'أسطوري',
      en: 'Legendary',
      tr: 'Efsanevi',
      ur: 'افسانوی',
    },
    theme: 'rare',
    slots: Array(12).fill(''),
    stickerIds: ALL_STICKERS.filter(s => s.rarity === 'legendary').slice(0, 12).map(s => s.id),
    completed: false,
  },
];

// Define sticker packs
export const STICKER_PACKS: StickerPack[] = [
  {
    id: 'starter-pack',
    name: {
      de: 'Starter-Pack',
      ar: 'حزمة البداية',
      en: 'Starter Pack',
      tr: 'Başlangıç Paketi',
      ur: 'سٹارٹر پیک',
    },
    description: {
      de: '5 zufällige Aufkleber (nur häufig)',
      ar: '5 ملصقات عشوائية (شائعة فقط)',
      en: '5 random stickers (common only)',
      tr: '5 rastgele çıkartma (sadece yaygın)',
      ur: '5 بے ترتیب اسٹیکر (عام)',
    },
    price: 100,
    stickerCount: 5,
    rarityWeights: { common: 100, uncommon: 0, rare: 0, epic: 0, legendary: 0 },
  },
  {
    id: 'premium-pack',
    name: {
      de: 'Premium-Pack',
      ar: 'حزمة متميزة',
      en: 'Premium Pack',
      tr: 'Premium Paket',
      ur: 'پریمیم پیک',
    },
    description: {
      de: '5 Aufkleber mit beliebiger Seltenheit',
      ar: '5 ملصقات من أي ندرة',
      en: '5 stickers of any rarity',
      tr: 'Herhangi bir nadirlikte 5 çıkartma',
      ur: 'کسی بھی نایابیت کے 5 اسٹیکر',
    },
    price: 300,
    stickerCount: 5,
    rarityWeights: RARITY_WEIGHTS,
  },
  {
    id: 'character-pack',
    name: {
      de: 'Charakter-Pack',
      ar: 'حزمة الشخصيات',
      en: 'Character Pack',
      tr: 'Karakter Paketi',
      ur: 'کردار پیک',
    },
    description: {
      de: '5 Charakter-Aufkleber',
      ar: '5 ملصقات شخصيات',
      en: '5 character stickers',
      tr: '5 karakter çıkartması',
      ur: '5 کردار کے اسٹیکر',
    },
    price: 200,
    stickerCount: 5,
    rarityWeights: RARITY_WEIGHTS,
    categoryFilter: 'characters',
  },
  {
    id: 'emotion-pack',
    name: {
      de: 'Emotions-Pack',
      ar: 'حزمة المشاعر',
      en: 'Emotion Pack',
      tr: 'Duygu Paketi',
      ur: 'جذبات پیک',
    },
    description: {
      de: '5 Emotions-Aufkleber',
      ar: '5 ملصقات مشاعر',
      en: '5 emotion stickers',
      tr: '5 duygu çıkartması',
      ur: '5 جذباتی اسٹیکر',
    },
    price: 200,
    stickerCount: 5,
    rarityWeights: RARITY_WEIGHTS,
    categoryFilter: 'emotions',
  },
  {
    id: 'effect-pack',
    name: {
      de: 'Effekt-Pack',
      ar: 'حزمة التأثيرات',
      en: 'Effect Pack',
      tr: 'Efekt Paketi',
      ur: 'اثر پیک',
    },
    description: {
      de: '5 Spezialeffekt-Aufkleber',
      ar: '5 ملصقات تأثيرات خاصة',
      en: '5 special effect stickers',
      tr: '5 özel efekt çıkartması',
      ur: '5 خصوصی اثر اسٹیکر',
    },
    price: 200,
    stickerCount: 5,
    rarityWeights: RARITY_WEIGHTS,
    categoryFilter: 'effects',
  },
  {
    id: 'mystery-pack',
    name: {
      de: 'Mysterium-Pack',
      ar: 'حزمة الغموض',
      en: 'Mystery Pack',
      tr: 'Gizem Paketi',
      ur: 'اسرار پیک',
    },
    description: {
      de: '5 Aufkleber, garantiert selten oder höher',
      ar: '5 ملصقات، نادرة أو أعلى مضمونة',
      en: '5 stickers, guaranteed rare or higher',
      tr: '5 çıkartma, nadir veya daha yüksek garantili',
      ur: '5 اسٹیکر، نایاب یا زیادہ کی ضمانت',
    },
    price: 500,
    stickerCount: 5,
    rarityWeights: { common: 0, uncommon: 0, rare: 60, epic: 30, legendary: 10 },
    guaranteedRarity: 'rare',
  },
];

// Sticker Album Manager Class
export class StickerAlbumManager {
  private storageKey = 'sticker-album-progress';
  private progress: AlbumProgress;

  constructor() {
    this.progress = this.loadProgress();
  }

  private loadProgress(): AlbumProgress {
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
        collection: new Map(Object.entries(parsed.collection || {})),
        pages: parsed.pages || ALBUM_PAGES.map(p => ({ ...p })),
        wishlist: parsed.wishlist || [],
        totalStickersCollected: parsed.totalStickersCollected || 0,
        uniqueStickersCollected: parsed.uniqueStickersCollected || 0,
        albumCompletionPercentage: parsed.albumCompletionPercentage || 0,
        lastDailyReward: parsed.lastDailyReward || 0,
        tradeHistory: parsed.tradeHistory || [],
        packsOpened: parsed.packsOpened || 0,
      };
    } catch (error) {
      console.error('Failed to load sticker album progress:', error);
      return this.getDefaultProgress();
    }
  }

  private getDefaultProgress(): AlbumProgress {
    return {
      collection: new Map(),
      pages: ALBUM_PAGES.map(p => ({ ...p })),
      wishlist: [],
      totalStickersCollected: 0,
      uniqueStickersCollected: 0,
      albumCompletionPercentage: 0,
      lastDailyReward: 0,
      tradeHistory: [],
      packsOpened: 0,
    };
  }

  private saveProgress(): void {
    if (typeof window === 'undefined') return;

    const serializable = {
      collection: Object.fromEntries(this.progress.collection),
      pages: this.progress.pages,
      wishlist: this.progress.wishlist,
      totalStickersCollected: this.progress.totalStickersCollected,
      uniqueStickersCollected: this.progress.uniqueStickersCollected,
      albumCompletionPercentage: this.progress.albumCompletionPercentage,
      lastDailyReward: this.progress.lastDailyReward,
      tradeHistory: this.progress.tradeHistory,
      packsOpened: this.progress.packsOpened,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(serializable));
    this.dispatchUpdate();
  }

  /**
   * Add a sticker to the collection
   */
  addSticker(stickerId: string): { isNew: boolean; isDuplicate: boolean } {
    const existing = this.progress.collection.get(stickerId);

    if (existing) {
      // Duplicate
      existing.duplicates += 1;
      this.progress.collection.set(stickerId, existing);
      this.progress.totalStickersCollected += 1;
      this.saveProgress();
      return { isNew: false, isDuplicate: true };
    } else {
      // New sticker
      const newSticker: CollectedSticker = {
        stickerId,
        collectedAt: Date.now(),
        duplicates: 0,
        timesTraded: 0,
      };
      this.progress.collection.set(stickerId, newSticker);
      this.progress.totalStickersCollected += 1;
      this.progress.uniqueStickersCollected += 1;
      this.updateCompletionPercentage();
      this.checkPageCompletion();
      this.saveProgress();
      return { isNew: true, isDuplicate: false };
    }
  }

  /**
   * Add multiple stickers at once (from pack opening)
   */
  addMultipleStickers(stickerIds: string[]): { isNew: boolean; isDuplicate: boolean; stickerId: string }[] {
    return stickerIds.map(stickerId => ({
      stickerId,
      ...this.addSticker(stickerId),
    }));
  }

  /**
   * Open a sticker pack
   */
  openPack(packId: string): { stickers: Sticker[]; success: boolean; error?: string } {
    const pack = STICKER_PACKS.find(p => p.id === packId);
    if (!pack) {
      return { stickers: [], success: false, error: 'Pack not found' };
    }

    // Check if user can afford
    if (!starWallet.canAfford(pack.price)) {
      return { stickers: [], success: false, error: 'Not enough stars' };
    }

    // Spend stars
    starWallet.spendStars(pack.price, packId, `Sticker Pack: ${pack.name.en}`);

    // Generate random stickers based on pack
    const drawnStickers = this.drawStickersFromPack(pack);

    // Add stickers to collection
    this.addMultipleStickers(drawnStickers.map(s => s.id));

    this.progress.packsOpened += 1;
    this.saveProgress();

    return { stickers: drawnStickers, success: true };
  }

  /**
   * Draw random stickers from a pack
   */
  private drawStickersFromPack(pack: StickerPack): Sticker[] {
    const drawn: Sticker[] = [];
    const availableStickers = pack.categoryFilter
      ? ALL_STICKERS.filter(s => s.category === pack.categoryFilter)
      : ALL_STICKERS;

    for (let i = 0; i < pack.stickerCount; i++) {
      const rarity = this.selectRarityFromWeights(pack.rarityWeights);
      const candidates = availableStickers.filter(s => s.rarity === rarity);

      if (candidates.length > 0) {
        const randomSticker = candidates[Math.floor(Math.random() * candidates.length)];
        drawn.push(randomSticker);
      }
    }

    return drawn;
  }

  /**
   * Select rarity based on weights
   */
  private selectRarityFromWeights(weights: Record<StickerRarity, number>): StickerRarity {
    const totalWeight = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const random = Math.random() * totalWeight;

    let cumulative = 0;
    for (const [rarity, weight] of Object.entries(weights)) {
      cumulative += weight;
      if (random <= cumulative) {
        return rarity as StickerRarity;
      }
    }

    return 'common'; // Fallback
  }

  /**
   * Earn stickers from story reading
   */
  earnStickersFromStory(storyId: string, isPerfectQuiz: boolean): Sticker[] {
    const count = isPerfectQuiz ? 3 : Math.floor(Math.random() * 2) + 1; // 1-2 for regular, 3 for perfect
    const stickers: Sticker[] = [];

    // Prioritize stickers from the story
    const storyStickers = ALL_STICKERS.filter(s => s.storySource === storyId);

    for (let i = 0; i < count; i++) {
      let sticker: Sticker;

      if (storyStickers.length > 0 && Math.random() < 0.5) {
        // 50% chance to get a story-related sticker
        sticker = storyStickers[Math.floor(Math.random() * storyStickers.length)];
      } else {
        // Random sticker
        const rarity = this.selectRarityFromWeights(RARITY_WEIGHTS);
        const candidates = ALL_STICKERS.filter(s => s.rarity === rarity);
        sticker = candidates[Math.floor(Math.random() * candidates.length)];
      }

      stickers.push(sticker);
      this.addSticker(sticker.id);
    }

    return stickers;
  }

  /**
   * Claim daily reward (1 sticker pack = 5 stickers)
   */
  claimDailyReward(): { stickers: Sticker[]; success: boolean; error?: string } {
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;

    if (this.progress.lastDailyReward && now - this.progress.lastDailyReward < oneDayMs) {
      const timeLeft = oneDayMs - (now - this.progress.lastDailyReward);
      const hoursLeft = Math.ceil(timeLeft / (60 * 60 * 1000));
      return { stickers: [], success: false, error: `Come back in ${hoursLeft} hours` };
    }

    // Generate 5 random stickers
    const stickers: Sticker[] = [];
    for (let i = 0; i < 5; i++) {
      const rarity = this.selectRarityFromWeights(RARITY_WEIGHTS);
      const candidates = ALL_STICKERS.filter(s => s.rarity === rarity);
      const sticker = candidates[Math.floor(Math.random() * candidates.length)];
      stickers.push(sticker);
      this.addSticker(sticker.id);
    }

    this.progress.lastDailyReward = now;
    this.saveProgress();

    return { stickers, success: true };
  }

  /**
   * Exchange 5 duplicates for a new sticker
   */
  exchangeDuplicates(stickerId: string): { newSticker?: Sticker; success: boolean; error?: string } {
    const collected = this.progress.collection.get(stickerId);

    if (!collected || collected.duplicates < 5) {
      return { success: false, error: 'Need 5 duplicates to exchange' };
    }

    // Remove 5 duplicates
    collected.duplicates -= 5;
    this.progress.collection.set(stickerId, collected);

    // Get a random new sticker (that user doesn't have)
    const missingStickers = ALL_STICKERS.filter(s => !this.progress.collection.has(s.id));

    if (missingStickers.length === 0) {
      return { success: false, error: 'You have all stickers!' };
    }

    const newSticker = missingStickers[Math.floor(Math.random() * missingStickers.length)];
    this.addSticker(newSticker.id);
    this.saveProgress();

    return { newSticker, success: true };
  }

  /**
   * Update completion percentage
   */
  private updateCompletionPercentage(): void {
    this.progress.albumCompletionPercentage =
      (this.progress.uniqueStickersCollected / ALL_STICKERS.length) * 100;
  }

  /**
   * Check if any pages are completed
   */
  private checkPageCompletion(): void {
    for (const page of this.progress.pages) {
      if (page.completed) continue;

      const allCollected = page.stickerIds.every(id => this.progress.collection.has(id));

      if (allCollected) {
        page.completed = true;
        page.completedAt = Date.now();

        // Award stars for page completion
        starWallet.earnStars('achievement-unlock', PAGE_COMPLETION_REWARD);

        this.dispatchPageComplete(page.id);
      }
    }

    // Check if entire album is complete
    const allPagesComplete = this.progress.pages.every(p => p.completed);
    if (allPagesComplete && this.progress.albumCompletionPercentage === 100) {
      starWallet.earnStars('achievement-unlock', ALBUM_COMPLETION_REWARD);
      this.dispatchAlbumComplete();
    }
  }

  /**
   * Add sticker to wishlist
   */
  addToWishlist(stickerId: string): boolean {
    if (this.progress.wishlist.length >= 10) {
      return false; // Max 10
    }

    if (!this.progress.wishlist.includes(stickerId)) {
      this.progress.wishlist.push(stickerId);
      this.saveProgress();
      return true;
    }

    return false;
  }

  /**
   * Remove sticker from wishlist
   */
  removeFromWishlist(stickerId: string): void {
    this.progress.wishlist = this.progress.wishlist.filter(id => id !== stickerId);
    this.saveProgress();
  }

  /**
   * Get missing stickers
   */
  getMissingStickers(): Sticker[] {
    return ALL_STICKERS.filter(s => !this.progress.collection.has(s.id));
  }

  /**
   * Get duplicate stickers (with count > 0)
   */
  getDuplicateStickers(): { sticker: Sticker; count: number }[] {
    const duplicates: { sticker: Sticker; count: number }[] = [];

    for (const [stickerId, collected] of this.progress.collection.entries()) {
      if (collected.duplicates > 0) {
        const sticker = ALL_STICKERS.find(s => s.id === stickerId);
        if (sticker) {
          duplicates.push({ sticker, count: collected.duplicates });
        }
      }
    }

    return duplicates;
  }

  /**
   * Generate QR code for trading
   */
  generateTradeQR(stickerIds: string[]): TradeData {
    const trade: TradeData = {
      id: `trade-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      stickers: stickerIds.slice(0, 5), // Max 5 stickers
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    return trade;
  }

  /**
   * Receive stickers from trade
   */
  receiveTradeStickers(tradeData: TradeData): { success: boolean; error?: string } {
    if (tradeData.expiresAt < Date.now()) {
      return { success: false, error: 'Trade expired' };
    }

    // Add stickers to collection
    tradeData.stickers.forEach(stickerId => {
      this.addSticker(stickerId);
      this.progress.tradeHistory.push({
        stickerId,
        timestamp: Date.now(),
        direction: 'received',
      });
    });

    this.saveProgress();
    return { success: true };
  }

  /**
   * Get progress data
   */
  getProgress(): AlbumProgress {
    return this.progress;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      totalStickersCollected: this.progress.totalStickersCollected,
      uniqueStickersCollected: this.progress.uniqueStickersCollected,
      totalStickers: ALL_STICKERS.length,
      completionPercentage: this.progress.albumCompletionPercentage,
      pagesCompleted: this.progress.pages.filter(p => p.completed).length,
      totalPages: this.progress.pages.length,
      packsOpened: this.progress.packsOpened,
      duplicatesCount: this.getDuplicateStickers().reduce((sum, d) => sum + d.count, 0),
      tradesCount: this.progress.tradeHistory.length,
    };
  }

  /**
   * Dispatch custom events
   */
  private dispatchUpdate(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sticker-album-update', {
        detail: { progress: this.progress },
      }));
    }
  }

  private dispatchPageComplete(pageId: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sticker-page-complete', {
        detail: { pageId },
      }));
    }
  }

  private dispatchAlbumComplete(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sticker-album-complete'));
    }
  }
}

// Global instance
export const stickerAlbum = new StickerAlbumManager();
