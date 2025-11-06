/**
 * Story Fortune Teller - Magical recommendation system
 * Helps children discover the perfect story through mystical experiences
 */

export interface MoodOption {
  id: string;
  emoji: string;
  name: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  themes: string[]; // story moods that match this mood
  skills: string[]; // skills that help with this mood
}

export interface PersonalityQuestion {
  id: string;
  text: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  options: PersonalityOption[];
  weight: number; // how much this influences recommendation
}

export interface PersonalityOption {
  id: string;
  text: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  emoji: string;
  attributes: {
    characterType?: string;
    mood?: string;
    skills?: string[];
    difficulty?: string;
  };
}

export interface FortuneMethod {
  id: string;
  name: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  description: {
    de: string;
    ar: string;
    en: string;
    tr: string;
    ur: string;
  };
  icon: string;
}

export interface StoryRecommendation {
  storyId: string;
  score: number;
  reasons: string[];
  fortuneMessage: string;
}

export interface DailyFortune {
  date: string;
  storyId: string;
  luckyCharacter: string;
  bonusStars: number;
  theme: string;
  message: string;
}

// Mood options with emojis
export const MOODS: MoodOption[] = [
  {
    id: 'happy',
    emoji: '😊',
    name: {
      de: 'Fröhlich',
      ar: 'سعيد',
      en: 'Happy',
      tr: 'Mutlu',
      ur: 'خوش',
    },
    themes: ['happy', 'exciting', 'funny'],
    skills: ['cooperation', 'effective-communication', 'empathy'],
  },
  {
    id: 'sad',
    emoji: '😢',
    name: {
      de: 'Traurig',
      ar: 'حزين',
      en: 'Sad',
      tr: 'Üzgün',
      ur: 'اداس',
    },
    themes: ['calm', 'happy'],
    skills: ['emotional-regulation', 'self-awareness', 'empathy'],
  },
  {
    id: 'excited',
    emoji: '🤩',
    name: {
      de: 'Aufgeregt',
      ar: 'متحمس',
      en: 'Excited',
      tr: 'Heyecanlı',
      ur: 'پرجوش',
    },
    themes: ['exciting', 'adventurous'],
    skills: ['adaptability', 'goal-setting', 'leadership'],
  },
  {
    id: 'calm',
    emoji: '😌',
    name: {
      de: 'Ruhig',
      ar: 'هادئ',
      en: 'Calm',
      tr: 'Sakin',
      ur: 'پرسکون',
    },
    themes: ['calm', 'happy'],
    skills: ['patience', 'self-discipline', 'emotional-regulation'],
  },
  {
    id: 'curious',
    emoji: '🤔',
    name: {
      de: 'Neugierig',
      ar: 'فضولي',
      en: 'Curious',
      tr: 'Meraklı',
      ur: 'متجسس',
    },
    themes: ['mysterious', 'adventurous'],
    skills: ['critical-thinking', 'problem-solving', 'decision-making'],
  },
  {
    id: 'adventurous',
    emoji: '🗺️',
    name: {
      de: 'Abenteuerlich',
      ar: 'مغامر',
      en: 'Adventurous',
      tr: 'Maceraperest',
      ur: 'مہم جو',
    },
    themes: ['adventurous', 'exciting'],
    skills: ['adaptability', 'problem-solving', 'leadership'],
  },
  {
    id: 'silly',
    emoji: '😜',
    name: {
      de: 'Albern',
      ar: 'مرح',
      en: 'Silly',
      tr: 'Aptal',
      ur: 'بیوقوف',
    },
    themes: ['funny', 'happy'],
    skills: ['cooperation', 'effective-communication', 'empathy'],
  },
  {
    id: 'scared',
    emoji: '😨',
    name: {
      de: 'Ängstlich',
      ar: 'خائف',
      en: 'Scared',
      tr: 'Korkmuş',
      ur: 'خوفزدہ',
    },
    themes: ['calm', 'happy'],
    skills: ['emotional-regulation', 'impulse-control', 'self-awareness'],
  },
  {
    id: 'angry',
    emoji: '😠',
    name: {
      de: 'Wütend',
      ar: 'غاضب',
      en: 'Angry',
      tr: 'Kızgın',
      ur: 'ناراض',
    },
    themes: ['calm'],
    skills: ['emotional-regulation', 'impulse-control', 'conflict-resolution'],
  },
  {
    id: 'sleepy',
    emoji: '😴',
    name: {
      de: 'Müde',
      ar: 'نعسان',
      en: 'Sleepy',
      tr: 'Uykulu',
      ur: 'نیند میں',
    },
    themes: ['calm', 'happy'],
    skills: ['patience', 'self-discipline'],
  },
];

// Personality quiz questions
export const PERSONALITY_QUESTIONS: PersonalityQuestion[] = [
  {
    id: 'q1',
    text: {
      de: 'Was ist dein Lieblingstier?',
      ar: 'ما هو حيوانك المفضل؟',
      en: "What's your favorite animal?",
      tr: 'En sevdiğin hayvan nedir?',
      ur: 'آپ کا پسندیدہ جانور کیا ہے؟',
    },
    weight: 3,
    options: [
      {
        id: 'bear',
        text: { de: 'Bär', ar: 'دب', en: 'Bear', tr: 'Ayı', ur: 'ریچھ' },
        emoji: '🐻',
        attributes: { characterType: 'bear' },
      },
      {
        id: 'fox',
        text: { de: 'Fuchs', ar: 'ثعلب', en: 'Fox', tr: 'Tilki', ur: 'لومڑی' },
        emoji: '🦊',
        attributes: { characterType: 'fox' },
      },
      {
        id: 'rabbit',
        text: { de: 'Hase', ar: 'أرنب', en: 'Rabbit', tr: 'Tavşan', ur: 'خرگوش' },
        emoji: '🐰',
        attributes: { characterType: 'rabbit' },
      },
      {
        id: 'owl',
        text: { de: 'Eule', ar: 'بومة', en: 'Owl', tr: 'Baykuş', ur: 'الو' },
        emoji: '🦉',
        attributes: { characterType: 'owl' },
      },
    ],
  },
  {
    id: 'q2',
    text: {
      de: 'Möchtest du lieber ins Weltall fliegen oder den Ozean erkunden?',
      ar: 'هل تفضل الطيران إلى الفضاء أو استكشاف المحيط؟',
      en: 'Would you rather fly to space or explore the ocean?',
      tr: 'Uzaya uçmayı mı yoksa okyanusu keşfetmeyi mi tercih edersin?',
      ur: 'کیا آپ خلا میں جانا پسند کریں گے یا سمندر کی تلاش؟',
    },
    weight: 2,
    options: [
      {
        id: 'space',
        text: { de: 'Weltall', ar: 'الفضاء', en: 'Space', tr: 'Uzay', ur: 'خلا' },
        emoji: '🚀',
        attributes: { mood: 'adventurous', skills: ['adaptability', 'critical-thinking'] },
      },
      {
        id: 'ocean',
        text: { de: 'Ozean', ar: 'المحيط', en: 'Ocean', tr: 'Okyanus', ur: 'سمندر' },
        emoji: '🌊',
        attributes: { mood: 'mysterious', skills: ['problem-solving', 'decision-making'] },
      },
    ],
  },
  {
    id: 'q3',
    text: {
      de: 'Magst du Rätsel lösen oder Action haben?',
      ar: 'هل تحب حل الألغاز أو الحركة؟',
      en: 'Do you like solving puzzles or having action?',
      tr: 'Bulmaca çözmeyi mi yoksa aksiyon yapmayı mı seversin?',
      ur: 'کیا آپ پہیلیاں حل کرنا پسند کرتے ہیں یا ایکشن؟',
    },
    weight: 2,
    options: [
      {
        id: 'puzzles',
        text: { de: 'Rätsel', ar: 'ألغاز', en: 'Puzzles', tr: 'Bulmacalar', ur: 'پہیلیاں' },
        emoji: '🧩',
        attributes: { skills: ['problem-solving', 'critical-thinking'], difficulty: 'intermediate' },
      },
      {
        id: 'action',
        text: { de: 'Action', ar: 'حركة', en: 'Action', tr: 'Aksiyon', ur: 'ایکشن' },
        emoji: '⚡',
        attributes: { mood: 'exciting', difficulty: 'beginner' },
      },
    ],
  },
  {
    id: 'q4',
    text: {
      de: 'Wähle eine Farbe:',
      ar: 'اختر لونًا:',
      en: 'Pick a color:',
      tr: 'Bir renk seç:',
      ur: 'ایک رنگ منتخب کریں:',
    },
    weight: 1,
    options: [
      {
        id: 'red',
        text: { de: 'Rot', ar: 'أحمر', en: 'Red', tr: 'Kırmızı', ur: 'سرخ' },
        emoji: '🔴',
        attributes: { mood: 'exciting' },
      },
      {
        id: 'blue',
        text: { de: 'Blau', ar: 'أزرق', en: 'Blue', tr: 'Mavi', ur: 'نیلا' },
        emoji: '🔵',
        attributes: { mood: 'calm' },
      },
      {
        id: 'yellow',
        text: { de: 'Gelb', ar: 'أصفر', en: 'Yellow', tr: 'Sarı', ur: 'پیلا' },
        emoji: '🟡',
        attributes: { mood: 'happy' },
      },
      {
        id: 'purple',
        text: { de: 'Lila', ar: 'بنفسجي', en: 'Purple', tr: 'Mor', ur: 'جامنی' },
        emoji: '🟣',
        attributes: { mood: 'mysterious' },
      },
    ],
  },
  {
    id: 'q5',
    text: {
      de: 'Bist du ein Morgenmuffel oder eine Nachteule?',
      ar: 'هل أنت شخص صباحي أم ليلي؟',
      en: 'Are you a morning person or a night owl?',
      tr: 'Sabah insanı mısın yoksa gece kuşu musun?',
      ur: 'کیا آپ صبح کے آدمی ہیں یا رات کے الو؟',
    },
    weight: 1,
    options: [
      {
        id: 'morning',
        text: { de: 'Morgen', ar: 'صباح', en: 'Morning', tr: 'Sabah', ur: 'صبح' },
        emoji: '🌅',
        attributes: { mood: 'exciting' },
      },
      {
        id: 'night',
        text: { de: 'Nacht', ar: 'ليل', en: 'Night', tr: 'Gece', ur: 'رات' },
        emoji: '🌙',
        attributes: { mood: 'calm' },
      },
    ],
  },
];

// Fortune telling methods
export const FORTUNE_METHODS: FortuneMethod[] = [
  {
    id: 'crystal-ball',
    name: {
      de: 'Kristallkugel',
      ar: 'كرة بلورية',
      en: 'Crystal Ball',
      tr: 'Kristal Küre',
      ur: 'کرسٹل بال',
    },
    description: {
      de: 'Blicke in die mystische Kugel und entdecke deine Geschichte',
      ar: 'انظر في الكرة الصوفية واكتشف قصتك',
      en: 'Gaze into the mystical ball and discover your story',
      tr: 'Mistik küreye bak ve hikayeni keşfet',
      ur: 'صوفیانہ گیند میں دیکھیں اور اپنی کہانی دریافت کریں',
    },
    icon: '🔮',
  },
  {
    id: 'magic-cards',
    name: {
      de: 'Magische Karten',
      ar: 'البطاقات السحرية',
      en: 'Magic Cards',
      tr: 'Sihirli Kartlar',
      ur: 'جادوئی کارڈ',
    },
    description: {
      de: 'Ziehe drei Karten und erfahre dein Schicksal',
      ar: 'اسحب ثلاث بطاقات واعرف مصيرك',
      en: 'Draw three cards and learn your fate',
      tr: 'Üç kart çek ve kaderini öğren',
      ur: 'تین کارڈ نکالیں اور اپنی قسمت جانیں',
    },
    icon: '🎴',
  },
  {
    id: 'fortune-wheel',
    name: {
      de: 'Glücksrad',
      ar: 'عجلة الحظ',
      en: 'Fortune Wheel',
      tr: 'Şans Çarkı',
      ur: 'قسمت کا پہیہ',
    },
    description: {
      de: 'Drehe das Rad und lass das Schicksal entscheiden',
      ar: 'أدر العجلة ودع القدر يقرر',
      en: 'Spin the wheel and let fate decide',
      tr: 'Çarkı çevir ve kadere bırak',
      ur: 'پہیہ گھمائیں اور قسمت کو فیصلہ کرنے دیں',
    },
    icon: '🎡',
  },
  {
    id: 'tea-leaves',
    name: {
      de: 'Teeblätter',
      ar: 'أوراق الشاي',
      en: 'Tea Leaves',
      tr: 'Çay Yaprakları',
      ur: 'چائے کے پتے',
    },
    description: {
      de: 'Lies die Muster in der Teetasse',
      ar: 'اقرأ الأنماط في فنجان الشاي',
      en: 'Read the patterns in the tea cup',
      tr: 'Çay fincanındaki desenleri oku',
      ur: 'چائے کے کپ میں نمونے پڑھیں',
    },
    icon: '🍵',
  },
  {
    id: 'lucky-number',
    name: {
      de: 'Glückszahl',
      ar: 'الرقم المحظوظ',
      en: 'Lucky Number',
      tr: 'Şanslı Sayı',
      ur: 'خوش قسمت نمبر',
    },
    description: {
      de: 'Wähle deine Glückszahl und finde deine Geschichte',
      ar: 'اختر رقمك المحظوظ واعثر على قصتك',
      en: 'Pick your lucky number and find your story',
      tr: 'Şanslı numaranı seç ve hikayeni bul',
      ur: 'اپنا خوش قسمت نمبر منتخب کریں اور اپنی کہانی تلاش کریں',
    },
    icon: '🎲',
  },
];

// Mystical fortune messages (50+ variations)
export const FORTUNE_MESSAGES: Record<string, string[]> = {
  de: [
    'Die Sterne haben sich ausgerichtet, um dir über {story} zu erzählen...',
    'Eine weise Eule flüstert von der Geschichte von {story}...',
    'Die Magie offenbart die Geschichte von {story}...',
    'Die Waldgeister empfehlen {story}...',
    'Das Universum hat {story} für dich ausgewählt...',
    'Der Mond leuchtet auf {story}...',
    'Uralte Prophezeiungen sprechen von {story}...',
    'Die Kristallkugel zeigt {story}...',
    'Magische Winde tragen die Geschichte von {story}...',
    'Die Sterne tanzen und zeigen {story}...',
    'Ein mystischer Traum führt zu {story}...',
    'Die Feen des Waldes erzählen von {story}...',
    'Das Schicksal hat {story} gewählt...',
    'Verborgene Zauber enthüllen {story}...',
    'Der Kompass der Weisheit zeigt auf {story}...',
  ],
  ar: [
    'النجوم اصطفت لتخبرك عن {story}...',
    'بومة حكيمة تهمس بقصة {story}...',
    'السحر يكشف قصة {story}...',
    'أرواح الغابة توصي بـ {story}...',
    'اختار الكون {story} لك...',
    'القمر يضيء على {story}...',
    'النبوءات القديمة تتحدث عن {story}...',
    'الكرة البلورية تظهر {story}...',
    'الرياح السحرية تحمل قصة {story}...',
    'النجوم ترقص وتظهر {story}...',
    'حلم صوفي يقود إلى {story}...',
    'جنيات الغابة تحكي عن {story}...',
    'اختار القدر {story}...',
    'التعاويذ المخفية تكشف {story}...',
    'بوصلة الحكمة تشير إلى {story}...',
  ],
  en: [
    'The stars align to tell you about {story}...',
    'A wise owl whispers of the story of {story}...',
    'Magic reveals the story of {story}...',
    'The forest spirits recommend {story}...',
    'The universe has chosen {story} for you...',
    'The moon shines upon {story}...',
    'Ancient prophecies speak of {story}...',
    'The crystal ball shows {story}...',
    'Magical winds carry the tale of {story}...',
    'The stars dance and reveal {story}...',
    'A mystical dream leads to {story}...',
    'The fairies of the forest tell of {story}...',
    'Destiny has chosen {story}...',
    'Hidden spells unveil {story}...',
    'The compass of wisdom points to {story}...',
  ],
  tr: [
    'Yıldızlar size {story} hakkında anlatmak için sıralandı...',
    'Bilge bir baykuş {story} hikayesini fısıldıyor...',
    'Sihir {story} hikayesini ortaya çıkarıyor...',
    'Orman ruhları {story} önerir...',
    'Evren sizin için {story} seçti...',
    'Ay {story} üzerine parlıyor...',
    'Eski kehanetler {story} hakkında konuşuyor...',
    'Kristal küre {story} gösteriyor...',
    'Sihirli rüzgarlar {story} hikayesini taşıyor...',
    'Yıldızlar dans ediyor ve {story} açığa çıkıyor...',
    'Mistik bir rüya {story} yol gösteriyor...',
    'Orman perileri {story} anlatıyor...',
    'Kader {story} seçti...',
    'Gizli büyüler {story} ortaya çıkarıyor...',
    'Bilgelik pusulası {story} işaret ediyor...',
  ],
  ur: [
    'ستارے آپ کو {story} کے بارے میں بتانے کے لیے قطار میں ہیں...',
    'ایک عقلمند الو {story} کی کہانی کی سرگوشی کرتا ہے...',
    'جادو {story} کی کہانی ظاہر کرتا ہے...',
    'جنگل کی روحیں {story} کی سفارش کرتی ہیں...',
    'کائنات نے آپ کے لیے {story} کا انتخاب کیا ہے...',
    'چاند {story} پر چمکتا ہے...',
    'قدیم پیشین گوئیاں {story} کی بات کرتی ہیں...',
    'کرسٹل بال {story} دکھاتا ہے...',
    'جادوئی ہوائیں {story} کی کہانی لے جاتی ہیں...',
    'ستارے رقص کرتے ہیں اور {story} ظاہر کرتے ہیں...',
    'ایک صوفیانہ خواب {story} کی طرف لے جاتا ہے...',
    'جنگل کی پریاں {story} کے بارے میں بتاتی ہیں...',
    'قسمت نے {story} کا انتخاب کیا ہے...',
    'چھپے ہوئے منتر {story} کو ظاہر کرتے ہیں...',
    'حکمت کا کمپاس {story} کی طرف اشارہ کرتا ہے...',
  ],
};

/**
 * Fortune Teller class - main recommendation logic
 */
export class FortuneTeller {
  /**
   * Get recommendation based on mood
   */
  static recommendByMood(
    mood: string,
    stories: any[],
    recentStoryIds: string[] = []
  ): StoryRecommendation | null {
    const moodOption = MOODS.find(m => m.id === mood);
    if (!moodOption) return null;

    const scores = stories
      .filter(story => !recentStoryIds.includes(story.data.storyId))
      .map(story => {
        let score = 0;
        const reasons: string[] = [];

        // Match mood with story mood
        if (moodOption.themes.includes(story.data.mood || '')) {
          score += 5;
          reasons.push('mood_match');
        }

        // Match skills
        const matchingSkills = story.data.skills.filter((s: string) =>
          moodOption.skills.includes(s)
        );
        score += matchingSkills.length * 2;
        if (matchingSkills.length > 0) {
          reasons.push('skill_match');
        }

        return {
          storyId: story.data.storyId,
          score,
          reasons,
          story,
        };
      })
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scores.length === 0) return null;

    const top = scores[0];
    return {
      storyId: top.storyId,
      score: top.score,
      reasons: top.reasons,
      fortuneMessage: this.generateFortuneMessage(top.story.data.title, 'de'),
    };
  }

  /**
   * Get recommendation based on personality quiz answers
   */
  static recommendByPersonality(
    answers: Record<string, string>,
    stories: any[],
    recentStoryIds: string[] = []
  ): StoryRecommendation | null {
    const preferences = this.analyzePersonality(answers);

    const scores = stories
      .filter(story => !recentStoryIds.includes(story.data.storyId))
      .map(story => {
        let score = 0;
        const reasons: string[] = [];

        // Character type preference
        if (
          preferences.characterType &&
          story.data.characterType === preferences.characterType
        ) {
          score += 5;
          reasons.push('character_match');
        }

        // Mood preference
        if (preferences.mood && story.data.mood === preferences.mood) {
          score += 4;
          reasons.push('mood_match');
        }

        // Skills preference
        const matchingSkills = story.data.skills.filter((s: string) =>
          preferences.skills.includes(s)
        );
        score += matchingSkills.length * 2;
        if (matchingSkills.length > 0) {
          reasons.push('skill_match');
        }

        // Difficulty preference
        if (preferences.difficulty && story.data.difficulty === preferences.difficulty) {
          score += 3;
          reasons.push('difficulty_match');
        }

        return {
          storyId: story.data.storyId,
          score,
          reasons,
          story,
        };
      })
      .sort((a, b) => b.score - a.score);

    if (scores.length === 0) return null;

    const top = scores[0];
    return {
      storyId: top.storyId,
      score: top.score,
      reasons: top.reasons,
      fortuneMessage: this.generateFortuneMessage(top.story.data.title, 'de'),
    };
  }

  /**
   * Get random mystical recommendation
   */
  static recommendRandom(
    stories: any[],
    recentStoryIds: string[] = [],
    seed?: number
  ): StoryRecommendation | null {
    const availableStories = stories.filter(
      story => !recentStoryIds.includes(story.data.storyId)
    );

    if (availableStories.length === 0) return null;

    const index = seed
      ? Math.floor((seed % 100) / 100 * availableStories.length)
      : Math.floor(Math.random() * availableStories.length);

    const story = availableStories[index];

    return {
      storyId: story.data.storyId,
      score: 10,
      reasons: ['mystical_choice'],
      fortuneMessage: this.generateFortuneMessage(story.data.title, 'de'),
    };
  }

  /**
   * Get daily fortune (cached per day)
   */
  static getDailyFortune(stories: any[]): DailyFortune | null {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `daily-fortune-${today}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    // Generate new daily fortune
    const dateNumber = new Date().getDate() + new Date().getMonth() * 31;
    const recommendation = this.recommendRandom(stories, [], dateNumber);

    if (!recommendation) return null;

    const characters = ['bear', 'fox', 'owl', 'rabbit', 'squirrel'];
    const themes = ['friendship', 'courage', 'kindness', 'patience', 'wisdom'];

    const fortune: DailyFortune = {
      date: today,
      storyId: recommendation.storyId,
      luckyCharacter: characters[dateNumber % characters.length],
      bonusStars: 5 + (dateNumber % 6),
      theme: themes[dateNumber % themes.length],
      message: recommendation.fortuneMessage,
    };

    localStorage.setItem(cacheKey, JSON.stringify(fortune));
    return fortune;
  }

  /**
   * Analyze personality from quiz answers
   */
  private static analyzePersonality(answers: Record<string, string>): {
    characterType?: string;
    mood?: string;
    skills: string[];
    difficulty?: string;
  } {
    const preferences = {
      characterType: undefined as string | undefined,
      mood: undefined as string | undefined,
      skills: [] as string[],
      difficulty: undefined as string | undefined,
    };

    const moodCounts = new Map<string, number>();
    const difficultyCounts = new Map<string, number>();

    for (const [questionId, answerId] of Object.entries(answers)) {
      const question = PERSONALITY_QUESTIONS.find(q => q.id === questionId);
      if (!question) continue;

      const option = question.options.find(o => o.id === answerId);
      if (!option) continue;

      // Extract attributes
      if (option.attributes.characterType) {
        preferences.characterType = option.attributes.characterType;
      }

      if (option.attributes.mood) {
        const count = moodCounts.get(option.attributes.mood) || 0;
        moodCounts.set(option.attributes.mood, count + question.weight);
      }

      if (option.attributes.skills) {
        preferences.skills.push(...option.attributes.skills);
      }

      if (option.attributes.difficulty) {
        const count = difficultyCounts.get(option.attributes.difficulty) || 0;
        difficultyCounts.set(option.attributes.difficulty, count + 1);
      }
    }

    // Get most common mood
    if (moodCounts.size > 0) {
      preferences.mood = Array.from(moodCounts.entries())
        .sort((a, b) => b[1] - a[1])[0][0];
    }

    // Get most common difficulty
    if (difficultyCounts.size > 0) {
      preferences.difficulty = Array.from(difficultyCounts.entries())
        .sort((a, b) => b[1] - a[1])[0][0];
    }

    return preferences;
  }

  /**
   * Generate mystical fortune message
   */
  private static generateFortuneMessage(storyTitle: string, lang: string): string {
    const messages = FORTUNE_MESSAGES[lang] || FORTUNE_MESSAGES.en;
    const message = messages[Math.floor(Math.random() * messages.length)];
    return message.replace('{story}', storyTitle);
  }

  /**
   * Get recently read stories from localStorage
   */
  static getRecentStoryIds(limit: number = 5): string[] {
    const recentIds: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('story-view-')) {
        const storyId = key.replace('story-view-', '');
        recentIds.push(storyId);
      }
    }

    return recentIds.slice(0, limit);
  }

  /**
   * Track fortune usage
   */
  static trackFortuneUsage(method: string) {
    const key = 'fortune-usage-count';
    const count = parseInt(localStorage.getItem(key) || '0', 10);
    localStorage.setItem(key, (count + 1).toString());

    // Store last used method
    localStorage.setItem('last-fortune-method', method);
  }

  /**
   * Get fortune usage stats
   */
  static getFortuneStats(): {
    totalUses: number;
    lastMethod: string | null;
  } {
    return {
      totalUses: parseInt(localStorage.getItem('fortune-usage-count') || '0', 10),
      lastMethod: localStorage.getItem('last-fortune-method'),
    };
  }
}
