# Lernen mit Geschichten - Project Guidelines

## Project Context

This is a multilingual, non-profit educational microwebsite teaching children (ages 3-7) values and behavioral skills through interactive stories. Target users: parents, teachers, and KiTA caretakers in Germany. Languages: German (primary), Arabic, English, Turkish, and Urdu.

## Tech Stack

- **Framework**: Astro (static site generation, content collections)
- **Hosting**: Netlify (free tier)
- **Content**: Markdown with YAML frontmatter
- **Styling**: Scoped CSS with RTL support for Arabic/Urdu
- **Interactivity**: Vanilla JavaScript (no heavy frameworks)
- **Deployment**: GitHub → Netlify auto-deploy

## Core Principles

### Mission: "Lernen mit Geschichten" (Learning with Stories)
The primary purpose of this site is teaching children values and behavioral skills through **interactive stories**. All other features are secondary enhancements.

### Content-First Approach
- Stories are the primary content type
- Each story maps to 1-3 skills from 58-skill taxonomy
- Consistent structure: narrative + key message + 3 activity types (true/false, multiple choice, fill-in-blank)
- All content in `/src/content/stories/{lang}/` as markdown files

### Multilingual Requirements
- All UI text must support 5 languages
- RTL layout support for Arabic and Urdu
- Use Noto Sans font family for comprehensive language coverage
- Language switcher persistent on all pages
- i18n routing: `/de/stories/bruno`, `/ar/stories/bruno`, etc.

### Accessibility Standards
- WCAG 2.1 AA compliance mandatory
- Keyboard navigation for all interactive elements
- Screen reader friendly
- Color contrast ratio ≥ 4.5:1
- Mobile-first responsive design
- Touch targets ≥ 44x44px on mobile

### Performance & Simplicity
- Static site generation (no server-side rendering)
- Minimal JavaScript (component islands only)
- Fast page loads (target: < 2s)
- No authentication or backend needed
- Client-side only interactivity (localStorage for progress)

### Privacy-First
- No user accounts or personal data collection
- GDPR-friendly analytics only (Plausible)
- No third-party tracking
- All interactive features work offline (client-side)

## File Structure Conventions

```
src/
├── components/           # Reusable Astro components
│   ├── QuizInteractive.astro        # Main interactive quiz component
│   ├── StoryCard.astro              # Story preview cards (with interactive badges)
│   ├── InteractiveStorybook.astro   # Swiper + TTS narration
│   ├── LanguageSelector.astro       # Language switcher (dropdown)
│   ├── FilterSidebar.astro          # Filter by skill/language
│   └── SearchBar.astro              # Search functionality
├── content/
│   ├── config.ts                    # Content collections schema (supports interactive format)
│   └── stories/
│       ├── de/                      # German stories
│       ├── ar/                      # Arabic stories
│       ├── en/                      # English stories
│       ├── tr/                      # Turkish stories
│       └── ur/                      # Urdu stories
├── layouts/
│   ├── BaseLayout.astro             # Base template with nav
│   └── StoryLayout.astro            # Story detail page template
├── locales/                         # Modular i18n JSON files (split by category)
│   ├── de-core.json                 # German: Navigation, UI, common (~56%)
│   ├── de-stories.json              # German: Story features (~11%)
│   ├── de-games.json                # German: Generic games (~12%)
│   ├── de-create.json               # German: Creation tools (~7%)
│   ├── de-features.json             # German: Pets, quests, collections (~11%)
│   └── (same pattern for ar, en, tr, ur)
├── pages/
│   ├── index.astro                  # Homepage (DE)
│   ├── [locale]/index.astro         # Localized homepages
│   ├── about.astro                  # About page (DE)
│   ├── [locale]/about.astro         # Localized about pages
│   └── stories/
│       └── [...slug].astro          # Dynamic story pages
├── styles/
│   ├── global.css                   # Global styles
│   └── rtl.css                      # RTL overrides for AR/UR
└── utils/
    ├── i18n.ts                      # Translation utilities (loads JSON files)
    ├── skills-taxonomy.ts           # 58 skills definitions
    ├── text-to-speech.ts            # StoryNarrator class for TTS
    └── search.ts                    # Search logic
```

## Architecture: Core vs Secondary Features

### Feature Categorization

The site follows a clear hierarchy: **Stories First**, with supplementary features for engagement.

#### **CORE FEATURES (Story-Focused):**
These are the primary features directly supporting the mission of learning through stories:

- **Story Reading** (`src/pages/stories/`, `src/pages/[locale]/stories/`)
  - Interactive storybook with TTS narration
  - Page flipping and read-aloud functionality
  - Story detail pages with key messages

- **Story Discovery** (`src/pages/story-map.astro`, `src/components/StoryCard.astro`)
  - Visual story map explorer
  - Story browser with skill-based filtering
  - Story recommendations based on reading history

- **Story Creation** (`src/pages/story-builder.astro`, `src/pages/character-designer.astro`)
  - Story builder tool for creating custom stories
  - Character designer for story characters

- **Story-Based Activities**
  - Balloon Pop Quiz (`src/pages/balloon-pop.astro`) - Story comprehension
  - Sequencing Game (`src/pages/sequencing-game.astro`) - Story order
  - Story-specific quizzes (true/false, multiple choice, fill-in-blank)

- **Reading Progress** (`src/pages/progress.astro`, `src/pages/reading-progress.astro`)
  - Reading streaks and progress tracking
  - Reading goals and achievements
  - Print studio for offline story reading

#### **SECONDARY FEATURES (Games - Not Story-Specific):**
These are generic educational games that could exist independently:

**Location:** `/games/` pages

- Memory Match, Jigsaw Puzzles, Sliding Puzzles
- Maze Explorer, Spot the Difference, Connect Dots
- Whack-a-Mole, Fruit Slicer, Fishing Game
- Word Search, Rhyme Time, Shadow Matching
- Emotion Matching, Dance Party, Coloring Book

**Note:** These games are marked as "Bonus: Lernspiele" in the navigation to indicate they're supplementary.

#### **SECONDARY FEATURES (Creation Tools - Generic):**
General creativity tools not tied to story creation:

**Location:** `/create/` pages

- Animation Studio, Comic Maker, Music Composer
- Puppet Theater, Recording Studio, Building Blocks
- Dress-up Game

**Note:** These are general creativity tools, distinct from story-specific creation features.

#### **SECONDARY FEATURES (Gamification):**
Engagement features that enhance motivation but aren't core to learning:

**Location:** `/pets/`, `/collections/`, `/tools/` pages

- Virtual Pets & Pet Adoption
- Magic Garden
- Quest System, Trophy Cabinet, Card Collection
- Weather Effects, Fortune Teller, Daily Surprise

**Note:** These reward engagement and provide fun incentives for continued use.

### Translation Organization

To support this architecture, translations are split by feature category:

- `*-core.json` - Navigation, common UI, error messages (~56% of keys)
- `*-stories.json` - Story reading, building, story-based features (~11%)
- `*-games.json` - Generic game translations (~12%)
- `*-create.json` - Creation tool translations (~7%)
- `*-features.json` - Pets, quests, collections, etc. (~11%)

All files are merged at runtime in `src/utils/i18n.ts` for backward compatibility.

### Future Architecture Considerations

**Current Decision:** Keep everything in one codebase with clear separation of concerns.

**Potential Phase 2 Extraction:**
If the site grows significantly, consider extracting secondary features:
- Games → Separate "Lernspiele" app (subdomain: `games.lernen-mit-geschichten.de`)
- Creation Tools → Separate "Kreativ-Werkstatt" app
- Keep only story-focused features in main app

**Benefits of Extraction:**
- Clearer mission focus
- Better performance (smaller bundles per app)
- Reusable games across projects
- Independent deployment and scaling

**Current Benefits of Monolith:**
- Simpler deployment (single build)
- Shared components and utilities
- Unified user experience
- Lower maintenance overhead

## Content Format

### Story Markdown Structure

#### Standard Format
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
languages: ["de"]
storyId: "001-bruno"
characterType: "bear"
difficulty: "beginner"
estimatedReadTime: 3
publishDate: 2024-01-15
storyFormat: "standard"  # default
---

## Story Content
[Narrative text in selected language]

## Key Message
- Bullet point 1
- Bullet point 2

## Interactive Activities
### True/False Questions
[questions data structure]

### Multiple Choice
[questions data structure]

### Fill-in-the-Blank
[questions data structure]
```

#### Interactive Format (with TTS & Page Flipping)
```markdown
---
title: "Brunos bunte Gefühle"
# ... other frontmatter
storyFormat: "interactive"
pages:
  - text: "Es war einmal ein kleiner Bär namens Bruno..."
    image: "https://via.placeholder.com/800x600"
  - text: "Eines Tages wollte Bruno..."
    image: "https://via.placeholder.com/800x600"
---

## Key Message
[Text after all interactive pages]
```

**Interactive Features:**
- Swiper.js page flipping with creative 3D transitions
- Web Speech API (TTS) narration with word-by-word highlighting
- Floating control island (sticky, glassmorphic design)
- Expandable settings panel (volume, speed)
- Auto-play mode for continuous reading
- Progress tracking via localStorage

## Development Guidelines

### When Creating Components
- Use scoped styles within .astro files
- Support RTL with `[dir="rtl"]` CSS selectors
- Make all interactive elements keyboard accessible
- Include ARIA labels for screen readers
- Test on mobile viewport first
- Ensure emoji rendering is consistent

### When Converting Stories
- Convert .docx files from `/content/` directory
- Extract: title, narrative, key message, all 3 activity types
- Use emoji from original story (if present)
- Map to skills from taxonomy
- Add metadata: storyId, characterType, estimatedReadTime
- Place in appropriate language folder

### When Adding Translations
- Never use machine translation without review
- Mark stories with available languages in frontmatter
- Update language availability filters
- Ensure RTL text direction for Arabic/Urdu
- Test special characters and diacritics

### When Implementing Interactivity
- Use vanilla JavaScript in Astro `<script>` tags
- Store quiz progress in localStorage (key: `quiz-progress-{storyId}`)
- Provide immediate feedback (correct/incorrect)
- Allow multiple attempts for learning
- Include "Show all answers" option for teachers

## Skills Taxonomy (58 Skills)

Organized into 4 categories:

### Emotional Skills
- self-awareness, emotional-regulation, empathy, patience, impulse-control

### Social Skills
- effective-communication, cooperation, conflict-resolution, leadership, respect

### Cognitive Skills
- problem-solving, decision-making, critical-thinking, adaptability, goal-setting

### Behavioral Skills
- responsibility, honesty, persistence, self-discipline, time-management

Full list in `/src/utils/skills-taxonomy.ts`

## Design System

### Color Palette
- Primary: Warm oranges (#FF9F40), soft yellows (#FFD93D), light blues (#6BCF7F)
- Background: Off-white (#F9F9F9)
- Text: Dark gray (#333333)
- Success: Green (#4CAF50)
- Error: Red (#E57373)

### Typography
- Font: Noto Sans (supports all 5 languages)
- Base size: 18px (larger for child readability)
- Line height: 1.6
- Headings: Bold, clear hierarchy

### Layout
- Max content width: 1200px
- Mobile breakpoint: 768px
- Card border radius: 12px
- Generous padding: 2rem
- Whitespace-heavy design

## Testing Requirements

### Before Every Commit
- Test in both LTR (German, English, Turkish) and RTL (Arabic, Urdu) modes
- Verify keyboard navigation
- Check mobile responsive layout
- Validate contrast ratios

### Before Deployment
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile device testing (iOS, Android)
- Screen reader testing (NVDA minimum)
- Print CSS validation
- Lighthouse audit (aim for 90+ accessibility score)

## Content Management Workflow

1. **Story Creation/Edit**
   - Write/edit in Google Docs
   - Review and finalize
   - Convert to markdown
   - Add frontmatter metadata
   - Commit to repository

2. **Translation Process**
   - Identify priority stories
   - Professional translation or community contribution
   - Human review required
   - Update frontmatter with new language
   - Test RTL layout (if Arabic/Urdu)

3. **Deployment**
   - Push to GitHub main branch
   - Netlify auto-builds and deploys
   - Verify live site
   - Test all languages

## SEO & Metadata

### Required Meta Tags Per Page
- Title (in page language)
- Description (in page language)
- Open Graph tags (og:title, og:description, og:image)
- Language tag (`lang="de"`, `lang="ar"`, etc.)
- Canonical URL for language variants

### Story Pages
- H1: Story title with emoji
- Meta description: First 150 characters of story + skill tags
- Alt text: Descriptive text for character illustrations
- Structured data: Educational content schema

## Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run astro add    # Add Astro integrations
```

## Prohibited Actions

- Do not create user authentication systems (not needed)
- Do not add backend databases (static only)
- Do not use heavy JS frameworks (React, Vue, etc.)
- Do not collect personal data
- Do not add complex build processes
- Do not ignore accessibility requirements
- Do not use auto-generated translations without review

## Priority Features (MVP)

### ✅ Completed
1. Homepage with story grid and filters
2. Story detail pages with interactive quizzes
3. Language selector working on all pages (dropdown)
4. Search by keyword/skill
5. 5 German stories fully converted (1 interactive format)
6. Mobile-responsive design
7. RTL support for Arabic/Urdu
8. Interactive storytelling with TTS and page flipping
9. Floating control island for audio controls
10. Separate i18n JSON files for Crowdin integration
11. Enhanced About page with usage guides (all languages)
12. Interactive story badges on cards

### 🚧 In Progress
- Print-friendly CSS
- SEO (sitemap.xml, robots.txt, meta tags)

### 📋 Pending
- Story format selector (toggle between standard/interactive)
- Deployment to Netlify

## Phase 2 Features

- Google Drive integration for additional stories
- PDF generation per story
- Teacher resource section
- Progress tracking (localStorage)
- Audio narrations
- 10+ stories with full translations

## Reference Documents

- **Master Prompt**: `/CLAUDE-assets/prompts/website-generation-prompt.md`
- **Project Plan**: `/TODO.md`
- **Skills List**: `/content/stories-index.md` (Arabic section)
- **Example Stories**: `/content/*.docx` (40+ German stories)

## Contact & Support

- GitHub Issues for bug reports
- Community contributions welcome (translations, stories)
- Open source: MIT (code) + CC BY-NC-SA 4.0 (content)

---

**Last Updated**: 2025-09-30
**Current Phase**: Phase 1 (MVP Development)