# Story Management Guide

## Adding Stories to the Website

### Option 1: Markdown Stories (Full Interactive Experience)

Stories stored as markdown files in `/src/content/stories/{lang}/` get full interactive features including quizzes.

#### File Structure

```
src/content/stories/
├── de/
│   ├── 001-bruno.md
│   └── 009-milo.md
├── ar/
│   └── 001-bruno.md
├── en/
│   └── 001-bruno.md
├── tr/
│   └── 001-bruno.md
└── ur/
    └── 001-bruno.md
```

#### Story Format

```markdown
---
title: "Brunos bunte Gefühle"
titleAr: "مشاعر برونو الملونة"
titleEn: "Bruno's Colorful Feelings"
titleTr: "Bruno'nun Renkli Duyguları"
titleUr: "برونو کے رنگین جذبات"
emoji: "🐻"
skills: ["self-awareness", "emotional-regulation"]
ageGroup: "3-7"
languages: ["de", "ar", "en", "tr", "ur"]
storyId: "001-bruno"
characterType: "bear"
difficulty: "beginner"
estimatedReadTime: 3
publishDate: 2024-01-15
---

## Die Geschichte

[Story content in German...]

## Die Botschaft für Kinder

- Bullet point 1
- Bullet point 2
```

#### Multilingual Stories

**Separate Files Approach (Recommended):**

1. Create one file per language with the same `storyId`
2. Place in appropriate language folder: `de/001-bruno.md`, `ar/001-bruno.md`, etc.
3. Each file has all titles in all languages in frontmatter (for language switching)
4. Content is in the file's native language

**Single File with Sections (Alternative):**

```markdown
---
# frontmatter
---

## Geschichte (Deutsch)
[German content]

## القصة (العربية)
[Arabic content]

## Story (English)
[English content]
```

### Option 2: Google Drive Stories (Display Only)

For stories that don't need interactive features yet.

#### Setup (Future Phase 2)

1. **Store in Google Drive**
   - Organize by language folders
   - Use consistent naming: `001-bruno-de.docx`, `001-bruno-ar.docx`

2. **Metadata in Code**

```typescript
// src/data/google-drive-stories.ts
export const driveStories = [
  {
    storyId: '002-fritz',
    title: 'Fritzchen und dem wütenden Eichhörnchen',
    emoji: '🐿️',
    skills: ['patience', 'empathy'],
    languages: ['de'],
    driveFileId: 'abc123xyz',
    estimatedReadTime: 4
  }
];
```

3. **Embed in Page**

```astro
<iframe
  src={`https://docs.google.com/document/d/${fileId}/preview`}
  width="100%"
  height="600px"
></iframe>
```

## Workflow for Adding a New Story

### Step 1: Prepare Content

1. Write story in Google Docs (easier for non-technical contributors)
2. Include:
   - Title
   - Story narrative
   - Key message (Die Botschaft)
   - Optional: Quiz questions

### Step 2: Convert to Markdown

```bash
# Manual conversion or use tool like pandoc
pandoc story.docx -o story.md
```

### Step 3: Add Frontmatter

```yaml
---
title: "Story Title"
emoji: "🐻"
skills: ["skill-id-1", "skill-id-2"]
ageGroup: "3-7"
languages: ["de"]
storyId: "XXX-name"
characterType: "animal-type"
difficulty: "beginner"
estimatedReadTime: 3
---
```

**Skill IDs:** See `/src/utils/skills-taxonomy.ts` for valid skill IDs

### Step 4: Add Translations

For each target language:

1. Translate story content
2. Update frontmatter with all language titles
3. Create file in language folder: `/src/content/stories/{lang}/XXX-name.md`
4. Update `languages` array in frontmatter

### Step 5: Test Locally

```bash
npm run dev
# Navigate to http://localhost:4321/stories/XXX-name
```

### Step 6: Commit

```bash
git add .
git commit -m "feat: add story XXX-name in German"
```

## UI Translations (Webapp Interface)

All UI text is centralized in `/src/utils/i18n.ts`:

```typescript
export const translations = {
  de: {
    siteName: 'Lernen mit Geschichten',
    stories: 'Geschichten',
    // ...
  },
  ar: {
    siteName: 'التعلم من خلال القصص',
    stories: 'القصص',
    // ...
  },
  // ... other languages
};
```

### Adding New UI Text

1. Add key to all 5 languages in `translations` object
2. Use in components:

```astro
---
import { getTranslation } from '../utils/i18n';
const text = getTranslation(locale, 'keyName');
---
<p>{text}</p>
```

## Content Pipeline (Automated Sync - Future)

### Using GitHub Actions + Google Drive API

```yaml
# .github/workflows/sync-stories.yml
name: Sync Stories from Google Drive

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2am
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Sync from Drive
        run: node scripts/sync-drive-stories.js
      - name: Commit changes
        run: |
          git add .
          git commit -m "chore: sync stories from Google Drive"
          git push
```

### Sync Script (Pseudocode)

```javascript
// scripts/sync-drive-stories.js
const { google } = require('googleapis');

async function syncStories() {
  // 1. Connect to Google Drive API
  // 2. List all .docx files in stories folder
  // 3. For each new/updated file:
  //    - Download
  //    - Convert to markdown
  //    - Extract metadata
  //    - Save to src/content/stories/{lang}/
  // 4. Commit changes
}
```

## Skills Taxonomy Reference

All available skills organized by category:

### Emotional Skills
- `self-awareness` - Selbstbewusstsein / الوعي الذاتي
- `emotional-regulation` - Emotionskontrolle / التحكم في الانفعالات
- `empathy` - Empathie / التعاطف
- `patience` - Geduld / الصبر والتحمل
- `impulse-control` - Impulskontrolle / ضبط الاندفاعية

### Social Skills
- `effective-communication` - Kommunikation / التواصل الفعال
- `cooperation` - Zusammenarbeit / التعاون
- `conflict-resolution` - Konfliktlösung / حل النزاعات
- `leadership` - Führung / القيادة
- `respect` - Respekt / الاحترام

### Cognitive Skills
- `problem-solving` - Problemlösung / حل المشكلات
- `decision-making` - Entscheidungsfindung / اتخاذ القرار
- `critical-thinking` - Kritisches Denken / التفكير النقدي
- `adaptability` - Anpassungsfähigkeit / التكيف مع التغيير
- `goal-setting` - Zielsetzung / تحديد الأهداف

### Behavioral Skills
- `responsibility` - Verantwortung / المسؤولية
- `honesty` - Ehrlichkeit / الصدق
- `persistence` - Durchhaltevermögen / المثابرة
- `self-discipline` - Selbstdisziplin / الانضباط الذاتي
- `time-management` - Zeitmanagement / إدارة الوقت

Full list in `/src/utils/skills-taxonomy.ts`

## Content Checklist

Before publishing a story:

- [ ] Story has clear narrative structure
- [ ] Key message is child-friendly (3-7 years)
- [ ] Skills tags are accurate
- [ ] Emoji icon represents story character
- [ ] Reading time estimate is realistic
- [ ] All frontmatter fields are complete
- [ ] Translations are human-reviewed (not just machine-translated)
- [ ] Story tested in browser (both desktop and mobile)
- [ ] RTL layout works for Arabic/Urdu versions

## Common Issues

### Story Not Appearing
- Check file is in correct language folder
- Verify frontmatter YAML syntax is valid
- Run `npm run build` to see any errors
- Check `languages` array includes target language

### Language Switcher Not Working
- Ensure same `storyId` across all language files
- Check all titles (titleDe, titleAr, etc.) are in frontmatter
- Verify file slugs match (e.g., `001-bruno.md` in all folders)

### Skills Not Displaying
- Confirm skill ID exists in `skills-taxonomy.ts`
- Check spelling of skill IDs in frontmatter
- Skills must be in array format: `["skill-1", "skill-2"]`

## Next Steps

### Phase 2 Features
- [ ] Google Drive API integration
- [ ] Automated content sync
- [ ] PDF generation per story
- [ ] Audio narrations
- [ ] Teacher resource downloads

### Content Goals
- [ ] 10 stories fully translated to all 5 languages
- [ ] 40+ stories in German
- [ ] Interactive quizzes for top 20 stories
- [ ] Themed collections (emotions, social skills, etc.)