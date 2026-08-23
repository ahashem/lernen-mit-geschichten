/**
 * Fruit Slicer (Fruit Ninja Style) Quiz Game Engine
 * Fast-paced educational game where children slice fruits with correct answers
 *
 * Features:
 * - Physics-based fruit trajectories with gravity
 * - Swipe gesture recognition (mouse and touch)
 * - Combo system and score multipliers
 * - Power-ups (Slow Motion, Double Points, Shield)
 * - Particle effects for juice splatter
 * - Multiple game modes (Practice, Timed Challenge, Endless)
 * - Quiz integration from stories
 */

import type { Locale } from './i18n';

export type FruitType = 'apple' | 'banana' | 'orange' | 'watermelon' | 'grape' | 'strawberry';
export type GameMode = 'practice' | 'timed' | 'endless';
export type PowerUpType = 'slow-motion' | 'double-points' | 'shield';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface FruitTypeData {
  id: FruitType;
  emoji: string;
  color: string;
  size: number; // 1-3 scale
  juiceColor: string;
}

export interface Fruit {
  id: string;
  type: FruitTypeData;
  x: number;
  y: number;
  vx: number; // velocity x
  vy: number; // velocity y
  rotation: number;
  rotationSpeed: number;
  answer: string;
  isCorrect: boolean;
  sliced: boolean;
  slicedAt?: number;
}

export interface SwipeLine {
  points: { x: number; y: number; time: number }[];
  startTime: number;
  active: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
}

export interface PowerUp {
  type: PowerUpType;
  active: boolean;
  duration: number;
  activatedAt: number;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'truefalse' | 'multiplechoice' | 'fillinblank';
  correctAnswer: string | string[];
  options?: string[];
}

export interface GameState {
  mode: GameMode;
  difficulty: DifficultyLevel;
  score: number;
  highScore: number;
  lives: number;
  maxLives: number;
  currentQuestionIndex: number;
  questionsAnswered: number;
  correctSlices: number;
  wrongSlices: number;
  combo: number;
  maxCombo: number;
  comboMultiplier: number;
  timeRemaining: number;
  fruits: Fruit[];
  particles: Particle[];
  swipeLine: SwipeLine;
  powerUps: PowerUp[];
  isPaused: boolean;
  isGameOver: boolean;
  gameStartTime: number;
  lastSpawnTime: number;
  stars: number;
  xpEarned: number;
}

export interface FruitSlicerSettings {
  spawnInterval: number; // ms between spawns
  maxFruits: number;
  fruitSpeed: number; // multiplier
  gravity: number;
  enableSounds: boolean;
  enableParticles: boolean;
  reducedMotion: boolean;
  particleCount: number;
}

// Fruit type definitions with visual properties
export const FRUIT_TYPES: FruitTypeData[] = [
  { id: 'apple', emoji: '🍎', color: '#FF0000', size: 2, juiceColor: '#FFE5E5' },
  { id: 'banana', emoji: '🍌', color: '#FFFF00', size: 2.5, juiceColor: '#FFFACD' },
  { id: 'orange', emoji: '🍊', color: '#FFA500', size: 2, juiceColor: '#FFE4B5' },
  { id: 'watermelon', emoji: '🍉', color: '#FF6B6B', size: 3, juiceColor: '#FFB6C1' },
  { id: 'grape', emoji: '🍇', color: '#9370DB', size: 1.5, juiceColor: '#E6E6FA' },
  { id: 'strawberry', emoji: '🍓', color: '#FF1493', size: 1.5, juiceColor: '#FFB6C1' },
];

// Difficulty settings
const DIFFICULTY_SETTINGS: Record<DifficultyLevel, FruitSlicerSettings> = {
  easy: {
    spawnInterval: 2000,
    maxFruits: 3,
    fruitSpeed: 0.8,
    gravity: 0.3,
    enableSounds: true,
    enableParticles: true,
    reducedMotion: false,
    particleCount: 15,
  },
  medium: {
    spawnInterval: 1500,
    maxFruits: 4,
    fruitSpeed: 1.0,
    gravity: 0.4,
    enableSounds: true,
    enableParticles: true,
    reducedMotion: false,
    particleCount: 20,
  },
  hard: {
    spawnInterval: 1000,
    maxFruits: 6,
    fruitSpeed: 1.3,
    gravity: 0.5,
    enableSounds: true,
    enableParticles: true,
    reducedMotion: false,
    particleCount: 25,
  },
};

// Game mode configurations
const GAME_MODE_CONFIG = {
  practice: { lives: 3, timeLimit: 0, scoreMultiplier: 1.0 },
  timed: { lives: 3, timeLimit: 120, scoreMultiplier: 1.5 }, // 2 minutes
  endless: { lives: 3, timeLimit: 0, scoreMultiplier: 2.0 },
};

// Scoring constants
const SCORE_CORRECT_SLICE = 10;
const SCORE_WRONG_SLICE_PENALTY = -5;
const COMBO_THRESHOLDS = { x2: 3, x3: 5, x5: 10 };
const POWERUP_BONUS = 20;

// Power-up configurations
const POWERUP_CONFIGS: Record<PowerUpType, { duration: number; icon: string; color: string }> = {
  'slow-motion': { duration: 5000, icon: '⏱️', color: '#4A90E2' },
  'double-points': { duration: 10000, icon: '⭐', color: '#FFD700' },
  shield: { duration: 0, icon: '🛡️', color: '#4CAF50' }, // One-time use
};

class FruitSlicerEngine {
  private state: GameState | null = null;
  private animationFrameId: number | null = null;
  private spawnTimerId: number | null = null;
  private countdownTimerId: number | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private questions: QuizQuestion[] = [];
  private settings: FruitSlicerSettings;
  private currentQuestion: QuizQuestion | null = null;
  private onScoreChange?: (score: number) => void;
  private onComboChange?: (combo: number) => void;
  private onGameOver?: (finalScore: number, stats: any) => void;

  constructor() {
    this.settings = DIFFICULTY_SETTINGS.medium;
  }

  /**
   * Initialize a new fruit slicing game
   */
  startGame(
    canvas: HTMLCanvasElement,
    questions: QuizQuestion[],
    mode: GameMode = 'practice',
    difficulty: DifficultyLevel = 'medium',
  ): void {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.questions = questions;
    this.settings = DIFFICULTY_SETTINGS[difficulty];

    if (!this.ctx) {
      throw new Error('Could not get canvas context');
    }

    const modeConfig = GAME_MODE_CONFIG[mode];
    const savedHighScore = this.loadHighScore(mode);

    this.state = {
      mode,
      difficulty,
      score: 0,
      highScore: savedHighScore,
      lives: modeConfig.lives,
      maxLives: modeConfig.lives,
      currentQuestionIndex: 0,
      questionsAnswered: 0,
      correctSlices: 0,
      wrongSlices: 0,
      combo: 0,
      maxCombo: 0,
      comboMultiplier: 1,
      timeRemaining: modeConfig.timeLimit,
      fruits: [],
      particles: [],
      swipeLine: { points: [], startTime: 0, active: false },
      powerUps: this.initializePowerUps(),
      isPaused: false,
      isGameOver: false,
      gameStartTime: Date.now(),
      lastSpawnTime: Date.now(),
      stars: 0,
      xpEarned: 0,
    };

    this.loadNextQuestion();
    this.setupInputHandlers();
    this.startGameLoop();
    this.startFruitSpawner();

    if (modeConfig.timeLimit > 0) {
      this.startCountdown();
    }
  }

  /**
   * Initialize power-ups
   */
  private initializePowerUps(): PowerUp[] {
    return Object.entries(POWERUP_CONFIGS).map(([type, config]) => ({
      type: type as PowerUpType,
      active: false,
      duration: config.duration,
      activatedAt: 0,
      icon: config.icon,
    }));
  }

  /**
   * Load next quiz question
   */
  private loadNextQuestion(): void {
    if (!this.state || this.state.currentQuestionIndex >= this.questions.length) {
      this.currentQuestion = null;
      return;
    }

    this.currentQuestion = this.questions[this.state.currentQuestionIndex];
  }

  /**
   * Setup input handlers for swipe gestures
   */
  private setupInputHandlers(): void {
    if (!this.canvas) return;

    // Mouse events
    this.canvas.addEventListener('mousedown', this.handleSwipeStart.bind(this));
    this.canvas.addEventListener('mousemove', this.handleSwipeMove.bind(this));
    this.canvas.addEventListener('mouseup', this.handleSwipeEnd.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleSwipeEnd.bind(this));

    // Touch events
    this.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    this.canvas.addEventListener('touchcancel', this.handleTouchEnd.bind(this));

    // Keyboard shortcuts (accessibility)
    document.addEventListener('keydown', this.handleKeyboard.bind(this));
  }

  /**
   * Handle swipe start
   */
  private handleSwipeStart(e: MouseEvent): void {
    if (!this.state || this.state.isPaused || this.state.isGameOver) return;

    const rect = this.canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.state.swipeLine = {
      points: [{ x, y, time: Date.now() }],
      startTime: Date.now(),
      active: true,
    };
  }

  /**
   * Handle swipe move
   */
  private handleSwipeMove(e: MouseEvent): void {
    if (!this.state || !this.state.swipeLine.active) return;

    const rect = this.canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    this.state.swipeLine.points.push({ x, y, time: Date.now() });

    // Keep only recent points (for trail effect)
    if (this.state.swipeLine.points.length > 20) {
      this.state.swipeLine.points.shift();
    }

    // Check for fruit intersections
    this.checkFruitSlicing();
  }

  /**
   * Handle swipe end
   */
  private handleSwipeEnd(): void {
    if (!this.state) return;
    this.state.swipeLine.active = false;

    // Clear swipe line after a short delay
    setTimeout(() => {
      if (this.state) {
        this.state.swipeLine.points = [];
      }
    }, 300);
  }

  /**
   * Handle touch start
   */
  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    if (!this.state || this.state.isPaused || this.state.isGameOver) return;

    const rect = this.canvas!.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    this.state.swipeLine = {
      points: [{ x, y, time: Date.now() }],
      startTime: Date.now(),
      active: true,
    };
  }

  /**
   * Handle touch move
   */
  private handleTouchMove(e: TouchEvent): void {
    e.preventDefault();
    if (!this.state || !this.state.swipeLine.active) return;

    const rect = this.canvas!.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    this.state.swipeLine.points.push({ x, y, time: Date.now() });

    if (this.state.swipeLine.points.length > 20) {
      this.state.swipeLine.points.shift();
    }

    this.checkFruitSlicing();
  }

  /**
   * Handle touch end
   */
  private handleTouchEnd(): void {
    this.handleSwipeEnd();
  }

  /**
   * Handle keyboard shortcuts (accessibility)
   */
  private handleKeyboard(e: KeyboardEvent): void {
    if (!this.state || this.state.isGameOver) return;

    switch (e.key) {
      case ' ':
      case 'Escape':
        this.togglePause();
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
        this.sliceInDirection('up');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        this.sliceInDirection('down');
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        this.sliceInDirection('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        this.sliceInDirection('right');
        break;
    }
  }

  /**
   * Slice fruits in a given direction (keyboard accessibility)
   */
  private sliceInDirection(direction: 'up' | 'down' | 'left' | 'right'): void {
    if (!this.state) return;

    const centerX = this.canvas!.width / 2;
    const centerY = this.canvas!.height / 2;

    // Create virtual swipe line based on direction
    const swipeDistance = 200;
    let startX = centerX,
      startY = centerY,
      endX = centerX,
      endY = centerY;

    switch (direction) {
      case 'up':
        startY = centerY + swipeDistance / 2;
        endY = centerY - swipeDistance / 2;
        break;
      case 'down':
        startY = centerY - swipeDistance / 2;
        endY = centerY + swipeDistance / 2;
        break;
      case 'left':
        startX = centerX + swipeDistance / 2;
        endX = centerX - swipeDistance / 2;
        break;
      case 'right':
        startX = centerX - swipeDistance / 2;
        endX = centerX + swipeDistance / 2;
        break;
    }

    // Simulate swipe line
    this.state.swipeLine = {
      points: [
        { x: startX, y: startY, time: Date.now() },
        { x: endX, y: endY, time: Date.now() },
      ],
      startTime: Date.now(),
      active: true,
    };

    this.checkFruitSlicing();

    setTimeout(() => {
      if (this.state) {
        this.state.swipeLine.active = false;
        this.state.swipeLine.points = [];
      }
    }, 100);
  }

  /**
   * Check if swipe line intersects with any fruits
   */
  private checkFruitSlicing(): void {
    if (!this.state || this.state.swipeLine.points.length < 2) return;

    const points = this.state.swipeLine.points;
    const lastPoint = points[points.length - 1];
    const prevPoint = points[points.length - 2];

    this.state.fruits.forEach((fruit) => {
      if (fruit.sliced) return;

      // Check line-circle intersection
      if (this.lineIntersectsCircle(prevPoint, lastPoint, fruit)) {
        this.sliceFruit(fruit);
      }
    });
  }

  /**
   * Check if a line segment intersects with a circular fruit
   */
  private lineIntersectsCircle(
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    fruit: Fruit,
  ): boolean {
    const radius = 30 * fruit.type.size;

    // Vector from p1 to p2
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // Vector from p1 to circle center
    const fx = fruit.x - p1.x;
    const fy = fruit.y - p1.y;

    // Projection of f onto line direction
    const t = Math.max(0, Math.min(1, (fx * dx + fy * dy) / (dx * dx + dy * dy)));

    // Closest point on line segment
    const closestX = p1.x + t * dx;
    const closestY = p1.y + t * dy;

    // Distance from closest point to circle center
    const distanceSquared = (closestX - fruit.x) ** 2 + (closestY - fruit.y) ** 2;

    return distanceSquared <= radius * radius;
  }

  /**
   * Slice a fruit and handle scoring
   */
  private sliceFruit(fruit: Fruit): void {
    if (!this.state || fruit.sliced) return;

    fruit.sliced = true;
    fruit.slicedAt = Date.now();

    // Play sound effect
    if (this.settings.enableSounds) {
      this.playSliceSound(fruit.isCorrect);
    }

    // Create particle effect
    if (this.settings.enableParticles && !this.settings.reducedMotion) {
      this.createParticleExplosion(fruit);
    }

    // Handle scoring
    if (fruit.isCorrect) {
      this.handleCorrectSlice();
    } else {
      this.handleWrongSlice();
    }

    // Remove fruit after animation
    setTimeout(() => {
      if (this.state) {
        this.state.fruits = this.state.fruits.filter((f) => f.id !== fruit.id);
      }
    }, 500);
  }

  /**
   * Handle correct fruit slice
   */
  private handleCorrectSlice(): void {
    if (!this.state) return;

    this.state.correctSlices++;
    this.state.combo++;
    this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo);

    // Update combo multiplier
    if (this.state.combo >= COMBO_THRESHOLDS.x5) {
      this.state.comboMultiplier = 5;
    } else if (this.state.combo >= COMBO_THRESHOLDS.x3) {
      this.state.comboMultiplier = 3;
    } else if (this.state.combo >= COMBO_THRESHOLDS.x2) {
      this.state.comboMultiplier = 2;
    } else {
      this.state.comboMultiplier = 1;
    }

    // Calculate score with multipliers
    let points = SCORE_CORRECT_SLICE * this.state.comboMultiplier;

    // Apply double points power-up
    const doublePoints = this.state.powerUps.find((p) => p.type === 'double-points' && p.active);
    if (doublePoints) {
      points *= 2;
    }

    this.state.score += points;

    if (this.onScoreChange) {
      this.onScoreChange(this.state.score);
    }

    if (this.onComboChange) {
      this.onComboChange(this.state.combo);
    }

    // Check if question is answered
    this.checkQuestionCompletion();
  }

  /**
   * Handle wrong fruit slice
   */
  private handleWrongSlice(): void {
    if (!this.state) return;

    this.state.wrongSlices++;
    this.state.combo = 0;
    this.state.comboMultiplier = 1;

    // Check shield power-up
    const shield = this.state.powerUps.find((p) => p.type === 'shield' && p.active);
    if (shield) {
      // Shield protects from penalty
      shield.active = false;
      return;
    }

    // Apply penalty
    this.state.score = Math.max(0, this.state.score + SCORE_WRONG_SLICE_PENALTY);
    this.state.lives--;

    if (this.onScoreChange) {
      this.onScoreChange(this.state.score);
    }

    if (this.onComboChange) {
      this.onComboChange(0);
    }

    // Check game over
    if (this.state.lives <= 0) {
      this.endGame();
    }
  }

  /**
   * Check if current question is completed
   */
  private checkQuestionCompletion(): void {
    if (!this.state || !this.currentQuestion) return;

    // Check if all correct fruits for this question are sliced
    const correctFruitsRemaining = this.state.fruits.filter(
      (f) => f.isCorrect && !f.sliced,
    ).length;

    if (correctFruitsRemaining === 0) {
      this.state.questionsAnswered++;
      this.state.currentQuestionIndex++;
      this.loadNextQuestion();

      // Bonus stars for completing question
      this.state.stars += 5;
    }
  }

  /**
   * Create particle explosion effect
   */
  private createParticleExplosion(fruit: Fruit): void {
    if (!this.state) return;

    const particleCount = this.settings.particleCount;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.5;
      const speed = 2 + Math.random() * 4;

      this.state.particles.push({
        x: fruit.x,
        y: fruit.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: fruit.type.juiceColor,
        size: 2 + Math.random() * 4,
        life: 1.0,
        maxLife: 0.5 + Math.random() * 0.5,
      });
    }
  }

  /**
   * Start fruit spawner
   */
  private startFruitSpawner(): void {
    const spawn = () => {
      if (!this.state || this.state.isPaused || this.state.isGameOver) {
        this.spawnTimerId = window.setTimeout(spawn, this.settings.spawnInterval);
        return;
      }

      const now = Date.now();
      if (now - this.state.lastSpawnTime >= this.settings.spawnInterval) {
        this.spawnFruit();
        this.state.lastSpawnTime = now;
      }

      this.spawnTimerId = window.setTimeout(spawn, 100);
    };

    spawn();
  }

  /**
   * Spawn a new fruit
   */
  private spawnFruit(): void {
    if (
      !this.state ||
      !this.currentQuestion ||
      this.state.fruits.length >= this.settings.maxFruits
    ) {
      return;
    }

    const canvasWidth = this.canvas!.width;
    const canvasHeight = this.canvas!.height;

    // Random spawn position along bottom
    const x = 50 + Math.random() * (canvasWidth - 100);
    const y = canvasHeight + 50;

    // Random initial velocity (upward arc)
    const targetX = canvasWidth / 2 + (Math.random() - 0.5) * canvasWidth * 0.5;
    const timeToTarget = 1.5 + Math.random() * 0.5; // seconds
    const vx = ((targetX - x) / timeToTarget / 60) * this.settings.fruitSpeed;
    const vy = (-12 - Math.random() * 5) * this.settings.fruitSpeed;

    // Choose random fruit type
    const fruitType = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)];

    // Determine if this is a correct or wrong answer
    const isCorrect = Math.random() > 0.5;
    let answer: string;

    if (isCorrect) {
      if (Array.isArray(this.currentQuestion.correctAnswer)) {
        answer = this.currentQuestion.correctAnswer[0];
      } else {
        answer = this.currentQuestion.correctAnswer;
      }
    } else {
      // Get a wrong answer
      if (this.currentQuestion.options && this.currentQuestion.options.length > 0) {
        const wrongOptions = this.currentQuestion.options.filter(
          (opt) => opt !== this.currentQuestion!.correctAnswer,
        );
        answer = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] || 'Wrong';
      } else {
        answer = 'Wrong';
      }
    }

    const fruit: Fruit = {
      id: `fruit-${Date.now()}-${Math.random()}`,
      type: fruitType,
      x,
      y,
      vx,
      vy,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      answer,
      isCorrect,
      sliced: false,
    };

    this.state.fruits.push(fruit);
  }

  /**
   * Start game loop
   */
  private startGameLoop(): void {
    const loop = () => {
      if (!this.state) return;

      if (!this.state.isPaused && !this.state.isGameOver) {
        this.update();
        this.render();
      }

      this.animationFrameId = requestAnimationFrame(loop);
    };

    loop();
  }

  /**
   * Start countdown timer
   */
  private startCountdown(): void {
    const tick = () => {
      if (!this.state || this.state.isPaused || this.state.isGameOver) {
        this.countdownTimerId = window.setTimeout(tick, 1000);
        return;
      }

      this.state.timeRemaining--;

      if (this.state.timeRemaining <= 0) {
        this.endGame();
        return;
      }

      this.countdownTimerId = window.setTimeout(tick, 1000);
    };

    tick();
  }

  /**
   * Update game state
   */
  private update(): void {
    if (!this.state) return;

    const slowMotion = this.state.powerUps.find((p) => p.type === 'slow-motion' && p.active);
    const timeScale = slowMotion ? 0.3 : 1.0;

    // Update fruits
    this.state.fruits.forEach((fruit) => {
      if (fruit.sliced) return;

      // Apply physics
      fruit.x += fruit.vx * timeScale;
      fruit.y += fruit.vy * timeScale;
      fruit.vy += this.settings.gravity * timeScale;
      fruit.rotation += fruit.rotationSpeed * timeScale;

      // Remove fruits that fall off screen
      if (fruit.y > this.canvas!.height + 100) {
        // Missed a fruit - lose combo but not life (unless it was correct)
        if (fruit.isCorrect) {
          this.state!.combo = 0;
          this.state!.comboMultiplier = 1;
          if (this.onComboChange) {
            this.onComboChange(0);
          }
        }
      }
    });

    // Remove off-screen fruits
    this.state.fruits = this.state.fruits.filter((f) => f.y < this.canvas!.height + 100);

    // Update particles
    this.state.particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vy += 0.3; // Gravity
      particle.life -= 0.02;
    });

    // Remove dead particles
    this.state.particles = this.state.particles.filter((p) => p.life > 0);

    // Update power-ups
    const now = Date.now();
    this.state.powerUps.forEach((powerUp) => {
      if (powerUp.active && powerUp.duration > 0) {
        const elapsed = now - powerUp.activatedAt;
        if (elapsed >= powerUp.duration) {
          powerUp.active = false;
        }
      }
    });
  }

  /**
   * Render game
   */
  private render(): void {
    if (!this.ctx || !this.canvas || !this.state) return;

    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render background gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Render particles
    this.renderParticles();

    // Render fruits
    this.renderFruits();

    // Render swipe trail
    this.renderSwipeTrail();

    // Render question
    this.renderQuestion();

    // Render UI
    this.renderUI();
  }

  /**
   * Render particles
   */
  private renderParticles(): void {
    if (!this.ctx || !this.state) return;

    this.state.particles.forEach((particle) => {
      this.ctx!.save();
      this.ctx!.globalAlpha = particle.life;
      this.ctx!.fillStyle = particle.color;
      this.ctx!.beginPath();
      this.ctx!.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx!.fill();
      this.ctx!.restore();
    });
  }

  /**
   * Render fruits
   */
  private renderFruits(): void {
    if (!this.ctx || !this.state) return;

    this.state.fruits.forEach((fruit) => {
      this.ctx!.save();
      this.ctx!.translate(fruit.x, fruit.y);
      this.ctx!.rotate(fruit.rotation);

      if (fruit.sliced) {
        this.ctx!.globalAlpha = 0.5;
      }

      // Draw fruit emoji
      this.ctx!.font = `${40 * fruit.type.size}px Arial`;
      this.ctx!.textAlign = 'center';
      this.ctx!.textBaseline = 'middle';
      this.ctx!.fillText(fruit.type.emoji, 0, 0);

      // Draw answer text
      this.ctx!.font = '14px Arial';
      this.ctx!.fillStyle = '#000';
      this.ctx!.fillText(fruit.answer, 0, 40 * fruit.type.size);

      this.ctx!.restore();
    });
  }

  /**
   * Render swipe trail
   */
  private renderSwipeTrail(): void {
    if (!this.ctx || !this.state || this.state.swipeLine.points.length < 2) return;

    this.ctx.save();
    this.ctx.strokeStyle = '#FFD700';
    this.ctx.lineWidth = 5;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = '#FFD700';

    this.ctx.beginPath();
    const points = this.state.swipeLine.points;
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * Render current question
   */
  private renderQuestion(): void {
    if (!this.ctx || !this.canvas || !this.currentQuestion) return;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    this.ctx.fillRect(20, 20, this.canvas.width - 40, 60);
    this.ctx.strokeStyle = '#4A90E2';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(20, 20, this.canvas.width - 40, 60);

    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 20px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.currentQuestion.text, this.canvas.width / 2, 55);
    this.ctx.restore();
  }

  /**
   * Render UI elements
   */
  private renderUI(): void {
    if (!this.ctx || !this.canvas || !this.state) return;

    const padding = 20;

    // Score
    this.ctx.save();
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillStyle = '#333';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.state.score}`, padding, this.canvas.height - padding - 60);

    // Combo
    if (this.state.combo > 1) {
      this.ctx.font = 'bold 32px Arial';
      this.ctx.fillStyle = '#FFD700';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        `${this.state.combo}x COMBO!`,
        this.canvas.width / 2,
        this.canvas.height - padding - 80,
      );
    }

    // Lives
    this.ctx.font = '30px Arial';
    this.ctx.textAlign = 'right';
    for (let i = 0; i < this.state.lives; i++) {
      this.ctx.fillText('❤️', this.canvas.width - padding - i * 40, this.canvas.height - padding);
    }

    // Timer (if applicable)
    if (this.state.timeRemaining > 0) {
      this.ctx.font = 'bold 24px Arial';
      this.ctx.fillStyle = this.state.timeRemaining <= 10 ? '#FF0000' : '#333';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(
        `Time: ${this.state.timeRemaining}s`,
        this.canvas.width - padding,
        this.canvas.height - padding - 60,
      );
    }

    // Power-ups
    this.renderPowerUps();

    this.ctx.restore();
  }

  /**
   * Render active power-ups
   */
  private renderPowerUps(): void {
    if (!this.ctx || !this.canvas || !this.state) return;

    const activePowerUps = this.state.powerUps.filter((p) => p.active);
    const startX = this.canvas.width / 2 - (activePowerUps.length * 50) / 2;
    const y = this.canvas.height - 140;

    activePowerUps.forEach((powerUp, index) => {
      const x = startX + index * 60;
      const config = POWERUP_CONFIGS[powerUp.type];

      // Draw power-up icon
      this.ctx!.save();
      this.ctx!.font = '30px Arial';
      this.ctx!.textAlign = 'center';
      this.ctx!.fillText(powerUp.icon, x, y);

      // Draw timer bar
      if (powerUp.duration > 0) {
        const elapsed = Date.now() - powerUp.activatedAt;
        const remaining = Math.max(0, powerUp.duration - elapsed);
        const progress = remaining / powerUp.duration;

        this.ctx!.fillStyle = config.color;
        this.ctx!.fillRect(x - 20, y + 10, 40 * progress, 5);
      }

      this.ctx!.restore();
    });
  }

  /**
   * Activate power-up
   */
  activatePowerUp(type: PowerUpType): boolean {
    if (!this.state) return false;

    const powerUp = this.state.powerUps.find((p) => p.type === type);
    if (!powerUp || powerUp.active) return false;

    powerUp.active = true;
    powerUp.activatedAt = Date.now();

    this.state.score += POWERUP_BONUS;

    if (this.settings.enableSounds) {
      this.playPowerUpSound();
    }

    return true;
  }

  /**
   * Toggle pause
   */
  togglePause(): void {
    if (!this.state || this.state.isGameOver) return;
    this.state.isPaused = !this.state.isPaused;
  }

  /**
   * End game
   */
  private endGame(): void {
    if (!this.state) return;

    this.state.isGameOver = true;

    // Calculate final stats
    const playTime = Math.floor((Date.now() - this.state.gameStartTime) / 1000);
    const accuracy =
      this.state.correctSlices + this.state.wrongSlices > 0
        ? Math.floor((this.state.correctSlices / (this.state.correctSlices + this.state.wrongSlices)) * 100)
        : 0;

    // Calculate stars earned
    const baseStars = Math.floor(this.state.score / 100);
    const comboBonus = Math.floor(this.state.maxCombo / 5);
    this.state.stars = Math.min(100, baseStars + comboBonus + this.state.stars);

    // Calculate XP
    this.state.xpEarned = Math.floor(this.state.score / 10) + this.state.stars * 5;

    // Save high score
    if (this.state.score > this.state.highScore) {
      this.saveHighScore(this.state.mode, this.state.score);
    }

    // Clean up
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.spawnTimerId) {
      clearTimeout(this.spawnTimerId);
    }
    if (this.countdownTimerId) {
      clearTimeout(this.countdownTimerId);
    }

    // Trigger game over callback
    if (this.onGameOver) {
      this.onGameOver(this.state.score, {
        correctSlices: this.state.correctSlices,
        wrongSlices: this.state.wrongSlices,
        maxCombo: this.state.maxCombo,
        accuracy,
        playTime,
        stars: this.state.stars,
        xp: this.state.xpEarned,
      });
    }
  }

  /**
   * Stop game and clean up
   */
  stopGame(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    if (this.spawnTimerId) {
      clearTimeout(this.spawnTimerId);
    }
    if (this.countdownTimerId) {
      clearTimeout(this.countdownTimerId);
    }

    this.state = null;
  }

  /**
   * Get current game state
   */
  getState(): GameState | null {
    return this.state;
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks: {
    onScoreChange?: (score: number) => void;
    onComboChange?: (combo: number) => void;
    onGameOver?: (finalScore: number, stats: any) => void;
  }): void {
    this.onScoreChange = callbacks.onScoreChange;
    this.onComboChange = callbacks.onComboChange;
    this.onGameOver = callbacks.onGameOver;
  }

  /**
   * Play slice sound
   */
  private playSliceSound(isCorrect: boolean): void {
    // To be implemented with Web Audio API or audio elements
    console.log(`Slice sound: ${isCorrect ? 'correct' : 'wrong'}`);
  }

  /**
   * Play power-up sound
   */
  private playPowerUpSound(): void {
    console.log('Power-up activated sound');
  }

  /**
   * Load high score from localStorage
   */
  private loadHighScore(mode: GameMode): number {
    try {
      const saved = localStorage.getItem(`fruit-slicer-highscore-${mode}`);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Save high score to localStorage
   */
  private saveHighScore(mode: GameMode, score: number): void {
    try {
      localStorage.setItem(`fruit-slicer-highscore-${mode}`, score.toString());
    } catch (e) {
      console.error('Failed to save high score:', e);
    }
  }
}

// Export singleton instance
export const fruitSlicerEngine = new FruitSlicerEngine();
