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

type Labels = Record<string, string>;
const labelsIn = (locale: Locale, group: 'skillLabels' | 'skillGroups'): Labels =>
  (translations[locale]?.[group] as Labels | undefined) ?? {};

/** A skill's label: this language, else German, else the name stored in the skill file. */
export function skillLabel(locale: Locale, id: string, name: string): string {
  return labelsIn(locale, 'skillLabels')[id] ?? labelsIn('de', 'skillLabels')[id] ?? name;
}

export function skillGroupLabel(locale: Locale, group: string): string {
  return labelsIn(locale, 'skillGroups')[group] ?? labelsIn('de', 'skillGroups')[group] ?? group;
}

export function isRTL(locale: Locale): boolean {
  return locale === 'ar' || locale === 'ur';
}

export const endonyms: Record<Locale, string> = {
  de: 'Deutsch',
  ar: 'العربية',
  en: 'English',
  tr: 'Türkçe',
  ur: 'اردو',
};

/** Fill `{name}` placeholders in a translated string. */
export function fmt(text: string, values: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
}
