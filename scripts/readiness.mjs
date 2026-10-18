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
import { say } from './status-messages.mjs';

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

  const charDir = join(root, 'src/content/characters');
  const characters = new Map();
  if (existsSync(charDir)) {
    for (const f of readdirSync(charDir).filter(x => x.endsWith('.yaml') && !x.startsWith('_'))) {
      characters.set(f.replace(/\.yaml$/, ''), parseYaml(readFileSync(join(charDir, f), 'utf8')) ?? {});
    }
  }

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
      const M = (code, params = {}) => ({ code, params });
      const need = (ok, item) => ok || must.push(item);
      const { fm } = f;

      need(filled(fm.summary), M('summary'));
      need(filled(fm.keyMessage), M('keyMessage'));
      need(filled(fm.reviewedBy) && filled(fm.reviewedAt), M('review'));
      if (filled(fm.reviewedBy) && filled(fm.author) && String(fm.reviewedBy).toLowerCase() === String(fm.author).toLowerCase()) {
        must.push(M('reviewerIsAuthor'));
      }

      if (locale === 'de') {
        need(filled(fm.band), M('band'));
        need(filled(fm.emoji), M('emoji'));
        const skills = fm.skills ?? [];
        need(skills.length >= 1 && skills.length <= 3, M('skills'));
        for (const s of skills) if (skillIds.length && !skillIds.includes(s)) must.push(M('skillUnknown', { id: s }));
        for (const c of fm.cast ?? []) {
          if (!characters.has(c)) must.push(M('castUnknown', { id: c }));
          else if (characters.get(c).status !== 'approved') should.push(M('castUnapproved', { name: characters.get(c).name ?? c }));
        }
        const pictures = [fm.cover?.src, ...frames.map(x => x.src)].filter(Boolean);
        if (fm.cover) need(filled(fm.cover.alt), M('coverAltDe'));
        frames.forEach((x, i) => need(filled(x.alt), M('frameAltDe', { i: i + 1 })));
        for (const src of pictures) {
          const path = join(publicDir, src);
          if (!existsSync(path)) {
            must.push(M('pictureMissing', { src }));
            continue;
          }
          const name = src.split('/').pop();
          const expected = new RegExp(`^${id}_(cover|frame-\\d\\d_colour|frame-\\d\\d_line)(_\\d+)?\\.(webp|svg)$`);
          if (!expected.test(name)) {
            should.push(M('pictureName', { name, id }));
          } else if (name.endsWith('.webp') && statSync(path).size > 120 * KB) {
            should.push(M('pictureSize', { name, kb: Math.round(statSync(path).size / KB) }));
          }
        }
        if (pictures.length) {
          const art = fm.art ?? {};
          need(filled(art.generator) && filled(art.reviewedBy), M('artProvenance'));
        }
        if (deBook && band && band <= 2) {
          if (!deBook.explicit) {
            should.push(M('pagesDerived'));
          }
          if (frames.length > deBook.pages.length) {
            should.push(M('moreFramesThanPages', { frames: frames.length, pages: deBook.pages.length }));
          }
          const audioDir = join(publicDir, 'assets/audio/de', id);
          if (existsSync(audioDir)) {
            const n = readdirSync(audioDir).filter(x => x.endsWith('.m4a')).length;
            if (n !== deBook.pages.length) should.push(M('recordings', { n, pages: deBook.pages.length }));
          }
        }
      } else if (de) {
        if (fm.skills && JSON.stringify(fm.skills) !== JSON.stringify(de.fm.skills ?? [])) {
          should.push(M('ownSkills'));
        }
        if (de.fm.cover) need(filled(fm.coverAlt), M('coverAltLocale'));
        if (frames.length) {
          need((fm.frameAlts ?? []).length >= frames.length, M('frameAltsLocale', { frames: frames.length, have: (fm.frameAlts ?? []).length }));
        }
        if (deBook) {
          const aligned = alignTo(deBook, f.body, locale, band ?? 1, fm.pages);
          if (!aligned) {
            const mine = paginate(f.body, locale, band ?? 1, fm.pages).pages.length;
            should.push(M('pagesAlign', { de: deBook.pages.length, here: mine }));
          }
        }
      } else {
        must.push(M('noGerman'));
      }
      // `must` and `should` stay English strings (status.json, the terminal); the items carry the code for other languages.
      record.locales[locale] = {
        status: fm.status === 'draft' ? 'draft' : 'published',
        must: must.map(i => say(i, 'en')),
        should: should.map(i => say(i, 'en')),
        mustItems: must,
        shouldItems: should,
      };
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
