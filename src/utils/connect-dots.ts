/**
 * Connect the Dots Game Logic
 *
 * Handles dot connection mechanics, number sequences, and character reveals
 */

export interface DotPoint {
  id: number;
  x: number;
  y: number;
  number: number | string;
  connected: boolean;
  isActive: boolean;
}

export interface DotPuzzle {
  id: string;
  characterId: string;
  characterName: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  emoji: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  dotCount: number;
  dots: DotPoint[];
  sequenceType: 'standard' | 'skip2' | 'skip5' | 'skip10' | 'alphabet' | 'reverse';
  width: number;
  height: number;
  svgPath?: string;
  colorPalette: string[];
  locked: boolean;
  unlockRequirement?: string;
}

export type DifficultyLevel = 'easy' | 'medium' | 'hard' | 'expert';

export interface ConnectDotsProgress {
  currentDot: number;
  connectedDots: number[];
  isComplete: boolean;
  startTime: number;
  endTime?: number;
  hintsUsed: number;
  mistakes: number;
}

export interface ConnectDotsSettings {
  difficulty: DifficultyLevel;
  showNumbers: boolean;
  playSound: boolean;
  enableHints: boolean;
  autoScroll: boolean;
  practiceMode: boolean;
}

/**
 * Generate dot sequence based on type
 */
export function generateSequence(count: number, type: 'standard' | 'skip2' | 'skip5' | 'skip10' | 'alphabet' | 'reverse'): (number | string)[] {
  const sequence: (number | string)[] = [];

  switch (type) {
    case 'standard':
      for (let i = 1; i <= count; i++) {
        sequence.push(i);
      }
      break;
    case 'skip2':
      for (let i = 1; i <= count; i++) {
        sequence.push(i * 2);
      }
      break;
    case 'skip5':
      for (let i = 1; i <= count; i++) {
        sequence.push(i * 5);
      }
      break;
    case 'skip10':
      for (let i = 1; i <= count; i++) {
        sequence.push(i * 10);
      }
      break;
    case 'alphabet':
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let i = 0; i < Math.min(count, 26); i++) {
        sequence.push(letters[i]);
      }
      break;
    case 'reverse':
      for (let i = count; i >= 1; i--) {
        sequence.push(i);
      }
      break;
  }

  return sequence;
}

/**
 * Create a dot puzzle from SVG path points
 */
export function createDotPuzzle(
  id: string,
  characterId: string,
  characterName: { de: string; ar: string; en: string; tr: string; ur: string },
  emoji: string,
  pathPoints: { x: number; y: number }[],
  difficulty: DifficultyLevel,
  sequenceType: 'standard' | 'skip2' | 'skip5' | 'skip10' | 'alphabet' | 'reverse' = 'standard'
): DotPuzzle {
  const dotCount = pathPoints.length;
  const sequence = generateSequence(dotCount, sequenceType);

  const dots: DotPoint[] = pathPoints.map((point, index) => ({
    id: index,
    x: point.x,
    y: point.y,
    number: sequence[index],
    connected: false,
    isActive: index === 0
  }));

  return {
    id,
    characterId,
    characterName,
    emoji,
    difficulty,
    dotCount,
    dots,
    sequenceType,
    width: 800,
    height: 600,
    colorPalette: getCharacterColors(characterId),
    locked: false
  };
}

/**
 * Get color palette for character
 */
function getCharacterColors(characterId: string): string[] {
  const palettes: Record<string, string[]> = {
    'bruno': ['#8B4513', '#D2691E', '#FFE4B5', '#FFF8DC'],
    'fritz': ['#FF6347', '#FF8C00', '#FFA500', '#FFE4B5'],
    'lina': ['#FFD700', '#FFA500', '#FF8C00', '#FFDAB9'],
    'tobi': ['#87CEEB', '#4682B4', '#6495ED', '#B0E0E6'],
    'mila': ['#FF69B4', '#FFC0CB', '#FFB6C1', '#FFF0F5'],
    'moritz': ['#32CD32', '#90EE90', '#98FB98', '#F0FFF0'],
    'default': ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A']
  };

  return palettes[characterId] || palettes.default;
}

/**
 * Check if a dot click is valid
 */
export function isValidDotClick(dotId: number, progress: ConnectDotsProgress): boolean {
  if (progress.isComplete) return false;

  const expectedDotId = progress.connectedDots.length;
  return dotId === expectedDotId;
}

/**
 * Connect a dot and update progress
 */
export function connectDot(dotId: number, progress: ConnectDotsProgress, totalDots: number): ConnectDotsProgress {
  if (!isValidDotClick(dotId, progress)) {
    return {
      ...progress,
      mistakes: progress.mistakes + 1
    };
  }

  const newConnectedDots = [...progress.connectedDots, dotId];
  const isComplete = newConnectedDots.length === totalDots;

  return {
    ...progress,
    currentDot: isComplete ? dotId : dotId + 1,
    connectedDots: newConnectedDots,
    isComplete,
    endTime: isComplete ? Date.now() : undefined
  };
}

/**
 * Calculate completion time in seconds
 */
export function getCompletionTime(progress: ConnectDotsProgress): number {
  if (!progress.endTime) return 0;
  return Math.round((progress.endTime - progress.startTime) / 1000);
}

/**
 * Calculate stars earned based on performance
 */
export function calculateStars(progress: ConnectDotsProgress, puzzle: DotPuzzle): number {
  if (!progress.isComplete) return 0;

  const completionTime = getCompletionTime(progress);
  const baseStars = 15;

  // Bonus for no hints
  const noHintsBonus = progress.hintsUsed === 0 ? 5 : 0;

  // Bonus for no mistakes
  const noMistakesBonus = progress.mistakes === 0 ? 5 : 0;

  // Speed bonus (based on difficulty)
  let speedBonus = 0;
  const speedThresholds = {
    easy: 60,
    medium: 120,
    hard: 180,
    expert: 240
  };

  if (completionTime < speedThresholds[puzzle.difficulty]) {
    speedBonus = 5;
  }

  return baseStars + noHintsBonus + noMistakesBonus + speedBonus;
}

/**
 * Pre-built character puzzles
 */
export function getCharacterPuzzles(): DotPuzzle[] {
  return [
    // Bruno the Bear - Easy
    createDotPuzzle(
      'bruno-bear',
      'bruno',
      {
        de: 'Bruno der Bär',
        ar: 'برونو الدب',
        en: 'Bruno the Bear',
        tr: 'Ayı Bruno',
        ur: 'بھالو برونو'
      },
      '🐻',
      generateBearShape(),
      'easy',
      'standard'
    ),

    // Fritz the Fox - Easy
    createDotPuzzle(
      'fritz-fox',
      'fritz',
      {
        de: 'Fritz der Fuchs',
        ar: 'فريتز الثعلب',
        en: 'Fritz the Fox',
        tr: 'Tilki Fritz',
        ur: 'لومڑی فرٹز'
      },
      '🦊',
      generateFoxShape(),
      'easy',
      'standard'
    ),

    // Lina the Lion - Medium
    createDotPuzzle(
      'lina-lion',
      'lina',
      {
        de: 'Lina die Löwin',
        ar: 'لينا الأسد',
        en: 'Lina the Lion',
        tr: 'Aslan Lina',
        ur: 'شیر لینا'
      },
      '🦁',
      generateLionShape(),
      'medium',
      'skip2'
    ),

    // Tobi the Turtle - Medium
    createDotPuzzle(
      'tobi-turtle',
      'tobi',
      {
        de: 'Tobi die Schildkröte',
        ar: 'توبي السلحفاة',
        en: 'Tobi the Turtle',
        tr: 'Kaplumbağa Tobi',
        ur: 'کچھوا ٹوبی'
      },
      '🐢',
      generateTurtleShape(),
      'medium',
      'standard'
    ),

    // Mila the Mouse - Easy
    createDotPuzzle(
      'mila-mouse',
      'mila',
      {
        de: 'Mila die Maus',
        ar: 'ميلا الفأر',
        en: 'Mila the Mouse',
        tr: 'Fare Mila',
        ur: 'چوہا میلا'
      },
      '🐭',
      generateMouseShape(),
      'easy',
      'standard'
    ),

    // Star - Easy (geometric)
    createDotPuzzle(
      'star-shape',
      'star',
      {
        de: 'Stern',
        ar: 'نجمة',
        en: 'Star',
        tr: 'Yıldız',
        ur: 'ستارہ'
      },
      '⭐',
      generateStarShape(),
      'easy',
      'standard'
    ),

    // Heart - Easy (geometric)
    createDotPuzzle(
      'heart-shape',
      'heart',
      {
        de: 'Herz',
        ar: 'قلب',
        en: 'Heart',
        tr: 'Kalp',
        ur: 'دل'
      },
      '❤️',
      generateHeartShape(),
      'easy',
      'standard'
    ),

    // Tree - Medium
    createDotPuzzle(
      'tree-shape',
      'tree',
      {
        de: 'Baum',
        ar: 'شجرة',
        en: 'Tree',
        tr: 'Ağaç',
        ur: 'درخت'
      },
      '🌳',
      generateTreeShape(),
      'medium',
      'skip2'
    ),

    // House - Medium
    createDotPuzzle(
      'house-shape',
      'house',
      {
        de: 'Haus',
        ar: 'منزل',
        en: 'House',
        tr: 'Ev',
        ur: 'گھر'
      },
      '🏠',
      generateHouseShape(),
      'medium',
      'standard'
    ),

    // Butterfly - Hard
    createDotPuzzle(
      'butterfly-shape',
      'butterfly',
      {
        de: 'Schmetterling',
        ar: 'فراشة',
        en: 'Butterfly',
        tr: 'Kelebek',
        ur: 'تتلی'
      },
      '🦋',
      generateButterflyShape(),
      'hard',
      'skip2'
    )
  ];
}

/**
 * Shape generators - create dot coordinates for each character
 */

function generateBearShape(): { x: number; y: number }[] {
  // Simple bear outline with 12 dots
  return [
    { x: 400, y: 150 }, // top of head
    { x: 350, y: 170 }, // left ear
    { x: 330, y: 200 }, // left side
    { x: 340, y: 280 }, // left body
    { x: 360, y: 380 }, // left leg
    { x: 400, y: 420 }, // bottom center
    { x: 440, y: 380 }, // right leg
    { x: 460, y: 280 }, // right body
    { x: 470, y: 200 }, // right side
    { x: 450, y: 170 }, // right ear
    { x: 400, y: 150 }, // back to top (close shape)
  ];
}

function generateFoxShape(): { x: number; y: number }[] {
  // Fox with pointed ears and snout
  return [
    { x: 400, y: 140 }, // top of head
    { x: 340, y: 180 }, // left ear tip
    { x: 360, y: 220 }, // left head
    { x: 350, y: 300 }, // left body
    { x: 370, y: 380 }, // left leg
    { x: 320, y: 450 }, // tail left
    { x: 280, y: 480 }, // tail tip
    { x: 320, y: 510 }, // tail bottom
    { x: 440, y: 380 }, // right leg
    { x: 450, y: 300 }, // right body
    { x: 440, y: 220 }, // right head
    { x: 460, y: 180 }, // right ear tip
  ];
}

function generateLionShape(): { x: number; y: number }[] {
  // Lion with mane (20 dots for medium difficulty)
  const dots: { x: number; y: number }[] = [];
  const centerX = 400;
  const centerY = 300;
  const maneRadius = 150;

  // Create circular mane
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    dots.push({
      x: centerX + Math.cos(angle) * maneRadius,
      y: centerY + Math.sin(angle) * maneRadius
    });
  }

  // Add face details
  dots.push({ x: centerX - 30, y: centerY - 20 }); // left eye
  dots.push({ x: centerX + 30, y: centerY - 20 }); // right eye
  dots.push({ x: centerX, y: centerY + 20 }); // nose
  dots.push({ x: centerX, y: centerY + 50 }); // mouth

  return dots;
}

function generateTurtleShape(): { x: number; y: number }[] {
  // Turtle with shell pattern
  return [
    { x: 400, y: 180 }, // head top
    { x: 380, y: 220 }, // head left
    { x: 420, y: 220 }, // head right
    { x: 350, y: 250 }, // shell left front
    { x: 300, y: 300 }, // shell left side
    { x: 300, y: 380 }, // shell left back
    { x: 350, y: 430 }, // shell bottom left
    { x: 400, y: 450 }, // shell bottom
    { x: 450, y: 430 }, // shell bottom right
    { x: 500, y: 380 }, // shell right back
    { x: 500, y: 300 }, // shell right side
    { x: 450, y: 250 }, // shell right front
    { x: 280, y: 340 }, // left leg
    { x: 520, y: 340 }, // right leg
  ];
}

function generateMouseShape(): { x: number; y: number }[] {
  // Simple mouse with big ears
  return [
    { x: 400, y: 250 }, // nose
    { x: 380, y: 280 }, // left cheek
    { x: 350, y: 320 }, // left body
    { x: 330, y: 360 }, // left back
    { x: 360, y: 400 }, // bottom left
    { x: 400, y: 420 }, // bottom
    { x: 440, y: 400 }, // bottom right
    { x: 470, y: 360 }, // right back
    { x: 450, y: 320 }, // right body
    { x: 420, y: 280 }, // right cheek
    { x: 320, y: 200 }, // left ear
    { x: 480, y: 200 }, // right ear
  ];
}

function generateStarShape(): { x: number; y: number }[] {
  // 5-pointed star
  const dots: { x: number; y: number }[] = [];
  const centerX = 400;
  const centerY = 300;
  const outerRadius = 150;
  const innerRadius = 60;

  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    dots.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    });
  }

  return dots;
}

function generateHeartShape(): { x: number; y: number }[] {
  // Heart shape
  const dots: { x: number; y: number }[] = [];
  const centerX = 400;
  const centerY = 280;
  const size = 120;

  // Left curve
  dots.push({ x: centerX, y: centerY + size * 0.3 });
  dots.push({ x: centerX - size * 0.5, y: centerY });
  dots.push({ x: centerX - size * 0.8, y: centerY - size * 0.3 });
  dots.push({ x: centerX - size * 0.6, y: centerY - size * 0.7 });
  dots.push({ x: centerX - size * 0.3, y: centerY - size * 0.9 });

  // Top center
  dots.push({ x: centerX, y: centerY - size * 0.8 });

  // Right curve
  dots.push({ x: centerX + size * 0.3, y: centerY - size * 0.9 });
  dots.push({ x: centerX + size * 0.6, y: centerY - size * 0.7 });
  dots.push({ x: centerX + size * 0.8, y: centerY - size * 0.3 });
  dots.push({ x: centerX + size * 0.5, y: centerY });

  // Bottom point
  dots.push({ x: centerX, y: centerY + size * 1.2 });

  return dots;
}

function generateTreeShape(): { x: number; y: number }[] {
  // Tree with trunk and foliage
  return [
    { x: 400, y: 500 }, // trunk bottom
    { x: 380, y: 450 }, // trunk left
    { x: 420, y: 450 }, // trunk right
    { x: 370, y: 400 }, // foliage bottom left
    { x: 430, y: 400 }, // foliage bottom right
    { x: 340, y: 350 }, // foliage left
    { x: 300, y: 280 }, // foliage far left
    { x: 320, y: 220 }, // foliage upper left
    { x: 360, y: 180 }, // foliage top left
    { x: 400, y: 150 }, // tree top
    { x: 440, y: 180 }, // foliage top right
    { x: 480, y: 220 }, // foliage upper right
    { x: 500, y: 280 }, // foliage far right
    { x: 460, y: 350 }, // foliage right
  ];
}

function generateHouseShape(): { x: number; y: number }[] {
  // Simple house with roof
  return [
    { x: 300, y: 450 }, // bottom left corner
    { x: 300, y: 300 }, // top left wall
    { x: 400, y: 200 }, // roof peak
    { x: 500, y: 300 }, // top right wall
    { x: 500, y: 450 }, // bottom right corner
    { x: 450, y: 450 }, // door right
    { x: 450, y: 370 }, // door top right
    { x: 350, y: 370 }, // door top left
    { x: 350, y: 450 }, // door left
    { x: 340, y: 330 }, // window left
    { x: 340, y: 280 }, // window top left
    { x: 380, y: 280 }, // window top right
    { x: 380, y: 330 }, // window bottom right
  ];
}

function generateButterflyShape(): { x: number; y: number }[] {
  // Symmetric butterfly (40 dots for hard difficulty)
  const dots: { x: number; y: number }[] = [];
  const centerX = 400;
  const centerY = 300;

  // Body
  dots.push({ x: centerX, y: centerY - 100 });
  dots.push({ x: centerX, y: centerY - 50 });
  dots.push({ x: centerX, y: centerY });
  dots.push({ x: centerX, y: centerY + 50 });
  dots.push({ x: centerX, y: centerY + 100 });

  // Left upper wing
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI;
    const radius = 120;
    dots.push({
      x: centerX - Math.abs(Math.cos(angle)) * radius,
      y: centerY - 50 + Math.sin(angle) * radius
    });
  }

  // Left lower wing
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI;
    const radius = 80;
    dots.push({
      x: centerX - Math.abs(Math.cos(angle)) * radius,
      y: centerY + 30 + Math.sin(angle) * radius
    });
  }

  // Right upper wing
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI;
    const radius = 120;
    dots.push({
      x: centerX + Math.abs(Math.cos(angle)) * radius,
      y: centerY - 50 + Math.sin(angle) * radius
    });
  }

  // Right lower wing
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI;
    const radius = 80;
    dots.push({
      x: centerX + Math.abs(Math.cos(angle)) * radius,
      y: centerY + 30 + Math.sin(angle) * radius
    });
  }

  // Antennae
  dots.push({ x: centerX - 15, y: centerY - 110 });
  dots.push({ x: centerX + 15, y: centerY - 110 });

  return dots;
}

/**
 * Save/load progress from localStorage
 */
export function saveProgress(puzzleId: string, progress: ConnectDotsProgress): void {
  const key = `connect-dots-${puzzleId}`;
  localStorage.setItem(key, JSON.stringify(progress));
}

export function loadProgress(puzzleId: string): ConnectDotsProgress | null {
  const key = `connect-dots-${puzzleId}`;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : null;
}

export function clearProgress(puzzleId: string): void {
  const key = `connect-dots-${puzzleId}`;
  localStorage.removeItem(key);
}

/**
 * Save puzzle completion stats
 */
export interface PuzzleStats {
  puzzleId: string;
  completions: number;
  bestTime: number;
  totalStars: number;
  lastCompleted?: number;
}

export function savePuzzleStats(puzzleId: string, stats: PuzzleStats): void {
  const allStats = getAllPuzzleStats();
  allStats[puzzleId] = stats;
  localStorage.setItem('connect-dots-stats', JSON.stringify(allStats));
}

export function getPuzzleStats(puzzleId: string): PuzzleStats | null {
  const allStats = getAllPuzzleStats();
  return allStats[puzzleId] || null;
}

export function getAllPuzzleStats(): Record<string, PuzzleStats> {
  const stored = localStorage.getItem('connect-dots-stats');
  return stored ? JSON.parse(stored) : {};
}
