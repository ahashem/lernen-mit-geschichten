# Contributing to Lernen mit Geschichten

First off, thank you for considering contributing to Lernen mit Geschichten! 🎉

This is a community-driven educational project aimed at helping children learn important values and skills through stories. We welcome contributions from everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Translating Stories](#translating-stories)
  - [Adding New Stories](#adding-new-stories)
  - [Improving Code](#improving-code)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Features](#suggesting-features)
- [Development Setup](#development-setup)
- [Story Content Guidelines](#story-content-guidelines)
- [Translation Guidelines](#translation-guidelines)
- [Code Style Guide](#code-style-guide)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## How Can I Contribute?

### Translating Stories

We need help translating stories into our supported languages:

- 🇩🇪 German (Deutsch)
- 🇸🇦 Arabic (العربية)
- 🇬🇧 English
- 🇹🇷 Turkish (Türkçe)
- 🇵🇰 Urdu (اردو)

**Translation Requirements:**

- Professional or native-level proficiency in both source and target languages
- Understanding of child-appropriate language (ages 3-7)
- Cultural sensitivity and adaptation where necessary
- **No machine translation** - all translations must be human-reviewed

**Translation Process:**

1. Check existing stories in `src/content/stories/de/` for stories needing translation
2. Translate the full story content (narrative, key messages, quiz questions)
3. Add translated frontmatter fields (titleAr, titleEn, titleTr, titleUr)
4. Test RTL layout if translating to Arabic or Urdu
5. Submit a Pull Request with your translation

### Adding New Stories

We welcome original stories that teach children important life skills!

**Story Requirements:**

- Target age: 3-7 years
- Length: 2-5 minutes reading time
- Must map to 1-3 skills from our [58-skill taxonomy](./src/utils/skills-taxonomy.ts)
- Include 3 types of interactive activities:
  - True/False questions (2-3)
  - Multiple choice questions (2-3)
  - Fill-in-the-blank questions (2-3)

**Story Submission Process:**

1. Review existing stories for format and structure
2. Create your story in Markdown format
3. Add appropriate frontmatter metadata
4. Include an emoji character icon
5. Write engaging activities that reinforce the story's message
6. Submit a Pull Request with your story

See [Story Content Guidelines](#story-content-guidelines) below for detailed requirements.

### Improving Code

Technical contributions are welcome! Areas where you can help:

- **Accessibility improvements** - WCAG compliance, keyboard navigation, screen reader support
- **Performance optimization** - Faster load times, smaller bundle sizes
- **New features** - Interactive elements, learning games, progress tracking
- **Bug fixes** - Check [Issues](https://github.com/ahashem/lernen-mit-geschichten/issues) for open bugs
- **Documentation** - Improve setup guides, add code comments, update README

### Reporting Bugs

Before creating a bug report:

1. Check the [issue tracker](https://github.com/ahashem/lernen-mit-geschichten/issues) for existing reports
2. Test with the latest version
3. Try to reproduce the bug consistently

**Bug Report Template:**

- **Description**: Clear description of the bug
- **Steps to Reproduce**: Numbered steps to reproduce the behavior
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Screenshots**: If applicable
- **Environment**: Browser, OS, device type
- **Additional Context**: Any other relevant information

### Suggesting Features

We love new ideas! When suggesting a feature:

1. Check if it already exists or has been suggested
2. Explain the problem your feature would solve
3. Describe your proposed solution
4. Consider accessibility and multilingual implications
5. Keep in mind our privacy-first, no-tracking philosophy

## Development Setup

### Prerequisites

- Node.js 22.x or higher
- npm or yarn
- Git

### Setup Steps

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/lernen-mit-geschichten.git
cd lernen-mit-geschichten

# 3. Add upstream remote
git remote add upstream https://github.com/ahashem/lernen-mit-geschichten.git

# 4. Install dependencies
npm install

# 5. Create a new branch
git checkout -b feature/your-feature-name

# 6. Start development server
npm run dev

# 7. Make your changes and test

# 8. Build to verify
npm run build
npm run preview
```

### Project Structure

```
src/
├── components/       # Reusable Astro components
├── content/          # Markdown stories
│   └── stories/
│       ├── de/       # German stories
│       ├── ar/       # Arabic stories
│       └── ...
├── layouts/          # Page layouts
├── locales/          # i18n translations
├── pages/            # Route pages
├── styles/           # Global and RTL styles
└── utils/            # Helper functions
```

## Story Content Guidelines

### Frontmatter Template

```yaml
---
title: 'Story Title in German'
titleAr: 'عنوان القصة بالعربية'
titleEn: 'Story Title in English'
titleTr: 'Hikaye Başlığı Türkçe'
titleUr: 'اردو میں کہانی کا عنوان'
emoji: '🐻'
skills: ['emotional-regulation', 'self-awareness']
ageGroup: '3-7'
languages: ['de'] # Add language codes as translated
storyId: 'unique-id-###-character'
characterType: 'bear' # or "child", "animal", etc.
difficulty: 'beginner' # or "intermediate"
estimatedReadTime: 3
publishDate: 2024-01-15
storyFormat: 'standard' # or "interactive"
---
```

### Story Structure

**Standard Format:**

```markdown
## [Story Title]

[Narrative text in paragraphs]

## Kernbotschaft (Key Message)

- First lesson learned
- Second lesson learned
- Third lesson learned

## Interaktive Aktivitäten (Interactive Activities)

### Richtig oder Falsch? (True/False)

1. [Statement] ✓/✗
2. [Statement] ✓/✗

### Multiple Choice

1. [Question]
   - Option A
   - Option B (correct)
   - Option C

### Lückentext (Fill-in-the-Blank)

1. [Sentence with ____ blank]
   Answer: [word]
```

### Content Quality Standards

- **Age-Appropriate**: Language suitable for 3-7 year-olds
- **Positive Messaging**: Focus on solutions, not just problems
- **Inclusive**: Diverse characters and situations
- **Clear Moral**: Explicit connection to skills being taught
- **Engaging**: Keep children's attention with vivid descriptions
- **Educational**: Balance entertainment with learning objectives

### Skill Mapping

Choose 1-3 skills from our taxonomy:

**Emotional Skills**: self-awareness, emotional-regulation, empathy, patience, impulse-control

**Social Skills**: effective-communication, cooperation, conflict-resolution, leadership, respect

**Cognitive Skills**: problem-solving, decision-making, critical-thinking, adaptability, goal-setting

**Behavioral Skills**: responsibility, honesty, persistence, self-discipline, time-management

See full list in `src/utils/skills-taxonomy.ts`

## Translation Guidelines

### General Principles

1. **Accuracy**: Maintain the story's meaning and educational value
2. **Cultural Adaptation**: Adjust cultural references when necessary
3. **Age-Appropriate Language**: Use vocabulary suitable for young children
4. **Consistency**: Use consistent terminology across stories

### RTL Language Support (Arabic, Urdu)

- Test layout in RTL mode
- Ensure proper text direction for mixed content
- Verify emoji and icon positioning
- Check that interactive elements work correctly

### Translation Checklist

- [ ] Story narrative translated accurately
- [ ] Key messages preserve educational intent
- [ ] Quiz questions make sense in target language
- [ ] Frontmatter titles updated (titleAr, titleEn, etc.)
- [ ] Language code added to `languages` array
- [ ] RTL layout tested (if applicable)
- [ ] No machine translation artifacts

## Code Style Guide

### TypeScript/JavaScript

- Use TypeScript where possible
- Prefer `const` over `let`
- Use meaningful variable names
- Add comments for complex logic
- Follow existing code patterns

### Astro Components

- Use scoped styles within `.astro` files
- Support RTL with `[dir="rtl"]` selectors
- Ensure keyboard accessibility
- Include ARIA labels for screen readers
- Mobile-first responsive design

### CSS

- Use CSS custom properties for theming
- Follow BEM naming for classes
- Ensure color contrast ≥ 4.5:1
- Touch targets ≥ 44x44px on mobile

### Accessibility Requirements

- Semantic HTML
- Keyboard navigation support
- ARIA labels and roles
- Focus indicators
- Screen reader friendly
- No color-only indicators

## Commit Message Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

Write as many commits as the work needs, with as much body as it takes to explain them. Branch
commits are squashed on merge, so what lands on `main` is the squash subject — and that one has to
read as a single conventional line.

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `build`: Build system or dependencies
- `ci`: CI configuration
- `chore`: Maintenance tasks
- `content`: Story or translation additions

### Examples

```
feat(stories): add new story about teamwork

Add "Die Waldfreunde" story teaching cooperation skills.
Includes German version with interactive activities.

Closes #42

---

fix(accessibility): improve keyboard navigation in quiz

Added proper focus management and ARIA labels to quiz components.

---

content(translation): translate Bruno story to Arabic

Complete Arabic translation of "Bruno's Colorful Feelings"
with RTL layout verification.
```

### Enforcement

`.githooks/commit-msg` rejects a subject with no conventional prefix. Git does not clone hooks, so
activate them once per clone:

```sh
make hooks
```

`Merge`, `Revert`, `fixup!`, and `squash!` messages are exempt — Git writes those itself. The hook
also drops attribution trailers left behind by AI coding tools; a `Co-authored-by:` naming a person
is left alone.

## Pull Request Process

### Before Submitting

1. **Test Your Changes**

   ```bash
   npm run build
   npm run preview
   ```

2. **Check Accessibility**
   - Test keyboard navigation
   - Verify screen reader compatibility
   - Check color contrast

3. **Test RTL** (if applicable)
   - Switch to Arabic or Urdu
   - Verify layout and alignment
   - Check interactive elements

4. **Update Documentation**
   - Add story to relevant lists
   - Update README if needed
   - Add translation credits

### PR Checklist

- [ ] Branch is up to date with `main`
- [ ] Code builds without errors
- [ ] All tests pass (when available)
- [ ] Accessibility tested
- [ ] RTL layout tested (if applicable)
- [ ] Commit messages follow guidelines
- [ ] Documentation updated
- [ ] Self-review completed

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Story/Translation
- [ ] Documentation
- [ ] Refactoring

## Testing

How the changes were tested

## Checklist

- [ ] Code follows style guidelines
- [ ] Accessibility verified
- [ ] Documentation updated
- [ ] No breaking changes

## Screenshots (if applicable)

Add screenshots for UI changes
```

### Review Process

1. **Automated Checks**: GitHub Actions will run builds
2. **Code Review**: Maintainers will review your PR
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, your PR will be merged
5. **Deployment**: Changes will auto-deploy to GitHub Pages

## Recognition

Contributors will be recognized in:

- GitHub Contributors page
- Project acknowledgments
- Translation credits (if applicable)

## Questions?

- **General Questions**: [GitHub Discussions](https://github.com/ahashem/lernen-mit-geschichten/discussions)
- **Bug Reports**: [GitHub Issues](https://github.com/ahashem/lernen-mit-geschichten/issues)
- **Security Issues**: Contact maintainers directly

## License

By contributing, you agree that your contributions will be licensed under:

- **Code**: MIT License
- **Content (Stories)**: CC BY-NC-SA 4.0

---

Thank you for helping make education accessible to all children! 🌟
