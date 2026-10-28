#!/usr/bin/env node
/**
 * Writes the moderators' guide (<preview>/guide/) and the art-prep page (<preview>/art/), English at the folder,
 * Arabic at ar/, German at de/. Preview only, like preview-status.mjs: production never runs this.
 * The art-prep page only shrinks pictures, entirely in the browser (canvas to WebP, a stored ZIP); nothing is uploaded anywhere. Where the
 * browser cannot write WebP (Safari, so every browser on iPad and iPhone) it loads the vendored libwebp in scripts/vendor/webp.
 * Usage: moderator-pages.mjs <preview dir>     CMS_URL in the environment links the CMS; no address is in source.
 */
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultOptions as WEBP } from './vendor/webp/meta.js';
import { GUIDE, ART } from './moderator-messages.mjs';

const [preview] = process.argv.slice(2);
const LANGS = ['de', 'ar', 'en'];
const ROOT = 'en';
const folderOf = lang => (lang === ROOT ? '' : `${lang}/`);
const NAMES = { de: 'Deutsch', ar: 'العربية', en: 'English' };
const cms = process.env.CMS_URL?.trim();
// Mirrors the publishing gate: without STRICT_PUBLISHING a review is advice, so the guide says so.
const strictPublishing = ['1', 'true'].includes(process.env.STRICT_PUBLISHING ?? '');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const STYLE = `body{font:18px/1.55 system-ui,sans-serif;max-width:46rem;margin:1.5rem auto;padding:0 1rem;color:#24212e;background:#fbf5ea}
h1{font-size:1.6rem}h2{font-size:1.2rem;margin:1.8rem 0 .4rem}li{margin:.35rem 0}code{background:#fff;padding:0 .25rem;border-radius:4px}
a{color:#0b6b62}nav{margin-bottom:1rem}button,input,select,.btn{font:inherit;min-height:44px}`;

function shell(lang, title, body, script = '') {
  const ui = GUIDE[lang];
  const here = folderOf(lang);
  const switcher = LANGS.map(l =>
    l === lang ? `<strong>${NAMES[l]}</strong>` : `<a href="${lang === ROOT ? '' : '../'}${folderOf(l)}" lang="${l}">${NAMES[l]}</a>`
  ).join(' · ');
  return `<!doctype html>
<html lang="${lang}" dir="${ui.dir}" data-here="${here}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex"><title>${esc(title)}</title><style>${STYLE}</style></head>
<body><main><nav aria-label="Language">${switcher}</nav>${body}</main>${script}</body></html>
`;
}

function guide(lang) {
  const ui = GUIDE[lang];
  const up = lang === ROOT ? '../' : '../../';
  const l = folderOf(lang);
  const cmsLink = cms ? `<a href="${esc(cms)}">${esc(cms.replace(/^https?:\/\//, ''))}</a>` : esc(ui.cmsFallback);
  const fill = s => s.replaceAll('{up}', up).replaceAll('{l}', l).replaceAll('{cms}', cmsLink);
  const toc = ui.sections.map(([h], i) => `<li><a href="#s${i + 1}">${h}</a></li>`).join('');
  const body = ui.sections
    .map(([h, items], i) => {
      // Section 5 is "Reviewing and signing".
      const note = i === 4 && !strictPublishing ? `<p><strong>${ui.reviewOptional}</strong></p>` : '';
      return `<h2 id="s${i + 1}">${i + 1}. ${h}</h2>${note}<ul>${items.map(x => `<li>${fill(x)}</li>`).join('')}</ul>`;
    })
    .join('');
  return shell(lang, ui.title, `<h1>${ui.title}</h1><p>${ui.intro}</p><ol>${toc}</ol>${body}`);
}

function art(lang) {
  const ui = ART[lang];
  const body = `<h1>${ui.title}</h1><p>${ui.intro}</p>
<p><label class="drop" id="drop">${ui.choose}<input id="files" type="file" accept="image/*" multiple></label></p>
<ol id="list"></ol>
<p id="nowebp" role="alert" hidden>${ui.noWebp}</p>
<p><button id="zip" type="button" hidden>${ui.downloadAll}</button></p>
<p>${ui.next} <a href="../${lang === ROOT ? '' : '../'}guide/${folderOf(lang)}#s3">${ui.guide}</a></p>
<style>.drop{display:block;padding:2rem 1rem;border:2px dashed #24212e;border-radius:12px;text-align:center;cursor:pointer;background:#fff}
.drop.over{background:#e6f4f1}.drop input{display:block;margin:.8rem auto 0}#list li{margin:.8rem 0;padding:.6rem;background:#fff;border-radius:10px}
#list img{max-width:8rem;max-height:6rem;vertical-align:middle;border-radius:6px}.name{direction:ltr;unicode-bidi:isolate;font-family:monospace}</style>`;
  // Runs in the moderator's browser. Kept dependency-free: a stored (uncompressed) ZIP needs only CRC-32,
  // and WebP is already compressed. Names carry no meaning: the CMS fields decide cover and pages, and the CMS
  // adds -1, -2 when a name is already taken.
  const script = `<script>
const WEBP = ${JSON.stringify(WEBP)}, ENCODER = '${lang === ROOT ? '' : '../'}webp/webp_enc.js';
const S = ${JSON.stringify(ui)};
const MAX = 1200, MAX_BYTES = 120 * 1024;
const $ = id => document.getElementById(id);
let items = [];
const slug = n => n.replace(/\\.[^.]*$/, '').normalize('NFKD').replace(/[\\u0300-\\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'picture';

function unique(base) {
  const taken = new Set(items.map(i => i.name));
  let name = base + '.webp', n = 1;
  while (taken.has(name)) name = base + '-' + n++ + '.webp';
  return name;
}

function render() {
  $('list').replaceChildren(...items.map(it => {
    const li = document.createElement('li');
    const img = document.createElement('img'); img.src = it.url; img.alt = '';
    const label = document.createElement('span'); label.className = 'name'; label.textContent = ' ' + it.name + ' ';
    li.append(img, label);
    if (it.out) {
      const a = document.createElement('a'); a.href = URL.createObjectURL(it.out); a.download = it.name;
      a.textContent = S.download + ' (' + Math.round(it.out.size / 1024) + ' KB)';
      li.append(a);
    } else li.append(S.working);
    return li;
  }));
  $('zip').hidden = !items.length || items.some(i => !i.out);
}

// Safari asked for WebP silently returns PNG, so after the first such answer every picture goes through libwebp.
let wasm = null;
async function webp(c, q) {
  if (!wasm) {
    const blob = await new Promise(r => c.toBlob(r, 'image/webp', q));
    if (blob && blob.type === 'image/webp') return blob;
    wasm = import(ENCODER).then(m => m.default({ noInitialRun: true }));
  }
  const out = (await wasm).encode(c.getContext('2d').getImageData(0, 0, c.width, c.height).data, c.width, c.height, { ...WEBP, quality: q * 100 });
  if (!out) throw new Error('WebP encoding failed');
  return new Blob([out], { type: 'image/webp' });
}

// Fits inside MAX × MAX whatever the shape, never enlarges, and steps the quality down until it meets the budget.
async function shrink(it) {
  const bmp = await createImageBitmap(it.file);
  const k = Math.min(1, MAX / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  for (const q of [0.85, 0.78, 0.7, 0.62, 0.55, 0.48, 0.4]) {
    it.out = await webp(c, q);
    if (it.out.size <= MAX_BYTES) break;
  }
}

async function add(files) {
  const fresh = [...files].filter(f => f.type.startsWith('image/')).map(f => ({ file: f, url: URL.createObjectURL(f), out: null }));
  for (const it of fresh) { it.name = unique(slug(it.file.name)); items.push(it); }
  render();
  for (const it of fresh) {
    try { await shrink(it); } catch (e) { $('nowebp').hidden = false; return; }
    render();
  }
}

const CRC = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc32 = b => { let c = ~0; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return ~c >>> 0; };
async function zip() {
  const enc = new TextEncoder(), parts = [], dir = [];
  let offset = 0;
  for (const it of items) {
    const data = new Uint8Array(await it.out.arrayBuffer()), fname = enc.encode(it.name), crc = crc32(data);
    const head = new DataView(new ArrayBuffer(30));
    [[0, 0x04034b50, 4], [4, 20, 2], [8, 0, 2], [14, crc, 4], [18, data.length, 4], [22, data.length, 4], [26, fname.length, 2]]
      .forEach(([o, v, n]) => n === 4 ? head.setUint32(o, v, true) : head.setUint16(o, v, true));
    const cen = new DataView(new ArrayBuffer(46));
    [[0, 0x02014b50, 4], [4, 20, 2], [6, 20, 2], [16, crc, 4], [20, data.length, 4], [24, data.length, 4], [28, fname.length, 2], [42, offset, 4]]
      .forEach(([o, v, n]) => n === 4 ? cen.setUint32(o, v, true) : cen.setUint16(o, v, true));
    parts.push(head, fname, data); dir.push(cen, fname);
    offset += 30 + fname.length + data.length;
  }
  const size = dir.reduce((n, p) => n + p.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  [[0, 0x06054b50, 4], [8, items.length, 2], [10, items.length, 2], [12, size, 4], [16, offset, 4]]
    .forEach(([o, v, n]) => n === 4 ? end.setUint32(o, v, true) : end.setUint16(o, v, true));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([...parts, ...dir, end], { type: 'application/zip' }));
  a.download = S.zipName + '.zip';
  a.click();
}

$('files').onchange = e => { add(e.target.files); e.target.value = ''; };
const drop = $('drop');
drop.ondragover = e => { e.preventDefault(); drop.classList.add('over'); };
drop.ondragleave = () => drop.classList.remove('over');
drop.ondrop = e => { e.preventDefault(); drop.classList.remove('over'); add(e.dataTransfer.files); };
$('zip').onclick = zip;
</script>`;
  return shell(lang, ui.title, body, script);
}

const vendor = fileURLToPath(new URL('./vendor/webp/', import.meta.url));
mkdirSync(join(preview, 'art', 'webp'), { recursive: true });
for (const f of ['webp_enc.js', 'webp_enc.wasm', 'LICENSE', 'LICENSE.codec.md']) copyFileSync(join(vendor, f), join(preview, 'art', 'webp', f));
for (const lang of LANGS) {
  for (const [folder, make] of [['guide', guide], ['art', art]]) {
    const dir = join(preview, folder, lang === ROOT ? '' : lang);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), make(lang));
  }
}
