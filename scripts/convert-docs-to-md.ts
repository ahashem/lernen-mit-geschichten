#!/usr/bin/env node
/**
 * Convert Google Docs formatted text files to proper markdown
 * Handles multi-language stories separated by page breaks
 */

import fs from 'fs';
import path from 'path';

interface StoryMetadata {
  title: string;
  emoji: string;
  skills: string[];
  ageGroup: string;
  languages: string[];
  storyId: string;
  characterType?: string;
  difficulty?: 'beginner' | 'intermediate';
  estimatedReadTime?: number;
  publishDate?: string;
}

// Detect language from content
function detectLanguage(text: string): string {
  // Arabic detection
  if (/[\u0600-\u06FF]/.test(text)) return 'ar';
  // German detection (common German words)
  if (/\b(der|die|das|und|ist|ein|eine)\b/i.test(text)) return 'de';
  // Turkish detection
  if (/[şğıİ]/.test(text) || /\b(ve|bir|için)\b/.test(text)) return 'tr';
  // Urdu detection (similar to Arabic but different range)
  if (/[\u0750-\u077F]/.test(text)) return 'ur';
  // Default to English
  return 'en';
}

// Parse page break separated content
function splitByPageBreaks(content: string): string[] {
  // Google Docs page breaks can appear as:
  // - Multiple newlines (4+)
  // - Special characters like form feed
  // - --- or === separators
  return content
    .split(/\n{4,}|\f|[\-=]{3,}/)
    .map(section => section.trim())
    .filter(section => section.length > 100); // Ignore small sections
}

// Clean Google Docs formatting
function cleanGoogleDocsFormatting(text: string): string {
  let cleaned = text;

  // Remove multiple spaces
  cleaned = cleaned.replace(/ {2,}/g, ' ');

  // Fix newlines (Google Docs adds extra)
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Convert heading patterns
  // ALL CAPS at start of line = heading
  cleaned = cleaned.replace(/^([A-ZÄÖÜ\s]{3,})$/gm, (match) => {
    return `## ${match}`;
  });

  // Bold markers (if any)
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, '**$1**');

  // Clean up dialog formatting
  cleaned = cleaned.replace(/^[""](.+?)[""]$/gm, '"$1"');

  // Fix quotes
  cleaned = cleaned.replace(/[""]/g, '"');
  cleaned = cleaned.replace(/['']/g, "'");

  return cleaned.trim();
}

// Extract metadata from first section
function extractMetadata(text: string, storyId: string): Partial<StoryMetadata> {
  const metadata: Partial<StoryMetadata> = {
    storyId,
  };

  // Try to find title (first line or first heading)
  const titleMatch = text.match(/^#\s+(.+)$/m) || text.match(/^(.+)$/m);
  if (titleMatch) {
    metadata.title = titleMatch[1].trim();
  }

  // Detect emoji (first emoji in text)
  const emojiMatch = text.match(/([\u{1F300}-\u{1F9FF}])/u);
  if (emojiMatch) {
    metadata.emoji = emojiMatch[1];
  }

  // Guess estimated read time (250 words per minute)
  const wordCount = text.split(/\s+/).length;
  metadata.estimatedReadTime = Math.ceil(wordCount / 250);

  return metadata;
}

// Generate frontmatter
function generateFrontmatter(metadata: StoryMetadata): string {
  const lines = ['---'];

  lines.push(`title: "${metadata.title}"`);
  if (metadata.emoji) lines.push(`emoji: "${metadata.emoji}"`);
  if (metadata.skills?.length) lines.push(`skills: [${metadata.skills.map(s => `"${s}"`).join(', ')}]`);
  lines.push(`ageGroup: "${metadata.ageGroup || '3-7'}"`);
  lines.push(`languages: [${metadata.languages.map(l => `"${l}"`).join(', ')}]`);
  lines.push(`storyId: "${metadata.storyId}"`);
  if (metadata.characterType) lines.push(`characterType: "${metadata.characterType}"`);
  if (metadata.difficulty) lines.push(`difficulty: "${metadata.difficulty}"`);
  if (metadata.estimatedReadTime) lines.push(`estimatedReadTime: ${metadata.estimatedReadTime}`);
  if (metadata.publishDate) lines.push(`publishDate: ${metadata.publishDate}`);

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

// Convert a single file
async function convertFile(inputPath: string, outputDir: string, storyId: string) {
  console.log(`\nProcessing: ${inputPath}`);

  const content = fs.readFileSync(inputPath, 'utf-8');
  const sections = splitByPageBreaks(content);

  console.log(`  Found ${sections.length} section(s)`);

  if (sections.length === 1) {
    // Single language story
    const cleaned = cleanGoogleDocsFormatting(sections[0]);
    const language = detectLanguage(cleaned);
    const metadata = extractMetadata(cleaned, storyId);

    const fullMetadata: StoryMetadata = {
      title: metadata.title || `Story ${storyId}`,
      emoji: metadata.emoji || '📖',
      skills: metadata.skills || ['reading'],
      ageGroup: metadata.ageGroup || '3-7',
      languages: [language],
      storyId,
      estimatedReadTime: metadata.estimatedReadTime,
    };

    const markdown = generateFrontmatter(fullMetadata) + cleaned;
    const outputPath = path.join(outputDir, language, `${storyId}.md`);

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, markdown, 'utf-8');

    console.log(`  ✓ Created: ${outputPath}`);

  } else {
    // Multi-language story
    console.log(`  Multi-language story detected`);

    const languages: string[] = [];

    for (const section of sections) {
      const cleaned = cleanGoogleDocsFormatting(section);
      const language = detectLanguage(cleaned);
      languages.push(language);

      const metadata = extractMetadata(cleaned, storyId);

      const fullMetadata: StoryMetadata = {
        title: metadata.title || `Story ${storyId}`,
        emoji: metadata.emoji || '📖',
        skills: metadata.skills || ['reading'],
        ageGroup: metadata.ageGroup || '3-7',
        languages: [language],
        storyId,
        estimatedReadTime: metadata.estimatedReadTime,
      };

      const markdown = generateFrontmatter(fullMetadata) + cleaned;
      const outputPath = path.join(outputDir, language, `${storyId}.md`);

      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, markdown, 'utf-8');

      console.log(`  ✓ Created: ${outputPath} (${language})`);
    }
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log('Usage: node convert-docs-to-md.ts <input-file-or-dir> <output-dir>');
    console.log('');
    console.log('Example:');
    console.log('  node convert-docs-to-md.ts ./raw-stories ./src/content/stories');
    process.exit(1);
  }

  const inputPath = args[0];
  const outputDir = args[1];

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input path not found: ${inputPath}`);
    process.exit(1);
  }

  const stat = fs.statSync(inputPath);

  if (stat.isFile()) {
    // Single file
    const basename = path.basename(inputPath, path.extname(inputPath));
    const storyId = basename.replace(/[^a-z0-9-]/gi, '-').toLowerCase();
    await convertFile(inputPath, outputDir, storyId);

  } else if (stat.isDirectory()) {
    // Directory of files
    const files = fs.readdirSync(inputPath)
      .filter(f => f.endsWith('.txt') || f.endsWith('.md'))
      .sort();

    console.log(`Found ${files.length} file(s) to convert\n`);

    for (const file of files) {
      const fullPath = path.join(inputPath, file);
      const basename = path.basename(file, path.extname(file));
      const storyId = basename.replace(/[^a-z0-9-]/gi, '-').toLowerCase();

      try {
        await convertFile(fullPath, outputDir, storyId);
      } catch (error) {
        console.error(`  ✗ Error processing ${file}:`, error);
      }
    }
  }

  console.log('\n✓ Conversion complete!');
}

main().catch(console.error);
