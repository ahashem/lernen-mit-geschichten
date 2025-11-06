import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deTranslations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/locales/de.json'), 'utf-8')
);

// Define categories with key patterns
const categories = {
  core: [
    'about', 'home', 'navigation', 'siteName', 'siteDescription', 'language',
    'error', 'success', 'warning', 'loading', 'save', 'cancel', 'close', 'back',
    'next', 'previous', 'search', 'filter', 'sort', 'clear', 'reset', 'submit',
    'delete', 'edit', 'add', 'new', 'view', 'show', 'hide', 'more', 'less',
    'welcome', 'hello', 'goodbye', 'thank', 'please', 'yes', 'no', 'ok',
    'accessibility', 'keyboard', 'screen', 'contrast', 'fontSize', 'theme',
    'darkMode', 'lightMode', 'cookieConsent', 'privacy', 'terms', 'contact',
    'footer', 'header', 'menu', 'sidebar', 'modal', 'tooltip', 'notification',
    'bookmark', 'share', 'print', 'download', 'upload', 'export', 'import'
  ],
  stories: [
    'story', 'stories', 'readStory', 'storyBuilder', 'characterDesigner',
    'character', 'narrative', 'keyMessage', 'activities', 'skills', 'skill',
    'balloon', 'sequencing', 'storyMap', 'storyRecommendations', 'storyCard',
    'storyFormat', 'interactive', 'pages', 'tts', 'narrator', 'readingProgress',
    'readingStreak', 'readingTime', 'continueReading', 'startReading',
    'finishReading', 'quiz', 'question', 'answer', 'correct', 'incorrect',
    'feedback', 'tryAgain', 'showAnswer', 'nextQuestion', 'previousQuestion',
    'trueOrFalse', 'multipleChoice', 'fillInBlank', 'printStory', 'printStudio',
    'ageGroup', 'difficulty', 'estimatedReadTime', 'publishDate', 'emoji'
  ],
  games: [
    'memory', 'maze', 'puzzle', 'jigsaw', 'sliding', 'whack', 'fruit', 'fishing',
    'dance', 'spot', 'shadow', 'emotion', 'word', 'rhyme', 'connect', 'coloring',
    'match', 'level', 'score', 'highScore', 'timeLimit', 'movesLeft', 'hint',
    'shuffle', 'restart', 'pause', 'resume', 'gameOver', 'youWin', 'youLose',
    'playAgain', 'nextLevel', 'previousLevel', 'easy', 'medium', 'hard', 'expert',
    'mole', 'slicer', 'slice', 'combo', 'streak', 'accuracy', 'speed'
  ],
  create: [
    'comic', 'animation', 'puppet', 'music', 'recording', 'building', 'blocks',
    'studio', 'theater', 'composer', 'instrument', 'note', 'beat', 'rhythm',
    'tempo', 'volume', 'pitch', 'record', 'playback', 'stop', 'frame', 'scene',
    'backdrop', 'prop', 'panel', 'speech', 'bubble', 'caption', 'sticker',
    'dressUp', 'outfit', 'clothing', 'accessory'
  ],
  features: [
    'pet', 'garden', 'quest', 'achievement', 'trophy', 'card', 'collection',
    'weather', 'fortune', 'daily', 'surprise', 'magic', 'adopt', 'feed', 'play',
    'water', 'plant', 'grow', 'harvest', 'seed', 'flower', 'tree', 'badge',
    'reward', 'coin', 'gem', 'star', 'heart', 'energy', 'health', 'happiness',
    'hunger', 'sleep', 'clean', 'inventory', 'shop', 'market', 'trade'
  ]
};

// Categorize keys
const categorized = {
  core: {},
  stories: {},
  games: {},
  create: {},
  features: {},
  uncategorized: {}
};

const keys = Object.keys(deTranslations).sort();

keys.forEach(key => {
  let assigned = false;
  const lowerKey = key.toLowerCase();

  // Check each category
  for (const [category, patterns] of Object.entries(categories)) {
    if (patterns.some(pattern => lowerKey.includes(pattern.toLowerCase()))) {
      categorized[category][key] = deTranslations[key];
      assigned = true;
      break;
    }
  }

  if (!assigned) {
    categorized.uncategorized[key] = deTranslations[key];
  }
});

// Print summary
console.log('\n=== Translation Categorization Summary ===\n');
console.log('Total keys: ' + keys.length + '\n');

Object.entries(categorized).forEach(([category, items]) => {
  const count = Object.keys(items).length;
  const percentage = ((count / keys.length) * 100).toFixed(1);
  console.log(category + ': ' + count + ' keys (' + percentage + '%)');
});

// Save categorized files
console.log('\n=== Sample Keys Per Category ===\n');

Object.entries(categorized).forEach(([category, items]) => {
  const sampleKeys = Object.keys(items).slice(0, 10);
  console.log('\n' + category.toUpperCase() + ':');
  sampleKeys.forEach(key => console.log('  - ' + key));
  if (Object.keys(items).length > 10) {
    console.log('  ... and ' + (Object.keys(items).length - 10) + ' more');
  }
});

// Show uncategorized keys that need manual review
if (Object.keys(categorized.uncategorized).length > 0) {
  console.log('\n=== Uncategorized Keys (need review) ===\n');
  const uncatKeys = Object.keys(categorized.uncategorized);
  uncatKeys.slice(0, 50).forEach(key => console.log('  - ' + key));
  if (uncatKeys.length > 50) {
    console.log('  ... and ' + (uncatKeys.length - 50) + ' more');
  }
}
