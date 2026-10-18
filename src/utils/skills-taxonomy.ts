import { getSkillEntries } from './stories';
import type { Locale } from './i18n';

export interface Skill {
  id: string;
  category: string;
  de: string;
  ar: string;
  en: string;
  tr: string;
  ur: string;
}

export interface SkillCategory extends Record<Locale, string> {
  id: string;
  skills: Skill[];
}

// The four groups are structure, not content: they change with the design, so they live here. The skills
// themselves (ids and labels in all five languages) are files in src/content/skills, which the CMS edits.
const CATEGORIES: Record<string, Record<Locale, string>> = {
  emotional: {
    de: 'Emotionale Fähigkeiten',
    ar: 'المهارات العاطفية',
    en: 'Emotional Skills',
    tr: 'Duygusal Beceriler',
    ur: 'جذباتی مہارتیں',
  },
  social: {
    de: 'Soziale Fähigkeiten',
    ar: 'المهارات الاجتماعية',
    en: 'Social Skills',
    tr: 'Sosyal Beceriler',
    ur: 'سماجی مہارتیں',
  },
  cognitive: {
    de: 'Kognitive Fähigkeiten',
    ar: 'المهارات المعرفية',
    en: 'Cognitive Skills',
    tr: 'Bilişsel Beceriler',
    ur: 'ذہنی مہارتیں',
  },
  behavioral: {
    de: 'Verhaltensfähigkeiten',
    ar: 'المهارات السلوكية',
    en: 'Behavioral Skills',
    tr: 'Davranışsal Beceriler',
    ur: 'رویہ کی مہارتیں',
  },
};

let all: Promise<Skill[]> | undefined;

/** Every skill, from src/content/skills. */
export function getSkills(): Promise<Skill[]> {
  all ??= getSkillEntries().then(entries => entries.map(e => e.data as Skill));
  return all;
}

/** Skills grouped by category, in category order and alphabetical by English label within one. */
export async function getSkillsByCategory(): Promise<SkillCategory[]> {
  const skills = await getSkills();
  return Object.entries(CATEGORIES).map(([id, labels]) => ({
    id,
    ...labels,
    skills: skills.filter(s => s.category === id).sort((a, b) => a.en.localeCompare(b.en)),
  }));
}

/** The skills for a list of ids; unknown ids are dropped. */
export async function getSkillsByIds(ids: string[]): Promise<Skill[]> {
  const skills = await getSkills();
  return ids.map(id => skills.find(s => s.id === id)).filter((s): s is Skill => s !== undefined);
}
