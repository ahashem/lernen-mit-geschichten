const fs = require('fs');
const path = require('path');

// Stories that need questions added
const storiesToProcess = [
  { id: '005-mila', langs: ['de', 'en', 'tr', 'ar', 'ur'] },
  { id: '006-moritz', langs: ['de', 'en', 'tr', 'ar', 'ur'] },
  { id: '007-fritz-flamingo', langs: ['de', 'en', 'tr', 'ar', 'ur'] },
  { id: '008-dino', langs: ['de', 'en', 'tr', 'ar', 'ur'] },
  { id: '010-leo', langs: ['de', 'en', 'tr', 'ar', 'ur'] },
  { id: '018-timmi-zauberuhr', langs: ['de', 'en', 'tr', 'ar', 'ur'] },
  { id: '021-emil-flattergeist', langs: ['de', 'en'] },
];

function parseQuestions(content, lang) {
  const questions = [];

  // Find True/False questions section (standardized format)
  const trueFalseMatch = content.match(/❓\s*(?:Richtig oder Falsch|True or False|Doğru mu Yanlış mı|صح أم خطأ|صحیح یا غلط)([\s\S]*?)(?=❓|##|$)/);

  if (trueFalseMatch) {
    const tfSection = trueFalseMatch[1];

    // Parse True/False questions
    const tfLines = tfSection.split('\n').filter(l => l.trim());
    let currentQuestion = null;

    for (const line of tfLines) {
      // Skip separators
      if (line.match(/^-+$/)) continue;

      // Match numbered question
      const qMatch = line.match(/^\d+\.\s*(.+)/);
      if (qMatch) {
        currentQuestion = {
          id: `tf${questions.length + 1}`,
          text: qMatch[1].trim(),
          type: 'truefalse',
          correctAnswer: 'true' // default, will be updated
        };
      }

      // Detect answer with different markers
      if (currentQuestion) {
        const isCorrect = line.includes('✅') ||
                         line.includes('✔') ||
                         (line.includes('👉') && line.includes('Richtig')) ||
                         (line.includes('Richtig') && !line.includes('❌') && !line.includes('Falsch'));
        const isWrong = line.includes('❌') ||
                       (line.includes('👉') && line.includes('Falsch')) ||
                       line.includes('Falsch');

        if (isCorrect) {
          currentQuestion.correctAnswer = 'true';
          questions.push(currentQuestion);
          currentQuestion = null;
        } else if (isWrong) {
          currentQuestion.correctAnswer = 'false';
          questions.push(currentQuestion);
          currentQuestion = null;
        }
      }
    }
  }

  // Find Multiple Choice questions section (standardized format)
  const mcMatch = content.match(/❓\s*(?:Multiple-?Choice-?Fragen|Multiple Choice Questions|Çoktan Seçmeli.*|أسئلة الاختيار من متعدد|کثیر الانتخاب.*)([\s\S]*?)(?=##|$)/);

  if (mcMatch) {
    const mcSection = mcMatch[1];
    const questionBlocks = mcSection.split(/\n(?=\d+\.)/);

    for (const block of questionBlocks) {
      if (!block.trim()) continue;

      const lines = block.split('\n').filter(l => l.trim() && !l.match(/^-+$/));
      const qMatch = lines[0]?.match(/^\d+\.\s*(.+)/);

      if (qMatch) {
        const question = {
          id: `mc${questions.length + 1}`,
          text: qMatch[1].trim(),
          type: 'multiplechoice',
          options: [],
          correctAnswer: ''
        };

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i];

          // Match option or answer line
          const optMatch = line.match(/^[a-d]\)\s*(.+)/);
          const ansMatch = line.match(/👉\s*(?:Antwort|Answer|Cevap|الإجابة|جواب):\s*([a-d]\))\s*(.+)/);

          if (optMatch) {
            const optText = optMatch[1].replace(/✅|✓|🐭|🌸|🌵|🎵|☀️|🏃‍♂️|🧀|❤️|💖|🦕|🍪|👻|⏰|📚|🎲|😴/g, '').trim();
            question.options.push(optText);

            // Check if this is marked as correct inline
            if (line.includes('✅') || line.includes('✓')) {
              question.correctAnswer = optText;
            }
          } else if (ansMatch) {
            // Answer is on separate line with 👉
            const optLetter = ansMatch[1];
            const optIdx = optLetter.charCodeAt(0) - 'a'.charCodeAt(0);
            if (optIdx >= 0 && optIdx < question.options.length) {
              question.correctAnswer = question.options[optIdx];
            }
          }
        }

        if (question.options.length > 0 && question.correctAnswer) {
          questions.push(question);
        }
      }
    }
  }

  return questions;
}

function addQuestionsToFrontmatter(storyId, lang) {
  const filePath = path.join(__dirname, '..', 'src', 'content', 'stories', lang, `${storyId}.md`);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // Split frontmatter and content
  const parts = content.split('---');
  if (parts.length < 3) {
    console.log(`⚠️  Invalid frontmatter in ${filePath}`);
    return;
  }

  const frontmatter = parts[1];
  const bodyContent = parts.slice(2).join('---');

  // Parse questions from body
  const questions = parseQuestions(bodyContent, lang);

  if (questions.length === 0) {
    console.log(`⚠️  No questions found in ${storyId} (${lang})`);
    return;
  }

  // Check if questions already exist in frontmatter
  if (frontmatter.includes('questions:')) {
    console.log(`ℹ️  Questions already exist in ${storyId} (${lang}), skipping`);
    return;
  }

  // Add questions to frontmatter
  const questionsYaml = 'questions:\n' + questions.map(q => {
    let yaml = `  - id: "${q.id}"\n`;
    yaml += `    text: "${q.text}"\n`;
    yaml += `    type: "${q.type}"\n`;

    if (q.type === 'multiplechoice' && q.options) {
      yaml += `    options:\n`;
      q.options.forEach(opt => {
        yaml += `      - "${opt}"\n`;
      });
    }

    yaml += `    correctAnswer: "${q.correctAnswer}"\n`;
    return yaml;
  }).join('');

  const newFrontmatter = frontmatter.trim() + '\n' + questionsYaml;
  const newContent = '---\n' + newFrontmatter + '---' + parts.slice(2).join('---');

  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`✅ Added ${questions.length} questions to ${storyId} (${lang})`);
}

// Process all stories
console.log('🚀 Starting to add questions to frontmatter...\n');

for (const story of storiesToProcess) {
  console.log(`\n📚 Processing ${story.id}...`);

  for (const lang of story.langs) {
    addQuestionsToFrontmatter(story.id, lang);
  }
}

console.log('\n✨ Done!');
