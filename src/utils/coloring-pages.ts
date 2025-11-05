/**
 * Coloring Pages System
 * Generates SVG line art templates, manages color palettes, and handles drawing tools
 */

export interface ColoringTemplate {
  id: string;
  name: Record<string, string>;
  emoji: string;
  characterType: string;
  svgPath: string;
  difficulty: 'simple' | 'medium' | 'detailed';
  regions?: ColorRegion[];
  featured?: boolean;
}

export interface ColorRegion {
  id: string;
  path: string;
  colorNumber?: number;
  fillColor?: string;
}

export interface ColorPalette {
  name: string;
  colors: Color[];
}

export interface Color {
  name: string;
  hex: string;
  light?: string;
  dark?: string;
}

export interface DrawingState {
  templateId: string;
  coloredRegions: Map<string, string>;
  history: HistoryEntry[];
  historyIndex: number;
}

export interface HistoryEntry {
  action: 'fill' | 'erase';
  regionId: string;
  previousColor: string | null;
  newColor: string | null;
  timestamp: number;
}

// Kid-friendly color palette
export const DEFAULT_PALETTE: ColorPalette = {
  name: 'Default',
  colors: [
    // Primary colors
    { name: 'Red', hex: '#FF6B6B', light: '#FFA5A5', dark: '#D63031' },
    { name: 'Orange', hex: '#FF9F40', light: '#FFC170', dark: '#E88F30' },
    { name: 'Yellow', hex: '#FFD93D', light: '#FFE896', dark: '#FFC107' },
    { name: 'Green', hex: '#6BCF7F', light: '#9FE0AC', dark: '#4CAF50' },
    { name: 'Blue', hex: '#4ECDC4', light: '#82E5DD', dark: '#3AB5AC' },
    { name: 'Sky Blue', hex: '#74B9FF', light: '#A8D0FF', dark: '#4A90E2' },
    { name: 'Purple', hex: '#A29BFE', light: '#CCC7FF', dark: '#6C5CE7' },
    { name: 'Pink', hex: '#FD79A8', light: '#FFAFD3', dark: '#E84393' },

    // Pastels
    { name: 'Peach', hex: '#FFEAA7', light: '#FFF4D6', dark: '#FDCB6E' },
    { name: 'Mint', hex: '#81ECEC', light: '#B8F5F5', dark: '#00CEC9' },
    { name: 'Lavender', hex: '#DDA5E8', light: '#F0CBF7', dark: '#C77DD3' },
    { name: 'Coral', hex: '#FF7675', light: '#FFAAA9', dark: '#D63031' },

    // Secondary
    { name: 'Teal', hex: '#00B894', light: '#55EFC4', dark: '#00896E' },
    { name: 'Magenta', hex: '#E17055', light: '#F5A593', dark: '#D35400' },
    { name: 'Lime', hex: '#A4E85F', light: '#C8F29C', dark: '#7FB800' },
    { name: 'Gold', hex: '#F39C12', light: '#F8C471', dark: '#E67E22' },

    // Neutrals
    { name: 'Brown', hex: '#A55A3C', light: '#C68563', dark: '#8B4513' },
    { name: 'Gray', hex: '#B2BEC3', light: '#DFE6E9', dark: '#636E72' },
    { name: 'Black', hex: '#2D3436', light: '#636E72', dark: '#000000' },
    { name: 'White', hex: '#FFFFFF', light: '#FFFFFF', dark: '#F8F9FA' },

    // Special
    { name: 'Silver', hex: '#BDC3C7', light: '#ECF0F1', dark: '#95A5A6' },
    { name: 'Rose Gold', hex: '#E8A5A5', light: '#F5D5D5', dark: '#D07878' },
  ],
};

// Skin tone palette for diversity and inclusion
export const SKIN_TONE_PALETTE: ColorPalette = {
  name: 'Skin Tones',
  colors: [
    { name: 'Very Light', hex: '#FFE0BD', light: '#FFF0DB', dark: '#FFD0A0' },
    { name: 'Light', hex: '#F5CBA7', light: '#FADCC4', dark: '#E9B890' },
    { name: 'Light Medium', hex: '#D7A184', light: '#E5B89A', dark: '#C68963' },
    { name: 'Medium', hex: '#C68642', light: '#D79B63', dark: '#A96F31' },
    { name: 'Tan', hex: '#A67C52', light: '#B89069', dark: '#8F6640' },
    { name: 'Medium Tan', hex: '#8D5524', light: '#A16D3E', dark: '#6E421C' },
    { name: 'Brown', hex: '#704214', light: '#8A5628', dark: '#5A3410' },
    { name: 'Dark Brown', hex: '#582D12', light: '#6D3A1C', dark: '#42210D' },
    { name: 'Very Dark', hex: '#3D1F0F', light: '#4E2813', dark: '#2D160B' },
    { name: 'Deep', hex: '#2D1506', light: '#3C1E0A', dark: '#1E0F04' },
  ],
};

// Predefined coloring templates
export const COLORING_TEMPLATES: ColoringTemplate[] = [
  {
    id: 'bruno-bear',
    name: {
      de: 'Bruno der Bär',
      en: 'Bruno the Bear',
      ar: 'برونو الدب',
      tr: 'Ayı Bruno',
      ur: 'ریچھ برونو',
    },
    emoji: '🐻',
    characterType: 'bear',
    svgPath: '/coloring/bruno-bear.svg',
    difficulty: 'medium',
    featured: true,
  },
  {
    id: 'fritz-squirrel',
    name: {
      de: 'Fritz das Eichhörnchen',
      en: 'Fritz the Squirrel',
      ar: 'فريتز السنجاب',
      tr: 'Sincap Fritz',
      ur: 'گلہری فریٹز',
    },
    emoji: '🐿️',
    characterType: 'squirrel',
    svgPath: '/coloring/fritz-squirrel.svg',
    difficulty: 'medium',
  },
  {
    id: 'lina-mouse',
    name: {
      de: 'Lina die Maus',
      en: 'Lina the Mouse',
      ar: 'لينا الفأرة',
      tr: 'Fare Lina',
      ur: 'چوہیا لینا',
    },
    emoji: '🐭',
    characterType: 'mouse',
    svgPath: '/coloring/lina-mouse.svg',
    difficulty: 'simple',
  },
  {
    id: 'tobi-hedgehog',
    name: {
      de: 'Tobi der Igel',
      en: 'Tobi the Hedgehog',
      ar: 'توبي القنفذ',
      tr: 'Kirpi Tobi',
      ur: 'خارپشت ٹوبی',
    },
    emoji: '🦔',
    characterType: 'hedgehog',
    svgPath: '/coloring/tobi-hedgehog.svg',
    difficulty: 'detailed',
  },
  {
    id: 'mila-balloon',
    name: {
      de: 'Mila und der Ballon',
      en: 'Mila and the Balloon',
      ar: 'ميلا والبالون',
      tr: 'Mila ve Balon',
      ur: 'میلا اور غبارہ',
    },
    emoji: '🎈',
    characterType: 'girl',
    svgPath: '/coloring/mila-balloon.svg',
    difficulty: 'medium',
  },
  {
    id: 'moritz-fox',
    name: {
      de: 'Moritz der Fuchs',
      en: 'Moritz the Fox',
      ar: 'موريتز الثعلب',
      tr: 'Tilki Moritz',
      ur: 'لومڑی موریٹز',
    },
    emoji: '🦊',
    characterType: 'fox',
    svgPath: '/coloring/moritz-fox.svg',
    difficulty: 'medium',
    featured: true,
  },
  {
    id: 'leo-lion',
    name: {
      de: 'Leo der Löwe',
      en: 'Leo the Lion',
      ar: 'ليو الأسد',
      tr: 'Aslan Leo',
      ur: 'شیر لیو',
    },
    emoji: '🦁',
    characterType: 'lion',
    svgPath: '/coloring/leo-lion.svg',
    difficulty: 'detailed',
  },
  {
    id: 'timmi-clock',
    name: {
      de: 'Timmi und die Zauberuhr',
      en: 'Timmi and the Magic Clock',
      ar: 'تيمي والساعة السحرية',
      tr: 'Timmi ve Sihirli Saat',
      ur: 'ٹمی اور جادوئی گھڑی',
    },
    emoji: '⏰',
    characterType: 'boy',
    svgPath: '/coloring/timmi-clock.svg',
    difficulty: 'simple',
  },
  {
    id: 'forest-scene',
    name: {
      de: 'Waldszene',
      en: 'Forest Scene',
      ar: 'مشهد الغابة',
      tr: 'Orman Sahnesi',
      ur: 'جنگل کا منظر',
    },
    emoji: '🌲',
    characterType: 'scene',
    svgPath: '/coloring/forest-scene.svg',
    difficulty: 'detailed',
    featured: true,
  },
  {
    id: 'butterfly-garden',
    name: {
      de: 'Schmetterlingsgarten',
      en: 'Butterfly Garden',
      ar: 'حديقة الفراشات',
      tr: 'Kelebek Bahçesi',
      ur: 'تتلیوں کا باغ',
    },
    emoji: '🦋',
    characterType: 'scene',
    svgPath: '/coloring/butterfly-garden.svg',
    difficulty: 'medium',
  },
  {
    id: 'elephant-emma',
    name: {
      de: 'Emma der Elefant',
      en: 'Emma the Elephant',
      ar: 'إيما الفيل',
      tr: 'Fil Emma',
      ur: 'ہاتھی ایما',
    },
    emoji: '🐘',
    characterType: 'elephant',
    svgPath: '/coloring/elephant-emma.svg',
    difficulty: 'medium',
  },
  {
    id: 'rabbit-rosa',
    name: {
      de: 'Rosa das Kaninchen',
      en: 'Rosa the Rabbit',
      ar: 'روزا الأرنب',
      tr: 'Tavşan Rosa',
      ur: 'خرگوش روزا',
    },
    emoji: '🐰',
    characterType: 'rabbit',
    svgPath: '/coloring/rabbit-rosa.svg',
    difficulty: 'simple',
  },
  {
    id: 'owl-otto',
    name: {
      de: 'Otto die Eule',
      en: 'Otto the Owl',
      ar: 'أوتو البومة',
      tr: 'Baykuş Otto',
      ur: 'الّو اوٹو',
    },
    emoji: '🦉',
    characterType: 'owl',
    svgPath: '/coloring/owl-otto.svg',
    difficulty: 'detailed',
  },
  {
    id: 'cat-clara',
    name: {
      de: 'Clara die Katze',
      en: 'Clara the Cat',
      ar: 'كلارا القطة',
      tr: 'Kedi Clara',
      ur: 'بلّی کلارا',
    },
    emoji: '🐱',
    characterType: 'cat',
    svgPath: '/coloring/cat-clara.svg',
    difficulty: 'simple',
  },
  {
    id: 'dog-diego',
    name: {
      de: 'Diego der Hund',
      en: 'Diego the Dog',
      ar: 'دييغو الكلب',
      tr: 'Köpek Diego',
      ur: 'کتّا ڈیگو',
    },
    emoji: '🐕',
    characterType: 'dog',
    svgPath: '/coloring/dog-diego.svg',
    difficulty: 'medium',
  },
  {
    id: 'turtle-tina',
    name: {
      de: 'Tina die Schildkröte',
      en: 'Tina the Turtle',
      ar: 'تينا السلحفاة',
      tr: 'Kaplumbağa Tina',
      ur: 'کچھوا ٹینا',
    },
    emoji: '🐢',
    characterType: 'turtle',
    svgPath: '/coloring/turtle-tina.svg',
    difficulty: 'simple',
  },
  {
    id: 'penguin-paul',
    name: {
      de: 'Paul der Pinguin',
      en: 'Paul the Penguin',
      ar: 'بول البطريق',
      tr: 'Penguen Paul',
      ur: 'پینگوئن پال',
    },
    emoji: '🐧',
    characterType: 'penguin',
    svgPath: '/coloring/penguin-paul.svg',
    difficulty: 'medium',
  },
  {
    id: 'rainbow-scene',
    name: {
      de: 'Regenbogenlandschaft',
      en: 'Rainbow Landscape',
      ar: 'مشهد قوس قزح',
      tr: 'Gökkuşağı Manzarası',
      ur: 'قوس قزح کا منظر',
    },
    emoji: '🌈',
    characterType: 'scene',
    svgPath: '/coloring/rainbow-scene.svg',
    difficulty: 'detailed',
  },
  {
    id: 'flower-mandala',
    name: {
      de: 'Blumen-Mandala',
      en: 'Flower Mandala',
      ar: 'ماندالا الزهور',
      tr: 'Çiçek Mandala',
      ur: 'پھولوں کا منڈلا',
    },
    emoji: '🌸',
    characterType: 'pattern',
    svgPath: '/coloring/flower-mandala.svg',
    difficulty: 'detailed',
  },
  {
    id: 'underwater-scene',
    name: {
      de: 'Unterwasserwelt',
      en: 'Underwater Scene',
      ar: 'مشهد تحت الماء',
      tr: 'Su Altı Sahnesi',
      ur: 'پانی کے نیچے کا منظر',
    },
    emoji: '🐠',
    characterType: 'scene',
    svgPath: '/coloring/underwater-scene.svg',
    difficulty: 'detailed',
  },
  {
    id: 'house-pattern',
    name: {
      de: 'Häusermuster',
      en: 'House Pattern',
      ar: 'نمط البيوت',
      tr: 'Ev Deseni',
      ur: 'گھروں کا نمونہ',
    },
    emoji: '🏠',
    characterType: 'pattern',
    svgPath: '/coloring/house-pattern.svg',
    difficulty: 'medium',
  },
  {
    id: 'star-pattern',
    name: {
      de: 'Sternenmuster',
      en: 'Star Pattern',
      ar: 'نمط النجوم',
      tr: 'Yıldız Deseni',
      ur: 'ستاروں کا نمونہ',
    },
    emoji: '⭐',
    characterType: 'pattern',
    svgPath: '/coloring/star-pattern.svg',
    difficulty: 'simple',
  },
  {
    id: 'heart-pattern',
    name: {
      de: 'Herzmuster',
      en: 'Heart Pattern',
      ar: 'نمط القلوب',
      tr: 'Kalp Deseni',
      ur: 'دلوں کا نمونہ',
    },
    emoji: '💕',
    characterType: 'pattern',
    svgPath: '/coloring/heart-pattern.svg',
    difficulty: 'simple',
  },
  {
    id: 'dinosaur-danny',
    name: {
      de: 'Danny der Dinosaurier',
      en: 'Danny the Dinosaur',
      ar: 'داني الديناصور',
      tr: 'Dinozor Danny',
      ur: 'ڈائنوسار ڈینی',
    },
    emoji: '🦕',
    characterType: 'dinosaur',
    svgPath: '/coloring/dinosaur-danny.svg',
    difficulty: 'medium',
  },
  {
    id: 'unicorn-una',
    name: {
      de: 'Una das Einhorn',
      en: 'Una the Unicorn',
      ar: 'أونا وحيد القرن',
      tr: 'Tek Boynuzlu At Una',
      ur: 'یونی کورن اونا',
    },
    emoji: '🦄',
    characterType: 'unicorn',
    svgPath: '/coloring/unicorn-una.svg',
    difficulty: 'detailed',
    featured: true,
  },
  {
    id: 'rocket-space',
    name: {
      de: 'Rakete im Weltraum',
      en: 'Rocket in Space',
      ar: 'صاروخ في الفضاء',
      tr: 'Uzayda Roket',
      ur: 'خلا میں راکٹ',
    },
    emoji: '🚀',
    characterType: 'scene',
    svgPath: '/coloring/rocket-space.svg',
    difficulty: 'detailed',
  },
  {
    id: 'princess-pattern',
    name: {
      de: 'Prinzessinnen-Muster',
      en: 'Princess Pattern',
      ar: 'نمط الأميرة',
      tr: 'Prenses Deseni',
      ur: 'شہزادی کا نمونہ',
    },
    emoji: '👸',
    characterType: 'pattern',
    svgPath: '/coloring/princess-pattern.svg',
    difficulty: 'medium',
  },
  {
    id: 'castle-scene',
    name: {
      de: 'Schloss',
      en: 'Castle',
      ar: 'القلعة',
      tr: 'Şato',
      ur: 'قلعہ',
    },
    emoji: '🏰',
    characterType: 'scene',
    svgPath: '/coloring/castle-scene.svg',
    difficulty: 'detailed',
  },
  {
    id: 'birthday-party',
    name: {
      de: 'Geburtstagsfeier',
      en: 'Birthday Party',
      ar: 'حفلة عيد ميلاد',
      tr: 'Doğum Günü Partisi',
      ur: 'سالگرہ کی پارٹی',
    },
    emoji: '🎂',
    characterType: 'scene',
    svgPath: '/coloring/birthday-party.svg',
    difficulty: 'medium',
  },
  {
    id: 'circular-mandala',
    name: {
      de: 'Kreismandala',
      en: 'Circular Mandala',
      ar: 'ماندالا دائرية',
      tr: 'Dairesel Mandala',
      ur: 'دائرہ نما منڈلا',
    },
    emoji: '☸️',
    characterType: 'pattern',
    svgPath: '/coloring/circular-mandala.svg',
    difficulty: 'detailed',
  },
  {
    id: 'farm-animals',
    name: {
      de: 'Bauernhoftiere',
      en: 'Farm Animals',
      ar: 'حيوانات المزرعة',
      tr: 'Çiftlik Hayvanları',
      ur: 'کھیت کے جانور',
    },
    emoji: '🐄',
    characterType: 'scene',
    svgPath: '/coloring/farm-animals.svg',
    difficulty: 'medium',
    featured: true,
  },
  {
    id: 'alphabet-abc',
    name: {
      de: 'ABC-Buchstaben',
      en: 'ABC Letters',
      ar: 'حروف الأبجدية',
      tr: 'ABC Harfleri',
      ur: 'حروف تہجی',
    },
    emoji: '🔤',
    characterType: 'educational',
    svgPath: '/coloring/alphabet-abc.svg',
    difficulty: 'simple',
  },
  {
    id: 'numbers-123',
    name: {
      de: '123-Zahlen',
      en: '123 Numbers',
      ar: 'أرقام ١٢٣',
      tr: '123 Sayılar',
      ur: '۱۲۳ نمبر',
    },
    emoji: '🔢',
    characterType: 'educational',
    svgPath: '/coloring/numbers-123.svg',
    difficulty: 'simple',
  },
];

/**
 * Manages coloring page state and interactions
 */
export class ColoringPageManager {
  private templateId: string;
  private state: DrawingState;
  private currentTool: 'fill' | 'erase' = 'fill';
  private currentColor: string = DEFAULT_PALETTE.colors[0].hex;
  private storageKey: string;
  private maxHistorySize = 10;

  constructor(templateId: string) {
    this.templateId = templateId;
    this.storageKey = `coloring-page-${templateId}`;
    this.state = this.loadState();
  }

  private loadState(): DrawingState {
    if (typeof window === 'undefined') {
      return this.getDefaultState();
    }

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      return this.getDefaultState();
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        templateId: parsed.templateId || this.templateId,
        coloredRegions: new Map(Object.entries(parsed.coloredRegions || {})),
        history: parsed.history || [],
        historyIndex: parsed.historyIndex || -1,
      };
    } catch (error) {
      console.error('Failed to load coloring state:', error);
      return this.getDefaultState();
    }
  }

  private getDefaultState(): DrawingState {
    return {
      templateId: this.templateId,
      coloredRegions: new Map(),
      history: [],
      historyIndex: -1,
    };
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;

    const serialized = {
      templateId: this.state.templateId,
      coloredRegions: Object.fromEntries(this.state.coloredRegions),
      history: this.state.history,
      historyIndex: this.state.historyIndex,
    };

    localStorage.setItem(this.storageKey, JSON.stringify(serialized));
  }

  /**
   * Set current drawing tool
   */
  setTool(tool: 'fill' | 'erase'): void {
    this.currentTool = tool;
  }

  /**
   * Set current color
   */
  setColor(color: string): void {
    this.currentColor = color;
    this.currentTool = 'fill';
  }

  /**
   * Fill a region with color
   */
  fillRegion(regionId: string, color?: string): void {
    const fillColor = color || this.currentColor;
    const previousColor = this.state.coloredRegions.get(regionId) || null;

    // Add to history
    const historyEntry: HistoryEntry = {
      action: 'fill',
      regionId,
      previousColor,
      newColor: fillColor,
      timestamp: Date.now(),
    };

    this.addToHistory(historyEntry);

    // Update state
    this.state.coloredRegions.set(regionId, fillColor);
    this.saveState();

    // Dispatch event
    this.dispatchColorChange(regionId, fillColor);
  }

  /**
   * Erase color from a region
   */
  eraseRegion(regionId: string): void {
    const previousColor = this.state.coloredRegions.get(regionId) || null;

    if (!previousColor) return; // Nothing to erase

    // Add to history
    const historyEntry: HistoryEntry = {
      action: 'erase',
      regionId,
      previousColor,
      newColor: null,
      timestamp: Date.now(),
    };

    this.addToHistory(historyEntry);

    // Update state
    this.state.coloredRegions.delete(regionId);
    this.saveState();

    // Dispatch event
    this.dispatchColorChange(regionId, null);
  }

  /**
   * Handle region click (fill or erase based on current tool)
   */
  handleRegionClick(regionId: string): void {
    if (this.currentTool === 'fill') {
      this.fillRegion(regionId);
    } else {
      this.eraseRegion(regionId);
    }
  }

  /**
   * Add entry to history (with size limit)
   */
  private addToHistory(entry: HistoryEntry): void {
    // Remove any history after current index (when undoing then making new changes)
    if (this.state.historyIndex < this.state.history.length - 1) {
      this.state.history = this.state.history.slice(0, this.state.historyIndex + 1);
    }

    // Add new entry
    this.state.history.push(entry);

    // Limit history size
    if (this.state.history.length > this.maxHistorySize) {
      this.state.history.shift();
    } else {
      this.state.historyIndex++;
    }
  }

  /**
   * Undo last action
   */
  undo(): boolean {
    if (this.state.historyIndex < 0) return false;

    const entry = this.state.history[this.state.historyIndex];

    // Restore previous state
    if (entry.previousColor) {
      this.state.coloredRegions.set(entry.regionId, entry.previousColor);
      this.dispatchColorChange(entry.regionId, entry.previousColor);
    } else {
      this.state.coloredRegions.delete(entry.regionId);
      this.dispatchColorChange(entry.regionId, null);
    }

    this.state.historyIndex--;
    this.saveState();

    return true;
  }

  /**
   * Redo last undone action
   */
  redo(): boolean {
    if (this.state.historyIndex >= this.state.history.length - 1) return false;

    this.state.historyIndex++;
    const entry = this.state.history[this.state.historyIndex];

    // Apply new state
    if (entry.newColor) {
      this.state.coloredRegions.set(entry.regionId, entry.newColor);
      this.dispatchColorChange(entry.regionId, entry.newColor);
    } else {
      this.state.coloredRegions.delete(entry.regionId);
      this.dispatchColorChange(entry.regionId, null);
    }

    this.saveState();

    return true;
  }

  /**
   * Clear all colors
   */
  clear(): void {
    const previousState = new Map(this.state.coloredRegions);

    this.state.coloredRegions.clear();
    this.state.history = [];
    this.state.historyIndex = -1;
    this.saveState();

    // Dispatch event for each cleared region
    previousState.forEach((_, regionId) => {
      this.dispatchColorChange(regionId, null);
    });
  }

  /**
   * Get current state
   */
  getState(): DrawingState {
    return this.state;
  }

  /**
   * Get colored regions
   */
  getColoredRegions(): Map<string, string> {
    return new Map(this.state.coloredRegions);
  }

  /**
   * Get completion percentage
   */
  getCompletionPercentage(totalRegions: number): number {
    return Math.round((this.state.coloredRegions.size / totalRegions) * 100);
  }

  /**
   * Check if can undo
   */
  canUndo(): boolean {
    return this.state.historyIndex >= 0;
  }

  /**
   * Check if can redo
   */
  canRedo(): boolean {
    return this.state.historyIndex < this.state.history.length - 1;
  }

  /**
   * Dispatch color change event
   */
  private dispatchColorChange(regionId: string, color: string | null): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('coloring-page-update', {
          detail: {
            regionId,
            color,
            templateId: this.templateId,
          },
        })
      );
    }
  }

  /**
   * Export as PNG (requires canvas conversion)
   */
  async exportAsPNG(svgElement: SVGElement, filename: string): Promise<void> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not available');

      // Get SVG dimensions
      const bbox = svgElement.getBoundingClientRect();
      canvas.width = bbox.width * 2; // 2x for better quality
      canvas.height = bbox.height * 2;

      // Convert SVG to data URL
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Load and draw to canvas
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(svgUrl);

        // Download
        canvas.toBlob(blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      };

      img.src = svgUrl;
    } catch (error) {
      console.error('Failed to export PNG:', error);
    }
  }

  /**
   * Export as SVG
   */
  exportAsSVG(svgElement: SVGElement, filename: string): void {
    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export SVG:', error);
    }
  }

  /**
   * Print coloring page
   */
  print(svgElement: SVGElement): void {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Coloring Page</title>
          <style>
            @media print {
              body { margin: 0; padding: 0; }
              svg { max-width: 100%; height: auto; }
            }
            body {
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
          </style>
        </head>
        <body>
          ${svgString}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  }

  /**
   * Generate QR code for sharing
   */
  async generateQRCode(): Promise<string> {
    // Return data URL to share colored page state
    const stateData = JSON.stringify({
      templateId: this.templateId,
      coloredRegions: Object.fromEntries(this.state.coloredRegions),
    });

    // Encode as data URL (QR code generation would require additional library)
    const encodedData = btoa(stateData);
    return `${window.location.origin}/coloring?share=${encodedData}`;
  }

  /**
   * Load shared coloring page
   */
  static loadSharedPage(shareData: string): { templateId: string; coloredRegions: Map<string, string> } | null {
    try {
      const decoded = atob(shareData);
      const parsed = JSON.parse(decoded);
      return {
        templateId: parsed.templateId,
        coloredRegions: new Map(Object.entries(parsed.coloredRegions || {})),
      };
    } catch (error) {
      console.error('Failed to load shared page:', error);
      return null;
    }
  }
}

/**
 * Generate simple SVG line art from emoji/character type
 * This is a placeholder - real implementation would use pre-made SVG templates
 */
export function generateLineArt(characterType: string): string {
  // This would normally load from SVG files
  // For now, return placeholder paths
  const templates: Record<string, string> = {
    bear: 'M50,20 Q30,10 20,30 Q10,50 20,70 Q30,90 50,80 Q70,90 80,70 Q90,50 80,30 Q70,10 50,20 Z',
    squirrel: 'M40,30 Q20,20 15,40 Q10,60 25,75 Q40,90 55,75 Q70,60 65,40 Q60,20 40,30 Z',
    mouse: 'M45,35 Q30,25 25,40 Q20,55 30,65 Q40,75 50,65 Q60,55 55,40 Q50,25 45,35 Z',
    // ... more templates
  };

  return templates[characterType] || templates.bear;
}

/**
 * Track coloring page achievements
 */
export class ColoringAchievements {
  private storageKey = 'coloring-achievements';

  getCompletedPages(): string[] {
    if (typeof window === 'undefined') return [];

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  markPageCompleted(templateId: string): void {
    const completed = this.getCompletedPages();
    if (!completed.includes(templateId)) {
      completed.push(templateId);
      localStorage.setItem(this.storageKey, JSON.stringify(completed));

      // Check for achievements
      this.checkAchievements(completed.length);
    }
  }

  private checkAchievements(count: number): void {
    if (count === 1) {
      // First coloring page completed
      this.dispatchAchievement('first-coloring-page', 5);
    } else if (count === 10) {
      // 10 coloring pages completed
      this.dispatchAchievement('coloring-artist', 20);
    } else if (count === 20) {
      // All coloring pages completed
      this.dispatchAchievement('coloring-master', 50);
    }
  }

  private dispatchAchievement(achievementId: string, stars: number): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('achievement-unlocked', {
          detail: {
            achievementId,
            stars,
            source: 'coloring',
          },
        })
      );
    }
  }
}

export const coloringAchievements = new ColoringAchievements();
