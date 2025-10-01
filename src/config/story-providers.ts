/**
 * Story Provider Configuration
 *
 * This file defines multiple content sources for stories.
 * You can add stories from:
 * - Local filesystem (src/content/stories)
 * - Google Drive folders
 * - Direct URLs to markdown files
 */

export interface StoryProvider {
  name: string;
  type: 'local' | 'google-drive' | 'public-url';
  enabled: boolean;
  config: Record<string, any>;
}

/**
 * Default providers configuration
 * Providers are loaded in order and combined into a single collection
 */
export const storyProviders: StoryProvider[] = [
  // Local filesystem stories (always enabled)
  {
    name: 'local-stories',
    type: 'local',
    enabled: true,
    config: {
      path: 'src/content/stories',
      pattern: '**/*.md',
    },
  },

  // Google Drive folder (authenticated)
  // Requires service account credentials
  {
    name: 'google-drive-main',
    type: 'google-drive',
    enabled: false, // Enable when credentials are configured
    config: {
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
      credentialsJson: process.env.GOOGLE_DRIVE_CREDENTIALS || '',
      locale: 'de',
      provider: 'google-drive',
    },
  },

  // Google Drive - Arabic stories
  {
    name: 'google-drive-arabic',
    type: 'google-drive',
    enabled: false,
    config: {
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID_AR || '',
      credentialsJson: process.env.GOOGLE_DRIVE_CREDENTIALS || '',
      locale: 'ar',
      provider: 'google-drive',
    },
  },

  // Google Drive - English stories
  {
    name: 'google-drive-english',
    type: 'google-drive',
    enabled: false,
    config: {
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID_EN || '',
      credentialsJson: process.env.GOOGLE_DRIVE_CREDENTIALS || '',
      locale: 'en',
      provider: 'google-drive',
    },
  },

  // Google Drive - Turkish stories
  {
    name: 'google-drive-turkish',
    type: 'google-drive',
    enabled: false,
    config: {
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID_TR || '',
      credentialsJson: process.env.GOOGLE_DRIVE_CREDENTIALS || '',
      locale: 'tr',
      provider: 'google-drive',
    },
  },

  // Google Drive - Urdu stories
  {
    name: 'google-drive-urdu',
    type: 'google-drive',
    enabled: false,
    config: {
      folderId: process.env.GOOGLE_DRIVE_FOLDER_ID_UR || '',
      credentialsJson: process.env.GOOGLE_DRIVE_CREDENTIALS || '',
      locale: 'ur',
      provider: 'google-drive',
    },
  },

  // Public Google Drive files (no auth required)
  // Add direct links to publicly shared markdown files
  {
    name: 'public-drive-stories',
    type: 'public-url',
    enabled: false,
    config: {
      fileUrls: [
        // Example: 'https://drive.google.com/file/d/YOUR_FILE_ID/view',
      ],
      locale: 'de',
    },
  },
];

/**
 * Get all enabled providers
 */
export function getEnabledProviders(): StoryProvider[] {
  return storyProviders.filter(provider => provider.enabled);
}

/**
 * Get provider by name
 */
export function getProvider(name: string): StoryProvider | undefined {
  return storyProviders.find(p => p.name === name);
}

/**
 * Validate provider configuration
 */
export function validateProvider(provider: StoryProvider): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (provider.type === 'google-drive') {
    if (!provider.config.folderId) {
      errors.push(`Provider ${provider.name}: folderId is required`);
    }
    if (!provider.config.credentialsJson && !provider.config.credentialsPath) {
      errors.push(`Provider ${provider.name}: credentials are required`);
    }
  }

  if (provider.type === 'public-url') {
    if (!provider.config.fileUrls || provider.config.fileUrls.length === 0) {
      errors.push(`Provider ${provider.name}: fileUrls array is required`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
