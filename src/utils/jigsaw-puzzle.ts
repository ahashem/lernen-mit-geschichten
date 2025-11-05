export interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  x: number; // Current position
  y: number;
  correctX: number; // Correct position
  correctY: number;
  width: number;
  height: number;
  isPlaced: boolean;
  imageData?: string; // Base64 or URL for piece
}

export interface PuzzleConfig {
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  gridSize: number; // 3, 4, 5, or 6
  snapTolerance: number; // pixels
  containerWidth: number;
  containerHeight: number;
  imageUrl: string;
}

export interface PuzzleState {
  pieces: PuzzlePiece[];
  placedCount: number;
  startTime: number | null;
  endTime: number | null;
  isComplete: boolean;
  hintsUsed: number;
}

/**
 * Create puzzle configuration from difficulty level
 */
export function createPuzzleConfig(
  difficulty: 'easy' | 'medium' | 'hard' | 'expert',
  imageUrl: string,
  containerWidth: number = 600,
  containerHeight: number = 600
): PuzzleConfig {
  const gridSizeMap = {
    easy: 3, // 9 pieces
    medium: 4, // 16 pieces
    hard: 5, // 25 pieces
    expert: 6, // 36 pieces
  };

  return {
    difficulty,
    gridSize: gridSizeMap[difficulty],
    snapTolerance: 20,
    containerWidth,
    containerHeight,
    imageUrl,
  };
}

/**
 * Generate puzzle pieces from configuration
 */
export async function generatePuzzlePieces(
  config: PuzzleConfig,
  canvas?: HTMLCanvasElement
): Promise<PuzzlePiece[]> {
  const { gridSize, containerWidth, containerHeight } = config;
  const pieceWidth = containerWidth / gridSize;
  const pieceHeight = containerHeight / gridSize;
  const pieces: PuzzlePiece[] = [];

  let pieceId = 0;

  // Create pieces in grid order
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const correctX = col * pieceWidth;
      const correctY = row * pieceHeight;

      pieces.push({
        id: pieceId++,
        row,
        col,
        x: 0, // Will be randomized
        y: 0,
        correctX,
        correctY,
        width: pieceWidth,
        height: pieceHeight,
        isPlaced: false,
      });
    }
  }

  return pieces;
}

/**
 * Randomize piece positions around the puzzle area
 */
export function randomizePiecePositions(
  pieces: PuzzlePiece[],
  containerWidth: number,
  containerHeight: number,
  shuffleAreaPadding: number = 100
): PuzzlePiece[] {
  return pieces.map((piece) => {
    // Position pieces in a random area around the puzzle
    const randomX =
      Math.random() * (containerWidth + shuffleAreaPadding * 2) - shuffleAreaPadding;
    const randomY =
      Math.random() * (containerHeight + shuffleAreaPadding * 2) - shuffleAreaPadding;

    return {
      ...piece,
      x: randomX,
      y: randomY,
    };
  });
}

/**
 * Check if piece is close enough to snap to correct position
 */
export function shouldSnapPiece(
  piece: PuzzlePiece,
  tolerance: number
): { shouldSnap: boolean; snapX: number; snapY: number } {
  const dx = Math.abs(piece.x - piece.correctX);
  const dy = Math.abs(piece.y - piece.correctY);
  const shouldSnap = dx <= tolerance && dy <= tolerance;

  return {
    shouldSnap,
    snapX: piece.correctX,
    snapY: piece.correctY,
  };
}

/**
 * Update puzzle state after piece placement
 */
export function updatePuzzleState(
  state: PuzzleState,
  pieceId: number,
  newPosition: { x: number; y: number }
): PuzzleState {
  const pieces = state.pieces.map((piece) => {
    if (piece.id === pieceId) {
      const snapResult = shouldSnapPiece(
        { ...piece, x: newPosition.x, y: newPosition.y },
        20 // Default tolerance
      );

      if (snapResult.shouldSnap && !piece.isPlaced) {
        // Snap to correct position
        return {
          ...piece,
          x: snapResult.snapX,
          y: snapResult.snapY,
          isPlaced: true,
        };
      } else {
        // Update to dragged position
        return {
          ...piece,
          x: newPosition.x,
          y: newPosition.y,
        };
      }
    }
    return piece;
  });

  const placedCount = pieces.filter((p) => p.isPlaced).length;
  const isComplete = placedCount === pieces.length;

  return {
    ...state,
    pieces,
    placedCount,
    isComplete,
    endTime: isComplete ? Date.now() : state.endTime,
  };
}

/**
 * Get hint pieces (show 1-3 pieces in correct position)
 */
export function getHintPieces(pieces: PuzzlePiece[], count: number = 1): number[] {
  const unplacedPieces = pieces.filter((p) => !p.isPlaced);
  const hintCount = Math.min(count, unplacedPieces.length);
  const hints: number[] = [];

  for (let i = 0; i < hintCount; i++) {
    const randomIndex = Math.floor(Math.random() * unplacedPieces.length);
    hints.push(unplacedPieces[randomIndex].id);
    unplacedPieces.splice(randomIndex, 1);
  }

  return hints;
}

/**
 * Apply hint to puzzle state (move hint pieces to correct position)
 */
export function applyHint(state: PuzzleState, hintPieceIds: number[]): PuzzleState {
  const pieces = state.pieces.map((piece) => {
    if (hintPieceIds.includes(piece.id) && !piece.isPlaced) {
      return {
        ...piece,
        x: piece.correctX,
        y: piece.correctY,
        isPlaced: true,
      };
    }
    return piece;
  });

  const placedCount = pieces.filter((p) => p.isPlaced).length;
  const isComplete = placedCount === pieces.length;

  return {
    ...state,
    pieces,
    placedCount,
    isComplete,
    hintsUsed: state.hintsUsed + hintPieceIds.length,
    endTime: isComplete ? Date.now() : state.endTime,
  };
}

/**
 * Calculate completion time in seconds
 */
export function getCompletionTime(state: PuzzleState): number | null {
  if (!state.startTime || !state.endTime) return null;
  return Math.floor((state.endTime - state.startTime) / 1000);
}

/**
 * Save puzzle state to localStorage
 */
export function savePuzzleState(puzzleId: string, state: PuzzleState): void {
  if (typeof localStorage === 'undefined') return;

  try {
    localStorage.setItem(`puzzle-state-${puzzleId}`, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save puzzle state:', error);
  }
}

/**
 * Load puzzle state from localStorage
 */
export function loadPuzzleState(puzzleId: string): PuzzleState | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    const saved = localStorage.getItem(`puzzle-state-${puzzleId}`);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load puzzle state:', error);
    return null;
  }
}

/**
 * Get best time for a puzzle from localStorage
 */
export function getBestTime(puzzleId: string, difficulty: string): number | null {
  if (typeof localStorage === 'undefined') return null;

  try {
    const key = `puzzle-best-time-${puzzleId}-${difficulty}`;
    const saved = localStorage.getItem(key);
    return saved ? parseInt(saved, 10) : null;
  } catch (error) {
    console.error('Failed to get best time:', error);
    return null;
  }
}

/**
 * Save best time for a puzzle to localStorage
 */
export function saveBestTime(
  puzzleId: string,
  difficulty: string,
  time: number
): void {
  if (typeof localStorage === 'undefined') return;

  try {
    const key = `puzzle-best-time-${puzzleId}-${difficulty}`;
    const currentBest = getBestTime(puzzleId, difficulty);

    if (currentBest === null || time < currentBest) {
      localStorage.setItem(key, time.toString());
    }
  } catch (error) {
    console.error('Failed to save best time:', error);
  }
}

/**
 * Format time in MM:SS format
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Create initial puzzle state
 */
export function createInitialPuzzleState(pieces: PuzzlePiece[]): PuzzleState {
  return {
    pieces,
    placedCount: 0,
    startTime: null,
    endTime: null,
    isComplete: false,
    hintsUsed: 0,
  };
}

/**
 * Reset puzzle (shuffle pieces again)
 */
export function resetPuzzle(
  state: PuzzleState,
  containerWidth: number,
  containerHeight: number
): PuzzleState {
  const resetPieces = state.pieces.map((piece) => ({
    ...piece,
    isPlaced: false,
  }));

  const shuffledPieces = randomizePiecePositions(
    resetPieces,
    containerWidth,
    containerHeight
  );

  return {
    pieces: shuffledPieces,
    placedCount: 0,
    startTime: null,
    endTime: null,
    isComplete: false,
    hintsUsed: 0,
  };
}
