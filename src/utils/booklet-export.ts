/**
 * "Export as Booklet": a PDF to print on both sides (flip on the short edge), fold in the middle and staple into an
 * A5 picture book. Each A5 page is one storybook page (its picture above its text), laid out in a clean off-screen
 * box so no site style or scroll area can leak in, captured with html2canvas, and placed two to an A4 landscape
 * sheet in booklet order (see booklet-imposition.ts). Page 0 is a cover with the title and the cover picture.
 *
 * The libraries are heavy, so the story page imports this file only when a grown-up asks for the booklet.
 */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { imposition } from './booklet-imposition';

export interface BookletPage {
  /** The page's picture; a page without one is text only. */
  image?: string;
  paragraphs: string[];
}

export interface BookletInput {
  title: string;
  cover?: string;
  siteName: string;
  lang: string;
  rtl: boolean;
  pages: BookletPage[];
  /** File name without extension, e.g. the story's slug. */
  filename: string;
}

// A5 at CSS pixels (96 per inch), drawn at twice that for print sharpness.
const PAGE_W = 559;
const PAGE_H = 794;
const SCALE = 2;
const SHEET_W = 297;
const SHEET_H = 210;

function css(el: HTMLElement, styles: Partial<CSSStyleDeclaration>) {
  Object.assign(el.style, styles);
  return el;
}

function fonts() {
  const root = getComputedStyle(document.documentElement);
  return {
    read: root.getPropertyValue('--font-read').trim() || 'sans-serif',
    display: root.getPropertyValue('--font-display').trim() || 'sans-serif',
  };
}

async function picture(src: string, maxHeight: string): Promise<HTMLImageElement> {
  const img = css(document.createElement('img'), {
    display: 'block',
    inlineSize: '100%',
    maxBlockSize: maxHeight,
    objectFit: 'contain',
    flex: '0 1 auto',
    minBlockSize: '0',
  });
  img.src = src;
  img.alt = '';
  await img.decode().catch(() => undefined);
  return img;
}

function blankPage(input: BookletInput, family: string): HTMLElement {
  const page = css(document.createElement('div'), {
    position: 'relative',
    boxSizing: 'border-box',
    inlineSize: `${PAGE_W}px`,
    blockSize: `${PAGE_H}px`,
    padding: '36px 36px 52px',
    background: '#ffffff',
    color: '#111111',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    fontFamily: family,
    direction: input.rtl ? 'rtl' : 'ltr',
  });
  page.lang = input.lang;
  return page;
}

async function coverPage(input: BookletInput): Promise<HTMLElement> {
  const { read, display } = fonts();
  const page = blankPage(input, read);
  page.style.justifyContent = 'center';
  page.style.textAlign = 'center';
  const title = css(document.createElement('h1'), {
    margin: '0',
    fontFamily: display,
    fontSize: '34px',
    lineHeight: '1.2',
  });
  title.textContent = input.title;
  page.append(title);
  if (input.cover) page.append(await picture(input.cover, '62%'));
  const site = css(document.createElement('p'), {
    margin: '0',
    fontSize: '14px',
    color: '#555555',
  });
  site.textContent = input.siteName;
  page.append(site);
  return page;
}

async function storyPage(
  input: BookletInput,
  story: BookletPage,
  number: number
): Promise<HTMLElement> {
  const { read } = fonts();
  const page = blankPage(input, read);
  if (story.image) page.append(await picture(story.image, '56%'));
  const text = css(document.createElement('div'), {
    flex: '1 1 auto',
    minBlockSize: '0',
    overflow: 'hidden',
    fontSize: story.image ? '18px' : '21px',
    lineHeight: input.rtl ? '1.8' : '1.55',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: story.image ? 'flex-start' : 'center',
  });
  for (const paragraph of story.paragraphs) {
    const p = css(document.createElement('p'), { margin: '0 0 0.6em' });
    p.textContent = paragraph;
    text.append(p);
  }
  page.append(text);
  const folio = css(document.createElement('p'), {
    position: 'absolute',
    insetBlockEnd: '18px',
    insetInline: '0',
    margin: '0',
    textAlign: 'center',
    fontSize: '12px',
    color: '#777777',
  });
  folio.textContent = String(number);
  page.append(folio);
  return page;
}

/** Shrinks the text of a page until it fits, so a long page never loses its last lines. */
function fit(page: HTMLElement) {
  const text = page.querySelector<HTMLElement>('div');
  if (!text) return;
  let size = parseFloat(text.style.fontSize);
  while (text.scrollHeight > text.clientHeight + 1 && size > 11) {
    size -= 1;
    text.style.fontSize = `${size}px`;
  }
}

async function capture(page: HTMLElement, stage: HTMLElement): Promise<string> {
  stage.replaceChildren(page);
  fit(page);
  const canvas = await html2canvas(page, {
    scale: SCALE,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  });
  return canvas.toDataURL('image/jpeg', 0.9);
}

export async function exportAsBooklet(input: BookletInput): Promise<void> {
  await document.fonts.ready;
  // On screen but out of view: html2canvas needs real layout, and a hidden box has none.
  const stage = css(document.createElement('div'), {
    position: 'fixed',
    insetBlockStart: '0',
    insetInlineStart: '-10000px',
    pointerEvents: 'none',
  });
  stage.setAttribute('aria-hidden', 'true');
  document.body.append(stage);
  try {
    const images: string[] = [await capture(await coverPage(input), stage)];
    for (const [i, story] of input.pages.entries()) {
      images.push(await capture(await storyPage(input, story, i + 1), stage));
    }

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const half = SHEET_W / 2;
    const place = (index: number | null, x: number) => {
      if (index !== null)
        pdf.addImage(images[index], 'JPEG', x, 0, half, SHEET_H, undefined, 'FAST');
    };
    // A short tick at the top and bottom of the fold shows where to fold and staple.
    const foldMarks = () => {
      pdf.setDrawColor(170);
      pdf.setLineWidth(0.2);
      pdf.line(half, 0, half, 4);
      pdf.line(half, SHEET_H - 4, half, SHEET_H);
    };
    imposition(images.length, input.rtl).forEach((sheet, i) => {
      for (const [side, [left, right]] of [sheet.front, sheet.back].entries()) {
        if (i > 0 || side > 0) pdf.addPage('a4', 'landscape');
        place(left, 0);
        place(right, half);
        foldMarks();
      }
    });
    pdf.save(`${input.filename}-booklet.pdf`);
  } finally {
    stage.remove();
  }
}

/** A small overlay while the booklet is made; it can take a few seconds on a phone. */
export function showExportProgress(message: string): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'export-overlay';
  overlay.setAttribute('role', 'status');
  const modal = document.createElement('div');
  modal.className = 'export-modal';
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  const text = document.createElement('p');
  text.textContent = message;
  modal.append(spinner, text);
  overlay.append(modal);
  document.body.appendChild(overlay);
  return overlay;
}

export function hideExportProgress(overlay: HTMLElement): void {
  overlay.remove();
}
