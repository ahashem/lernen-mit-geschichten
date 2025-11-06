/**
 * Character Designer System
 * SVG-based character builder with mix-and-match parts for kids
 */

import type { Locale } from './i18n';

// Helper function for generating unique IDs (SSR-safe)
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return generateUUID();
  }
  // Fallback for SSR or older browsers
  return 'char-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
}

export type Gender = 'boy' | 'girl' | 'neutral';
export type BodyType = 'bear' | 'fox' | 'lion' | 'mouse' | 'rabbit' | 'owl' | 'tiger' | 'human-boy' | 'human-girl';
export type HairStyle = 'none' | 'short' | 'long' | 'curly' | 'straight' | 'pigtails' | 'ponytail' | 'mohawk' | 'bald' | 'afro' | 'braids' | 'bun' | 'wavy' | 'spiky' | 'buzz' | 'bob' | 'shaggy' | 'bangs' | 'topknot' | 'dreadlocks';
export type EyeStyle = 'happy' | 'surprised' | 'sleepy' | 'winking' | 'angry' | 'sad' | 'excited' | 'curious' | 'sparkle' | 'heart' | 'star' | 'closed' | 'squint' | 'wide' | 'dreamy';
export type MouthStyle = 'smile' | 'laugh' | 'neutral' | 'sad' | 'surprised' | 'whistle' | 'tongue' | 'grin' | 'pout' | 'open' | 'teeth' | 'singing';
export type AccessoryType = 'hat' | 'glasses' | 'bowtie' | 'scarf' | 'crown' | 'flower' | 'bandana' | 'cape' | 'necklace' | 'earrings' | 'headband' | 'mask' | 'wings' | 'backpack' | 'guitar' | 'wand' | 'balloon' | 'umbrella' | 'badge' | 'watch' | 'sunglasses' | 'monocle' | 'bow' | 'tiara' | 'baseballcap';
export type PatternType = 'none' | 'stripes' | 'spots' | 'stars' | 'hearts' | 'dots' | 'zigzag' | 'waves' | 'flowers' | 'sparkles';
export type BackgroundShape = 'circle' | 'square' | 'star' | 'heart' | 'cloud' | 'hexagon' | 'diamond' | 'rainbow' | 'none' | 'bubble' | 'frame';
export type AnimationType = 'idle' | 'walking' | 'jumping' | 'waving';

export interface CharacterPart {
  id: string;
  type: 'body' | 'eyes' | 'mouth' | 'accessory' | 'background';
  svg: string;
  color?: string;
  size: number;
  rotation: number;
  x: number;
  y: number;
}

export interface CustomCharacter {
  id: string;
  name: string;
  gender: Gender;
  bodyType: BodyType;
  bodyColor: string;
  hairStyle: HairStyle;
  hairColor: string;
  eyeStyle: EyeStyle;
  eyeColor: string;
  mouthStyle: MouthStyle;
  mouthColor: string;
  accessories: {
    type: AccessoryType;
    color: string;
    size: number;
    rotation: number;
    x: number;
    y: number;
  }[];
  pattern: PatternType;
  patternColor: string;
  backgroundColor: string;
  backgroundShape: BackgroundShape;
  createdAt: number;
  lastModified: number;
}

export interface CharacterHistory {
  states: CustomCharacter[];
  currentIndex: number;
}

// Body type SVG templates (simplified versions)
export const BODY_TEMPLATES: Record<BodyType, string> = {
  bear: `
    <g id="bear-body">
      <ellipse cx="100" cy="120" rx="60" ry="80" fill="currentColor" />
      <circle cx="70" cy="70" r="25" fill="currentColor" />
      <circle cx="130" cy="70" r="25" fill="currentColor" />
      <circle cx="100" cy="95" r="45" fill="currentColor" />
    </g>
  `,
  fox: `
    <g id="fox-body">
      <ellipse cx="100" cy="130" rx="50" ry="70" fill="currentColor" />
      <polygon points="70,60 100,85 85,30" fill="currentColor" />
      <polygon points="130,60 100,85 115,30" fill="currentColor" />
      <circle cx="100" cy="90" r="40" fill="currentColor" />
    </g>
  `,
  lion: `
    <g id="lion-body">
      <ellipse cx="100" cy="125" rx="55" ry="75" fill="currentColor" />
      <circle cx="100" cy="90" r="50" fill="currentColor" />
      <circle cx="60" cy="60" r="15" fill="currentColor" opacity="0.7" />
      <circle cx="70" cy="75" r="15" fill="currentColor" opacity="0.7" />
      <circle cx="130" cy="75" r="15" fill="currentColor" opacity="0.7" />
      <circle cx="140" cy="60" r="15" fill="currentColor" opacity="0.7" />
    </g>
  `,
  mouse: `
    <g id="mouse-body">
      <ellipse cx="100" cy="140" rx="40" ry="60" fill="currentColor" />
      <circle cx="100" cy="100" r="35" fill="currentColor" />
      <ellipse cx="65" cy="75" rx="20" ry="30" fill="currentColor" />
      <ellipse cx="135" cy="75" rx="20" ry="30" fill="currentColor" />
    </g>
  `,
  rabbit: `
    <g id="rabbit-body">
      <ellipse cx="100" cy="130" rx="50" ry="70" fill="currentColor" />
      <circle cx="100" cy="95" r="40" fill="currentColor" />
      <ellipse cx="75" cy="40" rx="12" ry="35" fill="currentColor" />
      <ellipse cx="125" cy="40" rx="12" ry="35" fill="currentColor" />
    </g>
  `,
  owl: `
    <g id="owl-body">
      <ellipse cx="100" cy="115" rx="60" ry="85" fill="currentColor" />
      <circle cx="80" cy="90" r="20" fill="white" />
      <circle cx="120" cy="90" r="20" fill="white" />
      <polygon points="85,45 100,55 115,45 100,35" fill="currentColor" />
    </g>
  `,
  tiger: `
    <g id="tiger-body">
      <ellipse cx="100" cy="125" rx="55" ry="75" fill="currentColor" />
      <circle cx="100" cy="90" r="45" fill="currentColor" />
      <circle cx="75" cy="75" r="15" fill="currentColor" />
      <circle cx="125" cy="75" r="15" fill="currentColor" />
    </g>
  `,
  'human-boy': `
    <g id="human-boy-body">
      <ellipse cx="100" cy="135" rx="45" ry="65" fill="currentColor" />
      <circle cx="100" cy="90" r="40" fill="currentColor" />
      <rect x="75" y="130" width="15" height="45" rx="8" fill="currentColor" />
      <rect x="110" y="130" width="15" height="45" rx="8" fill="currentColor" />
    </g>
  `,
  'human-girl': `
    <g id="human-girl-body">
      <path d="M 100 100 L 70 130 L 75 175 L 85 175 L 90 140 L 100 140 L 110 140 L 115 175 L 125 175 L 130 130 Z" fill="currentColor" />
      <circle cx="100" cy="90" r="38" fill="currentColor" />
      <rect x="78" y="140" width="12" height="40" rx="6" fill="currentColor" />
      <rect x="110" y="140" width="12" height="40" rx="6" fill="currentColor" />
    </g>
  `,
};

// Hairstyle SVG templates
export const HAIR_TEMPLATES: Record<HairStyle, string> = {
  none: '',
  short: `<path d="M 70 75 Q 100 55 130 75 L 125 85 Q 100 65 75 85 Z" fill="currentColor"/>`,
  long: `<path d="M 70 75 Q 100 55 130 75 L 130 120 Q 100 125 70 120 Z" fill="currentColor"/>`,
  curly: `<path d="M 70 75 Q 65 65 70 60 Q 75 65 80 60 Q 85 65 90 60 Q 95 65 100 60 Q 105 65 110 60 Q 115 65 120 60 Q 125 65 130 60 Q 135 65 130 75" fill="currentColor"/>`,
  straight: `<rect x="70" y="55" width="60" height="35" fill="currentColor"/>`,
  pigtails: `<g><circle cx="75" cy="75" r="18" fill="currentColor"/><circle cx="125" cy="75" r="18" fill="currentColor"/><ellipse cx="75" cy="85" rx="12" ry="25" fill="currentColor"/><ellipse cx="125" cy="85" rx="12" ry="25" fill="currentColor"/></g>`,
  ponytail: `<g><path d="M 70 75 Q 100 55 130 75 L 125 85 Q 100 65 75 85 Z" fill="currentColor"/><ellipse cx="105" cy="50" rx="10" ry="30" fill="currentColor" transform="rotate(-20 105 50)"/></g>`,
  mohawk: `<path d="M 95 40 L 100 25 L 105 40 L 105 70 L 95 70 Z" fill="currentColor"/>`,
  bald: `<circle cx="100" cy="75" r="42" fill="currentColor" opacity="0.3"/>`,
  afro: `<circle cx="100" cy="65" r="45" fill="currentColor"/>`,
  braids: `<g><path d="M 75 75 Q 70 90 68 110" stroke="currentColor" fill="none" stroke-width="6"/><path d="M 125 75 Q 130 90 132 110" stroke="currentColor" fill="none" stroke-width="6"/></g>`,
  bun: `<circle cx="100" cy="55" r="18" fill="currentColor"/>`,
  wavy: `<path d="M 70 75 Q 75 60 85 65 Q 95 70 100 65 Q 105 60 115 65 Q 125 70 130 75 L 130 85 Q 100 70 70 85 Z" fill="currentColor"/>`,
  spiky: `<path d="M 75 75 L 70 55 M 85 75 L 85 50 M 95 75 L 95 48 M 105 75 L 105 48 M 115 75 L 115 50 M 125 75 L 130 55" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>`,
  buzz: `<path d="M 70 75 Q 100 58 130 75 L 128 80 Q 100 63 72 80 Z" fill="currentColor"/>`,
  bob: `<path d="M 70 75 Q 100 55 130 75 L 130 95 Q 100 100 70 95 Z" fill="currentColor"/>`,
  shaggy: `<path d="M 70 75 Q 100 55 130 75 L 132 85 L 128 90 L 130 95 Q 100 80 70 95 L 72 90 L 68 85 Z" fill="currentColor"/>`,
  bangs: `<g><path d="M 70 75 Q 100 55 130 75" fill="currentColor"/><path d="M 75 75 L 75 85 M 85 75 L 85 87 M 95 75 L 95 88 M 105 75 L 105 87 M 115 75 L 115 85 M 125 75 L 125 85" stroke="currentColor" stroke-width="4"/></g>`,
  topknot: `<circle cx="100" cy="45" r="15" fill="currentColor"/>`,
  dreadlocks: `<g><path d="M 75 75 Q 72 95 70 115" stroke="currentColor" fill="none" stroke-width="5"/><path d="M 85 75 Q 82 95 80 115" stroke="currentColor" fill="none" stroke-width="5"/><path d="M 95 75 Q 95 95 95 115" stroke="currentColor" fill="none" stroke-width="5"/><path d="M 105 75 Q 105 95 105 115" stroke="currentColor" fill="none" stroke-width="5"/><path d="M 115 75 Q 118 95 120 115" stroke="currentColor" fill="none" stroke-width="5"/><path d="M 125 75 Q 128 95 130 115" stroke="currentColor" fill="none" stroke-width="5"/></g>`,
};

// Eye styles SVG templates
export const EYE_TEMPLATES: Record<EyeStyle, string> = {
  happy: `<g><circle cx="80" cy="95" r="8" fill="black"/><circle cx="120" cy="95" r="8" fill="black"/><path d="M 75 90 Q 80 88 85 90" stroke="black" fill="none" stroke-width="2"/><path d="M 115 90 Q 120 88 125 90" stroke="black" fill="none" stroke-width="2"/></g>`,
  surprised: `<g><circle cx="80" cy="95" r="10" fill="black"/><circle cx="120" cy="95" r="10" fill="black"/></g>`,
  sleepy: `<g><path d="M 75 95 Q 80 98 85 95" stroke="black" fill="none" stroke-width="2"/><path d="M 115 95 Q 120 98 125 95" stroke="black" fill="none" stroke-width="2"/></g>`,
  winking: `<g><circle cx="80" cy="95" r="8" fill="black"/><path d="M 115 95 Q 120 98 125 95" stroke="black" fill="none" stroke-width="2"/></g>`,
  angry: `<g><circle cx="80" cy="95" r="7" fill="black"/><circle cx="120" cy="95" r="7" fill="black"/><path d="M 70 88 L 85 92" stroke="black" stroke-width="2"/><path d="M 130 88 L 115 92" stroke="black" stroke-width="2"/></g>`,
  sad: `<g><circle cx="80" cy="95" r="8" fill="black"/><circle cx="120" cy="95" r="8" fill="black"/><path d="M 75 88 Q 80 86 85 88" stroke="black" fill="none" stroke-width="2"/><path d="M 115 88 Q 120 86 125 88" stroke="black" fill="none" stroke-width="2"/></g>`,
  excited: `<g><circle cx="80" cy="95" r="9" fill="black"/><circle cx="120" cy="95" r="9" fill="black"/><circle cx="80" cy="92" r="3" fill="white"/><circle cx="120" cy="92" r="3" fill="white"/></g>`,
  curious: `<g><circle cx="75" cy="95" r="8" fill="black"/><circle cx="125" cy="95" r="8" fill="black"/></g>`,
  sparkle: `<g><circle cx="80" cy="95" r="8" fill="black"/><circle cx="120" cy="95" r="8" fill="black"/><path d="M 75 88 L 75 90 M 73 89 L 77 89 M 118 88 L 118 90 M 116 89 L 120 89" stroke="gold" stroke-width="1.5"/></g>`,
  heart: `<g><path d="M 80 92 Q 74 86 70 91 Q 70 96 80 102 Q 90 96 90 91 Q 90 86 84 92" fill="red"/><path d="M 120 92 Q 114 86 110 91 Q 110 96 120 102 Q 130 96 130 91 Q 130 86 124 92" fill="red"/></g>`,
  star: `<g><path d="M 80 88 L 82 94 L 88 94 L 83 98 L 85 104 L 80 100 L 75 104 L 77 98 L 72 94 L 78 94 Z" fill="gold"/><path d="M 120 88 L 122 94 L 128 94 L 123 98 L 125 104 L 120 100 L 115 104 L 117 98 L 112 94 L 118 94 Z" fill="gold"/></g>`,
  closed: `<g><path d="M 75 95 L 85 95" stroke="black" stroke-width="2"/><path d="M 115 95 L 125 95" stroke="black" stroke-width="2"/></g>`,
  squint: `<g><path d="M 75 95 Q 80 97 85 95" stroke="black" fill="none" stroke-width="2"/><path d="M 115 95 Q 120 97 125 95" stroke="black" fill="none" stroke-width="2"/></g>`,
  wide: `<g><circle cx="80" cy="95" r="11" fill="white" stroke="black" stroke-width="2"/><circle cx="120" cy="95" r="11" fill="white" stroke="black" stroke-width="2"/><circle cx="80" cy="95" r="6" fill="black"/><circle cx="120" cy="95" r="6" fill="black"/></g>`,
  dreamy: `<g><circle cx="80" cy="95" r="8" fill="black"/><circle cx="120" cy="95" r="8" fill="black"/><path d="M 70 85 Q 68 80 70 78" stroke="purple" fill="none" stroke-width="1.5"/><path d="M 130 85 Q 132 80 130 78" stroke="purple" fill="none" stroke-width="1.5"/></g>`,
};

// Mouth styles SVG templates
export const MOUTH_TEMPLATES: Record<MouthStyle, string> = {
  smile: `<path d="M 85 115 Q 100 125 115 115" stroke="black" fill="none" stroke-width="2"/>`,
  laugh: `<path d="M 80 115 Q 100 130 120 115" stroke="black" fill="none" stroke-width="3"/><path d="M 85 118 Q 100 125 115 118" fill="pink"/>`,
  neutral: `<line x1="85" y1="120" x2="115" y2="120" stroke="black" stroke-width="2"/>`,
  sad: `<path d="M 85 125 Q 100 115 115 125" stroke="black" fill="none" stroke-width="2"/>`,
  surprised: `<ellipse cx="100" cy="120" rx="8" ry="12" fill="black"/>`,
  whistle: `<circle cx="100" cy="120" r="6" fill="none" stroke="black" stroke-width="2"/>`,
  tongue: `<path d="M 85 115 Q 100 125 115 115" stroke="black" fill="none" stroke-width="2"/><ellipse cx="100" cy="125" rx="5" ry="8" fill="pink"/>`,
  grin: `<path d="M 80 115 Q 100 128 120 115" stroke="black" fill="none" stroke-width="2"/><rect x="85" y="118" width="4" height="6" fill="white"/><rect x="92" y="118" width="4" height="6" fill="white"/><rect x="104" y="118" width="4" height="6" fill="white"/><rect x="111" y="118" width="4" height="6" fill="white"/>`,
  pout: `<ellipse cx="100" cy="120" rx="10" ry="6" fill="pink"/>`,
  open: `<ellipse cx="100" cy="120" rx="10" ry="15" fill="black"/>`,
  teeth: `<path d="M 85 115 Q 100 125 115 115" stroke="black" fill="white" stroke-width="2"/><line x1="90" y1="115" x2="90" y2="120" stroke="black"/><line x1="95" y1="115" x2="95" y2="120" stroke="black"/><line x1="100" y1="115" x2="100" y2="120" stroke="black"/><line x1="105" y1="115" x2="105" y2="120" stroke="black"/><line x1="110" y1="115" x2="110" y2="120" stroke="black"/>`,
  singing: `<path d="M 85 115 Q 100 130 115 115" stroke="black" fill="none" stroke-width="2"/><text x="120" y="105" font-size="12">♪</text>`,
};

// Accessory SVG templates (simplified)
export const ACCESSORY_TEMPLATES: Record<AccessoryType, string> = {
  hat: `<g><rect x="70" y="50" width="60" height="8" fill="currentColor"/><rect x="80" y="35" width="40" height="15" fill="currentColor"/></g>`,
  glasses: `<g><circle cx="80" cy="95" r="12" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="120" cy="95" r="12" fill="none" stroke="currentColor" stroke-width="2"/><line x1="92" y1="95" x2="108" y2="95" stroke="currentColor" stroke-width="2"/></g>`,
  bowtie: `<path d="M 85 135 L 100 140 L 115 135 L 100 130 Z M 70 135 L 85 140 L 85 130 Z M 115 135 L 130 140 L 130 130 Z" fill="currentColor"/>`,
  scarf: `<g><rect x="85" y="130" width="30" height="50" fill="currentColor"/><rect x="78" y="135" width="10" height="8" fill="currentColor"/><rect x="112" y="135" width="10" height="8" fill="currentColor"/></g>`,
  crown: `<path d="M 70 70 L 75 60 L 80 70 L 90 55 L 100 70 L 110 55 L 120 70 L 125 60 L 130 70 Z" fill="gold" stroke="orange" stroke-width="1"/>`,
  flower: `<g><circle cx="75" cy="65" r="8" fill="pink"/><circle cx="68" cy="72" r="8" fill="pink"/><circle cx="82" cy="72" r="8" fill="pink"/><circle cx="75" cy="79" r="8" fill="pink"/><circle cx="75" cy="72" r="5" fill="yellow"/></g>`,
  bandana: `<path d="M 75 75 Q 100 65 125 75 L 130 80 Q 100 70 70 80 Z" fill="currentColor"/>`,
  cape: `<path d="M 85 130 Q 70 150 65 180 L 75 180 Q 80 150 100 140 Q 120 150 125 180 L 135 180 Q 130 150 115 130" fill="currentColor" opacity="0.8"/>`,
  necklace: `<circle cx="100" cy="140" r="20" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="100" cy="145" r="5" fill="gold"/>`,
  earrings: `<g><circle cx="68" cy="100" r="4" fill="gold"/><circle cx="132" cy="100" r="4" fill="gold"/></g>`,
  headband: `<ellipse cx="100" cy="70" rx="35" ry="8" fill="currentColor"/>`,
  mask: `<path d="M 70 90 Q 100 85 130 90 Q 128 100 125 95 Q 120 105 100 105 Q 80 105 75 95 Q 72 100 70 90" fill="currentColor"/>`,
  wings: `<g><path d="M 60 120 Q 40 100 50 140" fill="white" stroke="gray" stroke-width="1" opacity="0.7"/><path d="M 140 120 Q 160 100 150 140" fill="white" stroke="gray" stroke-width="1" opacity="0.7"/></g>`,
  backpack: `<rect x="85" y="125" width="30" height="40" rx="5" fill="currentColor"/>`,
  guitar: `<g><ellipse cx="130" cy="140" rx="15" ry="25" fill="brown"/><rect x="128" y="110" width="4" height="30" fill="brown"/><circle cx="130" cy="140" r="8" fill="black" opacity="0.3"/></g>`,
  wand: `<g><line x1="130" y1="80" x2="145" y2="65" stroke="currentColor" stroke-width="3"/><path d="M 145 60 L 150 65 L 145 70 L 140 65 Z" fill="gold"/><circle cx="148" cy="63" r="2" fill="yellow"/></g>`,
  balloon: `<g><ellipse cx="130" cy="60" rx="12" ry="15" fill="currentColor"/><line x1="130" y1="75" x2="135" y2="100" stroke="currentColor" stroke-width="1"/></g>`,
  umbrella: `<g><path d="M 60 100 Q 70 90 80 100" fill="currentColor"/><line x1="70" y1="100" x2="70" y2="120" stroke="currentColor" stroke-width="2"/></g>`,
  badge: `<g><circle cx="115" cy="135" r="8" fill="gold" stroke="orange" stroke-width="1"/><text x="112" y="139" font-size="10" fill="white">★</text></g>`,
  watch: `<g><rect x="65" y="145" width="15" height="10" rx="2" fill="currentColor"/><circle cx="72.5" cy="150" r="4" fill="white"/></g>`,
  sunglasses: `<g><rect x="68" y="90" width="24" height="12" rx="6" fill="currentColor"/><rect x="108" y="90" width="24" height="12" rx="6" fill="currentColor"/><line x1="92" y1="96" x2="108" y2="96" stroke="currentColor" stroke-width="2"/></g>`,
  monocle: `<g><circle cx="80" cy="95" r="15" fill="none" stroke="currentColor" stroke-width="2"/><line x1="80" y1="110" x2="70" y2="125" stroke="currentColor" stroke-width="2"/></g>`,
  bow: `<path d="M 90 70 Q 85 65 90 60 L 100 65 L 110 60 Q 115 65 110 70 L 100 65 Z" fill="currentColor"/>`,
  tiara: `<path d="M 75 75 L 80 65 L 85 72 L 90 60 L 95 72 L 100 58 L 105 72 L 110 60 L 115 72 L 120 65 L 125 75" fill="gold" stroke="orange" stroke-width="1"/>`,
  baseballcap: `<g><ellipse cx="100" cy="72" rx="32" ry="8" fill="currentColor"/><path d="M 70 72 Q 100 55 130 72 L 125 80 Q 100 65 75 80 Z" fill="currentColor"/><path d="M 130 72 L 155 75 L 155 78 L 130 75 Z" fill="currentColor"/></g>`,
};

// Pattern SVG definitions
export const PATTERN_TEMPLATES: Record<PatternType, string> = {
  none: '',
  stripes: `<pattern id="stripes" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="0" y2="10" stroke="currentColor" stroke-width="4"/></pattern>`,
  spots: `<pattern id="spots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="3" fill="currentColor"/><circle cx="15" cy="15" r="3" fill="currentColor"/></pattern>`,
  stars: `<pattern id="stars" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="5" y="15" font-size="12" fill="currentColor">★</text></pattern>`,
  hearts: `<pattern id="hearts" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="5" y="15" font-size="12" fill="currentColor">♥</text></pattern>`,
  dots: `<pattern id="dots" x="0" y="0" width="15" height="15" patternUnits="userSpaceOnUse"><circle cx="7.5" cy="7.5" r="2" fill="currentColor"/></pattern>`,
  zigzag: `<pattern id="zigzag" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse"><path d="M 0 5 L 5 0 L 10 5 L 15 0 L 20 5" stroke="currentColor" fill="none" stroke-width="2"/></pattern>`,
  waves: `<pattern id="waves" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse"><path d="M 0 5 Q 5 0 10 5 T 20 5" stroke="currentColor" fill="none" stroke-width="2"/></pattern>`,
  flowers: `<pattern id="flowers" x="0" y="0" width="25" height="25" patternUnits="userSpaceOnUse"><text x="8" y="18" font-size="14" fill="currentColor">✿</text></pattern>`,
  sparkles: `<pattern id="sparkles" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><text x="5" y="15" font-size="12" fill="currentColor">✨</text></pattern>`,
};

// Background shape templates
export const BACKGROUND_TEMPLATES: Record<BackgroundShape, string> = {
  none: '',
  circle: `<circle cx="100" cy="100" r="95" fill="currentColor" opacity="0.3"/>`,
  square: `<rect x="10" y="10" width="180" height="180" rx="10" fill="currentColor" opacity="0.3"/>`,
  star: `<path d="M 100 10 L 115 70 L 180 80 L 130 125 L 145 190 L 100 155 L 55 190 L 70 125 L 20 80 L 85 70 Z" fill="currentColor" opacity="0.3"/>`,
  heart: `<path d="M 100 40 Q 70 10 40 40 Q 10 70 40 120 L 100 180 L 160 120 Q 190 70 160 40 Q 130 10 100 40" fill="currentColor" opacity="0.3"/>`,
  cloud: `<path d="M 40 100 Q 40 80 60 80 Q 60 60 85 60 Q 110 60 110 80 Q 140 80 140 100 Q 140 120 110 120 L 60 120 Q 40 120 40 100" fill="currentColor" opacity="0.3"/>`,
  hexagon: `<path d="M 100 20 L 160 55 L 160 130 L 100 165 L 40 130 L 40 55 Z" fill="currentColor" opacity="0.3"/>`,
  diamond: `<path d="M 100 20 L 160 100 L 100 180 L 40 100 Z" fill="currentColor" opacity="0.3"/>`,
  rainbow: `<path d="M 20 180 Q 100 50 180 180" fill="none" stroke="red" stroke-width="8" opacity="0.4"/><path d="M 20 180 Q 100 60 180 180" fill="none" stroke="orange" stroke-width="8" opacity="0.4"/><path d="M 20 180 Q 100 70 180 180" fill="none" stroke="yellow" stroke-width="8" opacity="0.4"/>`,
  bubble: `<circle cx="100" cy="100" r="90" fill="currentColor" opacity="0.2"/><circle cx="80" cy="80" r="15" fill="white" opacity="0.5"/><circle cx="120" cy="85" r="10" fill="white" opacity="0.5"/>`,
  frame: `<rect x="15" y="15" width="170" height="170" fill="none" stroke="currentColor" stroke-width="8" rx="15" opacity="0.5"/>`,
};

// Default character
export const DEFAULT_CHARACTER: CustomCharacter = {
  id: generateUUID(),
  name: 'Mein Charakter',
  gender: 'neutral',
  bodyType: 'bear',
  bodyColor: '#8B4513',
  hairStyle: 'none',
  hairColor: '#654321',
  eyeStyle: 'happy',
  eyeColor: '#000000',
  mouthStyle: 'smile',
  mouthColor: '#000000',
  accessories: [],
  pattern: 'none',
  patternColor: '#654321',
  backgroundColor: '#87CEEB',
  backgroundShape: 'circle',
  createdAt: Date.now(),
  lastModified: Date.now(),
};

// Character Designer Class
export class CharacterDesigner {
  private character: CustomCharacter;
  private history: CharacterHistory;
  private maxHistorySize = 50;

  constructor(initialCharacter?: CustomCharacter) {
    this.character = initialCharacter || { ...DEFAULT_CHARACTER };
    this.history = {
      states: [{ ...this.character }],
      currentIndex: 0,
    };
  }

  // Get current character
  getCharacter(): CustomCharacter {
    return { ...this.character };
  }

  // Update character with history tracking
  updateCharacter(updates: Partial<CustomCharacter>): void {
    this.character = {
      ...this.character,
      ...updates,
      lastModified: Date.now(),
    };
    this.addToHistory();
  }

  // Add current state to history
  private addToHistory(): void {
    // Remove any redo states
    this.history.states = this.history.states.slice(0, this.history.currentIndex + 1);

    // Add new state
    this.history.states.push({ ...this.character });
    this.history.currentIndex++;

    // Limit history size
    if (this.history.states.length > this.maxHistorySize) {
      this.history.states.shift();
      this.history.currentIndex--;
    }
  }

  // Undo
  undo(): boolean {
    if (this.history.currentIndex > 0) {
      this.history.currentIndex--;
      this.character = { ...this.history.states[this.history.currentIndex] };
      return true;
    }
    return false;
  }

  // Redo
  redo(): boolean {
    if (this.history.currentIndex < this.history.states.length - 1) {
      this.history.currentIndex++;
      this.character = { ...this.history.states[this.history.currentIndex] };
      return true;
    }
    return false;
  }

  // Can undo
  canUndo(): boolean {
    return this.history.currentIndex > 0;
  }

  // Can redo
  canRedo(): boolean {
    return this.history.currentIndex < this.history.states.length - 1;
  }

  // Generate SVG
  generateSVG(width = 200, height = 200): string {
    const c = this.character;

    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${width}" height="${height}">`;

    // Add pattern definitions if needed
    if (c.pattern !== 'none') {
      svg += `<defs>${PATTERN_TEMPLATES[c.pattern].replace(/currentColor/g, c.patternColor)}</defs>`;
    }

    // Background shape
    if (c.backgroundShape !== 'none') {
      svg += BACKGROUND_TEMPLATES[c.backgroundShape].replace(/currentColor/g, c.backgroundColor);
    }

    // Body with pattern overlay
    let bodyGroup = BODY_TEMPLATES[c.bodyType].replace(/currentColor/g, c.bodyColor);
    if (c.pattern !== 'none') {
      bodyGroup = bodyGroup.replace(/<g id="[^"]*">/, `$& <rect x="0" y="0" width="200" height="200" fill="url(#${c.pattern})" opacity="0.4"/>`);
    }
    svg += bodyGroup;

    // Hair (render behind head for most styles)
    if (c.hairStyle !== 'none') {
      svg += HAIR_TEMPLATES[c.hairStyle].replace(/currentColor/g, c.hairColor);
    }

    // Eyes
    svg += EYE_TEMPLATES[c.eyeStyle];

    // Mouth
    svg += MOUTH_TEMPLATES[c.mouthStyle];

    // Accessories
    c.accessories.forEach(acc => {
      const template = ACCESSORY_TEMPLATES[acc.type].replace(/currentColor/g, acc.color);
      svg += `<g transform="translate(${acc.x}, ${acc.y}) scale(${acc.size}) rotate(${acc.rotation}, 100, 100)">${template}</g>`;
    });

    svg += '</svg>';
    return svg;
  }

  // Export as PNG (client-side only - returns data URL)
  async exportAsPNG(width = 400, height = 400): Promise<string> {
    return new Promise((resolve, reject) => {
      const svg = this.generateSVG(width, height);
      const img = new Image();
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
    });
  }

  // Generate QR code data (character JSON)
  getShareData(): string {
    return JSON.stringify(this.character);
  }

  // Load from share data
  static fromShareData(data: string): CharacterDesigner {
    try {
      const character = JSON.parse(data) as CustomCharacter;
      return new CharacterDesigner(character);
    } catch (e) {
      return new CharacterDesigner();
    }
  }
}

// Local storage manager for custom characters
export class CharacterStorage {
  private static STORAGE_KEY = 'custom-characters';
  private static MAX_CHARACTERS = 10;

  static saveCharacter(character: CustomCharacter): void {
    const characters = this.getAllCharacters();
    const existingIndex = characters.findIndex(c => c.id === character.id);

    if (existingIndex >= 0) {
      characters[existingIndex] = character;
    } else {
      characters.push(character);

      // Limit to max characters
      if (characters.length > this.MAX_CHARACTERS) {
        characters.shift();
      }
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(characters));
  }

  static getAllCharacters(): CustomCharacter[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  static getCharacter(id: string): CustomCharacter | null {
    const characters = this.getAllCharacters();
    return characters.find(c => c.id === id) || null;
  }

  static deleteCharacter(id: string): void {
    const characters = this.getAllCharacters().filter(c => c.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(characters));
  }

  static getCharacterCount(): number {
    return this.getAllCharacters().length;
  }
}
