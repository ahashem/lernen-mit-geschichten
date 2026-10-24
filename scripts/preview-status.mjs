#!/usr/bin/env node
/**
 * Writes the moderators' check-result page so nobody needs GitHub to learn why a save is or is not live, in the
 * languages they work in: German at preview/status/ (the default), Arabic at ar/, English at en/, plus status.json for
 * tools. Preview only: production never runs this (it builds `main` with `npm run build` and nothing else).
 * Usage: preview-status.mjs <out.html> <build: ok|failed|none> <sha> <gate.txt> [stories dir]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { LANGS, UI, say } from './status-messages.mjs';

const [out, build, sha, gateFile, storiesDir] = process.argv.slice(2);
const LOCALES = ['de', 'en', 'ar', 'tr', 'ur'];
const gate = (gateFile && existsSync(gateFile) ? readFileSync(gateFile, 'utf8') : '').replace(/\u001b\[[0-9;]*m/g, '').trim();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const blocked = gate.split('\n').filter(l => l.startsWith('BLOCKED') || l.startsWith('FAIL'));

// The build's own error is written for developers; say the same thing in plain words above it.
function parseBuildError(text) {
  const m = text.match(/stories → (\S+)\s+data does not match collection schema\.\n([\s\S]*?)(?:\n\s*Hint:|\n\s*Error reference:|$)/);
  if (!m) return null;
  const problems = [...m[2].matchAll(/^\s*([\w.]+)\*\*: \*\*\1: (.+)$/gm)].map(x => `${x[1]}: ${x[2].replace(/\.$/, '')}`);
  return { file: m[1], problems: problems.join('; ') };
}
const parsed = build === 'failed' ? parseBuildError(gate) : null;

const root = storiesDir ? join(storiesDir, '../../..') : '';
let stories = [];
try {
  // Loaded here so a problem in the checklist can never take the whole status page down.
  const { readiness } = await import('./readiness.mjs');
  if (root && existsSync(storiesDir)) stories = [...readiness(root).values()];
} catch (error) {
  console.error(`readiness failed: ${error.message}`);
}
const toFix = r => Object.values(r.locales).reduce((n, v) => n + (v ? v.must.length : 0), 0);
const sorted = [...stories].sort((a, b) => toFix(a) - toFix(b) || a.id.localeCompare(b.id));

const NAMES = { de: 'Deutsch', ar: 'العربية', en: 'English' };
const PATHS = { de: '', ar: 'ar/', en: 'en/' };

function render(lang) {
  const ui = UI[lang];
  const verdict = build === 'none' ? ui.nothingYet : build !== 'ok' ? ui.buildFailed : blocked.length ? ui.blocked : ui.ok;
  const base = lang === 'de' ? './' : '../';
  const switcher = LANGS.map(l =>
    l === lang ? `<strong>${NAMES[l]}</strong>` : `<a href="${base}${PATHS[l]}" hreflang="${l}" lang="${l}">${NAMES[l]}</a>`
  ).join(' · ');
  // The reviewers' sheet sits beside this page: preview/review/ (German) or preview/review/<lang>/.
  const review = lang === 'de' ? '../review/' : `../../review/${lang}/`;
  const cell = v => (v ? `${ui[v.status]}<br>${v.must.length ? ui.toDo(v.must.length) : ui.ready}` : '&ndash;');
  const list = (items, label) =>
    items.length ? `<p><strong>${label}</strong></p><ul>${items.map(i => `<li>${esc(say(i, lang))}</li>`).join('')}</ul>` : '';
  const detail = r =>
    `<details><summary><bdi dir="ltr">${esc(r.id)}</bdi> <bdi>${esc(r.title)}</bdi>: ${toFix(r) ? ui.toDo(toFix(r)) : ui.blocksNothing}</summary><p><a href="${review}${encodeURIComponent(r.id)}/">${ui.reviewSheet}</a></p>${LOCALES.filter(l => r.locales[l])
      .map(l => {
        const v = r.locales[l];
        return `<h3>${l} (${ui[v.status]})</h3>${list(v.mustItems, ui.must)}${list(v.shouldItems, ui.should)}${v.must.length || v.should.length ? '' : `<p>${ui.nothing}</p>`}`;
      })
      .join('')}</details>`;
  const overview = stories.length
    ? `<h2>${ui.heading}</h2><p>${ui.intro}</p><div style="overflow-x:auto"><table><thead><tr><th>${ui.story}</th><th>${ui.band}</th>${LOCALES.map(l => `<th>${l}</th>`).join('')}</tr></thead><tbody>${sorted
        .map(r => `<tr><th scope="row"><bdi dir="ltr">${esc(r.id)}</bdi> <bdi>${esc(r.title)}</bdi></th><td>${esc(r.band ?? '')}</td>${LOCALES.map(l => `<td>${cell(r.locales[l])}</td>`).join('')}</tr>`)
        .join('')}</tbody></table></div>${sorted.map(detail).join('')}`
    : '';
  const problem = parsed ? ui.buildProblem(parsed.file, parsed.problems) : '';
  const start = ui.dir === 'rtl' ? 'right' : 'left';
  return `<!doctype html>
<html lang="${lang}" dir="${ui.dir}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${ui.title}</title>
<style>body{font:18px/1.5 system-ui,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#24212e;background:#fbf5ea}
details{margin:.5rem 0}summary{cursor:pointer;font-weight:600}h3{font-size:1.1rem;margin:.8rem 0 .2rem}table{border-collapse:collapse;font-size:16px}th,td{border:1px solid #24212e;padding:.3rem .6rem;text-align:${start}}pre{white-space:pre-wrap;background:#fff;border:2px solid #24212e;padding:1rem;direction:ltr;text-align:left}h1{font-size:1.5rem}nav{margin-bottom:1rem}</style></head>
<body><main><nav aria-label="Language">${switcher}</nav><h1>${ui.title}</h1><p>${esc(verdict)}</p>
${problem ? `<p><strong>${esc(problem)}</strong></p>` : ''}
<p>${esc(ui.checked(sha ?? '?', new Date().toISOString()))}</p>
${gate ? `<h2>${ui.details}</h2><pre>${esc(gate)}</pre>` : ''}
${overview}
<p><a href="${lang === 'de' ? '../' : '../../'}">${ui.open}</a> · <a href="${lang === 'de' ? '../' : '../../'}guide/${lang === 'de' ? '' : `${lang}/`}">${ui.guide}</a> · <a href="${lang === 'de' ? '../' : '../../'}art/${lang === 'de' ? '' : `${lang}/`}">${ui.art}</a></p></main></body></html>
`;
}

const dir = dirname(out);
mkdirSync(dir, { recursive: true });
writeFileSync(out, render('de'));
for (const lang of ['ar', 'en']) {
  mkdirSync(join(dir, lang), { recursive: true });
  writeFileSync(join(dir, lang, 'index.html'), render(lang));
}

// The same facts as the page, for tools that must not scrape HTML (the story pipeline polls this):
// `commit` is the editorial commit that was checked, `build` is ok | failed | none. `must`/`should` are English
// strings; `mustItems`/`shouldItems` carry the message code and parameters.
writeFileSync(
  join(dir, 'status.json'),
  JSON.stringify(
    {
      commit: sha ?? null,
      build,
      checkedAt: new Date().toISOString(),
      blocked,
      problem: parsed ? UI.en.buildProblem(parsed.file, parsed.problems) : null,
      stories: stories.map(r => ({
        id: r.id,
        title: r.title,
        band: r.band ?? null,
        locales: Object.fromEntries(LOCALES.map(l => [l, r.locales[l] ?? null])),
      })),
    },
    null,
    2
  )
);
