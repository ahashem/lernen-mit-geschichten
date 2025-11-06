import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deTranslations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/locales/de.json'), 'utf-8')
);

// Enhanced categorization patterns
const categorize = (key) => {
  const lowerKey = key.toLowerCase();

  // CORE: Navigation, UI elements, common actions, errors
  const corePatterns = [
    'about', 'home', 'navigation', 'sitename', 'sitedescription', 'language', 'selectlanguage',
    'error', 'success', 'warning', 'loading', 'save', 'cancel', 'close', 'back',
    'next', 'previous', 'search', 'filter', 'sort', 'clear', 'reset', 'submit',
    'delete', 'edit', 'add', 'new', 'view', 'show', 'hide', 'more', 'less',
    'welcome', 'hello', 'goodbye', 'thank', 'please', 'yes', 'no', 'ok',
    'accessibility', 'keyboard', 'screen', 'contrast', 'fontsize', 'theme',
    'darkmode', 'lightmode', 'cookieconsent', 'privacy', 'terms', 'contact',
    'footer', 'header', 'menu', 'sidebar', 'modal', 'tooltip', 'notification',
    'bookmark', 'share', 'print', 'download', 'upload', 'export', 'import',
    'confirm', 'proceed', 'continue', 'finish', 'start', 'end', 'required',
    'optional', 'select', 'choose', 'pick', 'option', 'settings', 'preferences'
  ];

  // STORIES: Story reading, creation, characters, skills, progress
  const storyPatterns = [
    'story', 'stories', 'readstory', 'storybuilder', 'characterdesigner',
    'character', 'narrative', 'keymessage', 'activities', 'skills', 'skill',
    'balloon', 'sequencing', 'storymap', 'storyrecommendations', 'storycard',
    'storyformat', 'interactive', 'pages', 'tts', 'narrator', 'readingprogress',
    'readingstreak', 'readingtime', 'continuereading', 'startreading',
    'finishreading', 'quiz', 'question', 'answer', 'correct', 'incorrect',
    'feedback', 'tryagain', 'showanswer', 'nextquestion', 'previousquestion',
    'trueorfalse', 'multiplechoice', 'fillinblank', 'printstory', 'printstudio',
    'agegroup', 'difficulty', 'estimatedreadtime', 'publishdate', 'emoji',
    'becauseyoulike', 'recommended', 'continue', 'similarstories', 'explore',
    'storiesread', 'totalstoriesread', 'currentstreak', 'longeststreak',
    'readingsession', 'readingspeed', 'comprehension', 'learning',
    'adventure', 'brave', 'patient', 'kind', 'friendship', 'cooperation',
    'emotional', 'social', 'cognitive', 'behavioral', 'selfawareness',
    'empathy', 'problemsolving', 'creativity', 'resilience', 'responsibility'
  ];

  // GAMES: Memory, Maze, Puzzles, etc - generic games
  const gamePatterns = [
    'memory', 'maze', 'puzzle', 'jigsaw', 'sliding', 'whack', 'fruit', 'fishing',
    'dance', 'spot', 'shadow', 'emotionmatching', 'wordsearch', 'rhyme', 'connect', 'coloring',
    'match', 'level', 'score', 'highscore', 'timelimit', 'movesleft', 'hint',
    'shuffle', 'restart', 'pause', 'resume', 'gameover', 'youwin', 'youlose',
    'playagain', 'nextlevel', 'previouslevel', 'easy', 'medium', 'hard', 'expert',
    'mole', 'slicer', 'slice', 'combo', 'streak', 'accuracy', 'speed',
    'tiles', 'pieces', 'moves', 'attempts', 'timer', 'countdown', 'bonus',
    'perfectscore', 'completedpuzzles', 'totalmatches', 'besttime'
  ];

  // CREATE: Animation, Music, Comics, Puppets, etc.
  const createPatterns = [
    'comic', 'animation', 'puppet', 'music', 'recording', 'building', 'blocks',
    'studio', 'theater', 'composer', 'instrument', 'note', 'beat', 'rhythm',
    'tempo', 'volume', 'pitch', 'record', 'playback', 'stop', 'frame', 'scene',
    'backdrop', 'prop', 'panel', 'speech', 'bubble', 'caption', 'sticker',
    'dressup', 'outfit', 'clothing', 'accessory', 'customize', 'design',
    'draw', 'paint', 'color', 'brush', 'eraser', 'undo', 'redo', 'layer'
  ];

  // FEATURES: Pets, Garden, Quests, Collections, etc.
  const featurePatterns = [
    'pet', 'garden', 'quest', 'achievement', 'trophy', 'card', 'collection',
    'weather', 'fortune', 'daily', 'surprise', 'magic', 'adopt', 'feed', 'play',
    'water', 'plant', 'grow', 'harvest', 'seed', 'flower', 'tree', 'badge',
    'reward', 'coin', 'gem', 'star', 'heart', 'energy', 'health', 'happiness',
    'hunger', 'sleep', 'clean', 'inventory', 'shop', 'market', 'trade',
    'ability', 'unlock', 'complete', 'progress', 'milestone', 'level',
    'experience', 'points', 'rank', 'battle', 'contest', 'competition'
  ];

  // Check patterns in order of specificity
  if (storyPatterns.some(p => lowerKey.includes(p))) return 'stories';
  if (gamePatterns.some(p => lowerKey.includes(p))) return 'games';
  if (createPatterns.some(p => lowerKey.includes(p))) return 'create';
  if (featurePatterns.some(p => lowerKey.includes(p))) return 'features';
  if (corePatterns.some(p => lowerKey.includes(p))) return 'core';

  // Default to core for common UI elements
  if (lowerKey.length < 10 && /^(ok|yes|no|on|off|all|any|none)$/.test(lowerKey)) return 'core';

  return 'uncategorized';
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
  if (category !== 'uncategorized') {
    categorized[category][key] = deTranslations[key];
  }
});

// Print summary
console.log('\n=== Enhanced Translation Categorization ===\n');
console.log('Total keys: ' + Object.keys(deTranslations).length + '\n');

let totalCategorized = 0;
Object.entries(categorized).forEach(([category, items]) => {
  const count = Object.keys(items).length;
  totalCategorized += count;
  const percentage = ((count / Object.keys(deTranslations).length) * 100).toFixed(1);
  console.log(category + ': ' + count + ' keys (' + percentage + '%)');
});

const uncategorizedCount = Object.keys(deTranslations).length - totalCategorized;
console.log('uncategorized: ' + uncategorizedCount + ' keys (' + ((uncategorizedCount / Object.keys(deTranslations).length) * 100).toFixed(1) + '%)');

// Save to files
const localesDir = path.join(__dirname, '../src/locales');

console.log('\n=== Saving categorized files ===\n');

Object.entries(categorized).forEach(([category, items]) => {
  const filename = `de-${category}.json`;
  const filepath = path.join(localesDir, filename);
  fs.writeFileSync(filepath, JSON.stringify(items, null, 2));
  console.log('Created: ' + filename + ' (' + Object.keys(items).length + ' keys)');
});

console.log('\nDone! Files saved to src/locales/');
