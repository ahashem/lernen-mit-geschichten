#!/usr/bin/env node
/**
 * Writes the moderators' check-result page (preview/status/index.html) so nobody needs GitHub to learn
 * why a save is or is not live. Usage: preview-status.mjs <out.html> <build: ok|failed|none> <sha> <gate.txt>
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';

const [out, build, sha, gateFile] = process.argv.slice(2);
const gate = gateFile && existsSync(gateFile) ? readFileSync(gateFile, 'utf8').trim() : '';
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const blocked = gate.split('\n').filter(l => l.startsWith('BLOCKED') || l.startsWith('FAIL'));
const verdict =
  build === 'none'
    ? 'No content branch yet.'
    : build !== 'ok'
      ? 'The preview could not be built. Fix the error below and save again.'
      : blocked.length
        ? 'The preview is up to date, but these files cannot go live yet.'
        : 'Everything passes. Published stories go live a few minutes after saving.';

mkdirSync(dirname(out), { recursive: true });
writeFileSync(
  out,
  `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>Content check</title>
<style>body{font:18px/1.5 system-ui,sans-serif;max-width:46rem;margin:2rem auto;padding:0 1rem;color:#24212e;background:#fbf5ea}
pre{white-space:pre-wrap;background:#fff;border:2px solid #24212e;padding:1rem}h1{font-size:1.5rem}</style></head>
<body><main><h1>Content check</h1><p>${esc(verdict)}</p>
<p>Checked commit <code>${esc(sha ?? 'unknown')}</code> at ${new Date().toISOString()}.</p>
${gate ? `<h2>Details</h2><pre>${esc(gate)}</pre>` : ''}
<p><a href="../">Open the preview</a></p></main></body></html>
`
);
