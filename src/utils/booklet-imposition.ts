/**
 * Page order for a saddle-stitched booklet: A5 pages printed two to an A4 landscape sheet, both sides (flip on the
 * short edge), then folded in the middle and stapled. Pages are 0-based reading order; null is a blank page that pads
 * the count to a multiple of four.
 *
 * For 8 pages, left-to-right: sheet 1 front [7, 0], back [1, 6]; sheet 2 front [5, 2], back [3, 4]. A right-to-left
 * book opens the other way, so each side is mirrored: front [0, 7], back [6, 1].
 */
export interface BookletSheet {
  front: [number | null, number | null];
  back: [number | null, number | null];
}

export function imposition(pageCount: number, rtl: boolean): BookletSheet[] {
  const total = Math.max(4, Math.ceil(pageCount / 4) * 4);
  const page = (i: number) => (i < pageCount ? i : null);
  const sheets: BookletSheet[] = [];
  for (let i = 0; i < total / 4; i++) {
    const outerFront = page(total - 1 - 2 * i);
    const innerFront = page(2 * i);
    const innerBack = page(2 * i + 1);
    const outerBack = page(total - 2 - 2 * i);
    sheets.push(
      rtl
        ? { front: [innerFront, outerFront], back: [outerBack, innerBack] }
        : { front: [outerFront, innerFront], back: [innerBack, outerBack] }
    );
  }
  return sheets;
}
