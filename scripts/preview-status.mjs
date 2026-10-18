#!/usr/bin/env node
/**
 * Writes the moderators' check-result page (preview/status/index.html) so nobody needs GitHub to learn
 * why a save is or is not live. Usage: preview-status.mjs <out.html> <build: ok|failed|none> <sha> <gate.txt> [stories dir]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { readiness, LOCALES } from './readiness.mjs';

const [out, build, sha, gateFile, storiesDir] = process.argv.slice(2);
const gate = (gateFile && existsSync(gateFile) ? readFileSync(gateFile, 'utf8') : '').replace(/\u001b\[[0-9;]*m/g, '').trim();
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const blocked = gate.split('\n').filter(l => l.startsWith('BLOCKED') || l.startsWith('FAIL'));
const verdict =
  build === 'none'
    ? 'No editorial branch yet.'
    : build !== 'ok'
      ? 'The preview could not be built. Fix the error below and save again.'
      : blocked.length
        ? 'The preview is up to date, but these files cannot go live yet.'
        : 'Everything passes. Published stories go live a few minutes after saving.';

// The build's own error is written for developers; say the same thing in plain words above it.
function explainBuild(text) {
  const m = text.match(/stories → (\S+)\s+data does not match collection schema\.\n([\s\S]*?)(?:\n\s*Hint:|\n\s*Error reference:|$)/);
  if (!m) return '';
  const problems = [...m[2].matchAll(/^\s*([\w.]+)\*\*: \*\*\1: (.+)$/gm)].map(x => `${x[1]}: ${x[2].replace(/\.$/, '')}`);
  return `The story file ${m[1]} has a field the site cannot read${problems.length ? ` (${problems.join('; ')})` : ''}. Fix that field in the CMS and save again.`;
}
const buildProblem = build === 'failed' ? explainBuild(gate) : '';

// Story x language overview: the CMS shows one language at a time, this shows them side by side.
const field = (fm, name) => fm.match(new RegExp(`^${name}:\\s*["']?([^"'\\r\\n]+)`, 'm'))?.[1].trim();
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
const root = storiesDir ? join(storiesDir, '../../..') : '';
let stories = [];
try {
  if (root && existsSync(storiesDir)) stories = [...readiness(root).values()];
} catch (error) {
  console.error(`readiness failed: ${error.message}`);
}
const toFix = r => Object.values(r.locales).reduce((n, v) => n + (v ? v.must.length : 0), 0);
const cell = v => (v ? `${v.status}<br>${v.must.length ? plural(v.must.length, 'thing') + ' to do' : 'ready'}` : '&ndash;');
const list = (items, label) => (items.length ? `<p><strong>${label}</strong></p><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '');
const detail = r =>
  `<details><summary>${esc(r.id)} ${esc(r.title)}: ${toFix(r) ? plural(toFix(r), 'thing') + ' to do' : 'nothing blocks it'}</summary>${LOCALES.filter(l => r.locales[l])
    .map(l => {
      const v = r.locales[l];
      return `<h3>${l} (${v.status})</h3>${list(v.must, 'Needed before it can go live')}${list(v.should, 'Worth fixing')}${v.must.length || v.should.length ? '' : '<p>Nothing to do.</p>'}`;
    })
    .join('')}</details>`;
const overview = stories.length
  ? `<h2>What each story needs</h2><p>Closest to ready first. "Needed before it can go live" is what the publishing check enforces; "Worth fixing" never blocks.</p><div style="overflow-x:auto"><table><thead><tr><th>Story</th><th>Band</th>${LOCALES.map(l => `<th>${l}</th>`).join('')}</tr></thead><tbody>${[...stories]
      .sort((a, b) => toFix(a) - toFix(b) || a.id.localeCompare(b.id))
      .map(r => `<tr><th scope="row">${esc(r.id)} ${esc(r.title)}</th><td>${esc(r.band ?? '')}</td>${LOCALES.map(l => `<td>${cell(r.locales[l])}</td>`).join('')}</tr>`)
      .join('')}</tbody></table></div>${[...stories]
      .sort((a, b) => toFix(a) - toFix(b) || a.id.localeCompare(b.id))
      .map(detail)
      .join('')}`
  : '';

mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Content check</title>
<style>body{font:18px/1.5 system-ui,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#24212e;background:#fbf5ea}
details{margin:.5rem 0}summary{cursor:pointer;font-weight:600}h3{font-size:1.1rem;margin:.8rem 0 .2rem}table{border-collapse:collapse;font-size:16px}th,td{border:1px solid #24212e;padding:.3rem .6rem;text-align:left}pre{white-space:pre-wrap;background:#fff;border:2px solid #24212e;padding:1rem}h1{font-size:1.5rem}</style></head>
<body><main><h1>Content check</h1><p>${esc(verdict)}</p>
${buildProblem ? `<p><strong>${esc(buildProblem)}</strong></p>` : ''}
<p>Checked commit <code>${esc(sha ?? 'unknown')}</code> at ${new Date().toISOString()}.</p>
${gate ? `<h2>Details</h2><pre>${esc(gate)}</pre>` : ''}
${overview}
<p><a href="../">Open the preview</a></p></main></body></html>
`
);
