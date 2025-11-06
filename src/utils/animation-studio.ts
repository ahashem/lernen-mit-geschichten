/**
 * Animation Studio
 * Core animation engine for frame-by-frame character animations
 * with keyframe interpolation, timeline management, and export capabilities
 */

import type { Locale } from './i18n';

export interface AnimationKeyframe {
  frame: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  flipX: boolean;
  flipY: boolean;
}

export interface AnimationCharacter {
  id: string;
  characterId: string; // Reference to story character
  name: string;
  sprite: string; // SVG or image path
  zIndex: number;
  keyframes: AnimationKeyframe[];
  color?: string; // Tint color
  blendMode?: GlobalCompositeOperation;
}

export interface AnimationScene {
  background: string;
  foregroundElements: AnimationElement[];
  textBubbles: AnimationTextBubble[];
}

export interface AnimationElement {
  id: string;
  type: 'tree' | 'cloud' | 'sun' | 'star' | 'flower' | 'mountain' | 'house';
  x: number;
  y: number;
  scale: number;
}

export interface AnimationTextBubble {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  startFrame: number;
  endFrame: number;
}

export interface AnimationSound {
  id: string;
  name: string;
  url: string;
  frame: number; // Frame at which to play sound
}

export interface AnimationProject {
  id: string;
  name: string;
  fps: number; // Frames per second (default 10)
  duration: number; // Total duration in seconds (max 30)
  currentFrame: number;
  totalFrames: number;
  scene: AnimationScene;
  characters: AnimationCharacter[];
  sounds: AnimationSound[];
  music?: string; // Background music track
  loop: boolean;
  gridEnabled: boolean;
  snapToGrid: boolean;
  onionSkinEnabled: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface HistoryState {
  type: 'character-add' | 'character-remove' | 'character-move' | 'keyframe-add' | 'keyframe-remove' | 'property-change';
  data: any;
  timestamp: number;
}

export class AnimationEngine {
  private project: AnimationProject;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private isPlaying: boolean = false;
  private playbackInterval: number | null = null;
  private history: HistoryState[] = [];
  private historyIndex: number = -1;
  private maxHistorySteps: number = 20;

  constructor(canvas: HTMLCanvasElement, project?: AnimationProject) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;

    this.project = project || this.createNewProject();
  }

  private createNewProject(): AnimationProject {
    return {
      id: this.generateId(),
      name: 'Untitled Animation',
      fps: 10,
      duration: 10,
      currentFrame: 0,
      totalFrames: 100, // 10 seconds * 10 fps
      scene: {
        background: 'forest',
        foregroundElements: [],
        textBubbles: [],
      },
      characters: [],
      sounds: [],
      loop: false,
      gridEnabled: true,
      snapToGrid: false,
      onionSkinEnabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  }

  private generateId(): string {
    return `anim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Project Management
  getProject(): AnimationProject {
    return { ...this.project };
  }

  setProject(project: AnimationProject): void {
    this.project = project;
    this.render();
  }

  updateProjectProperty<K extends keyof AnimationProject>(
    key: K,
    value: AnimationProject[K]
  ): void {
    this.project[key] = value;
    this.project.updatedAt = Date.now();
    this.render();
  }

  // Frame Management
  getCurrentFrame(): number {
    return this.project.currentFrame;
  }

  setCurrentFrame(frame: number): void {
    this.project.currentFrame = Math.max(0, Math.min(frame, this.project.totalFrames - 1));
    this.render();
  }

  nextFrame(): void {
    this.setCurrentFrame(this.project.currentFrame + 1);
  }

  previousFrame(): void {
    this.setCurrentFrame(this.project.currentFrame - 1);
  }

  // Character Management
  addCharacter(characterId: string, name: string, sprite: string): string {
    const character: AnimationCharacter = {
      id: this.generateId(),
      characterId,
      name,
      sprite,
      zIndex: this.project.characters.length,
      keyframes: [
        {
          frame: 0,
          x: this.canvas.width / 2,
          y: this.canvas.height / 2,
          rotation: 0,
          scale: 1,
          opacity: 1,
          flipX: false,
          flipY: false,
        },
      ],
    };

    this.project.characters.push(character);
    this.addToHistory({
      type: 'character-add',
      data: { character },
      timestamp: Date.now(),
    });
    this.render();
    return character.id;
  }

  removeCharacter(characterId: string): void {
    const index = this.project.characters.findIndex(c => c.id === characterId);
    if (index !== -1) {
      const character = this.project.characters[index];
      this.project.characters.splice(index, 1);
      this.addToHistory({
        type: 'character-remove',
        data: { character, index },
        timestamp: Date.now(),
      });
      this.render();
    }
  }

  getCharacter(characterId: string): AnimationCharacter | undefined {
    return this.project.characters.find(c => c.id === characterId);
  }

  // Keyframe Management
  addKeyframe(characterId: string, frame: number): void {
    const character = this.getCharacter(characterId);
    if (!character) return;

    // Check if keyframe already exists
    const existing = character.keyframes.find(kf => kf.frame === frame);
    if (existing) return;

    // Interpolate properties from surrounding keyframes
    const interpolated = this.interpolateAtFrame(character, frame);

    const keyframe: AnimationKeyframe = {
      frame,
      ...interpolated,
    };

    character.keyframes.push(keyframe);
    character.keyframes.sort((a, b) => a.frame - b.frame);

    this.addToHistory({
      type: 'keyframe-add',
      data: { characterId, keyframe },
      timestamp: Date.now(),
    });
    this.render();
  }

  removeKeyframe(characterId: string, frame: number): void {
    const character = this.getCharacter(characterId);
    if (!character) return;

    const index = character.keyframes.findIndex(kf => kf.frame === frame);
    if (index !== -1 && character.keyframes.length > 1) {
      const keyframe = character.keyframes[index];
      character.keyframes.splice(index, 1);

      this.addToHistory({
        type: 'keyframe-remove',
        data: { characterId, keyframe, index },
        timestamp: Date.now(),
      });
      this.render();
    }
  }

  updateKeyframe(
    characterId: string,
    frame: number,
    properties: Partial<AnimationKeyframe>
  ): void {
    const character = this.getCharacter(characterId);
    if (!character) return;

    const keyframe = character.keyframes.find(kf => kf.frame === frame);
    if (!keyframe) {
      // Create new keyframe if it doesn't exist
      this.addKeyframe(characterId, frame);
      return this.updateKeyframe(characterId, frame, properties);
    }

    Object.assign(keyframe, properties);
    this.render();
  }

  // Interpolation
  private interpolateAtFrame(
    character: AnimationCharacter,
    frame: number
  ): Omit<AnimationKeyframe, 'frame'> {
    const keyframes = character.keyframes;

    // Find surrounding keyframes
    let prevKeyframe: AnimationKeyframe | null = null;
    let nextKeyframe: AnimationKeyframe | null = null;

    for (let i = 0; i < keyframes.length; i++) {
      if (keyframes[i].frame <= frame) {
        prevKeyframe = keyframes[i];
      }
      if (keyframes[i].frame >= frame && !nextKeyframe) {
        nextKeyframe = keyframes[i];
      }
    }

    // No keyframes
    if (!prevKeyframe && !nextKeyframe) {
      return {
        x: this.canvas.width / 2,
        y: this.canvas.height / 2,
        rotation: 0,
        scale: 1,
        opacity: 1,
        flipX: false,
        flipY: false,
      };
    }

    // Only one keyframe or at exact keyframe
    if (!nextKeyframe || prevKeyframe?.frame === frame) {
      return prevKeyframe!;
    }

    if (!prevKeyframe || nextKeyframe.frame === frame) {
      return nextKeyframe;
    }

    // Interpolate between keyframes
    const totalFrames = nextKeyframe.frame - prevKeyframe.frame;
    const currentProgress = (frame - prevKeyframe.frame) / totalFrames;

    // Ease-in-out interpolation
    const t = this.easeInOutCubic(currentProgress);

    return {
      x: this.lerp(prevKeyframe.x, nextKeyframe.x, t),
      y: this.lerp(prevKeyframe.y, nextKeyframe.y, t),
      rotation: this.lerp(prevKeyframe.rotation, nextKeyframe.rotation, t),
      scale: this.lerp(prevKeyframe.scale, nextKeyframe.scale, t),
      opacity: this.lerp(prevKeyframe.opacity, nextKeyframe.opacity, t),
      flipX: t < 0.5 ? prevKeyframe.flipX : nextKeyframe.flipX,
      flipY: t < 0.5 ? prevKeyframe.flipY : nextKeyframe.flipY,
    };
  }

  private lerp(start: number, end: number, t: number): number {
    return start + (end - start) * t;
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Rendering
  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw background
    this.drawBackground();

    // Draw grid if enabled
    if (this.project.gridEnabled) {
      this.drawGrid();
    }

    // Draw onion skin if enabled
    if (this.project.onionSkinEnabled) {
      this.drawOnionSkin();
    }

    // Draw characters at current frame
    const sortedCharacters = [...this.project.characters].sort((a, b) => a.zIndex - b.zIndex);

    for (const character of sortedCharacters) {
      this.drawCharacter(character, this.project.currentFrame);
    }

    // Draw foreground elements
    this.drawForegroundElements();

    // Draw text bubbles
    this.drawTextBubbles();

    // Draw frame indicator
    this.drawFrameIndicator();
  }

  private drawBackground(): void {
    const backgrounds: Record<string, string> = {
      forest: '#8BC34A',
      city: '#90A4AE',
      beach: '#FFE082',
      home: '#FFCCBC',
      space: '#1A237E',
      underwater: '#4FC3F7',
      mountain: '#BCAAA4',
      farm: '#C5E1A5',
    };

    this.ctx.fillStyle = backgrounds[this.project.scene.background] || '#F5F5F5';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private drawGrid(): void {
    const gridSize = 40;
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.lineWidth = 1;

    for (let x = 0; x <= this.canvas.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }

    for (let y = 0; y <= this.canvas.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  private drawOnionSkin(): void {
    const prevFrame = Math.max(0, this.project.currentFrame - 1);
    const nextFrame = Math.min(this.project.totalFrames - 1, this.project.currentFrame + 1);

    // Draw previous frame (ghost)
    if (prevFrame !== this.project.currentFrame) {
      this.ctx.globalAlpha = 0.3;
      for (const character of this.project.characters) {
        this.drawCharacter(character, prevFrame);
      }
    }

    // Draw next frame (ghost)
    if (nextFrame !== this.project.currentFrame) {
      this.ctx.globalAlpha = 0.2;
      for (const character of this.project.characters) {
        this.drawCharacter(character, nextFrame);
      }
    }

    this.ctx.globalAlpha = 1;
  }

  private drawCharacter(character: AnimationCharacter, frame: number): void {
    const props = this.interpolateAtFrame(character, frame);

    this.ctx.save();

    // Apply transformations
    this.ctx.translate(props.x, props.y);
    this.ctx.rotate((props.rotation * Math.PI) / 180);
    this.ctx.scale(
      props.scale * (props.flipX ? -1 : 1),
      props.scale * (props.flipY ? -1 : 1)
    );
    this.ctx.globalAlpha = props.opacity;

    // Apply blend mode if specified
    if (character.blendMode) {
      this.ctx.globalCompositeOperation = character.blendMode;
    }

    // Draw character sprite (simplified - in real implementation would load SVG/image)
    this.drawCharacterSprite(character);

    this.ctx.restore();
  }

  private drawCharacterSprite(character: AnimationCharacter): void {
    // Placeholder: Draw emoji/simple shape
    // In real implementation, this would load and draw SVG or rasterized character
    this.ctx.font = '48px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    if (character.color) {
      this.ctx.fillStyle = character.color;
    }

    // Get emoji from characterId mapping
    const characterEmojis: Record<string, string> = {
      bruno: '🐻',
      fritz: '🦊',
      lina: '🐰',
      tobi: '🐯',
      mila: '🐭',
      moritz: '🦁',
      leo: '🐘',
    };

    const emoji = characterEmojis[character.characterId] || '⭐';
    this.ctx.fillText(emoji, 0, 0);
  }

  private drawForegroundElements(): void {
    for (const element of this.project.scene.foregroundElements) {
      this.ctx.save();
      this.ctx.translate(element.x, element.y);
      this.ctx.scale(element.scale, element.scale);

      // Draw element based on type
      const elementEmojis: Record<string, string> = {
        tree: '🌳',
        cloud: '☁️',
        sun: '☀️',
        star: '⭐',
        flower: '🌸',
        mountain: '⛰️',
        house: '🏠',
      };

      this.ctx.font = '32px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(elementEmojis[element.type] || '❓', 0, 0);

      this.ctx.restore();
    }
  }

  private drawTextBubbles(): void {
    for (const bubble of this.project.scene.textBubbles) {
      if (
        this.project.currentFrame >= bubble.startFrame &&
        this.project.currentFrame <= bubble.endFrame
      ) {
        this.ctx.save();

        // Draw bubble background
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;

        const padding = 10;
        const textWidth = this.ctx.measureText(bubble.text).width;
        const bubbleWidth = textWidth + padding * 2;
        const bubbleHeight = bubble.fontSize + padding * 2;

        this.ctx.fillRect(
          bubble.x - bubbleWidth / 2,
          bubble.y - bubbleHeight / 2,
          bubbleWidth,
          bubbleHeight
        );
        this.ctx.strokeRect(
          bubble.x - bubbleWidth / 2,
          bubble.y - bubbleHeight / 2,
          bubbleWidth,
          bubbleHeight
        );

        // Draw text
        this.ctx.fillStyle = bubble.color;
        this.ctx.font = `${bubble.fontSize}px ${bubble.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(bubble.text, bubble.x, bubble.y);

        this.ctx.restore();
      }
    }
  }

  private drawFrameIndicator(): void {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.font = '14px sans-serif';
    this.ctx.fillText(
      `Frame: ${this.project.currentFrame + 1} / ${this.project.totalFrames}`,
      10,
      20
    );
    this.ctx.restore();
  }

  // Playback
  play(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    const frameTime = 1000 / this.project.fps;

    this.playbackInterval = window.setInterval(() => {
      this.nextFrame();

      // Play sounds at current frame
      this.playSoundsAtFrame(this.project.currentFrame);

      if (this.project.currentFrame >= this.project.totalFrames - 1) {
        if (this.project.loop) {
          this.setCurrentFrame(0);
        } else {
          this.pause();
        }
      }
    }, frameTime);
  }

  pause(): void {
    if (!this.isPlaying) return;

    this.isPlaying = false;
    if (this.playbackInterval) {
      clearInterval(this.playbackInterval);
      this.playbackInterval = null;
    }
  }

  stop(): void {
    this.pause();
    this.setCurrentFrame(0);
  }

  private playSoundsAtFrame(frame: number): void {
    const sounds = this.project.sounds.filter(s => s.frame === frame);
    for (const sound of sounds) {
      this.playSound(sound.url);
    }
  }

  private playSound(url: string): void {
    const audio = new Audio(url);
    audio.play().catch(err => console.warn('Failed to play sound:', err));
  }

  // History/Undo/Redo
  private addToHistory(state: HistoryState): void {
    // Remove any states after current index
    this.history = this.history.slice(0, this.historyIndex + 1);

    // Add new state
    this.history.push(state);

    // Limit history size
    if (this.history.length > this.maxHistorySteps) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  undo(): void {
    if (this.historyIndex < 0) return;

    const state = this.history[this.historyIndex];
    this.applyHistoryState(state, true);
    this.historyIndex--;
    this.render();
  }

  redo(): void {
    if (this.historyIndex >= this.history.length - 1) return;

    this.historyIndex++;
    const state = this.history[this.historyIndex];
    this.applyHistoryState(state, false);
    this.render();
  }

  private applyHistoryState(state: HistoryState, reverse: boolean): void {
    switch (state.type) {
      case 'character-add':
        if (reverse) {
          const index = this.project.characters.findIndex(
            c => c.id === state.data.character.id
          );
          if (index !== -1) this.project.characters.splice(index, 1);
        } else {
          this.project.characters.push(state.data.character);
        }
        break;

      case 'character-remove':
        if (reverse) {
          this.project.characters.splice(state.data.index, 0, state.data.character);
        } else {
          this.project.characters.splice(state.data.index, 1);
        }
        break;

      // Add more history state handlers as needed
    }
  }

  // Export
  async exportAsGIF(): Promise<Blob> {
    // This would use gif.js library
    // Placeholder implementation
    throw new Error('GIF export not yet implemented');
  }

  async exportAsVideo(): Promise<Blob> {
    // This would use MediaRecorder API
    // Placeholder implementation
    throw new Error('Video export not yet implemented');
  }

  async exportAsPNGSequence(): Promise<Blob[]> {
    const frames: Blob[] = [];
    const originalFrame = this.project.currentFrame;

    for (let i = 0; i < this.project.totalFrames; i++) {
      this.setCurrentFrame(i);
      const blob = await new Promise<Blob>((resolve) => {
        this.canvas.toBlob((b) => resolve(b!), 'image/png');
      });
      frames.push(blob);
    }

    this.setCurrentFrame(originalFrame);
    return frames;
  }

  exportAsJSON(): string {
    return JSON.stringify(this.project, null, 2);
  }

  importFromJSON(json: string): void {
    try {
      const project = JSON.parse(json);
      this.setProject(project);
    } catch (error) {
      console.error('Failed to import project:', error);
      throw new Error('Invalid project file');
    }
  }
}

// Animation Templates
export interface AnimationTemplate {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  thumbnail: string;
  project: Partial<AnimationProject>;
}

export const ANIMATION_TEMPLATES: AnimationTemplate[] = [
  {
    id: 'walk-across',
    name: {
      de: 'Über die Bühne gehen',
      ar: 'المشي عبر المسرح',
      en: 'Walk Across Stage',
      tr: 'Sahnede Yürümek',
      ur: 'اسٹیج پر چلنا',
    },
    description: {
      de: 'Ein Charakter geht von links nach rechts',
      ar: 'شخصية تمشي من اليسار إلى اليمين',
      en: 'Character walks from left to right',
      tr: 'Karakter soldan sağa yürür',
      ur: 'کردار بائیں سے دائیں چلتا ہے',
    },
    thumbnail: '🚶',
    project: {
      duration: 5,
      totalFrames: 50,
    },
  },
  {
    id: 'jump-land',
    name: {
      de: 'Springen und Landen',
      ar: 'القفز والهبوط',
      en: 'Jump and Land',
      tr: 'Zıpla ve İn',
      ur: 'کودیں اور اتریں',
    },
    description: {
      de: 'Ein Charakter springt hoch und landet wieder',
      ar: 'شخصية تقفز وتهبط',
      en: 'Character jumps up and lands',
      tr: 'Karakter yukarı zıplar ve iner',
      ur: 'کردار اوپر کودتا ہے اور اترتا ہے',
    },
    thumbnail: '🦘',
    project: {
      duration: 3,
      totalFrames: 30,
    },
  },
  {
    id: 'conversation',
    name: {
      de: 'Zwei Charaktere sprechen',
      ar: 'شخصيتان يتحدثان',
      en: 'Two Characters Talk',
      tr: 'İki Karakter Konuşur',
      ur: 'دو کردار بات کرتے ہیں',
    },
    description: {
      de: 'Zwei Charaktere unterhalten sich',
      ar: 'شخصيتان يتحدثان',
      en: 'Two characters having a conversation',
      tr: 'İki karakter sohbet eder',
      ur: 'دو کردار گفتگو کرتے ہیں',
    },
    thumbnail: '💬',
    project: {
      duration: 8,
      totalFrames: 80,
    },
  },
  {
    id: 'grow-shrink',
    name: {
      de: 'Größer und kleiner werden',
      ar: 'يكبر ويصغر',
      en: 'Grow Big and Small',
      tr: 'Büyü ve Küçül',
      ur: 'بڑا اور چھوٹا ہونا',
    },
    description: {
      de: 'Ein Charakter wird größer und dann wieder kleiner',
      ar: 'شخصية تكبر ثم تصغر',
      en: 'Character grows big then shrinks',
      tr: 'Karakter büyür sonra küçülür',
      ur: 'کردار بڑا ہوتا ہے پھر چھوٹا',
    },
    thumbnail: '↕️',
    project: {
      duration: 4,
      totalFrames: 40,
    },
  },
  {
    id: 'spin-bounce',
    name: {
      de: 'Drehen und Hüpfen',
      ar: 'الدوران والقفز',
      en: 'Spin and Bounce',
      tr: 'Dön ve Zıpla',
      ur: 'گھومنا اور اچھلنا',
    },
    description: {
      de: 'Ein Charakter dreht sich und hüpft',
      ar: 'شخصية تدور وتقفز',
      en: 'Character spins and bounces',
      tr: 'Karakter döner ve zıplar',
      ur: 'کردار گھومتا اور اچھلتا ہے',
    },
    thumbnail: '🌀',
    project: {
      duration: 6,
      totalFrames: 60,
    },
  },
  {
    id: 'day-night',
    name: {
      de: 'Tag zu Nacht',
      ar: 'النهار إلى الليل',
      en: 'Day to Night',
      tr: 'Gündüz Geceye',
      ur: 'دن سے رات',
    },
    description: {
      de: 'Szenenübergang von Tag zu Nacht',
      ar: 'انتقال المشهد من النهار إلى الليل',
      en: 'Scene transition from day to night',
      tr: 'Gündüzden geceye sahne geçişi',
      ur: 'دن سے رات کی منتقلی',
    },
    thumbnail: '🌅',
    project: {
      duration: 10,
      totalFrames: 100,
    },
  },
];

// Background options
export const BACKGROUND_OPTIONS = [
  { id: 'forest', name: { de: 'Wald', ar: 'غابة', en: 'Forest', tr: 'Orman', ur: 'جنگل' }, emoji: '🌳' },
  { id: 'city', name: { de: 'Stadt', ar: 'مدينة', en: 'City', tr: 'Şehir', ur: 'شہر' }, emoji: '🏙️' },
  { id: 'beach', name: { de: 'Strand', ar: 'شاطئ', en: 'Beach', tr: 'Sahil', ur: 'ساحل' }, emoji: '🏖️' },
  { id: 'home', name: { de: 'Zuhause', ar: 'المنزل', en: 'Home', tr: 'Ev', ur: 'گھر' }, emoji: '🏠' },
  { id: 'space', name: { de: 'Weltraum', ar: 'الفضاء', en: 'Space', tr: 'Uzay', ur: 'خلا' }, emoji: '🚀' },
  { id: 'underwater', name: { de: 'Unterwasser', ar: 'تحت الماء', en: 'Underwater', tr: 'Su Altı', ur: 'پانی کے نیچے' }, emoji: '🐠' },
  { id: 'mountain', name: { de: 'Berge', ar: 'جبال', en: 'Mountain', tr: 'Dağ', ur: 'پہاڑ' }, emoji: '⛰️' },
  { id: 'farm', name: { de: 'Bauernhof', ar: 'مزرعة', en: 'Farm', tr: 'Çiftlik', ur: 'فارم' }, emoji: '🚜' },
];

// Sound effects
export const SOUND_EFFECTS = [
  { id: 'laugh', name: { de: 'Lachen', ar: 'ضحك', en: 'Laugh', tr: 'Gülme', ur: 'ہنسی' }, emoji: '😂' },
  { id: 'cry', name: { de: 'Weinen', ar: 'بكاء', en: 'Cry', tr: 'Ağlama', ur: 'رونا' }, emoji: '😢' },
  { id: 'jump', name: { de: 'Springen', ar: 'قفز', en: 'Jump', tr: 'Zıplama', ur: 'کود' }, emoji: '🦘' },
  { id: 'splash', name: { de: 'Platschen', ar: 'رش', en: 'Splash', tr: 'Sıçrama', ur: 'چھینٹے' }, emoji: '💦' },
  { id: 'applause', name: { de: 'Applaus', ar: 'تصفيق', en: 'Applause', tr: 'Alkış', ur: 'تالی' }, emoji: '👏' },
  { id: 'whistle', name: { de: 'Pfeifen', ar: 'صفير', en: 'Whistle', tr: 'ıslık', ur: 'سیٹی' }, emoji: '🎵' },
  { id: 'pop', name: { de: 'Plopp', ar: 'فرقعة', en: 'Pop', tr: 'Pat', ur: 'پھٹ' }, emoji: '🎈' },
  { id: 'boing', name: { de: 'Boing', ar: 'قفزة', en: 'Boing', tr: 'Sıçrama', ur: 'اچھال' }, emoji: '🎪' },
  { id: 'whoosh', name: { de: 'Wusch', ar: 'صوت رياح', en: 'Whoosh', tr: 'Vızz', ur: 'سنسناہٹ' }, emoji: '💨' },
  { id: 'sparkle', name: { de: 'Funkeln', ar: 'بريق', en: 'Sparkle', tr: 'Parlama', ur: 'چمک' }, emoji: '✨' },
];

// Music tracks
export const MUSIC_TRACKS = [
  { id: 'happy', name: { de: 'Fröhlich', ar: 'سعيد', en: 'Happy', tr: 'Mutlu', ur: 'خوش' }, emoji: '😊' },
  { id: 'adventure', name: { de: 'Abenteuer', ar: 'مغامرة', en: 'Adventure', tr: 'Macera', ur: 'مہم جوئی' }, emoji: '🗺️' },
  { id: 'calm', name: { de: 'Ruhig', ar: 'هادئ', en: 'Calm', tr: 'Sakin', ur: 'پرسکون' }, emoji: '🎵' },
  { id: 'funny', name: { de: 'Lustig', ar: 'مضحك', en: 'Funny', tr: 'Komik', ur: 'مزاحیہ' }, emoji: '🤡' },
  { id: 'mysterious', name: { de: 'Geheimnisvoll', ar: 'غامض', en: 'Mysterious', tr: 'Gizemli', ur: 'پراسرار' }, emoji: '🔍' },
];

// Character library - referencing existing story characters
export const CHARACTER_LIBRARY = [
  { id: 'bruno', name: 'Bruno', emoji: '🐻', type: 'bear' },
  { id: 'fritz', name: 'Fritz', emoji: '🦊', type: 'fox' },
  { id: 'lina', name: 'Lina', emoji: '🐰', type: 'rabbit' },
  { id: 'tobi', name: 'Tobi', emoji: '🐯', type: 'tiger' },
  { id: 'mila', name: 'Mila', emoji: '🐭', type: 'mouse' },
  { id: 'moritz', name: 'Moritz', emoji: '🦁', type: 'lion' },
  { id: 'leo', name: 'Leo', emoji: '🐘', type: 'elephant' },
];
