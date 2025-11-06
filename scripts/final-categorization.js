import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deTranslations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/locales/de.json'), 'utf-8')
);

// Manual categorization with comprehensive patterns
const manualAssignments = {
  core: [
    // UI/Navigation
    'comingSoon', 'confirm', 'proceed', 'continue', 'skip', 'optional', 'required',
    'time', 'timeUp', 'timeSpent', 'step', 'stage', 'stage1', 'stage2', 'stage3',
    'location', 'locations', 'locked', 'unlocked', 'upcoming', 'recent', 'popular',
    'categories', 'category', 'categoryDashboard', 'dashboard', 'menu', 'options',
    'readIn', 'wordCount', 'wordSpacing', 'spacing', 'size', 'position',
    // Settings
    'adjustable', 'automation', 'auto', 'enable', 'disable', 'toggle', 'switch',
    'volume', 'sound', 'effects', 'ambient', 'background', 'foreground',
    // Time/Date
    'minutes', 'hours', 'days', 'weeks', 'months', 'seasons', 'spring', 'summer',
    'autumn', 'winter', 'morning', 'afternoon', 'evening', 'night',
    // Common UI patterns
    'coming', 'soon', 'new', 'updated', 'version', 'beta', 'demo', 'preview',
    'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8',
    'title', 'description', 'subtitle', 'label', 'placeholder', 'tooltip'
  ],
  stories: [
    // Reading features
    'readingAids', 'readingGoals', 'readingHabits', 'readingLevel', 'readingMode',
    'readNumberAloud', 'readAloud', 'narrator', 'narration', 'voiceOver',
    // Story elements
    'companion', 'companionEnabled', 'companionSize', 'mainCharacter', 'supportingCharacter',
    'protagonist', 'antagonist', 'hero', 'villain', 'friend', 'helper',
    // Story types
    'bedtime', 'bedtimeStories', 'moral', 'moralLesson', 'educational', 'learning',
    'valuesBased', 'skillsBased', 'ageAppropriate', 'developmentStage',
    // Story features
    'storyElements', 'storyStructure', 'beginning', 'middle', 'end', 'climax',
    'resolution', 'conflict', 'setting', 'plot', 'theme', 'message',
    // Character traits
    'brave', 'kind', 'helpful', 'honest', 'loyal', 'caring', 'generous',
    'patient', 'persistent', 'curious', 'imaginative', 'creative', 'thoughtful'
  ],
  games: [
    // Game mechanics
    'perfectGame', 'perfectGames', 'perfectAfter', 'perfectCompletion', 'perfectHits',
    'perfectScore', 'perfection', 'flawless', 'master', 'expert', 'pro',
    'timeAttackMode', 'survivalMode', 'endlessMode', 'challengeMode', 'practiceMode',
    'multiplayerMode', 'soloMode', 'coopMode', 'competitive',
    // Scoring
    'scoreMultiplier', 'bonusPoints', 'extraPoints', 'doublePoints', 'triplePoints',
    'highestScore', 'lowestScore', 'averageScore', 'totalScore', 'currentScore',
    // Progress
    'levelsCompleted', 'levelsUnlocked', 'starsEarned', 'achievementsEarned',
    'gamesPlayed', 'gamesWon', 'winRate', 'lossRate', 'completionRate',
    // Power-ups
    'powerUp', 'powerUps', 'boost', 'boosts', 'multiplier', 'bonus', 'extra',
    'special', 'rare', 'epic', 'legendary', 'common', 'uncommon',
    // Number/Math games
    'numberFact', 'numberMaster', 'numberMasterDesc', 'numberPronunciation',
    'skipCounting', 'skipBy2', 'skipBy5', 'skipBy10', 'countingSkills',
    'wordDetective', 'wordDetectiveDesc', 'wordsFound', 'wordsFinding'
  ],
  create: [
    // Creation tools
    'customization', 'customize', 'personalize', 'design', 'create', 'build',
    'draw', 'paint', 'sketch', 'illustrate', 'decorate', 'style',
    // Elements
    'skinTones', 'hairStyles', 'eyeColors', 'bodyTypes', 'expressions',
    'poses', 'gestures', 'actions', 'movements', 'transitions',
    // Tools
    'brushSize', 'eraserSize', 'colorPicker', 'palette', 'gradient',
    'pattern', 'texture', 'fill', 'stroke', 'outline', 'shadow',
    // Media
    'audioTrack', 'soundEffect', 'visualEffect', 'animation', 'transition',
    'loop', 'repeat', 'sequence', 'timeline', 'duration',
    // Templates
    'template', 'templates', 'preset', 'presets', 'sample', 'samples',
    'example', 'examples', 'inspiration', 'ideas', 'suggestions'
  ],
  features: [
    // Pet/Garden stages
    'stageAdult', 'stageBaby', 'stageChild', 'stageEgg', 'stageSprout',
    'stageSeedling', 'stageMature', 'stageGrown', 'stageHatched',
    // Rarity
    'rareCollector', 'rareCollectorDesc', 'rareRarity', 'rarity',
    'rarityCommon', 'rarityRare', 'rarityEpic', 'rarityLegendary',
    'commonRarity', 'uncommonRarity', 'collection', 'collector',
    // Locations
    'locationLocked', 'locationsVisited', 'lockedDoors', 'unlockedAreas',
    'exploration', 'discover', 'findHidden', 'secretArea', 'hiddenItem',
    // Moods/Emotions
    'moodBased', 'moodBored', 'moodEnergetic', 'moodHappy', 'moodHungry',
    'moodSad', 'moodTired', 'moodExcited', 'moodCalm', 'moodAngry',
    // Stats
    'totalCollected', 'totalEarned', 'totalSpent', 'totalUnlocked',
    'percentageComplete', 'progressPercentage', 'completionPercentage',
    // Rewards
    'rewardsEarned', 'bonusReward', 'dailyReward', 'weeklyReward',
    'specialReward', 'limitedTime', 'exclusive', 'seasonal'
  ]
};

// Create comprehensive pattern matcher
const categorize = (key) => {
  const lowerKey = key.toLowerCase();

  // Check manual assignments first
  for (const [category, keywords] of Object.entries(manualAssignments)) {
    if (keywords.some(kw => lowerKey.includes(kw.toLowerCase()))) {
      return category;
    }
  }

  // Story-related patterns (highest priority for this site)
  if (lowerKey.match(/story|stories|reading|character|skill|narrative|moral|learn|adventure|brave|kind|help|friend/)) {
    return 'stories';
  }

  // Games patterns
  if (lowerKey.match(/game|play|level|score|win|lose|perfect|combo|streak|match|puzzle|maze|memory/)) {
    return 'games';
  }

  // Creation patterns
  if (lowerKey.match(/create|design|custom|draw|paint|color|animation|music|comic|puppet|studio|theater/)) {
    return 'create';
  }

  // Features patterns
  if (lowerKey.match(/pet|garden|quest|achievement|trophy|card|collect|adopt|feed|water|plant|grow|reward|badge|unlock/)) {
    return 'features';
  }

  // Core patterns (default for UI)
  if (lowerKey.match(/menu|navigation|settings|option|confirm|cancel|close|save|edit|delete|view|show|hide|start|stop|pause|resume/)) {
    return 'core';
  }

  // Default to core for short common words
  if (lowerKey.length < 8) return 'core';

  return 'core'; // Default everything else to core
};

// Categorize all keys
const categorized = {
  core: {},
  stories: {},
  games: {},
  create: {},
  features: {}
};

Object.keys(deTranslations).forEach(key => {
  const category = categorize(key);
  categorized[category][key] = deTranslations[key];
});

// Print summary
console.log('\n=== Final Translation Categorization ===\n');
console.log('Total keys: ' + Object.keys(deTranslations).length + '\n');

let totalCategorized = 0;
Object.entries(categorized).forEach(([category, items]) => {
  const count = Object.keys(items).length;
  totalCategorized += count;
  const percentage = ((count / Object.keys(deTranslations).length) * 100).toFixed(1);
  const sizeKB = (JSON.stringify(items).length / 1024).toFixed(1);
  console.log(category.padEnd(10) + ': ' + count.toString().padStart(4) + ' keys (' + percentage.padStart(5) + '%) - ' + sizeKB.padStart(5) + ' KB');
});

console.log('\nTotal categorized: ' + totalCategorized + ' keys (100.0%)');

// Save to files
const localesDir = path.join(__dirname, '../src/locales');

console.log('\n=== Saving categorized files ===\n');

Object.entries(categorized).forEach(([category, items]) => {
  const filename = `de-${category}.json`;
  const filepath = path.join(localesDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(items, null, 2), 'utf-8');
  console.log('Saved: ' + filename);
});

console.log('\nAll German translation files created successfully!');
console.log('\nNext: Apply the same categorization to en.json, ar.json, tr.json, ur.json');
