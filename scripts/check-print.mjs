#!/usr/bin/env node
/**
 * Prints every folio in dist/ the way Chromium would and reports any sheet content wider than an A4 page.
 *
 *   SITE_URL=https://example.com npm run build && node scripts/check-print.mjs
 *
 * One wide line (a stray code block, a long unbroken word) used to widen every sheet, and in Arabic and Urdu the
 * overflow is cut off on the left, where the story numbers sit. It also checks that the screen's theme (Lamp, high
 * contrast) never reaches the paper. Needs Playwright with Chromium, which CI does not
 * install, so this is a local check; without Playwright it says so and exits 0.
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { createRequire } from 'node:module';

const DIST = 'dist';
if (!existsSync(DIST)) {
  console.error('dist/ not found: build first.');
  process.exit(2);
}

let chromium;
try {
  ({ chromium } = createRequire(import.meta.url)('playwright'));
} catch {
  console.log('Playwright is not installed here; skipping the print check.');
  process.exit(0);
}

const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp', '.png': 'image/png' };
// Serve dist/ at the root and also under whatever base the build used, so a subpath build resolves its assets.
const server = createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  for (;;) {
    const file = normalize(join(DIST, path));
    const target = existsSync(file) && statSync(file).isDirectory() ? join(file, 'index.html') : file;
    if (existsSync(target)) {
      res.writeHead(200, { 'content-type': TYPES[extname(target)] ?? 'application/octet-stream' });
      return res.end(readFileSync(target));
    }
    const next = path.replace(/^\/[^/]+/, '');
    if (next === path || !next) break;
    path = next;
  }
  res.writeHead(404).end();
});
await new Promise(r => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const folios = ['folio', ...readdirSync(DIST).filter(d => existsSync(join(DIST, d, 'folio/index.html'))).map(d => `${d}/folio`)];
const browser = await chromium.launch();
// A4 minus the folio's 12 mm side margins, at 96 px per inch.
const page = await browser.newPage({ viewport: { width: Math.round(((210 - 24) / 25.4) * 96), height: 1000 } });
await page.emulateMedia({ media: 'print' });
let failures = 0;
for (const path of folios) {
  if (!existsSync(join(DIST, path, 'index.html'))) continue;
  await page.goto(`${origin}/${path}/`, { waitUntil: 'load' });
  const wide = await page.evaluate(() => {
    const sheets = document.querySelector('.sheets');
    if (!sheets) return [];
    const limit = document.documentElement.clientWidth + 1;
    const all = [...sheets.querySelectorAll('*')];
    if (sheets.getBoundingClientRect().width <= limit && all.every(e => e.getBoundingClientRect().width <= limit)) return [];
    // Name the cause: content wider than its own box once the sheets are held to the page width.
    sheets.style.inlineSize = `${limit - 1}px`;
    const causes = all.filter(e => e.clientWidth > 0 && e.scrollWidth > e.clientWidth + 1);
    return (causes.length ? causes : [sheets])
      .slice(0, 3)
      .map(e => `${e.tagName.toLowerCase()} "${(e.textContent ?? '').trim().slice(0, 50)}"`);
  });
  if (wide.length) {
    failures++;
    console.log(`✗ /${path}/ is wider than A4:\n    ${wide.join('\n    ')}`);
  } else console.log(`✓ /${path}/`);
}
// Paper does not change with the screen's theme: every colour on the sheets must be the same in Lamp and the
// high-contrast themes as in the default one.
const THEMES = ['lamp', 'hc-light', 'hc-dark'];
const colours = () =>
  [...document.querySelectorAll('.sheets *')]
    .slice(0, 400)
    .map(e => {
      const cs = getComputedStyle(e);
      return `${cs.color}|${cs.backgroundColor}|${cs.borderTopColor}|${cs.fill}`;
    })
    .join(';');
await page.goto(`${origin}/folio/`, { waitUntil: 'load' });
const plain = await page.evaluate(colours);
for (const theme of THEMES) {
  await page.evaluate(t => (document.documentElement.dataset.theme = t), theme);
  if ((await page.evaluate(colours)) !== plain) {
    failures++;
    console.log(`✗ the printed folio changes colour in the ${theme} theme`);
  } else console.log(`✓ the ${theme} theme leaves the print alone`);
}
await browser.close();
server.close();
process.exit(failures ? 1 : 0);
