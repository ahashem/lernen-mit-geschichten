# Lernen mit Geschichten

[![Deploy to GitHub Pages](https://github.com/ahashem/lernen-mit-geschichten/actions/workflows/deploy.yml/badge.svg)](https://github.com/ahashem/lernen-mit-geschichten/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Content License: CC BY-NC-SA 4.0](https://img.shields.io/badge/Content%20License-CC%20BY--NC--SA%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc-sa/4.0/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)
[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro-FF5D01?logo=astro)](https://astro.build)
[![Multilingual](https://img.shields.io/badge/Languages-5-blue)](https://github.com/ahashem/lernen-mit-geschichten)

> **Werte durch Geschichten lernen** - Teaching children values and behavioral skills through interactive multilingual stories.

A non-profit educational microwebsite designed for children ages 3-7, helping them learn important life skills through engaging stories. Built for parents, teachers, and KiTA caretakers in Germany.

## 🌍 Supported Languages

- 🇩🇪 **German** (Deutsch) - Primary language
- 🇸🇦 **Arabic** (العربية) - RTL support
- 🇬🇧 **English**
- 🇹🇷 **Turkish** (Türkçe)
- 🇵🇰 **Urdu** (اردو) - RTL support

## ✨ Features

- **📚 Interactive Stories** - Engaging narratives with TTS narration and page-flipping animations
- **🎯 58-Skill Taxonomy** - Stories mapped to emotional, social, cognitive, and behavioral skills
- **🎨 Multiple Formats** - Standard text-based and interactive storybook modes
- **🎧 Text-to-Speech** - Browser-based narration with word highlighting
- **📱 Mobile-First** - Fully responsive design optimized for all devices
- **♿ Accessibility** - WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **🌐 RTL Support** - Right-to-left layout for Arabic and Urdu
- **🔍 Advanced Filtering** - Search by skills, language, difficulty, and keywords
- **📖 Print Mode** - Booklet-friendly layout for offline reading
- **🚀 Fast & Lightweight** - Static site generation with minimal JavaScript
- **🔒 Privacy-First** - No user accounts, no tracking, GDPR-friendly

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build) - Static site generation
- **Styling**: Scoped CSS with RTL support
- **Interactivity**: Vanilla JavaScript (Web Speech API, Swiper.js)
- **Content**: Markdown with YAML frontmatter
- **Deployment**: GitHub Pages with GitHub Actions
- **Font**: Noto Sans (comprehensive language coverage)

## 🚀 Getting Started

### Prerequisites

- Node.js 22.x or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/ahashem/lernen-mit-geschichten.git
cd lernen-mit-geschichten

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev       # Start development server at http://localhost:4321
npm run build     # Build for production
npm run preview   # Preview production build locally
```

## 📂 Project Structure

```
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── StoryCard.astro
│   │   ├── InteractiveStorybook.astro
│   │   ├── QuizInteractive.astro
│   │   └── ...
│   ├── content/
│   │   └── stories/         # Markdown stories by language
│   │       ├── de/          # German stories
│   │       ├── ar/          # Arabic stories
│   │       ├── en/          # English stories
│   │       ├── tr/          # Turkish stories
│   │       └── ur/          # Urdu stories
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── StoryLayout.astro
│   ├── locales/             # i18n JSON files
│   │   ├── de.json
│   │   ├── ar.json
│   │   └── ...
│   └── utils/
│       ├── skills-taxonomy.ts
│       └── i18n.ts
├── public/                  # Static assets
├── .github/workflows/       # GitHub Actions
└── astro.config.mjs        # Astro configuration
```

## 🎓 Skills Taxonomy

Stories are mapped to **58 skills** across 4 categories:

### 🎭 Emotional Skills
Self-awareness, emotional regulation, empathy, patience, impulse control

### 🤝 Social Skills
Communication, cooperation, conflict resolution, leadership, respect

### 🧠 Cognitive Skills
Problem-solving, decision-making, critical thinking, adaptability, goal-setting

### 🌱 Behavioral Skills
Responsibility, honesty, persistence, self-discipline, time management

## 📖 Story Format

### Standard Format
- Narrative text
- Key messages
- Interactive activities (true/false, multiple choice, fill-in-the-blank)

### Interactive Format
- Page-by-page storytelling with Swiper.js
- Text-to-Speech narration with Web Speech API
- Floating control island (play/pause, speed, volume)
- Auto-play mode
- Progress tracking (localStorage)

## 🚀 Deployment

### GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. **Automatic Deployment**: Every push to `main` triggers a build via GitHub Actions
2. **Live URL**: `https://ahashem.github.io/lernen-mit-geschichten/`
3. **Setup**: Enable GitHub Pages in repository settings → Pages → Source: GitHub Actions

### Manual Deployment

```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## 🤝 Contributing

Contributions are welcome! This is a community-driven educational project.

### Ways to Contribute:
- **Translate stories** to additional languages
- **Add new stories** following the content format guidelines
- **Improve accessibility** features
- **Report bugs** or suggest features

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed contribution guidelines.

## 📋 Content Guidelines

- Stories should target ages 3-7
- Each story maps to 1-3 skills from the taxonomy
- Include 3 activity types: true/false, multiple choice, fill-in-the-blank
- Professional translation required (no machine translation)
- RTL layout must be tested for Arabic/Urdu

## 📄 License

- **Code**: [MIT License](LICENSE) - Free to use and modify
- **Content**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) - Non-commercial use with attribution

## 🙏 Acknowledgments

- Built with [Astro](https://astro.build)
- Icons and emojis for character representation
- [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) font family
- Community translators and contributors

## 📞 Contact & Support

- **Issues**: [GitHub Issues](https://github.com/ahashem/lernen-mit-geschichten/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ahashem/lernen-mit-geschichten/discussions)
