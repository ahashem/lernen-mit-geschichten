#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const stories = [
  { id: '005-mila', emoji: '🎈', title: 'Mila und der Wunsch-Ballon', skills: ['communication', 'emotional-expression'], characterType: 'girl' },
  { id: '006-moritz', emoji: '🐭', title: 'Moritz, der kleinen Maus', skills: ['courage', 'self-confidence'], characterType: 'mouse' },
  { id: '007-fritz-flamingo', emoji: '🦩', title: 'Fritz der Flamingo lernt Ordnung', skills: ['organization', 'responsibility'], characterType: 'flamingo' },
  { id: '008-dino', emoji: '🦕', title: 'Dino Dino und das große Warten', skills: ['patience', 'delayed-gratification'], characterType: 'dinosaur' },
  { id: '010-leo', emoji: '🦁', title: 'Leo, der kleine Löwe, und die Belohnung', skills: ['motivation', 'goal-setting'], characterType: 'lion' },
  { id: '018-timmi-zauberuhr', emoji: '⏰', title: 'Timmi und die Zauberuhr', skills: ['time-management', 'organization'], characterType: 'boy' },
  { id: '019-finn', emoji: '🌰', title: 'Finn und die Riesen-Nuss', skills: ['teamwork', 'cooperation'], characterType: 'raccoon', useTitle: true },
  { id: '020-timmi-denkt', emoji: '🧠', title: 'Timmi denkt nach, bevor er handelt', skills: ['critical-thinking', 'decision-making'], characterType: 'boy' },
  { id: '021-emil-flattergeist', emoji: '👻', title: 'Emil und dem Flattergeist', skills: ['focus', 'attention'], characterType: 'boy' },
  { id: '022-emil-plan', emoji: '📝', title: 'Emil und dem verrückten Plan', skills: ['planning', 'problem-solving'], characterType: 'boy', useTitle: true }
];

// Language markers for each story (using emoji as the common marker)
const storyEmojiMarkers = {
  '005-mila': '📖',
  '006-moritz': '🐭',
  '007-fritz-flamingo': '🦩',
  '008-dino': '🦕',
  '010-leo': '🦁',
  '018-timmi-zauberuhr': '📖',
  '020-timmi-denkt': '📖',
  '021-emil-flattergeist': '📖',
  '022-emil-plan': '📖'
};

// For stories that use title markers instead of emoji
const storyTitleMarkers = {
  '019-finn': {
    de: 'Finn und die Riesen-Nuss',
    en: 'Finn and the Giant Nut',
    tr: 'Finn ve Dev Ceviz',
    ar: 'فِنّ وَالْجَوْزَةُ الْعِمْلَاقَةُ',
    ur: 'فن اور بڑا اخروٹ'
  },
  '022-emil-plan': {
    de: 'Die Geschichte von Emil und dem verrückten Plan',
    en: 'The Story of Emil and the Crazy Plan',
    tr: 'Emil ve Çılgın Plan',
    ar: 'إيميل والخطة المجنونة',
    ur: 'ایمیل اور پاگل منصوبہ'
  }
};

function extractLanguageSection(content, startMarker, endMarker) {
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return null;

  let endIdx = content.length;
  if (endMarker) {
    const foundEndIdx = content.indexOf(endMarker, startIdx + 50);
    if (foundEndIdx !== -1) {
      endIdx = foundEndIdx;
    }
  }

  return content.substring(startIdx, endIdx).trim();
}

function detectScriptType(text) {
  // Arabic script (includes Arabic and Urdu)
  if (/[\u0600-\u06FF\u0750-\u077F]/.test(text)) return 'arabic';
  // Latin script (German, English, Turkish)
  if (/[a-zA-ZäöüßÄÖÜğışİŞĞ]/.test(text)) return 'latin';
  return 'unknown';
}

function cleanLanguageSpecificContent(text, targetLang) {
  const lines = text.split('\n');
  const cleaned = [];

  const expectedScript = (targetLang === 'ar' || targetLang === 'ur') ? 'arabic' : 'latin';

  for (let line of lines) {
    const trimmed = line.trim();

    // Skip empty lines (we'll add them back with proper spacing)
    if (!trimmed) {
      cleaned.push('');
      continue;
    }

    // Skip conversational prompts/responses (common patterns)
    if (/^(حسناً|تمام|ممتاز|طبعًا|رائع|جميل)/i.test(trimmed)) continue;
    if (/^(هل تُ?ريد|هل تُ?حب|سأ)/i.test(trimmed)) continue;
    if (/^(Okay|Great|Perfect|Sure)/i.test(trimmed)) continue;

    // Check if line has significant content
    const hasContent = trimmed.replace(/[^\w\u0600-\u06FF\u0750-\u077F]/g, '').length > 3;
    if (!hasContent) {
      cleaned.push(line);
      continue;
    }

    // Get script type of the line
    const lineScript = detectScriptType(trimmed);

    // Keep lines that match expected script or are mixed (like questions with emojis)
    if (lineScript === expectedScript || lineScript === 'unknown') {
      cleaned.push(line);
    }
  }

  return cleaned.join('\n');
}

function cleanContent(text, lang) {
  let cleaned = text;

  // First, remove language-mismatched content
  cleaned = cleanLanguageSpecificContent(cleaned, lang);

  // Then apply general cleaning
  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ {2,}/g, ' ')
    .replace(/^---+$/gm, '---')
    .trim();

  return cleaned;
}

// Story titles by language
const storyTitles = {
  '005-mila': {
    de: 'Mila und der Wunsch-Ballon',
    en: 'Mila and the Wish Balloon',
    tr: 'Mila ve Dilek Balonu',
    ar: 'ميلا وَبالونُ الأُمْنِيَات',
    ur: 'میلا اور خواہش کا غبارہ'
  },
  '006-moritz': {
    de: 'Moritz, der kleinen Maus',
    en: 'Moritz, the Little Mouse',
    tr: "Moritz'in Hikâyesi – Küçük Fare",
    ar: 'موريتس، الْفَأْرِ الصَّغِيرِ',
    ur: 'مورِٹس کی کہانی – چھوٹا سا چوہا'
  },
  '007-fritz-flamingo': {
    de: 'Fritz der Flamingo lernt Ordnung',
    en: 'Fritz the Flamingo Learns Self-Organization',
    tr: 'Fritz Flamingo Düzeni Öğreniyor',
    ar: 'فْرِيتْسُ الفْلامِنْغُو يَتَعَلَّمُ التَّنْظِيمَ',
    ur: 'فریٹز فلیمنگو نے تنظیم سیکھ لی'
  },
  '008-dino': {
    de: 'Dino Dino und das große Warten',
    en: 'Dino Dino and the Big Waiting',
    tr: 'Dino Dino ve Büyük Bekleyiş',
    ar: 'دينُو دينُو وَالِانْتِظَارُ الْكَبِيرُ',
    ur: 'ڈینو ڈینو اور بڑی انتظار'
  },
  '010-leo': {
    de: 'Leo, der kleine Löwe, und die Belohnung',
    en: 'Leo, the Little Lion, and the Reward',
    tr: 'Küçük Aslan Leo ve Ödül',
    ar: 'لِيو، الأَسَدُ الصَّغِيرُ وَالمُكَافَأَةُ',
    ur: 'چھوٹا شیر لیو اور انعام'
  },
  '018-timmi-zauberuhr': {
    de: 'Timmi und die Zauberuhr',
    en: 'Timmy and the Magic Clock',
    tr: 'Timmi ve Sihirli Saat',
    ar: 'تِمِّي وَالسَّاعَةُ السِّحْرِيَّةُ',
    ur: 'ٹِمّی اور جادوئی گھڑی'
  },
  '019-finn': {
    de: 'Finn und die Riesen-Nuss',
    en: 'Finn and the Giant Nut',
    tr: 'Finn ve Dev Ceviz',
    ar: 'فِنّ وَالْجَوْزَةُ الْعِمْلَاقَةُ',
    ur: 'فن اور بڑا اخروٹ'
  },
  '020-timmi-denkt': {
    de: 'Timmi denkt nach, bevor er handelt',
    en: 'Timmi Thinks Before He Acts',
    tr: 'Timmi Düşünmeden Önce Düşünüyor',
    ar: 'تِمِّي يُفَكِّرُ قَبْلَ أَنْ يَتَصَرَّفَ',
    ur: 'ٹِمّی پہلے سوچتا ہے پھر کرتا ہے'
  },
  '021-emil-flattergeist': {
    de: 'Emil und dem Flattergeist',
    en: 'Emil and the Flutter Ghost',
    tr: 'Emil ve Dikkat Perisi',
    ar: 'إيمِيل وَالشَّبَحُ الطَّائِرُ',
    ur: 'ایمیل اور توجہ کی مکھی'
  },
  '022-emil-plan': {
    de: 'Emil und dem verrückten Plan',
    en: 'Emil and the Crazy Plan',
    tr: 'Emil ve Çılgın Plan',
    ar: 'إيمِيل وَالْخُطَّةُ الْمَجْنُونَةُ',
    ur: 'ایمیل اور پاگل منصوبہ'
  }
};

// Story headings by language
const storyHeadings = {
  de: '## Die Geschichte',
  en: '## The Story',
  tr: '## Hikâye',
  ar: '## القِصَّة',
  ur: '## کہانی'
};

function generateFrontmatter(story, lang) {
  const title = storyTitles[story.id]?.[lang] || story.title;

  return `---
title: "${title}"
emoji: "${story.emoji}"
skills: [${story.skills.map(s => `"${s}"`).join(', ')}]
ageGroup: "3-7"
languages: ["${lang}"]
storyId: "${story.id}"
publishDate: 2024-01-15
characterType: "${story.characterType}"
difficulty: "beginner"
estimatedReadTime: 3
---

`;
}

// Process all stories
for (const story of stories) {
  console.log(`\nProcessing ${story.id}...`);

  const txtPath = `scripts/extracted/${story.id}.txt`;
  if (!fs.existsSync(txtPath)) {
    console.log(`  ⚠️  File not found: ${txtPath}`);
    continue;
  }

  const content = fs.readFileSync(txtPath, 'utf-8');
  const langs = ['de', 'en', 'tr', 'ar', 'ur'];
  let matches = [];

  // Check if story uses title markers instead of emoji markers
  if (story.useTitle && storyTitleMarkers[story.id]) {
    const titleMarkers = storyTitleMarkers[story.id];
    for (const lang of langs) {
      const title = titleMarkers[lang];
      const idx = content.indexOf(title);
      if (idx !== -1) {
        matches.push({ index: idx, lang });
      }
    }
    // Sort by index
    matches.sort((a, b) => a.index - b.index);
  } else {
    // Use emoji markers
    const emoji = storyEmojiMarkers[story.id];
    if (!emoji) {
      console.log(`  ⚠️  No emoji marker defined for ${story.id}`);
      continue;
    }
    const emojiRegex = new RegExp(`^${emoji}[^\n]*`, 'gm');
    const emojiMatches = [...content.matchAll(emojiRegex)];
    matches = emojiMatches.slice(0, langs.length).map((m, i) => ({ index: m.index, lang: langs[i] }));
  }

  if (matches.length < 2) {
    console.log(`  ⚠️  Not enough language sections found (found ${matches.length})`);
    continue;
  }

  for (let i = 0; i < matches.length; i++) {
    const langCode = matches[i].lang;
    const startIdx = matches[i].index;
    const endIdx = i < matches.length - 1 ? matches[i + 1].index : content.length;

    const section = content.substring(startIdx, endIdx).trim();

    if (!section || section.length < 100) {
      console.log(`  ✗ ${langCode} - section too short or empty`);
      continue;
    }

    let cleanedContent = cleanContent(section, langCode);

    // Remove the emoji/title line if it's at the start
    cleanedContent = cleanedContent.replace(/^[📖🐭🦩🦕🦁⏰🌰🧠👻📝][^\n]*\n/, '');

    // Also remove title-based markers for stories that use them
    if (story.useTitle && storyTitleMarkers[story.id]) {
      const title = storyTitleMarkers[story.id][langCode];
      if (title) {
        cleanedContent = cleanedContent.replace(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n`), '');
      }
    }

    // Add story section heading if not present
    if (!cleanedContent.match(/^##\s/m)) {
      const heading = storyHeadings[langCode] || '## Die Geschichte';
      cleanedContent = heading + '\n\n' + cleanedContent;
    }

    const frontmatter = generateFrontmatter(story, langCode);
    const fullMarkdown = frontmatter + cleanedContent;

    const outputPath = path.join('src/content/stories', langCode, `${story.id}.md`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, fullMarkdown, 'utf-8');

    console.log(`  ✓ ${langCode} created`);
  }
}

console.log('\n✅ All stories converted!');
