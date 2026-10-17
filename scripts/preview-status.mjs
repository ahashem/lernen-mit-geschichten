#!/usr/bin/env node
/**
 * Writes the moderators' check-result page (preview/status/index.html) so nobody needs GitHub to learn
 * why a save is or is not live. Usage: preview-status.mjs <out.html> <build: ok|failed|none> <sha> <gate.txt> [stories dir]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [out, build, sha, gateFile, storiesDir] = process.argv.slice(2);
const LOCALES = ['de', 'en', 'ar', 'tr', 'ur'];
const gate = gateFile && existsSync(gateFile) ? readFileSync(gateFile, 'utf8').trim() : '';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const blocked = gate.split('\n').filter(l => l.startsWith('BLOCKED') || l.startsWith('FAIL'));
const verdict =
  build === 'none'
    ? 'No editorial branch yet.'
    : build !== 'ok'
      ? 'The preview could not be built. Fix the error below and save again.'
      : blocked.length
        ? 'The preview is up to date, but these files cannot go live yet.'
        : 'Everything passes. Published stories go live a few minutes after saving.';

// Story x language overview: the CMS shows one language at a time, this shows them side by side.
const field = (fm, name) => fm.match(new RegExp(`^${name}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1].trim();
const stories = new Map();
if (storiesDir && existsSync(storiesDir)) {
  for (const locale of LOCALES) {
    const dir = `${storiesDir}/${locale}`;
    if (!existsSync(dir)) continue;
    for (const file of readdirSync(dir).filter(f => f.endsWith('.md'))) {
      const fm = readFileSync(`${dir}/${file}`, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
      const id = field(fm, 'storyId') ?? file;
      const row = stories.get(id) ?? { cells: {} };
      row.cells[locale] = { status: field(fm, 'status') === 'draft' ? 'draft' : 'published', reviewed: /^reviewedBy:\s*\S/m.test(fm) };
      if (locale === 'de') Object.assign(row, { title: field(fm, 'title'), band: field(fm, 'band') });
      stories.set(id, row);
    }
  }
}
const cell = c => (c ? `${c.status}${c.reviewed ? ' &#10003;' : ''}` : '&ndash;');
const overview = stories.size
  ? `<h2>All stories</h2><p>Status per language. &#10003; means a reviewer is named.</p><div style="overflow-x:auto"><table><thead><tr><th>Story</th><th>Band</th>${LOCALES.map(l => `<th>${l}</th>`).join('')}</tr></thead><tbody>${[...stories]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([id, r]) =>
          `<tr><th scope="row">${esc(id)}${r.title ? ` ${esc(r.title)}` : ''}</th><td>${esc(r.band ?? '')}</td>${LOCALES.map(l => `<td>${cell(r.cells[l])}</td>`).join('')}</tr>`
      )
      .join('')}</tbody></table></div>`
  : '';

mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Content check</title>
<style>body{font:18px/1.5 system-ui,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#24212e;background:#fbf5ea}
table{border-collapse:collapse;font-size:16px}th,td{border:1px solid #24212e;padding:.3rem .6rem;text-align:left}pre{white-space:pre-wrap;background:#fff;border:2px solid #24212e;padding:1rem}h1{font-size:1.5rem}</style></head>
<body><main><h1>Content check</h1><p>${esc(verdict)}</p>
<p>Checked commit <code>${esc(sha ?? 'unknown')}</code> at ${new Date().toISOString()}.</p>
${gate ? `<h2>Details</h2><pre>${esc(gate)}</pre>` : ''}
${overview}
<p><a href="../">Open the preview</a></p></main></body></html>
`
);
