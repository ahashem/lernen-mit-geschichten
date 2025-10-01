/**
 * Booklet Export Utility
 *
 * Generates print-ready PDF booklets with proper page imposition
 * Supports both LTR and RTL languages with correct binding orientation
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export type BookletOrientation = 'ltr' | 'rtl';
export type PageSize = 'a5' | 'a4';

interface BookletOptions {
  orientation: BookletOrientation;
  pageSize?: PageSize;
  title?: string;
  addCover?: boolean;
  addPageNumbers?: boolean;
}

interface PageDimensions {
  width: number;
  height: number;
  unit: 'mm' | 'pt';
}

/**
 * Get page dimensions for different sizes
 */
function getPageDimensions(size: PageSize): PageDimensions {
  const dimensions = {
    a5: { width: 148, height: 210, unit: 'mm' as const },
    a4: { width: 210, height: 297, unit: 'mm' as const },
  };
  return dimensions[size];
}

/**
 * Calculate booklet page order (imposition)
 * For saddle-stitch binding, pages must be arranged as:
 * - Sheet 1: [n, 1, 2, n-1]
 * - Sheet 2: [n-2, 3, 4, n-3]
 * - etc.
 */
function calculateImposition(totalPages: number, isRTL: boolean): number[][] {
  // Ensure we have a multiple of 4 pages
  const pagesNeeded = Math.ceil(totalPages / 4) * 4;
  const blankPages = pagesNeeded - totalPages;

  // Create page array (1-indexed)
  const pages: (number | null)[] = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Add blank pages at the end
  for (let i = 0; i < blankPages; i++) {
    pages.push(null);
  }

  const sheets: number[][] = [];
  const numSheets = pagesNeeded / 4;

  for (let i = 0; i < numSheets; i++) {
    const frontLeft = pagesNeeded - (i * 2);
    const frontRight = (i * 2) + 1;
    const backLeft = (i * 2) + 2;
    const backRight = pagesNeeded - (i * 2) - 1;

    if (isRTL) {
      // RTL: Flip the order for right-to-left reading
      sheets.push([
        frontRight, frontLeft,  // Front of sheet (swapped)
        backRight, backLeft     // Back of sheet (swapped)
      ]);
    } else {
      // LTR: Standard left-to-right order
      sheets.push([
        frontLeft, frontRight,  // Front of sheet
        backLeft, backRight     // Back of sheet
      ]);
    }
  }

  return sheets;
}

/**
 * Capture HTML element as image
 */
async function captureElement(element: HTMLElement): Promise<HTMLCanvasElement> {
  return await html2canvas(element, {
    scale: 2, // Higher quality
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
    removeContainer: false,
  });
}

/**
 * Create a cover page
 */
function addCoverPage(
  pdf: jsPDF,
  title: string,
  dimensions: PageDimensions,
  isRTL: boolean
): void {
  const { width, height } = dimensions;
  const centerX = width / 2;
  const centerY = height / 2;

  // Set font
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');

  // Add title (centered)
  pdf.text(title, centerX, centerY - 20, {
    align: 'center',
    maxWidth: width - 40,
  });

  // Add subtitle
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text('Lernen mit Geschichten', centerX, centerY + 10, { align: 'center' });

  // Add decorative line
  pdf.setLineWidth(0.5);
  pdf.line(30, centerY - 5, width - 30, centerY - 5);
}

/**
 * Add page numbers
 */
function addPageNumber(
  pdf: jsPDF,
  pageNum: number | null,
  dimensions: PageDimensions,
  isRTL: boolean,
  position: 'left' | 'right'
): void {
  if (pageNum === null) return;

  const { width, height } = dimensions;
  const y = height - 10;
  const x = position === 'left' ? 10 : width - 10;

  pdf.setFontSize(9);
  pdf.setTextColor(100, 100, 100);
  pdf.text(pageNum.toString(), x, y, {
    align: position === 'left' ? 'left' : 'right',
  });
}

/**
 * Export story as booklet PDF
 */
export async function exportAsBooklet(
  storyElement: HTMLElement,
  options: BookletOptions
): Promise<void> {
  const {
    orientation,
    pageSize = 'a5',
    title = 'Story Booklet',
    addCover = false,
    addPageNumbers = true,
  } = options;

  const isRTL = orientation === 'rtl';
  const dimensions = getPageDimensions(pageSize);

  // Initialize PDF
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: dimensions.unit,
    format: [dimensions.width, dimensions.height],
  });

  // Add cover page if requested
  let startPage = 1;
  if (addCover) {
    addCoverPage(pdf, title, dimensions, isRTL);
    pdf.addPage();
    startPage = 2;
  }

  // Capture story content
  console.log('Capturing story content...');
  const canvas = await captureElement(storyElement);
  const imgData = canvas.toDataURL('image/png');

  // Calculate how many pages we need
  const pageHeight = dimensions.height - 30; // Leave margins
  const imgHeight = (canvas.height * dimensions.width) / canvas.width;
  const numPages = Math.ceil(imgHeight / pageHeight);

  console.log(`Story will span ${numPages} pages`);

  // Split content into pages
  const pages: string[] = [];
  for (let i = 0; i < numPages; i++) {
    // Create temporary canvas for this page
    const pageCanvas = document.createElement('canvas');
    pageCanvas.width = canvas.width;
    pageCanvas.height = (canvas.width * pageHeight) / dimensions.width;

    const ctx = pageCanvas.getContext('2d');
    if (!ctx) continue;

    // Draw slice of original canvas
    const sy = (i * pageCanvas.height);
    ctx.drawImage(
      canvas,
      0, sy, canvas.width, pageCanvas.height,
      0, 0, canvas.width, pageCanvas.height
    );

    pages.push(pageCanvas.toDataURL('image/png'));
  }

  // Calculate imposition
  const totalPages = addCover ? pages.length + 1 : pages.length;
  const sheets = calculateImposition(totalPages, isRTL);

  console.log('Booklet layout:', sheets);

  // Add pages in booklet order
  let isFirstPage = !addCover;

  for (let sheetIdx = 0; sheetIdx < sheets.length; sheetIdx++) {
    const sheet = sheets[sheetIdx];

    // Front of sheet (2 pages side by side)
    for (let i = 0; i < 2; i++) {
      const pageNum = sheet[i];

      if (!isFirstPage) {
        pdf.addPage();
      }
      isFirstPage = false;

      if (pageNum && pageNum <= pages.length) {
        // Add page content
        const pageIdx = addCover ? pageNum - 2 : pageNum - 1;
        if (pageIdx >= 0 && pageIdx < pages.length) {
          pdf.addImage(
            pages[pageIdx],
            'PNG',
            15, 15,
            dimensions.width - 30,
            dimensions.height - 30,
            undefined,
            'FAST'
          );
        }

        // Add page number
        if (addPageNumbers) {
          addPageNumber(pdf, pageNum, dimensions, isRTL, i === 0 ? 'left' : 'right');
        }
      }
    }

    // Back of sheet (2 pages side by side)
    for (let i = 2; i < 4; i++) {
      const pageNum = sheet[i];

      pdf.addPage();

      if (pageNum && pageNum <= pages.length) {
        // Add page content
        const pageIdx = addCover ? pageNum - 2 : pageNum - 1;
        if (pageIdx >= 0 && pageIdx < pages.length) {
          pdf.addImage(
            pages[pageIdx],
            'PNG',
            15, 15,
            dimensions.width - 30,
            dimensions.height - 30,
            undefined,
            'FAST'
          );
        }

        // Add page number
        if (addPageNumbers) {
          addPageNumber(pdf, pageNum, dimensions, isRTL, i === 2 ? 'left' : 'right');
        }
      }
    }
  }

  // Generate filename
  const filename = `${title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-booklet-${isRTL ? 'rtl' : 'ltr'}.pdf`;

  // Save PDF
  console.log('Saving PDF...');
  pdf.save(filename);
}

/**
 * Show loading indicator during export
 */
export function showExportProgress(message: string): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'export-overlay';
  overlay.innerHTML = `
    <div class="export-modal">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Hide loading indicator
 */
export function hideExportProgress(overlay: HTMLElement): void {
  overlay.remove();
}

/**
 * Detect language orientation from element
 */
export function detectOrientation(element: HTMLElement): BookletOrientation {
  const dir = element.getAttribute('dir') ||
               element.closest('[dir]')?.getAttribute('dir') ||
               document.documentElement.getAttribute('dir');
  return dir === 'rtl' ? 'rtl' : 'ltr';
}
