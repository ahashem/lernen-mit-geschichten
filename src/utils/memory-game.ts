/**
 * Memory Card Matching Game Logic
 * Educational memory game using story characters with flip animations, scoring, and achievements
 */

import { soundEffects } from './sound-effects';
import { confetti } from './confetti';
import { achievementTracker } from './achievements';
import { starWallet } from './star-wallet';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type GameMode = 'single' | 'multiplayer';

export interface MemoryCard {
  id: string;
  emoji: string;
  characterName: string;
  storyId: string;
  matched: boolean;
  flipped: boolean;
  position: number;
}

export interface Player {
  id: number;
  name: string;
  score: number;
  matches: number;
  currentTurn: boolean;
}

export interface GameState {
  cards: MemoryCard[];
  flippedCards: MemoryCard[];
  moves: number;
  matches: number;
  totalPairs: number;
  startTime: number | null;
  endTime: number | null;
  difficulty: DifficultyLevel;
  gameMode: GameMode;
  players: Player[];
  currentPlayer: number;
  isProcessing: boolean;
  bestTime: number | null;
  stars: number;
}

export interface GameStats {
  totalGames: number;
  gamesWon: number;
  bestTime: number;
  perfectGames: number;
  totalMoves: number;
  averageMoves: number;
  starsEarned: number;
}

// Character card sets (unlocked through story completion)
export const CHARACTER_SETS = {
  basic: [
    { emoji: '🐻', name: 'Bruno', storyId: '001-bruno' },
    { emoji: '🦊', name: 'Fritz', storyId: '002-fritz' },
    { emoji: '🐰', name: 'Lina', storyId: '003-lina' },
    { emoji: '🐸', name: 'Tobi', storyId: '004-tobi' },
    { emoji: '🎈', name: 'Mila', storyId: '005-mila' },
    { emoji: '🐭', name: 'Moritz', storyId: '006-moritz' },
    { emoji: '🦁', name: 'Leo', storyId: '010-leo' },
    { emoji: '⏰', name: 'Timmi', storyId: '018-timmi-zauberuhr' },
  ],
  animals: [
    { emoji: '🦕', name: 'Dino', storyId: '008-dino' },
    { emoji: '🦉', name: 'Eule', storyId: '015-eule' },
    { emoji: '🐿️', name: 'Finn', storyId: '019-finn' },
    { emoji: '🦔', name: 'Igel', storyId: '016-igel' },
  ],
  nature: [
    { emoji: '🌳', name: 'Baum', storyId: '024-baum' },
    { emoji: '🌻', name: 'Blume', storyId: '025-blume' },
    { emoji: '🌈', name: 'Regenbogen', storyId: '026-regenbogen' },
    { emoji: '⭐', name: 'Stern', storyId: '027-stern' },
  ],
};

// Difficulty configurations
export const DIFFICULTY_CONFIG = {
  easy: { pairs: 4, gridCols: 4, timeLimit: null, perfectMoves: 12 },
  medium: { pairs: 8, gridCols: 4, timeLimit: null, perfectMoves: 24 },
  hard: { pairs: 12, gridCols: 6, timeLimit: null, perfectMoves: 36 },
};

export class MemoryGame {
  private state: GameState;
  private storageKey = 'memory-game-stats';
  private unlockedSets: Set<string> = new Set(['basic']);

  constructor() {
    this.state = this.getInitialState();
    this.loadUnlockedSets();
  }

  private getInitialState(): GameState {
    return {
      cards: [],
      flippedCards: [],
      moves: 0,
      matches: 0,
      totalPairs: 0,
      startTime: null,
      endTime: null,
      difficulty: 'easy',
      gameMode: 'single',
      players: [{ id: 1, name: 'Player 1', score: 0, matches: 0, currentTurn: true }],
      currentPlayer: 0,
      isProcessing: false,
      bestTime: null,
      stars: 0,
    };
  }

  private loadUnlockedSets(): void {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem('memory-game-unlocked-sets');
    if (saved) {
      try {
        const sets = JSON.parse(saved);
        this.unlockedSets = new Set(sets);
      } catch (error) {
        console.error('Failed to load unlocked sets:', error);
      }
    }
  }

  private saveUnlockedSets(): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem('memory-game-unlocked-sets', JSON.stringify(Array.from(this.unlockedSets)));
  }

  /**
   * Initialize a new game
   */
  startGame(
    difficulty: DifficultyLevel = 'easy',
    mode: GameMode = 'single',
    playerNames?: string[]
  ): void {
    const config = DIFFICULTY_CONFIG[difficulty];

    // Setup players
    const players: Player[] = mode === 'multiplayer' && playerNames
      ? playerNames.map((name, i) => ({
          id: i + 1,
          name,
          score: 0,
          matches: 0,
          currentTurn: i === 0,
        }))
      : [{ id: 1, name: 'Player 1', score: 0, matches: 0, currentTurn: true }];

    // Get available characters
    const availableCharacters = this.getAvailableCharacters();
    const selectedCharacters = this.selectRandomCharacters(availableCharacters, config.pairs);

    // Create card pairs
    const cards = this.createCardPairs(selectedCharacters);

    // Shuffle cards
    this.shuffleArray(cards);

    // Assign positions
    cards.forEach((card, index) => {
      card.position = index;
    });

    this.state = {
      cards,
      flippedCards: [],
      moves: 0,
      matches: 0,
      totalPairs: config.pairs,
      startTime: Date.now(),
      endTime: null,
      difficulty,
      gameMode: mode,
      players,
      currentPlayer: 0,
      isProcessing: false,
      bestTime: this.loadBestTime(difficulty),
      stars: 0,
    };

    soundEffects.playMagicSparkle();
  }

  /**
   * Get available characters based on unlocked sets
   */
  private getAvailableCharacters() {
    const characters = [];

    for (const [setName, setCharacters] of Object.entries(CHARACTER_SETS)) {
      if (this.unlockedSets.has(setName)) {
        characters.push(...setCharacters);
      }
    }

    return characters;
  }

  /**
   * Select random characters for the game
   */
  private selectRandomCharacters(
    available: typeof CHARACTER_SETS.basic,
    count: number
  ) {
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  }

  /**
   * Create card pairs from characters
   */
  private createCardPairs(characters: typeof CHARACTER_SETS.basic): MemoryCard[] {
    const cards: MemoryCard[] = [];

    characters.forEach((char, index) => {
      // Create two cards for each character (a pair)
      for (let i = 0; i < 2; i++) {
        cards.push({
          id: `${char.storyId}-${index}-${i}`,
          emoji: char.emoji,
          characterName: char.name,
          storyId: char.storyId,
          matched: false,
          flipped: false,
          position: 0,
        });
      }
    });

    return cards;
  }

  /**
   * Shuffle array in place (Fisher-Yates algorithm)
   */
  private shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Handle card flip
   */
  flipCard(cardId: string): boolean {
    if (this.state.isProcessing) return false;

    const card = this.state.cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return false;

    // Flip the card
    card.flipped = true;
    this.state.flippedCards.push(card);

    soundEffects.playClick();

    // Check if two cards are flipped
    if (this.state.flippedCards.length === 2) {
      this.state.isProcessing = true;
      this.state.moves++;

      // Check for match after a short delay
      setTimeout(() => {
        this.checkMatch();
      }, 600);
    }

    return true;
  }

  /**
   * Check if flipped cards match
   */
  private checkMatch(): void {
    const [card1, card2] = this.state.flippedCards;

    if (card1.emoji === card2.emoji && card1.storyId === card2.storyId) {
      // Match found!
      card1.matched = true;
      card2.matched = true;
      this.state.matches++;

      // Award points to current player
      const currentPlayer = this.state.players[this.state.currentPlayer];
      currentPlayer.matches++;
      currentPlayer.score += this.calculateMatchPoints();

      soundEffects.playCorrect();
      confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 30);

      // Check if game is complete
      if (this.state.matches === this.state.totalPairs) {
        this.completeGame();
      }

      // In multiplayer, successful match means another turn
      if (this.state.gameMode === 'multiplayer') {
        // Current player gets another turn
      }
    } else {
      // No match
      card1.flipped = false;
      card2.flipped = false;

      soundEffects.playIncorrect();

      // In multiplayer, switch to next player
      if (this.state.gameMode === 'multiplayer') {
        this.nextPlayer();
      }
    }

    // Reset flipped cards
    this.state.flippedCards = [];
    this.state.isProcessing = false;
  }

  /**
   * Calculate points for a match
   */
  private calculateMatchPoints(): number {
    const basePoints = 100;
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.5,
      hard: 2,
    }[this.state.difficulty];

    return Math.round(basePoints * difficultyMultiplier);
  }

  /**
   * Switch to next player in multiplayer mode
   */
  private nextPlayer(): void {
    this.state.players[this.state.currentPlayer].currentTurn = false;
    this.state.currentPlayer = (this.state.currentPlayer + 1) % this.state.players.length;
    this.state.players[this.state.currentPlayer].currentTurn = true;
  }

  /**
   * Complete the game
   */
  private completeGame(): void {
    this.state.endTime = Date.now();

    const duration = this.getGameDuration();
    const stars = this.calculateStars();
    this.state.stars = stars;

    // Save best time
    this.saveBestTime(this.state.difficulty, duration);

    // Award stars
    starWallet.earnStars('memory-game-complete', stars * 5);

    // Check for achievements
    this.checkAchievements();

    // Save stats
    this.saveGameStats();

    // Celebration
    soundEffects.playCompletion();
    confetti.fireworks(5, 300);

    // Show completion message after delay
    setTimeout(() => {
      this.showCompletionMessage();
    }, 1000);
  }

  /**
   * Calculate star rating (1-3 stars)
   */
  private calculateStars(): number {
    const config = DIFFICULTY_CONFIG[this.state.difficulty];
    const moveRatio = this.state.moves / config.perfectMoves;

    if (moveRatio <= 1) return 3; // Perfect or better
    if (moveRatio <= 1.5) return 2; // Good
    return 1; // Completed
  }

  /**
   * Check and unlock achievements
   */
  private checkAchievements(): void {
    // Memory Master achievement (complete any difficulty with 3 stars)
    if (this.state.stars === 3) {
      this.unlockAchievement('memory-master');
    }

    // Speed Demon achievement (complete hard difficulty in under 2 minutes)
    if (this.state.difficulty === 'hard' && this.getGameDuration() < 120) {
      this.unlockAchievement('speed-demon');
    }

    // Perfect Memory achievement (complete with perfect moves)
    const config = DIFFICULTY_CONFIG[this.state.difficulty];
    if (this.state.moves === config.perfectMoves) {
      this.unlockAchievement('perfect-memory');
    }
  }

  /**
   * Unlock achievement
   */
  private unlockAchievement(achievementId: string): void {
    // Custom memory game achievements would be added to the achievements system
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('memory-achievement-unlocked', {
          detail: { achievementId },
        })
      );
    }
  }

  /**
   * Show completion message
   */
  private showCompletionMessage(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('memory-game-complete', {
          detail: {
            duration: this.getGameDuration(),
            moves: this.state.moves,
            stars: this.state.stars,
            players: this.state.players,
          },
        })
      );
    }
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
   * Get formatted time string
   */
  getFormattedTime(): string {
    const duration = this.state.endTime
      ? this.getGameDuration()
      : Math.round((Date.now() - (this.state.startTime || Date.now())) / 1000);

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  /**
   * Load best time for difficulty
   */
  private loadBestTime(difficulty: DifficultyLevel): number | null {
    if (typeof window === 'undefined') return null;

    const key = `memory-best-time-${difficulty}`;
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : null;
  }

  /**
   * Save best time for difficulty
   */
  private saveBestTime(difficulty: DifficultyLevel, duration: number): void {
    if (typeof window === 'undefined') return;

    const key = `memory-best-time-${difficulty}`;
    const currentBest = this.loadBestTime(difficulty);

    if (!currentBest || duration < currentBest) {
      localStorage.setItem(key, duration.toString());
      this.state.bestTime = duration;
    }
  }

  /**
   * Save game statistics
   */
  private saveGameStats(): void {
    if (typeof window === 'undefined') return;

    const stats = this.loadGameStats();

    stats.totalGames++;
    stats.gamesWon++;
    stats.totalMoves += this.state.moves;
    stats.averageMoves = Math.round(stats.totalMoves / stats.gamesWon);
    stats.starsEarned += this.state.stars;

    if (this.state.stars === 3) {
      stats.perfectGames++;
    }

    const duration = this.getGameDuration();
    if (!stats.bestTime || duration < stats.bestTime) {
      stats.bestTime = duration;
    }

    localStorage.setItem(this.storageKey, JSON.stringify(stats));
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
      return JSON.parse(saved);
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
      gamesWon: 0,
      bestTime: Infinity,
      perfectGames: 0,
      totalMoves: 0,
      averageMoves: 0,
      starsEarned: 0,
    };
  }

  /**
   * Unlock a character set
   */
  unlockSet(setName: string): void {
    this.unlockedSets.add(setName);
    this.saveUnlockedSets();

    soundEffects.playDiscovery();
    confetti.rain(2000);
  }

  /**
   * Check if a set is unlocked
   */
  isSetUnlocked(setName: string): boolean {
    return this.unlockedSets.has(setName);
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Reset the game
   */
  resetGame(): void {
    this.startGame(this.state.difficulty, this.state.gameMode);
  }

  /**
   * Get winner in multiplayer mode
   */
  getWinner(): Player | null {
    if (this.state.gameMode === 'single') return null;

    return this.state.players.reduce((winner, player) =>
      player.score > winner.score ? player : winner
    );
  }
}

// Global instance
export const memoryGame = new MemoryGame();
