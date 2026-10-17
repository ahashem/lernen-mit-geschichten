#!/usr/bin/env node
/**
 * Publish gates (docs/roadmap/02-content-model.md). Reports what published stories still lack and
 * exits non-zero only for CONTENT_STRICT=1, which the owner switches on once content is complete.
 * Two things always fail: a translation with no German source file (nothing can supply its shared
 * fields), and shared fields written outside the German file (they would be silently ignored).
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const STORIES = 'src/content/stories';
const SHARED = ['band', 'cover', 'frames', 'palette', 'art'];
const strict = process.env.CONTENT_STRICT === '1';

const head = text => text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
const has = (fm, field) => new RegExp(`^${field}:`, 'm').test(fm);
const scalar = (fm, field) => fm.match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1].trim();
const countFrames = fm => (fm.match(/^frames:\r?\n((?:[ \t]+.*\r?\n?)*)/m)?.[1].match(/^[ \t]+- /gm) ?? []).length;

const files = [];
for (const locale of readdirSync(STORIES)) {
  for (const file of readdirSync(join(STORIES, locale))) {
    const fm = head(readFileSync(join(STORIES, locale, file), 'utf8'));
    files.push({ locale, file, fm, id: scalar(fm, 'storyId'), draft: scalar(fm, 'status') === 'draft' });
  }
}
const source = new Map(files.filter(f => f.locale === 'de').map(f => [f.id, f]));

const lacking = { band: {}, summary: {}, keyMessage: {}, reviewedBy: {}, coverAlt: {}, frameAlts: {} };
const note = (field, locale) => (lacking[field][locale] = (lacking[field][locale] ?? 0) + 1);
const hard = [];

for (const f of files) {
  if (f.draft) continue;
  const de = source.get(f.id);
  if (!de) hard.push(`${f.locale}/${f.file}: no German source file for storyId ${f.id}`);
  if (f.locale !== 'de') {
    for (const field of SHARED) if (has(f.fm, field)) hard.push(`${f.locale}/${f.file}: shared field "${field}" belongs in the German file`);
    if (!has(f.fm, 'reviewedBy')) note('reviewedBy', f.locale);
    if (de && has(de.fm, 'cover') && !has(f.fm, 'coverAlt')) note('coverAlt', f.locale);
    if (de && countFrames(de.fm) > 0 && !has(f.fm, 'frameAlts')) note('frameAlts', f.locale);
  } else if (!has(f.fm, 'band')) note('band', f.locale);
  for (const field of ['summary', 'keyMessage']) if (!has(f.fm, field)) note(field, f.locale);
}

let missing = 0;
for (const [field, byLocale] of Object.entries(lacking)) {
  const total = Object.values(byLocale).reduce((a, b) => a + b, 0);
  missing += total;
  const detail = Object.entries(byLocale).map(([l, n]) => `${l} ${n}`).join(', ');
  console.log(`${field}: ${total} published file(s) lack it${total ? ` (${detail})` : ''}`);
}
for (const line of hard) console.error(`FAIL ${line}`);
if (hard.length || (strict && missing)) process.exit(1);
