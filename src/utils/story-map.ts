/**
 * Story Map - Location Management and Journey Tracking
 * Manages 8 story settings with character positions, paths, and unlockables
 */

export interface MapLocation {
  id: string;
  name: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  coordinates: { x: number; y: number }; // SVG coordinates (0-1000 range)
  icon: string; // emoji
  color: string;
  stories: string[]; // storyIds set in this location
  unlockRequirement?: number; // number of completed stories needed
  description: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  weatherEffect?: 'rain' | 'snow' | 'sun' | 'clouds' | 'storm';
  dayNightVariant?: boolean; // has day/night mode
}

export interface CharacterMarker {
  characterId: string;
  name: string;
  emoji: string;
  currentLocation: string; // locationId
  color: string;
  visitedLocations: string[];
}

export interface JourneyPath {
  from: string; // locationId
  to: string; // locationId
  character: string; // characterId
  storyId: string;
  completed: boolean;
  color: string;
}

export interface TreasureMarker {
  id: string;
  locationId: string;
  coordinates: { x: number; y: number };
  name: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  discovered: boolean;
  reward: number; // stars
}

export interface MapProgress {
  visitedLocations: string[];
  completedPaths: string[];
  discoveredTreasures: string[];
  unlockedLocations: string[];
  totalStoriesCompleted: number;
  characters: CharacterMarker[];
  achievements: string[];
}

// 8 Story Settings with metadata
export const mapLocations: MapLocation[] = [
  {
    id: 'forest',
    name: {
      de: 'Wald',
      ar: 'الغابة',
      en: 'Forest',
      tr: 'Orman',
      ur: 'جنگل',
    },
    coordinates: { x: 200, y: 350 },
    icon: '🌲',
    color: '#4CAF50',
    stories: ['001-bruno', '001-bruno-interactive', '001-bruno-super-interactive'],
    description: {
      de: 'Ein geheimnisvoller Wald voller Freunde und Abenteuer',
      ar: 'غابة غامضة مليئة بالأصدقاء والمغامرات',
      en: 'A mysterious forest full of friends and adventures',
      tr: 'Arkadaşlarla ve maceralarla dolu gizemli bir orman',
      ur: 'دوستوں اور مہم جوئیوں سے بھرا ایک پراسرار جنگل',
    },
    weatherEffect: 'rain',
    dayNightVariant: true,
  },
  {
    id: 'city',
    name: {
      de: 'Stadt',
      ar: 'المدينة',
      en: 'City',
      tr: 'Şehir',
      ur: 'شہر',
    },
    coordinates: { x: 650, y: 300 },
    icon: '🏙️',
    color: '#FF9800',
    stories: ['002-fritz', '007-fritz-flamingo'],
    description: {
      de: 'Eine bunte Stadt mit vielen Tieren und Geschäften',
      ar: 'مدينة ملونة مع العديد من الحيوانات والمتاجر',
      en: 'A colorful city with many animals and shops',
      tr: 'Birçok hayvan ve dükkanın bulunduğu renkli bir şehir',
      ur: 'بہت سے جانوروں اور دکانوں والا ایک رنگین شہر',
    },
    weatherEffect: 'sun',
    dayNightVariant: true,
  },
  {
    id: 'beach',
    name: {
      de: 'Strand',
      ar: 'الشاطئ',
      en: 'Beach',
      tr: 'Plaj',
      ur: 'ساحل',
    },
    coordinates: { x: 150, y: 650 },
    icon: '🏖️',
    color: '#00BCD4',
    stories: ['003-lina'],
    description: {
      de: 'Ein sonniger Strand mit Wellen und Sand',
      ar: 'شاطئ مشمس مع الأمواج والرمال',
      en: 'A sunny beach with waves and sand',
      tr: 'Dalgalar ve kumla güneşli bir plaj',
      ur: 'لہروں اور ریت کے ساتھ ایک دھوپ والا ساحل',
    },
    weatherEffect: 'sun',
    dayNightVariant: false,
  },
  {
    id: 'home',
    name: {
      de: 'Zuhause',
      ar: 'المنزل',
      en: 'Home',
      tr: 'Ev',
      ur: 'گھر',
    },
    coordinates: { x: 500, y: 500 },
    icon: '🏡',
    color: '#E91E63',
    stories: ['004-tobi', '020-timmi-denkt'],
    description: {
      de: 'Ein gemütliches Zuhause voller Wärme und Liebe',
      ar: 'منزل مريح مليء بالدفء والحب',
      en: 'A cozy home full of warmth and love',
      tr: 'Sıcaklık ve sevgiyle dolu rahat bir ev',
      ur: 'گرمجوشی اور محبت سے بھرا ایک آرام دہ گھر',
    },
    weatherEffect: 'clouds',
    dayNightVariant: true,
  },
  {
    id: 'space',
    name: {
      de: 'Weltraum',
      ar: 'الفضاء',
      en: 'Space',
      tr: 'Uzay',
      ur: 'خلا',
    },
    coordinates: { x: 800, y: 150 },
    icon: '🚀',
    color: '#673AB7',
    stories: ['005-mila'],
    unlockRequirement: 10,
    description: {
      de: 'Die unendlichen Weiten des Weltraums voller Sterne',
      ar: 'رحاب الفضاء اللامتناهية المليئة بالنجوم',
      en: 'The infinite expanse of space full of stars',
      tr: 'Yıldızlarla dolu sonsuz uzay genişliği',
      ur: 'ستاروں سے بھری خلا کی لامحدود وسعتیں',
    },
    weatherEffect: 'storm',
    dayNightVariant: false,
  },
  {
    id: 'underwater',
    name: {
      de: 'Unterwasser',
      ar: 'تحت الماء',
      en: 'Underwater',
      tr: 'Su altı',
      ur: 'پانی کے اندر',
    },
    coordinates: { x: 350, y: 750 },
    icon: '🐠',
    color: '#2196F3',
    stories: ['006-moritz'],
    unlockRequirement: 5,
    description: {
      de: 'Eine zauberhafte Unterwasserwelt mit bunten Fischen',
      ar: 'عالم تحت الماء الساحر مع الأسماك الملونة',
      en: 'A magical underwater world with colorful fish',
      tr: 'Renkli balıklarla büyülü bir sualtı dünyası',
      ur: 'رنگین مچھلیوں کے ساتھ ایک جادوئی پانی کے اندر کی دنیا',
    },
    weatherEffect: 'rain',
    dayNightVariant: false,
  },
  {
    id: 'mountain',
    name: {
      de: 'Berge',
      ar: 'الجبال',
      en: 'Mountains',
      tr: 'Dağlar',
      ur: 'پہاڑ',
    },
    coordinates: { x: 750, y: 550 },
    icon: '⛰️',
    color: '#795548',
    stories: ['010-leo'],
    description: {
      de: 'Hohe Berge mit verschneiten Gipfeln',
      ar: 'جبال عالية مع قمم مغطاة بالثلوج',
      en: 'High mountains with snowy peaks',
      tr: 'Karlı zirveleri olan yüksek dağlar',
      ur: 'برفانی چوٹیوں والے بلند پہاڑ',
    },
    weatherEffect: 'snow',
    dayNightVariant: true,
  },
  {
    id: 'farm',
    name: {
      de: 'Bauernhof',
      ar: 'المزرعة',
      en: 'Farm',
      tr: 'Çiftlik',
      ur: 'فارم',
    },
    coordinates: { x: 450, y: 200 },
    icon: '🚜',
    color: '#FFC107',
    stories: ['008-dino', '009-milo'],
    unlockRequirement: 20,
    description: {
      de: 'Ein fröhlicher Bauernhof mit Tieren und Feldern',
      ar: 'مزرعة سعيدة مع الحيوانات والحقول',
      en: 'A cheerful farm with animals and fields',
      tr: 'Hayvanlar ve tarlalarla neşeli bir çiftlik',
      ur: 'جانوروں اور کھیتوں والا ایک خوش فارم',
    },
    weatherEffect: 'sun',
    dayNightVariant: true,
  },
];

// Character definitions based on stories
export const characters: CharacterMarker[] = [
  {
    characterId: 'bruno',
    name: 'Bruno',
    emoji: '🐻',
    currentLocation: 'forest',
    color: '#8B4513',
    visitedLocations: ['forest'],
  },
  {
    characterId: 'fritz',
    name: 'Fritz',
    emoji: '🦊',
    currentLocation: 'city',
    color: '#FF6347',
    visitedLocations: ['city'],
  },
  {
    characterId: 'lina',
    name: 'Lina',
    emoji: '🐰',
    currentLocation: 'beach',
    color: '#FFB6C1',
    visitedLocations: ['beach'],
  },
  {
    characterId: 'tobi',
    name: 'Tobi',
    emoji: '🐢',
    currentLocation: 'home',
    color: '#32CD32',
    visitedLocations: ['home'],
  },
  {
    characterId: 'mila',
    name: 'Mila',
    emoji: '🦋',
    currentLocation: 'space',
    color: '#9370DB',
    visitedLocations: ['space', 'forest'],
  },
  {
    characterId: 'moritz',
    name: 'Moritz',
    emoji: '🐙',
    currentLocation: 'underwater',
    color: '#4169E1',
    visitedLocations: ['underwater'],
  },
  {
    characterId: 'leo',
    name: 'Leo',
    emoji: '🦁',
    currentLocation: 'mountain',
    color: '#DAA520',
    visitedLocations: ['mountain'],
  },
];

// Easter egg treasures
export const treasures: TreasureMarker[] = [
  {
    id: 'treasure-forest-1',
    locationId: 'forest',
    coordinates: { x: 180, y: 320 },
    name: {
      de: 'Versteckter Honigschatz',
      ar: 'كنز العسل المخفي',
      en: 'Hidden Honey Treasure',
      tr: 'Gizli Bal Hazinesi',
      ur: 'چھپا ہوا شہد کا خزانہ',
    },
    discovered: false,
    reward: 10,
  },
  {
    id: 'treasure-city-1',
    locationId: 'city',
    coordinates: { x: 670, y: 280 },
    name: {
      de: 'Goldene Münze',
      ar: 'عملة ذهبية',
      en: 'Golden Coin',
      tr: 'Altın Para',
      ur: 'سونے کا سکہ',
    },
    discovered: false,
    reward: 5,
  },
  {
    id: 'treasure-beach-1',
    locationId: 'beach',
    coordinates: { x: 130, y: 680 },
    name: {
      de: 'Muschel-Sammlung',
      ar: 'مجموعة الأصداف',
      en: 'Shell Collection',
      tr: 'Kabuk Koleksiyonu',
      ur: 'سیپیوں کا مجموعہ',
    },
    discovered: false,
    reward: 8,
  },
  {
    id: 'treasure-underwater-1',
    locationId: 'underwater',
    coordinates: { x: 320, y: 780 },
    name: {
      de: 'Perlen-Schatz',
      ar: 'كنز اللؤلؤ',
      en: 'Pearl Treasure',
      tr: 'İnci Hazinesi',
      ur: 'موتیوں کا خزانہ',
    },
    discovered: false,
    reward: 15,
  },
  {
    id: 'treasure-space-1',
    locationId: 'space',
    coordinates: { x: 780, y: 130 },
    name: {
      de: 'Sternstaub',
      ar: 'غبار النجوم',
      en: 'Stardust',
      tr: 'Yıldız Tozu',
      ur: 'ستاروں کی دھول',
    },
    discovered: false,
    reward: 20,
  },
];

// Map achievements
export const mapAchievements = [
  {
    id: 'explorer',
    name: {
      de: 'Entdecker',
      ar: 'المستكشف',
      en: 'Explorer',
      tr: 'Kaşif',
      ur: 'مہم جو',
    },
    description: {
      de: 'Besuche alle 8 Orte',
      ar: 'قم بزيارة جميع المواقع الثمانية',
      en: 'Visit all 8 locations',
      tr: "8 konumun tümünü ziyaret et",
      ur: 'تمام 8 مقامات کی سیر کریں',
    },
    icon: '🗺️',
    requirement: 8,
  },
  {
    id: 'treasure-hunter',
    name: {
      de: 'Schatzjäger',
      ar: 'صائد الكنوز',
      en: 'Treasure Hunter',
      tr: 'Hazine Avcısı',
      ur: 'خزانے کا شکاری',
    },
    description: {
      de: 'Finde alle versteckten Schätze',
      ar: 'اعثر على جميع الكنوز المخفية',
      en: 'Find all hidden treasures',
      tr: 'Tüm gizli hazineleri bul',
      ur: 'تمام چھپے ہوئے خزانے تلاش کریں',
    },
    icon: '💎',
    requirement: treasures.length,
  },
  {
    id: 'world-traveler',
    name: {
      de: 'Weltreisender',
      ar: 'المسافر العالمي',
      en: 'World Traveler',
      tr: 'Dünya Gezgini',
      ur: 'دنیا کا مسافر',
    },
    description: {
      de: 'Schließe 20 Geschichten ab',
      ar: 'أكمل 20 قصة',
      en: 'Complete 20 stories',
      tr: '20 hikaye tamamla',
      ur: '20 کہانیاں مکمل کریں',
    },
    icon: '✈️',
    requirement: 20,
  },
];

// Local storage keys
const STORAGE_KEY_PROGRESS = 'story-map-progress';
const STORAGE_KEY_PATHS = 'story-map-paths';

/**
 * Load map progress from localStorage
 */
export function loadMapProgress(): MapProgress {
  if (typeof window === 'undefined') {
    return getDefaultProgress();
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading map progress:', error);
  }

  return getDefaultProgress();
}

/**
 * Save map progress to localStorage
 */
export function saveMapProgress(progress: MapProgress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving map progress:', error);
  }
}

/**
 * Get default map progress
 */
function getDefaultProgress(): MapProgress {
  return {
    visitedLocations: [],
    completedPaths: [],
    discoveredTreasures: [],
    unlockedLocations: ['forest', 'city', 'beach', 'home', 'mountain'], // Default unlocked
    totalStoriesCompleted: 0,
    characters: [...characters],
    achievements: [],
  };
}

/**
 * Update progress when a story is completed
 */
export function completeStory(storyId: string, progress: MapProgress): MapProgress {
  const location = mapLocations.find((loc) => loc.stories.includes(storyId));
  if (!location) return progress;

  const updatedProgress = { ...progress };
  updatedProgress.totalStoriesCompleted++;

  // Mark location as visited
  if (!updatedProgress.visitedLocations.includes(location.id)) {
    updatedProgress.visitedLocations.push(location.id);
  }

  // Unlock locations based on story count
  mapLocations.forEach((loc) => {
    if (
      loc.unlockRequirement &&
      updatedProgress.totalStoriesCompleted >= loc.unlockRequirement &&
      !updatedProgress.unlockedLocations.includes(loc.id)
    ) {
      updatedProgress.unlockedLocations.push(loc.id);
    }
  });

  // Check for achievements
  checkAchievements(updatedProgress);

  saveMapProgress(updatedProgress);
  return updatedProgress;
}

/**
 * Discover a treasure
 */
export function discoverTreasure(treasureId: string, progress: MapProgress): MapProgress {
  if (progress.discoveredTreasures.includes(treasureId)) return progress;

  const updatedProgress = { ...progress };
  updatedProgress.discoveredTreasures.push(treasureId);

  checkAchievements(updatedProgress);
  saveMapProgress(updatedProgress);

  return updatedProgress;
}

/**
 * Check and unlock achievements
 */
function checkAchievements(progress: MapProgress): void {
  mapAchievements.forEach((achievement) => {
    if (progress.achievements.includes(achievement.id)) return;

    let unlocked = false;

    switch (achievement.id) {
      case 'explorer':
        unlocked = progress.visitedLocations.length >= 8;
        break;
      case 'treasure-hunter':
        unlocked = progress.discoveredTreasures.length >= treasures.length;
        break;
      case 'world-traveler':
        unlocked = progress.totalStoriesCompleted >= 20;
        break;
    }

    if (unlocked) {
      progress.achievements.push(achievement.id);
    }
  });
}

/**
 * Get location by ID
 */
export function getLocationById(locationId: string): MapLocation | undefined {
  return mapLocations.find((loc) => loc.id === locationId);
}

/**
 * Get stories for a location
 */
export function getStoriesForLocation(locationId: string): string[] {
  const location = getLocationById(locationId);
  return location ? location.stories : [];
}

/**
 * Check if location is unlocked
 */
export function isLocationUnlocked(locationId: string, progress: MapProgress): boolean {
  return progress.unlockedLocations.includes(locationId);
}

/**
 * Get journey paths for visualization
 */
export function getJourneyPaths(progress: MapProgress): JourneyPath[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY_PATHS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading journey paths:', error);
  }

  return [];
}

/**
 * Add a journey path when moving between locations
 */
export function addJourneyPath(
  from: string,
  to: string,
  characterId: string,
  storyId: string,
  progress: MapProgress
): void {
  if (typeof window === 'undefined') return;

  const paths = getJourneyPaths(progress);
  const pathId = `${from}-${to}-${characterId}`;

  // Check if path already exists
  if (!paths.find((p) => `${p.from}-${p.to}-${p.character}` === pathId)) {
    const character = characters.find((c) => c.characterId === characterId);
    paths.push({
      from,
      to,
      character: characterId,
      storyId,
      completed: true,
      color: character?.color || '#999',
    });

    try {
      localStorage.setItem(STORAGE_KEY_PATHS, JSON.stringify(paths));
    } catch (error) {
      console.error('Error saving journey paths:', error);
    }
  }
}
