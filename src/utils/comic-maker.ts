/**
 * Comic Book Maker - Transform Stories into Visual Comics
 * Supports panel layouts, speech bubbles, effects, and exports
 */

import type { Locale } from './i18n';

// Comic panel layouts
export type PanelLayout = '4-panel' | '6-panel' | '9-panel' | 'custom';
export type PanelType = 'action' | 'dialogue' | 'narration' | 'thought';

// Speech bubble types
export type BubbleType = 'round' | 'rectangular' | 'thought' | 'shout' | 'whisper' | 'scream';
export type TailDirection = 'top-left' | 'top' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom' | 'bottom-right';

// Comic fonts
export type ComicFont = 'comic-sans' | 'bangers' | 'righteous' | 'permanent-marker' | 'pacifico';

// Action line types
export type ActionLineType = 'speed' | 'motion-blur' | 'radial' | 'impact';

// Emotion indicators
export type EmotionType = 'hearts' | 'anger' | 'sweat' | 'stars' | 'sparkles' | 'question' | 'exclamation' | 'shock';

// Panel border styles
export type BorderStyle = 'solid' | 'dashed' | 'wavy' | 'explosion' | 'double' | 'none';

// Background patterns
export type BackgroundPattern = 'halftone-dots' | 'lines' | 'crosshatch' | 'solid' | 'gradient' | 'texture';

export interface ComicPanel {
  id: string;
  type: PanelType;
  background: string; // background ID from story-map
  characters: ComicCharacter[];
  speechBubbles: SpeechBubble[];
  effects: VisualEffect[];
  narration?: string;
  borderStyle: BorderStyle;
  backgroundPattern?: BackgroundPattern;
  patternColor?: string;
}

export interface ComicCharacter {
  id: string;
  emoji: string;
  name: string;
  position: { x: number; y: number }; // percentage-based 0-100
  size: number; // scale factor 0.5-2
  rotation: number; // degrees
  flipped: boolean;
  expression?: string;
  zIndex: number;
}

export interface SpeechBubble {
  id: string;
  type: BubbleType;
  text: string;
  position: { x: number; y: number };
  width: number;
  height: number;
  tailDirection: TailDirection;
  tailPosition: { x: number; y: number }; // percentage
  font: ComicFont;
  fontSize: number;
  textColor: string;
  bubbleColor: string;
  borderColor: string;
  characterId?: string; // linked to character
}

export interface VisualEffect {
  id: string;
  type: 'action-line' | 'emotion' | 'sound' | 'impact';
  subtype: ActionLineType | EmotionType | string;
  position: { x: number; y: number };
  size: number;
  rotation: number;
  color?: string;
  text?: string; // for sound effects like "POW!"
  font?: ComicFont;
}

export interface ComicPage {
  layout: PanelLayout;
  panels: ComicPanel[];
  title?: string;
  pageNumber: number;
}

export interface ComicProject {
  id: string;
  title: string;
  storyId?: string;
  author: string;
  pages: ComicPage[];
  createdAt: number;
  updatedAt: number;
  locale: Locale;
  stars: number; // earned for creating
}

// Pre-defined comic templates
export interface ComicTemplate {
  id: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
  layout: PanelLayout;
  panelCount: number;
  preview: string;
}

// Sound effects library
export const SOUND_EFFECTS = [
  // Action sounds
  'POW!', 'BANG!', 'BOOM!', 'CRASH!', 'SMASH!', 'WHAM!', 'THUD!', 'SLAM!',
  'CRACK!', 'SNAP!', 'CRUNCH!', 'BONK!', 'CLANG!', 'CLUNK!',

  // Movement sounds
  'ZOOM!', 'SWOOSH!', 'WHOOSH!', 'ZIP!', 'DASH!', 'WHIZZ!', 'VROOM!',
  'ZING!', 'WHIRL!', 'SPIN!',

  // Impact sounds
  'SPLASH!', 'SPLAT!', 'SPLOSH!', 'DRIP!', 'PLOP!', 'BLOOP!',

  // Emotion sounds
  'GASP!', 'GULP!', 'SOB!', 'SNIFF!', 'GIGGLE!', 'HAHA!', 'HEHE!',
  'YAWN!', 'SIGH!', 'HMM...', 'AH!', 'OH!', 'WOW!', 'YAY!',

  // Animal sounds
  'ROAR!', 'GROWL!', 'MEOW!', 'WOOF!', 'TWEET!', 'BUZZ!', 'HISS!',

  // Magic/Mystery
  'POOF!', 'ZAP!', 'SPARKLE!', '✨', 'SHIMMER!', 'GLOW!',

  // Other
  'TICK-TOCK!', 'RING!', 'DING!', 'KNOCK!', 'TAP!', 'STOMP!',
];

// Comic templates
export const COMIC_TEMPLATES: ComicTemplate[] = [
  {
    id: 'classic-4-panel',
    name: {
      de: 'Klassischer 4-Panel-Strip',
      ar: 'شريط كلاسيكي من 4 لوحات',
      en: 'Classic 4-Panel Strip',
      tr: '4 Panelli Klasik Şerit',
      ur: 'کلاسیکی 4 پینل سٹرپ',
    },
    description: {
      de: '2x2 Grid, perfekt für kurze Geschichten',
      ar: 'شبكة 2×2، مثالية للقصص القصيرة',
      en: '2x2 grid, perfect for short stories',
      tr: '2x2 ızgara, kısa hikayeler için mükemmel',
      ur: '2x2 گرڈ، مختصر کہانیوں کے لیے بہترین',
    },
    layout: '4-panel',
    panelCount: 4,
    preview: '📱',
  },
  {
    id: 'adventure-6-panel',
    name: {
      de: 'Abenteuer-Spread',
      ar: 'نشر المغامرة',
      en: 'Adventure Spread',
      tr: 'Macera Yayılımı',
      ur: 'ایڈونچر سپریڈ',
    },
    description: {
      de: '3x2 Grid für dynamische Abenteuer',
      ar: 'شبكة 3×2 للمغامرات الديناميكية',
      en: '3x2 grid for dynamic adventures',
      tr: 'Dinamik maceralar için 3x2 ızgara',
      ur: 'متحرک مہم جوئی کے لیے 3x2 گرڈ',
    },
    layout: '6-panel',
    panelCount: 6,
    preview: '🗺️',
  },
  {
    id: 'full-page-9-panel',
    name: {
      de: 'Ganze Seite (9 Panels)',
      ar: 'صفحة كاملة (9 لوحات)',
      en: 'Full Page (9 Panels)',
      tr: 'Tam Sayfa (9 Panel)',
      ur: 'مکمل صفحہ (9 پینل)',
    },
    description: {
      de: '3x3 Grid für detaillierte Erzählungen',
      ar: 'شبكة 3×3 للروايات التفصيلية',
      en: '3x3 grid for detailed narratives',
      tr: 'Ayrıntılı anlatılar için 3x3 ızgara',
      ur: 'تفصیلی بیانیے کے لیے 3x3 گرڈ',
    },
    layout: '9-panel',
    panelCount: 9,
    preview: '📄',
  },
  {
    id: 'dialogue-focus',
    name: {
      de: 'Dialog-Fokus',
      ar: 'تركيز الحوار',
      en: 'Dialogue Focus',
      tr: 'Diyalog Odağı',
      ur: 'مکالمہ فوکس',
    },
    description: {
      de: 'Große Sprechblasen für Gespräche',
      ar: 'فقاعات كلام كبيرة للمحادثات',
      en: 'Large speech bubbles for conversations',
      tr: 'Konuşmalar için büyük konuşma balonları',
      ur: 'بات چیت کے لیے بڑے اسپیچ ببل',
    },
    layout: '4-panel',
    panelCount: 4,
    preview: '💬',
  },
  {
    id: 'action-sequence',
    name: {
      de: 'Action-Sequenz',
      ar: 'تسلسل الحركة',
      en: 'Action Sequence',
      tr: 'Aksiyon Dizisi',
      ur: 'ایکشن سیکوئنس',
    },
    description: {
      de: 'Dynamische Winkel und Bewegungslinien',
      ar: 'زوايا ديناميكية وخطوط حركة',
      en: 'Dynamic angles and motion lines',
      tr: 'Dinamik açılar ve hareket çizgileri',
      ur: 'متحرک زاویے اور حرکت کی لکیریں',
    },
    layout: '6-panel',
    panelCount: 6,
    preview: '⚡',
  },
  {
    id: 'before-after',
    name: {
      de: 'Vorher/Nachher',
      ar: 'قبل/بعد',
      en: 'Before/After',
      tr: 'Önce/Sonra',
      ur: 'پہلے/بعد میں',
    },
    description: {
      de: 'Vergleich zweier Situationen',
      ar: 'مقارنة بين حالتين',
      en: 'Compare two situations',
      tr: 'İki durumu karşılaştır',
      ur: 'دو حالات کا موازنہ',
    },
    layout: '4-panel',
    panelCount: 4,
    preview: '↔️',
  },
  {
    id: 'character-intro',
    name: {
      de: 'Charakter-Vorstellung',
      ar: 'مقدمة الشخصية',
      en: 'Character Introduction',
      tr: 'Karakter Tanıtımı',
      ur: 'کردار کا تعارف',
    },
    description: {
      de: 'Stellt Charaktere ausführlich vor',
      ar: 'يقدم الشخصيات بالتفصيل',
      en: 'Introduces characters in detail',
      tr: 'Karakterleri ayrıntılı olarak tanıtır',
      ur: 'کرداروں کا تفصیلی تعارف',
    },
    layout: '6-panel',
    panelCount: 6,
    preview: '👤',
  },
  {
    id: 'problem-solution',
    name: {
      de: 'Problem/Lösung',
      ar: 'المشكلة/الحل',
      en: 'Problem/Solution',
      tr: 'Problem/Çözüm',
      ur: 'مسئلہ/حل',
    },
    description: {
      de: 'Zeigt Problem und dessen Lösung',
      ar: 'يظهر المشكلة وحلها',
      en: 'Shows problem and its solution',
      tr: 'Problemi ve çözümünü gösterir',
      ur: 'مسئلہ اور اس کا حل دکھاتا ہے',
    },
    layout: '6-panel',
    panelCount: 6,
    preview: '🔧',
  },
  {
    id: 'journey',
    name: {
      de: 'Reise',
      ar: 'الرحلة',
      en: 'Journey',
      tr: 'Yolculuk',
      ur: 'سفر',
    },
    description: {
      de: 'Erzählt eine Reisegeschichte',
      ar: 'يروي قصة رحلة',
      en: 'Tells a journey story',
      tr: 'Bir yolculuk hikayesi anlatır',
      ur: 'سفر کی کہانی سناتا ہے',
    },
    layout: '9-panel',
    panelCount: 9,
    preview: '🚶',
  },
  {
    id: 'dream-reality',
    name: {
      de: 'Traum/Realität',
      ar: 'الحلم/الواقع',
      en: 'Dream/Reality',
      tr: 'Rüya/Gerçeklik',
      ur: 'خواب/حقیقت',
    },
    description: {
      de: 'Unterscheidet zwischen Traum und Wirklichkeit',
      ar: 'يميز بين الحلم والواقع',
      en: 'Distinguishes between dream and reality',
      tr: 'Rüya ve gerçekliği ayırt eder',
      ur: 'خواب اور حقیقت میں فرق',
    },
    layout: '4-panel',
    panelCount: 4,
    preview: '💭',
  },
];

/**
 * Local storage keys
 */
const STORAGE_KEY_COMICS = 'comic-projects';
const STORAGE_KEY_SETTINGS = 'comic-maker-settings';

/**
 * Comic Maker Settings
 */
export interface ComicMakerSettings {
  defaultLayout: PanelLayout;
  defaultFont: ComicFont;
  defaultBubbleType: BubbleType;
  gridSnapping: boolean;
  showGuides: boolean;
  autoSave: boolean;
}

/**
 * Get default settings
 */
function getDefaultSettings(): ComicMakerSettings {
  return {
    defaultLayout: '4-panel',
    defaultFont: 'comic-sans',
    defaultBubbleType: 'round',
    gridSnapping: true,
    showGuides: true,
    autoSave: true,
  };
}

/**
 * Load settings from localStorage
 */
export function loadComicMakerSettings(): ComicMakerSettings {
  if (typeof window === 'undefined') return getDefaultSettings();

  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (saved) {
      return { ...getDefaultSettings(), ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Error loading comic maker settings:', error);
  }

  return getDefaultSettings();
}

/**
 * Save settings to localStorage
 */
export function saveComicMakerSettings(settings: ComicMakerSettings): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving comic maker settings:', error);
  }
}

/**
 * Load all comic projects
 */
export function loadComicProjects(): ComicProject[] {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(STORAGE_KEY_COMICS);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading comic projects:', error);
  }

  return [];
}

/**
 * Save comic projects to localStorage
 */
export function saveComicProjects(projects: ComicProject[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY_COMICS, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving comic projects:', error);
  }
}

/**
 * Create a new comic project
 */
export function createComicProject(
  title: string,
  author: string,
  locale: Locale,
  layout: PanelLayout = '4-panel',
  storyId?: string
): ComicProject {
  const panelCount = layout === '4-panel' ? 4 : layout === '6-panel' ? 6 : 9;

  const panels: ComicPanel[] = Array.from({ length: panelCount }, (_, i) => ({
    id: `panel-${i + 1}`,
    type: 'dialogue',
    background: 'forest', // default
    characters: [],
    speechBubbles: [],
    effects: [],
    borderStyle: 'solid',
  }));

  return {
    id: `comic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title,
    storyId,
    author,
    pages: [
      {
        layout,
        panels,
        pageNumber: 1,
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    locale,
    stars: 0,
  };
}

/**
 * Save a comic project
 */
export function saveComicProject(project: ComicProject): void {
  const projects = loadComicProjects();
  const index = projects.findIndex((p) => p.id === project.id);

  project.updatedAt = Date.now();

  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }

  saveComicProjects(projects);
}

/**
 * Delete a comic project
 */
export function deleteComicProject(projectId: string): boolean {
  const projects = loadComicProjects();
  const filtered = projects.filter((p) => p.id !== projectId);

  if (filtered.length < projects.length) {
    saveComicProjects(filtered);
    return true;
  }

  return false;
}

/**
 * Get a comic project by ID
 */
export function getComicProject(projectId: string): ComicProject | undefined {
  const projects = loadComicProjects();
  return projects.find((p) => p.id === projectId);
}

/**
 * Auto-convert story text into comic panels
 * Intelligently splits story into panels based on structure
 */
export function autoGenerateComicFromStory(
  storyText: string,
  storyTitle: string,
  storyId: string,
  characterEmoji: string,
  characterName: string,
  locale: Locale,
  layout: PanelLayout = '6-panel'
): ComicProject {
  const panelCount = layout === '4-panel' ? 4 : layout === '6-panel' ? 6 : 9;

  // Split story into sentences
  const sentences = storyText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Distribute sentences across panels
  const sentencesPerPanel = Math.ceil(sentences.length / panelCount);
  const panels: ComicPanel[] = [];

  for (let i = 0; i < panelCount; i++) {
    const panelSentences = sentences.slice(
      i * sentencesPerPanel,
      (i + 1) * sentencesPerPanel
    );
    const text = panelSentences.join('. ') + '.';

    // Determine panel type based on content
    let panelType: PanelType = 'dialogue';
    if (text.toLowerCase().includes('dachte') || text.toLowerCase().includes('thought')) {
      panelType = 'thought';
    } else if (text.toLowerCase().includes('sagte') || text.toLowerCase().includes('said')) {
      panelType = 'dialogue';
    } else if (text.match(/[!]/g)?.length || 0 > 1) {
      panelType = 'action';
    }

    // Add character to panel
    const character: ComicCharacter = {
      id: `char-${i}`,
      emoji: characterEmoji,
      name: characterName,
      position: { x: 50, y: 60 },
      size: 1.2,
      rotation: 0,
      flipped: i % 2 === 1, // alternate direction
      zIndex: 1,
    };

    // Create speech bubble
    const bubble: SpeechBubble = {
      id: `bubble-${i}`,
      type: panelType === 'thought' ? 'thought' : 'round',
      text,
      position: { x: 50, y: 20 },
      width: 80,
      height: 40,
      tailDirection: 'bottom',
      tailPosition: { x: 50, y: 100 },
      font: 'comic-sans',
      fontSize: 14,
      textColor: '#000000',
      bubbleColor: '#FFFFFF',
      borderColor: '#000000',
      characterId: character.id,
    };

    panels.push({
      id: `panel-${i + 1}`,
      type: panelType,
      background: i < 3 ? 'forest' : i < 5 ? 'home' : 'city',
      characters: [character],
      speechBubbles: [bubble],
      effects: [],
      borderStyle: 'solid',
    });
  }

  return {
    id: `comic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: `Comic: ${storyTitle}`,
    storyId,
    author: 'Auto-Generated',
    pages: [
      {
        layout,
        panels,
        pageNumber: 1,
      },
    ],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    locale,
    stars: 30, // Award stars for creating
  };
}

/**
 * Export comic as data URL for sharing
 */
export function exportComicAsDataURL(project: ComicProject): string {
  const json = JSON.stringify(project);
  const encoded = btoa(encodeURIComponent(json));
  return `comic-data:${encoded}`;
}

/**
 * Import comic from data URL
 */
export function importComicFromDataURL(dataURL: string): ComicProject | null {
  try {
    if (!dataURL.startsWith('comic-data:')) return null;

    const encoded = dataURL.replace('comic-data:', '');
    const json = decodeURIComponent(atob(encoded));
    const project = JSON.parse(json);

    // Assign new ID to avoid conflicts
    project.id = `comic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    project.createdAt = Date.now();
    project.updatedAt = Date.now();

    return project;
  } catch (error) {
    console.error('Error importing comic:', error);
    return null;
  }
}

/**
 * Get panel layout dimensions
 */
export function getPanelLayout(layout: PanelLayout): { rows: number; cols: number } {
  switch (layout) {
    case '4-panel':
      return { rows: 2, cols: 2 };
    case '6-panel':
      return { rows: 2, cols: 3 };
    case '9-panel':
      return { rows: 3, cols: 3 };
    default:
      return { rows: 2, cols: 2 };
  }
}

/**
 * Generate SVG for a speech bubble
 */
export function generateSpeechBubbleSVG(bubble: SpeechBubble): string {
  const { type, width, height, bubbleColor, borderColor, tailDirection, text } = bubble;

  let path = '';
  const rx = 10; // rounded corners

  if (type === 'round' || type === 'thought') {
    // Oval bubble
    path = `<ellipse cx="${width / 2}" cy="${height / 2}" rx="${width / 2}" ry="${height / 2}"
      fill="${bubbleColor}" stroke="${borderColor}" stroke-width="2"/>`;

    if (type === 'thought') {
      // Add thought circles
      path += `<circle cx="${width * 0.8}" cy="${height * 0.9}" r="3" fill="${bubbleColor}" stroke="${borderColor}"/>
               <circle cx="${width * 0.9}" cy="${height * 0.95}" r="2" fill="${bubbleColor}" stroke="${borderColor}"/>`;
    }
  } else if (type === 'rectangular') {
    path = `<rect x="0" y="0" width="${width}" height="${height}" rx="${rx}" ry="${rx}"
      fill="${bubbleColor}" stroke="${borderColor}" stroke-width="2"/>`;
  } else if (type === 'shout') {
    // Jagged edges for shout
    const points = [];
    const segments = 8;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = i % 2 === 0 ? 0 : 5;
      points.push(`${x},${y}`);
    }
    path = `<polygon points="${points.join(' ')}" fill="${bubbleColor}" stroke="${borderColor}" stroke-width="2"/>
            <rect x="0" y="5" width="${width}" height="${height - 10}" fill="${bubbleColor}" stroke="${borderColor}" stroke-width="2"/>`;
  }

  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${path}</svg>`;
}
