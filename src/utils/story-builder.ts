/**
 * Story Builder Utilities
 * Data structures and helpers for the kid-friendly story creation feature
 */

export interface StoryEvent {
  id: string;
  type: 'action' | 'emotion' | 'dialogue' | 'custom';
  text: string;
  character?: string;
  illustration?: string;
}

export interface CreatedStory {
  id: string;
  title: string;
  author: string; // Kid's name (optional)
  character: string;
  secondaryCharacters: string[];
  setting: string;
  events: StoryEvent[];
  mood: 'happy' | 'adventurous' | 'calm' | 'funny' | 'mysterious' | 'exciting';
  illustrations: string[];
  music: string;
  createdAt: number;
  lastModified: number;
  template?: string;
}

export interface StoryCard {
  id: string;
  type: 'action' | 'emotion' | 'dialogue' | 'challenge' | 'resolution';
  text: string;
  emoji: string;
  category: string;
}

export interface Character {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
}

export interface Setting {
  id: string;
  name: string;
  emoji: string;
  unlocked: boolean;
}

// Available characters (from existing stories)
export const CHARACTERS: Character[] = [
  { id: 'bruno', name: 'Bruno der Bär', emoji: '🐻', unlocked: true },
  { id: 'fritz', name: 'Fritz der Fuchs', emoji: '🦊', unlocked: true },
  { id: 'lina', name: 'Lina die Löwin', emoji: '🦁', unlocked: true },
  { id: 'mila', name: 'Mila die Maus', emoji: '🐭', unlocked: true },
  { id: 'tobi', name: 'Tobi der Tiger', emoji: '🐯', unlocked: true },
  { id: 'moritz', name: 'Moritz der Hund', emoji: '🐶', unlocked: true },
  { id: 'leo', name: 'Leo der Hase', emoji: '🐰', unlocked: true },
  { id: 'timmi', name: 'Timmi', emoji: '👦', unlocked: true },
  { id: 'elephant', name: 'Ella der Elefant', emoji: '🐘', unlocked: false },
  { id: 'panda', name: 'Pino der Panda', emoji: '🐼', unlocked: false },
  { id: 'owl', name: 'Otto die Eule', emoji: '🦉', unlocked: false },
  { id: 'penguin', name: 'Penny der Pinguin', emoji: '🐧', unlocked: false },
];

// Available settings
export const SETTINGS: Setting[] = [
  { id: 'forest', name: 'Wald', emoji: '🌲', unlocked: true },
  { id: 'city', name: 'Stadt', emoji: '🏙️', unlocked: true },
  { id: 'beach', name: 'Strand', emoji: '🏖️', unlocked: true },
  { id: 'home', name: 'Zuhause', emoji: '🏠', unlocked: true },
  { id: 'space', name: 'Weltraum', emoji: '🚀', unlocked: false },
  { id: 'underwater', name: 'Unterwasser', emoji: '🌊', unlocked: false },
  { id: 'mountain', name: 'Berge', emoji: '⛰️', unlocked: false },
  { id: 'farm', name: 'Bauernhof', emoji: '🚜', unlocked: false },
];

// Pre-made story cards for drag-and-drop
export const STORY_CARDS: StoryCard[] = [
  // Actions
  { id: 'a1', type: 'action', text: 'geht auf Abenteuer', emoji: '🗺️', category: 'action' },
  { id: 'a2', type: 'action', text: 'findet einen Freund', emoji: '👋', category: 'action' },
  { id: 'a3', type: 'action', text: 'löst ein Rätsel', emoji: '🧩', category: 'action' },
  { id: 'a4', type: 'action', text: 'hilft jemandem', emoji: '🤝', category: 'action' },
  { id: 'a5', type: 'action', text: 'findet einen Schatz', emoji: '💎', category: 'action' },
  { id: 'a6', type: 'action', text: 'lernt etwas Neues', emoji: '📚', category: 'action' },
  { id: 'a7', type: 'action', text: 'rennt schnell', emoji: '💨', category: 'action' },
  { id: 'a8', type: 'action', text: 'klettert auf einen Baum', emoji: '🌳', category: 'action' },
  { id: 'a9', type: 'action', text: 'schwimmt durchs Wasser', emoji: '🏊', category: 'action' },
  { id: 'a10', type: 'action', text: 'fliegt hoch', emoji: '🦅', category: 'action' },
  { id: 'a11', type: 'action', text: 'gräbt tief', emoji: '⛏️', category: 'action' },
  { id: 'a12', type: 'action', text: 'baut etwas Tolles', emoji: '🏗️', category: 'action' },

  // Emotions
  { id: 'e1', type: 'emotion', text: 'fühlt sich glücklich', emoji: '😊', category: 'emotion' },
  { id: 'e2', type: 'emotion', text: 'wird ängstlich', emoji: '😰', category: 'emotion' },
  { id: 'e3', type: 'emotion', text: 'wird mutig', emoji: '💪', category: 'emotion' },
  { id: 'e4', type: 'emotion', text: 'fühlt sich traurig', emoji: '😢', category: 'emotion' },
  { id: 'e5', type: 'emotion', text: 'wird aufgeregt', emoji: '🤩', category: 'emotion' },
  { id: 'e6', type: 'emotion', text: 'ist überrascht', emoji: '😲', category: 'emotion' },
  { id: 'e7', type: 'emotion', text: 'fühlt sich stolz', emoji: '🎖️', category: 'emotion' },
  { id: 'e8', type: 'emotion', text: 'wird neugierig', emoji: '🔍', category: 'emotion' },

  // Dialogues
  { id: 'd1', type: 'dialogue', text: 'sagt "Hallo Freund!"', emoji: '💬', category: 'dialogue' },
  { id: 'd2', type: 'dialogue', text: 'fragt "Kannst du mir helfen?"', emoji: '❓', category: 'dialogue' },
  { id: 'd3', type: 'dialogue', text: 'ruft "Ich habe es geschafft!"', emoji: '🎉', category: 'dialogue' },
  { id: 'd4', type: 'dialogue', text: 'sagt "Lass uns zusammen spielen!"', emoji: '🎮', category: 'dialogue' },
  { id: 'd5', type: 'dialogue', text: 'flüstert "Das ist unser Geheimnis"', emoji: '🤫', category: 'dialogue' },

  // Challenges
  { id: 'ch1', type: 'challenge', text: 'findet einen verschlossenen Weg', emoji: '🚧', category: 'challenge' },
  { id: 'ch2', type: 'challenge', text: 'verliert etwas Wichtiges', emoji: '🔑', category: 'challenge' },
  { id: 'ch3', type: 'challenge', text: 'muss eine schwere Wahl treffen', emoji: '🤔', category: 'challenge' },
  { id: 'ch4', type: 'challenge', text: 'steht vor einem großen Hindernis', emoji: '🧱', category: 'challenge' },
  { id: 'ch5', type: 'challenge', text: 'fühlt sich allein', emoji: '😔', category: 'challenge' },

  // Resolutions
  { id: 'r1', type: 'resolution', text: 'findet die Lösung', emoji: '💡', category: 'resolution' },
  { id: 'r2', type: 'resolution', text: 'bekommt Hilfe von Freunden', emoji: '👫', category: 'resolution' },
  { id: 'r3', type: 'resolution', text: 'gibt nicht auf', emoji: '🌟', category: 'resolution' },
  { id: 'r4', type: 'resolution', text: 'teilt mit anderen', emoji: '🎁', category: 'resolution' },
  { id: 'r5', type: 'resolution', text: 'lernt aus dem Fehler', emoji: '📖', category: 'resolution' },
  { id: 'r6', type: 'resolution', text: 'wird zum Helden', emoji: '🦸', category: 'resolution' },
];

// Story templates
export const TEMPLATES = {
  adventure: {
    name: 'Abenteuer-Geschichte',
    events: ['a1', 'e5', 'ch1', 'e3', 'r1', 'r6'],
    mood: 'adventurous' as const,
  },
  friendship: {
    name: 'Freundschafts-Geschichte',
    events: ['a2', 'e1', 'd1', 'ch5', 'r2', 'e1'],
    mood: 'happy' as const,
  },
  problemSolving: {
    name: 'Problemlösungs-Geschichte',
    events: ['e8', 'a3', 'ch3', 'e2', 'r1', 'e7'],
    mood: 'exciting' as const,
  },
  learning: {
    name: 'Lern-Geschichte',
    events: ['a6', 'e8', 'ch2', 'r5', 'e1', 'e7'],
    mood: 'calm' as const,
  },
  bedtime: {
    name: 'Gute-Nacht-Geschichte',
    events: ['e1', 'a2', 'd4', 'e1', 'r4', 'e1'],
    mood: 'calm' as const,
  },
  funny: {
    name: 'Lustige Geschichte',
    events: ['a7', 'e6', 'd5', 'ch4', 'r3', 'e1'],
    mood: 'funny' as const,
  },
};

// LocalStorage helpers
const STORAGE_KEY = 'created-stories';
const UNLOCK_KEY = 'story-builder-unlocks';

export function saveStory(story: CreatedStory): void {
  const stories = getStoredStories();
  const existingIndex = stories.findIndex(s => s.id === story.id);

  if (existingIndex >= 0) {
    stories[existingIndex] = { ...story, lastModified: Date.now() };
  } else {
    stories.push(story);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));

  // Check for unlocks
  checkUnlocks(stories.length);
}

export function getStoredStories(): CreatedStory[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function deleteStory(id: string): void {
  const stories = getStoredStories().filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
}

export function getStoryById(id: string): CreatedStory | undefined {
  return getStoredStories().find(s => s.id === id);
}

// Unlock system
export function checkUnlocks(storyCount: number): void {
  const unlocks = getUnlocks();

  if (storyCount >= 3 && !unlocks.extraCharacters) {
    unlocks.extraCharacters = true;
    unlockCharacters(['elephant', 'panda']);
  }

  if (storyCount >= 5 && !unlocks.extraSettings) {
    unlocks.extraSettings = true;
    unlockSettings(['space', 'underwater']);
  }

  if (storyCount >= 10 && !unlocks.allContent) {
    unlocks.allContent = true;
    unlockCharacters(['owl', 'penguin']);
    unlockSettings(['mountain', 'farm']);
  }

  localStorage.setItem(UNLOCK_KEY, JSON.stringify(unlocks));
}

export function getUnlocks(): {
  extraCharacters: boolean;
  extraSettings: boolean;
  allContent: boolean;
} {
  const stored = localStorage.getItem(UNLOCK_KEY);
  return stored
    ? JSON.parse(stored)
    : { extraCharacters: false, extraSettings: false, allContent: false };
}

function unlockCharacters(ids: string[]): void {
  CHARACTERS.forEach(char => {
    if (ids.includes(char.id)) {
      char.unlocked = true;
    }
  });
}

function unlockSettings(ids: string[]): void {
  SETTINGS.forEach(setting => {
    if (ids.includes(setting.id)) {
      setting.unlocked = true;
    }
  });
}

// Generate shareable link (base64 encoded story data)
export function generateShareLink(story: CreatedStory): string {
  const storyData = JSON.stringify(story);
  const encoded = btoa(unescape(encodeURIComponent(storyData)));
  return `${window.location.origin}/story-viewer?data=${encoded}`;
}

// Decode shared story from URL
export function decodeSharedStory(encodedData: string): CreatedStory | null {
  try {
    const decoded = decodeURIComponent(escape(atob(encodedData)));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

// Generate unique ID
export function generateId(): string {
  return `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
