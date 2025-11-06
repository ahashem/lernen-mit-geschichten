const fs = require('fs');
const path = require('path');

// Standard headers by language
const standardHeaders = {
  de: {
    truefalse: '❓ Richtig oder Falsch',
    multiplechoice: '❓ Multiple-Choice-Fragen'
  },
  en: {
    truefalse: '❓ True or False',
    multiplechoice: '❓ Multiple Choice Questions'
  },
  tr: {
    truefalse: '❓ Doğru mu Yanlış mı',
    multiplechoice: '❓ Çoktan Seçmeli Sorular'
  },
  ar: {
    truefalse: '❓ صح أم خطأ',
    multiplechoice: '❓ أسئلة الاختيار من متعدد'
  },
  ur: {
    truefalse: '❓ صحیح یا غلط',
    multiplechoice: '❓ کثیر الانتخاب سوالات'
  }
};

function getAllStoryFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllStoryFiles(filePath, fileList);
    } else if (file.endsWith('.md') && !file.startsWith('001-bruno')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Patterns to replace for True/False headers
const tfPatterns = [
  /[❓📝📚]\s*(?:Richtig oder Falsch\??|Fragen.*(?:zur Geschichte|Richtig oder Falsch)|True or False\??|Doğru mu Yanlış mı\??|صح أم خطأ|صحیح یا غلط)/g,
];

// Patterns to replace for Multiple Choice headers
const mcPatterns = [
  /[❓📝📚]\s*(?:Multiple-?Choice-?Fragen.*|Multiple Choice Questions.*|Çoktan Seçmeli.*|أسئلة الاختيار من متعدد|کثیر الانتخاب.*)/g,
];

function standardizeQuestions(filePath) {
  const lang = path.dirname(filePath).split('/').pop();
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = content;
  let changes = [];

  // Standardize True/False headers
  for (const pattern of tfPatterns) {
    if (pattern.test(modified)) {
      const before = modified.match(pattern)?.[0];
      modified = modified.replace(pattern, standardHeaders[lang].truefalse);
      if (before) {
        changes.push(`"${before}" → "${standardHeaders[lang].truefalse}"`);
      }
    }
  }

  // Standardize Multiple Choice headers
  for (const pattern of mcPatterns) {
    if (pattern.test(modified)) {
      const before = modified.match(pattern)?.[0];
      modified = modified.replace(pattern, standardHeaders[lang].multiplechoice);
      if (before) {
        changes.push(`"${before}" → "${standardHeaders[lang].multiplechoice}"`);
      }
    }
  }

  // Standardize answer markers
  // Replace 👉 Richtig with ✔️ Richtig
  modified = modified.replace(/👉\s*Richtig/g, '✔️ Richtig');
  modified = modified.replace(/👉\s*Falsch/g, '❌ Falsch');

  // Replace multiple ✅ with single ✔️
  modified = modified.replace(/✅/g, '✔️');

  if (modified !== content) {
    fs.writeFileSync(filePath, modified, 'utf8');
    console.log(`✅ Standardized ${path.basename(filePath)} (${lang})`);
    if (changes.length > 0) {
      changes.forEach(c => console.log(`   ${c}`));
    }
    return true;
  }

  return false;
}

// Find all story files
const storiesDir = path.join(__dirname, '..', 'src', 'content', 'stories');
const storyFiles = getAllStoryFiles(storiesDir);

console.log(`🚀 Standardizing question formats in ${storyFiles.length} stories...\n`);

let modifiedCount = 0;
storyFiles.forEach(file => {
  if (standardizeQuestions(file)) {
    modifiedCount++;
  }
});

console.log(`\n✨ Done! Modified ${modifiedCount} files.`);
