#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const stories = [
  { id: '002-fritz', emoji: '🐿️', title: 'Fritzchen und dem wütenden Eichhörnchen', skills: ['self-control', 'anger-management'], characterType: 'boy' },
  { id: '003-lina', emoji: '🍪', title: 'Lina und der große Keks', skills: ['patience', 'delayed-gratification'], characterType: 'girl' },
  { id: '004-tobi', emoji: '🍰', title: 'Tobi und der große Apfelkuchen', skills: ['sharing', 'generosity'], characterType: 'boy' },
  { id: '009-milo', emoji: '🐨', title: 'Milo lernt, sich anzupassen', skills: ['adaptability', 'flexibility'], characterType: 'koala' }
];

const langTitles = {
  '002-fritz': {
    de: '🐿️ Die Geschichte von Fritzchen',
    en: '🐿️ The Story of Fritzchen',
    tr: '🐿️ Fritzchen ve Kızgın Sincap Hikâyesi',
    ar: '🐿️ قِصَّةُ فْرِيتْسْشِن',
    ur: '🐿️ فریٹشن اور غصے والا گلہری کی کہانی'
  },
  '003-lina': {
    de: '🐭 "Lina und der große Keks"',
    en: '🐭 "Lina and the Big Cookie"',
    tr: '🐭 "Lina ve Büyük Kurabiye"',
    ar: '🐭 "لِينَا وَالبِسْكُويتَةُ الكَبِيرَةُ"',
    ur: '🐭 "لینا اور بڑا بسکٹ"'
  },
  '004-tobi': {
    de: '📖 Geschichte: Tobi und der große Apfelkuchen',
    en: '📖 Story: Tobi and the Big Apple',
    tr: '📖 Hikaye: Tobi',
    ar: '📖 قِصَّةُ: تُوبِي',
    ur: '📖 کہانی: ٹوبی'
  },
  '009-milo': {
    de: '🐾 Geschichte: Milo lernt',
    en: '🐾 Story: Milo Learns',
    tr: '🐾 Hikaye: Milo',
    ar: '🐾 قِصَّةُ: مِيلُو',
    ur: '🐾 کہانی: میلو'
  }
};

function extractLanguageSection(content, startMarker, nextMarker) {
  const startIdx = content.indexOf(startMarker);
  if (startIdx === -1) return null;

  const endIdx = nextMarker ? content.indexOf(nextMarker, startIdx + 50) : content.length;
  return content.substring(startIdx, endIdx !== -1 ? endIdx : content.length).trim();
}

function cleanContent(text) {
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ {2,}/g, ' ')
    .trim();
}

function generateFrontmatter(story, lang) {
  const titles = {
    '002-fritz': {
      de: 'Fritzchen und dem wütenden Eichhörnchen',
      en: "Fritzchen and the Angry Squirrel",
      tr: "Fritzchen ve Kızgın Sincap",
      ar: "فْرِيتْسْشِن وَالسِّنجابِ الغاضِبِ",
      ur: "فریٹشن اور غصے والا گلہری"
    },
    '003-lina': {
      de: 'Lina und der große Keks',
      en: "Lina and the Big Cookie",
      tr: "Lina ve Büyük Kurabiye",
      ar: "لِينَا وَالبِسْكُويتَةُ الكَبِيرَةُ",
      ur: "لینا اور بڑا بسکٹ"
    },
    '004-tobi': {
      de: 'Tobi und der große Apfelkuchen',
      en: "Tobi and the Big Apple Cake",
      tr: "Tobi ve Büyük Elma Keki",
      ar: "تُوبِي وَكَعْكَةُ التُّفَّاحِ الكَبِيرَةُ",
      ur: "ٹوبی اور بڑا سیب کا کیک"
    },
    '009-milo': {
      de: 'Milo lernt, sich anzupassen',
      en: "Milo Learns to Adapt",
      tr: "Milo Uyum Sağlamayı Öğreniyor",
      ar: "مِيلُو يَتَعَلَّمُ التَّكَيُّفَ",
      ur: "میلو ڈھلنا سیکھتا ہے"
    }
  };

  const title = titles[story.id][lang] || story.title;

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

  const storyTitles = langTitles[story.id];
  const langs = ['de', 'en', 'tr', 'ar', 'ur'];

  for (let i = 0; i < langs.length; i++) {
    const langCode = langs[i];
    const marker = storyTitles[langCode];
    const nextMarker = i < langs.length - 1 ? storyTitles[langs[i + 1]] : null;

    const section = extractLanguageSection(content, marker, nextMarker);

    if (!section) {
      console.log(`  ✗ ${langCode} - not found (marker: ${marker.substring(0, 30)}...)`);
      continue;
    }

    const cleanedContent = cleanContent(section);
    const frontmatter = generateFrontmatter(story, langCode);
    const fullMarkdown = frontmatter + cleanedContent;

    const outputPath = path.join('src/content/stories', langCode, `${story.id}.md`);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, fullMarkdown, 'utf-8');

    console.log(`  ✓ ${langCode} created`);
  }
}

console.log('\n✅ All stories converted!');
