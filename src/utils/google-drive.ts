/**
 * Google Drive Integration Utility
 *
 * Fetches and converts Google Docs to story format.
 * Supports both authenticated (service account) and public access modes.
 */

import type { Locale } from './i18n';

export interface GoogleDriveConfig {
  apiKey?: string; // Public read-only API key (optional)
  credentialsJson?: string; // Service account credentials JSON
  folderId?: string; // Source folder for stories
  approvedDocIds?: string[]; // Whitelist of doc IDs
  cacheDuration?: number; // In milliseconds
  exportFormat?: 'markdown' | 'html';
}

export interface FetchedStory {
  id: string;
  title: string;
  content: string; // Markdown
  images: { url: string; alt: string; driveId?: string }[];
  questions: QuizQuestion[];
  metadata: {
    language: Locale;
    skills: string[];
    author?: string;
    lastModified: number;
    emoji?: string;
    characterType?: string;
    difficulty?: 'beginner' | 'intermediate';
    estimatedReadTime?: number;
  };
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'truefalse' | 'multiplechoice' | 'fillinblank';
  correctAnswer: string | string[];
  options?: string[];
}

export interface CachedStory {
  story: FetchedStory;
  cachedAt: number;
  expiresAt: number;
}

export interface GoogleDocMetadata {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
  webViewLink: string;
  thumbnailLink?: string;
  description?: string;
}

/**
 * Google Drive API Client
 */
export class GoogleDriveClient {
  private config: GoogleDriveConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: GoogleDriveConfig) {
    this.config = {
      cacheDuration: 6 * 60 * 60 * 1000, // 6 hours default
      exportFormat: 'html', // HTML is easier to parse than markdown export
      ...config,
    };
  }

  /**
   * Get OAuth access token from service account credentials
   */
  private async getAccessToken(): Promise<string> {
    // Check if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    if (!this.config.credentialsJson) {
      throw new Error('Service account credentials not configured');
    }

    try {
      const credentials = JSON.parse(this.config.credentialsJson);

      // Create JWT for service account
      const jwt = await this.createJWT(credentials);

      // Exchange JWT for access token
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: jwt,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get access token: ${response.statusText}`);
      }

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Expire 1 min early

      return this.accessToken;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw new Error('Failed to authenticate with Google Drive');
    }
  }

  /**
   * Create JWT for service account authentication
   */
  private async createJWT(credentials: any): Promise<string> {
    const header = {
      alg: 'RS256',
      typ: 'JWT',
    };

    const now = Math.floor(Date.now() / 1000);
    const claim = {
      iss: credentials.client_email,
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    };

    // Encode header and claim
    const encodedHeader = this.base64urlEncode(JSON.stringify(header));
    const encodedClaim = this.base64urlEncode(JSON.stringify(claim));
    const signatureInput = `${encodedHeader}.${encodedClaim}`;

    // Sign with private key
    const signature = await this.signRSA(signatureInput, credentials.private_key);

    return `${signatureInput}.${signature}`;
  }

  /**
   * Base64 URL encode
   */
  private base64urlEncode(str: string): string {
    const base64 = btoa(unescape(encodeURIComponent(str)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * Sign data with RSA-SHA256 (browser-compatible)
   */
  private async signRSA(data: string, privateKey: string): Promise<string> {
    // Note: This requires Web Crypto API (available in modern browsers and Node 15+)
    // For build-time usage, this will work in Astro's build process

    // Import private key
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = privateKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');

    const binaryDer = this.base64ToArrayBuffer(pemContents);

    const key = await crypto.subtle.importKey(
      'pkcs8',
      binaryDer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256',
      },
      false,
      ['sign']
    );

    // Sign data
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, dataBuffer);

    // Convert to base64url
    return this.arrayBufferToBase64url(signature);
  }

  /**
   * Convert base64 to ArrayBuffer
   */
  private base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Convert ArrayBuffer to base64url
   */
  private arrayBufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  }

  /**
   * List files in a Google Drive folder
   */
  async listFilesInFolder(folderId: string): Promise<GoogleDocMetadata[]> {
    const token = await this.getAccessToken();

    const url = new URL('https://www.googleapis.com/drive/v3/files');
    url.searchParams.set('q', `'${folderId}' in parents and mimeType='application/vnd.google-apps.document' and trashed=false`);
    url.searchParams.set('fields', 'files(id,name,mimeType,modifiedTime,webViewLink,thumbnailLink,description)');
    url.searchParams.set('orderBy', 'modifiedTime desc');

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to list files: ${response.statusText}`);
    }

    const data = await response.json();
    return data.files || [];
  }

  /**
   * Get document metadata
   */
  async getDocumentMetadata(docId: string): Promise<GoogleDocMetadata> {
    const token = await this.getAccessToken();

    const url = new URL(`https://www.googleapis.com/drive/v3/files/${docId}`);
    url.searchParams.set('fields', 'id,name,mimeType,modifiedTime,webViewLink,thumbnailLink,description');

    const response = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to get document metadata: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Export Google Doc as HTML
   */
  async exportDocAsHtml(docId: string): Promise<string> {
    const token = await this.getAccessToken();

    const url = `https://www.googleapis.com/drive/v3/files/${docId}/export?mimeType=text/html`;

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error(`Failed to export document: ${response.statusText}`);
    }

    return await response.text();
  }

  /**
   * Fetch and parse a Google Doc as a story
   */
  async fetchStory(docId: string, language: Locale = 'de'): Promise<FetchedStory> {
    // Check cache first
    const cached = this.getCachedStory(docId);
    if (cached && cached.expiresAt > Date.now()) {
      console.log(`Using cached story: ${docId}`);
      return cached.story;
    }

    // Fetch from Google Drive
    const [metadata, html] = await Promise.all([
      this.getDocumentMetadata(docId),
      this.exportDocAsHtml(docId),
    ]);

    // Parse HTML to story format
    const story = this.parseHtmlToStory(docId, html, metadata, language);

    // Cache the story
    this.cacheStory(docId, story);

    return story;
  }

  /**
   * Parse HTML content to story format
   */
  private parseHtmlToStory(
    docId: string,
    html: string,
    metadata: GoogleDocMetadata,
    language: Locale
  ): FetchedStory {
    // Create a DOM parser (works in both browser and Node with proper polyfill)
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Extract title (first h1 or use document name)
    const h1 = doc.querySelector('h1');
    const title = h1?.textContent?.trim() || metadata.name;

    // Extract content sections
    const sections: string[] = [];
    const images: { url: string; alt: string; driveId?: string }[] = [];

    // Parse body content
    const body = doc.body;
    let currentSection = '';

    for (const element of Array.from(body.children)) {
      const tagName = element.tagName.toLowerCase();

      if (tagName === 'h1') {
        // Skip title, already extracted
        continue;
      } else if (tagName === 'h2') {
        // New section
        if (currentSection) {
          sections.push(currentSection.trim());
        }
        currentSection = `## ${element.textContent?.trim()}\n\n`;
      } else if (tagName === 'p') {
        const text = element.textContent?.trim();
        if (text) {
          currentSection += `${text}\n\n`;
        }
      } else if (tagName === 'img') {
        const img = element as HTMLImageElement;
        images.push({
          url: img.src,
          alt: img.alt || 'Story illustration',
        });
      } else if (tagName === 'ul' || tagName === 'ol') {
        const listItems = Array.from(element.querySelectorAll('li'))
          .map(li => `- ${li.textContent?.trim()}`)
          .join('\n');
        currentSection += `${listItems}\n\n`;
      }
    }

    if (currentSection) {
      sections.push(currentSection.trim());
    }

    const content = sections.join('\n\n');

    // Extract questions from tables or structured content
    const questions = this.extractQuestions(doc);

    // Extract metadata from document description or content
    const extractedMeta = this.extractMetadata(doc, metadata, language);

    return {
      id: docId,
      title,
      content,
      images,
      questions,
      metadata: {
        ...extractedMeta,
        language,
        lastModified: new Date(metadata.modifiedTime).getTime(),
      },
    };
  }

  /**
   * Extract quiz questions from document
   * Looks for tables with question format
   */
  private extractQuestions(doc: Document): QuizQuestion[] {
    const questions: QuizQuestion[] = [];
    const tables = doc.querySelectorAll('table');

    tables.forEach((table, tableIdx) => {
      const rows = Array.from(table.querySelectorAll('tr'));

      rows.forEach((row, rowIdx) => {
        const cells = Array.from(row.querySelectorAll('td, th'));

        if (cells.length >= 2) {
          const questionText = cells[0]?.textContent?.trim();
          const answerText = cells[1]?.textContent?.trim();

          if (questionText && answerText) {
            // Detect question type
            const lowerAnswer = answerText.toLowerCase();

            if (lowerAnswer === 'true' || lowerAnswer === 'false' ||
                lowerAnswer === 'wahr' || lowerAnswer === 'falsch' ||
                lowerAnswer === 'صح' || lowerAnswer === 'خطأ') {
              // True/False question
              questions.push({
                id: `tf_${tableIdx}_${rowIdx}`,
                text: questionText,
                type: 'truefalse',
                correctAnswer: lowerAnswer === 'true' || lowerAnswer === 'wahr' || lowerAnswer === 'صح' ? 'true' : 'false',
              });
            } else if (cells.length > 2) {
              // Multiple choice (options in subsequent cells)
              const options = cells.slice(1).map(c => c.textContent?.trim() || '').filter(Boolean);
              questions.push({
                id: `mc_${tableIdx}_${rowIdx}`,
                text: questionText,
                type: 'multiplechoice',
                correctAnswer: answerText,
                options,
              });
            }
          }
        }
      });
    });

    return questions;
  }

  /**
   * Extract metadata from document
   */
  private extractMetadata(doc: Document, metadata: GoogleDocMetadata, language: Locale): Partial<FetchedStory['metadata']> {
    const result: Partial<FetchedStory['metadata']> = {
      skills: [],
    };

    // Try to extract from document description
    if (metadata.description) {
      const desc = metadata.description.toLowerCase();

      // Extract skills (look for skill IDs)
      const skillPatterns = [
        'self-awareness', 'emotional-regulation', 'empathy', 'patience', 'impulse-control',
        'effective-communication', 'cooperation', 'conflict-resolution', 'leadership', 'respect',
        'problem-solving', 'decision-making', 'critical-thinking', 'adaptability', 'goal-setting',
        'responsibility', 'honesty', 'persistence', 'self-discipline', 'time-management',
      ];

      result.skills = skillPatterns.filter(skill => desc.includes(skill));

      // Extract emoji
      const emojiMatch = metadata.description.match(/[\u{1F300}-\u{1F9FF}]/u);
      if (emojiMatch) {
        result.emoji = emojiMatch[0];
      }

      // Extract difficulty
      if (desc.includes('beginner') || desc.includes('anfänger')) {
        result.difficulty = 'beginner';
      } else if (desc.includes('intermediate') || desc.includes('fortgeschritten')) {
        result.difficulty = 'intermediate';
      }
    }

    // Extract author from first paragraph metadata
    const firstP = doc.querySelector('p');
    if (firstP?.textContent?.includes('Author:') || firstP?.textContent?.includes('Autor:')) {
      const authorMatch = firstP.textContent.match(/(?:Author|Autor):\s*(.+)/i);
      if (authorMatch) {
        result.author = authorMatch[1].trim();
      }
    }

    return result;
  }

  /**
   * Get cached story from localStorage
   */
  private getCachedStory(docId: string): CachedStory | null {
    if (typeof window === 'undefined') return null;

    try {
      const cached = localStorage.getItem(`gdrive-story-${docId}`);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }
    return null;
  }

  /**
   * Cache story to localStorage
   */
  private cacheStory(docId: string, story: FetchedStory): void {
    if (typeof window === 'undefined') return;

    try {
      const cached: CachedStory = {
        story,
        cachedAt: Date.now(),
        expiresAt: Date.now() + (this.config.cacheDuration || 6 * 60 * 60 * 1000),
      };
      localStorage.setItem(`gdrive-story-${docId}`, JSON.stringify(cached));
    } catch (error) {
      console.error('Error caching story:', error);
    }
  }

  /**
   * Clear cache for a specific story or all stories
   */
  clearCache(docId?: string): void {
    if (typeof window === 'undefined') return;

    if (docId) {
      localStorage.removeItem(`gdrive-story-${docId}`);
    } else {
      // Clear all cached stories
      const keys = Object.keys(localStorage).filter(k => k.startsWith('gdrive-story-'));
      keys.forEach(k => localStorage.removeItem(k));
    }
  }

  /**
   * Validate document ID format
   */
  static isValidDocId(docId: string): boolean {
    // Google Doc IDs are typically 44 characters (alphanumeric, hyphens, underscores)
    return /^[a-zA-Z0-9_-]{25,}$/.test(docId);
  }

  /**
   * Extract document ID from Google Docs URL
   */
  static extractDocIdFromUrl(url: string): string | null {
    const patterns = [
      /\/document\/d\/([a-zA-Z0-9_-]+)/,
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }
}

/**
 * Create a Google Drive client instance
 */
export function createGoogleDriveClient(config: GoogleDriveConfig): GoogleDriveClient {
  return new GoogleDriveClient(config);
}
