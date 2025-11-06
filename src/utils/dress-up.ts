/**
 * Dress Up Studio System
 * Manages character customization, clothing items, and outfit management
 */

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  rarity: ItemRarity;
  unlocked: boolean;
  svgPath: string; // SVG path data or icon
  colors: string[]; // Available colors
  patterns: Pattern[];
  characterTypes?: string[]; // Compatible character types, undefined = all
  unlockCondition?: UnlockCondition;
}

export type ClothingCategory =
  | 'tops'
  | 'bottoms'
  | 'outerwear'
  | 'footwear'
  | 'accessories'
  | 'costumes';

export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export type Pattern =
  | 'solid'
  | 'stripes'
  | 'dots'
  | 'stars'
  | 'hearts'
  | 'flowers'
  | 'gradient'
  | 'glitter'
  | 'denim'
  | 'leather';

export interface UnlockCondition {
  type: 'story' | 'quiz' | 'achievement' | 'level' | 'event';
  requirement: string | number;
}

export interface Outfit {
  id: string;
  name: string;
  characterId: string;
  items: OutfitItem[];
  createdAt: Date;
  favorite: boolean;
}

export interface OutfitItem {
  itemId: string;
  color: string;
  pattern: Pattern;
  size: 'small' | 'medium' | 'large';
  flipped: boolean;
}

export interface Character {
  id: string;
  name: string;
  type: string; // bear, boy, girl, lion, etc.
  emoji: string;
  baseBody: string; // SVG path for base body
  expressions: Expression[];
  poses: Pose[];
  scale: number;
}

export type Expression = 'happy' | 'excited' | 'cool' | 'surprised' | 'neutral';
export type Pose = 'standing' | 'waving' | 'jumping' | 'sitting';
export type ViewAngle = 'front' | 'side' | 'back';

export interface CharacterState {
  character: Character;
  expression: Expression;
  pose: Pose;
  viewAngle: ViewAngle;
  scale: number;
}

export interface FashionTheme {
  id: string;
  name: string;
  items: string[]; // Item IDs
  description: string;
}

export interface FashionChallenge {
  id: string;
  date: string;
  theme: string;
  requirements: ChallengeRequirement[];
  reward: number; // stars
  completed: boolean;
}

export interface ChallengeRequirement {
  type: 'color' | 'category' | 'item' | 'rarity';
  value: string | number;
  count?: number;
}

// Color palette (20 colors)
export const COLORS = {
  red: '#FF6B6B',
  pink: '#FFB3BA',
  orange: '#FFA500',
  yellow: '#FFD93D',
  green: '#6BCF7F',
  lightblue: '#95E1D3',
  blue: '#4A90E2',
  purple: '#B565D8',
  brown: '#8B4513',
  black: '#2C2C2C',
  white: '#FFFFFF',
  gray: '#A9A9A9',
  gold: '#FFD700',
  silver: '#C0C0C0',
  navy: '#000080',
  teal: '#008080',
  lime: '#32CD32',
  magenta: '#FF00FF',
  coral: '#FF7F50',
  beige: '#F5F5DC',
};

// Fashion themes
export const FASHION_THEMES: FashionTheme[] = [
  {
    id: 'casual-day',
    name: 'Casual Day',
    items: ['t-shirt-basic', 'jeans', 'sneakers', 'cap'],
    description: 'Comfortable everyday outfit',
  },
  {
    id: 'formal-party',
    name: 'Formal Party',
    items: ['dress-fancy', 'dress-shoes', 'bow-tie', 'jewelry'],
    description: 'Dress to impress at parties',
  },
  {
    id: 'beach-vacation',
    name: 'Beach Vacation',
    items: ['swimsuit', 'shorts', 'sandals', 'sunglasses', 'sun-hat'],
    description: 'Perfect for sunny beaches',
  },
  {
    id: 'winter-wonderland',
    name: 'Winter Wonderland',
    items: ['sweater', 'winter-coat', 'scarf', 'boots', 'mittens'],
    description: 'Stay warm and cozy',
  },
  {
    id: 'sports-star',
    name: 'Sports Star',
    items: ['jersey', 'shorts', 'sneakers', 'headband'],
    description: 'Ready for action',
  },
  {
    id: 'school-uniform',
    name: 'School Uniform',
    items: ['shirt', 'pants', 'shoes', 'backpack'],
    description: 'Ready to learn',
  },
  {
    id: 'pajama-party',
    name: 'Pajama Party',
    items: ['pajamas', 'slippers', 'sleep-hat'],
    description: 'Cozy sleepover style',
  },
  {
    id: 'superhero',
    name: 'Superhero',
    items: ['hero-suit', 'cape', 'mask', 'boots'],
    description: 'Save the day in style',
  },
  {
    id: 'fairy-tale',
    name: 'Fairy Tale',
    items: ['princess-dress', 'crown', 'wand', 'glass-slippers'],
    description: 'Once upon a time...',
  },
  {
    id: 'space-explorer',
    name: 'Space Explorer',
    items: ['space-suit', 'helmet', 'space-boots'],
    description: 'To infinity and beyond',
  },
  {
    id: 'underwater-adventure',
    name: 'Underwater Adventure',
    items: ['wetsuit', 'flippers', 'snorkel', 'diving-mask'],
    description: 'Explore the ocean depths',
  },
  {
    id: 'safari-guide',
    name: 'Safari Guide',
    items: ['safari-shirt', 'khaki-pants', 'boots', 'safari-hat', 'binoculars'],
    description: 'Adventure awaits',
  },
  {
    id: 'chef',
    name: 'Chef',
    items: ['chef-jacket', 'chef-hat', 'apron'],
    description: 'Cooking with style',
  },
  {
    id: 'artist',
    name: 'Artist',
    items: ['smock', 'beret', 'paint-palette'],
    description: 'Create masterpieces',
  },
  {
    id: 'musician',
    name: 'Musician',
    items: ['band-shirt', 'ripped-jeans', 'headphones', 'sunglasses'],
    description: 'Rock star vibes',
  },
];

// Clothing items database (150 items across all categories)
export const CLOTHING_ITEMS: ClothingItem[] = [
  // TOPS (30 items)
  {
    id: 't-shirt-basic',
    name: 'Basic T-Shirt',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'dots'],
  },
  {
    id: 't-shirt-star',
    name: 'Star T-Shirt',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stars'],
  },
  {
    id: 't-shirt-heart',
    name: 'Heart T-Shirt',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'hearts'],
  },
  {
    id: 'shirt-button',
    name: 'Button Shirt',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'polo-shirt',
    name: 'Polo Shirt',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'tank-top',
    name: 'Tank Top',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M52,30 L68,30 L68,60 L52,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots', 'stars'],
  },
  {
    id: 'sweater',
    name: 'Cozy Sweater',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: true,
    svgPath: 'M48,30 L72,30 L72,62 L48,62 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'dots'],
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: true,
    svgPath: 'M48,28 L72,28 L72,62 L48,62 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'dress-simple',
    name: 'Simple Dress',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,30 L70,30 L75,70 L45,70 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots', 'flowers'],
    characterTypes: ['girl'],
  },
  {
    id: 'dress-fancy',
    name: 'Fancy Dress',
    category: 'tops',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M50,30 L70,30 L78,75 L42,75 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'glitter', 'flowers'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'level', requirement: 5 },
  },
  {
    id: 'princess-dress',
    name: 'Princess Dress',
    category: 'tops',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M50,30 L70,30 L80,75 L40,75 Z',
    colors: ['pink', 'purple', 'blue', 'gold'],
    patterns: ['solid', 'glitter', 'gradient'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'princess-stories' },
  },
  {
    id: 'jersey',
    name: 'Sports Jersey',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'story', requirement: '010-leo' },
  },
  {
    id: 'smock',
    name: 'Art Smock',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,30 L72,30 L72,60 L48,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots'],
    unlockCondition: { type: 'quiz', requirement: 5 },
  },
  {
    id: 'chef-jacket',
    name: 'Chef Jacket',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,30 L72,30 L72,62 L48,62 Z',
    colors: ['white', 'black'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'cooking' },
  },
  {
    id: 'band-shirt',
    name: 'Band T-Shirt',
    category: 'tops',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: ['black', 'white', 'red'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 8 },
  },
  {
    id: 'safari-shirt',
    name: 'Safari Shirt',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: ['beige', 'brown', 'green'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'adventure' },
  },
  {
    id: 'hero-suit',
    name: 'Hero Suit',
    category: 'tops',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M48,28 L72,28 L72,65 L48,65 Z',
    colors: ['red', 'blue', 'black', 'gold'],
    patterns: ['solid', 'gradient'],
    unlockCondition: { type: 'achievement', requirement: 'hero' },
  },
  {
    id: 'space-suit-top',
    name: 'Space Suit',
    category: 'tops',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M46,26 L74,26 L74,65 L46,65 Z',
    colors: ['white', 'silver', 'orange'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 10 },
  },
  {
    id: 'wetsuit-top',
    name: 'Wetsuit Top',
    category: 'tops',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,30 L72,30 L72,62 L48,62 Z',
    colors: ['blue', 'black', 'teal'],
    patterns: ['solid', 'gradient'],
    unlockCondition: { type: 'story', requirement: 'ocean' },
  },
  {
    id: 'pajama-top',
    name: 'Pajama Top',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'dots', 'stars'],
  },
  {
    id: 'swimsuit',
    name: 'Swimsuit',
    category: 'tops',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M52,32 L68,32 L68,55 L52,55 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'dots', 'flowers'],
  },
  {
    id: 'crop-top',
    name: 'Crop Top',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M52,32 L68,32 L68,50 L52,50 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'dots'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'level', requirement: 5 },
  },
  {
    id: 'blouse',
    name: 'Blouse',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,30 L70,30 L70,58 L50,58 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'flowers', 'dots'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'quiz', requirement: 3 },
  },
  {
    id: 'cardigan',
    name: 'Cardigan',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,30 L72,30 L72,62 L48,62 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'quiz', requirement: 4 },
  },
  {
    id: 'turtleneck',
    name: 'Turtleneck',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,28 L70,28 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 6 },
  },
  {
    id: 'tunic',
    name: 'Tunic',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,30 L72,30 L72,65 L48,65 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'flowers', 'dots'],
    unlockCondition: { type: 'story', requirement: 'medieval' },
  },
  {
    id: 'vest',
    name: 'Vest',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M52,32 L68,32 L68,58 L52,58 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'quiz', requirement: 6 },
  },
  {
    id: 'tutu-top',
    name: 'Tutu Top',
    category: 'tops',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M52,32 L68,32 L68,52 L52,52 Z',
    colors: ['pink', 'purple', 'white', 'blue'],
    patterns: ['solid', 'glitter'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'dancer' },
  },
  {
    id: 'rugby-shirt',
    name: 'Rugby Shirt',
    category: 'tops',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['stripes'],
    unlockCondition: { type: 'story', requirement: 'sports' },
  },
  {
    id: 'hawaiian-shirt',
    name: 'Hawaiian Shirt',
    category: 'tops',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M50,30 L70,30 L70,60 L50,60 Z',
    colors: ['red', 'blue', 'green', 'yellow'],
    patterns: ['flowers'],
    unlockCondition: { type: 'level', requirement: 12 },
  },

  // BOTTOMS (25 items)
  {
    id: 'jeans',
    name: 'Jeans',
    category: 'bottoms',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: ['blue', 'black', 'gray'],
    patterns: ['denim'],
  },
  {
    id: 'pants',
    name: 'Pants',
    category: 'bottoms',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
  },
  {
    id: 'shorts',
    name: 'Shorts',
    category: 'bottoms',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,60 L50,75 M70,60 L70,75',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'skirt-short',
    name: 'Short Skirt',
    category: 'bottoms',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M45,60 L75,60 L75,72 L45,72 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots', 'flowers'],
    characterTypes: ['girl'],
  },
  {
    id: 'skirt-long',
    name: 'Long Skirt',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M45,60 L75,60 L75,85 L45,85 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'flowers', 'dots'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'quiz', requirement: 3 },
  },
  {
    id: 'leggings',
    name: 'Leggings',
    category: 'bottoms',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'dots'],
    characterTypes: ['girl'],
  },
  {
    id: 'khaki-pants',
    name: 'Khaki Pants',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: ['beige', 'brown'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'adventure' },
  },
  {
    id: 'sweatpants',
    name: 'Sweatpants',
    category: 'bottoms',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
  },
  {
    id: 'cargo-shorts',
    name: 'Cargo Shorts',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,60 L50,78 M70,60 L70,78',
    colors: ['beige', 'green', 'gray'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 4 },
  },
  {
    id: 'tutu-skirt',
    name: 'Tutu Skirt',
    category: 'bottoms',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M40,60 L80,60 L80,70 L40,70 Z',
    colors: ['pink', 'purple', 'white', 'blue'],
    patterns: ['solid', 'glitter'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'dancer' },
  },
  {
    id: 'pajama-bottom',
    name: 'Pajama Bottom',
    category: 'bottoms',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'dots', 'stars'],
  },
  {
    id: 'swim-trunks',
    name: 'Swim Trunks',
    category: 'bottoms',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,60 L50,75 M70,60 L70,75',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'flowers'],
    characterTypes: ['boy', 'bear', 'lion'],
  },
  {
    id: 'ripped-jeans',
    name: 'Ripped Jeans',
    category: 'bottoms',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: ['blue', 'black'],
    patterns: ['denim'],
    unlockCondition: { type: 'level', requirement: 8 },
  },
  {
    id: 'dress-pants',
    name: 'Dress Pants',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: ['black', 'gray', 'navy'],
    patterns: ['solid'],
    unlockCondition: { type: 'quiz', requirement: 5 },
  },
  {
    id: 'capri-pants',
    name: 'Capri Pants',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,60 L50,80 M70,60 L70,80',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'quiz', requirement: 4 },
  },
  {
    id: 'joggers',
    name: 'Joggers',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'sports' },
  },
  {
    id: 'overalls',
    name: 'Overalls',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,30 L50,85 M70,30 L70,85',
    colors: ['blue', 'black'],
    patterns: ['denim', 'solid'],
    unlockCondition: { type: 'level', requirement: 5 },
  },
  {
    id: 'pleated-skirt',
    name: 'Pleated Skirt',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M45,60 L75,60 L75,75 L45,75 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'quiz', requirement: 6 },
  },
  {
    id: 'wrap-skirt',
    name: 'Wrap Skirt',
    category: 'bottoms',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M45,60 L75,60 L75,78 L45,78 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'flowers'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'level', requirement: 7 },
  },
  {
    id: 'bell-bottoms',
    name: 'Bell Bottoms',
    category: 'bottoms',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M50,60 L48,85 M70,60 L72,85',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'flowers'],
    unlockCondition: { type: 'level', requirement: 10 },
  },
  {
    id: 'bermuda-shorts',
    name: 'Bermuda Shorts',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,60 L50,78 M70,60 L70,78',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'story', requirement: 'summer' },
  },
  {
    id: 'culottes',
    name: 'Culottes',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,60 L48,80 M72,60 L72,80',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'level', requirement: 6 },
  },
  {
    id: 'track-pants',
    name: 'Track Pants',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,60 L50,85 M70,60 L70,85',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'story', requirement: 'sports' },
  },
  {
    id: 'dungarees',
    name: 'Dungarees',
    category: 'bottoms',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,30 L50,85 M70,30 L70,85',
    colors: ['blue', 'black', 'beige'],
    patterns: ['denim', 'solid'],
    unlockCondition: { type: 'quiz', requirement: 7 },
  },
  {
    id: 'pencil-skirt',
    name: 'Pencil Skirt',
    category: 'bottoms',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,60 L72,60 L72,82 L48,82 Z',
    colors: ['black', 'gray', 'navy'],
    patterns: ['solid'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'level', requirement: 9 },
  },

  // OUTERWEAR (20 items)
  {
    id: 'jacket-light',
    name: 'Light Jacket',
    category: 'outerwear',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M46,28 L74,28 L74,64 L46,64 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
  },
  {
    id: 'winter-coat',
    name: 'Winter Coat',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M44,26 L76,26 L76,68 L44,68 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'winter' },
  },
  {
    id: 'raincoat',
    name: 'Raincoat',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M44,26 L76,26 L76,68 L44,68 Z',
    colors: ['yellow', 'red', 'blue', 'green'],
    patterns: ['solid'],
    unlockCondition: { type: 'quiz', requirement: 3 },
  },
  {
    id: 'cape-hero',
    name: 'Hero Cape',
    category: 'outerwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M60,26 L60,70 L40,70 L60,26 L80,70 L60,70 Z',
    colors: ['red', 'blue', 'purple', 'black'],
    patterns: ['solid', 'gradient'],
    unlockCondition: { type: 'achievement', requirement: 'hero' },
  },
  {
    id: 'cape-wizard',
    name: 'Wizard Cape',
    category: 'outerwear',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M60,26 L60,72 L38,72 L60,26 L82,72 L60,72 Z',
    colors: ['purple', 'blue', 'black'],
    patterns: ['solid', 'stars'],
    unlockCondition: { type: 'achievement', requirement: 'wizard' },
  },
  {
    id: 'wings-fairy',
    name: 'Fairy Wings',
    category: 'outerwear',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M60,30 L40,40 L50,60 L60,30 L70,60 L80,40 Z',
    colors: ['pink', 'purple', 'white', 'lightblue'],
    patterns: ['glitter', 'gradient'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'fairy-tales' },
  },
  {
    id: 'wings-butterfly',
    name: 'Butterfly Wings',
    category: 'outerwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M60,30 L35,45 L50,65 L60,30 L70,65 L85,45 Z',
    colors: Object.keys(COLORS),
    patterns: ['gradient', 'dots'],
    unlockCondition: { type: 'level', requirement: 10 },
  },
  {
    id: 'vest-puffy',
    name: 'Puffy Vest',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,30 L72,30 L72,58 L48,58 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'quiz', requirement: 4 },
  },
  {
    id: 'denim-jacket',
    name: 'Denim Jacket',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,62 L46,62 Z',
    colors: ['blue', 'black'],
    patterns: ['denim'],
    unlockCondition: { type: 'level', requirement: 5 },
  },
  {
    id: 'leather-jacket',
    name: 'Leather Jacket',
    category: 'outerwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,62 L46,62 Z',
    colors: ['black', 'brown'],
    patterns: ['leather'],
    unlockCondition: { type: 'level', requirement: 12 },
  },
  {
    id: 'bomber-jacket',
    name: 'Bomber Jacket',
    category: 'outerwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,62 L46,62 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 8 },
  },
  {
    id: 'windbreaker',
    name: 'Windbreaker',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,64 L46,64 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'quiz', requirement: 5 },
  },
  {
    id: 'poncho',
    name: 'Poncho',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M40,30 L80,30 L78,68 L42,68 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'story', requirement: 'mexico' },
  },
  {
    id: 'lab-coat',
    name: 'Lab Coat',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,70 L46,70 Z',
    colors: ['white'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'science' },
  },
  {
    id: 'trench-coat',
    name: 'Trench Coat',
    category: 'outerwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M44,26 L76,26 L76,75 L44,75 Z',
    colors: ['beige', 'black', 'brown'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 11 },
  },
  {
    id: 'kimono',
    name: 'Kimono',
    category: 'outerwear',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M40,28 L80,28 L80,72 L40,72 Z',
    colors: Object.keys(COLORS),
    patterns: ['flowers', 'solid'],
    unlockCondition: { type: 'achievement', requirement: 'japan-stories' },
  },
  {
    id: 'cloak',
    name: 'Cloak',
    category: 'outerwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M60,26 L60,75 L35,75 L60,26 L85,75 L60,75 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'medieval' },
  },
  {
    id: 'varsity-jacket',
    name: 'Varsity Jacket',
    category: 'outerwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,62 L46,62 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'sports' },
  },
  {
    id: 'parka',
    name: 'Parka',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M44,26 L76,26 L76,70 L44,70 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'winter' },
  },
  {
    id: 'apron',
    name: 'Apron',
    category: 'outerwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,35 L72,35 L72,70 L48,70 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots'],
    unlockCondition: { type: 'story', requirement: 'cooking' },
  },

  // FOOTWEAR (20 items)
  {
    id: 'sneakers',
    name: 'Sneakers',
    category: 'footwear',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M48,85 L52,85 L52,88 L48,88 Z M68,85 L72,85 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'shoes',
    name: 'Shoes',
    category: 'footwear',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M48,85 L52,85 L52,88 L48,88 Z M68,85 L72,85 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
  },
  {
    id: 'sandals',
    name: 'Sandals',
    category: 'footwear',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M48,86 L52,86 L52,87 L48,87 Z M68,86 L72,86 L72,87 L68,87 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
  },
  {
    id: 'boots',
    name: 'Boots',
    category: 'footwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,82 L52,82 L52,88 L48,88 Z M68,82 L72,82 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'leather'],
    unlockCondition: { type: 'quiz', requirement: 3 },
  },
  {
    id: 'slippers',
    name: 'Slippers',
    category: 'footwear',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M48,86 L52,86 L52,88 L48,88 Z M68,86 L72,86 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots'],
  },
  {
    id: 'rain-boots',
    name: 'Rain Boots',
    category: 'footwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,80 L52,80 L52,88 L48,88 Z M68,80 L72,80 L72,88 L68,88 Z',
    colors: ['yellow', 'red', 'blue', 'green'],
    patterns: ['solid'],
    unlockCondition: { type: 'quiz', requirement: 4 },
  },
  {
    id: 'dress-shoes',
    name: 'Dress Shoes',
    category: 'footwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,85 L52,85 L52,88 L48,88 Z M68,85 L72,85 L72,88 L68,88 Z',
    colors: ['black', 'brown'],
    patterns: ['solid', 'leather'],
    unlockCondition: { type: 'level', requirement: 5 },
  },
  {
    id: 'flip-flops',
    name: 'Flip Flops',
    category: 'footwear',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M48,86 L52,86 L52,87 L48,87 Z M68,86 L72,86 L72,87 L68,87 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
  },
  {
    id: 'ballet-shoes',
    name: 'Ballet Shoes',
    category: 'footwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,86 L52,86 L52,88 L48,88 Z M68,86 L72,86 L72,88 L68,88 Z',
    colors: ['pink', 'white', 'black'],
    patterns: ['solid'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'dancer' },
  },
  {
    id: 'cowboy-boots',
    name: 'Cowboy Boots',
    category: 'footwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,80 L52,80 L52,88 L48,88 Z M68,80 L72,80 L72,88 L68,88 Z',
    colors: ['brown', 'black'],
    patterns: ['leather'],
    unlockCondition: { type: 'level', requirement: 8 },
  },
  {
    id: 'high-tops',
    name: 'High Tops',
    category: 'footwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,82 L52,82 L52,88 L48,88 Z M68,82 L72,82 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'quiz', requirement: 5 },
  },
  {
    id: 'cleats',
    name: 'Cleats',
    category: 'footwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,85 L52,85 L52,88 L48,88 Z M68,85 L72,85 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'sports' },
  },
  {
    id: 'snow-boots',
    name: 'Snow Boots',
    category: 'footwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,80 L52,80 L52,88 L48,88 Z M68,80 L72,80 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'winter' },
  },
  {
    id: 'flippers',
    name: 'Flippers',
    category: 'footwear',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,85 L54,85 L54,88 L46,88 Z M66,85 L74,85 L74,88 L66,88 Z',
    colors: ['blue', 'yellow', 'red'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'ocean' },
  },
  {
    id: 'space-boots',
    name: 'Space Boots',
    category: 'footwear',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M48,82 L52,82 L52,88 L48,88 Z M68,82 L72,82 L72,88 L68,88 Z',
    colors: ['white', 'silver'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 10 },
  },
  {
    id: 'glass-slippers',
    name: 'Glass Slippers',
    category: 'footwear',
    rarity: 'legendary',
    unlocked: false,
    svgPath: 'M48,86 L52,86 L52,88 L48,88 Z M68,86 L72,86 L72,88 L68,88 Z',
    colors: ['lightblue', 'white'],
    patterns: ['glitter'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'princess-stories' },
  },
  {
    id: 'roller-skates',
    name: 'Roller Skates',
    category: 'footwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,83 L52,83 L52,88 L48,88 Z M68,83 L72,83 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 9 },
  },
  {
    id: 'ice-skates',
    name: 'Ice Skates',
    category: 'footwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,83 L52,83 L52,88 L48,88 Z M68,83 L72,83 L72,88 L68,88 Z',
    colors: ['white', 'black', 'blue'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'winter' },
  },
  {
    id: 'moon-boots',
    name: 'Moon Boots',
    category: 'footwear',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M46,80 L54,80 L54,88 L46,88 Z M66,80 L74,80 L74,88 L66,88 Z',
    colors: ['white', 'silver'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 15 },
  },
  {
    id: 'platform-shoes',
    name: 'Platform Shoes',
    category: 'footwear',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,83 L52,83 L52,88 L48,88 Z M68,83 L72,83 L72,88 L68,88 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'glitter'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'level', requirement: 12 },
  },

  // ACCESSORIES (40 items will be continued...)
  {
    id: 'cap',
    name: 'Baseball Cap',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,18 L70,18 L72,22 L48,22 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'beanie',
    name: 'Beanie',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M48,18 L72,18 L72,24 L48,24 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'sun-hat',
    name: 'Sun Hat',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M45,18 L75,18 L75,22 L45,22 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'flowers'],
  },
  {
    id: 'sunglasses',
    name: 'Sunglasses',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M52,38 L58,38 L58,42 L52,42 Z M62,38 L68,38 L68,42 L62,42 Z',
    colors: ['black', 'brown', 'blue', 'red'],
    patterns: ['solid'],
  },
  {
    id: 'glasses',
    name: 'Glasses',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M52,38 L58,38 L58,42 L52,42 Z M62,38 L68,38 L68,42 L62,42 Z',
    colors: ['black', 'brown', 'gold', 'silver'],
    patterns: ['solid'],
  },
  {
    id: 'necklace',
    name: 'Necklace',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,30 L70,30',
    colors: ['gold', 'silver', 'pink', 'blue'],
    patterns: ['solid'],
    unlockCondition: { type: 'quiz', requirement: 3 },
  },
  {
    id: 'bracelet',
    name: 'Bracelet',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,55 L52,55',
    colors: ['gold', 'silver', 'pink', 'blue'],
    patterns: ['solid'],
    unlockCondition: { type: 'quiz', requirement: 3 },
  },
  {
    id: 'earrings',
    name: 'Earrings',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M50,36 L50,40 M70,36 L70,40',
    colors: ['gold', 'silver', 'pink', 'blue'],
    patterns: ['solid'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'quiz', requirement: 4 },
  },
  {
    id: 'backpack',
    name: 'Backpack',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M52,32 L68,32 L68,52 L52,52 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'watch',
    name: 'Watch',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,55 L52,55 L52,58 L48,58 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 4 },
  },
  {
    id: 'scarf',
    name: 'Scarf',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,28 L70,28 L72,36 L48,36 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'bow-tie',
    name: 'Bow Tie',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M56,30 L64,30 L64,32 L56,32 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots'],
    unlockCondition: { type: 'quiz', requirement: 5 },
  },
  {
    id: 'tie',
    name: 'Tie',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M58,30 L62,30 L62,50 L58,50 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'quiz', requirement: 5 },
  },
  {
    id: 'crown',
    name: 'Crown',
    category: 'accessories',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M48,16 L52,20 L56,16 L60,20 L64,16 L68,20 L72,16 L72,22 L48,22 Z',
    colors: ['gold', 'silver'],
    patterns: ['solid', 'glitter'],
    unlockCondition: { type: 'achievement', requirement: 'royal' },
  },
  {
    id: 'tiara',
    name: 'Tiara',
    category: 'accessories',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,18 L52,16 L56,18 L60,16 L64,18 L68,16 L72,18',
    colors: ['silver', 'gold', 'pink'],
    patterns: ['solid', 'glitter'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'princess-stories' },
  },
  {
    id: 'headband',
    name: 'Headband',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M48,20 L72,20',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots', 'flowers'],
  },
  {
    id: 'hair-bow',
    name: 'Hair Bow',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M55,18 L60,20 L65,18',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots'],
    characterTypes: ['girl'],
  },
  {
    id: 'mask-hero',
    name: 'Hero Mask',
    category: 'accessories',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M50,36 L55,38 L65,38 L70,36 L70,42 L50,42 Z',
    colors: ['black', 'red', 'blue'],
    patterns: ['solid'],
    unlockCondition: { type: 'achievement', requirement: 'hero' },
  },
  {
    id: 'helmet',
    name: 'Helmet',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,16 L74,16 L74,26 L46,26 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'space' },
  },
  {
    id: 'chef-hat',
    name: 'Chef Hat',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,12 L50,16 L54,12 L58,16 L62,12 L66,16 L70,12 L74,16 L74,22 L46,22 Z',
    colors: ['white'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'cooking' },
  },
  {
    id: 'party-hat',
    name: 'Party Hat',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M50,8 L60,22 L70,8 L60,8 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes', 'dots'],
  },
  {
    id: 'wizard-hat',
    name: 'Wizard Hat',
    category: 'accessories',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M55,6 L60,18 L65,6 L60,6 Z M48,18 L72,18 L72,22 L48,22 Z',
    colors: ['purple', 'blue', 'black'],
    patterns: ['solid', 'stars'],
    unlockCondition: { type: 'achievement', requirement: 'wizard' },
  },
  {
    id: 'witch-hat',
    name: 'Witch Hat',
    category: 'accessories',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M54,8 L60,20 L66,8 L60,8 Z M46,20 L74,20 L74,23 L46,23 Z',
    colors: ['black', 'purple'],
    patterns: ['solid'],
    unlockCondition: { type: 'event', requirement: 'halloween' },
  },
  {
    id: 'santa-hat',
    name: 'Santa Hat',
    category: 'accessories',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M52,10 L68,20 L72,20 L68,22 L48,22 L52,10 Z',
    colors: ['red', 'white'],
    patterns: ['solid'],
    unlockCondition: { type: 'event', requirement: 'christmas' },
  },
  {
    id: 'bandana',
    name: 'Bandana',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,20 L72,20 L72,24 L48,24 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'dots'],
    unlockCondition: { type: 'level', requirement: 5 },
  },
  {
    id: 'flower-crown',
    name: 'Flower Crown',
    category: 'accessories',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,18 L52,16 L56,18 L60,16 L64,18 L68,16 L72,18 L72,22 L48,22 Z',
    colors: Object.keys(COLORS),
    patterns: ['flowers'],
    unlockCondition: { type: 'level', requirement: 9 },
  },
  {
    id: 'beret',
    name: 'Beret',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,16 L72,16 L72,22 L48,22 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 6 },
  },
  {
    id: 'fedora',
    name: 'Fedora',
    category: 'accessories',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M45,18 L75,18 L75,22 L45,22 Z M50,16 L70,16 L70,18 L50,18 Z',
    colors: ['black', 'brown', 'gray'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 10 },
  },
  {
    id: 'top-hat',
    name: 'Top Hat',
    category: 'accessories',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M52,8 L68,8 L68,16 L52,16 Z M48,16 L72,16 L72,18 L48,18 Z',
    colors: ['black', 'white'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 11 },
  },
  {
    id: 'viking-helmet',
    name: 'Viking Helmet',
    category: 'accessories',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M46,16 L74,16 L74,24 L46,24 Z M44,16 L46,12 M74,16 L76,12',
    colors: ['gray', 'silver'],
    patterns: ['solid'],
    unlockCondition: { type: 'achievement', requirement: 'viking' },
  },
  {
    id: 'pirate-hat',
    name: 'Pirate Hat',
    category: 'accessories',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M45,18 L60,12 L75,18 L75,22 L45,22 Z',
    colors: ['black', 'brown'],
    patterns: ['solid'],
    unlockCondition: { type: 'achievement', requirement: 'pirate' },
  },
  {
    id: 'mittens',
    name: 'Mittens',
    category: 'accessories',
    rarity: 'common',
    unlocked: true,
    svgPath: 'M46,56 L50,56 L50,60 L46,60 Z M70,56 L74,56 L74,60 L70,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'stripes'],
  },
  {
    id: 'gloves',
    name: 'Gloves',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,54 L50,54 L50,60 L46,60 Z M70,54 L74,54 L74,60 L70,60 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'leather'],
    unlockCondition: { type: 'quiz', requirement: 4 },
  },
  {
    id: 'belt',
    name: 'Belt',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M45,60 L75,60 L75,62 L45,62 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'leather'],
    unlockCondition: { type: 'quiz', requirement: 3 },
  },
  {
    id: 'suspenders',
    name: 'Suspenders',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M52,30 L52,60 M68,30 L68,60',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 7 },
  },
  {
    id: 'handbag',
    name: 'Handbag',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,54 L54,54 L54,64 L46,64 Z',
    colors: Object.keys(COLORS),
    patterns: ['solid', 'leather'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'quiz', requirement: 5 },
  },
  {
    id: 'wand',
    name: 'Magic Wand',
    category: 'accessories',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M44,50 L48,54 M46,48 L50,52',
    colors: ['gold', 'silver', 'pink'],
    patterns: ['glitter'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'fairy-tales' },
  },
  {
    id: 'binoculars',
    name: 'Binoculars',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M54,32 L58,32 L58,38 L54,38 Z M62,32 L66,32 L66,38 L62,38 Z',
    colors: ['black', 'brown', 'green'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'adventure' },
  },
  {
    id: 'paint-palette',
    name: 'Paint Palette',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M44,54 L52,54 L52,60 L44,60 Z',
    colors: ['brown', 'beige'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'art' },
  },
  {
    id: 'headphones',
    name: 'Headphones',
    category: 'accessories',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M48,18 L48,26 M72,18 L72,26 M48,18 L72,18',
    colors: Object.keys(COLORS),
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 8 },
  },

  // COSTUMES (15 complete outfits)
  {
    id: 'superhero-costume',
    name: 'Superhero Costume',
    category: 'costumes',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M46,26 L74,26 L74,75 L46,75 Z',
    colors: ['red', 'blue', 'black'],
    patterns: ['solid', 'gradient'],
    unlockCondition: { type: 'achievement', requirement: 'hero' },
  },
  {
    id: 'astronaut-costume',
    name: 'Astronaut Costume',
    category: 'costumes',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M44,24 L76,24 L76,78 L44,78 Z',
    colors: ['white', 'silver'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 10 },
  },
  {
    id: 'pirate-costume',
    name: 'Pirate Costume',
    category: 'costumes',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,72 L46,72 Z',
    colors: ['black', 'brown', 'red'],
    patterns: ['solid', 'stripes'],
    unlockCondition: { type: 'achievement', requirement: 'pirate' },
  },
  {
    id: 'wizard-costume',
    name: 'Wizard Costume',
    category: 'costumes',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M44,26 L76,26 L76,76 L44,76 Z',
    colors: ['purple', 'blue', 'black'],
    patterns: ['solid', 'stars'],
    unlockCondition: { type: 'achievement', requirement: 'wizard' },
  },
  {
    id: 'knight-costume',
    name: 'Knight Costume',
    category: 'costumes',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M44,26 L76,26 L76,76 L44,76 Z',
    colors: ['silver', 'gray'],
    patterns: ['solid'],
    unlockCondition: { type: 'achievement', requirement: 'knight' },
  },
  {
    id: 'ninja-costume',
    name: 'Ninja Costume',
    category: 'costumes',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,26 L74,26 L74,76 L46,76 Z',
    colors: ['black', 'navy', 'gray'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 12 },
  },
  {
    id: 'doctor-costume',
    name: 'Doctor Costume',
    category: 'costumes',
    rarity: 'uncommon',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,70 L46,70 Z',
    colors: ['white', 'blue'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'doctor' },
  },
  {
    id: 'firefighter-costume',
    name: 'Firefighter Costume',
    category: 'costumes',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,26 L74,26 L74,76 L46,76 Z',
    colors: ['red', 'yellow'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'firefighter' },
  },
  {
    id: 'police-costume',
    name: 'Police Costume',
    category: 'costumes',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,72 L46,72 Z',
    colors: ['blue', 'navy'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'police' },
  },
  {
    id: 'ballerina-costume',
    name: 'Ballerina Costume',
    category: 'costumes',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M48,30 L72,30 L76,65 L44,65 Z',
    colors: ['pink', 'white', 'purple'],
    patterns: ['solid', 'glitter'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'dancer' },
  },
  {
    id: 'mermaid-costume',
    name: 'Mermaid Costume',
    category: 'costumes',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M48,30 L72,30 L74,76 L46,76 Z',
    colors: ['teal', 'blue', 'purple'],
    patterns: ['solid', 'glitter'],
    characterTypes: ['girl'],
    unlockCondition: { type: 'achievement', requirement: 'underwater' },
  },
  {
    id: 'robot-costume',
    name: 'Robot Costume',
    category: 'costumes',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M44,26 L76,26 L76,76 L44,76 Z',
    colors: ['silver', 'gray'],
    patterns: ['solid'],
    unlockCondition: { type: 'level', requirement: 13 },
  },
  {
    id: 'alien-costume',
    name: 'Alien Costume',
    category: 'costumes',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,26 L74,26 L74,76 L46,76 Z',
    colors: ['green', 'purple', 'blue'],
    patterns: ['solid'],
    unlockCondition: { type: 'story', requirement: 'space' },
  },
  {
    id: 'cowboy-costume',
    name: 'Cowboy Costume',
    category: 'costumes',
    rarity: 'rare',
    unlocked: false,
    svgPath: 'M46,28 L74,28 L74,76 L46,76 Z',
    colors: ['brown', 'blue'],
    patterns: ['denim', 'leather'],
    unlockCondition: { type: 'level', requirement: 11 },
  },
  {
    id: 'vampire-costume',
    name: 'Vampire Costume',
    category: 'costumes',
    rarity: 'epic',
    unlocked: false,
    svgPath: 'M44,26 L76,26 L76,76 L44,76 Z',
    colors: ['black', 'red'],
    patterns: ['solid'],
    unlockCondition: { type: 'event', requirement: 'halloween' },
  },
];

// Get all items
export function getAllClothingItems(): ClothingItem[] {
  return CLOTHING_ITEMS;
}

// Get items by category
export function getItemsByCategory(category: ClothingCategory): ClothingItem[] {
  return CLOTHING_ITEMS.filter(item => item.category === category);
}

// Get unlocked items
export function getUnlockedItems(): ClothingItem[] {
  return CLOTHING_ITEMS.filter(item => item.unlocked);
}

// Check if item can be unlocked
export function canUnlockItem(
  item: ClothingItem,
  userProgress: {
    level: number;
    storiesRead: string[];
    quizzesCompleted: number;
    achievements: string[];
  }
): boolean {
  if (!item.unlockCondition) return item.unlocked;

  const { type, requirement } = item.unlockCondition;

  switch (type) {
    case 'level':
      return userProgress.level >= (requirement as number);
    case 'story':
      return userProgress.storiesRead.includes(requirement as string);
    case 'quiz':
      return userProgress.quizzesCompleted >= (requirement as number);
    case 'achievement':
      return userProgress.achievements.includes(requirement as string);
    default:
      return false;
  }
}

// LocalStorage management
const OUTFITS_KEY = 'dress-up-outfits';
const UNLOCKED_KEY = 'dress-up-unlocked';

export function saveOutfit(outfit: Outfit): void {
  const outfits = getOutfits();
  const index = outfits.findIndex(o => o.id === outfit.id);

  if (index >= 0) {
    outfits[index] = outfit;
  } else {
    outfits.push(outfit);
  }

  localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
}

export function getOutfits(): Outfit[] {
  const data = localStorage.getItem(OUTFITS_KEY);
  return data ? JSON.parse(data) : [];
}

export function deleteOutfit(outfitId: string): void {
  const outfits = getOutfits().filter(o => o.id !== outfitId);
  localStorage.setItem(OUTFITS_KEY, JSON.stringify(outfits));
}

export function getUnlockedItemIds(): string[] {
  const data = localStorage.getItem(UNLOCKED_KEY);
  return data ? JSON.parse(data) : CLOTHING_ITEMS.filter(i => i.unlocked).map(i => i.id);
}

export function unlockItem(itemId: string): void {
  const unlocked = getUnlockedItemIds();
  if (!unlocked.includes(itemId)) {
    unlocked.push(itemId);
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(unlocked));
  }
}

// Generate random outfit
export function generateRandomOutfit(characterId: string): OutfitItem[] {
  const unlockedIds = getUnlockedItemIds();
  const availableItems = CLOTHING_ITEMS.filter(item => unlockedIds.includes(item.id));

  const outfit: OutfitItem[] = [];
  const categories: ClothingCategory[] = ['tops', 'bottoms', 'footwear'];

  categories.forEach(category => {
    const itemsInCategory = availableItems.filter(item => item.category === category);
    if (itemsInCategory.length > 0) {
      const randomItem = itemsInCategory[Math.floor(Math.random() * itemsInCategory.length)];
      const randomColor =
        randomItem.colors[Math.floor(Math.random() * randomItem.colors.length)];

      outfit.push({
        itemId: randomItem.id,
        color: randomColor,
        pattern: 'solid',
        size: 'medium',
        flipped: false,
      });
    }
  });

  // Add random accessories (30% chance)
  if (Math.random() > 0.7) {
    const accessories = availableItems.filter(item => item.category === 'accessories');
    if (accessories.length > 0) {
      const randomAccessory = accessories[Math.floor(Math.random() * accessories.length)];
      const randomColor =
        randomAccessory.colors[Math.floor(Math.random() * randomAccessory.colors.length)];

      outfit.push({
        itemId: randomAccessory.id,
        color: randomColor,
        pattern: 'solid',
        size: 'medium',
        flipped: false,
      });
    }
  }

  return outfit;
}

// Get theme outfit
export function getThemeOutfit(themeId: string): string[] {
  const theme = FASHION_THEMES.find(t => t.id === themeId);
  return theme ? theme.items : [];
}
