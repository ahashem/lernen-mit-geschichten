#!/usr/bin/env node
/**
 * Static verification of the Astro build output — no browser required.
 *
 * Checks, over every generated HTML file in dist/:
 *   1. Every internal href/src resolves to a real file in dist/ (broken-link check)
 *   2. No leaked runtime error strings made it into rendered markup
 *   3. Every <loc> in the sitemap maps to a real dist/ file
 *
 * Run after `npm run build`:
 *   node scripts/verify-build.mjs
 *
 * Exit code is non-zero only on error-leak findings (real rendering bugs).
 * Broken internal links are reported but do not fail the run, because this
 * project currently has a known gap: many pages only exist in German (see
 * "Routing & Localization" in CLAUDE.md). Use the report to track that gap
 * down, not as a hard gate, until it's closed.
 */
import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const BASE = '/lernen-mit-geschichten';

function walk(dir) {
  let out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) out = out.concat(walk(full));
    else out.push(full);
  }
  return out;
}

if (!existsSync(DIST)) {
  console.error(`${DIST}/ not found — run "npm run build" first.`);
  process.exit(2);
}

const allFiles = walk(DIST);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));

function resolves(urlPath) {
  urlPath = urlPath.split('#')[0].split('?')[0];
  if (!urlPath.startsWith(BASE)) return 'not-base';
  let rel = urlPath.slice(BASE.length) || '/';
  const candidate = join(DIST, rel);
  if (existsSync(candidate)) {
    const st = statSync(candidate);
    return st.isDirectory() ? existsSync(join(candidate, 'index.html')) : true;
  }
  if (existsSync(join(DIST, rel, 'index.html'))) return true;
  if (existsSync(candidate + '.html')) return true;
  return false;
}

const hrefRe = /(?:href|src)="([^"]+)"/g;
const brokenLinks = [];
const errorLeaks = [];
// Deliberately narrow — broad patterns like "}}" false-positive on legit
// inline JS/CSS. Only flag strings that are unambiguous rendering failures.
const ERROR_PATTERNS = [
  'Cannot read propert',
  '[object Object]',
  'ReferenceError',
  'is not a function',
  'is not defined',
  'undefined is not',
];

let internalLinkCount = 0;
let externalSkipped = 0;

for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf8');

  for (const pat of ERROR_PATTERNS) {
    if (html.includes(pat)) errorLeaks.push({ file, pat });
  }

  let m;
  hrefRe.lastIndex = 0;
  while ((m = hrefRe.exec(html))) {
    const url = m[1];
    if (
      url.startsWith('http') ||
      url.startsWith('//') ||
      url.startsWith('mailto:') ||
      url.startsWith('data:') ||
      url.startsWith('#')
    ) {
      externalSkipped++;
      continue;
    }
    if (!url.startsWith(BASE)) {
      if (url.startsWith('/')) brokenLinks.push({ file, url, reason: 'missing base prefix' });
      continue;
    }
    internalLinkCount++;
    if (!resolves(url)) brokenLinks.push({ file, url, reason: 'target missing' });
  }
}

console.log(`HTML files checked: ${htmlFiles.length}`);
console.log(`Internal links checked: ${internalLinkCount} (external/skipped: ${externalSkipped})`);
console.log(`Broken links: ${brokenLinks.length}`);
for (const b of brokenLinks) console.log(`  [${b.reason}] ${b.file} -> ${b.url}`);

console.log(`Error-leak strings found: ${errorLeaks.length}`);
for (const e of errorLeaks) console.log(`  ${e.file}: "${e.pat}"`);

const sitemapFile = join(DIST, 'sitemap-0.xml');
if (existsSync(sitemapFile)) {
  const xml = readFileSync(sitemapFile, 'utf8');
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  let missing = 0;
  for (const loc of locs) {
    const u = new URL(loc);
    if (!resolves(u.pathname)) {
      missing++;
      console.log(`  [sitemap missing] ${loc}`);
    }
  }
  console.log(`Sitemap URLs: ${locs.length}, missing targets: ${missing}`);
} else {
  console.log('No sitemap-0.xml found.');
}

process.exitCode = errorLeaks.length > 0 ? 1 : 0;
