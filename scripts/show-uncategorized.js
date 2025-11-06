import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deTranslations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/locales/de.json'), 'utf-8')
);

// Load categorized files
const core = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/de-core.json'), 'utf-8'));
const stories = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/de-stories.json'), 'utf-8'));
const games = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/de-games.json'), 'utf-8'));
const create = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/de-create.json'), 'utf-8'));
const features = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/locales/de-features.json'), 'utf-8'));

const categorized = new Set([
  ...Object.keys(core),
  ...Object.keys(stories),
  ...Object.keys(games),
  ...Object.keys(create),
  ...Object.keys(features)
]);

const uncategorized = Object.keys(deTranslations).filter(key => !categorized.has(key)).sort();

console.log('\n=== Uncategorized Keys (' + uncategorized.length + ') ===\n');

// Group by first few letters for pattern analysis
const grouped = {};
uncategorized.forEach(key => {
  const prefix = key.substring(0, Math.min(key.length, 3)).toLowerCase();
  if (!grouped[prefix]) grouped[prefix] = [];
  grouped[prefix].push(key);
});

// Show top groups
const topGroups = Object.entries(grouped)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 20);

console.log('Top 20 prefix groups:\n');
topGroups.forEach(([prefix, keys]) => {
  console.log(prefix + ': ' + keys.length + ' keys');
  keys.slice(0, 5).forEach(k => console.log('  - ' + k));
  if (keys.length > 5) console.log('  ... and ' + (keys.length - 5) + ' more');
  console.log('');
});
