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
// Mirrors the publishing gate: without STRICT_PUBLISHING a review is not part of the process, so the sheet leaves it out.
const strictPublishing = ['1', 'true'].includes(process.env.STRICT_PUBLISHING ?? '');
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

const chip = (ui, f) => (f.status === 'published' ? `<span class="chip pub">${ui.published}</span>` : `<span class="chip">${ui.draft}</span>`);

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
  // Interface words inside a box keep the interface's own direction, so German text in an Arabic box reads right.
  const ui_ = `lang="${lang}" dir="${ui.dir}"`;
  const missing = `<em class="missing" ${ui_}>${ui.missing}</em>`;
  const label = text => `<span class="label" ${ui_}>${text}</span>`;
  const preview = l => `${up}${l === 'de' ? '' : `${l}/`}stories/${group[l].slug}/`;
  const altBlock = text => `<div class="alt">${label(ui.altText)}${text ? esc(text) : `<em class="missing" ${ui_}>${ui.noAlt}</em>`}</div>`;
  const imgSrc = src => (src ? `${up}${String(src).replace(/^\//, '')}` : '');
  const thumb = src => `<a href="${imgSrc(src)}"><img src="${imgSrc(src)}" alt="" loading="lazy"></a>`;
  // One row per page: a label with the picture, then one box per language in a strip that swipes sideways when it does not fit.
  const row = (head, f) =>
    `<section class="row"><div class="head">${head}</div><div class="strip">${present
      .map(l => `<div class="box" lang="${l}" dir="${RTL.has(l) ? 'rtl' : 'ltr'}"><span class="tag">${NAMES[l]}</span>${f(l)}</div>`)
      .join('')}</div></section>`;

  const languages = LOCALES.map(l => {
    const f = group[l]?.fm;
    if (!f) return `<li><b lang="${l}">${NAMES[l]}</b> <span class="chip none">${ui.noFile}</span></li>`;
    const v = r?.locales[l];
    const list = (items, text) => (items?.length ? `<details><summary>${text} (${items.length})</summary><ul>${items.map(i => `<li>${esc(say(i, lang))}</li>`).join('')}</ul></details>` : '');
    const should = strictPublishing ? v?.shouldItems : v?.shouldItems.filter(i => i.code !== 'review');
    const reviewed = strictPublishing ? ` <small>${f.reviewedBy ? ui.reviewed(esc(f.reviewedBy), day(f.reviewedAt)) : ui.notReviewed}</small>` : '';
    const note = notes[l] ? ` <small class="note">${esc(notes[l])}</small>` : '';
    return `<li><b lang="${l}">${NAMES[l]}</b> ${chip(ui, f)}${reviewed} <a href="${preview(l)}">${ui.open}</a>${note}${list(v?.mustItems, ui.needs)}${list(should, ui.worth)}</li>`;
  }).join('');
  const about = row(ui.about, l => {
    const f = group[l].fm;
    return `<p><strong>${esc(f.title)}</strong></p>${label(ui.summary)}<p>${f.summary ? esc(f.summary) : missing}</p>${label(ui.keyMessage)}<p>${f.keyMessage ? esc(f.keyMessage) : missing}</p>`;
  });
  const cover = de?.fm.cover?.src ? row(`${ui.picture}${thumb(de.fm.cover.src)}`, l => altBlock(l === 'de' ? de.fm.cover.alt : group[l].fm.coverAlt)) : '';
  const pages = Array.from({ length: rows }, (_, i) => {
    const frame = frames.find(fr => fr.pageRef === i + 1) ?? frames[i];
    const fi = frame ? frames.indexOf(frame) : -1;
    return row(`${ui.page(i + 1)}${frame ? thumb(frame.src) : ''}`, l => {
      const text = (pagesOf[l][i]?.sentences ?? []).map(esc).join(' ');
      const alt = fi >= 0 ? altBlock(l === 'de' ? frames[fi]?.alt : group[l].fm.frameAlts?.[fi]) : '';
      return `<p>${text || '&ndash;'}</p>${alt}`;
    });
  }).join('');
  const rest = present.some(l => afterword(group[l].body).length)
    ? `<details class="more"><summary>${ui.afterword}</summary>${row('', l => afterword(group[l].body).map(p => (p.startsWith('## ') ? `<h4>${esc(p.slice(3))}</h4>` : `<p>${esc(p)}</p>`)).join('') || '&ndash;')}</details>`
    : '';
  const qs = present.some(l => group[l].fm.questions?.length || group[l].fm.discussion?.length)
    ? `<details class="more"><summary>${ui.questions}</summary>${row('', l => {
        const f = group[l].fm;
        const items = [...(f.questions ?? []).map(q => q.text ?? q.question ?? ''), ...(f.discussion ?? [])].filter(Boolean);
        return items.length ? `<ul>${items.map(q => `<li>${esc(q)}</li>`).join('')}</ul>` : '&ndash;';
      })}</details>`
    : '';
  const checklists = Object.entries(ui.lists)
    .map(
      ([key, [title, items]]) =>
        `<fieldset><legend>${title}</legend>${items
          .map((item, i) => `<label><input type="checkbox" data-key="${esc(`${id}:${key}:${i}`)}"> ${esc(item)}</label>`)
          .join('')}</fieldset>`
    )
    .join('');
  const name = (de ?? group[present[0]]).fm.title ?? id;
  const emoji = de?.fm.emoji ? `${esc(de.fm.emoji)} ` : '';
  return page(
    lang,
    `${esc(name)} · ${ui.title}`,
    `<p><a href="../">${ui.back}</a></p><h1>${emoji}<bdi>${esc(name)}</bdi> <small class="id">${esc(id)}</small></h1>
<p class="intro">${esc(strictPublishing ? ui.intro : ui.introNoReview)}</p>
<ul class="langs">${languages}</ul>
<div class="rows">${about}${cover}${pages}</div>${rest}${qs}
<h2>${ui.checklists}</h2><div class="lists">${checklists}</div>`
  );
}

function page(lang, title, main) {
  const ui = REVIEW[lang];
  return `<!doctype html>
<html lang="${lang}" dir="${ui.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${title}</title>
<style>body{font:16px/1.5 system-ui,sans-serif;margin:1rem auto;padding:0 1rem;max-width:110rem;color:#24212e;background:#fbf5ea}
a{color:#2f6f62}h1{font-size:1.4rem;margin:.4rem 0}h2{font-size:1.1rem;margin:1.5rem 0 .6rem}h4{margin:.5rem 0 .2rem}nav{margin-bottom:.6rem}p{margin:.3rem 0}.intro{color:#5b5566;font-size:.92rem}
.id{font:600 .78rem ui-monospace,monospace;color:#5b5566;direction:ltr;unicode-bidi:isolate;white-space:nowrap}
.chip{display:inline-block;font-size:.75rem;font-weight:600;padding:.05rem .45rem;border-radius:999px;background:#fbe6c4;color:#7a4800}.chip.pub{background:#dcefe2;color:#1d5e36}
.chip.none{background:none;border:1px dashed #cfc3ad;color:#6b6577;font-weight:500}
.list,.langs{list-style:none;padding:0;margin:.6rem 0;background:#fff;border:1px solid #e2d6c1;border-radius:10px}
.list>li,.langs>li{padding:.4rem .8rem;border-top:1px solid #efe6d6}.list>li:first-child,.langs>li:first-child{border-top:0}
.langs>li{font-size:.92rem}.langs details{display:inline-block;margin-inline-start:.6rem;vertical-align:top}.langs details[open]{display:block;margin:.2rem 0 0}summary{cursor:pointer;font-weight:600}
.list>li{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.25rem 1rem}
.story{display:flex;gap:.5rem;align-items:baseline;color:#24212e;text-decoration:none}.story:hover .name{text-decoration:underline}.name{font-weight:600}
.codes{display:flex;gap:.3rem}.code{position:relative;display:inline-block;min-width:2.3rem;text-align:center;font:700 .72rem ui-monospace,monospace;padding:.15rem .35rem;border-radius:6px;border:1px solid #e0b770;color:#7a4800;background:#fff}
.code.pub{background:#1d5e36;border-color:#1d5e36;color:#fff}.code.none{border-style:dashed;border-color:#cfc3ad;color:#a59eb0}
.code:hover::after,.code:focus::after{content:attr(data-s);position:absolute;top:120%;inset-inline-end:0;z-index:3;padding:.2rem .45rem;border-radius:6px;background:#24212e;color:#fff;font:500 .75rem system-ui,sans-serif;white-space:nowrap}
.legend{display:flex;flex-wrap:wrap;gap:.3rem .8rem;align-items:center;font-size:.85rem;color:#5b5566}
.rows{background:#fff;border:1px solid #e2d6c1;border-radius:10px;padding:0 .8rem}
.row{display:grid;grid-template-columns:7.5rem 1fr;gap:.8rem;padding:.7rem 0;border-top:1px solid #efe6d6}.rows>.row:first-child{border-top:0}.row>*{min-width:0}
.head{font-size:.85rem;font-weight:700;color:#5b5566}.head img{display:block;width:100%;margin-top:.4rem;border-radius:6px;border:1px solid #e2d6c1}
.strip{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(15rem,1fr);gap:.6rem;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:.2rem}
.box{scroll-snap-align:start;padding:.55rem .7rem;border:1px solid #e2d6c1;border-radius:8px;background:#fffdf8}.box p{margin:0 0 .3rem}.box[dir=rtl]{font-size:1.08em;line-height:1.75}
.tag{display:block;margin-bottom:.2rem;font-size:.72rem;font-weight:700;color:#2f6f62}
.label{display:block;font-size:.68rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:#5b5566}
.missing{color:#a02c1c}.note{color:#7a4800}.alt{margin-top:.4rem;padding:.35rem .55rem;border-radius:6px;background:#fbf5ea;font-size:.85rem;color:#5b5566}
.more{margin:.6rem 0;padding:.5rem .8rem;background:#fff;border:1px solid #e2d6c1;border-radius:10px}.more .row{grid-template-columns:1fr;border:0}
.lists{display:grid;gap:.8rem;grid-template-columns:repeat(auto-fit,minmax(16rem,1fr))}fieldset{border:1px solid #e2d6c1;border-radius:10px;background:#fff}
label{display:flex;gap:.5rem;align-items:flex-start;min-height:44px;padding:.2rem 0}input{width:22px;height:22px;flex:none}ul{padding-inline-start:1.2rem;margin:.2rem 0}
@media (max-width:44rem){.row{grid-template-columns:1fr;gap:.4rem}.head{display:flex;gap:.6rem;align-items:center}.head img{width:4.5rem;margin:0}.strip{grid-auto-columns:85%}}
@media print{.strip{grid-auto-flow:row;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));overflow:visible}.row{break-inside:avoid}}</style></head>
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
  const code = (l, cls, state) => `<span class="code${cls}" tabindex="0" data-s="${esc(`${NAMES[l]}: ${state}`)}" aria-label="${esc(`${NAMES[l]}: ${state}`)}">${l.toUpperCase()}</span>`;
  const rows = [...stories.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([id, group]) => {
      const name = (group.de ?? Object.values(group)[0]).fm.title ?? id;
      const codes = LOCALES.map(l => {
        const f = group[l]?.fm;
        if (!f) return code(l, ' none', ui.noFile);
        const reviewed = strictPublishing && f.reviewedBy ? ` · ${ui.reviewed(esc(f.reviewedBy), '')}` : '';
        return f.status === 'published' ? code(l, ' pub', ui.published + reviewed) : code(l, '', ui.draft + reviewed);
      }).join('');
      const emoji = group.de?.fm.emoji ? `<span aria-hidden="true">${esc(group.de.fm.emoji)}</span>` : '';
      return `<li><a class="story" href="${esc(id)}/">${emoji}<bdi class="name">${esc(name)}</bdi><small class="id">${esc(id)}</small></a><span class="codes">${codes}</span></li>`;
    })
    .join('');
  const sample = (cls, text) => `<span><span class="code${cls}">DE</span> ${text}</span>`;
  return page(
    lang,
    ui.title,
    `<h1>${ui.title}</h1><p class="intro">${esc(strictPublishing ? ui.intro : ui.introNoReview)}</p>
<p><a href="${up}status/${folderOf(lang)}">${ui.status}</a> · <a href="${up}guide/${folderOf(lang)}">${ui.guide}</a></p>
<p class="legend">${sample(' pub', ui.published)}${sample('', ui.draft)}${sample(' none', ui.noFile)}</p>
<ul class="list">${rows}</ul>`
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
