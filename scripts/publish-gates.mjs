#!/usr/bin/env node
/**
 * Publish gates (docs/roadmap/02-content-model.md). Reports what published stories still lack and
 * exits non-zero only for CONTENT_STRICT=1, which the owner switches on once content is complete.
 * A translation without a story-meta entry always fails: nothing can render it.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const STORIES = 'src/content/stories';
const META = 'src/content/story-meta';
const strict = process.env.CONTENT_STRICT === '1';

const head = text => text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
const has = (fm, field) => new RegExp(`^${field}:\\s*\\S`, 'm').test(fm);
const scalar = (fm, field) => fm.match(new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1].trim();

const metaIds = new Set(
  existsSync(META) ? readdirSync(META).filter(f => f.endsWith('.yaml')).map(f => f.replace(/\.yaml$/, '')) : []
);
const lacking = { summary: {}, keyMessage: {}, reviewedBy: {} };
const hard = [];

for (const locale of readdirSync(STORIES)) {
  for (const file of readdirSync(join(STORIES, locale))) {
    const fm = head(readFileSync(join(STORIES, locale, file), 'utf8'));
    if (scalar(fm, 'status') === 'draft') continue;
    const id = scalar(fm, 'storyId');
    if (!metaIds.has(id)) hard.push(`${locale}/${file}: no story-meta/${id}.yaml`);
    for (const field of ['summary', 'keyMessage']) if (!has(fm, field)) lacking[field][locale] = (lacking[field][locale] ?? 0) + 1;
    if (locale !== 'de' && !has(fm, 'reviewedBy')) lacking.reviewedBy[locale] = (lacking.reviewedBy[locale] ?? 0) + 1;
  }
}

let missing = 0;
for (const [field, byLocale] of Object.entries(lacking)) {
  const total = Object.values(byLocale).reduce((a, b) => a + b, 0);
  missing += total;
  const detail = Object.entries(byLocale).map(([l, n]) => `${l} ${n}`).join(', ');
  console.log(`${field}: ${total} published translation(s) lack it${total ? ` (${detail})` : ''}`);
}
for (const line of hard) console.error(`FAIL ${line}`);
if (hard.length || (strict && missing)) process.exit(1);
