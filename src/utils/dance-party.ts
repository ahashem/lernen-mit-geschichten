/**
 * Dance Party System
 * Manages dance animations, music beats, choreography, and rhythm games
 */

export interface DanceMove {
  id: string;
  name: Record<string, string>;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  animation: string;
  duration: number; // in beats
  energyLevel: 1 | 2 | 3 | 4 | 5;
  emoji: string;
}

export interface MusicTrack {
  id: string;
  name: string;
  genre: string;
  bpm: number;
  duration: number; // in seconds
  audioUrl?: string;
  preview?: boolean;
}

export interface Character {
  id: string;
  emoji: string;
  name: string;
  characterType: string;
  position: { x: number; y: number };
  currentMove: string | null;
  outfit?: string;
  specialEffect?: string;
  emotion?: string;
}

export interface ChoreographyStep {
  beat: number;
  characterId: string;
  moveId: string;
  duration: number;
}

export interface Choreography {
  id: string;
  name: string;
  trackId: string;
  steps: ChoreographyStep[];
  characters: string[];
  createdAt: number;
  stars?: number;
}

export interface RhythmNote {
  beat: number;
  direction: 'up' | 'down' | 'left' | 'right';
  hit: boolean | null;
  accuracy?: 'perfect' | 'good' | 'ok' | 'miss';
}

export interface DanceChallenge {
  id: string;
  name: Record<string, string>;
  description: Record<string, string>;
  goal: number;
  type: 'perfects' | 'duration' | 'combo' | 'characters' | 'score';
  stars: number;
  completed: boolean;
  progress: number;
}

export interface DanceStats {
  perfectHits: number;
  goodHits: number;
  okHits: number;
  misses: number;
  maxCombo: number;
  currentCombo: number;
  score: number;
  stars: number;
}

// Dance Moves Library
export const danceMoves: DanceMove[] = [
  // Basic Moves
  {
    id: 'bounce',
    name: { de: 'Hüpfen', ar: 'نطّ', en: 'Bounce', tr: 'Zıpla', ur: 'اچھلنا' },
    difficulty: 'basic',
    animation: 'bounce',
    duration: 1,
    energyLevel: 2,
    emoji: '⬆️',
  },
  {
    id: 'sway',
    name: { de: 'Schwingen', ar: 'تمايل', en: 'Sway', tr: 'Sallan', ur: 'جھومنا' },
    difficulty: 'basic',
    animation: 'sway',
    duration: 2,
    energyLevel: 1,
    emoji: '↔️',
  },
  {
    id: 'spin',
    name: { de: 'Drehen', ar: 'دوران', en: 'Spin', tr: 'Dön', ur: 'گھومنا' },
    difficulty: 'basic',
    animation: 'spin',
    duration: 2,
    energyLevel: 3,
    emoji: '🔄',
  },
  {
    id: 'wave',
    name: { de: 'Winken', ar: 'تلويح', en: 'Wave', tr: 'El Salla', ur: 'ہاتھ ہلانا' },
    difficulty: 'basic',
    animation: 'wave',
    duration: 1,
    energyLevel: 1,
    emoji: '👋',
  },
  {
    id: 'clap',
    name: { de: 'Klatschen', ar: 'تصفيق', en: 'Clap', tr: 'Alkışla', ur: 'تالی بجانا' },
    difficulty: 'basic',
    animation: 'clap',
    duration: 1,
    energyLevel: 2,
    emoji: '👏',
  },
  {
    id: 'stomp',
    name: { de: 'Stampfen', ar: 'دوس', en: 'Stomp', tr: 'Tepine', ur: 'ٹھمکنا' },
    difficulty: 'basic',
    animation: 'stomp',
    duration: 1,
    energyLevel: 2,
    emoji: '👟',
  },

  // Intermediate Moves
  {
    id: 'robot',
    name: { de: 'Roboter', ar: 'روبوت', en: 'Robot', tr: 'Robot', ur: 'روبوٹ' },
    difficulty: 'intermediate',
    animation: 'robot',
    duration: 2,
    energyLevel: 3,
    emoji: '🤖',
  },
  {
    id: 'moonwalk',
    name: { de: 'Moonwalk', ar: 'مشية القمر', en: 'Moonwalk', tr: 'Moonwalk', ur: 'مون واک' },
    difficulty: 'intermediate',
    animation: 'moonwalk',
    duration: 3,
    energyLevel: 4,
    emoji: '🌙',
  },
  {
    id: 'jumping-jacks',
    name: { de: 'Hampelmann', ar: 'قفز', en: 'Jumping Jacks', tr: 'Sıçrama', ur: 'چھلانگ' },
    difficulty: 'intermediate',
    animation: 'jumping-jacks',
    duration: 2,
    energyLevel: 4,
    emoji: '🏃',
  },
  {
    id: 'twist',
    name: { de: 'Twist', ar: 'تويست', en: 'Twist', tr: 'Twist', ur: 'ٹوئسٹ' },
    difficulty: 'intermediate',
    animation: 'twist',
    duration: 2,
    energyLevel: 3,
    emoji: '🌀',
  },
  {
    id: 'shimmy',
    name: { de: 'Shimmy', ar: 'اهتزاز', en: 'Shimmy', tr: 'Shimmy', ur: 'جھٹکا' },
    difficulty: 'intermediate',
    animation: 'shimmy',
    duration: 2,
    energyLevel: 3,
    emoji: '✨',
  },
  {
    id: 'slide',
    name: { de: 'Gleiten', ar: 'انزلاق', en: 'Slide', tr: 'Kaydır', ur: 'پھسلنا' },
    difficulty: 'intermediate',
    animation: 'slide',
    duration: 2,
    energyLevel: 3,
    emoji: '➡️',
  },
  {
    id: 'kick',
    name: { de: 'Kicken', ar: 'ركل', en: 'Kick', tr: 'Tekme', ur: 'لات' },
    difficulty: 'intermediate',
    animation: 'kick',
    duration: 1,
    energyLevel: 3,
    emoji: '🦵',
  },

  // Advanced Moves
  {
    id: 'breakdance',
    name: { de: 'Breakdance', ar: 'بريك دانس', en: 'Breakdance', tr: 'Breakdance', ur: 'بریک ڈانس' },
    difficulty: 'advanced',
    animation: 'breakdance',
    duration: 4,
    energyLevel: 5,
    emoji: '🕺',
  },
  {
    id: 'ballet-twirl',
    name: { de: 'Ballettdrehung', ar: 'دوران باليه', en: 'Ballet Twirl', tr: 'Bale Dönüşü', ur: 'بیلے گھماؤ' },
    difficulty: 'advanced',
    animation: 'ballet-twirl',
    duration: 3,
    energyLevel: 4,
    emoji: '🩰',
  },
  {
    id: 'salsa',
    name: { de: 'Salsa', ar: 'سالسا', en: 'Salsa', tr: 'Salsa', ur: 'سالسا' },
    difficulty: 'advanced',
    animation: 'salsa',
    duration: 4,
    energyLevel: 5,
    emoji: '💃',
  },
  {
    id: 'hip-hop',
    name: { de: 'Hip-Hop', ar: 'هيب هوب', en: 'Hip-Hop', tr: 'Hip-Hop', ur: 'ہپ ہاپ' },
    difficulty: 'advanced',
    animation: 'hip-hop',
    duration: 3,
    energyLevel: 5,
    emoji: '🎤',
  },
  {
    id: 'cartwheel',
    name: { de: 'Rad', ar: 'عجلة', en: 'Cartwheel', tr: 'Çark', ur: 'پہیہ' },
    difficulty: 'advanced',
    animation: 'cartwheel',
    duration: 2,
    energyLevel: 5,
    emoji: '🤸',
  },
  {
    id: 'backflip',
    name: { de: 'Rückwärtssalto', ar: 'شقلبة خلفية', en: 'Backflip', tr: 'Ters Takla', ur: 'پیچھے پلٹنا' },
    difficulty: 'advanced',
    animation: 'backflip',
    duration: 2,
    energyLevel: 5,
    emoji: '🔙',
  },
  {
    id: 'floss',
    name: { de: 'Floss', ar: 'فلوس', en: 'Floss', tr: 'Floss', ur: 'فلاس' },
    difficulty: 'advanced',
    animation: 'floss',
    duration: 3,
    energyLevel: 4,
    emoji: '🦷',
  },
  {
    id: 'dab',
    name: { de: 'Dabben', ar: 'داب', en: 'Dab', tr: 'Dab', ur: 'ڈیب' },
    difficulty: 'advanced',
    animation: 'dab',
    duration: 1,
    energyLevel: 3,
    emoji: '😎',
  },
  {
    id: 'freeze',
    name: { de: 'Freeze', ar: 'تجميد', en: 'Freeze', tr: 'Donma', ur: 'منجمد' },
    difficulty: 'advanced',
    animation: 'freeze',
    duration: 2,
    energyLevel: 4,
    emoji: '🧊',
  },
];

// Music Tracks
export const musicTracks: MusicTrack[] = [
  {
    id: 'pop-dance',
    name: 'Happy Pop Dance',
    genre: 'Pop',
    bpm: 128,
    duration: 180,
    preview: true,
  },
  {
    id: 'electronic-beat',
    name: 'Electronic Beat',
    genre: 'Electronic',
    bpm: 140,
    duration: 200,
  },
  {
    id: 'classical-waltz',
    name: 'Classical Waltz',
    genre: 'Classical',
    bpm: 90,
    duration: 160,
  },
  {
    id: 'jazz-swing',
    name: 'Jazz Swing',
    genre: 'Jazz',
    bpm: 120,
    duration: 150,
  },
  {
    id: 'reggae-chill',
    name: 'Reggae Vibes',
    genre: 'Reggae',
    bpm: 80,
    duration: 190,
  },
  {
    id: 'rock-energy',
    name: 'Rock Energy',
    genre: 'Rock',
    bpm: 150,
    duration: 170,
  },
  {
    id: 'hip-hop-flow',
    name: 'Hip-Hop Flow',
    genre: 'Hip-Hop',
    bpm: 95,
    duration: 180,
  },
  {
    id: 'funk-groove',
    name: 'Funk Groove',
    genre: 'Funk',
    bpm: 110,
    duration: 160,
  },
  {
    id: 'disco-fever',
    name: 'Disco Fever',
    genre: 'Disco',
    bpm: 125,
    duration: 200,
  },
  {
    id: 'latin-salsa',
    name: 'Latin Salsa',
    genre: 'Latin',
    bpm: 180,
    duration: 150,
  },
  {
    id: 'techno-pulse',
    name: 'Techno Pulse',
    genre: 'Techno',
    bpm: 135,
    duration: 210,
  },
  {
    id: 'country-boot',
    name: 'Country Boot Scoot',
    genre: 'Country',
    bpm: 115,
    duration: 170,
  },
  {
    id: 'kids-party',
    name: 'Kids Party Fun',
    genre: 'Kids',
    bpm: 130,
    duration: 140,
  },
  {
    id: 'tropical-house',
    name: 'Tropical House',
    genre: 'House',
    bpm: 118,
    duration: 185,
  },
  {
    id: 'dubstep-drop',
    name: 'Dubstep Drop',
    genre: 'Dubstep',
    bpm: 140,
    duration: 195,
  },
];

// Dance Challenges
export const danceChallenges: DanceChallenge[] = [
  {
    id: 'perfect-50',
    name: {
      de: '50 Perfekte Moves',
      ar: '50 حركة مثالية',
      en: '50 Perfect Moves',
      tr: '50 Mükemmel Hareket',
      ur: '50 کامل حرکتیں',
    },
    description: {
      de: 'Schaffe 50 perfekte Tanzbewegungen',
      ar: 'حقق 50 حركة رقص مثالية',
      en: 'Hit 50 perfect dance moves',
      tr: '50 mükemmel dans hareketi yap',
      ur: '50 کامل رقص کی حرکتیں کریں',
    },
    goal: 50,
    type: 'perfects',
    stars: 10,
    completed: false,
    progress: 0,
  },
  {
    id: 'marathon-3min',
    name: {
      de: '3 Minuten Marathon',
      ar: 'ماراثون 3 دقائق',
      en: '3 Minute Marathon',
      tr: '3 Dakika Maraton',
      ur: '3 منٹ میراتھن',
    },
    description: {
      de: 'Tanze 3 Minuten lang ohne Fehler',
      ar: 'ارقص لمدة 3 دقائق دون أخطاء',
      en: 'Dance for 3 minutes without missing',
      tr: '3 dakika hatasız dans et',
      ur: '3 منٹ بغیر غلطی کے ناچیں',
    },
    goal: 180,
    type: 'duration',
    stars: 15,
    completed: false,
    progress: 0,
  },
  {
    id: 'combo-100',
    name: {
      de: '100x Combo',
      ar: 'كومبو 100x',
      en: '100x Combo',
      tr: '100x Kombo',
      ur: '100x کومبو',
    },
    description: {
      de: 'Erreiche einen 100er Combo-Multiplikator',
      ar: 'احصل على مضاعف كومبو 100',
      en: 'Get a 100x combo multiplier',
      tr: '100x kombo çarpanı elde et',
      ur: '100x کومبو ضارب حاصل کریں',
    },
    goal: 100,
    type: 'combo',
    stars: 20,
    completed: false,
    progress: 0,
  },
  {
    id: 'all-characters',
    name: {
      de: 'Alle Charaktere',
      ar: 'جميع الشخصيات',
      en: 'All Characters',
      tr: 'Tüm Karakterler',
      ur: 'تمام کردار',
    },
    description: {
      de: 'Tanze mit allen Charakteren',
      ar: 'ارقص مع جميع الشخصiات',
      en: 'Dance with all characters',
      tr: 'Tüm karakterlerle dans et',
      ur: 'تمام کرداروں کے ساتھ ناچیں',
    },
    goal: 8,
    type: 'characters',
    stars: 12,
    completed: false,
    progress: 0,
  },
  {
    id: 'daily-dancer',
    name: {
      de: 'Täglicher Tänzer',
      ar: 'راقص يومي',
      en: 'Daily Dancer',
      tr: 'Günlük Dansçı',
      ur: 'روزانہ رقاص',
    },
    description: {
      de: 'Tanze jeden Tag diese Woche',
      ar: 'ارقص كل يوم هذا الأسبوع',
      en: 'Dance every day this week',
      tr: 'Bu hafta her gün dans et',
      ur: 'اس ہفتے ہر روز ناچیں',
    },
    goal: 7,
    type: 'duration',
    stars: 25,
    completed: false,
    progress: 0,
  },
  {
    id: 'score-master',
    name: {
      de: 'Punktemeister',
      ar: 'سيد النقاط',
      en: 'Score Master',
      tr: 'Skor Ustası',
      ur: 'اسکور ماسٹر',
    },
    description: {
      de: 'Erreiche 100.000 Punkte',
      ar: 'احصل على 100,000 نقطة',
      en: 'Reach 100,000 points',
      tr: '100,000 puana ulaş',
      ur: '100,000 پوائنٹس حاصل کریں',
    },
    goal: 100000,
    type: 'score',
    stars: 30,
    completed: false,
    progress: 0,
  },
];

// Dance Floor Backgrounds
export const danceFloorBackgrounds = [
  {
    id: 'disco-club',
    name: { de: 'Disco Club', ar: 'نادي ديسكو', en: 'Disco Club', tr: 'Disko Kulübü', ur: 'ڈسکو کلب' },
    emoji: '🪩',
  },
  {
    id: 'beach-party',
    name: { de: 'Strandparty', ar: 'حفلة شاطئ', en: 'Beach Party', tr: 'Plaj Partisi', ur: 'ساحل پارٹی' },
    emoji: '🏖️',
  },
  {
    id: 'forest-rave',
    name: { de: 'Waldrave', ar: 'حفلة غابة', en: 'Forest Rave', tr: 'Orman Partisi', ur: 'جنگل پارٹی' },
    emoji: '🌲',
  },
  {
    id: 'space-station',
    name: { de: 'Raumstation', ar: 'محطة فضاء', en: 'Space Station', tr: 'Uzay İstasyonu', ur: 'خلائی اسٹیشن' },
    emoji: '🚀',
  },
  {
    id: 'underwater',
    name: { de: 'Unterwasser', ar: 'تحت الماء', en: 'Underwater', tr: 'Su Altı', ur: 'پانی کے نیچے' },
    emoji: '🌊',
  },
  {
    id: 'city-rooftop',
    name: { de: 'Stadtdach', ar: 'سطح المدينة', en: 'City Rooftop', tr: 'Şehir Çatısı', ur: 'شہر کی چھت' },
    emoji: '🏙️',
  },
];

// Character Outfits
export const danceOutfits = [
  { id: 'party-hat', name: 'Party Hat', emoji: '🎉', cost: 50 },
  { id: 'sunglasses', name: 'Sunglasses', emoji: '😎', cost: 30 },
  { id: 'glow-sticks', name: 'Glow Sticks', emoji: '✨', cost: 40 },
  { id: 'disco-suit', name: 'Disco Suit', emoji: '🕺', cost: 100 },
  { id: 'tutu', name: 'Ballet Tutu', emoji: '🩰', cost: 80 },
  { id: 'crown', name: 'Crown', emoji: '👑', cost: 150 },
  { id: 'bow-tie', name: 'Bow Tie', emoji: '🎀', cost: 25 },
  { id: 'headphones', name: 'Headphones', emoji: '🎧', cost: 60 },
];

// Special Effects
export const specialEffects = [
  { id: 'sparkles', name: 'Sparkles', emoji: '✨', cost: 40 },
  { id: 'fire', name: 'Fire', emoji: '🔥', cost: 60 },
  { id: 'stars', name: 'Stars', emoji: '⭐', cost: 45 },
  { id: 'lightning', name: 'Lightning', emoji: '⚡', cost: 70 },
  { id: 'hearts', name: 'Hearts', emoji: '💖', cost: 35 },
  { id: 'rainbow', name: 'Rainbow', emoji: '🌈', cost: 80 },
];

// Party Modes
export const partyModes = [
  {
    id: 'free-dance',
    name: {
      de: 'Freies Tanzen',
      ar: 'رقص حر',
      en: 'Free Dance',
      tr: 'Serbest Dans',
      ur: 'آزاد رقص',
    },
    description: {
      de: 'Tanze frei ohne Punktevergabe',
      ar: 'ارقص بحرية بدون تسجيل نقاط',
      en: 'Dance freely without scoring',
      tr: 'Puanlama olmadan özgürce dans et',
      ur: 'اسکورنگ کے بغیر آزادانہ ناچیں',
    },
    emoji: '💃',
  },
  {
    id: 'follow-leader',
    name: {
      de: 'Folge dem Anführer',
      ar: 'اتبع القائد',
      en: 'Follow the Leader',
      tr: 'Lideri Takip Et',
      ur: 'لیڈر کی پیروی کریں',
    },
    description: {
      de: 'Kopiere die Bewegungen des Anführers',
      ar: 'قلد حركات القائد',
      en: "Copy the leader's moves",
      tr: 'Liderin hareketlerini kopyala',
      ur: 'لیڈر کی حرکتیں نقل کریں',
    },
    emoji: '👥',
  },
  {
    id: 'freeze-dance',
    name: {
      de: 'Freeze Dance',
      ar: 'رقصة التجميد',
      en: 'Freeze Dance',
      tr: 'Dondurma Dansı',
      ur: 'فریز ڈانس',
    },
    description: {
      de: 'Musik stoppt, nicht bewegen!',
      ar: 'تتوقف الموسيقى، لا تتحرك!',
      en: 'Music stops, do not move!',
      tr: 'Müzik durur, hareket etme!',
      ur: 'موسیقی رکتی ہے، حرکت نہ کریں!',
    },
    emoji: '🧊',
  },
  {
    id: 'dance-battle',
    name: {
      de: 'Tanz-Battle',
      ar: 'معركة رقص',
      en: 'Dance Battle',
      tr: 'Dans Savaşı',
      ur: 'ڈانس بیٹل',
    },
    description: {
      de: 'Tritt in einem Genauigkeits-Wettbewerb an',
      ar: 'تنافس في مسابقة دقة',
      en: 'Compete on accuracy',
      tr: 'Doğrulukta yarış',
      ur: 'درستگی میں مقابلہ کریں',
    },
    emoji: '⚔️',
  },
  {
    id: 'group-sync',
    name: {
      de: 'Gruppen-Sync',
      ar: 'مزامنة جماعية',
      en: 'Group Sync',
      tr: 'Grup Senkronizasyonu',
      ur: 'گروپ سنک',
    },
    description: {
      de: 'Alle Charaktere müssen zusammen tanzen',
      ar: 'يجب أن ترقص جميع الشخصيات معاً',
      en: 'All characters must dance in unison',
      tr: 'Tüm karakterler uyum içinde dans etmeli',
      ur: 'تمام کرداروں کو مل کر ناچنا چاہیے',
    },
    emoji: '👯',
  },
];

/**
 * Calculate score based on accuracy
 */
export function calculateScore(accuracy: string, combo: number): number {
  const baseScores = {
    perfect: 100,
    good: 70,
    ok: 40,
    miss: 0,
  };

  const base = baseScores[accuracy as keyof typeof baseScores] || 0;
  const comboMultiplier = Math.min(combo, 100) / 10 + 1;
  return Math.floor(base * comboMultiplier);
}

/**
 * Determine accuracy based on timing offset (in ms)
 */
export function determineAccuracy(offset: number): 'perfect' | 'good' | 'ok' | 'miss' {
  const absOffset = Math.abs(offset);
  if (absOffset < 50) return 'perfect';
  if (absOffset < 100) return 'good';
  if (absOffset < 150) return 'ok';
  return 'miss';
}

/**
 * Generate rhythm notes for a track based on BPM
 */
export function generateRhythmNotes(
  track: MusicTrack,
  difficulty: 'easy' | 'medium' | 'hard'
): RhythmNote[] {
  const notes: RhythmNote[] = [];
  const beatsPerSecond = track.bpm / 60;
  const totalBeats = Math.floor(track.duration * beatsPerSecond);

  const directions: Array<'up' | 'down' | 'left' | 'right'> = ['up', 'down', 'left', 'right'];

  let noteFrequency: number;
  switch (difficulty) {
    case 'easy':
      noteFrequency = 4; // Every 4 beats
      break;
    case 'medium':
      noteFrequency = 2; // Every 2 beats
      break;
    case 'hard':
      noteFrequency = 1; // Every beat
      break;
  }

  for (let beat = 0; beat < totalBeats; beat += noteFrequency) {
    notes.push({
      beat,
      direction: directions[Math.floor(Math.random() * directions.length)],
      hit: null,
    });
  }

  return notes;
}

/**
 * Check if a challenge is completed
 */
export function checkChallengeCompletion(challenge: DanceChallenge, stats: DanceStats): boolean {
  switch (challenge.type) {
    case 'perfects':
      return stats.perfectHits >= challenge.goal;
    case 'combo':
      return stats.maxCombo >= challenge.goal;
    case 'score':
      return stats.score >= challenge.goal;
    case 'duration':
      return false; // Handled separately in the component
    case 'characters':
      return false; // Handled separately in the component
    default:
      return false;
  }
}

/**
 * Save choreography to localStorage
 */
export function saveChoreography(choreography: Choreography): void {
  const saved = getChoreographies();
  const existing = saved.findIndex((c) => c.id === choreography.id);

  if (existing >= 0) {
    saved[existing] = choreography;
  } else {
    if (saved.length >= 10) {
      saved.pop(); // Remove oldest if at limit
    }
    saved.unshift(choreography);
  }

  localStorage.setItem('dance-choreographies', JSON.stringify(saved));
}

/**
 * Get all saved choreographies
 */
export function getChoreographies(): Choreography[] {
  const saved = localStorage.getItem('dance-choreographies');
  return saved ? JSON.parse(saved) : [];
}

/**
 * Delete a choreography
 */
export function deleteChoreography(id: string): void {
  const saved = getChoreographies();
  const filtered = saved.filter((c) => c.id !== id);
  localStorage.setItem('dance-choreographies', JSON.stringify(filtered));
}

/**
 * Save dance stats
 */
export function saveDanceStats(stats: DanceStats): void {
  const allStats = getDanceStats();
  allStats.push({
    ...stats,
    timestamp: Date.now(),
  });

  // Keep only last 100 sessions
  if (allStats.length > 100) {
    allStats.shift();
  }

  localStorage.setItem('dance-stats', JSON.stringify(allStats));
}

/**
 * Get all dance stats
 */
export function getDanceStats(): any[] {
  const saved = localStorage.getItem('dance-stats');
  return saved ? JSON.parse(saved) : [];
}

/**
 * Update challenge progress
 */
export function updateChallengeProgress(challengeId: string, progress: number): void {
  const challenges = getDanceChallenges();
  const challenge = challenges.find((c) => c.id === challengeId);

  if (challenge) {
    challenge.progress = progress;
    if (progress >= challenge.goal) {
      challenge.completed = true;
    }
    saveDanceChallenges(challenges);
  }
}

/**
 * Get challenges from localStorage
 */
export function getDanceChallenges(): DanceChallenge[] {
  const saved = localStorage.getItem('dance-challenges');
  return saved ? JSON.parse(saved) : [...danceChallenges];
}

/**
 * Save challenges to localStorage
 */
export function saveDanceChallenges(challenges: DanceChallenge[]): void {
  localStorage.setItem('dance-challenges', JSON.stringify(challenges));
}

/**
 * Get daily challenge
 */
export function getDailyChallenge(): DanceChallenge {
  const challenges = getDanceChallenges();
  const today = new Date().toDateString();
  const savedDaily = localStorage.getItem('daily-challenge-date');

  if (savedDaily === today) {
    const savedId = localStorage.getItem('daily-challenge-id');
    const challenge = challenges.find((c) => c.id === savedId);
    if (challenge) return challenge;
  }

  // Pick a random challenge
  const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
  localStorage.setItem('daily-challenge-date', today);
  localStorage.setItem('daily-challenge-id', randomChallenge.id);

  return randomChallenge;
}
