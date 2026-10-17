// One-off, idempotent: lifts `band` into story-meta and drops fields the new schema removed.
// Works on frontmatter lines so no value or body is ever rewritten.
import fs from 'node:fs';
import path from 'node:path';

const root = 'src/content/stories';
const metaDir = 'src/content/story-meta';
const dropped = /^(titleAr|titleEn|titleTr|titleUr|languages|storyFormat|estimatedReadTime|provider|providerUrl|characterType|band):/;
const bands = new Map();

for (const locale of fs.readdirSync(root)) {
  for (const file of fs.readdirSync(path.join(root, locale))) {
    const p = path.join(root, locale, file);
    const text = fs.readFileSync(p, 'utf8');
    const end = text.indexOf('\n---', 4);
    const head = text.slice(0, end).split('\n');
    const id = head.find(l => l.startsWith('storyId:'))?.split(':')[1].trim().replace(/"/g, '');
    const band = head.find(l => l.startsWith('band:'))?.split(':')[1].trim();
    if (band) {
      const prev = bands.get(id);
      if (prev && prev !== band) console.warn(`band differs across locales for ${id}: ${prev} vs ${band}`);
      bands.set(id, prev ?? band);
    }
    const kept = head.filter(l => !dropped.test(l));
    if (kept.length !== head.length) fs.writeFileSync(p, kept.join('\n') + text.slice(end));
  }
}

fs.mkdirSync(metaDir, { recursive: true });
for (const [id, band] of bands) {
  const p = path.join(metaDir, `${id}.yaml`);
  if (!fs.existsSync(p)) fs.writeFileSync(p, `storyId: ${id}\nband: ${band}\n`);
}
console.log(`story-meta: ${bands.size} stories`);
