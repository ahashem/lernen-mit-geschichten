#!/usr/bin/env node
/**
 * Which stories are missing which languages.
 *
 *   node scripts/content-report.mjs           # summary + the missing list
 *   node scripts/content-report.mjs --matrix  # full per-story grid
 *   node scripts/content-report.mjs --json    # machine-readable, for tooling
 *
 * Stories live at src/content/stories/<locale>/<slug>.md and are joined across
 * locales by the `storyId` in their frontmatter, not by filename — a
 * translation is free to use a different slug.
 *
 * This is the moderator worklist: a translator should be able to run it, or
 * read its output, and know exactly what to pick up next.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'src/content/stories';
const SOURCE = 'de';
const LOCALES = ['de', 'ar', 'en', 'tr', 'ur'];

if (!existsSync(ROOT)) {
  console.error(`${ROOT} not found — run from the repository root.`);
  process.exit(2);
}

const args = new Set(process.argv.slice(2));

/** Pull one scalar frontmatter field without pulling in a YAML dependency. */
function frontmatterField(text, field) {
  const fm = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) return null;
  const m = fm[1].match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, 'm'));
  return m ? m[1].trim() : null;
}

// storyId -> { locale -> filename }
const stories = new Map();
const noId = [];

for (const locale of LOCALES) {
  const dir = join(ROOT, locale);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const text = readFileSync(join(dir, file), 'utf8');
    const id = frontmatterField(text, 'storyId') ?? file.replace(/\.mdx?$/, '');
    if (!frontmatterField(text, 'storyId')) noId.push(`${locale}/${file}`);
    if (!stories.has(id)) stories.set(id, {});
    stories.get(id)[locale] = file;
  }
}

const ids = [...stories.keys()].sort();
const sourced = ids.filter(id => stories.get(id)[SOURCE]);
const orphans = ids.filter(id => !stories.get(id)[SOURCE]);

const missing = [];
for (const id of sourced) {
  for (const locale of LOCALES) {
    if (locale !== SOURCE && !stories.get(id)[locale]) missing.push({ id, locale });
  }
}

if (args.has('--json')) {
  console.log(
    JSON.stringify(
      {
        source: SOURCE,
        locales: LOCALES,
        stories: Object.fromEntries(stories),
        missing,
        orphans,
      },
      null,
      2
    )
  );
  process.exit(0);
}

const perLocale = Object.fromEntries(
  LOCALES.map(l => [l, ids.filter(id => stories.get(id)[l]).length])
);

console.log(`Source language: ${SOURCE}`);
console.log(`Stories with a ${SOURCE} original: ${sourced.length}`);
console.log(`Translation slots: ${sourced.length * LOCALES.length}`);
console.log(`Filled: ${sourced.length * LOCALES.length - missing.length}`);
console.log(`MISSING: ${missing.length}\n`);

console.log('Coverage by language');
for (const locale of LOCALES) {
  const have = perLocale[locale];
  const pct = sourced.length ? Math.round((have / sourced.length) * 100) : 0;
  const bar = '█'.repeat(Math.round(pct / 5)).padEnd(20, '·');
  console.log(`  ${locale}  ${bar} ${String(have).padStart(3)}/${sourced.length}  ${pct}%`);
}

if (missing.length) {
  console.log('\nMissing translations, by language');
  for (const locale of LOCALES.filter(l => l !== SOURCE)) {
    const forLocale = missing.filter(m => m.locale === locale);
    if (!forLocale.length) continue;
    console.log(`\n  ${locale} — ${forLocale.length} missing`);
    for (const m of forLocale) console.log(`    ${m.id}`);
  }
}

if (args.has('--matrix')) {
  console.log('\nPer-story matrix');
  const width = Math.max(...ids.map(id => id.length), 8);
  console.log(`  ${'story'.padEnd(width)}  ${LOCALES.join('  ')}`);
  for (const id of ids) {
    const cells = LOCALES.map(l => (stories.get(id)[l] ? ' ✓' : ' ·')).join('  ');
    console.log(`  ${id.padEnd(width)}  ${cells}`);
  }
}

if (orphans.length) {
  console.log(`\nTranslations with no ${SOURCE} original (${orphans.length})`);
  for (const id of orphans) console.log(`  ${id}`);
}

if (noId.length) {
  console.log(`\nFiles with no storyId in frontmatter (${noId.length}) — joined by filename instead`);
  for (const f of noId) console.log(`  ${f}`);
}
