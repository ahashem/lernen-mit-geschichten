// Card Collection Management
// LocalStorage-based card collection, deck building, and progression

import { Card, CARD_DATABASE, createCard, Rarity } from './card-battle';

// Re-export CARD_DATABASE for convenience
export { CARD_DATABASE };
export interface PlayerCollection {
  cards: CollectedCard[];
  stars: number;
  rank: Rank;
  rankPoints: number;
  achievements: Achievement[];
  battleHistory: BattleRecord[];
  dailyBattleCompleted: boolean;
  lastDailyBattleDate: string;
}

export interface CollectedCard {
  cardId: string;
  level: number;
  xp: number;
  isShiny: boolean;
  quantity: number; // How many duplicates
  acquiredDate: number;
}

export type Rank = 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond' | 'Master';

export interface Achievement {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  nameUr: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  descriptionUr: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: number;
  progress: number;
  maxProgress: number;
  reward: { stars?: number; cardId?: string };
}

export interface BattleRecord {
  id: string;
  date: number;
  opponentName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  result: 'win' | 'loss';
  turnsPlayed: number;
  starsEarned: number;
  cardsUsed: string[];
}

const STORAGE_KEY = 'card-battle-collection';
const STARTER_DECK_SIZE = 10;

// Achievement definitions
export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedDate' | 'progress'>[] = [
  {
    id: 'first-battle',
    name: 'Erste Schlacht',
    nameAr: 'المعركة الأولى',
    nameEn: 'First Battle',
    nameTr: 'İlk Savaş',
    nameUr: 'پہلی جنگ',
    description: 'Gewinne deine erste Schlacht',
    descriptionAr: 'اربح معركتك الأولى',
    descriptionEn: 'Win your first battle',
    descriptionTr: 'İlk savaşını kazan',
    descriptionUr: 'اپنی پہلی جنگ جیتیں',
    icon: '⚔️',
    maxProgress: 1,
    reward: { stars: 50 }
  },
  {
    id: 'card-collector',
    name: 'Kartensammler',
    nameAr: 'جامع البطاقات',
    nameEn: 'Card Collector',
    nameTr: 'Kart Koleksiyoncusu',
    nameUr: 'کارڈ جمع کرنے والا',
    description: 'Sammle 20 verschiedene Karten',
    descriptionAr: 'اجمع 20 بطاقة مختلفة',
    descriptionEn: 'Collect 20 different cards',
    descriptionTr: '20 farklı kart topla',
    descriptionUr: '20 مختلف کارڈز جمع کریں',
    icon: '🃏',
    maxProgress: 20,
    reward: { stars: 100, cardId: 'panda-peace' }
  },
  {
    id: 'battle-master',
    name: 'Kampfmeister',
    nameAr: 'سيد القتال',
    nameEn: 'Battle Master',
    nameTr: 'Savaş Ustası',
    nameUr: 'جنگ کا ماہر',
    description: 'Gewinne 50 Schlachten',
    descriptionAr: 'اربح 50 معركة',
    descriptionEn: 'Win 50 battles',
    descriptionTr: '50 savaş kazan',
    descriptionUr: '50 جنگیں جیتیں',
    icon: '🏆',
    maxProgress: 50,
    reward: { stars: 500 }
  },
  {
    id: 'undefeated-champion',
    name: 'Unbesiegter Champion',
    nameAr: 'البطل الذي لا يُقهر',
    nameEn: 'Undefeated Champion',
    nameTr: 'Yenilmez Şampiyon',
    nameUr: 'ناقابل شکست چیمپیئن',
    description: 'Gewinne 10 Schlachten in Folge',
    descriptionAr: 'اربح 10 معارك متتالية',
    descriptionEn: 'Win 10 battles in a row',
    descriptionTr: 'Üst üste 10 savaş kazan',
    descriptionUr: 'لگاتار 10 جنگیں جیتیں',
    icon: '👑',
    maxProgress: 10,
    reward: { stars: 300, cardId: 'dragon-brave' }
  },
  {
    id: 'legendary-collector',
    name: 'Legendärer Sammler',
    nameAr: 'جامع أسطوري',
    nameEn: 'Legendary Collector',
    nameTr: 'Efsanevi Koleksiyoncu',
    nameUr: 'افسانوی جمع کرنے والا',
    description: 'Sammle 5 legendäre Karten',
    descriptionAr: 'اجمع 5 بطاقات أسطورية',
    descriptionEn: 'Collect 5 legendary cards',
    descriptionTr: '5 efsanevi kart topla',
    descriptionUr: '5 افسانوی کارڈز جمع کریں',
    icon: '🌟',
    maxProgress: 5,
    reward: { stars: 200 }
  },
  {
    id: 'element-master-fire',
    name: 'Feuermeister',
    nameAr: 'سيد النار',
    nameEn: 'Fire Master',
    nameTr: 'Ateş Ustası',
    nameUr: 'آگ کا ماہر',
    description: 'Gewinne 10 Schlachten mit Feuerkarten',
    descriptionAr: 'اربح 10 معارك ببطاقات النار',
    descriptionEn: 'Win 10 battles with Fire cards',
    descriptionTr: 'Ateş kartlarıyla 10 savaş kazan',
    descriptionUr: 'آگ کے کارڈز سے 10 جنگیں جیتیں',
    icon: '🔥',
    maxProgress: 10,
    reward: { cardId: 'leo-lion' }
  },
  {
    id: 'shiny-hunter',
    name: 'Glänzender Jäger',
    nameAr: 'صياد اللامع',
    nameEn: 'Shiny Hunter',
    nameTr: 'Parlak Avcı',
    nameUr: 'چمکدار شکاری',
    description: 'Finde eine glänzende Karte',
    descriptionAr: 'اعثر على بطاقة لامعة',
    descriptionEn: 'Find a shiny card',
    descriptionTr: 'Parlak bir kart bul',
    descriptionUr: 'ایک چمکدار کارڈ تلاش کریں',
    icon: '✨',
    maxProgress: 1,
    reward: { stars: 150 }
  },
  {
    id: 'max-level',
    name: 'Maximale Stufe',
    nameAr: 'المستوى الأقصى',
    nameEn: 'Max Level',
    nameTr: 'Maksimum Seviye',
    nameUr: 'زیادہ سے زیادہ سطح',
    description: 'Bringe eine Karte auf Stufe 10',
    descriptionAr: 'ارفع بطاقة إلى المستوى 10',
    descriptionEn: 'Upgrade a card to level 10',
    descriptionTr: 'Bir kartı seviye 10\'a yükselt',
    descriptionUr: 'ایک کارڈ کو سطح 10 تک اپ گریڈ کریں',
    icon: '💯',
    maxProgress: 1,
    reward: { stars: 250 }
  },
  {
    id: 'story-reader',
    name: 'Geschichtenleser',
    nameAr: 'قارئ القصص',
    nameEn: 'Story Reader',
    nameTr: 'Hikaye Okuyucu',
    nameUr: 'کہانی پڑھنے والا',
    description: 'Lies 10 Geschichten',
    descriptionAr: 'اقرأ 10 قصص',
    descriptionEn: 'Read 10 stories',
    descriptionTr: '10 hikaye oku',
    descriptionUr: '10 کہانیاں پڑھیں',
    icon: '📚',
    maxProgress: 10,
    reward: { stars: 100 }
  },
  {
    id: 'quiz-master',
    name: 'Quiz-Meister',
    nameAr: 'سيد الاختبار',
    nameEn: 'Quiz Master',
    nameTr: 'Test Ustası',
    nameUr: 'کوئز ماہر',
    description: 'Bestehe 20 Quizfragen perfekt',
    descriptionAr: 'اجتاز 20 اختبارًا بشكل مثالي',
    descriptionEn: 'Perfect 20 quizzes',
    descriptionTr: '20 testi mükemmel geç',
    descriptionUr: '20 کوئز کامل طور پر پاس کریں',
    icon: '🎯',
    maxProgress: 20,
    reward: { cardId: 'timmi-thinking' }
  }
];

export function getRankThresholds(): Record<Rank, number> {
  return {
    Bronze: 0,
    Silver: 500,
    Gold: 1500,
    Platinum: 3000,
    Diamond: 6000,
    Master: 10000
  };
}

export function getRankFromPoints(points: number): Rank {
  const thresholds = getRankThresholds();
  if (points >= thresholds.Master) return 'Master';
  if (points >= thresholds.Diamond) return 'Diamond';
  if (points >= thresholds.Platinum) return 'Platinum';
  if (points >= thresholds.Gold) return 'Gold';
  if (points >= thresholds.Silver) return 'Silver';
  return 'Bronze';
}

export function loadCollection(): PlayerCollection {
  if (typeof window === 'undefined') {
    return createNewCollection();
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const newCollection = createNewCollection();
    saveCollection(newCollection);
    return newCollection;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return createNewCollection();
  }
}

export function saveCollection(collection: PlayerCollection): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection));
}

function createNewCollection(): PlayerCollection {
  const starterCards = getStarterDeck();

  return {
    cards: starterCards,
    stars: 100,
    rank: 'Bronze',
    rankPoints: 0,
    achievements: ACHIEVEMENTS.map(a => ({
      ...a,
      unlocked: false,
      progress: 0
    })),
    battleHistory: [],
    dailyBattleCompleted: false,
    lastDailyBattleDate: new Date().toISOString().split('T')[0]
  };
}

function getStarterDeck(): CollectedCard[] {
  // Give 10 common cards as starter deck
  const commonCards = CARD_DATABASE.filter(c => c.rarity === 'Common');
  const starterCards: CollectedCard[] = [];

  for (let i = 0; i < STARTER_DECK_SIZE && i < commonCards.length; i++) {
    starterCards.push({
      cardId: commonCards[i].id,
      level: 1,
      xp: 0,
      isShiny: false,
      quantity: 1,
      acquiredDate: Date.now()
    });
  }

  return starterCards;
}

export function addCardToCollection(collection: PlayerCollection, cardId: string, isShiny: boolean = false): void {
  const existing = collection.cards.find(c => c.cardId === cardId && c.isShiny === isShiny);

  if (existing) {
    existing.quantity += 1;
  } else {
    collection.cards.push({
      cardId,
      level: 1,
      xp: 0,
      isShiny,
      quantity: 1,
      acquiredDate: Date.now()
    });
  }

  checkAchievements(collection);
  saveCollection(collection);
}

export function upgradeCard(collection: PlayerCollection, cardId: string, isShiny: boolean): boolean {
  const card = collection.cards.find(c => c.cardId === cardId && c.isShiny === isShiny);
  if (!card) return false;

  const cardData = CARD_DATABASE.find(c => c.id === cardId);
  if (!cardData) return false;

  const xpNeeded = card.level * 100;

  if (card.xp >= xpNeeded && card.level < 10) {
    card.level += 1;
    card.xp = 0;
    checkAchievements(collection);
    saveCollection(collection);
    return true;
  }

  return false;
}

export function convertDuplicateToXP(collection: PlayerCollection, cardId: string, isShiny: boolean): boolean {
  const card = collection.cards.find(c => c.cardId === cardId && c.isShiny === isShiny);
  if (!card || card.quantity <= 1) return false;

  card.quantity -= 1;
  card.xp += 50; // Each duplicate = 50 XP

  saveCollection(collection);
  return true;
}

export function openCardPack(collection: PlayerCollection, packSize: number = 5): Card[] {
  const cost = 100;
  if (collection.stars < cost) {
    return [];
  }

  collection.stars -= cost;
  const drawnCards: Card[] = [];

  for (let i = 0; i < packSize; i++) {
    const { cardData, isShiny } = drawRandomCard();
    const card = createCard(cardData, 1, isShiny);
    drawnCards.push(card);
    addCardToCollection(collection, cardData.id, isShiny);
  }

  saveCollection(collection);
  return drawnCards;
}

function drawRandomCard(): { cardData: typeof CARD_DATABASE[0]; isShiny: boolean } {
  // Rarity rates: Common 50%, Rare 30%, Epic 15%, Legendary 4%, Mythic 1%
  const roll = Math.random() * 100;
  let targetRarity: Rarity;

  if (roll < 1) targetRarity = 'Mythic';
  else if (roll < 5) targetRarity = 'Legendary';
  else if (roll < 20) targetRarity = 'Epic';
  else if (roll < 50) targetRarity = 'Rare';
  else targetRarity = 'Common';

  const cardsOfRarity = CARD_DATABASE.filter(c => c.rarity === targetRarity);
  const cardData = cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];

  // 5% chance for shiny
  const isShiny = Math.random() < 0.05;

  return { cardData, isShiny };
}

export function recordBattle(
  collection: PlayerCollection,
  result: 'win' | 'loss',
  opponentName: string,
  difficulty: 'easy' | 'medium' | 'hard',
  turnsPlayed: number,
  cardsUsed: string[]
): void {
  const starsEarned = result === 'win' ? 30 : 10;
  collection.stars += starsEarned;

  const battle: BattleRecord = {
    id: `battle-${Date.now()}`,
    date: Date.now(),
    opponentName,
    difficulty,
    result,
    turnsPlayed,
    starsEarned,
    cardsUsed
  };

  collection.battleHistory.push(battle);

  // Update rank points
  if (result === 'win') {
    const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 25 : 50;
    collection.rankPoints += points;
    collection.rank = getRankFromPoints(collection.rankPoints);
  }

  checkAchievements(collection);
  saveCollection(collection);
}

export function checkAchievements(collection: PlayerCollection): void {
  collection.achievements.forEach(achievement => {
    if (achievement.unlocked) return;

    switch (achievement.id) {
      case 'first-battle':
        achievement.progress = collection.battleHistory.filter(b => b.result === 'win').length;
        break;
      case 'card-collector':
        achievement.progress = collection.cards.length;
        break;
      case 'battle-master':
        achievement.progress = collection.battleHistory.filter(b => b.result === 'win').length;
        break;
      case 'undefeated-champion':
        achievement.progress = getWinStreak(collection);
        break;
      case 'legendary-collector':
        achievement.progress = collection.cards.filter(c => {
          const cardData = CARD_DATABASE.find(cd => cd.id === c.cardId);
          return cardData?.rarity === 'Legendary';
        }).length;
        break;
      case 'shiny-hunter':
        achievement.progress = collection.cards.filter(c => c.isShiny).length;
        break;
      case 'max-level':
        achievement.progress = collection.cards.filter(c => c.level === 10).length;
        break;
    }

    if (achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      unlockAchievement(collection, achievement.id);
    }
  });
}

function getWinStreak(collection: PlayerCollection): number {
  let streak = 0;
  const recent = [...collection.battleHistory].reverse();

  for (const battle of recent) {
    if (battle.result === 'win') {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function unlockAchievement(collection: PlayerCollection, achievementId: string): void {
  const achievement = collection.achievements.find(a => a.id === achievementId);
  if (!achievement) return;

  achievement.unlocked = true;
  achievement.unlockedDate = Date.now();

  if (achievement.reward.stars) {
    collection.stars += achievement.reward.stars;
  }

  if (achievement.reward.cardId) {
    addCardToCollection(collection, achievement.reward.cardId, false);
  }
}

export function getCardFromCollection(collection: PlayerCollection, cardId: string, isShiny: boolean = false): CollectedCard | undefined {
  return collection.cards.find(c => c.cardId === cardId && c.isShiny === isShiny);
}

export function buildDeck(collection: PlayerCollection, cardIds: string[]): Card[] {
  const deck: Card[] = [];

  cardIds.forEach(cardId => {
    const collectedCard = collection.cards.find(c => c.cardId === cardId);
    if (!collectedCard) return;

    const cardData = CARD_DATABASE.find(c => c.id === cardId);
    if (!cardData) return;

    const card = createCard(cardData, collectedCard.level, collectedCard.isShiny);
    deck.push(card);
  });

  return deck;
}

export function checkDailyBattle(collection: PlayerCollection): boolean {
  const today = new Date().toISOString().split('T')[0];

  if (collection.lastDailyBattleDate !== today) {
    collection.dailyBattleCompleted = false;
    collection.lastDailyBattleDate = today;
    saveCollection(collection);
  }

  return !collection.dailyBattleCompleted;
}

export function completeDailyBattle(collection: PlayerCollection): void {
  collection.dailyBattleCompleted = true;
  collection.stars += 50; // Bonus stars for daily
  saveCollection(collection);
}

export function earnCardFromStory(collection: PlayerCollection, storyId: string): void {
  const cardData = CARD_DATABASE.find(c => c.storyId === storyId);
  if (cardData) {
    addCardToCollection(collection, cardData.id);
  }
}

export function earnCardFromQuiz(collection: PlayerCollection): void {
  // Random card reward for perfect quiz
  const { cardData, isShiny } = drawRandomCard();
  addCardToCollection(collection, cardData.id, isShiny);
}
