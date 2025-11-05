/**
 * Google Drive Configuration
 *
 * Configure Google Drive integration for fetching stories.
 * See CLAUDE-assets/GOOGLE_DRIVE_SETUP.md for setup instructions.
 */

import type { GoogleDriveConfig } from '../utils/google-drive';

/**
 * Main Google Drive configuration
 */
export const googleDriveConfig: GoogleDriveConfig = {
  // Service account credentials (from environment variable)
  credentialsJson: import.meta.env.GOOGLE_DRIVE_CREDENTIALS || '',

  // Main folder ID for stories
  folderId: import.meta.env.GOOGLE_DRIVE_FOLDER_ID || '',

  // Cache duration (6 hours)
  cacheDuration: 6 * 60 * 60 * 1000,

  // Export format (html is easier to parse)
  exportFormat: 'html',

  // Whitelist of approved document IDs (optional - leave empty to allow all docs in folder)
  approvedDocIds: [],
};

/**
 * Language-specific folder configurations
 */
export const languageFolders: Record<string, string> = {
  de: import.meta.env.GOOGLE_DRIVE_FOLDER_ID || '',
  ar: import.meta.env.GOOGLE_DRIVE_FOLDER_ID_AR || import.meta.env.GOOGLE_DRIVE_FOLDER_ID || '',
  en: import.meta.env.GOOGLE_DRIVE_FOLDER_ID_EN || import.meta.env.GOOGLE_DRIVE_FOLDER_ID || '',
  tr: import.meta.env.GOOGLE_DRIVE_FOLDER_ID_TR || import.meta.env.GOOGLE_DRIVE_FOLDER_ID || '',
  ur: import.meta.env.GOOGLE_DRIVE_FOLDER_ID_UR || import.meta.env.GOOGLE_DRIVE_FOLDER_ID || '',
};

/**
 * Check if Google Drive integration is enabled
 */
export function isGoogleDriveEnabled(): boolean {
  return !!(googleDriveConfig.credentialsJson && googleDriveConfig.folderId);
}

/**
 * Get folder ID for a specific language
 */
export function getFolderIdForLanguage(language: string): string | undefined {
  return languageFolders[language];
}

/**
 * Validate Google Drive configuration
 */
export function validateConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!googleDriveConfig.credentialsJson) {
    errors.push('GOOGLE_DRIVE_CREDENTIALS environment variable is not set');
  } else {
    try {
      JSON.parse(googleDriveConfig.credentialsJson);
    } catch {
      errors.push('GOOGLE_DRIVE_CREDENTIALS is not valid JSON');
    }
  }

  if (!googleDriveConfig.folderId) {
    errors.push('GOOGLE_DRIVE_FOLDER_ID environment variable is not set');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get configuration summary (for debugging)
 */
export function getConfigSummary(): Record<string, any> {
  return {
    enabled: isGoogleDriveEnabled(),
    hasCredentials: !!googleDriveConfig.credentialsJson,
    hasFolderId: !!googleDriveConfig.folderId,
    cacheDuration: googleDriveConfig.cacheDuration,
    exportFormat: googleDriveConfig.exportFormat,
    languageFolders: Object.entries(languageFolders)
      .filter(([_, id]) => !!id)
      .map(([lang]) => lang),
  };
}
