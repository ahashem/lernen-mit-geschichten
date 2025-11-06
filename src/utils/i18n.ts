// Import modular translation files (split by feature category)
// German translations
import deCore from '../locales/de-core.json';
import deStories from '../locales/de-stories.json';
import deGames from '../locales/de-games.json';
import deCreate from '../locales/de-create.json';
import deFeatures from '../locales/de-features.json';

// English translations
import enCore from '../locales/en-core.json';
import enStories from '../locales/en-stories.json';
import enGames from '../locales/en-games.json';
import enCreate from '../locales/en-create.json';
import enFeatures from '../locales/en-features.json';

// Arabic translations
import arCore from '../locales/ar-core.json';
import arStories from '../locales/ar-stories.json';
import arGames from '../locales/ar-games.json';
import arCreate from '../locales/ar-create.json';
import arFeatures from '../locales/ar-features.json';

// Turkish translations
import trCore from '../locales/tr-core.json';
import trStories from '../locales/tr-stories.json';
import trGames from '../locales/tr-games.json';
import trCreate from '../locales/tr-create.json';
import trFeatures from '../locales/tr-features.json';

// Urdu translations
import urCore from '../locales/ur-core.json';
import urStories from '../locales/ur-stories.json';
import urGames from '../locales/ur-games.json';
import urCreate from '../locales/ur-create.json';
import urFeatures from '../locales/ur-features.json';

export type Locale = 'de' | 'ar' | 'en' | 'tr' | 'ur';

// Merge all translation modules per language
const de = { ...deCore, ...deStories, ...deGames, ...deCreate, ...deFeatures };
const en = { ...enCore, ...enStories, ...enGames, ...enCreate, ...enFeatures };
const ar = { ...arCore, ...arStories, ...arGames, ...arCreate, ...arFeatures };
const tr = { ...trCore, ...trStories, ...trGames, ...trCreate, ...trFeatures };
const ur = { ...urCore, ...urStories, ...urGames, ...urCreate, ...urFeatures };

// Translations are now split into modular files for better organization:
// - *-core.json: Navigation, UI, common elements (~56% of keys)
// - *-stories.json: Story reading, building, character design (~11%)
// - *-games.json: Generic learning games (~12%)
// - *-create.json: Creation tools (animation, music, comics) (~7%)
// - *-features.json: Pets, quests, collections, rewards (~11%)
export const translations = {
  de,
  ar,
  en,
  tr,
  ur,
};

export function getTranslation(locale: Locale, key: keyof typeof translations.de): string {
  return translations[locale]?.[key] || translations.de[key];
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar' || locale === 'ur';
}
