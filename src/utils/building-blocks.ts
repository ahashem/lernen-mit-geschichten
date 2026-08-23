/**
 * Building Blocks Physics Engine and Game Logic
 * Educational stacking game where correct quiz answers allow block placement
 * Features: Physics simulation, balance calculation, quiz integration, challenges
 */

export type BlockShape = 'cube' | 'rectangle' | 'triangle' | 'cylinder' | 'arc';
export type BlockMaterial = 'wood' | 'stone' | 'metal' | 'glass' | 'gold';
export type GameMode = 'quiz' | 'challenge' | 'creative' | 'tutorial';
export type ChallengeType = 'tower' | 'bridge' | 'house' | 'pyramid' | 'freestyle';

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'truefalse' | 'multiplechoice' | 'fillinblank';
  correctAnswer: string | string[];
  options?: string[];
}

export interface Block {
  id: string;
  shape: BlockShape;
  material: BlockMaterial;
  width: number;
  height: number;
  x: number;
  y: number;
  angle: number; // in radians
  angularVelocity: number;
  velocityX: number;
  velocityY: number;
  mass: number;
  friction: number;
  restitution: number; // bounciness
  color: string;
  isPlaced: boolean;
  isStable: boolean;
  wobbleIntensity: number;
  vertices: { x: number; y: number }[];
  centerOfMass: { x: number; y: number };
}

export interface PhysicsConfig {
  gravity: number;
  friction: number;
  airResistance: number;
  stabilityThreshold: number;
  maxAngularVelocity: number;
  collisionIterations: number;
  enablePhysics: boolean;
}

export interface GameState {
  mode: GameMode;
  challengeType?: ChallengeType;
  score: number;
  blocksPlaced: number;
  blocksToppled: number;
  currentQuestionIndex: number;
  questionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  towerHeight: number;
  maxTowerHeight: number;
  stability: number; // 0-100
  isPaused: boolean;
  isGameOver: boolean;
  gameStartTime: number;
  xpEarned: number;
  completedChallenges: string[];
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  name: Record<string, string>;
  description: Record<string, string>;
  targetHeight?: number;
  targetSpan?: number;
  targetShape?: string;
  minBlocks?: number;
  maxBlocks?: number;
  timeLimit?: number;
  requiredShapes?: BlockShape[];
  xpReward: number;
  starReward: number;
  unlockRequirement?: string;
}

export interface BlockInventory {
  cube: { unlocked: boolean; count: number };
  rectangle: { unlocked: boolean; count: number };
  triangle: { unlocked: boolean; count: number };
  cylinder: { unlocked: boolean; count: number };
  arc: { unlocked: boolean; count: number };
  golden: { unlocked: boolean; count: number };
}

// ============================================
// CONSTANTS
// ============================================

const GRAVITY = 0.5;
const FRICTION = 0.98;
const AIR_RESISTANCE = 0.99;
const STABILITY_THRESHOLD = 0.1;
const MAX_ANGULAR_VELOCITY = 0.3;
const COLLISION_ITERATIONS = 5;

// Block shape dimensions (base sizes, scaled by multiplier)
const SHAPE_DIMENSIONS: Record<BlockShape, { width: number; height: number }> = {
  cube: { width: 60, height: 60 },
  rectangle: { width: 100, height: 40 },
  triangle: { width: 80, height: 60 },
  cylinder: { width: 50, height: 80 },
  arc: { width: 120, height: 60 },
};

// Material properties
const MATERIAL_PROPERTIES: Record<
  BlockMaterial,
  { mass: number; friction: number; restitution: number; color: string }
> = {
  wood: { mass: 1.0, friction: 0.7, restitution: 0.3, color: '#D2691E' },
  stone: { mass: 1.5, friction: 0.9, restitution: 0.1, color: '#808080' },
  metal: { mass: 2.0, friction: 0.5, restitution: 0.4, color: '#C0C0C0' },
  glass: { mass: 0.8, friction: 0.3, restitution: 0.6, color: '#B0E0E6' },
  gold: { mass: 3.0, friction: 0.6, restitution: 0.2, color: '#FFD700' },
};

// Block colors (diverse palette)
const BLOCK_COLORS = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E2',
  '#F8B400',
  '#52B788',
];

// Challenge definitions
export const CHALLENGES: Challenge[] = [
  {
    id: 'tower-10',
    type: 'tower',
    name: {
      de: 'Kleiner Turm',
      en: 'Small Tower',
      ar: 'برج صغير',
      tr: 'Küçük Kule',
      ur: 'چھوٹا ٹاور',
    },
    description: {
      de: 'Baue einen Turm mit 10 Blöcken',
      en: 'Build a tower with 10 blocks',
      ar: 'ابن برجاً بـ 10 كتل',
      tr: '10 blokla bir kule inşa et',
      ur: '10 بلاکس کے ساتھ ایک ٹاور بنائیں',
    },
    targetHeight: 10,
    xpReward: 50,
    starReward: 10,
  },
  {
    id: 'tower-20',
    type: 'tower',
    name: {
      de: 'Wolkenkratzer',
      en: 'Skyscraper',
      ar: 'ناطحة سحاب',
      tr: 'Gökdelen',
      ur: 'بلند عمارت',
    },
    description: {
      de: 'Baue einen Turm mit 20 Blöcken',
      en: 'Build a tower with 20 blocks',
      ar: 'ابن برجاً بـ 20 كتلة',
      tr: '20 blokla bir kule inşa et',
      ur: '20 بلاکس کے ساتھ ایک ٹاور بنائیں',
    },
    targetHeight: 20,
    xpReward: 100,
    starReward: 20,
    unlockRequirement: 'tower-10',
  },
  {
    id: 'bridge',
    type: 'bridge',
    name: {
      de: 'Brücke',
      en: 'Bridge',
      ar: 'جسر',
      tr: 'Köprü',
      ur: 'پل',
    },
    description: {
      de: 'Baue eine Brücke über 200 Pixel',
      en: 'Build a bridge spanning 200 pixels',
      ar: 'ابن جسراً بطول 200 بكسل',
      tr: '200 piksel uzunluğunda bir köprü inşa et',
      ur: '200 پکسل کے پل بنائیں',
    },
    targetSpan: 200,
    minBlocks: 5,
    maxBlocks: 15,
    xpReward: 75,
    starReward: 15,
  },
  {
    id: 'house',
    type: 'house',
    name: {
      de: 'Haus',
      en: 'House',
      ar: 'منزل',
      tr: 'Ev',
      ur: 'گھر',
    },
    description: {
      de: 'Baue ein Haus mit Wänden und Dach',
      en: 'Build a house with walls and roof',
      ar: 'ابن منزلاً بجدران وسقف',
      tr: 'Duvarları ve çatısı olan bir ev inşa et',
      ur: 'دیواروں اور چھت کے ساتھ گھر بنائیں',
    },
    requiredShapes: ['rectangle', 'triangle'],
    minBlocks: 6,
    xpReward: 80,
    starReward: 15,
  },
  {
    id: 'pyramid',
    type: 'pyramid',
    name: {
      de: 'Pyramide',
      en: 'Pyramid',
      ar: 'هرم',
      tr: 'Piramit',
      ur: 'اہرام',
    },
    description: {
      de: 'Baue eine symmetrische Pyramide',
      en: 'Build a symmetric pyramid',
      ar: 'ابن هرماً متماثلاً',
      tr: 'Simetrik bir piramit inşa et',
      ur: 'متوازن اہرام بنائیں',
    },
    minBlocks: 10,
    maxBlocks: 20,
    xpReward: 100,
    starReward: 20,
  },
  {
    id: 'creative-50',
    type: 'freestyle',
    name: {
      de: 'Meisterbauer',
      en: 'Master Builder',
      ar: 'البناء الخبير',
      tr: 'Usta İnşaatçı',
      ur: 'ماسٹر تعمیر کار',
    },
    description: {
      de: 'Platziere 50 Blöcke erfolgreich',
      en: 'Successfully place 50 blocks',
      ar: 'ضع 50 كتلة بنجاح',
      tr: '50 bloğu başarıyla yerleştir',
      ur: '50 بلاکس کامیابی سے رکھیں',
    },
    minBlocks: 50,
    xpReward: 150,
    starReward: 30,
  },
];

// ============================================
// PHYSICS ENGINE
// ============================================

export class PhysicsEngine {
  private config: PhysicsConfig;
  private blocks: Block[] = [];
  private ground: { y: number; friction: number };

  constructor(groundY: number, config?: Partial<PhysicsConfig>) {
    this.ground = { y: groundY, friction: 0.9 };
    this.config = {
      gravity: config?.gravity ?? GRAVITY,
      friction: config?.friction ?? FRICTION,
      airResistance: config?.airResistance ?? AIR_RESISTANCE,
      stabilityThreshold: config?.stabilityThreshold ?? STABILITY_THRESHOLD,
      maxAngularVelocity: config?.maxAngularVelocity ?? MAX_ANGULAR_VELOCITY,
      collisionIterations: config?.collisionIterations ?? COLLISION_ITERATIONS,
      enablePhysics: config?.enablePhysics ?? true,
    };
  }

  /**
   * Update physics simulation
   */
  update(deltaTime: number = 1 / 60) {
    if (!this.config.enablePhysics) return;

    this.blocks.forEach(block => {
      if (!block.isPlaced) return;

      // Apply gravity
      block.velocityY += this.config.gravity * deltaTime * 60;

      // Apply air resistance
      block.velocityX *= this.config.airResistance;
      block.velocityY *= this.config.airResistance;
      block.angularVelocity *= this.config.airResistance;

      // Limit angular velocity
      block.angularVelocity = Math.max(
        -this.config.maxAngularVelocity,
        Math.min(this.config.maxAngularVelocity, block.angularVelocity)
      );

      // Update position
      block.x += block.velocityX * deltaTime * 60;
      block.y += block.velocityY * deltaTime * 60;
      block.angle += block.angularVelocity * deltaTime * 60;

      // Update vertices based on new position/rotation
      this.updateBlockVertices(block);

      // Ground collision
      this.handleGroundCollision(block);

      // Check stability
      this.checkBlockStability(block);
    });

    // Block-to-block collisions (multiple iterations for stability)
    for (let i = 0; i < this.config.collisionIterations; i++) {
      this.handleBlockCollisions();
    }
  }

  /**
   * Update block vertices based on position and rotation
   */
  private updateBlockVertices(block: Block) {
    const hw = block.width / 2;
    const hh = block.height / 2;
    const cos = Math.cos(block.angle);
    const sin = Math.sin(block.angle);

    if (block.shape === 'cube' || block.shape === 'rectangle') {
      // Rectangle vertices
      block.vertices = [
        { x: block.x + (-hw * cos - -hh * sin), y: block.y + (-hw * sin + -hh * cos) },
        { x: block.x + (hw * cos - -hh * sin), y: block.y + (hw * sin + -hh * cos) },
        { x: block.x + (hw * cos - hh * sin), y: block.y + (hw * sin + hh * cos) },
        { x: block.x + (-hw * cos - hh * sin), y: block.y + (-hw * sin + hh * cos) },
      ];
    } else if (block.shape === 'triangle') {
      // Triangle vertices (pointing up)
      block.vertices = [
        { x: block.x + (0 * cos - -hh * sin), y: block.y + (0 * sin + -hh * cos) }, // top
        { x: block.x + (-hw * cos - hh * sin), y: block.y + (-hw * sin + hh * cos) }, // bottom left
        { x: block.x + (hw * cos - hh * sin), y: block.y + (hw * sin + hh * cos) }, // bottom right
      ];
    }

    // Update center of mass
    this.updateCenterOfMass(block);
  }

  /**
   * Calculate center of mass
   */
  private updateCenterOfMass(block: Block) {
    if (block.vertices.length === 0) {
      block.centerOfMass = { x: block.x, y: block.y };
      return;
    }

    let sumX = 0;
    let sumY = 0;

    block.vertices.forEach(v => {
      sumX += v.x;
      sumY += v.y;
    });

    block.centerOfMass = {
      x: sumX / block.vertices.length,
      y: sumY / block.vertices.length,
    };
  }

  /**
   * Handle ground collision
   */
  private handleGroundCollision(block: Block) {
    const lowestVertex = Math.max(...block.vertices.map(v => v.y));

    if (lowestVertex >= this.ground.y) {
      // Block hit ground
      block.y -= lowestVertex - this.ground.y + 1;
      block.velocityY *= -block.restitution; // Bounce

      // Apply friction
      if (Math.abs(block.velocityY) < 1) {
        block.velocityY = 0;
        block.velocityX *= this.ground.friction;
        block.angularVelocity *= this.ground.friction;
      }

      // Update vertices after position correction
      this.updateBlockVertices(block);
    }
  }

  /**
   * Handle block-to-block collisions
   */
  private handleBlockCollisions() {
    for (let i = 0; i < this.blocks.length; i++) {
      for (let j = i + 1; j < this.blocks.length; j++) {
        const blockA = this.blocks[i];
        const blockB = this.blocks[j];

        if (!blockA.isPlaced || !blockB.isPlaced) continue;

        const collision = this.detectCollision(blockA, blockB);

        if (collision.isColliding) {
          this.resolveCollision(blockA, blockB, collision);
        }
      }
    }
  }

  /**
   * Detect collision between two blocks (AABB or SAT for rotated)
   */
  private detectCollision(
    blockA: Block,
    blockB: Block
  ): { isColliding: boolean; depth: number; normal: { x: number; y: number } } {
    // Simple AABB check first for performance
    const aMinX = Math.min(...blockA.vertices.map(v => v.x));
    const aMaxX = Math.max(...blockA.vertices.map(v => v.x));
    const aMinY = Math.min(...blockA.vertices.map(v => v.y));
    const aMaxY = Math.max(...blockA.vertices.map(v => v.y));

    const bMinX = Math.min(...blockB.vertices.map(v => v.x));
    const bMaxX = Math.max(...blockB.vertices.map(v => v.x));
    const bMinY = Math.min(...blockB.vertices.map(v => v.y));
    const bMaxY = Math.max(...blockB.vertices.map(v => v.y));

    const isColliding = !(aMaxX < bMinX || aMinX > bMaxX || aMaxY < bMinY || aMinY > bMaxY);

    if (!isColliding) {
      return { isColliding: false, depth: 0, normal: { x: 0, y: 0 } };
    }

    // Calculate penetration depth and normal
    const overlapX = Math.min(aMaxX - bMinX, bMaxX - aMinX);
    const overlapY = Math.min(aMaxY - bMinY, bMaxY - aMinY);

    let depth: number;
    let normal: { x: number; y: number };

    if (overlapX < overlapY) {
      depth = overlapX;
      normal = blockA.x < blockB.x ? { x: -1, y: 0 } : { x: 1, y: 0 };
    } else {
      depth = overlapY;
      normal = blockA.y < blockB.y ? { x: 0, y: -1 } : { x: 0, y: 1 };
    }

    return { isColliding: true, depth, normal };
  }

  /**
   * Resolve collision between two blocks
   */
  private resolveCollision(
    blockA: Block,
    blockB: Block,
    collision: { depth: number; normal: { x: number; y: number } }
  ) {
    // Separate blocks
    const totalMass = blockA.mass + blockB.mass;
    const aRatio = blockB.mass / totalMass;
    const bRatio = blockA.mass / totalMass;

    blockA.x -= collision.normal.x * collision.depth * aRatio;
    blockA.y -= collision.normal.y * collision.depth * aRatio;
    blockB.x += collision.normal.x * collision.depth * bRatio;
    blockB.y += collision.normal.y * collision.depth * bRatio;

    // Update vertices after separation
    this.updateBlockVertices(blockA);
    this.updateBlockVertices(blockB);

    // Apply impulse (simplified)
    const relativeVelocity = {
      x: blockB.velocityX - blockA.velocityX,
      y: blockB.velocityY - blockA.velocityY,
    };

    const velocityAlongNormal =
      relativeVelocity.x * collision.normal.x + relativeVelocity.y * collision.normal.y;

    if (velocityAlongNormal > 0) return; // Blocks moving apart

    const restitution = Math.min(blockA.restitution, blockB.restitution);
    const impulse = (-(1 + restitution) * velocityAlongNormal) / totalMass;

    blockA.velocityX -= impulse * blockB.mass * collision.normal.x;
    blockA.velocityY -= impulse * blockB.mass * collision.normal.y;
    blockB.velocityX += impulse * blockA.mass * collision.normal.x;
    blockB.velocityY += impulse * blockA.mass * collision.normal.y;

    // Apply angular impulse (simplified)
    blockA.angularVelocity += (Math.random() - 0.5) * 0.05;
    blockB.angularVelocity += (Math.random() - 0.5) * 0.05;

    // Apply friction
    const friction = Math.min(blockA.friction, blockB.friction);
    blockA.velocityX *= friction;
    blockB.velocityX *= friction;
  }

  /**
   * Check if block is stable (not moving much)
   */
  private checkBlockStability(block: Block) {
    const velocityMagnitude = Math.sqrt(
      block.velocityX ** 2 + block.velocityY ** 2 + block.angularVelocity ** 2
    );

    block.isStable = velocityMagnitude < this.config.stabilityThreshold;

    // Calculate wobble intensity
    block.wobbleIntensity = Math.min(1, velocityMagnitude * 5);
  }

  /**
   * Check if block is balanced (center of mass over support)
   */
  isBlockBalanced(block: Block): boolean {
    // Get blocks below this one
    const blocksBelow = this.blocks.filter(
      b =>
        b.isPlaced &&
        b.id !== block.id &&
        b.y > block.y &&
        Math.abs(b.x - block.x) < (block.width + b.width) / 2
    );

    // Check if on ground
    const onGround = Math.max(...block.vertices.map(v => v.y)) >= this.ground.y - 5;

    if (onGround) return true;
    if (blocksBelow.length === 0) return false;

    // Check if center of mass is over support
    const supportMinX = Math.min(...blocksBelow.flatMap(b => b.vertices.map(v => v.x)));
    const supportMaxX = Math.max(...blocksBelow.flatMap(b => b.vertices.map(v => v.x)));

    return block.centerOfMass.x >= supportMinX && block.centerOfMass.x <= supportMaxX;
  }

  /**
   * Calculate overall tower stability (0-100)
   */
  calculateTowerStability(): number {
    if (this.blocks.length === 0) return 100;

    const stableBlocks = this.blocks.filter(b => b.isPlaced && b.isStable).length;
    const balancedBlocks = this.blocks.filter(b => b.isPlaced && this.isBlockBalanced(b)).length;

    const stabilityScore = (stableBlocks / this.blocks.length) * 50;
    const balanceScore = (balancedBlocks / this.blocks.length) * 50;

    return Math.round(stabilityScore + balanceScore);
  }

  /**
   * Add block to simulation
   */
  addBlock(block: Block) {
    this.updateBlockVertices(block);
    this.blocks.push(block);
  }

  /**
   * Remove block from simulation
   */
  removeBlock(blockId: string) {
    this.blocks = this.blocks.filter(b => b.id !== blockId);
  }

  /**
   * Get all blocks
   */
  getBlocks(): Block[] {
    return this.blocks;
  }

  /**
   * Clear all blocks
   */
  clear() {
    this.blocks = [];
  }

  /**
   * Update physics config
   */
  updateConfig(config: Partial<PhysicsConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get ground Y position
   */
  getGroundY(): number {
    return this.ground.y;
  }
}

// ============================================
// BUILDING BLOCKS GAME
// ============================================

export class BuildingBlocksGame {
  private physics: PhysicsEngine;
  private state: GameState;
  private questions: QuizQuestion[];
  private inventory: BlockInventory;
  private currentBlock: Block | null = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationFrame: number | null = null;

  private onScoreChange?: (score: number) => void;
  private onBlockPlaced?: (block: Block) => void;
  private onBlockToppled?: (block: Block) => void;
  private onChallengeComplete?: (challenge: Challenge) => void;
  private onQuestionComplete?: (isCorrect: boolean) => void;
  private onGameOver?: (state: GameState) => void;

  constructor(canvas: HTMLCanvasElement, questions: QuizQuestion[], mode: GameMode = 'quiz') {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.questions = questions;

    const groundY = canvas.height - 50;
    this.physics = new PhysicsEngine(groundY);

    this.state = this.initializeGameState(mode);
    this.inventory = this.initializeInventory();

    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  private initializeGameState(mode: GameMode): GameState {
    return {
      mode,
      score: 0,
      blocksPlaced: 0,
      blocksToppled: 0,
      currentQuestionIndex: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      towerHeight: 0,
      maxTowerHeight: 0,
      stability: 100,
      isPaused: false,
      isGameOver: false,
      gameStartTime: Date.now(),
      xpEarned: 0,
      completedChallenges: [],
    };
  }

  private initializeInventory(): BlockInventory {
    return {
      cube: { unlocked: true, count: Infinity },
      rectangle: { unlocked: false, count: 0 },
      triangle: { unlocked: false, count: 0 },
      cylinder: { unlocked: false, count: 0 },
      arc: { unlocked: false, count: 0 },
      golden: { unlocked: false, count: 0 },
    };
  }

  private resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;

    // Update ground position
    const groundY = this.canvas.height - 50;
    this.physics = new PhysicsEngine(groundY, {
      enablePhysics: this.state.mode !== 'creative',
    });
  }

  /**
   * Start game
   */
  start() {
    this.state.gameStartTime = Date.now();
    this.animate();
  }

  /**
   * Stop game
   */
  stop() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Create new block (from quiz answer or creative mode)
   */
  createBlock(shape: BlockShape, material: BlockMaterial = 'wood'): Block {
    const dimensions = SHAPE_DIMENSIONS[shape];
    const properties = MATERIAL_PROPERTIES[material];
    const color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];

    const block: Block = {
      id: `block-${Date.now()}-${Math.random()}`,
      shape,
      material,
      width: dimensions.width,
      height: dimensions.height,
      x: this.canvas.width / 2,
      y: 100,
      angle: 0,
      angularVelocity: 0,
      velocityX: 0,
      velocityY: 0,
      mass: properties.mass,
      friction: properties.friction,
      restitution: properties.restitution,
      color,
      isPlaced: false,
      isStable: false,
      wobbleIntensity: 0,
      vertices: [],
      centerOfMass: { x: 0, y: 0 },
    };

    this.currentBlock = block;
    return block;
  }

  /**
   * Place current block
   */
  placeBlock() {
    if (!this.currentBlock) return;

    this.currentBlock.isPlaced = true;
    this.physics.addBlock(this.currentBlock);

    this.state.blocksPlaced++;
    this.state.score += 10;

    // Update tower height
    const highestBlock = Math.min(
      ...this.physics.getBlocks().map(b => Math.min(...b.vertices.map(v => v.y)))
    );
    const groundY = this.physics.getGroundY();
    this.state.towerHeight = Math.max(0, Math.floor((groundY - highestBlock) / 60));
    this.state.maxTowerHeight = Math.max(this.state.maxTowerHeight, this.state.towerHeight);

    // Check unlock conditions
    this.checkUnlocks();

    // Check challenge completion
    this.checkChallenges();

    if (this.onBlockPlaced) {
      this.onBlockPlaced(this.currentBlock);
    }

    this.currentBlock = null;

    // Award XP every 10 blocks
    if (this.state.blocksPlaced % 10 === 0) {
      this.state.xpEarned += 50;
    }
  }

  /**
   * Handle quiz answer
   */
  handleQuizAnswer(answer: string) {
    if (this.state.currentQuestionIndex >= this.questions.length) return;

    const question = this.questions[this.state.currentQuestionIndex];
    const isCorrect = this.isCorrectAnswer(question, answer);

    if (isCorrect) {
      this.state.correctAnswers++;
      this.state.score += 50;

      // Allow block placement
      const shape = this.getRandomUnlockedShape();
      this.createBlock(shape);

      if (this.onQuestionComplete) {
        this.onQuestionComplete(true);
      }
    } else {
      this.state.wrongAnswers++;

      // Wobble current tower
      this.physics.getBlocks().forEach(block => {
        block.angularVelocity += (Math.random() - 0.5) * 0.1;
        block.velocityX += (Math.random() - 0.5) * 2;
      });

      if (this.onQuestionComplete) {
        this.onQuestionComplete(false);
      }
    }

    this.state.questionsAnswered++;
    this.state.currentQuestionIndex++;

    if (this.state.currentQuestionIndex >= this.questions.length) {
      this.endGame();
    }
  }

  private isCorrectAnswer(question: QuizQuestion, answer: string): boolean {
    if (Array.isArray(question.correctAnswer)) {
      return question.correctAnswer.includes(answer);
    }
    return question.correctAnswer === answer;
  }

  private getRandomUnlockedShape(): BlockShape {
    const unlocked = Object.entries(this.inventory)
      .filter(([key, value]) => value.unlocked && key !== 'golden')
      .map(([key]) => key as BlockShape);

    return unlocked[Math.floor(Math.random() * unlocked.length)] || 'cube';
  }

  /**
   * Check unlock conditions for shapes
   */
  private checkUnlocks() {
    if (this.state.blocksPlaced >= 10 && !this.inventory.triangle.unlocked) {
      this.inventory.triangle.unlocked = true;
      this.inventory.triangle.count = Infinity;
    }

    if (this.state.blocksPlaced >= 20 && !this.inventory.arc.unlocked) {
      this.inventory.arc.unlocked = true;
      this.inventory.arc.count = Infinity;
    }

    if (this.state.blocksPlaced >= 50 && !this.inventory.golden.unlocked) {
      this.inventory.golden.unlocked = true;
      this.inventory.golden.count = 5;
    }

    if (this.state.blocksPlaced >= 5 && !this.inventory.rectangle.unlocked) {
      this.inventory.rectangle.unlocked = true;
      this.inventory.rectangle.count = Infinity;
    }

    if (this.state.blocksPlaced >= 15 && !this.inventory.cylinder.unlocked) {
      this.inventory.cylinder.unlocked = true;
      this.inventory.cylinder.count = Infinity;
    }
  }

  /**
   * Check challenge completion
   */
  private checkChallenges() {
    CHALLENGES.forEach(challenge => {
      if (this.state.completedChallenges.includes(challenge.id)) return;

      let isComplete = false;

      if (challenge.type === 'tower' && challenge.targetHeight) {
        isComplete = this.state.towerHeight >= challenge.targetHeight;
      } else if (challenge.type === 'freestyle' && challenge.minBlocks) {
        isComplete = this.state.blocksPlaced >= challenge.minBlocks;
      }

      if (isComplete) {
        this.state.completedChallenges.push(challenge.id);
        this.state.xpEarned += challenge.xpReward;
        this.state.score += challenge.starReward * 10;

        if (this.onChallengeComplete) {
          this.onChallengeComplete(challenge);
        }
      }
    });
  }

  /**
   * Move current block (during placement)
   */
  moveCurrentBlock(x: number, y: number) {
    if (this.currentBlock && !this.currentBlock.isPlaced) {
      this.currentBlock.x = x;
      this.currentBlock.y = y;
    }
  }

  /**
   * Rotate current block
   */
  rotateCurrentBlock(angle: number) {
    if (this.currentBlock && !this.currentBlock.isPlaced) {
      this.currentBlock.angle += angle;
    }
  }

  /**
   * Main animation loop
   */
  private animate() {
    if (!this.state.isPaused && !this.state.isGameOver) {
      this.physics.update();
      this.state.stability = this.physics.calculateTowerStability();

      // Check for toppled blocks
      this.checkToppledBlocks();
    }

    // Render
    this.render();

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  /**
   * Check for toppled blocks (fell off screen or unbalanced)
   */
  private checkToppledBlocks() {
    const blocks = this.physics.getBlocks();

    blocks.forEach(block => {
      const belowGround = Math.max(...block.vertices.map(v => v.y)) > this.canvas.height;
      const offScreen = block.x < -100 || block.x > this.canvas.width + 100;

      if (belowGround || offScreen) {
        this.physics.removeBlock(block.id);
        this.state.blocksToppled++;

        if (this.onBlockToppled) {
          this.onBlockToppled(block);
        }
      }
    });
  }

  /**
   * Render game
   */
  private render() {
    // Clear canvas
    this.ctx.fillStyle = '#E8F4F8';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background grid (blueprint style)
    this.drawGrid();

    // Draw ground
    this.drawGround();

    // Draw placed blocks
    this.physics.getBlocks().forEach(block => {
      this.drawBlock(block);
    });

    // Draw current block (being placed)
    if (this.currentBlock && !this.currentBlock.isPlaced) {
      this.drawBlock(this.currentBlock, true);
    }

    // Draw UI overlays
    this.drawStabilityMeter();
    this.drawHeightMeter();
  }

  /**
   * Draw blueprint-style grid
   */
  private drawGrid() {
    this.ctx.strokeStyle = 'rgba(100, 150, 200, 0.1)';
    this.ctx.lineWidth = 1;

    const gridSize = 30;

    for (let x = 0; x < this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y < this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  /**
   * Draw ground
   */
  private drawGround() {
    const groundY = this.physics.getGroundY();

    this.ctx.fillStyle = '#8B7355';
    this.ctx.fillRect(0, groundY, this.canvas.width, this.canvas.height - groundY);

    // Ground texture (simple lines)
    this.ctx.strokeStyle = '#6B5345';
    this.ctx.lineWidth = 2;
    for (let x = 0; x < this.canvas.width; x += 20) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, groundY);
      this.ctx.lineTo(x + 10, groundY + 5);
      this.ctx.stroke();
    }
  }

  /**
   * Draw block
   */
  private drawBlock(block: Block, isGhost: boolean = false) {
    this.ctx.save();
    this.ctx.translate(block.x, block.y);
    this.ctx.rotate(block.angle);

    // Apply wobble effect
    if (block.wobbleIntensity > 0) {
      const wobble = Math.sin(Date.now() / 100) * block.wobbleIntensity * 3;
      this.ctx.rotate(wobble * 0.02);
    }

    const alpha = isGhost ? 0.5 : 1;

    if (block.shape === 'cube' || block.shape === 'rectangle') {
      this.drawRectangleBlock(block, alpha);
    } else if (block.shape === 'triangle') {
      this.drawTriangleBlock(block, alpha);
    } else if (block.shape === 'cylinder') {
      this.drawCylinderBlock(block, alpha);
    } else if (block.shape === 'arc') {
      this.drawArcBlock(block, alpha);
    }

    this.ctx.restore();

    // Draw center of mass indicator (debug)
    if (!isGhost && false) {
      this.ctx.fillStyle = 'red';
      this.ctx.beginPath();
      this.ctx.arc(block.centerOfMass.x, block.centerOfMass.y, 3, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private drawRectangleBlock(block: Block, alpha: number) {
    const hw = block.width / 2;
    const hh = block.height / 2;

    // Shadow
    this.ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * alpha})`;
    this.ctx.fillRect(-hw + 3, -hh + 3, block.width, block.height);

    // Main block
    this.ctx.fillStyle = this.adjustAlpha(block.color, alpha);
    this.ctx.fillRect(-hw, -hh, block.width, block.height);

    // Highlight
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * alpha})`;
    this.ctx.fillRect(-hw + 5, -hh + 5, block.width / 3, block.height / 3);

    // Border
    this.ctx.strokeStyle = `rgba(0, 0, 0, ${0.3 * alpha})`;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(-hw, -hh, block.width, block.height);
  }

  private drawTriangleBlock(block: Block, alpha: number) {
    const hw = block.width / 2;
    const hh = block.height / 2;

    // Shadow
    this.ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * alpha})`;
    this.ctx.beginPath();
    this.ctx.moveTo(3, -hh + 3);
    this.ctx.lineTo(-hw + 3, hh + 3);
    this.ctx.lineTo(hw + 3, hh + 3);
    this.ctx.closePath();
    this.ctx.fill();

    // Main block
    this.ctx.fillStyle = this.adjustAlpha(block.color, alpha);
    this.ctx.beginPath();
    this.ctx.moveTo(0, -hh);
    this.ctx.lineTo(-hw, hh);
    this.ctx.lineTo(hw, hh);
    this.ctx.closePath();
    this.ctx.fill();

    // Highlight
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.3 * alpha})`;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -hh + 10);
    this.ctx.lineTo(-hw / 3, hh / 3);
    this.ctx.lineTo(hw / 3, hh / 3);
    this.ctx.closePath();
    this.ctx.fill();

    // Border
    this.ctx.strokeStyle = `rgba(0, 0, 0, ${0.3 * alpha})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -hh);
    this.ctx.lineTo(-hw, hh);
    this.ctx.lineTo(hw, hh);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private drawCylinderBlock(block: Block, alpha: number) {
    const hw = block.width / 2;
    const hh = block.height / 2;

    // Shadow
    this.ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * alpha})`;
    this.ctx.beginPath();
    this.ctx.ellipse(3, 3, hw, hh, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Main block
    this.ctx.fillStyle = this.adjustAlpha(block.color, alpha);
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Highlight
    this.ctx.fillStyle = `rgba(255, 255, 255, ${0.4 * alpha})`;
    this.ctx.beginPath();
    this.ctx.ellipse(-hw / 3, -hh / 3, hw / 3, hh / 3, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Border
    this.ctx.strokeStyle = `rgba(0, 0, 0, ${0.3 * alpha})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, hw, hh, 0, 0, Math.PI * 2);
    this.ctx.stroke();
  }

  private drawArcBlock(block: Block, alpha: number) {
    const hw = block.width / 2;
    const hh = block.height / 2;

    // Shadow
    this.ctx.fillStyle = `rgba(0, 0, 0, ${0.2 * alpha})`;
    this.ctx.beginPath();
    this.ctx.arc(3, hh + 3, hw, Math.PI, 0, false);
    this.ctx.lineTo(hw + 3, hh + 3);
    this.ctx.lineTo(-hw + 3, hh + 3);
    this.ctx.closePath();
    this.ctx.fill();

    // Main block
    this.ctx.fillStyle = this.adjustAlpha(block.color, alpha);
    this.ctx.beginPath();
    this.ctx.arc(0, hh, hw, Math.PI, 0, false);
    this.ctx.lineTo(hw, hh);
    this.ctx.lineTo(-hw, hh);
    this.ctx.closePath();
    this.ctx.fill();

    // Border
    this.ctx.strokeStyle = `rgba(0, 0, 0, ${0.3 * alpha})`;
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.arc(0, hh, hw, Math.PI, 0, false);
    this.ctx.lineTo(hw, hh);
    this.ctx.lineTo(-hw, hh);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  private adjustAlpha(color: string, alpha: number): string {
    // Convert hex to rgba
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Draw stability meter
   */
  private drawStabilityMeter() {
    const x = 20;
    const y = 20;
    const width = 150;
    const height = 20;

    // Background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillRect(x - 5, y - 5, width + 10, height + 40);

    // Label
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 12px "Noto Sans"';
    this.ctx.fillText('Stability', x, y + 10);

    // Meter background
    this.ctx.fillStyle = '#ddd';
    this.ctx.fillRect(x, y + 15, width, height);

    // Meter fill (color based on stability)
    const fillWidth = (this.state.stability / 100) * width;
    let fillColor = '#4CAF50'; // Green
    if (this.state.stability < 30) fillColor = '#F44336'; // Red
    else if (this.state.stability < 60) fillColor = '#FF9800'; // Orange

    this.ctx.fillStyle = fillColor;
    this.ctx.fillRect(x, y + 15, fillWidth, height);

    // Border
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(x, y + 15, width, height);

    // Percentage
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 10px "Noto Sans"';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`${this.state.stability}%`, x + width / 2, y + 28);
    this.ctx.textAlign = 'left';
  }

  /**
   * Draw height meter
   */
  private drawHeightMeter() {
    const x = this.canvas.width - 170;
    const y = 20;

    // Background
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillRect(x - 5, y - 5, 160, 70);

    // Tower icon
    this.ctx.font = '30px "Noto Sans"';
    this.ctx.fillText('🏗️', x, y + 30);

    // Height text
    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 14px "Noto Sans"';
    this.ctx.fillText(`Height: ${this.state.towerHeight}`, x + 40, y + 15);
    this.ctx.font = '12px "Noto Sans"';
    this.ctx.fillText(`Max: ${this.state.maxTowerHeight}`, x + 40, y + 35);
    this.ctx.fillText(`Blocks: ${this.state.blocksPlaced}`, x + 40, y + 55);
  }

  /**
   * End game
   */
  private endGame() {
    this.state.isGameOver = true;

    if (this.onGameOver) {
      this.onGameOver(this.state);
    }

    this.saveProgress();
  }

  /**
   * Save progress to localStorage
   */
  private saveProgress() {
    const data = {
      maxTowerHeight: this.state.maxTowerHeight,
      totalBlocksPlaced: this.state.blocksPlaced,
      totalXP: this.state.xpEarned,
      completedChallenges: this.state.completedChallenges,
      inventory: this.inventory,
    };

    const existing = this.loadProgress();

    localStorage.setItem(
      'building-blocks-progress',
      JSON.stringify({
        maxTowerHeight: Math.max(existing.maxTowerHeight, data.maxTowerHeight),
        totalBlocksPlaced: existing.totalBlocksPlaced + data.totalBlocksPlaced,
        totalXP: existing.totalXP + data.totalXP,
        completedChallenges: [
          ...new Set([...existing.completedChallenges, ...data.completedChallenges]),
        ],
        inventory: data.inventory,
      })
    );
  }

  /**
   * Load progress from localStorage
   */
  loadProgress(): {
    maxTowerHeight: number;
    totalBlocksPlaced: number;
    totalXP: number;
    completedChallenges: string[];
    inventory: BlockInventory;
  } {
    const data = localStorage.getItem('building-blocks-progress');

    if (!data) {
      return {
        maxTowerHeight: 0,
        totalBlocksPlaced: 0,
        totalXP: 0,
        completedChallenges: [],
        inventory: this.initializeInventory(),
      };
    }

    return JSON.parse(data);
  }

  /**
   * Get current state
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
   * Get inventory
   */
  getInventory(): BlockInventory {
    return { ...this.inventory };
  }

  /**
   * Set callbacks
   */
  setCallbacks(callbacks: {
    onScoreChange?: (score: number) => void;
    onBlockPlaced?: (block: Block) => void;
    onBlockToppled?: (block: Block) => void;
    onChallengeComplete?: (challenge: Challenge) => void;
    onQuestionComplete?: (isCorrect: boolean) => void;
    onGameOver?: (state: GameState) => void;
  }) {
    this.onScoreChange = callbacks.onScoreChange;
    this.onBlockPlaced = callbacks.onBlockPlaced;
    this.onBlockToppled = callbacks.onBlockToppled;
    this.onChallengeComplete = callbacks.onChallengeComplete;
    this.onQuestionComplete = callbacks.onQuestionComplete;
    this.onGameOver = callbacks.onGameOver;
  }

  /**
   * Toggle pause
   */
  togglePause() {
    this.state.isPaused = !this.state.isPaused;
  }

  /**
   * Enable/disable physics
   */
  setPhysicsEnabled(enabled: boolean) {
    this.physics.updateConfig({ enablePhysics: enabled });
  }
}
