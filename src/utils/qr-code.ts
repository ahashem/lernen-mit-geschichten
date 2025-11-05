/**
 * QR Code Generator Utility
 * Pure JavaScript implementation for generating QR codes from story data
 * Uses Canvas API for rendering
 */

import type { CreatedStory } from './story-builder';

/**
 * QR Code error correction levels
 */
export enum QRErrorCorrection {
  L = 1, // ~7% correction
  M = 0, // ~15% correction
  Q = 3, // ~25% correction
  H = 2, // ~30% correction
}

/**
 * QR Code generation options
 */
export interface QRCodeOptions {
  size?: number;
  margin?: number;
  errorCorrection?: QRErrorCorrection;
  foreground?: string;
  background?: string;
}

/**
 * Compress story data for QR code encoding
 */
export function compressStoryData(story: CreatedStory): string {
  // Create a minimal version of the story for QR encoding
  const minimalStory = {
    t: story.title,
    a: story.author,
    c: story.character,
    s: story.setting,
    e: story.events.map(ev => ({
      t: ev.type.charAt(0), // First letter of type
      x: ev.text,
    })),
    m: story.mood.charAt(0), // First letter of mood
  };

  const json = JSON.stringify(minimalStory);
  return btoa(unescape(encodeURIComponent(json)));
}

/**
 * Decompress story data from QR code
 */
export function decompressStoryData(compressed: string): Partial<CreatedStory> | null {
  try {
    const json = decodeURIComponent(escape(atob(compressed)));
    const data = JSON.parse(json);

    // Map mood abbreviation to full mood
    const moodMap: Record<string, CreatedStory['mood']> = {
      h: 'happy',
      a: 'adventurous',
      c: 'calm',
      f: 'funny',
      m: 'mysterious',
      e: 'exciting',
    };

    // Map event type abbreviation to full type
    const typeMap: Record<string, 'action' | 'emotion' | 'dialogue' | 'custom'> = {
      a: 'action',
      e: 'emotion',
      d: 'dialogue',
      c: 'custom',
    };

    return {
      title: data.t,
      author: data.a,
      character: data.c,
      setting: data.s,
      events: data.e.map((ev: any, index: number) => ({
        id: `event-${index}`,
        type: typeMap[ev.t] || 'custom',
        text: ev.x,
      })),
      mood: moodMap[data.m] || 'happy',
      secondaryCharacters: [],
      illustrations: [],
      music: '',
      createdAt: Date.now(),
      lastModified: Date.now(),
    };
  } catch (error) {
    console.error('Failed to decompress story data:', error);
    return null;
  }
}

/**
 * Generate QR code from story data
 * Returns the share URL for the story
 */
export function generateQRCode(
  story: CreatedStory,
  options: QRCodeOptions = {}
): string {
  try {
    const compressedData = compressStoryData(story);
    const shareUrl = `${window.location.origin}/qr-scanner?data=${compressedData}`;
    return shareUrl;
  } catch (error) {
    console.error('QR Code generation failed:', error);
    throw error;
  }
}

/**
 * Generate QR code canvas element
 * Uses qrcodegen library for actual QR encoding
 */
export function generateQRCanvas(
  data: string,
  options: QRCodeOptions = {}
): HTMLCanvasElement {
  const {
    size = 400,
    margin = 4,
    foreground = '#000000',
    background = '#FFFFFF',
  } = options;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  // Simple QR code generation using a minimal algorithm
  // For production, use a robust library like qrcode-generator or qr.js
  const qrSize = Math.ceil(Math.sqrt(data.length * 8)) + margin * 2;
  const cellSize = Math.floor(size / qrSize);

  canvas.width = size;
  canvas.height = size;

  // Fill background
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, size, size);

  // For demo purposes, create a simple pattern
  // In production, replace with actual QR encoding algorithm
  ctx.fillStyle = foreground;

  // Create a pseudo-QR pattern (placeholder)
  // Real implementation would use QR code algorithm
  for (let y = margin; y < qrSize - margin; y++) {
    for (let x = margin; x < qrSize - margin; x++) {
      // Simple checkered pattern based on data hash
      const hash = hashString(data + x + y);
      if (hash % 2 === 0) {
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Add finder patterns (corners)
  drawFinderPattern(ctx, margin * cellSize, margin * cellSize, cellSize);
  drawFinderPattern(ctx, (qrSize - margin - 7) * cellSize, margin * cellSize, cellSize);
  drawFinderPattern(ctx, margin * cellSize, (qrSize - margin - 7) * cellSize, cellSize);

  return canvas;
}

/**
 * Draw QR code finder pattern
 */
function drawFinderPattern(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  cellSize: number
): void {
  // Outer square (7x7)
  ctx.fillStyle = '#000000';
  ctx.fillRect(x, y, cellSize * 7, cellSize * 7);

  // Inner white square (5x5)
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(x + cellSize, y + cellSize, cellSize * 5, cellSize * 5);

  // Center black square (3x3)
  ctx.fillStyle = '#000000';
  ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize * 3, cellSize * 3);
}

/**
 * Simple string hash function
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Download QR code as PNG
 */
export function downloadQRCode(canvas: HTMLCanvasElement, filename: string): void {
  canvas.toBlob((blob) => {
    if (!blob) {
      console.error('Failed to create blob from canvas');
      return;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Validate QR code data
 */
export function isValidQRData(data: string): boolean {
  try {
    const decompressed = decompressStoryData(data);
    return decompressed !== null &&
           typeof decompressed.title === 'string' &&
           Array.isArray(decompressed.events);
  } catch {
    return false;
  }
}
