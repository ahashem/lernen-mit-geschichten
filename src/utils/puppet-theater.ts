/**
 * Puppet Theater Utility
 * Core logic for the interactive puppet theater system
 */

export interface Puppet {
  id: string;
  emoji: string;
  name: string;
  characterType: string;
  voiceId?: string;
  animations: string[];
}

export interface Prop {
  id: string;
  emoji: string;
  name: string;
  category: 'furniture' | 'nature' | 'building' | 'treasure';
  zIndex?: number;
}

export interface PuppetState {
  puppetId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  direction: 'left' | 'right';
  zIndex: number;
  animation?: string;
}

export interface PropState {
  propId: string;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  zIndex: number;
}

export interface DialogueBubble {
  puppetId: string;
  text: string;
  style: 'round' | 'thought' | 'shout';
  timestamp: number;
  duration?: number;
}

export interface RecordedAction {
  type: 'move' | 'animate' | 'dialogue' | 'sound' | 'prop' | 'scene-change';
  timestamp: number;
  data: any;
}

export interface Scene {
  id: string;
  background: string;
  puppets: PuppetState[];
  props: PropState[];
  duration: number;
}

export interface Show {
  id: string;
  title: string;
  createdAt: number;
  modifiedAt: number;
  scenes: Scene[];
  audio?: {
    narration?: Blob;
    music?: string;
  };
  actions: RecordedAction[];
  duration: number;
}

export interface ShowTemplate {
  id: string;
  titleKey: string;
  descriptionKey: string;
  theme: string;
  scenes: Scene[];
}

// Story Characters as Puppets
export const PUPPETS: Puppet[] = [
  { id: 'bruno', emoji: '🐻', name: 'Bruno', characterType: 'bear', voiceId: 'male-1', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'fritz', emoji: '🦊', name: 'Fritz', characterType: 'fox', voiceId: 'male-2', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'lina', emoji: '🐰', name: 'Lina', characterType: 'rabbit', voiceId: 'female-1', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'tobi', emoji: '🐨', name: 'Tobi', characterType: 'koala', voiceId: 'male-3', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'mila', emoji: '🦉', name: 'Mila', characterType: 'owl', voiceId: 'female-2', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'moritz', emoji: '🐭', name: 'Moritz', characterType: 'mouse', voiceId: 'male-4', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'leo', emoji: '🦁', name: 'Leo', characterType: 'lion', voiceId: 'male-5', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'milo', emoji: '🐵', name: 'Milo', characterType: 'monkey', voiceId: 'male-6', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'timmi', emoji: '🐯', name: 'Timmi', characterType: 'tiger', voiceId: 'male-7', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'emil', emoji: '👻', name: 'Emil', characterType: 'ghost', voiceId: 'male-8', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'float'] },
  { id: 'rosa', emoji: '🦄', name: 'Rosa', characterType: 'unicorn', voiceId: 'female-3', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'sparkle'] },
  { id: 'max', emoji: '🐶', name: 'Max', characterType: 'dog', voiceId: 'male-9', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'luna', emoji: '🐱', name: 'Luna', characterType: 'cat', voiceId: 'female-4', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'felix', emoji: '🐸', name: 'Felix', characterType: 'frog', voiceId: 'male-10', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'hop'] },
  { id: 'sophie', emoji: '🐿️', name: 'Sophie', characterType: 'squirrel', voiceId: 'female-5', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'theo', emoji: '🐘', name: 'Theo', characterType: 'elephant', voiceId: 'male-11', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'nala', emoji: '🦒', name: 'Nala', characterType: 'giraffe', voiceId: 'female-6', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'pip', emoji: '🐧', name: 'Pip', characterType: 'penguin', voiceId: 'male-12', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'slide'] },
  { id: 'bella', emoji: '🦋', name: 'Bella', characterType: 'butterfly', voiceId: 'female-7', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'flutter'] },
  { id: 'otto', emoji: '🦦', name: 'Otto', characterType: 'otter', voiceId: 'male-13', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'swim'] },
  { id: 'zara', emoji: '🦓', name: 'Zara', characterType: 'zebra', voiceId: 'female-8', animations: ['bounce', 'spin', 'wave', 'bow', 'jump'] },
  { id: 'pablo', emoji: '🦜', name: 'Pablo', characterType: 'parrot', voiceId: 'male-14', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'fly'] },
  { id: 'kira', emoji: '🦘', name: 'Kira', characterType: 'kangaroo', voiceId: 'female-9', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'hop'] },
  { id: 'marco', emoji: '🐢', name: 'Marco', characterType: 'turtle', voiceId: 'male-15', animations: ['bounce', 'spin', 'wave', 'bow'] },
  { id: 'elsa', emoji: '🦢', name: 'Elsa', characterType: 'swan', voiceId: 'female-10', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'glide'] },
  { id: 'hugo', emoji: '🦔', name: 'Hugo', characterType: 'hedgehog', voiceId: 'male-16', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'curl'] },
  { id: 'ida', emoji: '🐝', name: 'Ida', characterType: 'bee', voiceId: 'female-11', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'buzz'] },
  { id: 'finn', emoji: '🦈', name: 'Finn', characterType: 'shark', voiceId: 'male-17', animations: ['bounce', 'spin', 'wave', 'bow', 'swim'] },
  { id: 'maya', emoji: '🐬', name: 'Maya', characterType: 'dolphin', voiceId: 'female-12', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'flip'] },
  { id: 'noah', emoji: '🦅', name: 'Noah', characterType: 'eagle', voiceId: 'male-18', animations: ['bounce', 'spin', 'wave', 'bow', 'jump', 'soar'] },
];

// Stage Backgrounds
export const BACKGROUNDS = [
  { id: 'forest', emoji: '🌲', nameKey: 'forestSetting' },
  { id: 'castle', emoji: '🏰', nameKey: 'castleSetting' },
  { id: 'home', emoji: '🏠', nameKey: 'homeSetting' },
  { id: 'beach', emoji: '🏖️', nameKey: 'beachSetting' },
  { id: 'mountains', emoji: '⛰️', nameKey: 'mountainSetting' },
  { id: 'underwater', emoji: '🌊', nameKey: 'underwaterSetting' },
  { id: 'space', emoji: '🚀', nameKey: 'spaceSetting' },
  { id: 'farm', emoji: '🚜', nameKey: 'farmSetting' },
];

// Stage Props
export const PROPS: Prop[] = [
  // Furniture
  { id: 'table', emoji: '🪑', name: 'Table', category: 'furniture' },
  { id: 'chair', emoji: '🪑', name: 'Chair', category: 'furniture' },
  { id: 'bed', emoji: '🛏️', name: 'Bed', category: 'furniture' },
  { id: 'lamp', emoji: '💡', name: 'Lamp', category: 'furniture' },
  { id: 'door', emoji: '🚪', name: 'Door', category: 'furniture' },
  { id: 'window', emoji: '🪟', name: 'Window', category: 'furniture' },

  // Nature
  { id: 'tree', emoji: '🌳', name: 'Tree', category: 'nature' },
  { id: 'bush', emoji: '🌿', name: 'Bush', category: 'nature' },
  { id: 'flower', emoji: '🌸', name: 'Flower', category: 'nature' },
  { id: 'rock', emoji: '🪨', name: 'Rock', category: 'nature' },
  { id: 'cloud', emoji: '☁️', name: 'Cloud', category: 'nature' },
  { id: 'sun', emoji: '☀️', name: 'Sun', category: 'nature' },
  { id: 'moon', emoji: '🌙', name: 'Moon', category: 'nature' },
  { id: 'star', emoji: '⭐', name: 'Star', category: 'nature' },
  { id: 'rainbow', emoji: '🌈', name: 'Rainbow', category: 'nature' },

  // Buildings
  { id: 'house', emoji: '🏡', name: 'House', category: 'building' },
  { id: 'tower', emoji: '🗼', name: 'Tower', category: 'building' },
  { id: 'tent', emoji: '⛺', name: 'Tent', category: 'building' },
  { id: 'bridge', emoji: '🌉', name: 'Bridge', category: 'building' },

  // Treasure/Objects
  { id: 'treasure', emoji: '💎', name: 'Treasure', category: 'treasure' },
  { id: 'chest', emoji: '🎁', name: 'Chest', category: 'treasure' },
  { id: 'key', emoji: '🔑', name: 'Key', category: 'treasure' },
  { id: 'book', emoji: '📚', name: 'Book', category: 'treasure' },
  { id: 'apple', emoji: '🍎', name: 'Apple', category: 'treasure' },
  { id: 'cake', emoji: '🎂', name: 'Cake', category: 'treasure' },
  { id: 'ball', emoji: '⚽', name: 'Ball', category: 'treasure' },
  { id: 'balloon', emoji: '🎈', name: 'Balloon', category: 'treasure' },
  { id: 'umbrella', emoji: '☂️', name: 'Umbrella', category: 'treasure' },
  { id: 'telescope', emoji: '🔭', name: 'Telescope', category: 'treasure' },
  { id: 'backpack', emoji: '🎒', name: 'Backpack', category: 'treasure' },
];

// Sound Effects
export const SOUND_EFFECTS = [
  { id: 'applause', emoji: '👏', nameKey: 'soundApplause' },
  { id: 'laugh', emoji: '😄', nameKey: 'soundLaugh' },
  { id: 'gasp', emoji: '😮', nameKey: 'soundGasp' },
  { id: 'cheer', emoji: '🎉', nameKey: 'soundCheer' },
  { id: 'thunder', emoji: '⚡', nameKey: 'soundThunder' },
  { id: 'wind', emoji: '💨', nameKey: 'soundWind' },
  { id: 'rain', emoji: '🌧️', nameKey: 'soundRain' },
  { id: 'door-creak', emoji: '🚪', nameKey: 'soundDoorCreak' },
  { id: 'footsteps', emoji: '👣', nameKey: 'soundFootsteps' },
  { id: 'magic', emoji: '✨', nameKey: 'soundMagic' },
  { id: 'bell', emoji: '🔔', nameKey: 'soundBell' },
  { id: 'drum', emoji: '🥁', nameKey: 'soundDrum' },
  { id: 'trumpet', emoji: '🎺', nameKey: 'soundTrumpet' },
  { id: 'splash', emoji: '💦', nameKey: 'soundSplash' },
  { id: 'crash', emoji: '💥', nameKey: 'soundCrash' },
  { id: 'whoosh', emoji: '💨', nameKey: 'soundWhoosh' },
  { id: 'pop', emoji: '🎈', nameKey: 'soundPop' },
  { id: 'tick-tock', emoji: '⏰', nameKey: 'soundTickTock' },
  { id: 'boing', emoji: '🪀', nameKey: 'soundBoing' },
  { id: 'sparkle', emoji: '✨', nameKey: 'soundSparkle' },
];

// Background Music
export const MUSIC_TRACKS = [
  { id: 'cheerful', nameKey: 'musicCheerful', mood: 'happy' },
  { id: 'adventure', nameKey: 'musicAdventure', mood: 'adventurous' },
  { id: 'mysterious', nameKey: 'musicMysterious', mood: 'mysterious' },
  { id: 'calm', nameKey: 'musicCalm', mood: 'calm' },
  { id: 'dramatic', nameKey: 'musicDramatic', mood: 'exciting' },
];

// Show Templates
export const SHOW_TEMPLATES: ShowTemplate[] = [
  {
    id: 'lost-treasure',
    titleKey: 'templateLostTreasure',
    descriptionKey: 'templateLostTreasureDesc',
    theme: 'adventure',
    scenes: [
      {
        id: 'scene-1',
        background: 'forest',
        puppets: [
          { puppetId: 'bruno', x: 20, y: 50, scale: 1, rotation: 0, direction: 'right', zIndex: 1 }
        ],
        props: [
          { propId: 'tree', x: 70, y: 40, scale: 1.5, rotation: 0, zIndex: 0 }
        ],
        duration: 30
      }
    ]
  },
  {
    id: 'friendship-lesson',
    titleKey: 'templateFriendship',
    descriptionKey: 'templateFriendshipDesc',
    theme: 'wholesome',
    scenes: [
      {
        id: 'scene-1',
        background: 'home',
        puppets: [
          { puppetId: 'lina', x: 30, y: 50, scale: 1, rotation: 0, direction: 'right', zIndex: 1 },
          { puppetId: 'fritz', x: 60, y: 50, scale: 1, rotation: 0, direction: 'left', zIndex: 1 }
        ],
        props: [],
        duration: 30
      }
    ]
  },
  {
    id: 'silly-mixup',
    titleKey: 'templateSillyMixup',
    descriptionKey: 'templateSillyMixupDesc',
    theme: 'comedy',
    scenes: [
      {
        id: 'scene-1',
        background: 'home',
        puppets: [
          { puppetId: 'moritz', x: 40, y: 50, scale: 1, rotation: 0, direction: 'right', zIndex: 1 }
        ],
        props: [
          { propId: 'cake', x: 70, y: 60, scale: 1, rotation: 0, zIndex: 0 }
        ],
        duration: 30
      }
    ]
  },
  {
    id: 'missing-cookie',
    titleKey: 'templateMissingCookie',
    descriptionKey: 'templateMissingCookieDesc',
    theme: 'detective',
    scenes: [
      {
        id: 'scene-1',
        background: 'home',
        puppets: [
          { puppetId: 'mila', x: 40, y: 50, scale: 1, rotation: 0, direction: 'right', zIndex: 1 }
        ],
        props: [
          { propId: 'table', x: 60, y: 50, scale: 1.2, rotation: 0, zIndex: 0 }
        ],
        duration: 30
      }
    ]
  },
  {
    id: 'birthday-surprise',
    titleKey: 'templateBirthdaySurprise',
    descriptionKey: 'templateBirthdaySurpriseDesc',
    theme: 'celebration',
    scenes: [
      {
        id: 'scene-1',
        background: 'home',
        puppets: [
          { puppetId: 'leo', x: 50, y: 50, scale: 1, rotation: 0, direction: 'right', zIndex: 1 }
        ],
        props: [
          { propId: 'cake', x: 40, y: 60, scale: 1, rotation: 0, zIndex: 0 },
          { propId: 'balloon', x: 70, y: 30, scale: 1, rotation: 0, zIndex: 0 }
        ],
        duration: 30
      }
    ]
  }
];

// Show Storage (IndexedDB)
export class ShowStorage {
  private dbName = 'puppet-theater';
  private storeName = 'shows';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async saveShow(show: Show): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put(show);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getShow(id: string): Promise<Show | undefined> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllShows(): Promise<Show[]> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteShow(id: string): Promise<void> {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
}

// Recording utilities
export class ShowRecorder {
  private isRecording = false;
  private startTime = 0;
  private actions: RecordedAction[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  startRecording(): void {
    this.isRecording = true;
    this.startTime = Date.now();
    this.actions = [];
  }

  stopRecording(): RecordedAction[] {
    this.isRecording = false;
    return this.actions;
  }

  recordAction(action: Omit<RecordedAction, 'timestamp'>): void {
    if (!this.isRecording) return;
    this.actions.push({
      ...action,
      timestamp: Date.now() - this.startTime
    });
  }

  async startAudioRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting audio recording:', error);
      throw error;
    }
  }

  async stopAudioRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No audio recording in progress'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
        resolve(blob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }
}

// Export show as video
export async function exportShowAsVideo(
  canvas: HTMLCanvasElement,
  duration: number,
  fps: number = 30
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const stream = canvas.captureStream(fps);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });

    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = (error) => {
      reject(error);
    };

    mediaRecorder.start();

    setTimeout(() => {
      mediaRecorder.stop();
    }, duration * 1000);
  });
}

// Generate unique ID
export function generateShowId(): string {
  return `show-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Generate QR code for show sharing
export function generateShowShareData(show: Show): string {
  const shareData = {
    id: show.id,
    title: show.title,
    scenes: show.scenes,
    actions: show.actions,
    duration: show.duration
  };
  return JSON.stringify(shareData);
}
