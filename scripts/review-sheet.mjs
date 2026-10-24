#!/usr/bin/env node
/**
 * Writes the reviewers' sheet: per story, every language side by side page by page, with the pictures, alt texts,
 * what is still needed and the review checklists (docs/roadmap/03). Preview only, like preview-status.mjs: production
 * never runs this. English at <out>/, Arabic at <out>/ar/, German at <out>/de/, one folder per story under each.
 * Usage: review-sheet.mjs <out dir> [stories dir]
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { alignTo, paginate } from '../src/utils/story-pages.ts';
import { readiness, LOCALES } from './readiness.mjs';
import { say } from './status-messages.mjs';
import { REVIEW } from './review-messages.mjs';

const [out, storiesDir = 'src/content/stories'] = process.argv.slice(2);
const root = join(storiesDir, '../../..');
const LANGS = ['de', 'ar', 'en'];
// The interface language at the folder itself; the others sit in ar/ and de/.
const ROOT = 'en';
const folderOf = lang => (lang === ROOT ? '' : `${lang}/`);
const NAMES = { de: 'Deutsch', ar: 'العربية', en: 'English', tr: 'Türkçe', ur: 'اردو' };
const RTL = new Set(['ar', 'ur']);
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const plain = s => String(s).replace(/[*_`#>]/g, '').trim();
const day = v => (v instanceof Date ? v.toISOString().slice(0, 10) : v ? String(v) : '');

function read(path) {
  const raw = readFileSync(path, 'utf8');
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  return { fm: (m && parseYaml(m[1])) ?? {}, body: m?.[2] ?? '' };
}

const stories = new Map();
for (const locale of LOCALES) {
  const dir = join(storiesDir, locale);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
    const s = read(join(dir, file));
    if (!s.fm.storyId) continue;
    const group = stories.get(s.fm.storyId) ?? {};
    group[locale] = { ...s, slug: file.replace(/\.md$/, '') };
    stories.set(s.fm.storyId, group);
  }
}
const ready = readiness(root);

// Everything after the story section (the afterword, exercises), as plain paragraphs.
function afterword(body) {
  const parts = body.replace(/^# .*$/gm, '').split(/^## /m);
  if (parts.length < 3) return [];
  return parts.slice(2).flatMap(section => {
    const [head, ...rest] = section.split('\n');
    return [`## ${head}`, ...rest.join('\n').split(/\n\s*\n/).map(plain).filter(Boolean)];
  });
}

function storyPage(id, group, lang, up) {
  const ui = REVIEW[lang];
  const de = group.de;
  const band = Number(de?.fm.band) || 1;
  const deBook = de ? paginate(de.body, 'de', band, de.fm.pages) : null;
  const present = LOCALES.filter(l => group[l]);
  const r = ready.get(id);
  const frames = de?.fm.frames ?? [];

  const pagesOf = {};
  const notes = {};
  for (const l of present) {
    const f = group[l];
    const own = paginate(f.body, l, band, f.fm.pages).pages;
    const aligned = l === 'de' || !deBook ? own : alignTo(deBook, f.body, l, band, f.fm.pages);
    pagesOf[l] = aligned ?? own;
    if (!aligned) notes[l] = ui.notAligned(deBook.pages.length, own.length);
  }
  const rows = Math.max(0, ...present.map(l => pagesOf[l].length));
  const cell = (l, html) => `<td lang="${l}" dir="${RTL.has(l) ? 'rtl' : 'ltr'}">${html}</td>`;
  // Interface words inside a column keep the interface's own direction, so German text in an Arabic column reads right.
  const ui_ = `lang="${lang}" dir="${ui.dir}"`;
  const missing = `<em class="missing" ${ui_}>${ui.missing}</em>`;
  const field = v => (v ? esc(v) : missing);
  const preview = l => `${up}${l === 'de' ? '' : `${l}/`}stories/${group[l].slug}/`;
  const alt = (l, i) => {
    const text = l === 'de' ? frames[i]?.alt : group[l].fm.frameAlts?.[i];
    return text ? esc(text) : `<em class="missing" ${ui_}>${ui.noAlt}</em>`;
  };
  const imgSrc = src => (src ? `${up}${String(src).replace(/^\//, '')}` : '');

  const head = `<tr><th></th>${present
    .map(l => {
      const f = group[l].fm;
      const status = f.status === 'published' ? ui.published : ui.draft;
      const reviewed = f.reviewedBy ? ui.reviewed(esc(f.reviewedBy), day(f.reviewedAt)) : ui.notReviewed;
      return `<th scope="col" lang="${l}">${NAMES[l]}<br><small>${status} · ${reviewed}</small><br><a href="${preview(l)}">${ui.open}</a></th>`;
    })
    .join('')}</tr>`;
  const meta = [
    ['title', '', l => `<strong>${esc(group[l].fm.title)}</strong>`],
    ['summary', ui.summary, l => field(group[l].fm.summary)],
    ['keyMessage', ui.keyMessage, l => field(group[l].fm.keyMessage)],
  ]
    .map(([, label, f]) => `<tr><th scope="row">${label}</th>${present.map(l => cell(l, f(l))).join('')}</tr>`)
    .join('');
  const cover = de?.fm.cover?.src
    ? `<tr><th scope="row">${ui.picture}<img src="${imgSrc(de.fm.cover.src)}" alt="" loading="lazy"></th>${present
        .map(l => cell(l, `<small ${ui_}>${ui.altText}:</small> ${(l === 'de' ? de.fm.cover.alt : group[l].fm.coverAlt) ? esc(l === 'de' ? de.fm.cover.alt : group[l].fm.coverAlt) : `<em class="missing" ${ui_}>${ui.noAlt}</em>`}`))
        .join('')}</tr>`
    : '';
  const pages = Array.from({ length: rows }, (_, i) => {
    const frame = frames.find(fr => fr.pageRef === i + 1) ?? frames[i];
    const fi = frame ? frames.indexOf(frame) : -1;
    const pic = frame ? `<img src="${imgSrc(frame.src)}" alt="" loading="lazy">` : '';
    return `<tr><th scope="row">${ui.page(i + 1)}${pic}</th>${present
      .map(l => {
        const text = (pagesOf[l][i]?.sentences ?? []).map(esc).join(' ');
        const altLine = fi >= 0 ? `<p class="alt"><small ${ui_}>${ui.altText}:</small> ${alt(l, fi)}</p>` : '';
        return cell(l, `${text || '&ndash;'}${altLine}`);
      })
      .join('')}</tr>`;
  }).join('');
  const rest = present.some(l => afterword(group[l].body).length)
    ? `<tr><th scope="row">${ui.afterword}</th>${present
        .map(l => cell(l, afterword(group[l].body).map(p => (p.startsWith('## ') ? `<h4>${esc(p.slice(3))}</h4>` : `<p>${esc(p)}</p>`)).join('')))
        .join('')}</tr>`
    : '';
  const qs = present.some(l => group[l].fm.questions?.length || group[l].fm.discussion?.length)
    ? `<tr><th scope="row">${ui.questions}</th>${present
        .map(l => {
          const f = group[l].fm;
          const items = [...(f.questions ?? []).map(q => q.text ?? q.question ?? ''), ...(f.discussion ?? [])].filter(Boolean);
          return cell(l, items.length ? `<ul>${items.map(q => `<li>${esc(q)}</li>`).join('')}</ul>` : '&ndash;');
        })
        .join('')}</tr>`
    : '';
  const needs = r
    ? `<tr><th scope="row">${ui.needs} / ${ui.worth}</th>${present
        .map(l => {
          const v = r.locales[l];
          if (!v) return cell(l, '&ndash;');
          const list = (items, label) => (items.length ? `<p><strong>${label}</strong></p><ul>${items.map(i => `<li>${esc(say(i, lang))}</li>`).join('')}</ul>` : '');
          return cell(l, list(v.mustItems, ui.needs) + list(v.shouldItems, ui.worth) || ui.nothing);
        })
        .join('')}</tr>`
    : '';
  const noteRow = Object.keys(notes).length
    ? `<tr><th scope="row"></th>${present.map(l => cell(l, notes[l] ? `<p class="note" ${ui_}>${esc(notes[l])}</p>` : '')).join('')}</tr>`
    : '';
  const absent = LOCALES.filter(l => !group[l]);
  const checklists = Object.entries(ui.lists)
    .map(
      ([key, [title, items]]) =>
        `<fieldset><legend>${title}</legend>${items
          .map((item, i) => `<label><input type="checkbox" data-key="${esc(`${id}:${key}:${i}`)}"> ${esc(item)}</label>`)
          .join('')}</fieldset>`
    )
    .join('');
  const name = (de ?? group[present[0]]).fm.title ?? id;
  return page(
    lang,
    `${esc(name)} · ${ui.title}`,
    `<p><a href="../">${ui.back}</a></p><h1><bdi dir="ltr">${esc(id)}</bdi> <bdi>${esc(name)}</bdi></h1>
<p>${esc(ui.intro)}</p>${absent.length ? `<p>${absent.map(l => `${NAMES[l]}: ${ui.noFile}`).join(' · ')}</p>` : ''}
<div class="scroll"><table><thead>${head}</thead><tbody>${meta}${noteRow}${cover}${pages}${rest}${qs}${needs}</tbody></table></div>
<h2>${ui.checklists}</h2><div class="lists">${checklists}</div>`
  );
}

function page(lang, title, main) {
  const ui = REVIEW[lang];
  return `<!doctype html>
<html lang="${lang}" dir="${ui.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${title}</title>
<style>body{font:17px/1.5 system-ui,sans-serif;margin:1.5rem auto;padding:0 1rem;max-width:110rem;color:#24212e;background:#fbf5ea}
.scroll{overflow-x:auto}table{border-collapse:collapse;min-width:100%}th,td{border:1px solid #24212e;padding:.5rem .7rem;vertical-align:top;min-width:15rem;max-width:28rem;text-align:start}
thead th{position:sticky;top:0;background:#f2e8d6}tbody th{min-width:9rem;width:9rem;background:#f2e8d6}th img{display:block;width:100%;margin-top:.4rem;border-radius:6px}
td[dir=rtl]{font-size:1.1em}.missing{color:#a02c1c}.alt,.note{color:#5b5566;margin:.4rem 0 0}h1{font-size:1.5rem}h4{margin:.6rem 0 .2rem}
.lists{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))}fieldset{border:1px solid #24212e;border-radius:8px}
label{display:flex;gap:.5rem;align-items:flex-start;min-height:44px;padding:.2rem 0}input{width:22px;height:22px;flex:none}nav{margin-bottom:1rem}ul{padding-inline-start:1.2rem;margin:.2rem 0}</style></head>
<body><main><nav aria-label="Language">${LANGS.map(l => (l === lang ? `<strong>${NAMES[l]}</strong>` : `<a data-lang="${l}" lang="${l}" href="#">${NAMES[l]}</a>`)).join(' · ')}</nav>${main}</main>
<script>
// Ticks are a personal aid while reading; they never leave this device and are not a review record.
document.querySelectorAll('input[data-key]').forEach(b => {
  const k = 'review-' + b.dataset.key;
  try { b.checked = localStorage.getItem(k) === '1'; } catch (e) {}
  b.addEventListener('change', () => { try { b.checked ? localStorage.setItem(k, '1') : localStorage.removeItem(k); } catch (e) {} });
});
// The same page in another language: English has no prefix, the others add ar/ or de/ after review/.
document.querySelectorAll('a[data-lang]').forEach(a => {
  const rest = location.pathname.replace(/^(.*\\/review\\/)(?:(?:ar|de)\\/)?/, '');
  const base = location.pathname.match(/^(.*\\/review\\/)/)[1];
  a.href = base + (a.dataset.lang === '${ROOT}' ? '' : a.dataset.lang + '/') + rest;
});
</script></body></html>
`;
}

function index(lang, up) {
  const ui = REVIEW[lang];
  const rows = [...stories.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, group]) => {
      const name = (group.de ?? Object.values(group)[0]).fm.title ?? id;
      const langs = LOCALES.filter(l => group[l])
        .map(l => `${NAMES[l]}${group[l].fm.reviewedBy || l === 'de' ? '' : ' ○'}${group[l].fm.status === 'published' ? ' ●' : ''}`)
        .join(' · ');
      return `<li><a href="${esc(id)}/"><bdi dir="ltr">${esc(id)}</bdi> <bdi>${esc(name)}</bdi></a><br><small>${langs}</small></li>`;
    })
    .join('');
  return page(
    lang,
    ui.title,
    `<h1>${ui.title}</h1><p>${esc(ui.intro)}</p><p><small>● ${ui.published} · ○ ${ui.notReviewed}</small></p>
<p><a href="${up}status/${folderOf(lang)}">${ui.status}</a> · <a href="${up}guide/${folderOf(lang)}">${ui.guide}</a></p><h2>${ui.stories}</h2><ul>${rows}</ul>`
  );
}

for (const lang of LANGS) {
  const dir = lang === ROOT ? out : join(out, lang);
  // From <out>/ the preview root is ../; from <out>/<lang>/ it is ../../; a story folder adds one more level.
  const up = lang === ROOT ? '../' : '../../';
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), index(lang, up));
  for (const [id, group] of stories) {
    mkdirSync(join(dir, id), { recursive: true });
    writeFileSync(join(dir, id, 'index.html'), storyPage(id, group, lang, `../${up}`));
  }
}
