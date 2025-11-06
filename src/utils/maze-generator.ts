/**
 * Maze Generator
 * Procedural maze generation using Recursive Backtracking algorithm
 * Supports multiple themes, difficulty levels, and collectibles
 */

export interface MazeCell {
  row: number;
  col: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  hasCollectible?: boolean;
  collectibleType?: 'star' | 'key' | 'gem' | 'coin';
  isPath?: boolean;
}

export interface MazeConfig {
  rows: number;
  cols: number;
  difficulty: 'easy' | 'medium' | 'hard';
  theme: MazeTheme;
  collectiblesCount: number;
  keysCount?: number;
}

export type MazeTheme =
  | 'forest'
  | 'city'
  | 'beach'
  | 'space'
  | 'underwater'
  | 'mountain'
  | 'desert'
  | 'castle';

export interface MazeThemeConfig {
  id: MazeTheme;
  name: string;
  emoji: string;
  wallColor: string;
  pathColor: string;
  backgroundColor: string;
  collectibleEmoji: string;
  characterEmoji: string;
  goalEmoji: string;
  wallStyle: 'solid' | 'hedges' | 'buildings' | 'rocks' | 'coral' | 'ice' | 'sand' | 'stone';
}

export interface MazeState {
  currentRow: number;
  currentCol: number;
  visitedCells: Set<string>;
  collectedItems: string[];
  keysCollected: number;
  moves: number;
  timeElapsed: number;
  completed: boolean;
  solution?: MazeCell[];
}

export interface MazeGenerationResult {
  grid: MazeCell[][];
  startCell: { row: number; col: number };
  endCell: { row: number; col: number };
  solution: MazeCell[];
  collectibles: Array<{ row: number; col: number; type: string }>;
  config: MazeConfig;
}

/**
 * Maze Theme Configurations
 */
export const MAZE_THEMES: Record<MazeTheme, MazeThemeConfig> = {
  forest: {
    id: 'forest',
    name: 'Forest',
    emoji: '🌲',
    wallColor: '#2d5016',
    pathColor: '#8bc34a',
    backgroundColor: '#c8e6c9',
    collectibleEmoji: '🍄',
    characterEmoji: '🦊',
    goalEmoji: '🏠',
    wallStyle: 'hedges'
  },
  city: {
    id: 'city',
    name: 'City',
    emoji: '🏙️',
    wallColor: '#424242',
    pathColor: '#9e9e9e',
    backgroundColor: '#e0e0e0',
    collectibleEmoji: '🚗',
    characterEmoji: '🚶',
    goalEmoji: '🏢',
    wallStyle: 'buildings'
  },
  beach: {
    id: 'beach',
    name: 'Beach',
    emoji: '🏖️',
    wallColor: '#8d6e63',
    pathColor: '#ffe082',
    backgroundColor: '#b3e5fc',
    collectibleEmoji: '🐚',
    characterEmoji: '🏄',
    goalEmoji: '🏝️',
    wallStyle: 'sand'
  },
  space: {
    id: 'space',
    name: 'Space',
    emoji: '🚀',
    wallColor: '#1a237e',
    pathColor: '#3f51b5',
    backgroundColor: '#0d1b2a',
    collectibleEmoji: '⭐',
    characterEmoji: '🧑‍🚀',
    goalEmoji: '🌍',
    wallStyle: 'solid'
  },
  underwater: {
    id: 'underwater',
    name: 'Underwater',
    emoji: '🌊',
    wallColor: '#004d40',
    pathColor: '#26a69a',
    backgroundColor: '#80deea',
    collectibleEmoji: '🐠',
    characterEmoji: '🤿',
    goalEmoji: '🐚',
    wallStyle: 'coral'
  },
  mountain: {
    id: 'mountain',
    name: 'Mountain',
    emoji: '⛰️',
    wallColor: '#4e342e',
    pathColor: '#bcaaa4',
    backgroundColor: '#d7ccc8',
    collectibleEmoji: '💎',
    characterEmoji: '🧗',
    goalEmoji: '⛺',
    wallStyle: 'rocks'
  },
  desert: {
    id: 'desert',
    name: 'Desert',
    emoji: '🏜️',
    wallColor: '#d4a574',
    pathColor: '#f4e4c1',
    backgroundColor: '#ffe4b5',
    collectibleEmoji: '🌵',
    characterEmoji: '🐪',
    goalEmoji: '🕌',
    wallStyle: 'sand'
  },
  castle: {
    id: 'castle',
    name: 'Castle',
    emoji: '🏰',
    wallColor: '#5d4037',
    pathColor: '#a1887f',
    backgroundColor: '#d7ccc8',
    collectibleEmoji: '👑',
    characterEmoji: '🤴',
    goalEmoji: '🏰',
    wallStyle: 'stone'
  }
};

/**
 * Maze Generator Class
 */
export class MazeGenerator {
  private grid: MazeCell[][];
  private rows: number;
  private cols: number;
  private config: MazeConfig;

  constructor(config: MazeConfig) {
    this.config = config;
    this.rows = config.rows;
    this.cols = config.cols;
    this.grid = [];
  }

  /**
   * Generate a new maze using Recursive Backtracking algorithm
   */
  generate(): MazeGenerationResult {
    // Initialize grid with all walls
    this.initializeGrid();

    // Generate maze paths using Recursive Backtracking
    const startCell = { row: 0, col: 0 };
    this.recursiveBacktracking(startCell.row, startCell.col);

    // Define start and end positions
    const endCell = { row: this.rows - 1, col: this.cols - 1 };
    this.grid[startCell.row][startCell.col].isStart = true;
    this.grid[endCell.row][endCell.col].isEnd = true;

    // Calculate solution path
    const solution = this.findSolution(startCell, endCell);

    // Place collectibles
    const collectibles = this.placeCollectibles(solution);

    return {
      grid: this.grid,
      startCell,
      endCell,
      solution,
      collectibles,
      config: this.config
    };
  }

  /**
   * Initialize empty grid with all walls intact
   */
  private initializeGrid(): void {
    this.grid = [];
    for (let row = 0; row < this.rows; row++) {
      const gridRow: MazeCell[] = [];
      for (let col = 0; col < this.cols; col++) {
        gridRow.push({
          row,
          col,
          walls: {
            top: true,
            right: true,
            bottom: true,
            left: true
          },
          visited: false
        });
      }
      this.grid.push(gridRow);
    }
  }

  /**
   * Recursive Backtracking algorithm to generate maze
   */
  private recursiveBacktracking(row: number, col: number): void {
    const current = this.grid[row][col];
    current.visited = true;

    // Get unvisited neighbors in random order
    const neighbors = this.getUnvisitedNeighbors(row, col);
    this.shuffleArray(neighbors);

    for (const neighbor of neighbors) {
      if (!neighbor.visited) {
        // Remove wall between current and neighbor
        this.removeWall(current, neighbor);

        // Recursively visit neighbor
        this.recursiveBacktracking(neighbor.row, neighbor.col);
      }
    }
  }

  /**
   * Get unvisited neighboring cells
   */
  private getUnvisitedNeighbors(row: number, col: number): MazeCell[] {
    const neighbors: MazeCell[] = [];

    // Top
    if (row > 0) {
      neighbors.push(this.grid[row - 1][col]);
    }

    // Right
    if (col < this.cols - 1) {
      neighbors.push(this.grid[row][col + 1]);
    }

    // Bottom
    if (row < this.rows - 1) {
      neighbors.push(this.grid[row + 1][col]);
    }

    // Left
    if (col > 0) {
      neighbors.push(this.grid[row][col - 1]);
    }

    return neighbors.filter(n => !n.visited);
  }

  /**
   * Remove wall between two adjacent cells
   */
  private removeWall(current: MazeCell, neighbor: MazeCell): void {
    const rowDiff = neighbor.row - current.row;
    const colDiff = neighbor.col - current.col;

    if (rowDiff === 1) {
      // Neighbor is below
      current.walls.bottom = false;
      neighbor.walls.top = false;
    } else if (rowDiff === -1) {
      // Neighbor is above
      current.walls.top = false;
      neighbor.walls.bottom = false;
    } else if (colDiff === 1) {
      // Neighbor is to the right
      current.walls.right = false;
      neighbor.walls.left = false;
    } else if (colDiff === -1) {
      // Neighbor is to the left
      current.walls.left = false;
      neighbor.walls.right = false;
    }
  }

  /**
   * Find solution path using BFS (Breadth-First Search)
   */
  private findSolution(start: { row: number; col: number }, end: { row: number; col: number }): MazeCell[] {
    const queue: Array<{ cell: MazeCell; path: MazeCell[] }> = [];
    const visited = new Set<string>();

    const startCell = this.grid[start.row][start.col];
    queue.push({ cell: startCell, path: [startCell] });
    visited.add(`${start.row},${start.col}`);

    while (queue.length > 0) {
      const { cell, path } = queue.shift()!;

      // Check if we reached the end
      if (cell.row === end.row && cell.col === end.col) {
        // Mark solution path
        path.forEach(c => {
          this.grid[c.row][c.col].isPath = true;
        });
        return path;
      }

      // Explore accessible neighbors
      const neighbors = this.getAccessibleNeighbors(cell);
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({
            cell: neighbor,
            path: [...path, neighbor]
          });
        }
      }
    }

    return [];
  }

  /**
   * Get accessible neighbors (no wall between)
   */
  private getAccessibleNeighbors(cell: MazeCell): MazeCell[] {
    const neighbors: MazeCell[] = [];
    const { row, col, walls } = cell;

    if (!walls.top && row > 0) {
      neighbors.push(this.grid[row - 1][col]);
    }
    if (!walls.right && col < this.cols - 1) {
      neighbors.push(this.grid[row][col + 1]);
    }
    if (!walls.bottom && row < this.rows - 1) {
      neighbors.push(this.grid[row + 1][col]);
    }
    if (!walls.left && col > 0) {
      neighbors.push(this.grid[row][col - 1]);
    }

    return neighbors;
  }

  /**
   * Place collectibles along solution path and some detours
   */
  private placeCollectibles(solution: MazeCell[]): Array<{ row: number; col: number; type: string }> {
    const collectibles: Array<{ row: number; col: number; type: string }> = [];
    const { collectiblesCount } = this.config;

    // Place collectibles along solution path
    const solutionIndices = this.generateRandomIndices(solution.length - 2, Math.floor(collectiblesCount * 0.6));

    for (const index of solutionIndices) {
      const cell = solution[index + 1]; // Skip start cell
      if (!cell.isStart && !cell.isEnd) {
        cell.hasCollectible = true;
        cell.collectibleType = 'star';
        collectibles.push({
          row: cell.row,
          col: cell.col,
          type: 'star'
        });
      }
    }

    // Place remaining collectibles in random accessible cells
    const remainingCount = collectiblesCount - collectibles.length;
    const allCells = this.grid.flat().filter(c => !c.isStart && !c.isEnd && !c.hasCollectible);
    const randomCells = this.shuffleArray([...allCells]).slice(0, remainingCount);

    for (const cell of randomCells) {
      cell.hasCollectible = true;
      cell.collectibleType = this.getRandomCollectibleType();
      collectibles.push({
        row: cell.row,
        col: cell.col,
        type: cell.collectibleType
      });
    }

    return collectibles;
  }

  /**
   * Generate random indices for collectible placement
   */
  private generateRandomIndices(max: number, count: number): number[] {
    const indices = new Set<number>();
    while (indices.size < count && indices.size < max) {
      indices.add(Math.floor(Math.random() * max));
    }
    return Array.from(indices);
  }

  /**
   * Get random collectible type
   */
  private getRandomCollectibleType(): 'star' | 'key' | 'gem' | 'coin' {
    const types: Array<'star' | 'key' | 'gem' | 'coin'> = ['star', 'star', 'gem', 'coin'];
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
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
   * Get hint: highlight next correct move
   */
  static getHint(grid: MazeCell[][], currentPos: { row: number; col: number }, endPos: { row: number; col: number }): { row: number; col: number } | null {
    // Use BFS to find next step on shortest path
    const queue: Array<{ cell: MazeCell; path: MazeCell[] }> = [];
    const visited = new Set<string>();

    const startCell = grid[currentPos.row][currentPos.col];
    queue.push({ cell: startCell, path: [startCell] });
    visited.add(`${currentPos.row},${currentPos.col}`);

    while (queue.length > 0) {
      const { cell, path } = queue.shift()!;

      if (cell.row === endPos.row && cell.col === endPos.col) {
        // Return next step (index 1 in path)
        if (path.length > 1) {
          return { row: path[1].row, col: path[1].col };
        }
        return null;
      }

      const neighbors = MazeGenerator.getAccessibleNeighborsStatic(grid, cell);
      for (const neighbor of neighbors) {
        const key = `${neighbor.row},${neighbor.col}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push({
            cell: neighbor,
            path: [...path, neighbor]
          });
        }
      }
    }

    return null;
  }

  /**
   * Static version of getAccessibleNeighbors
   */
  private static getAccessibleNeighborsStatic(grid: MazeCell[][], cell: MazeCell): MazeCell[] {
    const neighbors: MazeCell[] = [];
    const { row, col, walls } = cell;
    const rows = grid.length;
    const cols = grid[0].length;

    if (!walls.top && row > 0) {
      neighbors.push(grid[row - 1][col]);
    }
    if (!walls.right && col < cols - 1) {
      neighbors.push(grid[row][col + 1]);
    }
    if (!walls.bottom && row < rows - 1) {
      neighbors.push(grid[row + 1][col]);
    }
    if (!walls.left && col > 0) {
      neighbors.push(grid[row][col - 1]);
    }

    return neighbors;
  }

  /**
   * Check if move is valid (no wall blocking)
   */
  static isValidMove(
    grid: MazeCell[][],
    currentRow: number,
    currentCol: number,
    direction: 'up' | 'down' | 'left' | 'right'
  ): boolean {
    const cell = grid[currentRow][currentCol];
    const rows = grid.length;
    const cols = grid[0].length;

    switch (direction) {
      case 'up':
        return !cell.walls.top && currentRow > 0;
      case 'down':
        return !cell.walls.bottom && currentRow < rows - 1;
      case 'left':
        return !cell.walls.left && currentCol > 0;
      case 'right':
        return !cell.walls.right && currentCol < cols - 1;
      default:
        return false;
    }
  }
}

/**
 * Maze Progress Tracker
 */
export class MazeProgressTracker {
  private static STORAGE_KEY = 'maze_progress';

  static saveMazeCompletion(mazeId: string, stats: {
    difficulty: string;
    theme: string;
    time: number;
    moves: number;
    collectibles: number;
    totalCollectibles: number;
  }): void {
    const progress = this.getProgress();

    if (!progress[mazeId]) {
      progress[mazeId] = {
        completions: 0,
        bestTime: Infinity,
        bestMoves: Infinity,
        totalStars: 0
      };
    }

    const maze = progress[mazeId];
    maze.completions += 1;
    maze.bestTime = Math.min(maze.bestTime, stats.time);
    maze.bestMoves = Math.min(maze.bestMoves, stats.moves);

    // Calculate stars earned (1-3 based on performance)
    const stars = this.calculateStars(stats);
    maze.totalStars += stars;

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(progress));
  }

  static getProgress(): Record<string, {
    completions: number;
    bestTime: number;
    bestMoves: number;
    totalStars: number;
  }> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  static getMazeStats(mazeId: string) {
    const progress = this.getProgress();
    return progress[mazeId] || null;
  }

  static getTotalCompletions(): number {
    const progress = this.getProgress();
    return Object.values(progress).reduce((sum, maze) => sum + maze.completions, 0);
  }

  static calculateStars(stats: {
    time: number;
    moves: number;
    collectibles: number;
    totalCollectibles: number;
  }): number {
    let stars = 1; // Base star for completion

    // Bonus star for collecting all items
    if (stats.collectibles === stats.totalCollectibles) {
      stars += 1;
    }

    // Bonus star for efficiency (low moves relative to optimal)
    const optimalMoves = Math.sqrt(stats.totalCollectibles) * 20; // Rough estimate
    if (stats.moves < optimalMoves * 1.5) {
      stars += 1;
    }

    return Math.min(stars, 3);
  }
}

/**
 * Create maze configuration based on difficulty
 */
export function createMazeConfig(difficulty: 'easy' | 'medium' | 'hard', theme: MazeTheme): MazeConfig {
  const configs = {
    easy: { rows: 10, cols: 10, collectiblesCount: 5 },
    medium: { rows: 15, cols: 15, collectiblesCount: 10 },
    hard: { rows: 20, cols: 20, collectiblesCount: 15 }
  };

  const config = configs[difficulty];
  return {
    ...config,
    difficulty,
    theme
  };
}

/**
 * Generate a random daily maze (same for all users on same day)
 */
export function generateDailyMaze(theme: MazeTheme): MazeGenerationResult {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  // Use seed to determine difficulty (cycles through difficulties)
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
  const difficulty = difficulties[seed % 3];

  const config = createMazeConfig(difficulty, theme);
  const generator = new MazeGenerator(config);
  return generator.generate();
}
