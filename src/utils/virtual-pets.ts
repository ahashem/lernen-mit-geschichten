/**
 * Virtual Pet System
 * Manages virtual pets that children can adopt from story characters
 */

export type PetGrowthStage = 'egg' | 'baby' | 'child' | 'teen' | 'adult';
export type PetPersonality = 'playful' | 'calm' | 'energetic' | 'shy' | 'brave' | 'curious';
export type PetMood = 'happy' | 'sad' | 'hungry' | 'sleepy' | 'sick' | 'energetic' | 'bored';
export type PetAnimation = 'idle' | 'happy' | 'sad' | 'hungry' | 'sleeping' | 'playing' | 'eating' | 'walking' | 'jumping' | 'sick';

export interface PetFood {
  id: string;
  name: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
  emoji: string;
  hungerRestore: number;
  happinessBonus: number;
  preferredBy: string[]; // character types that prefer this food
  cost: number; // stars needed to buy
}

export interface PetAccessory {
  id: string;
  name: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
  type: 'hat' | 'glasses' | 'bow' | 'collar' | 'cape' | 'crown';
  emoji: string;
  cost: number;
  unlockLevel: number;
}

export interface PetEnvironment {
  id: string;
  name: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
  emoji: string;
  cost: number;
  unlockLevel: number;
  effect?: {
    happiness?: number;
    energy?: number;
  };
}

export interface MiniGame {
  id: string;
  name: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
  emoji: string;
  energyCost: number;
  happinessGain: number;
  healthBonus?: number;
}

export interface PetStats {
  happiness: number; // 0-100
  hunger: number; // 0-100 (higher = more hungry)
  energy: number; // 0-100
  health: number; // 0-100
}

export interface Pet {
  id: string;
  name: string;
  characterId: string; // story character ID (e.g., '001-bruno')
  characterType: string; // bear, fox, rabbit, etc.
  emoji: string;
  personality: PetPersonality;
  stats: PetStats;
  growthStage: PetGrowthStage;
  level: number;
  experience: number;
  adoptedDate: number; // timestamp
  lastInteraction: number; // timestamp
  daysOwned: number;
  accessories: string[]; // IDs of equipped accessories
  currentEnvironment: string;
  achievements: string[];
}

export interface PetAchievement {
  id: string;
  name: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
  description: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
  emoji: string;
  requirement: {
    type: 'daysOwned' | 'level' | 'happiness' | 'games' | 'feeding';
    value: number;
  };
  reward: number; // stars
}

// Available foods
export const PET_FOODS: PetFood[] = [
  {
    id: 'honey',
    name: { de: 'Honig', en: 'Honey', ar: 'عسل', tr: 'Bal', ur: 'شہد' },
    emoji: '🍯',
    hungerRestore: 30,
    happinessBonus: 15,
    preferredBy: ['bear'],
    cost: 5
  },
  {
    id: 'berries',
    name: { de: 'Beeren', en: 'Berries', ar: 'توت', tr: 'Meyve', ur: 'بیریاں' },
    emoji: '🫐',
    hungerRestore: 20,
    happinessBonus: 10,
    preferredBy: ['bear', 'rabbit', 'bird'],
    cost: 3
  },
  {
    id: 'fish',
    name: { de: 'Fisch', en: 'Fish', ar: 'سمك', tr: 'Balık', ur: 'مچھلی' },
    emoji: '🐟',
    hungerRestore: 35,
    happinessBonus: 20,
    preferredBy: ['cat', 'penguin', 'bear'],
    cost: 7
  },
  {
    id: 'cheese',
    name: { de: 'Käse', en: 'Cheese', ar: 'جبن', tr: 'Peynir', ur: 'پنیر' },
    emoji: '🧀',
    hungerRestore: 25,
    happinessBonus: 12,
    preferredBy: ['mouse', 'hedgehog'],
    cost: 4
  },
  {
    id: 'carrot',
    name: { de: 'Karotte', en: 'Carrot', ar: 'جزرة', tr: 'Havuç', ur: 'گاجر' },
    emoji: '🥕',
    hungerRestore: 20,
    happinessBonus: 15,
    preferredBy: ['rabbit'],
    cost: 3
  },
  {
    id: 'apple',
    name: { de: 'Apfel', en: 'Apple', ar: 'تفاح', tr: 'Elma', ur: 'سیب' },
    emoji: '🍎',
    hungerRestore: 15,
    happinessBonus: 8,
    preferredBy: ['hedgehog', 'squirrel', 'deer'],
    cost: 2
  },
  {
    id: 'nuts',
    name: { de: 'Nüsse', en: 'Nuts', ar: 'مكسرات', tr: 'Fındık', ur: 'گری دار میوے' },
    emoji: '🥜',
    hungerRestore: 18,
    happinessBonus: 10,
    preferredBy: ['squirrel', 'mouse'],
    cost: 3
  },
  {
    id: 'banana',
    name: { de: 'Banane', en: 'Banana', ar: 'موز', tr: 'Muz', ur: 'کیلا' },
    emoji: '🍌',
    hungerRestore: 20,
    happinessBonus: 12,
    preferredBy: ['monkey'],
    cost: 4
  },
  {
    id: 'milk',
    name: { de: 'Milch', en: 'Milk', ar: 'حليب', tr: 'Süt', ur: 'دودھ' },
    emoji: '🥛',
    hungerRestore: 15,
    happinessBonus: 10,
    preferredBy: ['cat', 'dog'],
    cost: 3
  },
  {
    id: 'seeds',
    name: { de: 'Samen', en: 'Seeds', ar: 'بذور', tr: 'Tohum', ur: 'بیج' },
    emoji: '🌻',
    hungerRestore: 10,
    happinessBonus: 8,
    preferredBy: ['bird', 'hamster'],
    cost: 2
  }
];

// Available accessories
export const PET_ACCESSORIES: PetAccessory[] = [
  {
    id: 'red-hat',
    name: { de: 'Roter Hut', en: 'Red Hat', ar: 'قبعة حمراء', tr: 'Kırmızı Şapka', ur: 'سرخ ٹوپی' },
    type: 'hat',
    emoji: '🎩',
    cost: 50,
    unlockLevel: 1
  },
  {
    id: 'sunglasses',
    name: { de: 'Sonnenbrille', en: 'Sunglasses', ar: 'نظارة شمسية', tr: 'Güneş Gözlüğü', ur: 'دھوپ کے چشمے' },
    type: 'glasses',
    emoji: '😎',
    cost: 40,
    unlockLevel: 2
  },
  {
    id: 'pink-bow',
    name: { de: 'Rosa Schleife', en: 'Pink Bow', ar: 'فيونكة وردية', tr: 'Pembe Fiyonk', ur: 'گلابی ربن' },
    type: 'bow',
    emoji: '🎀',
    cost: 35,
    unlockLevel: 1
  },
  {
    id: 'gold-crown',
    name: { de: 'Goldkrone', en: 'Gold Crown', ar: 'تاج ذهبي', tr: 'Altın Taç', ur: 'سونے کا تاج' },
    type: 'crown',
    emoji: '👑',
    cost: 100,
    unlockLevel: 5
  },
  {
    id: 'superhero-cape',
    name: { de: 'Superhelden-Umhang', en: 'Superhero Cape', ar: 'عباءة البطل الخارق', tr: 'Süper Kahraman Pelerini', ur: 'سپر ہیرو کیپ' },
    type: 'cape',
    emoji: '🦸',
    cost: 80,
    unlockLevel: 4
  },
  {
    id: 'star-collar',
    name: { de: 'Sternenhalsband', en: 'Star Collar', ar: 'طوق النجوم', tr: 'Yıldız Tasması', ur: 'ستارے کا کالر' },
    type: 'collar',
    emoji: '⭐',
    cost: 45,
    unlockLevel: 2
  }
];

// Available environments
export const PET_ENVIRONMENTS: PetEnvironment[] = [
  {
    id: 'home',
    name: { de: 'Zuhause', en: 'Home', ar: 'المنزل', tr: 'Ev', ur: 'گھر' },
    emoji: '🏠',
    cost: 0,
    unlockLevel: 0
  },
  {
    id: 'park',
    name: { de: 'Park', en: 'Park', ar: 'الحديقة', tr: 'Park', ur: 'پارک' },
    emoji: '🌳',
    cost: 30,
    unlockLevel: 2,
    effect: { happiness: 5, energy: 10 }
  },
  {
    id: 'beach',
    name: { de: 'Strand', en: 'Beach', ar: 'الشاطئ', tr: 'Plaj', ur: 'ساحل' },
    emoji: '🏖️',
    cost: 50,
    unlockLevel: 3,
    effect: { happiness: 10, energy: 5 }
  },
  {
    id: 'forest',
    name: { de: 'Wald', en: 'Forest', ar: 'الغابة', tr: 'Orman', ur: 'جنگل' },
    emoji: '🌲',
    cost: 40,
    unlockLevel: 2,
    effect: { happiness: 8, energy: 8 }
  },
  {
    id: 'space',
    name: { de: 'Weltraum', en: 'Space', ar: 'الفضاء', tr: 'Uzay', ur: 'خلا' },
    emoji: '🚀',
    cost: 150,
    unlockLevel: 8,
    effect: { happiness: 20 }
  }
];

// Mini-games
export const MINI_GAMES: MiniGame[] = [
  {
    id: 'fetch',
    name: { de: 'Apportieren', en: 'Fetch', ar: 'الإحضار', tr: 'Getir', ur: 'لاؤ' },
    emoji: '🎾',
    energyCost: 15,
    happinessGain: 20
  },
  {
    id: 'hide-seek',
    name: { de: 'Verstecken', en: 'Hide & Seek', ar: 'الاختباء والبحث', tr: 'Saklambaç', ur: 'چھپن چھپائی' },
    emoji: '👀',
    energyCost: 20,
    happinessGain: 25
  },
  {
    id: 'dance',
    name: { de: 'Tanzen', en: 'Dance', ar: 'الرقص', tr: 'Dans', ur: 'رقص' },
    emoji: '💃',
    energyCost: 25,
    happinessGain: 30,
    healthBonus: 5
  },
  {
    id: 'puzzle',
    name: { de: 'Puzzle', en: 'Puzzle', ar: 'لغز', tr: 'Bulmaca', ur: 'پہیلی' },
    emoji: '🧩',
    energyCost: 10,
    happinessGain: 15
  },
  {
    id: 'chase',
    name: { de: 'Fangen', en: 'Chase', ar: 'المطاردة', tr: 'Kovalamaca', ur: 'پکڑو' },
    emoji: '🏃',
    energyCost: 30,
    happinessGain: 25,
    healthBonus: 10
  }
];

// Achievements
export const PET_ACHIEVEMENTS: PetAchievement[] = [
  {
    id: 'pet-parent',
    name: { de: 'Haustier-Eltern', en: 'Pet Parent', ar: 'والد حيوان أليف', tr: 'Evcil Hayvan Ebeveyni', ur: 'پالتو جانور کے والدین' },
    description: { de: 'Adoptiere dein erstes Haustier', en: 'Adopt your first pet', ar: 'تبني حيوانك الأليف الأول', tr: 'İlk evcil hayvanını evlat edin', ur: 'اپنا پہلا پالتو جانور گود لیں' },
    emoji: '🏆',
    requirement: { type: 'daysOwned', value: 1 },
    reward: 50
  },
  {
    id: 'super-caretaker',
    name: { de: 'Super-Pfleger', en: 'Super Caretaker', ar: 'مقدم رعاية ممتاز', tr: 'Süper Bakıcı', ur: 'بہترین دیکھ بھال کرنے والا' },
    description: { de: 'Halte Glück über 90 für 7 Tage', en: 'Keep happiness above 90 for 7 days', ar: 'حافظ على السعادة فوق 90 لمدة 7 أيام', tr: '7 gün boyunca mutluluğu 90\'ın üzerinde tut', ur: '7 دنوں تک خوشی 90 سے اوپر رکھیں' },
    emoji: '⭐',
    requirement: { type: 'happiness', value: 90 },
    reward: 100
  },
  {
    id: 'pet-lover',
    name: { de: 'Tierliebhaber', en: 'Pet Lover', ar: 'محب الحيوانات', tr: 'Hayvan Sever', ur: 'جانوروں سے محبت کرنے والا' },
    description: { de: 'Besitze 3 Haustiere gleichzeitig', en: 'Own 3 pets simultaneously', ar: 'امتلك 3 حيوانات أليفة في وقت واحد', tr: 'Aynı anda 3 evcil hayvana sahip ol', ur: 'بیک وقت 3 پالتو جانور رکھیں' },
    emoji: '💕',
    requirement: { type: 'daysOwned', value: 30 },
    reward: 150
  },
  {
    id: 'game-master',
    name: { de: 'Spiel-Meister', en: 'Game Master', ar: 'سيد الألعاب', tr: 'Oyun Ustası', ur: 'گیم ماسٹر' },
    description: { de: 'Spiele 50 Minispiele', en: 'Play 50 mini-games', ar: 'العب 50 لعبة صغيرة', tr: '50 mini oyun oyna', ur: '50 منی گیمز کھیلیں' },
    emoji: '🎮',
    requirement: { type: 'games', value: 50 },
    reward: 75
  },
  {
    id: 'master-chef',
    name: { de: 'Meisterkoch', en: 'Master Chef', ar: 'طاهٍ رئيسي', tr: 'Usta Şef', ur: 'ماسٹر شیف' },
    description: { de: 'Füttere dein Haustier 100 Mal', en: 'Feed your pet 100 times', ar: 'أطعم حيوانك الأليف 100 مرة', tr: 'Evcil hayvanını 100 kez besle', ur: 'اپنے پالتو جانور کو 100 بار کھلائیں' },
    emoji: '👨‍🍳',
    requirement: { type: 'feeding', value: 100 },
    reward: 80
  }
];

/**
 * Create a new pet from a story character
 */
export function createPet(characterId: string, characterType: string, emoji: string, name: string): Pet {
  const personalities: PetPersonality[] = ['playful', 'calm', 'energetic', 'shy', 'brave', 'curious'];
  const randomPersonality = personalities[Math.floor(Math.random() * personalities.length)];

  return {
    id: `pet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name,
    characterId,
    characterType,
    emoji,
    personality: randomPersonality,
    stats: {
      happiness: 80,
      hunger: 30,
      energy: 70,
      health: 100
    },
    growthStage: 'egg',
    level: 1,
    experience: 0,
    adoptedDate: Date.now(),
    lastInteraction: Date.now(),
    daysOwned: 0,
    accessories: [],
    currentEnvironment: 'home',
    achievements: []
  };
}

/**
 * Calculate pet's current mood based on stats
 */
export function calculateMood(stats: PetStats): PetMood {
  if (stats.health < 30) return 'sick';
  if (stats.hunger > 80) return 'hungry';
  if (stats.energy < 20) return 'sleepy';
  if (stats.happiness < 30) return 'sad';
  if (stats.happiness > 80 && stats.energy > 60) return 'energetic';
  if (stats.happiness > 60) return 'happy';
  return 'bored';
}

/**
 * Determine growth stage based on days owned and care quality
 */
export function updateGrowthStage(pet: Pet): PetGrowthStage {
  const avgStats = (pet.stats.happiness + pet.stats.health + (100 - pet.stats.hunger) + pet.stats.energy) / 4;
  const careQuality = avgStats / 100; // 0-1

  if (pet.daysOwned < 1) return 'egg';
  if (pet.daysOwned < 3) return 'baby';
  if (pet.daysOwned < 7) return 'child';
  if (pet.daysOwned < 14) return 'teen';

  // Only become adult if well cared for
  if (pet.daysOwned >= 14 && careQuality > 0.6) return 'adult';

  return 'teen';
}

/**
 * Feed the pet
 */
export function feedPet(pet: Pet, food: PetFood): Pet {
  const isPreferred = food.preferredBy.includes(pet.characterType);
  const hungerReduction = food.hungerRestore * (isPreferred ? 1.5 : 1);
  const happinessIncrease = food.happinessBonus * (isPreferred ? 1.5 : 1);

  return {
    ...pet,
    stats: {
      ...pet.stats,
      hunger: Math.max(0, pet.stats.hunger - hungerReduction),
      happiness: Math.min(100, pet.stats.happiness + happinessIncrease),
      health: Math.min(100, pet.stats.health + 2)
    },
    lastInteraction: Date.now(),
    experience: pet.experience + 5
  };
}

/**
 * Play a mini-game with the pet
 */
export function playGame(pet: Pet, game: MiniGame): Pet | null {
  if (pet.stats.energy < game.energyCost) {
    return null; // Not enough energy
  }

  return {
    ...pet,
    stats: {
      ...pet.stats,
      energy: Math.max(0, pet.stats.energy - game.energyCost),
      happiness: Math.min(100, pet.stats.happiness + game.happinessGain),
      health: Math.min(100, pet.stats.health + (game.healthBonus || 0))
    },
    lastInteraction: Date.now(),
    experience: pet.experience + 10
  };
}

/**
 * Put pet to sleep
 */
export function sleepPet(pet: Pet, hours: number): Pet {
  const energyRestored = Math.min(100, hours * 15);

  return {
    ...pet,
    stats: {
      ...pet.stats,
      energy: Math.min(100, pet.stats.energy + energyRestored),
      hunger: Math.min(100, pet.stats.hunger + (hours * 5)), // Gets hungrier while sleeping
      happiness: Math.max(0, pet.stats.happiness - (hours * 2)) // Gets a bit bored
    },
    lastInteraction: Date.now()
  };
}

/**
 * Clean/groom the pet
 */
export function cleanPet(pet: Pet): Pet {
  return {
    ...pet,
    stats: {
      ...pet.stats,
      happiness: Math.min(100, pet.stats.happiness + 15),
      health: Math.min(100, pet.stats.health + 10)
    },
    lastInteraction: Date.now(),
    experience: pet.experience + 5
  };
}

/**
 * Exercise the pet
 */
export function exercisePet(pet: Pet): Pet | null {
  if (pet.stats.energy < 20) {
    return null; // Too tired
  }

  return {
    ...pet,
    stats: {
      ...pet.stats,
      energy: Math.max(0, pet.stats.energy - 20),
      happiness: Math.min(100, pet.stats.happiness + 10),
      health: Math.min(100, pet.stats.health + 15),
      hunger: Math.min(100, pet.stats.hunger + 10)
    },
    lastInteraction: Date.now(),
    experience: pet.experience + 8
  };
}

/**
 * Update pet stats based on time passed
 */
export function updatePetStats(pet: Pet): Pet {
  const now = Date.now();
  const hoursPassed = (now - pet.lastInteraction) / (1000 * 60 * 60);

  if (hoursPassed < 0.5) return pet; // Don't update if less than 30 minutes

  // Stats decay over time
  const hungerIncrease = Math.min(100, hoursPassed * 3);
  const energyDecrease = Math.min(100, hoursPassed * 2);
  const happinessDecrease = Math.min(100, hoursPassed * 1.5);

  const newStats: PetStats = {
    hunger: Math.min(100, pet.stats.hunger + hungerIncrease),
    energy: Math.max(0, pet.stats.energy - energyDecrease),
    happiness: Math.max(0, pet.stats.happiness - happinessDecrease),
    health: pet.stats.health
  };

  // Health decreases if very hungry or very sad
  if (newStats.hunger > 90 || newStats.happiness < 20) {
    newStats.health = Math.max(0, newStats.health - (hoursPassed * 5));
  }

  // Update days owned
  const daysPassed = Math.floor((now - pet.adoptedDate) / (1000 * 60 * 60 * 24));
  const newGrowthStage = updateGrowthStage({ ...pet, daysOwned: daysPassed });

  return {
    ...pet,
    stats: newStats,
    daysOwned: daysPassed,
    growthStage: newGrowthStage,
    lastInteraction: now
  };
}

/**
 * Check if pet can level up
 */
export function checkLevelUp(pet: Pet): { pet: Pet; leveledUp: boolean } {
  const experienceNeeded = pet.level * 100;

  if (pet.experience >= experienceNeeded) {
    return {
      pet: {
        ...pet,
        level: pet.level + 1,
        experience: pet.experience - experienceNeeded
      },
      leveledUp: true
    };
  }

  return { pet, leveledUp: false };
}

/**
 * Save pets to localStorage
 */
export function savePets(pets: Pet[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('virtual-pets', JSON.stringify(pets));
}

/**
 * Load pets from localStorage
 */
export function loadPets(): Pet[] {
  if (typeof localStorage === 'undefined') return [];

  const data = localStorage.getItem('virtual-pets');
  if (!data) return [];

  try {
    const pets = JSON.parse(data) as Pet[];
    // Update all pets based on time passed
    return pets.map(updatePetStats);
  } catch {
    return [];
  }
}

/**
 * Get available story characters for adoption
 */
export function getAvailableCharacters(): Array<{ id: string; type: string; emoji: string; name: string }> {
  return [
    { id: '001-bruno', type: 'bear', emoji: '🐻', name: 'Bruno' },
    { id: '002-fritz', type: 'fox', emoji: '🦊', name: 'Fritz' },
    { id: '003-lina', type: 'rabbit', emoji: '🐰', name: 'Lina' },
    { id: '004-tobi', type: 'turtle', emoji: '🐢', name: 'Tobi' },
    { id: '005-mila', type: 'mouse', emoji: '🐭', name: 'Mila' },
    { id: '006-moritz', type: 'monkey', emoji: '🐵', name: 'Moritz' },
    { id: '010-leo', type: 'lion', emoji: '🦁', name: 'Leo' }
  ];
}
