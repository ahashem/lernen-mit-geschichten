import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localesDir = path.join(__dirname, '../src/locales');

// Load German categorization as reference
const deCategorized = {
  core: JSON.parse(fs.readFileSync(path.join(localesDir, 'de-core.json'), 'utf-8')),
  stories: JSON.parse(fs.readFileSync(path.join(localesDir, 'de-stories.json'), 'utf-8')),
  games: JSON.parse(fs.readFileSync(path.join(localesDir, 'de-games.json'), 'utf-8')),
  create: JSON.parse(fs.readFileSync(path.join(localesDir, 'de-create.json'), 'utf-8')),
  features: JSON.parse(fs.readFileSync(path.join(localesDir, 'de-features.json'), 'utf-8'))
};

// Create a map of key -> category
const keyToCategory = {};
Object.entries(deCategorized).forEach(([category, items]) => {
  Object.keys(items).forEach(key => {
    keyToCategory[key] = category;
  });
});

// Process each language
const languages = ['en', 'ar', 'tr', 'ur'];

console.log('\n=== Splitting Translation Files for All Languages ===\n');

languages.forEach(lang => {
  const langFile = path.join(localesDir, `${lang}.json`);

  if (!fs.existsSync(langFile)) {
    console.log(`Skipping ${lang} (file not found)`);
    return;
  }

  const translations = JSON.parse(fs.readFileSync(langFile, 'utf-8'));
  console.log(`Processing ${lang}.json (${Object.keys(translations).length} keys)`);

  // Categorize based on German categorization
  const categorized = {
    core: {},
    stories: {},
    games: {},
    create: {},
    features: {}
  };

  let matched = 0;
  let unmatched = 0;

  Object.keys(translations).forEach(key => {
    const category = keyToCategory[key];
    if (category) {
      categorized[category][key] = translations[key];
      matched++;
    } else {
      // If key doesn't exist in German, put in core by default
      categorized.core[key] = translations[key];
      unmatched++;
    }
  });

  console.log(`  Matched: ${matched} keys, Unmatched: ${unmatched} keys (added to core)`);

  // Save categorized files
  Object.entries(categorized).forEach(([category, items]) => {
    const filename = `${lang}-${category}.json`;
    const filepath = path.join(localesDir, filename);
    fs.writeFileSync(filepath, JSON.stringify(items, null, 2), 'utf-8');
  });

  // Print summary
  Object.entries(categorized).forEach(([category, items]) => {
    const count = Object.keys(items).length;
    const percentage = ((count / Object.keys(translations).length) * 100).toFixed(1);
    console.log(`    ${category}: ${count} keys (${percentage}%)`);
  });

  console.log('');
});

console.log('All language files split successfully!');
console.log('\nFiles created:');
['de', 'en', 'ar', 'tr', 'ur'].forEach(lang => {
  console.log(`  ${lang}-core.json, ${lang}-stories.json, ${lang}-games.json, ${lang}-create.json, ${lang}-features.json`);
});
