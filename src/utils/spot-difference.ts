/**
 * Spot the Difference Game Logic
 * Visual attention skill development game with difference detection, scoring, and achievements
 */

import { soundEffects } from './sound-effects';
import { confetti } from './confetti';
import { starWallet } from './star-wallet';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type GameMode = 'practice' | 'timed' | 'oneshot' | 'speedrun';
export type DifferenceType =
  | 'color' // Same object, different color
  | 'missing' // Object removed
  | 'added' // Extra object added
  | 'size' // Bigger/smaller
  | 'shape' // Different shape
  | 'pattern' // Different pattern
  | 'text' // Different text/number
  | 'expression' // Facial expression change
  | 'position' // Moved location
  | 'detail'; // Hidden detail added/removed

export interface Difference {
  id: string;
  type: DifferenceType;
  x: number; // X position (percentage 0-100)
  y: number; // Y position (percentage 0-100)
  radius: number; // Click detection radius (percentage)
  found: boolean;
  description: string; // What changed
  hintZone?: number; // 1-4 for quadrant hints
}

export interface ScenePair {
  id: string;
  name: string;
  storyId?: string;
  category: 'character' | 'setting' | 'group' | 'action';
  difficulty: DifficultyLevel;
  leftImageUrl: string;
  rightImageUrl: string;
  differences: Difference[];
  unlocked: boolean;
  requiredStars?: number;
  requiredCompletions?: number;
}

export interface GameState {
  sceneId: string;
  difficulty: DifficultyLevel;
  mode: GameMode;
  differences: Difference[];
  foundCount: number;
  totalDifferences: number;
  wrongClicks: number;
  hintsUsed: number;
  maxHints: number;
  startTime: number | null;
  endTime: number | null;
  timeLimit: number | null; // seconds, null for unlimited
  score: number;
  stars: number;
  isComplete: boolean;
  isPaused: boolean;
}

export interface GameStats {
  totalGames: number;
  gamesCompleted: number;
  perfectGames: number; // No wrong clicks
  totalDifferencesFound: number;
  totalWrongClicks: number;
  totalHintsUsed: number;
  bestTimeEasy: number;
  bestTimeMedium: number;
  bestTimeHard: number;
  averageAccuracy: number;
  starsEarned: number;
  scenesUnlocked: Set<string>;
  achievements: string[];
}

// Difficulty configurations
export const DIFFICULTY_CONFIG = {
  easy: {
    differences: 5,
    timeLimit: null,
    hintPenalty: 30,
    wrongClickPenalty: 10,
    perfectBonus: 200,
    speedBonusTime: 10, // seconds
  },
  medium: {
    differences: 7,
    timeLimit: null,
    hintPenalty: 50,
    wrongClickPenalty: 10,
    perfectBonus: 300,
    speedBonusTime: 10,
  },
  hard: {
    differences: 10,
    timeLimit: null,
    hintPenalty: 75,
    wrongClickPenalty: 10,
    perfectBonus: 500,
    speedBonusTime: 10,
  },
};

// Game mode configurations
export const MODE_CONFIG = {
  practice: { timeLimit: null, allowWrongClicks: true, maxHints: 3 },
  timed: { timeLimit: 120, allowWrongClicks: true, maxHints: 3 },
  oneshot: { timeLimit: null, allowWrongClicks: false, maxHints: 0 },
  speedrun: { timeLimit: null, allowWrongClicks: true, maxHints: 0 },
};

// Pre-made scene pairs (50+ scenes)
export const SCENE_LIBRARY: ScenePair[] = [
  // EASY SCENES (5 differences each)
  {
    id: 'bruno-forest-1',
    name: 'Bruno im Wald',
    storyId: '001-bruno',
    category: 'character',
    difficulty: 'easy',
    leftImageUrl: '/images/spot-difference/bruno-forest-a.jpg',
    rightImageUrl: '/images/spot-difference/bruno-forest-b.jpg',
    differences: [
      {
        id: 'bf1-1',
        type: 'color',
        x: 25,
        y: 40,
        radius: 8,
        found: false,
        description: 'Brunos Schal ist rot statt blau',
        hintZone: 1,
      },
      {
        id: 'bf1-2',
        type: 'missing',
        x: 75,
        y: 30,
        radius: 6,
        found: false,
        description: 'Ein Vogel fehlt im Baum',
        hintZone: 2,
      },
      {
        id: 'bf1-3',
        type: 'added',
        x: 50,
        y: 85,
        radius: 5,
        found: false,
        description: 'Eine extra Blume am Boden',
        hintZone: 3,
      },
      {
        id: 'bf1-4',
        type: 'size',
        x: 80,
        y: 60,
        radius: 7,
        found: false,
        description: 'Der Busch ist größer',
        hintZone: 4,
      },
      {
        id: 'bf1-5',
        type: 'expression',
        x: 30,
        y: 35,
        radius: 8,
        found: false,
        description: 'Bruno lächelt breiter',
        hintZone: 1,
      },
    ],
    unlocked: true,
  },
  {
    id: 'fritz-home-1',
    name: 'Fritz zu Hause',
    storyId: '002-fritz',
    category: 'setting',
    difficulty: 'easy',
    leftImageUrl: '/images/spot-difference/fritz-home-a.jpg',
    rightImageUrl: '/images/spot-difference/fritz-home-b.jpg',
    differences: [
      {
        id: 'fh1-1',
        type: 'color',
        x: 60,
        y: 20,
        radius: 6,
        found: false,
        description: 'Der Vorhang ist gelb statt grün',
        hintZone: 2,
      },
      {
        id: 'fh1-2',
        type: 'added',
        x: 40,
        y: 50,
        radius: 5,
        found: false,
        description: 'Ein Kissen auf dem Sofa',
        hintZone: 3,
      },
      {
        id: 'fh1-3',
        type: 'missing',
        x: 80,
        y: 70,
        radius: 4,
        found: false,
        description: 'Ein Spielzeug fehlt',
        hintZone: 4,
      },
      {
        id: 'fh1-4',
        type: 'position',
        x: 25,
        y: 75,
        radius: 6,
        found: false,
        description: 'Der Teppich ist verschoben',
        hintZone: 3,
      },
      {
        id: 'fh1-5',
        type: 'pattern',
        x: 70,
        y: 40,
        radius: 7,
        found: false,
        description: 'Das Bild an der Wand hat Streifen statt Punkten',
        hintZone: 2,
      },
    ],
    unlocked: true,
  },
  {
    id: 'lina-garden-1',
    name: 'Lina im Garten',
    storyId: '003-lina',
    category: 'character',
    difficulty: 'easy',
    leftImageUrl: '/images/spot-difference/lina-garden-a.jpg',
    rightImageUrl: '/images/spot-difference/lina-garden-b.jpg',
    differences: [
      {
        id: 'lg1-1',
        type: 'color',
        x: 35,
        y: 45,
        radius: 8,
        found: false,
        description: 'Linas Kleid ist rosa statt lila',
        hintZone: 1,
      },
      {
        id: 'lg1-2',
        type: 'added',
        x: 65,
        y: 25,
        radius: 5,
        found: false,
        description: 'Ein Schmetterling über der Blume',
        hintZone: 2,
      },
      {
        id: 'lg1-3',
        type: 'missing',
        x: 50,
        y: 80,
        radius: 6,
        found: false,
        description: 'Eine Karotte fehlt',
        hintZone: 3,
      },
      {
        id: 'lg1-4',
        type: 'size',
        x: 20,
        y: 30,
        radius: 7,
        found: false,
        description: 'Die Sonnenblume ist kleiner',
        hintZone: 1,
      },
      {
        id: 'lg1-5',
        type: 'detail',
        x: 75,
        y: 65,
        radius: 5,
        found: false,
        description: 'Die Gießkanne hat einen Punkt',
        hintZone: 4,
      },
    ],
    unlocked: true,
  },

  // MEDIUM SCENES (7 differences each)
  {
    id: 'tobi-pond-1',
    name: 'Tobi am Teich',
    storyId: '004-tobi',
    category: 'setting',
    difficulty: 'medium',
    leftImageUrl: '/images/spot-difference/tobi-pond-a.jpg',
    rightImageUrl: '/images/spot-difference/tobi-pond-b.jpg',
    differences: [
      {
        id: 'tp1-1',
        type: 'color',
        x: 40,
        y: 40,
        radius: 8,
        found: false,
        description: 'Tobi ist grün statt blau',
        hintZone: 1,
      },
      {
        id: 'tp1-2',
        type: 'missing',
        x: 70,
        y: 20,
        radius: 4,
        found: false,
        description: 'Eine Libelle fehlt',
        hintZone: 2,
      },
      {
        id: 'tp1-3',
        type: 'added',
        x: 25,
        y: 75,
        radius: 5,
        found: false,
        description: 'Ein Stein am Ufer',
        hintZone: 3,
      },
      {
        id: 'tp1-4',
        type: 'position',
        x: 55,
        y: 60,
        radius: 6,
        found: false,
        description: 'Das Seerosenblatt ist verschoben',
        hintZone: 3,
      },
      {
        id: 'tp1-5',
        type: 'size',
        x: 80,
        y: 50,
        radius: 7,
        found: false,
        description: 'Der Schilf ist höher',
        hintZone: 4,
      },
      {
        id: 'tp1-6',
        type: 'detail',
        x: 60,
        y: 30,
        radius: 5,
        found: false,
        description: 'Die Wolke hat eine andere Form',
        hintZone: 2,
      },
      {
        id: 'tp1-7',
        type: 'expression',
        x: 42,
        y: 38,
        radius: 6,
        found: false,
        description: 'Tobi hat geschlossene Augen',
        hintZone: 1,
      },
    ],
    unlocked: false,
    requiredCompletions: 3,
  },
  {
    id: 'group-picnic-1',
    name: 'Picknick im Park',
    category: 'group',
    difficulty: 'medium',
    leftImageUrl: '/images/spot-difference/group-picnic-a.jpg',
    rightImageUrl: '/images/spot-difference/group-picnic-b.jpg',
    differences: [
      {
        id: 'gp1-1',
        type: 'color',
        x: 30,
        y: 70,
        radius: 6,
        found: false,
        description: 'Die Decke ist rot statt blau',
        hintZone: 3,
      },
      {
        id: 'gp1-2',
        type: 'missing',
        x: 50,
        y: 60,
        radius: 5,
        found: false,
        description: 'Ein Apfel fehlt im Korb',
        hintZone: 3,
      },
      {
        id: 'gp1-3',
        type: 'added',
        x: 75,
        y: 35,
        radius: 7,
        found: false,
        description: 'Eine Biene beim Baum',
        hintZone: 2,
      },
      {
        id: 'gp1-4',
        type: 'position',
        x: 20,
        y: 45,
        radius: 8,
        found: false,
        description: 'Bruno sitzt woanders',
        hintZone: 1,
      },
      {
        id: 'gp1-5',
        type: 'pattern',
        x: 65,
        y: 75,
        radius: 6,
        found: false,
        description: 'Der Teller hat Punkte statt Streifen',
        hintZone: 4,
      },
      {
        id: 'gp1-6',
        type: 'size',
        x: 85,
        y: 25,
        radius: 5,
        found: false,
        description: 'Die Wolke ist größer',
        hintZone: 2,
      },
      {
        id: 'gp1-7',
        type: 'detail',
        x: 45,
        y: 80,
        radius: 4,
        found: false,
        description: 'Die Gabel fehlt ein Zacken',
        hintZone: 3,
      },
    ],
    unlocked: false,
    requiredCompletions: 5,
  },

  // HARD SCENES (10 differences each)
  {
    id: 'classroom-chaos-1',
    name: 'Chaos im Klassenzimmer',
    category: 'setting',
    difficulty: 'hard',
    leftImageUrl: '/images/spot-difference/classroom-a.jpg',
    rightImageUrl: '/images/spot-difference/classroom-b.jpg',
    differences: [
      {
        id: 'cc1-1',
        type: 'color',
        x: 15,
        y: 25,
        radius: 5,
        found: false,
        description: 'Die Tafel ist grün statt schwarz',
        hintZone: 1,
      },
      {
        id: 'cc1-2',
        type: 'missing',
        x: 35,
        y: 40,
        radius: 4,
        found: false,
        description: 'Ein Buch fehlt im Regal',
        hintZone: 1,
      },
      {
        id: 'cc1-3',
        type: 'added',
        x: 65,
        y: 55,
        radius: 5,
        found: false,
        description: 'Ein extra Stift auf dem Tisch',
        hintZone: 4,
      },
      {
        id: 'cc1-4',
        type: 'position',
        x: 50,
        y: 70,
        radius: 6,
        found: false,
        description: 'Der Stuhl ist verschoben',
        hintZone: 3,
      },
      {
        id: 'cc1-5',
        type: 'text',
        x: 20,
        y: 20,
        radius: 7,
        found: false,
        description: '2+2=5 statt 2+2=4',
        hintZone: 1,
      },
      {
        id: 'cc1-6',
        type: 'shape',
        x: 80,
        y: 35,
        radius: 5,
        found: false,
        description: 'Die Uhr ist eckig statt rund',
        hintZone: 2,
      },
      {
        id: 'cc1-7',
        type: 'pattern',
        x: 45,
        y: 80,
        radius: 4,
        found: false,
        description: 'Der Teppich hat ein anderes Muster',
        hintZone: 3,
      },
      {
        id: 'cc1-8',
        type: 'size',
        x: 70,
        y: 15,
        radius: 6,
        found: false,
        description: 'Das Fenster ist breiter',
        hintZone: 2,
      },
      {
        id: 'cc1-9',
        type: 'detail',
        x: 25,
        y: 60,
        radius: 5,
        found: false,
        description: 'Die Lampe hat 4 statt 3 Arme',
        hintZone: 1,
      },
      {
        id: 'cc1-10',
        type: 'expression',
        x: 60,
        y: 45,
        radius: 7,
        found: false,
        description: 'Der Charakter sieht überrascht aus',
        hintZone: 4,
      },
    ],
    unlocked: false,
    requiredCompletions: 10,
  },
];

export class SpotDifferenceGame {
  private state: GameState;
  private storageKey = 'spot-difference-stats';
  private clickTimestamps: number[] = [];
  private foundTimestamps: Map<string, number> = new Map();

  constructor() {
    this.state = this.getInitialState();
  }

  private getInitialState(): GameState {
    return {
      sceneId: '',
      difficulty: 'easy',
      mode: 'practice',
      differences: [],
      foundCount: 0,
      totalDifferences: 0,
      wrongClicks: 0,
      hintsUsed: 0,
      maxHints: 3,
      startTime: null,
      endTime: null,
      timeLimit: null,
      score: 0,
      stars: 0,
      isComplete: false,
      isPaused: false,
    };
  }

  /**
   * Start a new game
   */
  startGame(sceneId: string, mode: GameMode = 'practice'): boolean {
    const scene = SCENE_LIBRARY.find((s) => s.id === sceneId);
    if (!scene) {
      console.error('Scene not found:', sceneId);
      return false;
    }

    if (!scene.unlocked && !this.isSceneUnlocked(sceneId)) {
      console.error('Scene is locked:', sceneId);
      return false;
    }

    const modeConfig = MODE_CONFIG[mode];
    const diffConfig = DIFFICULTY_CONFIG[scene.difficulty];

    // Clone differences so we don't mutate the original
    const differences = scene.differences.map((d) => ({ ...d, found: false }));

    this.state = {
      sceneId,
      difficulty: scene.difficulty,
      mode,
      differences,
      foundCount: 0,
      totalDifferences: differences.length,
      wrongClicks: 0,
      hintsUsed: 0,
      maxHints: modeConfig.maxHints,
      startTime: Date.now(),
      endTime: null,
      timeLimit: modeConfig.timeLimit,
      score: 0,
      stars: 0,
      isComplete: false,
      isPaused: false,
    };

    this.clickTimestamps = [];
    this.foundTimestamps.clear();

    soundEffects.playMagicSparkle();
    return true;
  }

  /**
   * Handle click on image
   */
  handleClick(x: number, y: number): {
    found: boolean;
    difference?: Difference;
    message: string;
  } {
    if (this.state.isComplete || this.state.isPaused) {
      return { found: false, message: 'Game not active' };
    }

    // Check if time is up
    if (this.isTimeUp()) {
      this.failGame();
      return { found: false, message: 'Time is up!' };
    }

    // Record click timestamp
    this.clickTimestamps.push(Date.now());

    // Find if click is within any difference radius
    const clickedDifference = this.state.differences.find((diff) => {
      if (diff.found) return false;

      const dx = Math.abs(x - diff.x);
      const dy = Math.abs(y - diff.y);
      const distance = Math.sqrt(dx * dx + dy * dy);

      return distance <= diff.radius;
    });

    if (clickedDifference) {
      // Found a difference!
      clickedDifference.found = true;
      this.state.foundCount++;
      this.foundTimestamps.set(clickedDifference.id, Date.now());

      // Calculate points
      const points = this.calculateDifferencePoints(clickedDifference);
      this.state.score += points;

      soundEffects.playCorrect();
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 20);

      // Check if game is complete
      if (this.state.foundCount === this.state.totalDifferences) {
        this.completeGame();
      }

      return {
        found: true,
        difference: clickedDifference,
        message: `+${points} Punkte! ${clickedDifference.description}`,
      };
    } else {
      // Wrong click
      const modeConfig = MODE_CONFIG[this.state.mode];
      if (!modeConfig.allowWrongClicks) {
        // One-shot mode: game over on wrong click
        this.failGame();
        return { found: false, message: 'Falsch geklickt! Spiel beendet.' };
      }

      this.state.wrongClicks++;
      const penalty = DIFFICULTY_CONFIG[this.state.difficulty].wrongClickPenalty;
      this.state.score = Math.max(0, this.state.score - penalty);

      soundEffects.playIncorrect();

      return { found: false, message: `-${penalty} Punkte` };
    }
  }

  /**
   * Calculate points for finding a difference
   */
  private calculateDifferencePoints(difference: Difference): number {
    const basePoints = 100;
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
    }[this.state.difficulty];

    let points = basePoints * difficultyMultiplier;

    // Speed bonus: if found within 10 seconds
    const timeSinceStart = Date.now() - (this.state.startTime || Date.now());
    const speedBonusTime =
      DIFFICULTY_CONFIG[this.state.difficulty].speedBonusTime * 1000;

    if (timeSinceStart <= speedBonusTime) {
      points += 50;
    }

    return Math.round(points);
  }

  /**
   * Use a hint
   */
  useHint(): { success: boolean; message: string; zone?: number } {
    if (this.state.hintsUsed >= this.state.maxHints) {
      return { success: false, message: 'Keine Hinweise mehr verfügbar' };
    }

    if (this.state.foundCount === this.state.totalDifferences) {
      return { success: false, message: 'Alle Unterschiede gefunden!' };
    }

    const unfoundDifferences = this.state.differences.filter((d) => !d.found);
    if (unfoundDifferences.length === 0) {
      return { success: false, message: 'Keine Unterschiede übrig' };
    }

    // Get next unfound difference
    const nextDifference = unfoundDifferences[0];
    this.state.hintsUsed++;

    // Deduct points for hint
    const penalty = DIFFICULTY_CONFIG[this.state.difficulty].hintPenalty;
    this.state.score = Math.max(0, this.state.score - penalty);

    soundEffects.playClick();

    // Return hint level based on hints used for this difference
    const hintLevel = this.state.hintsUsed % 3 || 3;

    return {
      success: true,
      message: `Hinweis ${this.state.hintsUsed}/${this.state.maxHints} (-${penalty} Punkte)`,
      zone: hintLevel === 1 ? nextDifference.hintZone : undefined,
    };
  }

  /**
   * Check if time is up
   */
  private isTimeUp(): boolean {
    if (!this.state.timeLimit || !this.state.startTime) return false;

    const elapsed = (Date.now() - this.state.startTime) / 1000;
    return elapsed >= this.state.timeLimit;
  }

  /**
   * Get remaining time
   */
  getRemainingTime(): number | null {
    if (!this.state.timeLimit || !this.state.startTime) return null;

    const elapsed = (Date.now() - this.state.startTime) / 1000;
    return Math.max(0, this.state.timeLimit - elapsed);
  }

  /**
   * Complete the game successfully
   */
  private completeGame(): void {
    this.state.endTime = Date.now();
    this.state.isComplete = true;

    // Calculate stars
    this.state.stars = this.calculateStars();

    // Award bonus for perfect game (no wrong clicks)
    if (this.state.wrongClicks === 0) {
      const bonus = DIFFICULTY_CONFIG[this.state.difficulty].perfectBonus;
      this.state.score += bonus;
    }

    // Award stars to wallet
    const starReward = this.state.stars * 5;
    starWallet.earnStars('spot-difference-complete', starReward);

    // Save statistics
    this.saveGameStats(true);

    // Check achievements
    this.checkAchievements();

    // Celebration
    soundEffects.playCompletion();
    confetti.fireworks(5, 300);

    // Dispatch completion event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('spot-difference-complete', {
          detail: {
            sceneId: this.state.sceneId,
            duration: this.getGameDuration(),
            score: this.state.score,
            stars: this.state.stars,
            wrongClicks: this.state.wrongClicks,
            hintsUsed: this.state.hintsUsed,
          },
        })
      );
    }
  }

  /**
   * Fail the game (time up or wrong click in one-shot mode)
   */
  private failGame(): void {
    this.state.endTime = Date.now();
    this.state.isComplete = true;
    this.state.stars = 0;

    // Save statistics
    this.saveGameStats(false);

    soundEffects.playIncorrect();

    // Dispatch fail event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('spot-difference-failed', {
          detail: {
            sceneId: this.state.sceneId,
            foundCount: this.state.foundCount,
            totalDifferences: this.state.totalDifferences,
          },
        })
      );
    }
  }

  /**
   * Calculate star rating (1-3 stars)
   */
  private calculateStars(): number {
    // Base stars on accuracy and hints used
    const accuracy =
      this.state.totalDifferences > 0
        ? this.state.foundCount / this.state.totalDifferences
        : 0;

    if (accuracy < 1) return 0; // Not complete

    // 3 stars: perfect (no wrong clicks, no hints)
    if (this.state.wrongClicks === 0 && this.state.hintsUsed === 0) {
      return 3;
    }

    // 2 stars: good (max 2 wrong clicks or 1 hint)
    if (this.state.wrongClicks <= 2 && this.state.hintsUsed <= 1) {
      return 2;
    }

    // 1 star: completed
    return 1;
  }

  /**
   * Get game duration in seconds
   */
  getGameDuration(): number {
    if (!this.state.startTime || !this.state.endTime) {
      return 0;
    }
    return Math.round((this.state.endTime - this.state.startTime) / 1000);
  }

  /**
   * Check if a scene is unlocked
   */
  isSceneUnlocked(sceneId: string): boolean {
    const scene = SCENE_LIBRARY.find((s) => s.id === sceneId);
    if (!scene) return false;
    if (scene.unlocked) return true;

    const stats = this.loadGameStats();

    // Check completion requirement
    if (scene.requiredCompletions) {
      return stats.gamesCompleted >= scene.requiredCompletions;
    }

    // Check star requirement
    if (scene.requiredStars) {
      return stats.starsEarned >= scene.requiredStars;
    }

    return false;
  }

  /**
   * Get unlocked scenes
   */
  getUnlockedScenes(): ScenePair[] {
    return SCENE_LIBRARY.filter(
      (scene) => scene.unlocked || this.isSceneUnlocked(scene.id)
    );
  }

  /**
   * Check and unlock achievements
   */
  private checkAchievements(): void {
    const stats = this.loadGameStats();

    // Eagle Eye: Complete first game
    if (stats.gamesCompleted === 1) {
      this.unlockAchievement('eagle-eye', 'Adlerauge', 'Erstes Spiel abgeschlossen!');
    }

    // Detail Detective: Find 50 differences total
    if (stats.totalDifferencesFound >= 50) {
      this.unlockAchievement(
        'detail-detective',
        'Detail-Detektiv',
        '50 Unterschiede gefunden!'
      );
    }

    // Perfect Vision: Complete 5 games with 3 stars
    if (stats.perfectGames >= 5) {
      this.unlockAchievement(
        'perfect-vision',
        'Perfekte Sicht',
        '5 Spiele mit 3 Sternen!'
      );
    }

    // Speed Demon: Complete hard scene in under 60 seconds
    if (
      this.state.difficulty === 'hard' &&
      this.getGameDuration() < 60 &&
      this.state.stars === 3
    ) {
      this.unlockAchievement(
        'speed-demon',
        'Schnell wie der Blitz',
        'Schweres Level in unter 60 Sekunden!'
      );
    }

    // No Hints Hero: Complete 10 games without using hints
    const gamesWithoutHints = this.state.hintsUsed === 0 ? 1 : 0;
    if (gamesWithoutHints >= 10) {
      this.unlockAchievement(
        'no-hints-hero',
        'Ohne-Hilfe-Held',
        '10 Spiele ohne Hinweise!'
      );
    }
  }

  /**
   * Unlock achievement
   */
  private unlockAchievement(id: string, title: string, description: string): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('achievement-unlocked', {
          detail: { id, title, description, icon: '🏆' },
        })
      );
    }
  }

  /**
   * Save game statistics
   */
  private saveGameStats(completed: boolean): void {
    if (typeof window === 'undefined') return;

    const stats = this.loadGameStats();

    stats.totalGames++;

    if (completed) {
      stats.gamesCompleted++;
      stats.totalDifferencesFound += this.state.foundCount;

      if (this.state.wrongClicks === 0 && this.state.hintsUsed === 0) {
        stats.perfectGames++;
      }

      // Update best time
      const duration = this.getGameDuration();
      const bestTimeKey = `bestTime${
        this.state.difficulty.charAt(0).toUpperCase() + this.state.difficulty.slice(1)
      }` as keyof GameStats;

      const currentBest = stats[bestTimeKey] as number;
      if (currentBest === 0 || duration < currentBest) {
        (stats as any)[bestTimeKey] = duration;
      }

      stats.starsEarned += this.state.stars;
      stats.scenesUnlocked.add(this.state.sceneId);
    }

    stats.totalWrongClicks += this.state.wrongClicks;
    stats.totalHintsUsed += this.state.hintsUsed;

    // Calculate average accuracy
    const totalClicks = this.clickTimestamps.length;
    if (totalClicks > 0) {
      const accuracy = (this.state.foundCount / totalClicks) * 100;
      stats.averageAccuracy =
        (stats.averageAccuracy * (stats.totalGames - 1) + accuracy) /
        stats.totalGames;
    }

    localStorage.setItem(this.storageKey, JSON.stringify({
      ...stats,
      scenesUnlocked: Array.from(stats.scenesUnlocked),
    }));
  }

  /**
   * Load game statistics
   */
  loadGameStats(): GameStats {
    if (typeof window === 'undefined') {
      return this.getDefaultStats();
    }

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      return this.getDefaultStats();
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        scenesUnlocked: new Set(parsed.scenesUnlocked || []),
      };
    } catch (error) {
      console.error('Failed to load game stats:', error);
      return this.getDefaultStats();
    }
  }

  /**
   * Get default statistics
   */
  private getDefaultStats(): GameStats {
    return {
      totalGames: 0,
      gamesCompleted: 0,
      perfectGames: 0,
      totalDifferencesFound: 0,
      totalWrongClicks: 0,
      totalHintsUsed: 0,
      bestTimeEasy: 0,
      bestTimeMedium: 0,
      bestTimeHard: 0,
      averageAccuracy: 0,
      starsEarned: 0,
      scenesUnlocked: new Set(),
      achievements: [],
    };
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Pause/Resume game
   */
  togglePause(): void {
    this.state.isPaused = !this.state.isPaused;
  }

  /**
   * Reset game
   */
  resetGame(): void {
    this.startGame(this.state.sceneId, this.state.mode);
  }
}

// Global instance
export const spotDifferenceGame = new SpotDifferenceGame();
