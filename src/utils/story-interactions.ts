/**
 * Interactive Story Elements System
 * Handles clickable characters, animations, vocabulary tooltips, and mini-games
 */

import { soundEffects } from './sound-effects';

export type InteractionType =
  | 'character'
  | 'object'
  | 'vocabulary'
  | 'easter-egg'
  | 'mini-game'
  | 'sound'
  | 'animation';

export type CharacterAction =
  | 'wave'
  | 'jump'
  | 'dance'
  | 'speak'
  | 'hide'
  | 'bounce'
  | 'wiggle'
  | 'spin';

export type AnimationType =
  | 'bounce'
  | 'wiggle'
  | 'shake'
  | 'spin'
  | 'float'
  | 'drift'
  | 'sway'
  | 'pulse'
  | 'glow'
  | 'shimmer'
  | 'fade-in'
  | 'fade-out'
  | 'slide'
  | 'zoom'
  | 'flutter'
  | 'path';

export interface Position {
  x: number | string;
  y: number | string;
}

export interface InteractiveElement {
  id: string;
  type: InteractionType;
  position?: Position;
  animation?: AnimationType;
  sound?: string;
  onClick?: () => void;
  state?: 'idle' | 'active' | 'completed';
  metadata?: Record<string, any>;
}

export interface CharacterReaction {
  character: string;
  action: CharacterAction;
  sound?: string;
  dialogue?: string;
  duration: number;
}

export interface VocabularyDefinition {
  word: string;
  definition: string;
  translations?: Record<string, string>; // lang -> translation
  pronunciation?: string;
  illustration?: string;
}

export interface MiniGame {
  id: string;
  type: 'count' | 'find' | 'drag-sort' | 'color-match' | 'pattern';
  question: string;
  correctAnswer: string | number | string[];
  reward?: 'star' | 'coin' | 'sticker' | 'badge';
}

export interface EasterEgg {
  id: string;
  position: Position;
  reward: string;
  discovered: boolean;
}

/**
 * Parse interactive markdown syntax
 */
export class InteractiveParser {
  /**
   * Parse [[character:name:action:x=50%:y=30%]] syntax
   */
  static parseCharacter(text: string): InteractiveElement | null {
    const pattern = /\[\[character:([\w-]+):([\w-]+)(?::x=([\d%]+))?(?::y=([\d%]+))?\]\]/;
    const match = text.match(pattern);

    if (!match) return null;

    const [, character, action, x = '50%', y = '50%'] = match;

    return {
      id: `character-${character}-${Date.now()}`,
      type: 'character',
      position: { x, y },
      metadata: { character, action },
      state: 'idle',
    };
  }

  /**
   * Parse [[animate:element:type:duration=3s]] syntax
   */
  static parseAnimation(text: string): InteractiveElement | null {
    const pattern = /\[\[animate:([\w-]+):([\w-]+)(?::duration=([\ds]+))?\]\]/;
    const match = text.match(pattern);

    if (!match) return null;

    const [, element, animationType, duration = '3s'] = match;

    return {
      id: `animate-${element}-${Date.now()}`,
      type: 'animation',
      animation: animationType as AnimationType,
      metadata: { element, duration },
      state: 'idle',
    };
  }

  /**
   * Parse **[word]** interactive vocabulary syntax
   */
  static parseVocabulary(text: string): VocabularyDefinition[] {
    const pattern = /\*\*\[([\w\säöüÄÖÜß]+)\]\*\*/g;
    const definitions: VocabularyDefinition[] = [];
    let match;

    while ((match = pattern.exec(text)) !== null) {
      definitions.push({
        word: match[1],
        definition: '', // To be filled from vocabulary database
      });
    }

    return definitions;
  }

  /**
   * Parse [[easter-egg:id=secret:x=50%:y=30%]] syntax
   */
  static parseEasterEgg(text: string): EasterEgg | null {
    const pattern = /\[\[easter-egg:id=([\w-]+)(?::x=([\d%]+))?(?::y=([\d%]+))?\]\]/;
    const match = text.match(pattern);

    if (!match) return null;

    const [, id, x = '50%', y = '30%'] = match;

    return {
      id,
      position: { x, y },
      reward: 'star',
      discovered: false,
    };
  }

  /**
   * Parse [[sound:name:loop=true]] syntax
   */
  static parseSound(text: string): InteractiveElement | null {
    const pattern = /\[\[sound:([\w-]+)(?::loop=(true|false))?\]\]/;
    const match = text.match(pattern);

    if (!match) return null;

    const [, soundName, loop = 'false'] = match;

    return {
      id: `sound-${soundName}-${Date.now()}`,
      type: 'sound',
      sound: soundName,
      metadata: { loop: loop === 'true' },
      state: 'idle',
    };
  }

  /**
   * Parse [[mini-game:type:correct=answer]] syntax
   */
  static parseMiniGame(text: string): MiniGame | null {
    const pattern = /\[\[mini-game:([\w-]+):correct=([\w\d]+)(?::reward=([\w-]+))?\]\]/;
    const match = text.match(pattern);

    if (!match) return null;

    const [, type, correctAnswer, reward = 'star'] = match;

    return {
      id: `mini-game-${type}-${Date.now()}`,
      type: type as MiniGame['type'],
      question: '', // To be filled from context
      correctAnswer,
      reward: reward as MiniGame['reward'],
    };
  }

  /**
   * Parse all interactive elements from markdown text
   */
  static parseAll(text: string): {
    characters: InteractiveElement[];
    animations: InteractiveElement[];
    vocabulary: VocabularyDefinition[];
    easterEggs: EasterEgg[];
    sounds: InteractiveElement[];
    miniGames: MiniGame[];
  } {
    return {
      characters: this.extractMatches(text, this.parseCharacter.bind(this)),
      animations: this.extractMatches(text, this.parseAnimation.bind(this)),
      vocabulary: this.parseVocabulary(text),
      easterEggs: this.extractMatches(text, this.parseEasterEgg.bind(this)),
      sounds: this.extractMatches(text, this.parseSound.bind(this)),
      miniGames: this.extractMatches(text, this.parseMiniGame.bind(this)),
    };
  }

  private static extractMatches<T>(text: string, parser: (text: string) => T | null): T[] {
    const results: T[] = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const result = parser(line);
      if (result) {
        results.push(result);
      }
    }

    return results;
  }
}

/**
 * Character Reaction Manager
 */
export class CharacterReactionManager {
  private reactions: Map<string, CharacterReaction[]> = new Map();

  constructor() {
    this.initializeDefaultReactions();
  }

  private initializeDefaultReactions() {
    // Bruno the bear reactions
    this.reactions.set('bruno', [
      { character: 'bruno', action: 'wave', sound: 'character-wave', dialogue: 'Hallo! 👋', duration: 1000 },
      { character: 'bruno', action: 'jump', sound: 'character-jump', dialogue: 'Juhu! 🎉', duration: 800 },
      { character: 'bruno', action: 'dance', sound: 'character-dance', dialogue: '💃', duration: 1500 },
      { character: 'bruno', action: 'bounce', sound: 'bounce', dialogue: '', duration: 500 },
    ]);

    // Mila the owl reactions
    this.reactions.set('mila', [
      { character: 'mila', action: 'wave', sound: 'character-wave', dialogue: 'Huhu! 🦉', duration: 1000 },
      { character: 'mila', action: 'flutter', sound: 'flutter', dialogue: '*flatter flatter*', duration: 1200 },
    ]);

    // Generic animal reactions
    this.reactions.set('default', [
      { character: 'default', action: 'wiggle', sound: 'wiggle', dialogue: '', duration: 600 },
      { character: 'default', action: 'bounce', sound: 'bounce', dialogue: '', duration: 500 },
    ]);
  }

  getReaction(character: string, action?: CharacterAction): CharacterReaction {
    const characterReactions = this.reactions.get(character) || this.reactions.get('default') || [];

    if (action) {
      const specific = characterReactions.find(r => r.action === action);
      if (specific) return specific;
    }

    // Return random reaction
    return characterReactions[Math.floor(Math.random() * characterReactions.length)] || {
      character,
      action: 'bounce',
      duration: 500,
    };
  }

  addReaction(character: string, reaction: CharacterReaction) {
    if (!this.reactions.has(character)) {
      this.reactions.set(character, []);
    }
    this.reactions.get(character)!.push(reaction);
  }
}

/**
 * Easter Egg Manager
 */
export class EasterEggManager {
  private eggs: Map<string, EasterEgg> = new Map();
  private storageKey = 'story-easter-eggs';

  constructor(private storyId: string) {
    this.loadProgress();
  }

  addEgg(egg: EasterEgg) {
    this.eggs.set(egg.id, egg);
  }

  discover(eggId: string): boolean {
    const egg = this.eggs.get(eggId);
    if (!egg || egg.discovered) return false;

    egg.discovered = true;
    this.saveProgress();

    // Play discovery sound
    soundEffects.playAchievement();

    return true;
  }

  getDiscoveredCount(): number {
    return Array.from(this.eggs.values()).filter(e => e.discovered).length;
  }

  getTotalCount(): number {
    return this.eggs.size;
  }

  isComplete(): boolean {
    return this.getDiscoveredCount() === this.getTotalCount();
  }

  private loadProgress() {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(`${this.storageKey}-${this.storyId}`);
    if (!saved) return;

    try {
      const discovered = JSON.parse(saved) as string[];
      discovered.forEach(eggId => {
        const egg = this.eggs.get(eggId);
        if (egg) egg.discovered = true;
      });
    } catch (e) {
      console.error('Failed to load easter egg progress:', e);
    }
  }

  private saveProgress() {
    if (typeof window === 'undefined') return;

    const discovered = Array.from(this.eggs.values())
      .filter(e => e.discovered)
      .map(e => e.id);

    localStorage.setItem(`${this.storageKey}-${this.storyId}`, JSON.stringify(discovered));
  }
}

/**
 * Collectibles Manager
 */
export interface Collectible {
  id: string;
  type: 'star' | 'coin' | 'sticker' | 'badge';
  name: string;
  storyId: string;
  timestamp: number;
}

export class CollectiblesManager {
  private storageKey = 'story-collectibles';

  getAll(): Collectible[] {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return [];

    try {
      return JSON.parse(saved) as Collectible[];
    } catch (e) {
      console.error('Failed to load collectibles:', e);
      return [];
    }
  }

  add(collectible: Collectible) {
    const all = this.getAll();
    all.push(collectible);

    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(all));
    }

    // Play collection sound
    soundEffects.playCorrect();
  }

  getByStory(storyId: string): Collectible[] {
    return this.getAll().filter(c => c.storyId === storyId);
  }

  getByType(type: Collectible['type']): Collectible[] {
    return this.getAll().filter(c => c.type === type);
  }

  getTotalCount(): number {
    return this.getAll().length;
  }

  getStarCount(): number {
    return this.getByType('star').length;
  }
}

/**
 * Sound Effect Names for Characters and Actions
 */
export const SoundLibrary = {
  // Character sounds
  BEAR_GROWL: 'bear-growl',
  BIRD_CHIRP: 'bird-chirp',
  OWL_HOOT: 'owl-hoot',
  MOUSE_SQUEAK: 'mouse-squeak',

  // Action sounds
  BOUNCE: 'bounce',
  POP: 'pop',
  WHOOSH: 'whoosh',
  FLUTTER: 'flutter',
  WIGGLE: 'wiggle',

  // Ambient sounds
  FOREST: 'forest-ambient',
  RAIN: 'rain',
  NIGHT: 'night-ambient',
  BIRDS: 'birds-chirping',

  // Musical stingers
  DISCOVERY: 'discovery-stinger',
  SUCCESS: 'success-stinger',
  MAGIC: 'magic-sparkle',
};

// Global instances
export const characterReactions = new CharacterReactionManager();
export const collectiblesManager = new CollectiblesManager();
