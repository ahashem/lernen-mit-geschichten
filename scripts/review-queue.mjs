// Reports the machine-drafted UI keys still waiting for a native reviewer, per locale.
import fs from 'node:fs';

const queue = JSON.parse(fs.readFileSync('src/locales/review-queue.json', 'utf8'));
for (const [locale, keys] of Object.entries(queue)) {
  console.log(`${locale}: ${keys.length} key(s) awaiting native review`);
  if (process.argv.includes('--keys')) for (const key of keys) console.log(`  ${key}`);
}
