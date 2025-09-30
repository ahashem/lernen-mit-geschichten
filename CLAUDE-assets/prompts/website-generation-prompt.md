# Comprehensive Generative Prompt: Lernen mit Geschichten Website

## Project Overview

Create a multilingual, non-profit microwebsite for teaching children (ages 3-7) values and behavioral skills through stories. The website serves parents, teachers, and KiTA (kindergarten) caretakers in Germany with content in 5 languages: German, Arabic, English, Turkish, and Urdu.

## Core Mission

Provide accessible, educational stories that teach children essential life skills and values through engaging narratives, with interactive learning activities.

## Technical Stack Recommendation

**Astro** (Preferred Framework)
- Static site generation for fast performance and free hosting
- Content collections for managing stories as markdown
- Component islands for interactive elements without heavy JS
- Easy deployment to Netlify/Vercel/Cloudflare Pages (all free tier compatible)
- Built-in i18n routing support for multilingual content
- Minimal complexity, blog-like format, highly maintainable

**Alternative: 11ty or Hugo** (if simpler static generation preferred)

**Not Recommended: Next.js** (unnecessarily complex for this use case)

## Content Architecture

### Story Structure (Based on Analyzed Content)

Each story follows this consistent structure:

1. **Title with Emoji Icon**
   - Example: `🐻 Brunos bunte Gefühle` or `🐾 Milo lernt, sich anzupassen`

2. **Main Story Text**
   - Narrative format with dialogue
   - Character-driven plot with a problem and resolution
   - Age-appropriate language (3-7 years)
   - Length: ~200-400 words
   - Uses animal characters with relatable scenarios

3. **Key Message Section** (Die Botschaft / الرسالة)
   - 2-4 bullet points summarizing the learning outcome
   - Written in child-friendly language
   - Emphasizes practical application of the skill

4. **Interactive Learning Activities**:

   a. **True/False Questions** (Richtig oder Falsch / صح أو خطأ)
      - 6-8 comprehension questions about story events
      - Tests attention and understanding
      - Format: Statement + Answer

   b. **Multiple Choice Questions** (3-5 questions)
      - Character names, colors, actions, emotions
      - 3 options per question
      - One correct answer clearly marked

   c. **Fill-in-the-Blank** (Lückentext / املأ الفراغ)
      - 5-6 sentences with missing key words
      - Tests vocabulary retention
      - Accepts multiple valid answers (synonyms)

5. **Open-Ended Discussion Questions** (Optional)
   - Questions with provided answers
   - For parent/teacher facilitated discussion

## Skills Taxonomy (58 Core Skills)

Stories map to a comprehensive 58-skill taxonomy including:
- Self-awareness (Selbstbewusstsein / الوعي الذاتي)
- Emotional regulation (Emotionskontrolle / التحكم في الانفعالات)
- Problem-solving (Problemlösung / حل المشكلات)
- Decision-making (Entscheidungsfindung / اتخاذ القرار)
- Effective communication (Kommunikation / التواصل الفعال)
- Empathy (Empathie / التعاطف)
- Adaptability to change (Anpassungsfähigkeit / التكيف مع التغيير)
- Patience & tolerance (Geduld / الصبر والتحمل)
- Impulse control (Impulskontrolle / ضبط الاندفاعية)
- [See full list in `/content/stories-index.md` Arabic section]

Each story should clearly map to 1-3 primary skills.

## Website Features & Requirements

### Phase 1: Core Features (MVP)

#### 1. Homepage
- **Hero Section**
  - Welcoming headline in primary language (German)
  - Brief mission statement
  - Language selector (flags: 🇩🇪 🇸🇦 🇬🇧 🇹🇷 🇵🇰)
  - Cheerful, child-friendly illustration or animation

- **Story Grid/List**
  - Card-based layout with story thumbnails
  - Display: Story emoji icon, title, primary skill tag
  - Filter by:
    - Skill/value category
    - Language
    - Age appropriateness (optional)
  - Search functionality (by keyword, character name, skill)

- **About Section**
  - Mission and target audience
  - How to use the stories
  - Contact information

#### 2. Story Detail Page

**Layout Structure:**

```
┌─────────────────────────────────────────┐
│  Language Selector (DE | AR | EN | TR | UR) │
├─────────────────────────────────────────┤
│  [Emoji Icon] Story Title               │
│  Skill Tags: #Empathy #Patience         │
├─────────────────────────────────────────┤
│                                         │
│  Main Story Content                     │
│  (with optional illustration placeholder) │
│                                         │
├─────────────────────────────────────────┤
│  🌟 Key Message Section                │
│  • Bullet point 1                      │
│  • Bullet point 2                      │
├─────────────────────────────────────────┤
│  Interactive Learning Activities        │
│                                         │
│  ✓ True/False Questions                │
│  ✓ Multiple Choice Quiz                │
│  ✓ Fill-in-the-Blank Exercise          │
│                                         │
│  [Show Answers Button]                  │
├─────────────────────────────────────────┤
│  Print-Friendly Version | Download PDF  │
└─────────────────────────────────────────┘
```

**Interactive Component:**
- Create an Astro component or vanilla JS widget for:
  - Quiz interaction (click to reveal answers)
  - Progress tracking (X/8 answered)
  - Immediate feedback (correct/incorrect)
  - No backend required - client-side only

**Example Component Structure:**
```astro
---
// QuizInteractive.astro
const { questions, type } = Astro.props;
// type: "truefalse" | "multiplechoice" | "fillinblank"
---

<div class="quiz-container" data-quiz-type={type}>
  <div class="quiz-progress">
    <span class="progress-text">0 / {questions.length}</span>
  </div>

  {questions.map((q, idx) => (
    <div class="quiz-question" data-question-id={idx}>
      <p class="question-text">{q.text}</p>
      <div class="answer-options">
        <!-- Render based on type -->
      </div>
      <div class="feedback" style="display:none">
        <!-- Correct/Incorrect feedback -->
      </div>
    </div>
  ))}
</div>

<script>
  // Vanilla JS for interactivity
  document.querySelectorAll('.quiz-container').forEach(container => {
    // Add click handlers, answer checking logic
  });
</script>

<style>
  /* Scoped component styles */
</style>
```

#### 3. Content Format Options

**Option A: Full Interactive Stories (Preferred)**
- Stories stored as markdown with YAML frontmatter
- Images in `/public/assets/stories/{story-id}/`
- Structure:
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
---

## Story (DE)
Es war einmal ein kleiner Bär namens Bruno...

## الرسالة (Key Message - AR)
...

## Interactive Activities
### True/False Questions
...
```

**Option B: Google Drive Embedded Stories**
- Display using Google Docs Viewer iframe
- Simpler implementation but less interactive
- Metadata stored separately for filtering/search

**Hybrid Approach (Recommended):**
- Phase 1: Start with 5-10 fully interactive stories (markdown)
- Phase 2: Add Google Drive integration for additional stories
- Clearly label which stories have interactive activities

#### 4. Navigation & UX

**Primary Navigation:**
- Home
- Stories (with filter sidebar)
- About
- How to Use (quick guide for parents/teachers)
- Language Selector (persistent)

**Accessibility Requirements:**
- WCAG 2.1 AA compliance
- RTL support for Arabic and Urdu
- High contrast text
- Keyboard navigation for all interactive elements
- Screen reader friendly
- Mobile-first responsive design

#### 5. Search & Filter System

**Filter Options:**
- By Skill Category (dropdown with 58 skills grouped into categories)
  - Emotional Skills
  - Social Skills
  - Cognitive Skills
  - Behavioral Skills
- By Character Type (animal tags)
- By Story Length (short/medium)
- By Language Availability (stories available in selected language)

**Search:**
- Instant search (no page reload)
- Search across: titles, skill tags, story summaries
- Multilingual search support

#### 6. Print & Download Features

**Print-Friendly CSS:**
- Remove navigation and interactive elements
- Optimize for A4/Letter paper
- Include story + activities with answer key
- QR code back to website (optional)

**PDF Generation:**
- Pre-generated PDFs for offline use
- Or client-side generation using jsPDF/Puppeteer at build time
- Separate PDF per language

### Phase 2: Enhanced Features (Post-MVP)

#### 7. Teacher/Parent Resource Section
- Downloadable activity worksheets
- Discussion guide templates
- Tips for facilitating story discussions
- Skill development tracking sheets
- Suggested follow-up activities (crafts, games, role-play)

#### 8. Progress Tracking (Optional - No Auth)
- Browser localStorage for tracking stories read
- "Mark as read" functionality
- "Favorite stories" list
- No backend required

#### 9. Additional Content Types
- Story collections by theme (e.g., "Emotions Week", "Friendship Stories")
- Illustrated story versions (with commissioned artwork)
- Audio narrations (accessibility + engagement)
- Animated story videos (long-term goal)

#### 10. Community Features (Future)
- Submit user feedback/story requests
- Translation contributions from community
- Teacher-submitted lesson plans using stories

## Design Guidelines

### Visual Identity

**Color Palette:**
- Primary: Warm, inviting colors (oranges, soft yellows, light blues)
- Avoid overly bright/aggressive colors
- Ensure sufficient contrast for readability
- Palette should work across all 5 language contexts

**Typography:**
- Sans-serif for body text (legibility for young readers/parents)
- Slightly larger than standard body text (16-18px base)
- Clear hierarchy (headings, subheadings, body)
- Fonts must support:
  - Latin (German, English, Turkish)
  - Arabic script (Arabic, Urdu) with proper RTL
  - Consider: Noto Sans family (comprehensive language support)

**Imagery & Icons:**
- Hand-drawn or soft illustration style
- Friendly animal characters
- Culturally neutral imagery
- Emoji icons for quick recognition
- Placeholder images if original illustrations not yet available

**Layout:**
- Generous whitespace
- Card-based design for story browsing
- Clear content sections
- Mobile-first responsive (majority of users on mobile)

### Tone & Voice

**Website Copy:**
- Warm, welcoming, encouraging
- Direct and clear (no jargon)
- Inclusive language
- Emphasize learning as fun and natural
- Multilingual UI labels carefully translated (not machine-translated)

## Content Management

### Story Content Sources

1. **Local Content (Phase 1)**
   - 40+ existing German stories in `/content/` directory
   - Convert .docx to markdown format
   - Structure with frontmatter metadata
   - Add translations progressively

2. **Google Drive Integration (Phase 2)**
   - Read-only access to shared Google Drive folder
   - Use Google Drive API or embedded viewer
   - Metadata sheet in Google Sheets for filtering
   - Stories displayed as embedded documents

3. **Content Pipeline**
   - Stories created/edited in Google Docs (easier for non-technical contributors)
   - Export to markdown for integration
   - CI/CD pipeline to sync periodically (GitHub Actions + Google Drive API)

### Translation Workflow

**Current State:** Stories exist in German only

**Translation Strategy:**
- Start with 5-10 high-priority stories fully translated
- Mark stories with available languages
- Allow filtering to show only stories in user's language
- Progressive translation over time
- Consider:
  - Professional translation (for accuracy)
  - Community-contributed translations (with review process)
  - AI-assisted translation with human review

## Hosting & Deployment

**Recommended Free Hosting:**
1. **Netlify** (Top choice)
   - Free tier: 100GB bandwidth/month
   - Automatic builds from GitHub
   - Built-in form handling (for contact/feedback)
   - Easy custom domain setup

2. **Vercel** (Alternative)
   - Generous free tier
   - Excellent Astro support
   - Fast global CDN

3. **Cloudflare Pages** (Alternative)
   - Unlimited bandwidth on free tier
   - Fast CDN
   - Good for static sites

**Domain:**
- lernen-mit-geschichten.de (or similar)
- Free SSL certificate included with all hosts

**GitHub Repository:**
- Public repo (aligns with non-profit, open mission)
- MIT or Creative Commons license for content
- Enable community contributions

## Development Roadmap

### Phase 1: MVP (4-6 weeks)
- Set up Astro project with i18n routing
- Create core page templates (home, story detail, about)
- Convert 5 German stories to markdown with full structure
- Implement interactive quiz component
- Implement search and filter functionality
- Responsive design and accessibility audit
- Deploy to Netlify

### Phase 2: Content Expansion (2-3 months)
- Translate 5 stories to all languages
- Convert additional 10-15 stories to markdown
- Implement Google Drive integration for remaining stories
- Add print/PDF functionality
- SEO optimization

### Phase 3: Enhanced Features (Ongoing)
- Teacher/parent resource section
- Progress tracking (localStorage)
- Audio narrations for stories
- Community feedback mechanism
- Analytics (privacy-respecting, e.g., Plausible)

## Technical Implementation Guide

### Astro Project Structure

```
lernen-mit-geschichten/
├── public/
│   ├── assets/
│   │   └── stories/
│   │       ├── 001-bruno/
│   │       │   ├── hero.jpg
│   │       │   └── character-bruno.svg
│   │       └── 009-milo/
│   └── fonts/
├── src/
│   ├── components/
│   │   ├── QuizInteractive.astro
│   │   ├── StoryCard.astro
│   │   ├── LanguageSelector.astro
│   │   ├── FilterSidebar.astro
│   │   └── SearchBar.astro
│   ├── content/
│   │   ├── config.ts (Content collections schema)
│   │   └── stories/
│   │       ├── de/
│   │       │   ├── 001-bruno.md
│   │       │   └── 009-milo.md
│   │       ├── ar/
│   │       ├── en/
│   │       ├── tr/
│   │       └── ur/
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── StoryLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── stories/
│   │   │   └── [lang]/
│   │   │       └── [slug].astro
│   │   ├── about.astro
│   │   └── how-to-use.astro
│   ├── styles/
│   │   ├── global.css
│   │   └── rtl.css (for Arabic/Urdu)
│   └── utils/
│       ├── i18n.ts
│       ├── skills-taxonomy.ts
│       └── search.ts
├── astro.config.mjs
└── package.json
```

### Content Collections Schema

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const storiesCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    titleAr: z.string().optional(),
    titleEn: z.string().optional(),
    titleTr: z.string().optional(),
    titleUr: z.string().optional(),
    emoji: z.string(),
    skills: z.array(z.string()),
    ageGroup: z.string(),
    languages: z.array(z.enum(['de', 'ar', 'en', 'tr', 'ur'])),
    storyId: z.string(),
    publishDate: z.date().optional(),
    author: z.string().optional(),
    characterType: z.string().optional(), // e.g., "bear", "cat", "mouse"
    difficulty: z.enum(['beginner', 'intermediate']).optional(),
    estimatedReadTime: z.number().optional(), // minutes
  }),
});

export const collections = {
  stories: storiesCollection,
};
```

### Skills Taxonomy Management

```typescript
// src/utils/skills-taxonomy.ts
export const skillsCategories = {
  emotional: {
    de: "Emotionale Fähigkeiten",
    ar: "المهارات العاطفية",
    en: "Emotional Skills",
    tr: "Duygusal Beceriler",
    ur: "جذباتی مہارتیں",
    skills: [
      {
        id: "self-awareness",
        de: "Selbstbewusstsein",
        ar: "الوعي الذاتي",
        en: "Self-Awareness",
        tr: "Öz farkındalık",
        ur: "خود آگاہی"
      },
      {
        id: "emotional-regulation",
        de: "Emotionskontrolle",
        ar: "التحكم في الانفعالات",
        en: "Emotional Regulation",
        tr: "Duygu kontrolü",
        ur: "جذباتی ضبط"
      },
      // ... rest of skills
    ]
  },
  social: { /* ... */ },
  cognitive: { /* ... */ },
  behavioral: { /* ... */ }
};
```

### Interactive Quiz Component Example

```astro
---
// src/components/QuizInteractive.astro
export interface QuizQuestion {
  id: string;
  text: string;
  type: 'truefalse' | 'multiplechoice' | 'fillinblank';
  correctAnswer: string | string[];
  options?: string[]; // for multiple choice
}

interface Props {
  questions: QuizQuestion[];
  language: string;
  storyId: string;
}

const { questions, language, storyId } = Astro.props;

const labels = {
  de: { correct: "Richtig!", incorrect: "Nicht ganz", progress: "Fortschritt" },
  ar: { correct: "صحيح!", incorrect: "غير صحيح", progress: "التقدم" },
  en: { correct: "Correct!", incorrect: "Try again", progress: "Progress" },
  tr: { correct: "Doğru!", incorrect: "Yanlış", progress: "İlerleme" },
  ur: { correct: "صحیح!", incorrect: "غلط", progress: "پیش رفت" }
};

const label = labels[language] || labels.de;
---

<div class="quiz-interactive" data-story-id={storyId} data-language={language}>
  <div class="quiz-header">
    <h3>{label.progress}: <span class="progress-count">0</span> / {questions.length}</h3>
  </div>

  {questions.map((q, idx) => (
    <div class="quiz-question" data-question-id={q.id} data-answer={JSON.stringify(q.correctAnswer)}>
      <p class="question-text">{idx + 1}. {q.text}</p>

      {q.type === 'truefalse' && (
        <div class="answer-options">
          <button class="option-btn" data-value="true">✓ {language === 'de' ? 'Richtig' : 'True'}</button>
          <button class="option-btn" data-value="false">✗ {language === 'de' ? 'Falsch' : 'False'}</button>
        </div>
      )}

      {q.type === 'multiplechoice' && q.options && (
        <div class="answer-options">
          {q.options.map((opt, i) => (
            <button class="option-btn" data-value={opt}>
              {String.fromCharCode(97 + i)}) {opt}
            </button>
          ))}
        </div>
      )}

      {q.type === 'fillinblank' && (
        <div class="answer-input">
          <input type="text" placeholder="..." class="fill-blank-input" />
          <button class="check-btn">Check</button>
        </div>
      )}

      <div class="feedback" style="display: none;">
        <span class="feedback-text"></span>
      </div>
    </div>
  ))}

  <button class="show-all-answers-btn">{language === 'de' ? 'Alle Antworten anzeigen' : 'Show All Answers'}</button>
</div>

<script>
  document.querySelectorAll('.quiz-interactive').forEach(quiz => {
    let correctCount = 0;
    const totalQuestions = quiz.querySelectorAll('.quiz-question').length;
    const progressSpan = quiz.querySelector('.progress-count');

    const updateProgress = () => {
      if (progressSpan) {
        progressSpan.textContent = correctCount.toString();
      }

      // Save progress to localStorage
      const storyId = quiz.getAttribute('data-story-id');
      if (storyId) {
        localStorage.setItem(`quiz-progress-${storyId}`, correctCount.toString());
      }
    };

    quiz.querySelectorAll('.quiz-question').forEach(question => {
      const correctAnswer = JSON.parse(question.getAttribute('data-answer') || '""');
      const feedbackDiv = question.querySelector('.feedback');
      const feedbackText = question.querySelector('.feedback-text');

      // Handle True/False and Multiple Choice buttons
      question.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const userAnswer = btn.getAttribute('data-value');
          const isCorrect = Array.isArray(correctAnswer)
            ? correctAnswer.includes(userAnswer)
            : userAnswer === correctAnswer.toString();

          // Show feedback
          if (feedbackDiv && feedbackText) {
            feedbackDiv.style.display = 'block';
            feedbackText.textContent = isCorrect ? '✓ Correct!' : '✗ Try again';
            feedbackDiv.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
          }

          // Update progress if correct
          if (isCorrect && !question.classList.contains('answered-correctly')) {
            question.classList.add('answered-correctly');
            correctCount++;
            updateProgress();
          }

          // Disable buttons after correct answer
          if (isCorrect) {
            question.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
          }
        });
      });

      // Handle Fill-in-the-Blank
      const checkBtn = question.querySelector('.check-btn');
      if (checkBtn) {
        checkBtn.addEventListener('click', () => {
          const input = question.querySelector('.fill-blank-input') as HTMLInputElement;
          if (!input) return;

          const userAnswer = input.value.trim().toLowerCase();
          const correctAnswers = Array.isArray(correctAnswer)
            ? correctAnswer.map(a => a.toLowerCase())
            : [correctAnswer.toString().toLowerCase()];

          const isCorrect = correctAnswers.some(ans => userAnswer.includes(ans));

          if (feedbackDiv && feedbackText) {
            feedbackDiv.style.display = 'block';
            feedbackText.textContent = isCorrect
              ? `✓ Correct! Answer: ${correctAnswers[0]}`
              : `✗ Try again. Hint: ${correctAnswers[0].substring(0, 2)}...`;
            feedbackDiv.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
          }

          if (isCorrect && !question.classList.contains('answered-correctly')) {
            question.classList.add('answered-correctly');
            correctCount++;
            updateProgress();
            input.disabled = true;
            checkBtn.disabled = true;
          }
        });
      }
    });

    // Show all answers button
    const showAllBtn = quiz.querySelector('.show-all-answers-btn');
    if (showAllBtn) {
      showAllBtn.addEventListener('click', () => {
        quiz.querySelectorAll('.quiz-question').forEach(q => {
          const feedback = q.querySelector('.feedback');
          const feedbackText = q.querySelector('.feedback-text');
          const correctAnswer = JSON.parse(q.getAttribute('data-answer') || '""');

          if (feedback && feedbackText) {
            feedback.style.display = 'block';
            feedback.className = 'feedback answer-revealed';
            feedbackText.textContent = `Answer: ${Array.isArray(correctAnswer) ? correctAnswer.join(' / ') : correctAnswer}`;
          }
        });
      });
    }
  });
</script>

<style>
  .quiz-interactive {
    background: #f9f9f9;
    padding: 2rem;
    border-radius: 12px;
    margin: 2rem 0;
  }

  .quiz-header h3 {
    color: #333;
    margin-bottom: 1.5rem;
  }

  .progress-count {
    color: #4CAF50;
    font-weight: bold;
  }

  .quiz-question {
    background: white;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .question-text {
    font-size: 1.1rem;
    margin-bottom: 1rem;
    color: #333;
  }

  .answer-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .option-btn {
    padding: 0.75rem 1rem;
    background: #fff;
    border: 2px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    font-size: 1rem;
  }

  .option-btn:hover:not(:disabled) {
    border-color: #4CAF50;
    background: #f0f8f0;
  }

  .option-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .answer-input {
    display: flex;
    gap: 0.5rem;
  }

  .fill-blank-input {
    flex: 1;
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
  }

  .check-btn {
    padding: 0.75rem 1.5rem;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .feedback {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 6px;
  }

  .feedback.correct {
    background: #d4edda;
    color: #155724;
  }

  .feedback.incorrect {
    background: #f8d7da;
    color: #721c24;
  }

  .feedback.answer-revealed {
    background: #d1ecf1;
    color: #0c5460;
  }

  .show-all-answers-btn {
    margin-top: 1.5rem;
    padding: 0.75rem 1.5rem;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
  }

  .show-all-answers-btn:hover {
    background: #0056b3;
  }

  /* RTL support for Arabic and Urdu */
  [dir="rtl"] .answer-options,
  [dir="rtl"] .option-btn {
    text-align: right;
  }
</style>
```

### Sample Story Markdown

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

## Geschichte (Deutsch)

Es war einmal ein kleiner Bär namens Bruno.
Bruno liebte Honig, Spielen im Wald und – ganz besonders – Klettern auf Bäume.

Eines Tages wollte Bruno seiner Freundin, der Eule Mila, zeigen, wie hoch er klettern konnte.
Er kletterte… höher… und noch höher… doch plötzlich rutschte er aus!

„Oh nein!", rief Bruno. Sein Herz klopfte laut wie eine Trommel.
Er setzte sich unten auf den Boden und sagte:
„Mein Bauch fühlt sich komisch an. Ich glaube, ich habe Angst."

Mila flatterte zu ihm und meinte:
„Gut, dass du das bemerkst, Bruno! Wenn du weißt, was du fühlst, kannst du besser damit umgehen."

Bruno überlegte. Dann grinste er:
„Wenn ich Angst habe, brauche ich eine Pause. Ich atme tief ein… und wieder aus."

Später, beim Spielen, stolperte Bruno über einen Stein.
Er knurrte: „Grrr, jetzt bin ich wütend!"
Mila nickte: „Du hast es erkannt! Und was machst du, wenn du wütend bist?"
Bruno dachte kurz nach.
„Ich stampfe einmal mit den Füßen, dann geht es mir besser!" – stampf, stampf!
Beide lachten.

Am Abend, als die Sonne unterging, sagte Bruno leise:
„Jetzt fühle ich mich glücklich. Ich habe gelernt:
Wenn ich meine Gefühle kenne, kann ich auch besser entscheiden, was ich tun soll."

Mila zwinkerte:
„Genau, Bruno. Das ist die Superkraft der Selbsterkenntnis!"

Und so schlief Bruno zufrieden ein – mit einem breiten Honiglächeln.

---

## 🌟 Die Botschaft für Kinder

- Wenn ich auf meinen Körper achte (mein Herz klopft, mein Bauch kribbelt …), dann merke ich: Ich fühle etwas.
- Wenn ich das Gefühl benenne (ängstlich, wütend, glücklich …), dann kann ich besser entscheiden, was ich tun möchte.
- So werde ich ein kleiner Experte für mich selbst – das ist Selbstbewusstsein!

---

## Interaktive Aktivitäten

### Richtig oder Falsch

questions:
  - id: "q1"
    text: "Bruno ist ein kleiner Hund."
    type: "truefalse"
    correctAnswer: "false"

  - id: "q2"
    text: "Bruno liebt Honig."
    type: "truefalse"
    correctAnswer: "true"

  - id: "q3"
    text: "Bruno klettert auf einen Baum und rutscht aus."
    type: "truefalse"
    correctAnswer: "true"

  - id: "q4"
    text: "Als Bruno Angst hat, merkt er: 'Mein Bauch fühlt sich komisch an.'"
    type: "truefalse"
    correctAnswer: "true"

  - id: "q5"
    text: "Mila ist eine Katze."
    type: "truefalse"
    correctAnswer: "false"

  - id: "q6"
    text: "Bruno sagt: 'Wenn ich wütend bin, stampfe ich mit den Füßen.'"
    type: "truefalse"
    correctAnswer: "true"

  - id: "q7"
    text: "Am Abend fühlt sich Bruno traurig."
    type: "truefalse"
    correctAnswer: "false"

  - id: "q8"
    text: "Bruno lernt: Wenn er seine Gefühle kennt, kann er besser entscheiden, was er tun soll."
    type: "truefalse"
    correctAnswer: "true"

### Multiple Choice

mcQuestions:
  - id: "mc1"
    text: "Wie heißt Brunos Freundin?"
    type: "multiplechoice"
    options: ["Lina", "Mila", "Tina"]
    correctAnswer: "Mila"

  - id: "mc2"
    text: "Was liebt Bruno besonders?"
    type: "multiplechoice"
    options: ["Schwimmen", "Klettern", "Malen"]
    correctAnswer: "Klettern"

  - id: "mc3"
    text: "Was macht Bruno, wenn er wütend ist?"
    type: "multiplechoice"
    options: ["Er stampft mit den Füßen", "Er schreit laut", "Er läuft weg"]
    correctAnswer: "Er stampft mit den Füßen"

### Lückentext (Fill-in-the-Blank)

fillInQuestions:
  - id: "fb1"
    text: "Bruno ist ein kleiner ________."
    type: "fillinblank"
    correctAnswer: ["Bär", "baer"]

  - id: "fb2"
    text: "Mila ist eine ________."
    type: "fillinblank"
    correctAnswer: ["Eule"]

  - id: "fb3"
    text: "Wenn Bruno Angst hat, atmet er tief ________ und wieder ________."
    type: "fillinblank"
    correctAnswer: ["ein", "aus"]

  - id: "fb4"
    text: "Am Abend fühlt sich Bruno ________."
    type: "fillinblank"
    correctAnswer: ["glücklich", "zufrieden", "froh"]
```

## SEO & Accessibility Checklist

### SEO
- [ ] Semantic HTML5 structure
- [ ] Meta descriptions in all 5 languages
- [ ] Open Graph tags for social sharing
- [ ] Sitemap.xml generation
- [ ] Structured data (Schema.org - Article/EducationalContent)
- [ ] Alt text for all images
- [ ] Canonical URLs for language variants
- [ ] Robots.txt
- [ ] Fast page load (target: < 2s)

### Accessibility
- [ ] ARIA labels for interactive elements
- [ ] Keyboard navigation tested
- [ ] Focus indicators visible
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Skip to content link
- [ ] Language tags (`lang` attribute) properly set
- [ ] Screen reader testing (NVDA/JAWS)
- [ ] RTL layout testing for Arabic/Urdu
- [ ] Mobile touch target size ≥ 44x44px

## Analytics & Privacy

**Privacy-First Analytics:**
- Use Plausible.io or Simple Analytics (GDPR-friendly, no cookies)
- Track only:
  - Page views
  - Story popularity
  - Language preferences
  - Search queries (anonymized)
- No personal data collection
- No third-party tracking scripts
- Clear privacy policy page

## Content License

**Recommended License:**
- Stories: Creative Commons BY-NC-SA 4.0
  - Attribution required
  - Non-commercial use
  - Share-alike
- Code: MIT License (open source)

## Success Metrics (Non-Technical)

- Number of stories available per language
- Story completion rate (via localStorage tracking)
- Most popular skills/topics
- Search query insights (what users look for)
- Feedback from teachers/parents
- Community translation contributions

## Assumptions Summary

1. **Content Format**: Stories follow consistent structure with narrative + message + 3 activity types
2. **Languages**: Start with German, progressively add translations (5 languages total)
3. **No Authentication**: Fully public website, no user accounts needed
4. **Offline-First for Activities**: Interactive quizzes work client-side, no backend
5. **Free Hosting**: Static site compatible with Netlify/Vercel free tiers
6. **Accessibility**: Prioritize screen reader support and mobile-first design
7. **Open Source**: Code and content publicly available on GitHub
8. **Hybrid Content**: Mix of local markdown stories (interactive) + Google Drive embedded stories (display-only)
9. **Progressive Enhancement**: Start with core features, add teacher resources later
10. **Community-Driven**: Open to contributions (translations, stories, feedback)

## Next Steps for Implementation

1. **Initialize Astro Project**
   ```bash
   npm create astro@latest lernen-mit-geschichten
   cd lernen-mit-geschichten
   npm install
   ```

2. **Set Up Content Collections**
   - Configure schema in `src/content/config.ts`
   - Convert first 5 stories from .docx to markdown
   - Create template for consistent story format

3. **Build Core Components**
   - LanguageSelector
   - StoryCard
   - QuizInteractive
   - FilterSidebar
   - SearchBar

4. **Design System Setup**
   - Define color palette
   - Typography system
   - Component library basics
   - RTL styles

5. **Implement i18n Routing**
   - `/de/stories/bruno`
   - `/ar/stories/bruno`
   - Automatic language detection
   - Language switcher

6. **Deploy MVP**
   - Connect GitHub repo to Netlify
   - Configure build settings
   - Custom domain setup
   - Test multilingual routing

7. **Content Migration**
   - Convert remaining stories
   - Commission/create illustrations
   - Translate priority stories
   - Populate skills taxonomy

8. **User Testing**
   - Test with parents/teachers
   - Accessibility audit
   - Mobile device testing
   - Cross-browser testing

## Reference Documents

- Full skills taxonomy: `/content/stories-index.md` (Arabic section with 58 skills)
- Example story structure: "Brunos bunte Gefühle" (Story #1)
- Example story structure: "Milo lernt, sich anzupassen" (Story #9)
- Current content: `/content/` directory (40+ .docx files)

## Contact & Collaboration

- GitHub Issues for bug reports and feature requests
- Community translation contributions welcome
- Teacher feedback form (to be created)
- Email contact for story submissions

---

**End of Comprehensive Generative Prompt**

*This document serves as a complete specification for building the "Lernen mit Geschichten" website. The next Claude agent should use this as the primary reference for implementation, referring back to original story files in `/content/` as needed for content conversion.*