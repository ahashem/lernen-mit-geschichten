import { getSkillEntries } from './stories';
import { skillGroupLabel, skillLabel, type Locale } from './i18n';

// A skill is a file in src/content/skills holding only its id, its group and one name (German). Labels in the
// other languages are UI strings in src/locales/*.json (skillLabels, skillGroups), like every other translation.
export interface Skill {
  id: string;
  category: string;
  name: string;
}

export interface LabeledSkill extends Skill {
  label: string;
}

export interface SkillGroup {
  id: string;
  label: string;
  skills: LabeledSkill[];
}

// The four groups are structure, not content; they change with the design.
const GROUPS = ['emotional', 'social', 'cognitive', 'behavioral'];

let all: Promise<Skill[]> | undefined;

export function getSkills(): Promise<Skill[]> {
  all ??= getSkillEntries().then(entries => entries.map(e => e.data as Skill));
  return all;
}

const labeled = (skill: Skill, locale: Locale): LabeledSkill => ({
  ...skill,
  label: skillLabel(locale, skill.id, skill.name),
});

/** Skills grouped by category, sorted by their label in the reader's language. */
export async function getSkillsByCategory(locale: Locale): Promise<SkillGroup[]> {
  const skills = await getSkills();
  const collator = new Intl.Collator(locale);
  return GROUPS.map(id => ({
    id,
    label: skillGroupLabel(locale, id),
    skills: skills
      .filter(s => s.category === id)
      .map(s => labeled(s, locale))
      .sort((a, b) => collator.compare(a.label, b.label)),
  }));
}

/** The skills for a list of ids, labelled for the reader; unknown ids are dropped. */
export async function getSkillsByIds(ids: string[], locale: Locale): Promise<LabeledSkill[]> {
  const skills = await getSkills();
  return ids
    .map(id => skills.find(s => s.id === id))
    .filter((s): s is Skill => s !== undefined)
    .map(s => labeled(s, locale));
}
