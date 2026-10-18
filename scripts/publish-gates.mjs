#!/usr/bin/env node
/**
 * Publish gates (docs/roadmap/02-content-model.md). Reports what published stories still lack and
 * exits non-zero only for CONTENT_STRICT=1, which the owner switches on once content is complete.
 * Two things always fail: a translation with no German source file (nothing can supply its shared
 * fields), and shared fields written outside the German file (they would be silently ignored).
 *
 * `--changed=<ref>` adds the publishing gate for the moderators' automated pipeline: every story file changed
 * since <ref> that is `published` must be complete and reviewed by someone other than its author, or the run
 * fails. Untouched files are never held to it, so existing stories stay as they are.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { parse as parseYaml } from 'yaml';
import { join } from 'node:path';

const STORIES = 'src/content/stories';
const SHARED = ['band', 'cover', 'frames', 'palette', 'art', 'feelings', 'editorsPick', 'cast'];
const SKILLS = 'src/content/skills';
const CHARACTERS = 'src/content/characters';
const strict = process.env.CONTENT_STRICT === '1';
const listStories = process.argv.includes('--stories');
const changedRef = process.argv.find(a => a.startsWith('--changed='))?.slice('--changed='.length);

const head = text => text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
const has = (fm, field) => new RegExp(`^${field}:`, 'm').test(fm);
const scalar = (fm, field) => fm.match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1].trim();
const block = (fm, key) => fm.match(new RegExp(`^${key}:[^\\n]*\\r?\\n((?:[ \\t]+.*\\r?\\n?)*)`, 'm'))?.[1] ?? '';
const keysOf = fm => [...fm.matchAll(/^([A-Za-z][A-Za-z0-9]*):/gm)].map(m => m[1]);
const countFrames = fm => (fm.match(/^frames:\r?\n((?:[ \t]+.*\r?\n?)*)/m)?.[1].match(/^[ \t]+- /gm) ?? []).length;

// The CMS rewrites a file from its form, so a frontmatter key that is not a form field is silently dropped on the
// next save. Every key in use must therefore be a field (hidden counts) of its language's collection.
const cms = parseYaml(readFileSync('.pages.yml', 'utf8'));
const formOf = locale => cms.content.find(c => c.name === `stories-${locale}`)?.fields ?? [];

const files = [];
for (const locale of readdirSync(STORIES)) {
  for (const file of readdirSync(join(STORIES, locale))) {
    const fm = head(readFileSync(join(STORIES, locale, file), 'utf8'));
    files.push({ locale, file, fm, id: scalar(fm, 'storyId'), draft: scalar(fm, 'status') === 'draft' });
  }
}
const source = new Map(files.filter(f => f.locale === 'de').map(f => [f.id, f]));

// Skills are files in src/content/skills; every id a story uses must be one of them, and each file's id must match its name.
const taxonomy = readdirSync(SKILLS)
  .filter(f => f.endsWith('.yaml'))
  .map(f => f.replace(/\.yaml$/, ''));
const skillsOf = fm => [...(fm.match(/^skills:\s*\[(.*?)\]/m)?.[1] ?? '').matchAll(/"([^"]+)"/g)].map(m => m[1]);
// A translation may carry its own skills when its story really differs from the German one; the report lists them.
const overrides = [];
const lacking = { skillLabels: {}, band: {}, summary: {}, keyMessage: {}, reviewedBy: {}, coverAlt: {}, frameAlts: {} };
const perStory = new Map();
let current = '';
const note = (field, locale) => {
  lacking[field][locale] = (lacking[field][locale] ?? 0) + 1;
  perStory.set(current, [...(perStory.get(current) ?? []), field]);
};
// Recorded narration is reported but never counted towards CONTENT_STRICT: bands 3-4 may publish text first (ux/07 #4).
const unnarrated = {};
const hasRecording = (locale, id) => {
  const dir = `public/assets/audio/${locale}/${id}`;
  return existsSync(dir) && readdirSync(dir).some(x => x.endsWith('.m4a'));
};
const hard = [];

for (const f of files) {
  const form = formOf(f.locale).map(x => x.name);
  for (const key of keysOf(f.fm)) if (!form.includes(key)) hard.push(`${f.locale}/${f.file}: "${key}" is not a field of the ${f.locale} form in .pages.yml, so the CMS would drop it on save`);
  for (const id of skillsOf(f.fm)) if (!taxonomy.includes(id)) hard.push(`${f.locale}/${f.file}: skill "${id}" is not a file in ${SKILLS}`);
  if (f.draft) continue;
  current = `${f.locale}/${f.file}`;
  if (!hasRecording(f.locale, f.id)) {
    unnarrated[f.locale] = (unnarrated[f.locale] ?? 0) + 1;
    perStory.set(current, [...(perStory.get(current) ?? []), 'narration']);
  }
  const de = source.get(f.id);
  if (!de) hard.push(`${f.locale}/${f.file}: no German source file for storyId ${f.id}`);
  if (f.locale !== 'de') {
    for (const field of SHARED) if (has(f.fm, field)) hard.push(`${f.locale}/${f.file}: shared field "${field}" belongs in the German file`);
    if (!has(f.fm, 'reviewedBy')) note('reviewedBy', f.locale);
    if (has(f.fm, 'skills') && de && skillsOf(f.fm).join() !== skillsOf(de.fm).join()) overrides.push(`${f.locale}/${f.file}`);
    if (de && has(de.fm, 'cover') && !has(f.fm, 'coverAlt')) note('coverAlt', f.locale);
    if (de && countFrames(de.fm) > 0 && !has(f.fm, 'frameAlts')) note('frameAlts', f.locale);
  } else if (!has(f.fm, 'band')) note('band', f.locale);
  for (const field of ['summary', 'keyMessage']) if (!has(f.fm, field)) note(field, f.locale);
}

// Characters are small sheets (docs/roadmap/ux/06 section 2). A malformed sheet or a story that lists a character
// with no sheet fails; a missing reference image or an unapproved sheet is only reported.
const characterFiles = existsSync(CHARACTERS) ? readdirSync(CHARACTERS).filter(f => f.endsWith('.yaml') && !f.startsWith('_')) : [];
const characterIds = characterFiles.map(f => f.replace(/\.yaml$/, ''));
const unapproved = [];
for (const f of characterFiles) {
  const id = f.replace(/\.yaml$/, '');
  let sheet;
  try {
    sheet = parseYaml(readFileSync(join(CHARACTERS, f), 'utf8')) ?? {};
  } catch (error) {
    hard.push(`${CHARACTERS}/${f}: not valid YAML (${error.message.split('\n')[0]})`);
    continue;
  }
  if (sheet.id !== id) hard.push(`${CHARACTERS}/${f}: id is "${sheet.id}", expected "${id}"`);
  for (const field of ['name', 'descriptor', 'colourRecipe']) if (!String(sheet[field] ?? '').trim()) hard.push(`${CHARACTERS}/${f}: needs ${field}`);
  if (sheet.status === 'approved' && !String(sheet.approvedBy ?? '').trim()) hard.push(`${CHARACTERS}/${f}: an approved character needs approvedBy`);
  if (sheet.status !== 'approved') unapproved.push(id);
  for (const ref of sheet.references ?? []) {
    if (!existsSync(join('art/characters', id, ref))) console.log(`character ${id}: reference image art/characters/${id}/${ref} is not in the repo`);
  }
}
for (const f of files) {
  if (f.locale !== 'de') continue;
  const cast = parseYaml(f.fm)?.cast ?? [];
  for (const id of cast) if (!characterIds.includes(id)) hard.push(`${f.locale}/${f.file}: character "${id}" is not a file in ${CHARACTERS}`);
}
console.log(`characters: ${characterIds.length} sheet(s), ${characterIds.length - unapproved.length} approved`);

for (const id of taxonomy) {
  const file = readFileSync(join(SKILLS, `${id}.yaml`), 'utf8');
  const declared = file.match(/^id:\s*(\S+)/m)?.[1];
  if (declared !== id) hard.push(`${SKILLS}/${id}.yaml: id is "${declared}", expected "${id}"`);
  if (!/^name:\s*\S/m.test(file)) hard.push(`${SKILLS}/${id}.yaml: needs a name`);
}
// Labels in the other languages are UI strings; a missing one falls back to German, so it is only reported.
for (const locale of readdirSync(STORIES)) {
  const labels = JSON.parse(readFileSync(`src/locales/${locale}.json`, 'utf8')).skillLabels ?? {};
  for (const id of taxonomy) if (!labels[id]) note('skillLabels', locale);
}

let missing = 0;
for (const [field, byLocale] of Object.entries(lacking)) {
  const total = Object.values(byLocale).reduce((a, b) => a + b, 0);
  missing += total;
  const detail = Object.entries(byLocale).map(([l, n]) => `${l} ${n}`).join(', ');
  console.log(`${field}: ${total} published file(s) lack it${total ? ` (${detail})` : ''}`);
}
const narrationTotal = Object.values(unnarrated).reduce((a, b) => a + b, 0);
console.log(
  `narration: ${narrationTotal} published file(s) have no recording (${Object.entries(unnarrated).map(([l, n]) => `${l} ${n}`).join(', ')}); not counted for CONTENT_STRICT`
);
if (listStories) {
  console.log('\nper story:');
  for (const [file, fields] of [...perStory].sort(([a], [b]) => a.localeCompare(b))) console.log(`  ${file}: lacks ${fields.join(', ')}`);
}
if (overrides.length) console.log(`skills overridden in a translation (its story may differ from the German one): ${overrides.join(', ')}`);
for (const line of hard) console.error(`FAIL ${line}`);

// Publishing gate for changed files.
const blocked = [];
if (changedRef) {
  const changed = execFileSync('git', ['diff', '--name-only', `${changedRef}...HEAD`, '--', STORIES], { encoding: 'utf8' })
    .split('\n')
    .filter(f => f.endsWith('.md'));
  for (const path of changed) {
    const f = files.find(x => `${STORIES}/${x.locale}/${x.file}` === path);
    if (!f) continue; // deleted
    // Keys the form cannot edit must never disappear in a save.
    try {
      const before = execFileSync('git', ['show', `${changedRef}:${path}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      const editable = formOf(f.locale).filter(x => !x.hidden).map(x => x.name);
      for (const key of keysOf(head(before))) {
        if (!keysOf(f.fm).includes(key) && !editable.includes(key)) blocked.push(`${path}: "${key}" was removed but the CMS form cannot edit it`);
      }
    } catch {
      // a new file has nothing to lose
    }
    if (f.draft) continue; // a draft is never held to the publishing rules
    const de = source.get(f.id);
    const need = (cond, message) => cond || blocked.push(`${path}: ${message}`);
    for (const field of ['summary', 'keyMessage', 'reviewedBy', 'reviewedAt']) need(has(f.fm, field), `published needs ${field}`);
    const by = scalar(f.fm, 'reviewedBy')?.toLowerCase();
    const author = scalar(f.fm, 'author')?.toLowerCase();
    need(!by || !author || by !== author, 'reviewedBy must be someone other than author');
    if (f.locale === 'de') {
      need(has(f.fm, 'band'), 'published needs band');
      need(has(f.fm, 'emoji'), 'published needs emoji');
      const picked = skillsOf(f.fm).length;
      need(picked >= 1 && picked <= 3, 'published needs 1 to 3 skills');
      const frames = countFrames(f.fm);
      if (has(f.fm, 'cover')) need(/^\s+alt:/m.test(block(f.fm, 'cover')), 'cover needs alt text');
      // A picture that was never uploaded would silently fall back to the generated art.
      for (const src of [...block(f.fm, 'cover').matchAll(/^\s+src:\s*["']?([^"'\r\n]+)/gm), ...block(f.fm, 'frames').matchAll(/^[ \t]+-?\s*src:\s*["']?([^"'\r\n]+)/gm)].map(m => m[1].trim())) {
        need(existsSync(join('public', src)), `the picture ${src} has not been uploaded`);
      }
      if (frames) need((block(f.fm, 'frames').match(/^\s+alt:/gm) ?? []).length >= frames, 'every page picture needs alt text');
      if (has(f.fm, 'cover') || frames) {
        const art = block(f.fm, 'art');
        need(/^\s+generator:\s*\S/m.test(art) && /^\s+reviewedBy:\s*\S/m.test(art), 'art needs its provenance (art.generator and art.reviewedBy)');
      }
    } else if (de) {
      if (has(de.fm, 'cover')) need(has(f.fm, 'coverAlt'), 'needs coverAlt');
      const n = countFrames(de.fm);
      if (n) need(((f.fm.match(/^frameAlts:\r?\n((?:[ \t]+.*\r?\n?)*)/m)?.[1] ?? '').match(/^[ \t]+- /gm) ?? []).length >= n, `needs ${n} frameAlts`);
    }
  }
  for (const line of blocked) console.error(`BLOCKED ${line}`);
  console.log(`publishing gate: ${blocked.length ? blocked.length + ' problem(s)' : 'ok'} for ${changed.length} changed file(s)`);
}
if (hard.length || blocked.length || (strict && missing)) process.exit(1);
