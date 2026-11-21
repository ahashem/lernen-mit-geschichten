import { describe, expect, it } from 'vitest';
import { imposition } from './booklet-imposition';

describe('imposition', () => {
  it('lays out 8 pages on two sheets for a left-to-right book', () => {
    expect(imposition(8, false)).toEqual([
      { front: [7, 0], back: [1, 6] },
      { front: [5, 2], back: [3, 4] },
    ]);
  });

  it('mirrors each side for a right-to-left book', () => {
    expect(imposition(8, true)).toEqual([
      { front: [0, 7], back: [6, 1] },
      { front: [2, 5], back: [4, 3] },
    ]);
  });

  it('pads with blanks at the end so the count is a multiple of four', () => {
    expect(imposition(6, false)).toEqual([
      { front: [null, 0], back: [1, null] },
      { front: [5, 2], back: [3, 4] },
    ]);
  });

  it('uses every page exactly once', () => {
    const used = imposition(13, false)
      .flatMap(s => [...s.front, ...s.back])
      .filter((p): p is number => p !== null)
      .sort((a, b) => a - b);
    expect(used).toEqual([...Array(13).keys()]);
  });

  it('still makes one sheet for a single page', () => {
    expect(imposition(1, false)).toEqual([{ front: [null, 0], back: [null, null] }]);
  });
});
