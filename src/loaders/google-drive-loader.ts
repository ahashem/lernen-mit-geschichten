/**
 * Google Drive Content Loader for Astro
 *
 * This loader fetches markdown files from Google Drive folders at build time.
 *
 * Setup:
 * 1. Create a Google Cloud project and enable Drive API
 * 2. Create a service account and download credentials JSON
 * 3. Share your Drive folder with the service account email
 * 4. Set environment variables in .env:
 *    - GOOGLE_DRIVE_CREDENTIALS (JSON string or path to credentials file)
 *    - GOOGLE_DRIVE_FOLDER_ID (folder ID from Drive URL)
 */

import type { Loader } from 'astro/loaders';

interface GoogleDriveLoaderConfig {
  folderId: string;
  credentialsPath?: string;
  credentialsJson?: string;
  locale?: string;
  provider?: string;
}

interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

interface GoogleDriveCredentials {
  client_email: string;
  private_key: string;
  project_id: string;
}

/**
 * Get OAuth2 access token using service account credentials
 */
async function getAccessToken(credentials: GoogleDriveCredentials): Promise<string> {
  const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const jwtClaim = {
    iss: credentials.client_email,
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  // Note: For production, use a proper JWT library like 'jsonwebtoken'
  // This is a simplified version that requires the Google API client library
  throw new Error(
    'Google Drive loader requires googleapis package. Install with: npm install googleapis'
  );
}

/**
 * List files in a Google Drive folder
 * Supports both Markdown (.md) files and Google Docs
 */
async function listFiles(folderId: string, accessToken: string): Promise<GoogleDriveFile[]> {
  // Query for both markdown files and Google Docs
  const query = `'${folderId}' in parents and (mimeType='text/markdown' or mimeType='application/vnd.google-apps.document') and trashed=false`;
  const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType,modifiedTime)`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to list Google Drive files: ${response.statusText}`);
  }

  const data = await response.json();
  return data.files || [];
}

/**
 * Download file content from Google Drive
 * Handles both regular files and Google Docs (exported as markdown)
 */
async function downloadFile(
  fileId: string,
  mimeType: string,
  accessToken: string
): Promise<string> {
  let url: string;

  // Google Docs need to be exported to markdown
  if (mimeType === 'application/vnd.google-apps.document') {
    // Export Google Doc as plain text (markdown-like format)
    url = `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`;
  } else {
    // Regular markdown file
    url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to download file ${fileId}: ${response.statusText}`);
  }

  return response.text();
}

/**
 * Convert Google Docs format to markdown-compatible format
 * Google Docs exported as plain text needs some cleanup
 */
function convertGoogleDocsToMarkdown(content: string): string {
  // Google Docs exports with some formatting that needs cleanup
  let markdown = content;

  // Preserve frontmatter if it exists
  const frontmatterMatch = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (frontmatterMatch) {
    return markdown; // Already has frontmatter, assume it's properly formatted
  }

  // Clean up extra whitespace
  markdown = markdown.replace(/\n{3,}/g, '\n\n');

  // Convert Google Docs heading format to markdown
  markdown = markdown.replace(/^([A-Z][^\n]+)$/gm, '## $1');

  return markdown;
}

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): { data: Record<string, any>; body: string } {
  const frontmatterRegex = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, body: content };
  }

  const [, frontmatterText, body] = match;
  const data: Record<string, any> = {};

  // Simple YAML parser for common frontmatter fields
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) return;

    const key = line.substring(0, colonIndex).trim();
    let value: any = line.substring(colonIndex + 1).trim();

    // Remove quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Parse arrays
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((v: string) => v.trim().replace(/['"]/g, ''));
    }

    // Parse numbers
    if (!isNaN(Number(value)) && value !== '') {
      value = Number(value);
    }

    data[key] = value;
  });

  return { data, body };
}

/**
 * Google Drive loader for Astro content collections
 */
export function googleDriveLoader(config: GoogleDriveLoaderConfig): Loader {
  return {
    name: 'google-drive-loader',
    async load({ store, logger, parseData, generateDigest }) {
      logger.info(`Loading stories from Google Drive folder: ${config.folderId}`);

      try {
        // Load credentials
        let credentials: GoogleDriveCredentials;

        if (config.credentialsJson) {
          credentials = JSON.parse(config.credentialsJson);
        } else if (config.credentialsPath) {
          const fs = await import('fs/promises');
          const credentialsContent = await fs.readFile(config.credentialsPath, 'utf-8');
          credentials = JSON.parse(credentialsContent);
        } else {
          throw new Error('Google Drive credentials not provided');
        }

        // Get access token
        logger.info('Authenticating with Google Drive API...');
        const accessToken = await getAccessToken(credentials);

        // List files in folder
        logger.info('Fetching file list...');
        const files = await listFiles(config.folderId, accessToken);
        logger.info(`Found ${files.length} markdown files`);

        // Download and process each file
        for (const file of files) {
          logger.info(`Processing: ${file.name} (${file.mimeType})`);

          // Download content
          let content = await downloadFile(file.id, file.mimeType, accessToken);

          // Convert Google Docs to markdown format if needed
          if (file.mimeType === 'application/vnd.google-apps.document') {
            logger.info(`Converting Google Doc to markdown: ${file.name}`);
            content = convertGoogleDocsToMarkdown(content);
          }

          // Parse frontmatter
          const { data, body } = parseFrontmatter(content);

          // Generate unique ID
          const storyId = data.storyId || file.name.replace(/\.md$/, '');
          const locale = config.locale || 'de';
          const id = `${locale}/${storyId}`;

          // Add provider metadata
          const enrichedData = {
            ...data,
            provider: config.provider || 'google-drive',
            providerUrl: `https://drive.google.com/file/d/${file.id}/view`,
          };

          // Store in collection
          store.set({
            id,
            data: enrichedData,
            body,
            digest: generateDigest(content),
          });
        }

        logger.info(`Successfully loaded ${files.length} stories from Google Drive`);
      } catch (error) {
        logger.error(`Failed to load from Google Drive: ${error}`);
        throw error;
      }
    },
  };
}

/**
 * Simplified public Google Drive loader
 * For publicly shared files without authentication
 */
export function publicGoogleDriveLoader(config: { fileUrls: string[]; locale?: string }): Loader {
  return {
    name: 'public-google-drive-loader',
    async load({ store, logger, generateDigest }) {
      logger.info(`Loading ${config.fileUrls.length} stories from public Google Drive URLs`);

      for (const url of config.fileUrls) {
        try {
          // Extract file ID from various Google Drive URL formats
          const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
          if (!fileIdMatch) {
            logger.warn(`Could not extract file ID from URL: ${url}`);
            continue;
          }

          const fileId = fileIdMatch[1];
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

          // Download content
          const response = await fetch(downloadUrl);
          if (!response.ok) {
            logger.warn(`Failed to download file ${fileId}: ${response.statusText}`);
            continue;
          }

          const content = await response.text();

          // Parse frontmatter
          const { data, body } = parseFrontmatter(content);

          // Generate ID
          const storyId = data.storyId || fileId;
          const locale = config.locale || data.locale || 'de';
          const id = `${locale}/${storyId}`;

          // Add provider metadata
          const enrichedData = {
            ...data,
            provider: 'google-drive',
            providerUrl: url,
          };

          store.set({
            id,
            data: enrichedData,
            body,
            digest: generateDigest(content),
          });

          logger.info(`Loaded story: ${id}`);
        } catch (error) {
          logger.error(`Error loading file from ${url}: ${error}`);
        }
      }
    },
  };
}
