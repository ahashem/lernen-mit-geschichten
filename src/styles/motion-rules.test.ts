import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Guards the motion principles in docs/roadmap/ux/04-motion-sound-interaction.md: paper physics (nothing tips,
 * wobbles or overshoots), motion only to explain place, and only transform and opacity animated.
 */

const SRC = join(import.meta.dirname, '..');

/** Every animation the site may play, and why it is allowed. Adding one is a design decision, not a CSS one. */
const KEYFRAMES: Record<string, string> = {
  pulse: 'the invitation pulse on the next arrow once narration ends, played once (04)',
  spin: 'the booklet export overlay, a grown-ups tool',
  bob: 'the "more text below" cue in the reader; it loops, which 04 rules out, and is kept until it is reworked',
};

/** What a transition may change: motion through transform and opacity, plus plain colour fades. */
const TRANSITIONABLE = new Set([
  'transform',
  'opacity',
  'color',
  'background',
  'background-color',
  'border-color',
  'outline-color',
  'none',
]);

interface Declaration {
  file: string;
  /** The selectors and at-rules this declaration sits in, outermost first. */
  context: string[];
  prop: string;
  value: string;
}

function sourceFiles(): string[] {
  return readdirSync(SRC, { recursive: true, encoding: 'utf8' })
    .filter(f => /\.(css|astro)$/.test(f))
    .map(f => join(SRC, f));
}

function stylesOf(file: string): string {
  const text = readFileSync(file, 'utf8');
  if (file.endsWith('.css')) return text;
  return [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
}

/** A small CSS walk: enough to know which rule a declaration is in. Quotes are skipped so data URIs stay whole. */
function declarations(file: string): Declaration[] {
  const css = stylesOf(file).replace(/\/\*[\s\S]*?\*\//g, '');
  const out: Declaration[] = [];
  const stack: string[] = [];
  let buf = '';
  let quote = '';
  let parens = 0;
  const flush = () => {
    const text = buf.trim();
    buf = '';
    const colon = text.indexOf(':');
    if (!text || colon < 0) return;
    out.push({
      file: relative(SRC, file),
      context: [...stack],
      prop: text.slice(0, colon).trim(),
      value: text.slice(colon + 1).trim(),
    });
  };
  for (const ch of css) {
    if (quote) {
      if (ch === quote) quote = '';
      buf += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
    } else if (ch === '(') {
      parens++;
      buf += ch;
    } else if (ch === ')') {
      parens--;
      buf += ch;
    } else if (ch === '{' && parens === 0) {
      stack.push(buf.trim());
      buf = '';
    } else if (ch === '}' && parens === 0) {
      flush();
      stack.pop();
    } else if (ch === ';' && parens === 0) {
      flush();
    } else {
      buf += ch;
    }
  }
  return out;
}

/** Splits a comma list at the top level, so commas inside cubic-bezier() stay put. */
function topLevelItems(value: string): string[] {
  const items: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ',' && depth === 0) {
      items.push(current.trim());
      current = '';
    } else current += ch;
  }
  items.push(current.trim());
  return items;
}

const all = sourceFiles().flatMap(declarations);
const where = (d: Declaration) =>
  `${d.file}: ${[...d.context, `${d.prop}: ${d.value}`].join(' › ')}`;

describe('motion rules (ux/04)', () => {
  it('reads the site styles', () => {
    expect(all.length).toBeGreaterThan(500);
  });

  it('plays only the animations that are allowed', () => {
    const names = new Set(
      sourceFiles().flatMap(f => [...stylesOf(f).matchAll(/@keyframes\s+([\w-]+)/g)].map(m => m[1]))
    );
    const unknown = [...names].filter(name => !(name in KEYFRAMES));
    expect(unknown, 'a new @keyframes needs a reason in KEYFRAMES').toEqual([]);
  });

  it('never animates, tips or scales anything on hover', () => {
    const offending = all.filter(d => {
      if (!d.context.some(c => c.includes(':hover'))) return false;
      if (/^animation(-name)?$/.test(d.prop)) return true;
      if (d.prop === 'rotate' || d.prop === 'scale') return true;
      return d.prop === 'transform' && /rotate|scale/.test(d.value);
    });
    expect(offending.map(where)).toEqual([]);
  });

  it('uses the overshoot easing nowhere', () => {
    // 04 keeps --ease-settle for the release of a selectable item. Nothing does that yet; add it here on purpose.
    const offending = all.filter(d => d.value.includes('--ease-settle'));
    expect(offending.map(where)).toEqual([]);
  });

  it('moves things only through transform and opacity', () => {
    const offending = all.filter(d => {
      if (d.prop !== 'transition' && d.prop !== 'transition-property') return false;
      return topLevelItems(d.value).some(item => {
        const property = item.split(/\s+/)[0];
        return !property.startsWith('var(') && !TRANSITIONABLE.has(property);
      });
    });
    expect(offending.map(where)).toEqual([]);
  });
});
