/**
 * Shadow Matching Game Utility
 * Manages character library, shadow generation, game state, and scoring
 */

import type { Locale } from './i18n';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Character {
  id: string;
  name: Record<Locale, string>;
  emoji: string;
  color: string;
  svgPath: string;
  category: 'bear' | 'fox' | 'rabbit' | 'cat' | 'dog' | 'bird' | 'other';
}

export interface ShadowMatchPair {
  character: Character;
  shadowId: string;
  matched: boolean;
  attempts: number;
}

export interface GameState {
  difficulty: Difficulty;
  pairs: ShadowMatchPair[];
  matched: number;
  totalAttempts: number;
  startTime: number;
  endTime?: number;
  hintsUsed: number;
  timerEnabled: boolean;
  soundEnabled: boolean;
}

export interface GameResult {
  difficulty: Difficulty;
  matched: number;
  total: number;
  totalAttempts: number;
  hintsUsed: number;
  timeSeconds: number;
  stars: 1 | 2 | 3;
  xpEarned: number;
  perfectMatch: boolean;
}

export interface GameStats {
  gamesPlayed: number;
  totalMatches: number;
  perfectGames: number;
  bestTimes: Record<Difficulty, number>;
  achievementsUnlocked: string[];
}

// Character Library (20 characters from the stories)
export const CHARACTER_LIBRARY: Character[] = [
  {
    id: 'bruno',
    name: {
      de: 'Bruno der Bär',
      ar: 'برونو الدب',
      en: 'Bruno the Bear',
      tr: 'Ayı Bruno',
      ur: 'بھالو برونو',
    },
    emoji: '🐻',
    color: '#8B4513',
    category: 'bear',
    svgPath: 'M50,80 C50,65 40,55 40,40 C40,25 50,15 65,15 C75,15 80,20 85,20 C90,20 95,15 105,15 C120,15 130,25 130,40 C130,55 120,65 120,80 C120,95 110,105 85,105 C60,105 50,95 50,80 Z M60,35 C60,38 57,40 55,40 C53,40 50,38 50,35 C50,32 53,30 55,30 C57,30 60,32 60,35 Z M110,35 C110,38 113,40 115,40 C117,40 120,38 120,35 C120,32 117,30 115,30 C113,30 110,32 110,35 Z M75,55 C75,58 77,60 85,60 C93,60 95,58 95,55',
  },
  {
    id: 'fritz',
    name: {
      de: 'Fritz der Fuchs',
      ar: 'فريتز الثعلب',
      en: 'Fritz the Fox',
      tr: 'Tilki Fritz',
      ur: 'لومڑی فریٹز',
    },
    emoji: '🦊',
    color: '#FF6347',
    category: 'fox',
    svgPath: 'M40,20 L40,50 L55,60 L70,50 L70,20 L65,10 L60,15 L55,10 L50,15 L45,10 Z M50,35 C50,38 48,40 45,40 C43,40 40,38 40,35 C40,32 43,30 45,30 C48,30 50,32 50,35 Z M70,35 C70,38 68,40 65,40 C63,40 60,38 60,35 C60,32 63,30 65,30 C68,30 70,32 70,35 Z M40,60 L30,85 L35,95 L55,70 Z M70,60 L80,85 L75,95 L55,70 Z',
  },
  {
    id: 'lina',
    name: {
      de: 'Lina das Häschen',
      ar: 'لينا الأرنب',
      en: 'Lina the Bunny',
      tr: 'Tavşan Lina',
      ur: 'خرگوش لینا',
    },
    emoji: '🐰',
    color: '#FFB6C1',
    category: 'rabbit',
    svgPath: 'M45,20 L45,5 L50,10 L50,25 Z M65,20 L65,5 L60,10 L60,25 Z M40,40 C40,25 50,15 55,15 C60,15 70,25 70,40 C70,55 65,65 55,65 C45,65 40,55 40,40 Z M48,35 C48,38 46,40 44,40 C42,40 40,38 40,35 C40,32 42,30 44,30 C46,30 48,32 48,35 Z M70,35 C70,38 68,40 66,40 C64,40 62,38 62,35 C62,32 64,30 66,30 C68,30 70,32 70,35 Z M50,50 L55,55 L60,50',
  },
  {
    id: 'tobi',
    name: {
      de: 'Tobi der Tiger',
      ar: 'توبي النمر',
      en: 'Tobi the Tiger',
      tr: 'Kaplan Tobi',
      ur: 'شیر توبی',
    },
    emoji: '🐯',
    color: '#FFA500',
    category: 'other',
    svgPath: 'M30,30 L30,15 L35,20 Z M50,30 L50,15 L45,20 Z M70,30 L70,15 L65,20 Z M35,40 C35,25 45,15 55,15 C65,15 75,25 75,40 C75,55 70,65 55,65 C40,65 35,55 35,40 Z M45,35 C45,38 43,40 40,40 C38,40 35,38 35,35 C35,32 38,30 40,30 C43,30 45,32 45,35 Z M75,35 C75,38 73,40 70,40 C68,40 65,38 65,35 C65,32 68,30 70,30 C73,30 75,32 75,35 Z M48,48 L55,52 L62,48',
  },
  {
    id: 'mila',
    name: {
      de: 'Mila die Maus',
      ar: 'ميلا الفأرة',
      en: 'Mila the Mouse',
      tr: 'Fare Mila',
      ur: 'چوہی میلا',
    },
    emoji: '🐭',
    color: '#A9A9A9',
    category: 'other',
    svgPath: 'M30,40 C25,35 25,25 30,20 L25,20 C20,20 15,25 15,30 C15,35 20,40 25,40 Z M80,40 C85,35 85,25 80,20 L85,20 C90,20 95,25 95,30 C95,35 90,40 85,40 Z M40,50 C40,35 48,25 55,25 C62,25 70,35 70,50 C70,60 65,70 55,70 C45,70 40,60 40,50 Z M48,42 C48,45 46,47 44,47 C42,47 40,45 40,42 C40,40 42,38 44,38 C46,38 48,40 48,42 Z M70,42 C70,45 68,47 66,47 C64,47 62,45 62,42 C62,40 64,38 66,38 C68,38 70,40 70,42 Z M50,55 L55,58 L60,55',
  },
  {
    id: 'moritz',
    name: {
      de: 'Moritz der Hund',
      ar: 'موريتز الكلب',
      en: 'Moritz the Dog',
      tr: 'Köpek Moritz',
      ur: 'کتا موریٹز',
    },
    emoji: '🐶',
    color: '#CD853F',
    category: 'dog',
    svgPath: 'M35,25 L30,15 L35,20 L40,15 L40,25 Z M70,25 L75,15 L70,20 L65,15 L65,25 Z M35,45 C35,30 45,20 55,20 C65,20 75,30 75,45 C75,60 70,70 55,70 C40,70 35,60 35,45 Z M45,38 C45,41 43,43 40,43 C38,43 35,41 35,38 C35,35 38,33 40,33 C43,33 45,35 45,38 Z M75,38 C75,41 73,43 70,43 C68,43 65,41 65,38 C65,35 68,33 70,33 C73,33 75,35 75,38 Z M48,52 L55,58 L62,52 M50,58 L55,62 L60,58',
  },
  {
    id: 'leo',
    name: {
      de: 'Leo der Löwe',
      ar: 'ليو الأسد',
      en: 'Leo the Lion',
      tr: 'Aslan Leo',
      ur: 'شیر لیو',
    },
    emoji: '🦁',
    color: '#DAA520',
    category: 'other',
    svgPath: 'M35,25 C30,20 25,25 25,30 C25,35 30,40 35,35 Z M45,20 C40,15 35,20 35,25 C35,30 40,35 45,30 Z M65,20 C70,15 75,20 75,25 C75,30 70,35 65,30 Z M75,25 C80,20 85,25 85,30 C85,35 80,40 75,35 Z M40,45 C40,32 48,25 55,25 C62,25 70,32 70,45 C70,58 65,68 55,68 C45,68 40,58 40,45 Z M48,40 C48,43 46,45 44,45 C42,45 40,43 40,40 C40,37 42,35 44,35 C46,35 48,37 48,40 Z M70,40 C70,43 68,45 66,45 C64,45 62,43 62,40 C62,37 64,35 66,35 C68,35 70,37 70,40 Z M50,52 L55,56 L60,52',
  },
  {
    id: 'sophie',
    name: {
      de: 'Sophie die Katze',
      ar: 'صوفي القطة',
      en: 'Sophie the Cat',
      tr: 'Kedi Sophie',
      ur: 'بلی صوفی',
    },
    emoji: '🐱',
    color: '#FFA07A',
    category: 'cat',
    svgPath: 'M40,25 L35,10 L40,18 L45,25 Z M70,25 L75,10 L70,18 L65,25 Z M38,45 C38,32 46,22 55,22 C64,22 72,32 72,45 C72,58 67,68 55,68 C43,68 38,58 38,45 Z M46,38 C46,41 44,43 42,43 C40,43 38,41 38,38 C38,35 40,33 42,33 C44,33 46,35 46,38 Z M72,38 C72,41 70,43 68,43 C66,43 64,41 64,38 C64,35 66,33 68,33 C70,33 72,35 72,38 Z M38,50 L30,52 Z M72,50 L80,52 Z M52,52 L55,54 L58,52',
  },
  {
    id: 'emma',
    name: {
      de: 'Emma die Ente',
      ar: 'إيما البطة',
      en: 'Emma the Duck',
      tr: 'Ördek Emma',
      ur: 'بطخ ایما',
    },
    emoji: '🦆',
    color: '#FFD700',
    category: 'bird',
    svgPath: 'M45,30 C45,22 50,15 58,15 C66,15 70,22 70,30 L75,28 L78,32 L73,35 C73,45 68,55 58,55 C48,55 43,45 43,35 L38,32 L41,28 Z M53,26 C53,28 52,30 50,30 C48,30 46,28 46,26 C46,24 48,22 50,22 C52,22 53,24 53,26 Z M70,26 C70,28 68,30 66,30 C64,30 62,28 62,26 C62,24 64,22 66,22 C68,22 70,24 70,26 Z M52,35 L58,38 L64,35 M50,55 L50,80 L45,85 L45,80 L40,85 M66,55 L66,80 L71,85 L71,80 L76,85',
  },
  {
    id: 'paul',
    name: {
      de: 'Paul der Pinguin',
      ar: 'بول البطريق',
      en: 'Paul the Penguin',
      tr: 'Penguen Paul',
      ur: 'پینگوئن پال',
    },
    emoji: '🐧',
    color: '#000000',
    category: 'bird',
    svgPath: 'M42,40 C42,28 48,18 55,18 C62,18 68,28 68,40 C68,52 65,62 55,72 C45,62 42,52 42,40 Z M48,32 C48,34 47,36 45,36 C43,36 42,34 42,32 C42,30 43,28 45,28 C47,28 48,30 48,32 Z M68,32 C68,34 67,36 65,36 C63,36 62,34 62,32 C62,30 63,28 65,28 C67,28 68,30 68,32 Z M50,42 C50,48 52,52 55,52 C58,52 60,48 60,42 Z M38,45 L32,70 L38,75 L42,50 Z M72,45 L78,70 L72,75 L68,50 Z M52,38 L55,40 L58,38',
  },
  {
    id: 'tim',
    name: {
      de: 'Tim der Affe',
      ar: 'تيم القرد',
      en: 'Tim the Monkey',
      tr: 'Maymun Tim',
      ur: 'بندر ٹم',
    },
    emoji: '🐵',
    color: '#8B4513',
    category: 'other',
    svgPath: 'M35,38 C30,33 25,35 25,40 C25,45 30,47 35,42 Z M75,38 C80,33 85,35 85,40 C85,45 80,47 75,42 Z M38,48 C38,35 46,25 55,25 C64,25 72,35 72,48 C72,61 67,71 55,71 C43,71 38,61 38,48 Z M46,42 C46,45 44,47 42,47 C40,47 38,45 38,42 C38,39 40,37 42,37 C44,37 46,39 46,42 Z M72,42 C72,45 70,47 68,47 C66,47 64,45 64,42 C64,39 66,37 68,37 C70,37 72,39 72,42 Z M45,55 C45,58 48,62 55,62 C62,62 65,58 65,55 C65,52 62,50 55,50 C48,50 45,52 45,55 Z',
  },
  {
    id: 'nala',
    name: {
      de: 'Nala die Giraffe',
      ar: 'نالا الزرافة',
      en: 'Nala the Giraffe',
      tr: 'Zürafa Nala',
      ur: 'جراف نالا',
    },
    emoji: '🦒',
    color: '#F4A460',
    category: 'other',
    svgPath: 'M48,20 L48,5 L52,10 L52,20 Z M58,20 L58,5 L62,10 L62,20 Z M42,35 C42,25 48,18 55,18 C62,18 68,25 68,35 C68,45 64,52 55,52 C46,52 42,45 42,35 Z M48,30 C48,33 46,35 44,35 C42,35 40,33 40,30 C40,27 42,25 44,25 C46,25 48,27 48,30 Z M70,30 C70,33 68,35 66,35 C64,35 62,33 62,30 C62,27 64,25 66,25 C68,25 70,27 70,30 Z M50,42 L55,44 L60,42 M52,52 L52,85 M58,52 L58,85',
  },
  {
    id: 'oscar',
    name: {
      de: 'Oscar der Elefant',
      ar: 'أوسكار الفيل',
      en: 'Oscar the Elephant',
      tr: 'Fil Oscar',
      ur: 'ہاتھی اوسکار',
    },
    emoji: '🐘',
    color: '#A9A9A9',
    category: 'other',
    svgPath: 'M35,30 L25,25 L25,35 L35,35 Z M75,30 L85,25 L85,35 L75,35 Z M38,45 C38,32 46,22 55,22 C64,22 72,32 72,45 C72,58 67,68 55,68 C43,68 38,58 38,45 Z M46,38 C46,41 44,43 42,43 C40,43 38,41 38,38 C38,35 40,33 42,33 C44,33 46,35 46,38 Z M72,38 C72,41 70,43 68,43 C66,43 64,41 64,38 C64,35 66,33 68,33 C70,33 72,35 72,38 Z M50,55 L50,75 L45,78 L55,82 L65,78 L60,75 L60,55',
  },
  {
    id: 'rosa',
    name: {
      de: 'Rosa das Schwein',
      ar: 'روزا الخنزير',
      en: 'Rosa the Pig',
      tr: 'Domuz Rosa',
      ur: 'سور روزا',
    },
    emoji: '🐷',
    color: '#FFB6C1',
    category: 'other',
    svgPath: 'M40,45 C40,32 47,22 55,22 C63,22 70,32 70,45 C70,58 65,68 55,68 C45,68 40,58 40,45 Z M47,38 C47,41 45,43 43,43 C41,43 39,41 39,38 C39,35 41,33 43,33 C45,33 47,35 47,38 Z M71,38 C71,41 69,43 67,43 C65,43 63,41 63,38 C63,35 65,33 67,33 C69,33 71,35 71,38 Z M48,52 C48,48 50,46 55,46 C60,46 62,48 62,52 C62,54 60,56 55,56 C50,56 48,54 48,52 Z M50,50 C50,51 51,52 52,52 C53,52 54,51 54,50 Z M56,50 C56,51 57,52 58,52 C59,52 60,51 60,50',
  },
  {
    id: 'felix',
    name: {
      de: 'Felix der Frosch',
      ar: 'فيليكس الضفدع',
      en: 'Felix the Frog',
      tr: 'Kurbağa Felix',
      ur: 'مینڈک فیلکس',
    },
    emoji: '🐸',
    color: '#32CD32',
    category: 'other',
    svgPath: 'M35,35 C30,30 25,30 22,35 C19,40 22,45 27,45 L35,42 Z M75,35 C80,30 85,30 88,35 C91,40 88,45 83,45 L75,42 Z M40,50 C40,38 46,28 55,28 C64,28 70,38 70,50 C70,62 65,72 55,72 C45,72 40,62 40,50 Z M48,44 C48,47 46,49 44,49 C42,49 40,47 40,44 C40,41 42,39 44,39 C46,39 48,41 48,44 Z M70,44 C70,47 68,49 66,49 C64,49 62,47 62,44 C62,41 64,39 66,39 C68,39 70,41 70,44 Z M48,58 C48,60 50,62 55,62 C60,62 62,60 62,58',
  },
  {
    id: 'bella',
    name: {
      de: 'Bella der Schmetterling',
      ar: 'بيلا الفراشة',
      en: 'Bella the Butterfly',
      tr: 'Kelebek Bella',
      ur: 'تتلی بیلا',
    },
    emoji: '🦋',
    color: '#FF69B4',
    category: 'other',
    svgPath: 'M50,40 L50,60 M45,42 C40,38 35,40 32,45 C29,50 32,55 37,55 C42,55 45,52 45,47 Z M45,53 C40,57 35,59 30,57 C25,55 23,50 25,45 C27,40 32,38 37,40 C42,42 45,47 45,53 Z M55,42 C60,38 65,40 68,45 C71,50 68,55 63,55 C58,55 55,52 55,47 Z M55,53 C60,57 65,59 70,57 C75,55 77,50 75,45 C73,40 68,38 63,40 C58,42 55,47 55,53 Z M48,40 C48,38 49,36 50,36 C51,36 52,38 52,40',
  },
  {
    id: 'max',
    name: {
      de: 'Max der Bär',
      ar: 'ماكس الدب',
      en: 'Max the Bear',
      tr: 'Ayı Max',
      ur: 'بھالو میکس',
    },
    emoji: '🐻',
    color: '#654321',
    category: 'bear',
    svgPath: 'M35,32 C30,27 25,27 22,32 C19,37 22,42 27,42 C32,42 35,37 35,32 Z M75,32 C80,27 85,27 88,32 C91,37 88,42 83,42 C78,42 75,37 75,32 Z M38,50 C38,37 46,27 55,27 C64,27 72,37 72,50 C72,63 67,73 55,73 C43,73 38,63 38,50 Z M46,44 C46,47 44,49 42,49 C40,49 38,47 38,44 C38,41 40,39 42,39 C44,39 46,41 46,44 Z M72,44 C72,47 70,49 68,49 C66,49 64,47 64,44 C64,41 66,39 68,39 C70,39 72,41 72,44 Z M50,56 L55,60 L60,56',
  },
  {
    id: 'zara',
    name: {
      de: 'Zara das Zebra',
      ar: 'زارا الحمار الوحشي',
      en: 'Zara the Zebra',
      tr: 'Zebra Zara',
      ur: 'زیبرا زارا',
    },
    emoji: '🦓',
    color: '#000000',
    category: 'other',
    svgPath: 'M45,22 L45,10 L48,15 L50,22 Z M60,22 L60,10 L57,15 L55,22 Z M40,40 C40,28 47,18 55,18 C63,18 70,28 70,40 C70,52 65,62 55,62 C45,62 40,52 40,40 Z M47,34 C47,37 45,39 43,39 C41,39 39,37 39,34 C39,31 41,29 43,29 C45,29 47,31 47,34 Z M71,34 C71,37 69,39 67,39 C65,39 63,37 63,34 C63,31 65,29 67,29 C69,29 71,31 71,34 Z M50,46 L55,48 L60,46 M48,62 L48,85 M62,62 L62,85 M45,30 L50,30 M60,30 L65,30 M42,38 L47,38 M63,38 L68,38',
  },
  {
    id: 'hugo',
    name: {
      de: 'Hugo der Igel',
      ar: 'هوغو القنفذ',
      en: 'Hugo the Hedgehog',
      tr: 'Kirpi Hugo',
      ur: 'کانٹے دار ہوگو',
    },
    emoji: '🦔',
    color: '#8B4513',
    category: 'other',
    svgPath: 'M35,40 L30,35 L28,40 M40,38 L35,30 L33,38 M45,36 L40,25 L38,36 M55,34 L50,20 L48,34 M65,36 L70,25 L72,36 M70,38 L75,30 L77,38 M75,40 L80,35 L82,40 M38,50 C38,40 45,32 55,32 C65,32 72,40 72,50 C72,60 67,68 55,68 C43,68 38,60 38,50 Z M46,46 C46,48 45,50 43,50 C41,50 40,48 40,46 C40,44 41,42 43,42 C45,42 46,44 46,46 Z M70,46 C70,48 69,50 67,50 C65,50 64,48 64,46 C64,44 65,42 67,42 C69,42 70,44 70,46 Z M50,54 L55,56 L60,54',
  },
  {
    id: 'luna',
    name: {
      de: 'Luna die Eule',
      ar: 'لونا البومة',
      en: 'Luna the Owl',
      tr: 'Baykuş Luna',
      ur: 'الو لونا',
    },
    emoji: '🦉',
    color: '#8B4513',
    category: 'bird',
    svgPath: 'M42,25 L38,15 L42,20 L46,25 Z M68,25 L72,15 L68,20 L64,25 Z M38,45 C38,32 46,22 55,22 C64,22 72,32 72,45 C72,58 67,68 55,68 C43,68 38,58 38,45 Z M45,38 C45,42 43,45 40,45 C37,45 35,42 35,38 C35,34 37,32 40,32 C43,32 45,34 45,38 Z M40,38 C40,40 39,41 38,41 C37,41 36,40 36,38 C36,36 37,35 38,35 C39,35 40,36 40,38 Z M75,38 C75,42 73,45 70,45 C67,45 65,42 65,38 C65,34 67,32 70,32 C73,32 75,34 75,38 Z M70,38 C70,40 69,41 68,41 C67,41 66,40 66,38 C66,36 67,35 68,35 C69,35 70,36 70,38 Z M50,52 L55,50 L60,52',
  },
];

/**
 * Generate SVG shadow from character
 */
export function generateShadow(character: Character): string {
  return `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
    <path d="${character.svgPath}" fill="#000000" opacity="0.8" />
  </svg>`;
}

/**
 * Get characters by difficulty
 */
export function getCharactersByDifficulty(difficulty: Difficulty): Character[] {
  const counts = { easy: 2, medium: 4, hard: 6 };
  const count = counts[difficulty];

  // Shuffle and pick random characters
  const shuffled = [...CHARACTER_LIBRARY].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Initialize game state
 */
export function initializeGame(
  difficulty: Difficulty,
  timerEnabled: boolean = true,
  soundEnabled: boolean = true
): GameState {
  const characters = getCharactersByDifficulty(difficulty);

  const pairs: ShadowMatchPair[] = characters.map((char, index) => ({
    character: char,
    shadowId: `shadow-${char.id}-${Date.now()}-${index}`,
    matched: false,
    attempts: 0,
  }));

  return {
    difficulty,
    pairs,
    matched: 0,
    totalAttempts: 0,
    startTime: Date.now(),
    hintsUsed: 0,
    timerEnabled,
    soundEnabled,
  };
}

/**
 * Attempt to match character with shadow
 */
export function attemptMatch(
  state: GameState,
  characterId: string,
  shadowId: string
): { success: boolean; pairIndex: number } {
  const pairIndex = state.pairs.findIndex(
    (p) => p.character.id === characterId && p.shadowId === shadowId
  );

  if (pairIndex === -1) {
    state.totalAttempts++;
    return { success: false, pairIndex: -1 };
  }

  const pair = state.pairs[pairIndex];
  pair.attempts++;
  state.totalAttempts++;

  if (!pair.matched) {
    pair.matched = true;
    state.matched++;
  }

  return { success: true, pairIndex };
}

/**
 * Calculate game result and rewards
 */
export function calculateResult(state: GameState): GameResult {
  const timeSeconds = state.endTime
    ? Math.floor((state.endTime - state.startTime) / 1000)
    : 0;

  const total = state.pairs.length;
  const perfectMatch = state.totalAttempts === total && state.hintsUsed === 0;

  // Calculate stars
  let stars: 1 | 2 | 3 = 1;
  if (perfectMatch) {
    stars = 3;
  } else if (state.totalAttempts <= total * 1.5 && state.hintsUsed <= 1) {
    stars = 2;
  }

  // Calculate XP
  let xpEarned = 50; // Base XP for completing level
  if (perfectMatch) {
    xpEarned += 100; // Perfect match bonus
  }
  if (stars === 3) {
    xpEarned += 50;
  } else if (stars === 2) {
    xpEarned += 25;
  }

  return {
    difficulty: state.difficulty,
    matched: state.matched,
    total,
    totalAttempts: state.totalAttempts,
    hintsUsed: state.hintsUsed,
    timeSeconds,
    stars,
    xpEarned,
    perfectMatch,
  };
}

/**
 * Load game statistics from localStorage
 */
export function loadGameStats(): GameStats {
  if (typeof window === 'undefined') {
    return getDefaultStats();
  }

  const saved = localStorage.getItem('shadow-matching-stats');
  if (!saved) {
    return getDefaultStats();
  }

  try {
    return JSON.parse(saved);
  } catch {
    return getDefaultStats();
  }
}

/**
 * Save game statistics to localStorage
 */
export function saveGameStats(stats: GameStats): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('shadow-matching-stats', JSON.stringify(stats));
}

/**
 * Update statistics after game completion
 */
export function updateStats(result: GameResult): GameStats {
  const stats = loadGameStats();

  stats.gamesPlayed++;
  stats.totalMatches += result.matched;

  if (result.perfectMatch) {
    stats.perfectGames++;
  }

  // Update best time
  if (
    !stats.bestTimes[result.difficulty] ||
    result.timeSeconds < stats.bestTimes[result.difficulty]
  ) {
    stats.bestTimes[result.difficulty] = result.timeSeconds;
  }

  // Check for achievements
  if (stats.gamesPlayed === 1) {
    stats.achievementsUnlocked.push('first-shadow-match');
  }
  if (stats.perfectGames === 5) {
    stats.achievementsUnlocked.push('shadow-master');
  }
  if (
    stats.bestTimes.easy &&
    stats.bestTimes.medium &&
    stats.bestTimes.hard
  ) {
    stats.achievementsUnlocked.push('difficulty-conqueror');
  }

  saveGameStats(stats);
  return stats;
}

function getDefaultStats(): GameStats {
  return {
    gamesPlayed: 0,
    totalMatches: 0,
    perfectGames: 0,
    bestTimes: {} as Record<Difficulty, number>,
    achievementsUnlocked: [],
  };
}

/**
 * Show hint for a specific pair
 */
export function showHint(state: GameState, pairIndex: number): void {
  if (pairIndex >= 0 && pairIndex < state.pairs.length) {
    state.hintsUsed++;
  }
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
