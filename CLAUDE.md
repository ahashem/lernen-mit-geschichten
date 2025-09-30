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
│   ├── QuizInteractive.astro     # Main interactive quiz component
│   ├── StoryCard.astro           # Story preview cards
│   ├── LanguageSelector.astro    # Language switcher
│   ├── FilterSidebar.astro       # Filter by skill/language
│   └── SearchBar.astro           # Search functionality
├── content/
│   ├── config.ts                 # Content collections schema
│   └── stories/
│       ├── de/                   # German stories
│       ├── ar/                   # Arabic stories
│       ├── en/                   # English stories
│       ├── tr/                   # Turkish stories
│       └── ur/                   # Urdu stories
├── layouts/
│   ├── BaseLayout.astro          # Base template with nav
│   └── StoryLayout.astro         # Story detail page template
├── pages/
│   ├── index.astro               # Homepage
│   ├── about.astro
│   ├── how-to-use.astro
│   └── stories/
│       └── [lang]/
│           └── [slug].astro      # Dynamic story pages
├── styles/
│   ├── global.css                # Global styles
│   └── rtl.css                   # RTL overrides for AR/UR
└── utils/
    ├── i18n.ts                   # Translation utilities
    ├── skills-taxonomy.ts        # 58 skills definitions
    └── search.ts                 # Search logic
```

## Content Format

### Story Markdown Structure
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

1. Homepage with story grid and filters
2. Story detail pages with interactive quizzes
3. Language selector working on all pages
4. Search by keyword/skill
5. 5 German stories fully converted
6. Mobile-responsive design
7. RTL support for Arabic/Urdu
8. Print-friendly CSS
9. Deployment to Netlify

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