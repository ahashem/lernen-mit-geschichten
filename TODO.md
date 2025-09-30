# Lernen mit Geschichten - Project TODO

## Current Phase: Planning & Initial Setup

## Core Mission
Create a multilingual, non-profit microwebsite for teaching children (ages 3-7) values and behavioral skills through stories. Target audience: parents, teachers, and KiTA caretakers in Germany. Languages: German, Arabic, English, Turkish, and Urdu.

## Technical Stack
- **Framework**: Astro (static site generation)
- **Hosting**: Netlify (free tier)
- **Content**: Markdown with frontmatter
- **Styling**: Scoped CSS with RTL support
- **Interactivity**: Vanilla JavaScript

---

## Phase 1: MVP Foundation (4-6 weeks)

### Project Initialization
- Initialize Astro project with content collections
- Set up Git repository structure
- Configure i18n routing for 5 languages
- Set up deployment pipeline to Netlify

### Content Architecture
- Design content collection schema for stories
- Create skills taxonomy management system (58 skills)
- Convert 5 priority German stories from .docx to markdown
- Structure story format: narrative + message + 3 activity types
- Create story frontmatter template

### Core Components Development
- LanguageSelector component (DE, AR, EN, TR, UR with flags)
- StoryCard component (for homepage grid)
- QuizInteractive component (true/false, multiple choice, fill-in-blank)
- FilterSidebar component (by skill, language, age)
- SearchBar component (multilingual search)

### Page Templates
- Homepage layout (hero, story grid, about, filter/search)
- Story detail page layout
- About page
- How to Use guide page
- BaseLayout with navigation

### Design System
- Define color palette (warm, inviting, child-friendly)
- Typography system (Noto Sans for multilingual support)
- RTL styles for Arabic/Urdu
- Mobile-first responsive breakpoints
- Component style library

### Interactive Features
- Client-side quiz functionality with answer checking
- Progress tracking via localStorage
- Immediate feedback (correct/incorrect)
- "Show all answers" functionality
- Quiz state persistence per story

### Accessibility & SEO
- WCAG 2.1 AA compliance
- RTL layout implementation
- Semantic HTML5 structure
- Meta descriptions in all languages
- Alt text for images
- Keyboard navigation

### Initial Content
- Convert and structure 5 German stories
- Map each story to 1-3 primary skills
- Create placeholder images/emoji icons
- Ensure consistent story structure

### Testing & Deployment
- Cross-browser testing
- Mobile device testing
- Screen reader testing (Arabic/Urdu RTL)
- Deploy MVP to Netlify
- Configure custom domain

---

## Phase 2: Content Expansion (2-3 months)

### Translation Pipeline
- Translate 5 MVP stories to all 5 languages
- Set up translation workflow (Google Docs → markdown)
- Implement language availability indicators
- Create community translation contribution guide

### Additional Content
- Convert 10-15 more German stories to markdown
- Commission/create story illustrations
- Add character illustrations
- Populate complete skills taxonomy

### Google Drive Integration
- Set up read-only Google Drive API access
- Implement embedded Google Docs viewer
- Create metadata management system
- CI/CD pipeline for content sync

### Print & Export Features
- Print-friendly CSS (remove nav, optimize for A4)
- Pre-generate PDFs per language per story
- Add "Download PDF" functionality
- Include QR code to website in PDFs

### Enhanced Search & Filter
- Implement character type filter
- Add story length filter
- Group skills into categories (emotional, social, cognitive, behavioral)
- Instant search across multilingual content

### SEO Optimization
- Generate sitemap.xml
- Add Open Graph tags
- Implement structured data (Schema.org)
- Create canonical URLs for language variants
- Add robots.txt

---

## Phase 3: Enhanced Features (Ongoing)

### Teacher/Parent Resources
- Downloadable activity worksheets
- Discussion guide templates
- Tips for facilitating stories
- Skill development tracking sheets
- Follow-up activities (crafts, games, role-play)

### Progress Tracking
- localStorage-based story completion tracking
- "Mark as read" functionality
- "Favorite stories" list
- Progress dashboard (client-side only)

### Content Collections
- Themed story collections (e.g., "Emotions Week")
- Skill-based playlists
- Age-based recommendations

### Community Features
- Feedback form (Netlify Forms)
- Story request mechanism
- Community translation portal
- Teacher-submitted lesson plans

### Multimedia Enhancement
- Audio narrations for stories
- Animated story videos
- Interactive illustrations

### Analytics & Privacy
- Implement Plausible Analytics (GDPR-friendly)
- Track: page views, story popularity, language preferences
- Anonymous search query insights
- Privacy policy page

---

## Content Management

### Current Content Inventory
- 40+ German stories in /content/ (.docx format)
- Stories-index.md with Arabic skills taxonomy (58 skills)
- Example stories: "Brunos bunte Gefühle", "Milo lernt, sich anzupassen"

### Content Conversion Process
1. Convert .docx to markdown
2. Add YAML frontmatter (title in 5 languages, emoji, skills, metadata)
3. Structure: story → key message → 3 activity types → discussion questions
4. Add to appropriate language folder in src/content/stories/

### Skills Taxonomy (58 Core Skills)
Categories:
- Emotional Skills (self-awareness, emotional regulation, empathy)
- Social Skills (communication, cooperation, conflict resolution)
- Cognitive Skills (problem-solving, decision-making, critical thinking)
- Behavioral Skills (patience, adaptability, impulse control)

---

## Design Guidelines

### Color Palette
- Primary: Warm oranges, soft yellows, light blues
- Ensure 4.5:1 contrast ratio
- Culturally neutral across 5 language contexts

### Typography
- Font Family: Noto Sans (multilingual support)
- Base Size: 16-18px
- Clear hierarchy
- RTL support for Arabic/Urdu

### Imagery
- Hand-drawn or soft illustration style
- Friendly animal characters
- Culturally neutral
- Emoji icons for quick recognition

### Layout
- Mobile-first responsive
- Card-based story browsing
- Generous whitespace
- Clear content sections

---

## Technical Implementation Details

### Project Structure
```
lernen-mit-geschichten/
├── CLAUDE-assets/
│   └── prompts/
├── src/
│   ├── components/
│   ├── content/
│   │   └── stories/
│   │       ├── de/
│   │       ├── ar/
│   │       ├── en/
│   │       ├── tr/
│   │       └── ur/
│   ├── layouts/
│   ├── pages/
│   ├── styles/
│   └── utils/
├── public/
│   └── assets/
└── astro.config.mjs
```

### Content Collections Schema
- title, titleAr, titleEn, titleTr, titleUr
- emoji, skills[], ageGroup, languages[]
- storyId, characterType, difficulty, estimatedReadTime
- publishDate, author

### i18n Routing
- `/de/stories/bruno`
- `/ar/stories/bruno`
- Automatic language detection
- Language switcher on every page

---

## Success Metrics

- Number of stories per language
- Story completion rate (localStorage)
- Most popular skills/topics
- Search query insights
- User feedback
- Community contributions

---

## License & Open Source

### Content License
- Stories: Creative Commons BY-NC-SA 4.0
- Attribution required, non-commercial, share-alike

### Code License
- MIT License (open source)

---

## Next Immediate Actions

1. Initialize Astro project
2. Configure content collections schema
3. Convert first story (Bruno) to markdown
4. Create QuizInteractive component prototype
5. Build homepage with story grid
6. Implement language selector
7. Deploy initial prototype to Netlify

---

## Reference Documents
- Full prompt: `/CLAUDE-assets/prompts/website-generation-prompt.md`
- Skills taxonomy: `/content/stories-index.md`
- Current stories: `/content/*.docx` (40+ files)

---

**Status**: Planning Complete ✓
**Last Updated**: 2025-09-30