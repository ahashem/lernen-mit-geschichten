/**
 * Fishing Quiz Game Engine
 * Physics-based fishing simulation with quiz integration
 */

export type DifficultyLevel = 'shallow' | 'medium' | 'deepsea';
export type GameMode = 'relaxed' | 'competitive' | 'night' | 'ice' | 'ocean';

export interface FishType {
  id: string;
  emoji: string;
  name: string;
  rarity: 'common' | 'uncommon' | 'rare';
  speed: number;
  points: number;
  size: number; // 1-3
}

export interface Fish {
  id: string;
  type: FishType;
  x: number;
  y: number;
  direction: 1 | -1; // 1 = left to right, -1 = right to left
  speed: number;
  answer: string;
  isCorrect: boolean;
}

export interface FishingRod {
  x: number;
  y: number;
  lineLength: number;
  hookX: number;
  hookY: number;
  isCasting: boolean;
  isCatching: boolean;
  caughtFish: Fish | null;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: string[];
  correctAnswer: string;
}

export interface GameState {
  mode: GameMode;
  difficulty: DifficultyLevel;
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  timeRemaining: number;
  fishes: Fish[];
  rod: FishingRod;
  questions: QuizQuestion[];
  caughtFishes: FishType[];
  combo: number;
  stars: number;
  gameStartTime: number;
  isPaused: boolean;
  isComplete: boolean;
}

// Fish types collection
export const FISH_TYPES: FishType[] = [
  // Common fish
  { id: 'goldfish', emoji: '🐟', name: 'Goldfish', rarity: 'common', speed: 2, points: 100, size: 1 },
  { id: 'tropical', emoji: '🐠', name: 'Tropical Fish', rarity: 'common', speed: 2.5, points: 100, size: 1 },
  { id: 'blowfish', emoji: '🐡', name: 'Blowfish', rarity: 'uncommon', speed: 3, points: 200, size: 2 },
  { id: 'shark', emoji: '🦈', name: 'Shark', rarity: 'uncommon', speed: 3.5, points: 200, size: 2 },
  { id: 'whale', emoji: '🐳', name: 'Whale', rarity: 'rare', speed: 1.5, points: 500, size: 3 },
  { id: 'squid', emoji: '🦑', name: 'Squid', rarity: 'rare', speed: 4, points: 500, size: 2 },
  { id: 'shrimp', emoji: '🦐', name: 'Shrimp', rarity: 'common', speed: 3, points: 100, size: 1 },
  { id: 'octopus', emoji: '🐙', name: 'Octopus', rarity: 'uncommon', speed: 2, points: 200, size: 2 },
  { id: 'crab', emoji: '🦀', name: 'Crab', rarity: 'common', speed: 1.5, points: 100, size: 1 },
  { id: 'lobster', emoji: '🦞', name: 'Lobster', rarity: 'uncommon', speed: 2, points: 200, size: 2 },
  { id: 'dolphin', emoji: '🐬', name: 'Dolphin', rarity: 'rare', speed: 4.5, points: 500, size: 3 },
  { id: 'seal', emoji: '🦭', name: 'Seal', rarity: 'rare', speed: 3, points: 500, size: 3 },
];

// Difficulty settings
const DIFFICULTY_SETTINGS = {
  shallow: { fishSpeed: 1, questionTime: 45, fishCount: 3 },
  medium: { fishSpeed: 1.5, questionTime: 30, fishCount: 4 },
  deepsea: { fishSpeed: 2.5, questionTime: 20, fishCount: 4 },
};

class FishingGameEngine {
  private state: GameState | null = null;
  private animationFrameId: number | null = null;
  private questionTimerId: number | null = null;
  private fishSpawnTimerId: number | null = null;

  /**
   * Initialize a new fishing game
   */
  startGame(
    questions: QuizQuestion[],
    difficulty: DifficultyLevel = 'medium',
    mode: GameMode = 'relaxed'
  ): void {
    const diffSettings = DIFFICULTY_SETTINGS[difficulty];

    this.state = {
      mode,
      difficulty,
      currentQuestion: 0,
      totalQuestions: Math.min(questions.length, 10),
      score: 0,
      timeRemaining: mode === 'relaxed' ? -1 : diffSettings.questionTime,
      fishes: [],
      rod: {
        x: 400,
        y: 100,
        lineLength: 0,
        hookX: 400,
        hookY: 100,
        isCasting: false,
        isCatching: false,
        caughtFish: null,
      },
      questions: questions.slice(0, 10),
      caughtFishes: [],
      combo: 0,
      stars: 0,
      gameStartTime: Date.now(),
      isPaused: false,
      isComplete: false,
    };

    this.startQuestion();
  }

  /**
   * Start a new question
   */
  private startQuestion(): void {
    if (!this.state) return;

    const question = this.state.questions[this.state.currentQuestion];
    if (!question) {
      this.completeGame();
      return;
    }

    // Clear existing fishes
    this.state.fishes = [];

    // Spawn fishes with answers
    const diffSettings = DIFFICULTY_SETTINGS[this.state.difficulty];
    const fishCount = diffSettings.fishCount;

    // Ensure correct answer is included
    const answers = [...question.answers];
    while (answers.length < fishCount) {
      answers.push(answers[Math.floor(Math.random() * answers.length)]);
    }

    // Shuffle answers
    const shuffled = answers.sort(() => Math.random() - 0.5).slice(0, fishCount);

    // Create fishes
    shuffled.forEach((answer, i) => {
      const fishType = this.getRandomFishType();
      const direction = Math.random() > 0.5 ? 1 : -1;
      const startX = direction === 1 ? -100 : 900;
      const y = 300 + Math.random() * 200 + i * 50;

      this.state!.fishes.push({
        id: `fish-${Date.now()}-${i}`,
        type: fishType,
        x: startX,
        y,
        direction,
        speed: fishType.speed * diffSettings.fishSpeed,
        answer,
        isCorrect: answer === question.correctAnswer,
      });
    });

    // Start question timer
    if (this.state.mode !== 'relaxed') {
      this.startQuestionTimer();
    }

    // Start fish movement animation
    this.startAnimation();
  }

  /**
   * Get random fish type with rarity consideration
   */
  private getRandomFishType(): FishType {
    const rand = Math.random();
    let rarityFilter: string;

    if (rand < 0.7) {
      rarityFilter = 'common';
    } else if (rand < 0.95) {
      rarityFilter = 'uncommon';
    } else {
      rarityFilter = 'rare';
    }

    const filtered = FISH_TYPES.filter((f) => f.rarity === rarityFilter);
    return filtered[Math.floor(Math.random() * filtered.length)];
  }

  /**
   * Start question timer
   */
  private startQuestionTimer(): void {
    if (!this.state) return;

    this.stopQuestionTimer();

    const diffSettings = DIFFICULTY_SETTINGS[this.state.difficulty];
    this.state.timeRemaining = diffSettings.questionTime;

    this.questionTimerId = window.setInterval(() => {
      if (!this.state || this.state.isPaused) return;

      this.state.timeRemaining--;

      if (this.state.timeRemaining <= 0) {
        this.nextQuestion(false);
      }

      this.dispatchEvent('time-update', { timeRemaining: this.state.timeRemaining });
    }, 1000);
  }

  /**
   * Stop question timer
   */
  private stopQuestionTimer(): void {
    if (this.questionTimerId) {
      clearInterval(this.questionTimerId);
      this.questionTimerId = null;
    }
  }

  /**
   * Start animation loop
   */
  private startAnimation(): void {
    if (this.animationFrameId) return;

    const animate = () => {
      if (!this.state || this.state.isPaused) {
        this.animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Update fish positions
      this.state.fishes.forEach((fish) => {
        fish.x += fish.speed * fish.direction;

        // Respawn fish if it goes off screen
        if (fish.direction === 1 && fish.x > 900) {
          fish.x = -100;
        } else if (fish.direction === -1 && fish.x < -100) {
          fish.x = 900;
        }
      });

      // Update fishing rod line (if casting)
      if (this.state.rod.isCasting && !this.state.rod.isCatching) {
        this.state.rod.lineLength += 5;
        this.state.rod.hookY = this.state.rod.y + this.state.rod.lineLength;

        // Check for fish collision
        const caughtFish = this.checkFishCollision();
        if (caughtFish) {
          this.catchFish(caughtFish);
        }

        // Stop if hook reaches bottom
        if (this.state.rod.lineLength > 400) {
          this.state.rod.isCasting = false;
          this.reelIn();
        }
      }

      // Reel in animation
      if (this.state.rod.isCatching) {
        this.state.rod.lineLength -= 10;
        this.state.rod.hookY = this.state.rod.y + this.state.rod.lineLength;

        if (this.state.rod.lineLength <= 0) {
          this.state.rod.isCatching = false;
          this.state.rod.lineLength = 0;
          this.processCatch();
        }
      }

      this.dispatchEvent('animation-frame', { state: this.getState() });
      this.animationFrameId = requestAnimationFrame(animate);
    };

    this.animationFrameId = requestAnimationFrame(animate);
  }

  /**
   * Stop animation
   */
  private stopAnimation(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Update rod position
   */
  updateRodPosition(x: number, y: number): void {
    if (!this.state) return;
    this.state.rod.x = x;
    this.state.rod.hookX = x;
  }

  /**
   * Cast fishing line
   */
  castLine(): void {
    if (!this.state) return;
    if (this.state.rod.isCasting || this.state.rod.isCatching) return;

    this.state.rod.isCasting = true;
    this.state.rod.lineLength = 0;
    this.state.rod.hookY = this.state.rod.y;

    this.dispatchEvent('cast-line', { x: this.state.rod.x });
  }

  /**
   * Check if hook collides with any fish
   */
  private checkFishCollision(): Fish | null {
    if (!this.state) return null;

    const hook = this.state.rod;
    const hitRadius = 30;

    for (const fish of this.state.fishes) {
      const dx = hook.hookX - fish.x;
      const dy = hook.hookY - fish.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < hitRadius) {
        return fish;
      }
    }

    return null;
  }

  /**
   * Catch a fish
   */
  private catchFish(fish: Fish): void {
    if (!this.state) return;

    this.state.rod.isCasting = false;
    this.state.rod.isCatching = true;
    this.state.rod.caughtFish = fish;

    // Remove fish from swimming fishes
    this.state.fishes = this.state.fishes.filter((f) => f.id !== fish.id);

    this.dispatchEvent('fish-caught', { fish });
  }

  /**
   * Reel in without catching
   */
  private reelIn(): void {
    if (!this.state) return;
    this.state.rod.isCatching = true;
  }

  /**
   * Process the caught fish
   */
  private processCatch(): void {
    if (!this.state || !this.state.rod.caughtFish) return;

    const fish = this.state.rod.caughtFish;
    const isCorrect = fish.isCorrect;

    if (isCorrect) {
      // Correct answer
      let points = fish.type.points;

      // Apply rarity bonus
      if (fish.type.rarity === 'rare') {
        points *= 2;
      }

      // Apply combo bonus
      this.state.combo++;
      if (this.state.combo >= 3) {
        points = Math.floor(points * 1.5);
      }

      // Speed bonus (if caught quickly)
      const diffSettings = DIFFICULTY_SETTINGS[this.state.difficulty];
      if (this.state.timeRemaining > diffSettings.questionTime * 0.7) {
        points += 50;
      }

      this.state.score += points;

      // Add to collection
      if (!this.state.caughtFishes.find((f) => f.id === fish.type.id)) {
        this.state.caughtFishes.push(fish.type);
      }

      this.dispatchEvent('correct-answer', { fish, points, combo: this.state.combo });
      this.nextQuestion(true);
    } else {
      // Wrong answer
      this.state.combo = 0;
      this.dispatchEvent('wrong-answer', { fish });

      // Re-spawn fishes for another attempt
      setTimeout(() => {
        if (this.state) {
          this.state.rod.caughtFish = null;
        }
      }, 1500);
    }
  }

  /**
   * Move to next question
   */
  private nextQuestion(wasCorrect: boolean): void {
    if (!this.state) return;

    this.state.currentQuestion++;
    this.state.rod.caughtFish = null;
    this.state.rod.lineLength = 0;

    if (this.state.currentQuestion >= this.state.totalQuestions) {
      this.completeGame();
    } else {
      this.startQuestion();
    }
  }

  /**
   * Complete the game
   */
  private completeGame(): void {
    if (!this.state) return;

    this.stopAnimation();
    this.stopQuestionTimer();

    const duration = Math.floor((Date.now() - this.state.gameStartTime) / 1000);
    const accuracy = this.state.score > 0 ? (this.state.currentQuestion / this.state.totalQuestions) * 100 : 0;

    // Calculate stars (1-3)
    let stars = 1;
    if (accuracy >= 80 && duration < 180) stars = 3;
    else if (accuracy >= 60) stars = 2;

    this.state.stars = stars;
    this.state.isComplete = true;

    // Bonus for catching all fish types
    if (this.state.caughtFishes.length === FISH_TYPES.length) {
      this.state.score += 500;
    }

    this.dispatchEvent('game-complete', {
      score: this.state.score,
      duration,
      accuracy,
      stars,
      caughtFishes: this.state.caughtFishes,
      totalFishTypes: FISH_TYPES.length,
    });

    // Save to localStorage
    this.saveBestScore();
  }

  /**
   * Save best score
   */
  private saveBestScore(): void {
    if (!this.state) return;

    const key = `fishing-game-best-${this.state.difficulty}`;
    const current = localStorage.getItem(key);
    const currentBest = current ? parseInt(current, 10) : 0;

    if (this.state.score > currentBest) {
      localStorage.setItem(key, this.state.score.toString());
    }
  }

  /**
   * Get best score
   */
  getBestScore(difficulty: DifficultyLevel): number {
    const key = `fishing-game-best-${difficulty}`;
    const best = localStorage.getItem(key);
    return best ? parseInt(best, 10) : 0;
  }

  /**
   * Pause game
   */
  pauseGame(): void {
    if (!this.state) return;
    this.state.isPaused = true;
    this.dispatchEvent('game-paused', {});
  }

  /**
   * Resume game
   */
  resumeGame(): void {
    if (!this.state) return;
    this.state.isPaused = false;
    this.dispatchEvent('game-resumed', {});
  }

  /**
   * Reset game
   */
  resetGame(): void {
    this.stopAnimation();
    this.stopQuestionTimer();

    if (this.state) {
      const questions = this.state.questions;
      const difficulty = this.state.difficulty;
      const mode = this.state.mode;
      this.startGame(questions, difficulty, mode);
    }
  }

  /**
   * Get current game state
   */
  getState(): GameState | null {
    return this.state;
  }

  /**
   * Get current question
   */
  getCurrentQuestion(): QuizQuestion | null {
    if (!this.state) return null;
    return this.state.questions[this.state.currentQuestion] || null;
  }

  /**
   * Get fish collection progress
   */
  getCollectionProgress(): { caught: number; total: number; percentage: number } {
    const total = FISH_TYPES.length;
    const caughtKey = 'fishing-game-collection';
    const saved = localStorage.getItem(caughtKey);
    const caughtIds = saved ? JSON.parse(saved) : [];
    const caught = caughtIds.length;

    return {
      caught,
      total,
      percentage: Math.floor((caught / total) * 100),
    };
  }

  /**
   * Save caught fish to collection
   */
  saveFishToCollection(fishId: string): void {
    const caughtKey = 'fishing-game-collection';
    const saved = localStorage.getItem(caughtKey);
    const caughtIds: string[] = saved ? JSON.parse(saved) : [];

    if (!caughtIds.includes(fishId)) {
      caughtIds.push(fishId);
      localStorage.setItem(caughtKey, JSON.stringify(caughtIds));
    }
  }

  /**
   * Get all caught fish types
   */
  getCaughtFishTypes(): FishType[] {
    const caughtKey = 'fishing-game-collection';
    const saved = localStorage.getItem(caughtKey);
    const caughtIds: string[] = saved ? JSON.parse(saved) : [];

    return FISH_TYPES.filter((fish) => caughtIds.includes(fish.id));
  }

  /**
   * Dispatch custom event
   */
  private dispatchEvent(eventName: string, detail: any): void {
    const event = new CustomEvent(`fishing-game-${eventName}`, { detail });
    window.dispatchEvent(event);
  }
}

// Export singleton instance
export const fishingGame = new FishingGameEngine();
