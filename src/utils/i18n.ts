// Import translation files
import de from '../locales/de.json';
import ar from '../locales/ar.json';
import en from '../locales/en.json';
import tr from '../locales/tr.json';
import ur from '../locales/ur.json';

export type Locale = 'de' | 'ar' | 'en' | 'tr' | 'ur';

// Translations are now loaded from separate JSON files for easier Crowdin integration
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
