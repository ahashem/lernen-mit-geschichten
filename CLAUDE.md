# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Lernen mit Geschichten** is a non-profit educational platform teaching children ages 3-7 values and behavioral skills through interactive multilingual stories. The site supports 5 languages (German, Arabic, English, Turkish, Urdu) with RTL layout support for Arabic/Urdu.

### Key Principles
- **Content-first**: Stories are the primary feature; all other functionality is secondary
- **Static-first**: Astro static site generation; minimal JavaScript
- **Accessibility-first**: WCAG 2.1 AA compliance mandatory
- **Privacy-first**: No authentication, no data collection, GDPR-friendly

## Tech Stack

- **Framework**: Astro 5.x with MDX integration
- **Styling**: Scoped CSS (no CSS-in-JS framework)
- **Interactivity**: Vanilla JavaScript + Astro islands with React components
- **Content**: Markdown + YAML frontmatter in Astro content collections
- **i18n**: Modular JSON files (split by feature category for Crowdin integration)
- **Testing**: Vitest with unit tests
- **Quality**: ESLint, Prettier, TypeScript strict mode
- **Deployment**: GitHub Pages via GitHub Actions (auto-deploy on main push)

## Development Workflow

### Prerequisites
- Node.js 22.x or higher
- npm or yarn

### Common Commands

```bash
npm run dev              # Start dev server (http://localhost:4321)
npm run build            # Build for production (runs tests first via prebuild)
npm run preview          # Preview production build locally

npm run test             # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate test coverage report

npm run lint             # Check linting issues
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format code with Prettier
npm run format:check     # Check formatting without changing files

npm run quality          # Run full quality check (format:check + lint + test)
```

### Key Development Principles

1. **Path Aliases**: Use TypeScript path aliases (`@/*`, `@components/*`, `@utils/*`, `@layouts/*`, `@styles/*`) for imports
2. **Content Collections**: All stories must be in `src/content/stories/{locale}/` as markdown files
3. **Multilingual Content**: Each story has translated titles (titleDe, titleAr, etc.) and language availability tracking
4. **Test Before Build**: The build process runs `npm run test` first; tests must pass before deployment

## Architecture

### High-Level Structure

The codebase is organized into three major feature tiers:

#### Tier 1: Core Story Features (Primary Mission)
- **Story Reading**: Interactive storybook with TTS narration, page-flipping, progress tracking
- **Story Discovery**: Story map, browser with skill-based filtering, recommendations
- **Story-Based Activities**: Quizzes (true/false, multiple choice, fill-in-blank), sequencing games
- **Reading Progress**: Streaks, achievements, print studio for offline reading
- **Story Creation**: Story builder and character designer tools

**Files**: `src/pages/stories/`, `src/components/InteractiveStorybook.astro`, `src/components/StoryCard.astro`, `src/pages/story-builder.astro`

#### Tier 2: Generic Educational Games (Secondary)
Located in `src/pages/` and `src/components/`: Memory Match, Jigsaw Puzzles, Sliding Puzzles, Maze Explorer, Spot the Difference, Whack-a-Mole, Fruit Slicer, Word Search, Rhyme Time, Shadow Matching, Emotion Matching, etc.

These games exist independently of stories and could theoretically be extracted into a separate "Lernspiele" app in Phase 2.

#### Tier 3: Creation Tools & Gamification (Tertiary)
- **Creation Tools**: Animation Studio, Comic Maker, Music Composer, Puppet Theater, Building Blocks
- **Gamification**: Virtual Pets, Quest System, Trophy Cabinet, Badge Collection, Daily Challenges, Shop System

### Key Utilities

**i18n System** (`src/utils/i18n.ts`)
- Modular translation files split by feature: `*-core.json`, `*-stories.json`, `*-games.json`, `*-create.json`, `*-features.json`
- All 5 language JSON files are merged at runtime for backward compatibility
- Use `getTranslation(locale, key)` function to access translations
- RTL detection via `isRTL(locale)` for Arabic/Urdu

**Story Filtering** (`src/utils/filter-stories.ts`)
- Core filtering logic: `matchesFilter(story, criteria)` with AND logic between filters and OR logic within filter types
- Used across story browser, recommendations, and search features

**Skills Taxonomy** (`src/utils/skills-taxonomy.ts`)
- 58 skills across 4 categories: emotional, social, cognitive, behavioral
- Each skill has multilingual labels; stories map to 1-3 skills
- Skills are used for story classification, filtering, and progress tracking

**Content Configuration** (`src/content/config.ts`)
- Zod schema for story frontmatter validation
- Supports both standard and interactive story formats
- Optional fields: mood, ambientSound, musicIntensity for atmosphere
- Required fields: title (with translations), emoji, skills, storyId, languages

### Story Format

Stories support two formats via `storyFormat` field:

**Standard Format** (default)
```yaml
title: Story Title
skills: ["self-awareness", "emotional-regulation"]
storyFormat: "standard"
```
Renders as traditional text narrative with separate quiz section.

**Interactive Format**
```yaml
storyFormat: "interactive"
pages:
  - text: "Page 1 narration..."
    image: "url"
  - text: "Page 2 narration..."
    image: "url"
```
Uses Swiper.js for page-flipping, Web Speech API for TTS with word highlighting, floating control island.

### Component Patterns

- **Astro Components** (`*.astro`): Static templates with scoped CSS; for static content or simple interactivity
- **React Island Components** (`*.astro` with React `client:` directives): For complex state management (games, builders, interactive features)
- **No Vue/Svelte**: Project uses Astro + React only for interactivity

**RTL Support**: Use `[dir="rtl"]` CSS selectors for Arabic/Urdu overrides. Import `isRTL()` from i18n utility.

### Routing & Localization

- **Default Locale**: German (de)
- **Routing**: Astro's built-in i18n routing with `prefixDefaultLocale: false` (German URLs have no `/de` prefix)
- **Localized Routes**: `/stories/bruno` (German), `/ar/stories/bruno` (Arabic), `/en/stories/bruno` (English), etc.
- **Language Switcher**: Persistent on all pages; updates localStorage and redirects to current page in new language

## Content Workflow

### Adding a New Story

1. Create markdown file in `src/content/stories/{locale}/filename.md`
2. Required frontmatter fields:
   - `title`, `titleAr`, `titleEn`, `titleTr`, `titleUr` (all language titles)
   - `emoji` (character emoji)
   - `skills` (array of 1-3 skill IDs from taxonomy)
   - `storyId` (unique identifier, format: `nnn-name`)
   - `languages` (array of available languages)
   - `ageGroup`, `difficulty`, `estimatedReadTime` (optional metadata)

3. Choose format:
   - **Standard**: Write narrative, key messages, and quiz questions
   - **Interactive**: Use `storyFormat: "interactive"` with `pages` array containing text and image URLs

### Translations

- All UI text must be in `src/locales/{locale}-{category}.json`
- Categories: core, stories, games, create, features
- Files are merged at runtime; organize keys by category to avoid conflicts
- Professional human translation required; no machine translation without review
- RTL testing mandatory for Arabic/Urdu

## Testing

### Test Structure
- Tests colocate with source files: `filename.test.ts` or `filename.test.astro`
- Main test utility: `src/utils/filter-stories.test.ts` (filter logic)
- Run tests with `npm run test` or `npm run test:watch`

### Before Committing
- Run `npm run quality` to check formatting, linting, and tests
- All tests must pass before build succeeds (prebuild hook enforces this)

## Accessibility Requirements

### Mandatory Checks
- **Keyboard Navigation**: All interactive elements must be keyboard accessible (Tab, Enter, Arrow keys)
- **ARIA Labels**: Use `aria-label`, `aria-describedby` for interactive components
- **Color Contrast**: Minimum 4.5:1 for text; 3:1 for graphics
- **Mobile Touch Targets**: Minimum 44x44px
- **Screen Reader Testing**: Test with NVDA (Windows) or VoiceOver (macOS)
- **WCAG 2.1 AA Target**: Aim for high Lighthouse accessibility score (90+)

### RTL Testing
- Always test layout in both LTR (German, English, Turkish) and RTL (Arabic, Urdu) modes
- Use CSS `[dir="rtl"]` selectors for directional overrides
- Test text directionality, alignment, and margin/padding flips

## Deployment

### GitHub Pages (Automatic)
1. Push to `main` branch
2. GitHub Actions workflow triggers `npm run build`
3. Build artifacts deploy to `https://ahashem.github.io/lernen-mit-geschichten/`

### Base Path
- Site is deployed to subdirectory `/lernen-mit-geschichten/`
- All asset paths and links must account for this base path
- Astro automatically handles base path for internal links

## Constraints & Considerations

### Do NOT
- Add user authentication systems (not needed for non-profit)
- Create backend databases (static site only)
- Use heavy JS frameworks beyond React for islands
- Collect personal user data
- Use auto-generated translations
- Add complexity beyond current requirements (avoid premature abstraction)

### High-Priority Issues to Prevent
- **Missing Translations**: Every new UI key must be translated to all 5 languages
- **RTL Breakage**: Always test Arabic/Urdu after CSS changes
- **Accessibility Regression**: Test keyboard navigation and screen reader support before committing
- **Test Failure in Build**: Build will fail if tests don't pass; fix tests, don't skip them
- **Story Content Quality**: All story content must be age-appropriate (3-7), educationally sound, and professionally translated

## File Organization Guide

### When to Create New Files
- **New Story**: Create in `src/content/stories/{locale}/filename.md`
- **New Page**: Create in `src/pages/{route}.astro` or `src/pages/[locale]/{route}.astro`
- **New Component**: Create in `src/components/ComponentName.astro` or `.tsx`
- **New Utility**: Create in `src/utils/utility-name.ts`
- **New Translations**: Add to `src/locales/{locale}-{category}.json`

### Existing Files to Modify
- **i18n Strings**: Modify `src/locales/{locale}-{category}.json` (never hardcode UI text)
- **Story Metadata**: Update `src/content/config.ts` only if schema changes needed
- **Skills**: Update `src/utils/skills-taxonomy.ts` (rarely; validate with team first)
- **Styling Defaults**: Modify `src/styles/global.css` for site-wide changes

## Reference Commands for Common Tasks

```bash
# Run tests and rebuild after changes
npm run test:watch

# Check all quality criteria before committing
npm run quality

# Format code to match project style
npm run format

# Preview production build locally (useful for debugging build issues)
npm run preview

# Run specific test file
npm run test -- src/utils/filter-stories.test.ts

# Check test coverage
npm run test:coverage
```

## GitHub Workflow

- **Main Branch**: Production-ready code; every push auto-deploys
- **Feature Branches**: For new features and bug fixes
- **Pull Request**: Required before merging to main
- **Tests**: Must pass in CI before merge allowed

---

**Last Updated**: 2026-01-21
**Deployment**: GitHub Pages (auto-deploy on main push)
**Contact**: GitHub Issues for bug reports and discussions
