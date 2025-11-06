/**
 * Story Sequencing Game - Logic and Event Extraction
 * Helps children learn narrative structure by arranging story events in correct order
 */

export interface StoryEvent {
  id: string;
  text: string;
  order: number;
  act: 'beginning' | 'middle' | 'end';
  characterEmoji?: string;
  hint?: string;
  imageUrl?: string;
}

export interface SequencingGameConfig {
  storyId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  events: StoryEvent[];
  timeLimit?: number; // seconds
  maxAttempts?: number;
}

export interface GameState {
  currentOrder: StoryEvent[];
  attempts: number;
  hintsUsed: number;
  startTime: number;
  completed: boolean;
  score: number;
  stars: 1 | 2 | 3;
}

/**
 * Extract key events from story content
 * This parses story markdown and identifies plot points
 */
export function extractEventsFromStory(
  storyContent: string,
  storyEmoji: string,
  difficulty: 'easy' | 'medium' | 'hard'
): StoryEvent[] {
  // Split story into paragraphs
  const paragraphs = storyContent
    .split('\n')
    .filter((p) => p.trim() && !p.startsWith('#') && !p.startsWith('-'))
    .map((p) => p.trim());

  // Determine how many events based on difficulty
  const eventCounts = { easy: 4, medium: 6, hard: 10 };
  const targetCount = eventCounts[difficulty];

  // Select key paragraphs evenly distributed
  const events: StoryEvent[] = [];
  const step = Math.floor(paragraphs.length / targetCount);

  for (let i = 0; i < targetCount && i * step < paragraphs.length; i++) {
    const idx = i * step;
    const paragraph = paragraphs[idx];

    // Determine act based on position
    let act: 'beginning' | 'middle' | 'end';
    const position = i / (targetCount - 1);
    if (position < 0.33) act = 'beginning';
    else if (position < 0.66) act = 'middle';
    else act = 'end';

    // Create concise event description (max 2 sentences)
    const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
    const eventText = sentences.slice(0, 2).join(' ').trim();

    events.push({
      id: `event-${i + 1}`,
      text: eventText,
      order: i + 1,
      act,
      characterEmoji: storyEmoji,
      hint: generateHint(i + 1, targetCount, act),
    });
  }

  return events;
}

/**
 * Generate contextual hint for event positioning
 */
function generateHint(position: number, total: number, act: string): string {
  const positionHints = {
    beginning: 'Dies passiert am Anfang der Geschichte',
    middle: 'Dies passiert in der Mitte der Geschichte',
    end: 'Dies passiert am Ende der Geschichte',
  };

  return positionHints[act as keyof typeof positionHints];
}

/**
 * Shuffle events array for gameplay
 */
export function shuffleEvents(events: StoryEvent[]): StoryEvent[] {
  const shuffled = [...events];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validate if current order is correct
 */
export function validateSequence(currentOrder: StoryEvent[]): {
  isCorrect: boolean;
  correctCount: number;
  errors: { index: number; correct: number; current: number }[];
} {
  let correctCount = 0;
  const errors: { index: number; correct: number; current: number }[] = [];

  currentOrder.forEach((event, index) => {
    const correctPosition = event.order - 1;
    if (index === correctPosition) {
      correctCount++;
    } else {
      errors.push({
        index,
        correct: correctPosition,
        current: index,
      });
    }
  });

  return {
    isCorrect: correctCount === currentOrder.length,
    correctCount,
    errors,
  };
}

/**
 * Calculate score based on performance
 */
export function calculateScore(
  attempts: number,
  hintsUsed: number,
  timeSeconds: number,
  maxTime: number = 300
): { score: number; stars: 1 | 2 | 3 } {
  let score = 1000;

  // Deduct for attempts
  score -= (attempts - 1) * 100;

  // Deduct for hints
  score -= hintsUsed * 50;

  // Deduct for time (if time limit enabled)
  if (maxTime > 0) {
    const timeRatio = Math.min(timeSeconds / maxTime, 1);
    score -= Math.floor(timeRatio * 200);
  }

  // Ensure minimum score
  score = Math.max(score, 100);

  // Determine stars
  let stars: 1 | 2 | 3;
  if (score >= 900 && hintsUsed === 0 && attempts === 1) stars = 3;
  else if (score >= 700) stars = 2;
  else stars = 1;

  return { score, stars };
}

/**
 * Save game progress to localStorage
 */
export function saveProgress(storyId: string, state: GameState): void {
  const key = `sequencing-${storyId}`;
  localStorage.setItem(key, JSON.stringify(state));
}

/**
 * Load game progress from localStorage
 */
export function loadProgress(storyId: string): GameState | null {
  const key = `sequencing-${storyId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Get or create game statistics
 */
export function getGameStats(): {
  gamesPlayed: number;
  gamesCompleted: number;
  perfectGames: number;
  totalStars: number;
  averageTime: number;
} {
  const key = 'sequencing-stats';
  const data = localStorage.getItem(key);
  return data
    ? JSON.parse(data)
    : {
        gamesPlayed: 0,
        gamesCompleted: 0,
        perfectGames: 0,
        totalStars: 0,
        averageTime: 0,
      };
}

/**
 * Update game statistics
 */
export function updateGameStats(
  completed: boolean,
  stars: number,
  timeSeconds: number,
  perfect: boolean
): void {
  const stats = getGameStats();

  stats.gamesPlayed++;
  if (completed) {
    stats.gamesCompleted++;
    stats.totalStars += stars;
    stats.averageTime =
      (stats.averageTime * (stats.gamesCompleted - 1) + timeSeconds) / stats.gamesCompleted;
  }
  if (perfect) {
    stats.perfectGames++;
  }

  localStorage.setItem('sequencing-stats', JSON.stringify(stats));
}

/**
 * Award stars for completing game
 */
export function awardStars(stars: number): void {
  const key = 'star-balance';
  const current = parseInt(localStorage.getItem(key) || '0', 10);
  const starRewards = { 1: 10, 2: 15, 3: 20 };
  const reward = starRewards[stars as keyof typeof starRewards] || 10;
  localStorage.setItem(key, String(current + reward));
}

/**
 * Check if story is unlocked for sequencing game
 */
export function isStoryUnlocked(storyId: string, requiredStars: number = 0): boolean {
  const starBalance = parseInt(localStorage.getItem('star-balance') || '0', 10);
  return starBalance >= requiredStars;
}

/**
 * Get recommended hint for current position
 */
export function getHintForPosition(
  events: StoryEvent[],
  currentOrder: StoryEvent[],
  positionIndex: number
): string | null {
  const correctEvent = events.find((e) => e.order === positionIndex + 1);
  if (!correctEvent) return null;

  const currentEvent = currentOrder[positionIndex];
  if (currentEvent && currentEvent.id === correctEvent.id) {
    return null; // Already correct
  }

  return `Tipp: An dieser Position sollte ein Ereignis aus dem ${correctEvent.act === 'beginning' ? 'Anfang' : correctEvent.act === 'middle' ? 'Mittelteil' : 'Ende'} stehen.`;
}
