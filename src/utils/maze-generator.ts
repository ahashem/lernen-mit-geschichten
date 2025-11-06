/**
 * Maze Generation Algorithms
 * Procedural maze generation using Recursive Backtracking and Prim's algorithm
 */

export type MazeSize = 'small' | 'medium' | 'large';
export type MazeTheme =
  | 'forest'
  | 'city'
  | 'beach'
  | 'space'
  | 'underwater'
  | 'mountain';
export type MazeDifficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface Position {
  x: number;
  y: number;
}

export enum CellType {
  WALL = 0,
  PATH = 1,
  START = 2,
  END = 3,
  CHECKPOINT = 4,
  COLLECTIBLE = 5,
  ENEMY = 6,
  POWERUP = 7,
  DOOR = 8,
  KEY = 9,
  TELEPORTER = 10,
}

export interface MazeCell {
  type: CellType;
  visited: boolean;
  revealed: boolean;
  data?: any; // Extra data (quiz questions, collectible info, etc.)
}

export interface MazeCollectible {
  id: string;
  type: 'star' | 'character' | 'item' | 'gem';
  position: Position;
  collected: boolean;
  value: number;
  storyElement?: string;
}

export interface MazeCheckpoint {
  id: string;
  position: Position;
  unlocked: boolean;
  quizQuestion?: {
    id: string;
    text: string;
    type: 'truefalse' | 'multiplechoice';
    correctAnswer: string;
    options?: string[];
  };
  storyEvent: string;
}

export interface MazeConfig {
  size: MazeSize;
  theme: MazeTheme;
  difficulty: MazeDifficulty;
  storyId: string;
  seed?: number;
}

export interface MazeData {
  grid: MazeCell[][];
  width: number;
  height: number;
  start: Position;
  end: Position;
  checkpoints: MazeCheckpoint[];
  collectibles: MazeCollectible[];
  doors: Position[];
  keys: Position[];
  teleporters: [Position, Position][];
  theme: MazeTheme;
  storyId: string;
}

// Seeded random number generator for reproducible mazes
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

// Get maze dimensions based on size
function getMazeDimensions(size: MazeSize): { width: number; height: number } {
  switch (size) {
    case 'small':
      return { width: 10, height: 10 };
    case 'medium':
      return { width: 20, height: 20 };
    case 'large':
      return { width: 30, height: 30 };
  }
}

// Initialize empty maze grid
function initializeGrid(
  width: number,
  height: number
): MazeCell[][] {
  const grid: MazeCell[][] = [];
  for (let y = 0; y < height; y++) {
    grid[y] = [];
    for (let x = 0; x < width; x++) {
      grid[y][x] = {
        type: CellType.WALL,
        visited: false,
        revealed: false,
      };
    }
  }
  return grid;
}

// Get neighboring cells (up, down, left, right)
function getNeighbors(
  pos: Position,
  width: number,
  height: number
): Position[] {
  const neighbors: Position[] = [];
  const directions = [
    { x: 0, y: -2 }, // Up
    { x: 2, y: 0 }, // Right
    { x: 0, y: 2 }, // Down
    { x: -2, y: 0 }, // Left
  ];

  for (const dir of directions) {
    const newX = pos.x + dir.x;
    const newY = pos.y + dir.y;
    if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
      neighbors.push({ x: newX, y: newY });
    }
  }

  return neighbors;
}

// Recursive Backtracking algorithm for maze generation
function recursiveBacktracking(
  grid: MazeCell[][],
  current: Position,
  width: number,
  height: number,
  random: SeededRandom
): void {
  grid[current.y][current.x].type = CellType.PATH;
  grid[current.y][current.x].visited = true;

  const neighbors = getNeighbors(current, width, height);
  const shuffledNeighbors = random.shuffle(neighbors);

  for (const neighbor of shuffledNeighbors) {
    if (!grid[neighbor.y][neighbor.x].visited) {
      // Remove wall between current and neighbor
      const wallX = current.x + (neighbor.x - current.x) / 2;
      const wallY = current.y + (neighbor.y - current.y) / 2;
      grid[wallY][wallX].type = CellType.PATH;
      grid[wallY][wallX].visited = true;

      // Recursively visit neighbor
      recursiveBacktracking(grid, neighbor, width, height, random);
    }
  }
}

// Find longest path in maze (for optimal start/end placement)
function findLongestPath(
  grid: MazeCell[][],
  width: number,
  height: number
): { start: Position; end: Position; distance: number } {
  let maxDistance = 0;
  let bestStart: Position = { x: 0, y: 0 };
  let bestEnd: Position = { x: 0, y: 0 };

  // BFS to find longest path
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (grid[y][x].type === CellType.PATH) {
        const distances = bfsDistances(grid, { x, y }, width, height);
        for (let ey = 0; ey < height; ey++) {
          for (let ex = 0; ex < width; ex++) {
            if (distances[ey][ex] > maxDistance) {
              maxDistance = distances[ey][ex];
              bestStart = { x, y };
              bestEnd = { x: ex, y: ey };
            }
          }
        }
      }
    }
  }

  return { start: bestStart, end: bestEnd, distance: maxDistance };
}

// BFS to calculate distances from start position
function bfsDistances(
  grid: MazeCell[][],
  start: Position,
  width: number,
  height: number
): number[][] {
  const distances: number[][] = Array(height)
    .fill(null)
    .map(() => Array(width).fill(-1));
  const queue: Position[] = [start];
  distances[start.y][start.x] = 0;

  const directions = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];

  while (queue.length > 0) {
    const current = queue.shift()!;

    for (const dir of directions) {
      const newX = current.x + dir.x;
      const newY = current.y + dir.y;

      if (
        newX >= 0 &&
        newX < width &&
        newY >= 0 &&
        newY < height &&
        grid[newY][newX].type !== CellType.WALL &&
        distances[newY][newX] === -1
      ) {
        distances[newY][newX] = distances[current.y][current.x] + 1;
        queue.push({ x: newX, y: newY });
      }
    }
  }

  return distances;
}

// A* pathfinding algorithm (for hints)
export function findPath(
  grid: MazeCell[][],
  start: Position,
  end: Position,
  width: number,
  height: number
): Position[] {
  const openSet: Position[] = [start];
  const cameFrom = new Map<string, Position>();
  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  const posKey = (pos: Position) => `${pos.x},${pos.y}`;
  const heuristic = (a: Position, b: Position) =>
    Math.abs(a.x - b.x) + Math.abs(a.y - b.y);

  gScore.set(posKey(start), 0);
  fScore.set(posKey(start), heuristic(start, end));

  while (openSet.length > 0) {
    // Find node with lowest fScore
    let currentIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (
        (fScore.get(posKey(openSet[i])) || Infinity) <
        (fScore.get(posKey(openSet[currentIdx])) || Infinity)
      ) {
        currentIdx = i;
      }
    }

    const current = openSet[currentIdx];

    if (current.x === end.x && current.y === end.y) {
      // Reconstruct path
      const path: Position[] = [current];
      let temp = current;
      while (cameFrom.has(posKey(temp))) {
        temp = cameFrom.get(posKey(temp))!;
        path.unshift(temp);
      }
      return path;
    }

    openSet.splice(currentIdx, 1);

    const directions = [
      { x: 0, y: -1 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: -1, y: 0 },
    ];

    for (const dir of directions) {
      const neighbor = { x: current.x + dir.x, y: current.y + dir.y };

      if (
        neighbor.x < 0 ||
        neighbor.x >= width ||
        neighbor.y < 0 ||
        neighbor.y >= height ||
        grid[neighbor.y][neighbor.x].type === CellType.WALL
      ) {
        continue;
      }

      const tentativeGScore = (gScore.get(posKey(current)) || 0) + 1;

      if (
        !gScore.has(posKey(neighbor)) ||
        tentativeGScore < gScore.get(posKey(neighbor))!
      ) {
        cameFrom.set(posKey(neighbor), current);
        gScore.set(posKey(neighbor), tentativeGScore);
        fScore.set(
          posKey(neighbor),
          tentativeGScore + heuristic(neighbor, end)
        );

        if (!openSet.find((p) => p.x === neighbor.x && p.y === neighbor.y)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return []; // No path found
}

// Place checkpoints along the optimal path
function placeCheckpoints(
  grid: MazeCell[][],
  path: Position[],
  count: number,
  storyEvents: string[],
  random: SeededRandom
): MazeCheckpoint[] {
  const checkpoints: MazeCheckpoint[] = [];
  const step = Math.floor(path.length / (count + 1));

  for (let i = 1; i <= count && i * step < path.length; i++) {
    const pos = path[i * step];
    const checkpoint: MazeCheckpoint = {
      id: `checkpoint-${i}`,
      position: pos,
      unlocked: false,
      storyEvent: storyEvents[i - 1] || `Ereignis ${i}`,
    };
    checkpoints.push(checkpoint);
    grid[pos.y][pos.x].type = CellType.CHECKPOINT;
    grid[pos.y][pos.x].data = checkpoint;
  }

  return checkpoints;
}

// Place collectibles randomly in the maze
function placeCollectibles(
  grid: MazeCell[][],
  width: number,
  height: number,
  count: number,
  random: SeededRandom
): MazeCollectible[] {
  const collectibles: MazeCollectible[] = [];
  const types: Array<MazeCollectible['type']> = [
    'star',
    'character',
    'item',
    'gem',
  ];
  const values = { star: 5, character: 10, item: 15, gem: 20 };

  let attempts = 0;
  const maxAttempts = count * 10;

  while (collectibles.length < count && attempts < maxAttempts) {
    const x = random.nextInt(0, width - 1);
    const y = random.nextInt(0, height - 1);
    attempts++;

    if (
      grid[y][x].type === CellType.PATH &&
      !grid[y][x].data
    ) {
      const type = types[random.nextInt(0, types.length - 1)];
      const collectible: MazeCollectible = {
        id: `collectible-${collectibles.length}`,
        type,
        position: { x, y },
        collected: false,
        value: values[type],
      };
      collectibles.push(collectible);
      grid[y][x].type = CellType.COLLECTIBLE;
      grid[y][x].data = collectible;
    }
  }

  return collectibles;
}

// Place doors and keys
function placeDoorsAndKeys(
  grid: MazeCell[][],
  path: Position[],
  count: number,
  random: SeededRandom
): { doors: Position[]; keys: Position[] } {
  const doors: Position[] = [];
  const keys: Position[] = [];

  if (path.length < 10) return { doors, keys };

  const step = Math.floor(path.length / (count + 1));

  for (let i = 0; i < count && (i + 1) * step < path.length; i++) {
    // Place door
    const doorPos = path[(i + 1) * step];
    doors.push(doorPos);
    grid[doorPos.y][doorPos.x].type = CellType.DOOR;
    grid[doorPos.y][doorPos.x].data = { keyId: i };

    // Place key before door
    const keyPos = path[Math.max(0, (i + 1) * step - random.nextInt(2, 5))];
    if (grid[keyPos.y][keyPos.x].type === CellType.PATH) {
      keys.push(keyPos);
      grid[keyPos.y][keyPos.x].type = CellType.KEY;
      grid[keyPos.y][keyPos.x].data = { keyId: i };
    }
  }

  return { doors, keys };
}

// Generate a complete maze
export function generateMaze(config: MazeConfig): MazeData {
  const { size, theme, difficulty, storyId, seed = Date.now() } = config;
  const { width, height } = getMazeDimensions(size);
  const random = new SeededRandom(seed);

  // Initialize grid with walls
  const grid = initializeGrid(width, height);

  // Generate maze using Recursive Backtracking
  // Start from odd coordinates to ensure proper maze structure
  const startX = random.nextInt(0, Math.floor((width - 1) / 2)) * 2;
  const startY = random.nextInt(0, Math.floor((height - 1) / 2)) * 2;
  recursiveBacktracking(grid, { x: startX, y: startY }, width, height, random);

  // Find optimal start and end points
  const { start, end } = findLongestPath(grid, width, height);
  grid[start.y][start.x].type = CellType.START;
  grid[end.y][end.x].type = CellType.END;

  // Find path from start to end
  const path = findPath(grid, start, end, width, height);

  // Determine number of features based on difficulty
  const featureCounts = {
    easy: { checkpoints: 3, collectibles: 5, doors: 0 },
    medium: { checkpoints: 4, collectibles: 10, doors: 1 },
    hard: { checkpoints: 5, collectibles: 15, doors: 2 },
    expert: { checkpoints: 5, collectibles: 20, doors: 3 },
  };

  const counts = featureCounts[difficulty];

  // Story events for checkpoints
  const storyEvents = [
    'Beginn der Reise',
    'Erste Herausforderung',
    'Treffen mit Freunden',
    'Wichtige Entscheidung',
    'Finale Prüfung',
  ];

  // Place checkpoints along the path
  const checkpoints = placeCheckpoints(
    grid,
    path,
    counts.checkpoints,
    storyEvents,
    random
  );

  // Place collectibles
  const collectibles = placeCollectibles(
    grid,
    width,
    height,
    counts.collectibles,
    random
  );

  // Place doors and keys
  const { doors, keys } = placeDoorsAndKeys(grid, path, counts.doors, random);

  // Place teleporters for expert difficulty
  const teleporters: [Position, Position][] = [];
  if (difficulty === 'expert' && path.length > 20) {
    const teleporter1 = path[Math.floor(path.length * 0.3)];
    const teleporter2 = path[Math.floor(path.length * 0.7)];
    grid[teleporter1.y][teleporter1.x].type = CellType.TELEPORTER;
    grid[teleporter2.y][teleporter2.x].type = CellType.TELEPORTER;
    teleporters.push([teleporter1, teleporter2]);
  }

  return {
    grid,
    width,
    height,
    start,
    end,
    checkpoints,
    collectibles,
    doors,
    keys,
    teleporters,
    theme,
    storyId,
  };
}

// Get string hash for seed generation
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate maze from story ID
export function generateMazeFromStory(
  storyId: string,
  difficulty: MazeDifficulty = 'medium',
  theme: MazeTheme = 'forest'
): MazeData {
  const seed = hashString(storyId);
  const size: MazeSize = difficulty === 'easy' ? 'small' : difficulty === 'hard' || difficulty === 'expert' ? 'large' : 'medium';

  return generateMaze({
    size,
    theme,
    difficulty,
    storyId,
    seed,
  });
}
