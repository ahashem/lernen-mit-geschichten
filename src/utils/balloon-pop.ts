/**
 * Balloon Pop Quiz Game Engine
 * Fun, educational quiz game where children pop balloons with correct answers
 */

export type BalloonColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
export type GameMode = 'practice' | 'timed' | 'survival' | 'speed' | 'multiplayer';
export type PowerUpType = 'slow-motion' | 'freeze-time' | 'extra-time' | 'auto-pop';
export type DifficultyLevel = 'slow' | 'medium' | 'fast';

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'truefalse' | 'multiplechoice' | 'fillinblank';
  correctAnswer: string | string[];
  options?: string[];
}

export interface Balloon {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: BalloonColor;
  answer: string;
  isCorrect: boolean;
  rotation: number;
  rotationSpeed: number;
  wobblePhase: number;
  scale: number;
  popped: boolean;
}

export interface PowerUp {
  type: PowerUpType;
  active: boolean;
  duration: number;
  activatedAt: number;
}

export interface GameState {
  mode: GameMode;
  difficulty: DifficultyLevel;
  score: number;
  lives: number;
  timeRemaining: number;
  currentQuestionIndex: number;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  combo: number;
  maxCombo: number;
  powerUps: PowerUp[];
  isPaused: boolean;
  isGameOver: boolean;
  gameStartTime: number;
  stars: number;
}

export interface BalloonPopSettings {
  balloonSpeed: number;
  spawnInterval: number;
  maxBalloons: number;
  wobbleAmount: number;
  enableSounds: boolean;
  enableParticles: boolean;
}

const BALLOON_COLORS: BalloonColor[] = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

const DIFFICULTY_SETTINGS: Record<DifficultyLevel, BalloonPopSettings> = {
  slow: {
    balloonSpeed: 1.0,
    spawnInterval: 3000,
    maxBalloons: 3,
    wobbleAmount: 15,
    enableSounds: true,
    enableParticles: true,
  },
  medium: {
    balloonSpeed: 1.5,
    spawnInterval: 2500,
    maxBalloons: 4,
    wobbleAmount: 20,
    enableSounds: true,
    enableParticles: true,
  },
  fast: {
    balloonSpeed: 2.2,
    spawnInterval: 2000,
    maxBalloons: 5,
    wobbleAmount: 25,
    enableSounds: true,
    enableParticles: true,
  },
};

const GAME_MODE_CONFIG = {
  practice: { lives: Infinity, timeLimit: 0, speedIncrease: false },
  timed: { lives: Infinity, timeLimit: 120, speedIncrease: false },
  survival: { lives: 3, timeLimit: 0, speedIncrease: false },
  speed: { lives: Infinity, timeLimit: 0, speedIncrease: true },
  multiplayer: { lives: 3, timeLimit: 120, speedIncrease: false },
};

export class BalloonPopGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private state: GameState;
  private settings: BalloonPopSettings;
  private questions: QuizQuestion[];
  private balloons: Balloon[] = [];
  private animationFrame: number | null = null;
  private lastSpawnTime: number = 0;
  private gameLoopInterval: number | null = null;
  private onScoreChange?: (score: number) => void;
  private onGameOver?: (finalScore: number, stars: number) => void;
  private onQuestionComplete?: (isCorrect: boolean) => void;
  private onPowerUpActivated?: (type: PowerUpType) => void;

  constructor(
    canvas: HTMLCanvasElement,
    questions: QuizQuestion[],
    mode: GameMode = 'practice',
    difficulty: DifficultyLevel = 'medium'
  ) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.questions = questions;
    this.settings = DIFFICULTY_SETTINGS[difficulty];

    this.state = this.initializeGameState(mode, difficulty);
    this.resize();

    window.addEventListener('resize', () => this.resize());
  }

  private initializeGameState(mode: GameMode, difficulty: DifficultyLevel): GameState {
    const config = GAME_MODE_CONFIG[mode];

    return {
      mode,
      difficulty,
      score: 0,
      lives: config.lives,
      timeRemaining: config.timeLimit,
      currentQuestionIndex: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      combo: 0,
      maxCombo: 0,
      powerUps: [],
      isPaused: false,
      isGameOver: false,
      gameStartTime: Date.now(),
      stars: 0,
    };
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  /**
   * Start the game
   */
  start() {
    this.state.gameStartTime = Date.now();
    this.animate();

    // Start timer for timed modes
    if (this.state.timeRemaining > 0) {
      this.startTimer();
    }
  }

  /**
   * Pause/Resume the game
   */
  togglePause() {
    this.state.isPaused = !this.state.isPaused;
  }

  /**
   * Stop the game
   */
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    if (this.gameLoopInterval) {
      clearInterval(this.gameLoopInterval);
      this.gameLoopInterval = null;
    }
  }

  /**
   * Handle balloon click/tap
   */
  handleBalloonClick(x: number, y: number) {
    if (this.state.isPaused || this.state.isGameOver) return;

    // Check for collision with any balloon
    for (let i = this.balloons.length - 1; i >= 0; i--) {
      const balloon = this.balloons[i];
      if (balloon.popped) continue;

      const distance = Math.hypot(x - balloon.x, y - balloon.y);
      const radius = 40 * balloon.scale; // Balloon radius

      if (distance < radius) {
        this.popBalloon(balloon);
        return true;
      }
    }

    return false;
  }

  /**
   * Pop a balloon
   */
  private popBalloon(balloon: Balloon) {
    balloon.popped = true;

    if (balloon.isCorrect) {
      this.handleCorrectAnswer(balloon);
    } else {
      this.handleWrongAnswer(balloon);
    }

    // Remove balloon after short delay
    setTimeout(() => {
      this.balloons = this.balloons.filter(b => b.id !== balloon.id);
    }, 100);
  }

  /**
   * Handle correct answer
   */
  private handleCorrectAnswer(balloon: Balloon) {
    // Calculate score
    const baseScore = 100;
    const speedBonus = this.calculateSpeedBonus();
    const comboMultiplier = Math.min(this.state.combo + 1, 4);
    const totalScore = (baseScore + speedBonus) * comboMultiplier;

    this.state.score += totalScore;
    this.state.correctAnswers++;
    this.state.combo++;
    this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo);

    // Trigger callbacks
    if (this.onScoreChange) {
      this.onScoreChange(this.state.score);
    }

    // Move to next question
    this.nextQuestion();
  }

  /**
   * Handle wrong answer
   */
  private handleWrongAnswer(balloon: Balloon) {
    this.state.wrongAnswers++;
    this.state.combo = 0;

    // Lose life in survival mode
    if (this.state.mode === 'survival' || this.state.mode === 'multiplayer') {
      this.state.lives--;

      if (this.state.lives <= 0) {
        this.endGame();
      }
    }
  }

  /**
   * Calculate speed bonus (faster response = higher bonus)
   */
  private calculateSpeedBonus(): number {
    const timeSinceSpawn = Date.now() - this.lastSpawnTime;
    if (timeSinceSpawn < 5000) {
      return 50;
    }
    return 0;
  }

  /**
   * Move to next question
   */
  private nextQuestion() {
    this.state.currentQuestionIndex++;
    this.state.questionsAnswered++;

    // Clear existing balloons
    this.balloons = [];

    if (this.state.currentQuestionIndex >= this.questions.length) {
      this.endGame();
      return;
    }

    // Increase speed in speed challenge mode
    if (this.state.mode === 'speed') {
      this.settings.balloonSpeed *= 1.1;
    }

    if (this.onQuestionComplete) {
      this.onQuestionComplete(true);
    }
  }

  /**
   * End the game
   */
  private endGame() {
    this.state.isGameOver = true;
    this.stop();

    // Calculate stars (1-3)
    const accuracy = this.state.correctAnswers / (this.state.correctAnswers + this.state.wrongAnswers);
    if (accuracy >= 0.95 && this.state.wrongAnswers === 0) {
      this.state.stars = 3;
    } else if (accuracy >= 0.8) {
      this.state.stars = 2;
    } else {
      this.state.stars = 1;
    }

    // Perfect game bonus
    if (this.state.wrongAnswers === 0) {
      this.state.score += 500;
    }

    if (this.onGameOver) {
      this.onGameOver(this.state.score, this.state.stars);
    }

    // Save high score
    this.saveHighScore();
  }

  /**
   * Save high score to localStorage
   */
  private saveHighScore() {
    const key = `balloon-pop-highscore-${this.state.mode}-${this.state.difficulty}`;
    const currentHighScore = parseInt(localStorage.getItem(key) || '0', 10);

    if (this.state.score > currentHighScore) {
      localStorage.setItem(key, this.state.score.toString());
    }
  }

  /**
   * Get high score from localStorage
   */
  static getHighScore(mode: GameMode, difficulty: DifficultyLevel): number {
    const key = `balloon-pop-highscore-${mode}-${difficulty}`;
    return parseInt(localStorage.getItem(key) || '0', 10);
  }

  /**
   * Start timer countdown
   */
  private startTimer() {
    this.gameLoopInterval = window.setInterval(() => {
      if (this.state.isPaused || this.state.isGameOver) return;

      this.state.timeRemaining--;

      if (this.state.timeRemaining <= 0) {
        this.endGame();
      }
    }, 1000);
  }

  /**
   * Spawn balloons for current question
   */
  private spawnBalloons() {
    const now = Date.now();

    if (now - this.lastSpawnTime < this.settings.spawnInterval) return;
    if (this.balloons.length >= this.settings.maxBalloons) return;
    if (this.state.currentQuestionIndex >= this.questions.length) return;

    const question = this.questions[this.state.currentQuestionIndex];
    const answers: string[] = [];

    // Get all possible answers
    if (question.type === 'truefalse') {
      answers.push('true', 'false');
    } else if (question.type === 'multiplechoice' && question.options) {
      answers.push(...question.options);
    }

    // Shuffle answers
    const shuffledAnswers = this.shuffleArray([...answers]);

    // Create balloons
    const balloonsToSpawn = Math.min(shuffledAnswers.length, this.settings.maxBalloons);
    const spacing = this.canvas.width / (balloonsToSpawn + 1);

    for (let i = 0; i < balloonsToSpawn; i++) {
      const answer = shuffledAnswers[i];
      const isCorrect = this.isCorrectAnswer(question, answer);

      const balloon: Balloon = {
        id: `balloon-${now}-${i}`,
        x: spacing * (i + 1) + (Math.random() - 0.5) * 50,
        y: this.canvas.height + 100,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -this.settings.balloonSpeed - Math.random() * 0.5,
        color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
        answer,
        isCorrect,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        wobblePhase: Math.random() * Math.PI * 2,
        scale: 1,
        popped: false,
      };

      this.balloons.push(balloon);
    }

    this.lastSpawnTime = now;
  }

  /**
   * Check if answer is correct
   */
  private isCorrectAnswer(question: QuizQuestion, answer: string): boolean {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.includes(answer);
    }
    return question.correctAnswer === answer;
  }

  /**
   * Shuffle array
   */
  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Update balloon physics
   */
  private updateBalloons(deltaTime: number) {
    this.balloons.forEach(balloon => {
      if (balloon.popped) return;

      // Apply gravity and movement
      balloon.y += balloon.vy;
      balloon.x += balloon.vx;

      // Wobble effect (side-to-side)
      balloon.wobblePhase += 0.05;
      const wobble = Math.sin(balloon.wobblePhase) * this.settings.wobbleAmount;
      balloon.x += wobble * 0.01;

      // Rotation
      balloon.rotation += balloon.rotationSpeed;

      // Boundary check (remove if off screen)
      if (balloon.y < -150) {
        balloon.popped = true;
      }

      // Side boundaries (bounce)
      if (balloon.x < 50) {
        balloon.x = 50;
        balloon.vx = Math.abs(balloon.vx);
      } else if (balloon.x > this.canvas.width - 50) {
        balloon.x = this.canvas.width - 50;
        balloon.vx = -Math.abs(balloon.vx);
      }
    });

    // Remove popped balloons
    this.balloons = this.balloons.filter(b => !b.popped || b.scale > 0);
  }

  /**
   * Draw balloon
   */
  private drawBalloon(balloon: Balloon) {
    this.ctx.save();
    this.ctx.translate(balloon.x, balloon.y);
    this.ctx.rotate(balloon.rotation);
    this.ctx.scale(balloon.scale, balloon.scale);

    // Balloon body (oval shape)
    const width = 70;
    const height = 90;

    // Balloon gradient
    const gradient = this.ctx.createRadialGradient(-10, -20, 10, 0, 0, 50);
    gradient.addColorStop(0, this.getBalloonColor(balloon.color, 0.8));
    gradient.addColorStop(1, this.getBalloonColor(balloon.color, 1));

    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, width / 2, height / 2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Highlight
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.beginPath();
    this.ctx.ellipse(-15, -20, 15, 25, -0.3, 0, Math.PI * 2);
    this.ctx.fill();

    // Balloon knot
    this.ctx.fillStyle = this.getBalloonColor(balloon.color, 1.2);
    this.ctx.beginPath();
    this.ctx.ellipse(0, height / 2, 5, 8, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // String
    this.ctx.strokeStyle = 'rgba(100, 100, 100, 0.6)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.moveTo(0, height / 2 + 8);
    this.ctx.quadraticCurveTo(5, height / 2 + 30, 0, height / 2 + 50);
    this.ctx.stroke();

    // Answer text
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 14px "Noto Sans", sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
    this.ctx.shadowBlur = 3;

    // Wrap text if too long
    const maxWidth = width - 20;
    const words = balloon.answer.split(' ');
    let line = '';
    let y = -5;
    const lineHeight = 18;

    for (const word of words) {
      const testLine = line + word + ' ';
      const metrics = this.ctx.measureText(testLine);

      if (metrics.width > maxWidth && line.length > 0) {
        this.ctx.fillText(line.trim(), 0, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line.trim(), 0, y);

    this.ctx.restore();
  }

  /**
   * Get balloon color with brightness adjustment
   */
  private getBalloonColor(color: BalloonColor, brightness: number = 1): string {
    const colors: Record<BalloonColor, string> = {
      red: `hsl(0, 85%, ${50 * brightness}%)`,
      blue: `hsl(210, 85%, ${55 * brightness}%)`,
      green: `hsl(140, 70%, ${50 * brightness}%)`,
      yellow: `hsl(50, 95%, ${55 * brightness}%)`,
      purple: `hsl(280, 70%, ${55 * brightness}%)`,
      orange: `hsl(30, 90%, ${55 * brightness}%)`,
    };
    return colors[color];
  }

  /**
   * Draw background
   */
  private drawBackground() {
    // Sky gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#E0F6FF');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Clouds (simple)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    const time = Date.now() / 5000;

    for (let i = 0; i < 3; i++) {
      const x = ((time * 20 + i * 200) % (this.canvas.width + 200)) - 100;
      const y = 50 + i * 80;

      this.ctx.beginPath();
      this.ctx.arc(x, y, 40, 0, Math.PI * 2);
      this.ctx.arc(x + 30, y, 50, 0, Math.PI * 2);
      this.ctx.arc(x + 60, y, 40, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  /**
   * Main animation loop
   */
  private animate() {
    if (this.state.isPaused || this.state.isGameOver) {
      this.animationFrame = requestAnimationFrame(() => this.animate());
      return;
    }

    // Clear and draw background
    this.drawBackground();

    // Spawn new balloons
    this.spawnBalloons();

    // Update and draw balloons
    this.updateBalloons(1 / 60);
    this.balloons.forEach(balloon => {
      if (!balloon.popped) {
        this.drawBalloon(balloon);
      }
    });

    // Continue animation
    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Activate power-up
   */
  activatePowerUp(type: PowerUpType) {
    const powerUp: PowerUp = {
      type,
      active: true,
      duration: this.getPowerUpDuration(type),
      activatedAt: Date.now(),
    };

    this.state.powerUps.push(powerUp);

    // Apply power-up effect
    switch (type) {
      case 'slow-motion':
        this.settings.balloonSpeed *= 0.5;
        break;
      case 'freeze-time':
        this.state.isPaused = true;
        setTimeout(() => {
          this.state.isPaused = false;
        }, powerUp.duration);
        break;
      case 'extra-time':
        this.state.timeRemaining += 10;
        break;
      case 'auto-pop':
        this.autoPopCorrectBalloon();
        break;
    }

    // Deactivate after duration
    setTimeout(() => {
      this.deactivatePowerUp(powerUp);
    }, powerUp.duration);

    if (this.onPowerUpActivated) {
      this.onPowerUpActivated(type);
    }
  }

  /**
   * Get power-up duration
   */
  private getPowerUpDuration(type: PowerUpType): number {
    const durations: Record<PowerUpType, number> = {
      'slow-motion': 10000,
      'freeze-time': 5000,
      'extra-time': 0,
      'auto-pop': 0,
    };
    return durations[type];
  }

  /**
   * Deactivate power-up
   */
  private deactivatePowerUp(powerUp: PowerUp) {
    powerUp.active = false;

    if (powerUp.type === 'slow-motion') {
      this.settings.balloonSpeed /= 0.5;
    }

    this.state.powerUps = this.state.powerUps.filter(p => p.active);
  }

  /**
   * Auto-pop correct balloon
   */
  private autoPopCorrectBalloon() {
    const correctBalloon = this.balloons.find(b => b.isCorrect && !b.popped);
    if (correctBalloon) {
      this.popBalloon(correctBalloon);
    }
  }

  /**
   * Get current game state
   */
  getState(): GameState {
    return { ...this.state };
  }

  /**
   * Get current question
   */
  getCurrentQuestion(): QuizQuestion | null {
    if (this.state.currentQuestionIndex >= this.questions.length) {
      return null;
    }
    return this.questions[this.state.currentQuestionIndex];
  }

  /**
   * Set event callbacks
   */
  setCallbacks(callbacks: {
    onScoreChange?: (score: number) => void;
    onGameOver?: (finalScore: number, stars: number) => void;
    onQuestionComplete?: (isCorrect: boolean) => void;
    onPowerUpActivated?: (type: PowerUpType) => void;
  }) {
    this.onScoreChange = callbacks.onScoreChange;
    this.onGameOver = callbacks.onGameOver;
    this.onQuestionComplete = callbacks.onQuestionComplete;
    this.onPowerUpActivated = callbacks.onPowerUpActivated;
  }
}
