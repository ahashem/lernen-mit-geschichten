#!/usr/bin/env node
/**
 * What each story still needs, per language, in words a moderator can act on (docs/roadmap/03). The "must" list
 * mirrors the publishing gate in publish-gates.mjs; the "should" list is advice and never blocks anything.
 * Used by preview-status.mjs for the moderators' status page; run it directly for the same report in a terminal:
 *   node scripts/readiness.mjs [root]
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { alignTo, paginate } from '../src/utils/story-pages.ts';

export const LOCALES = ['de', 'en', 'ar', 'tr', 'ur'];
const KB = 1024;

function readStory(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return { fm: (m && parseYaml(m[1])) ?? {}, body: m?.[2] ?? '' };
}

const filled = v => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== '');
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

/** @returns {Map<string, {id: string, title: string, band: number|undefined, locales: Record<string, {status: string, must: string[], should: string[]} | null>}>} */
export function readiness(root = '.') {
  const storiesDir = join(root, 'src/content/stories');
  const publicDir = join(root, 'public');
  const skillIds = existsSync(join(root, 'src/content/skills'))
    ? readdirSync(join(root, 'src/content/skills'))
        .filter(f => f.endsWith('.yaml'))
        .map(f => f.replace(/\.yaml$/, ''))
    : [];

  const files = [];
  for (const locale of LOCALES) {
    const dir = join(storiesDir, locale);
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
      const { fm, body } = readStory(join(dir, file));
      if (fm.storyId) files.push({ locale, file, fm, body });
    }
  }
  const byId = new Map();
  for (const f of files) byId.set(f.fm.storyId, { ...byId.get(f.fm.storyId), [f.locale]: f });

  const out = new Map();
  for (const [id, group] of byId) {
    const de = group.de;
    const band = de ? Number(de.fm.band) || undefined : undefined;
    const deBook = de ? paginate(de.body, 'de', band ?? 1, de.fm.pages) : null;
    const frames = de?.fm.frames ?? [];
    const record = { id, title: (de ?? Object.values(group)[0]).fm.title ?? id, band, locales: {} };

    for (const locale of LOCALES) {
      const f = group[locale];
      if (!f) {
        record.locales[locale] = null;
        continue;
      }
      const must = [];
      const should = [];
      const need = (ok, text) => ok || must.push(text);
      const { fm } = f;

      need(filled(fm.summary), 'Write the summary (one or two sentences).');
      need(filled(fm.keyMessage), 'Write the one idea (key message).');
      need(filled(fm.reviewedBy) && filled(fm.reviewedAt), 'Have someone else read it, then fill "Reviewed by" and the review date.');
      if (filled(fm.reviewedBy) && filled(fm.author) && String(fm.reviewedBy).toLowerCase() === String(fm.author).toLowerCase()) {
        must.push('The reviewer must be a different person from the author.');
      }

      if (locale === 'de') {
        need(filled(fm.band), 'Choose the band.');
        need(filled(fm.emoji), 'Pick an emoji.');
        const skills = fm.skills ?? [];
        need(skills.length >= 1 && skills.length <= 3, 'Pick 1 to 3 skills.');
        for (const s of skills) if (skillIds.length && !skillIds.includes(s)) must.push(`The skill "${s}" does not exist.`);
        const pictures = [fm.cover?.src, ...frames.map(x => x.src)].filter(Boolean);
        if (fm.cover) need(filled(fm.cover.alt), 'Write the alt text of the cover (German).');
        frames.forEach((x, i) => need(filled(x.alt), `Write the alt text of page picture ${i + 1} (German).`));
        for (const src of pictures) {
          const path = join(publicDir, src);
          if (!existsSync(path)) {
            must.push(`The picture ${src} has not been uploaded.`);
            continue;
          }
          const name = src.split('/').pop();
          const expected = new RegExp(`^${id}_(cover|frame-\\d\\d_colour|frame-\\d\\d_line)(_\\d+)?\\.(webp|svg)$`);
          if (!expected.test(name)) {
            should.push(`${name}: the convention is ${id}_cover.webp or ${id}_frame-01_colour.webp (WebP, 1200 px wide).`);
          } else if (name.endsWith('.webp') && statSync(path).size > 120 * KB) {
            should.push(`${name} is ${Math.round(statSync(path).size / KB)} KB; the budget is 120 KB.`);
          }
        }
        if (pictures.length) {
          const art = fm.art ?? {};
          need(filled(art.generator) && filled(art.reviewedBy), 'Fill in "How the art was made" (tool and who reviewed it).');
        }
        if (deBook && band && band <= 2) {
          if (!deBook.explicit) {
            should.push('Pages are worked out from the paragraphs. Add a horizontal line between pages if you want control; recorded narration only plays with explicit pages.');
          }
          if (frames.length > deBook.pages.length) {
            should.push(`${plural(frames.length, 'page picture')} but only ${plural(deBook.pages.length, 'page')}.`);
          }
          const audioDir = join(publicDir, 'assets/audio/de', id);
          if (existsSync(audioDir)) {
            const n = readdirSync(audioDir).filter(x => x.endsWith('.m4a')).length;
            if (n !== deBook.pages.length) should.push(`${plural(n, 'recording')} for ${plural(deBook.pages.length, 'page')}.`);
          }
        }
      } else if (de) {
        if (fm.skills && JSON.stringify(fm.skills) !== JSON.stringify(de.fm.skills ?? [])) {
          should.push('This language has its own skills; leave them empty unless the story really differs.');
        }
        if (de.fm.cover) need(filled(fm.coverAlt), 'Write the alt text of the cover in this language.');
        if (frames.length) {
          need((fm.frameAlts ?? []).length >= frames.length, `Write the alt text of ${plural(frames.length, 'page picture')} in this language (${(fm.frameAlts ?? []).length} written so far).`);
        }
        if (deBook) {
          const aligned = alignTo(deBook, f.body, locale, band ?? 1, fm.pages);
          if (!aligned) {
            const mine = paginate(f.body, locale, band ?? 1, fm.pages).pages.length;
            should.push(`Pages do not line up with German (German ${deBook.pages.length}, here ${mine}), so this language cannot be read beside German.`);
          }
        }
      } else {
        must.push('There is no German original for this story.');
      }
      record.locales[locale] = { status: fm.status === 'draft' ? 'draft' : 'published', must, should };
    }
    out.set(id, record);
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ?? join(dirname(fileURLToPath(import.meta.url)), '..');
  for (const [id, r] of [...readiness(root)].sort(([a], [b]) => a.localeCompare(b))) {
    console.log(`${id} ${r.title}`);
    for (const [locale, v] of Object.entries(r.locales)) {
      if (!v) continue;
      console.log(`  ${locale} (${v.status}): ${v.must.length ? `${plural(v.must.length, 'thing')} to fix` : 'ready'}`);
      for (const m of v.must) console.log(`    must   ${m}`);
      for (const s of v.should) console.log(`    should ${s}`);
    }
  }
}
