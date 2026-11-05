#!/usr/bin/env node
/**
 * Which stories are missing which languages.
 *
 *   node scripts/content-report.mjs           # summary + the missing list
 *   node scripts/content-report.mjs --matrix  # full per-story grid
 *   node scripts/content-report.mjs --json    # machine-readable, for tooling
 *
 * It also lists storybook pages longer than their band allows (ux/02: 3 sentences in band 1, 5 in band 2). That is
 * advice for editors: such a page scrolls inside the reader, and a child does not scroll. Split it with a `---` break.
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
import { parse as parseYaml } from 'yaml';
import { alignTo, paginate, SENTENCES_PER_PAGE } from '../src/utils/story-pages.ts';

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
const drafts = [];
// storyId -> { locale -> { fm, body } }, for the page-length check
const texts = new Map();

for (const locale of LOCALES) {
  const dir = join(ROOT, locale);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir)) {
    if (!/\.mdx?$/.test(file)) continue;
    const text = readFileSync(join(dir, file), 'utf8');
    const id = frontmatterField(text, 'storyId') ?? file.replace(/\.mdx?$/, '');
    // Unpublished stories are not a translation backlog.
    if (frontmatterField(text, 'status') === 'draft') {
      drafts.push(`${locale}/${file}`);
      continue;
    }
    if (!frontmatterField(text, 'storyId')) noId.push(`${locale}/${file}`);
    if (!stories.has(id)) stories.set(id, {});
    stories.get(id)[locale] = file;
    const parts = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!texts.has(id)) texts.set(id, {});
    texts.get(id)[locale] = { fm: (parts && parseYaml(parts[1])) ?? {}, body: parts?.[2] ?? '' };
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

// Pages as the reader cuts them: each language's own pages, and the pages a translation gets when it is read beside
// the German. Band is the German file's; only picture books and read-along (bands 1-2) have a per-page limit.
const longPages = [];
for (const [id, group] of texts) {
  const band = Number(group[SOURCE]?.fm.band) || undefined;
  const limit = SENTENCES_PER_PAGE[band];
  if (!limit) continue;
  const base = group[SOURCE] ? paginate(group[SOURCE].body, SOURCE, band, group[SOURCE].fm.pages) : null;
  for (const locale of LOCALES) {
    const f = group[locale];
    if (!f) continue;
    const own = paginate(f.body, locale, band, f.fm.pages).pages;
    const beside = base && locale !== SOURCE ? alignTo(base, f.body, locale, band, f.fm.pages) : null;
    const counts = own.map((p, i) => Math.max(p.sentences.length, beside?.[i]?.sentences.length ?? 0));
    counts.forEach((n, i) => n > limit && longPages.push({ id, locale, page: i + 1, sentences: n, limit }));
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
        drafts,
        longPages,
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

if (longPages.length) {
  const byStory = new Map();
  for (const p of longPages) byStory.set(p.id, [...(byStory.get(p.id) ?? []), p]);
  console.log(`\nStorybook pages over their band's sentence limit (${longPages.length}) — split them with a --- break`);
  for (const [id, list] of byStory) {
    console.log(`  ${id} (limit ${list[0].limit})`);
    for (const locale of LOCALES) {
      const mine = list.filter(p => p.locale === locale);
      if (mine.length) console.log(`    ${locale}: ${mine.map(p => `p${p.page}=${p.sentences}`).join(', ')}`);
    }
  }
}

if (orphans.length) {
  console.log(`\nTranslations with no ${SOURCE} original (${orphans.length})`);
  for (const id of orphans) console.log(`  ${id}`);
}

if (drafts.length) {
  console.log(`\nUnpublished drafts, excluded from the counts above (${drafts.length})`);
  for (const f of drafts) console.log(`  ${f}`);
}

if (noId.length) {
  console.log(`\nFiles with no storyId in frontmatter (${noId.length}) — joined by filename instead`);
  for (const f of noId) console.log(`  ${f}`);
}
