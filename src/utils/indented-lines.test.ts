import { describe, expect, it } from 'vitest';
// @ts-expect-error: a plain .mjs script without type declarations
import { indentedLines } from '../../scripts/readiness.mjs';

describe('indentedLines', () => {
  it('finds a tab-indented line after a blank line, which Markdown renders as code', () => {
    expect(indentedLines('Erst ein Satz.\n\n\t•\tBlau für Lernen\n')).toEqual([
      '•\tBlau für Lernen',
    ]);
  });

  it('finds four leading spaces too', () => {
    expect(indentedLines('    Ein Satz')).toEqual(['Ein Satz']);
  });

  it('ignores an indented line that continues a paragraph or list', () => {
    expect(indentedLines('- Punkt\n    weiter\n')).toEqual([]);
  });

  it('ignores lines inside a fenced block', () => {
    expect(indentedLines('```\n\n    code\n```\n')).toEqual([]);
  });
});
