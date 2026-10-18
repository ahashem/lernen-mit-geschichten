export interface Skill {
  id: string;
  de: string;
  ar: string;
  en: string;
  tr: string;
  ur: string;
}

export interface SkillCategory {
  de: string;
  ar: string;
  en: string;
  tr: string;
  ur: string;
  skills: Skill[];
}

export const skillsCategories: Record<string, SkillCategory> = {
  emotional: {
    de: 'Emotionale Fähigkeiten',
    ar: 'المهارات العاطفية',
    en: 'Emotional Skills',
    tr: 'Duygusal Beceriler',
    ur: 'جذباتی مہارتیں',
    skills: [
      {
        id: 'self-awareness',
        de: 'Selbstbewusstsein',
        ar: 'الوعي الذاتي',
        en: 'Self-Awareness',
        tr: 'Öz farkındalık',
        ur: 'خود آگاہی',
      },
      {
        id: 'emotional-regulation',
        de: 'Emotionskontrolle',
        ar: 'التحكم في الانفعالات',
        en: 'Emotional Regulation',
        tr: 'Duygu kontrolü',
        ur: 'جذباتی ضبط',
      },
      {
        id: 'empathy',
        de: 'Empathie',
        ar: 'التعاطف',
        en: 'Empathy',
        tr: 'Empati',
        ur: 'ہمدردی',
      },
      {
        id: 'patience',
        de: 'Geduld',
        ar: 'الصبر والتحمل',
        en: 'Patience',
        tr: 'Sabır',
        ur: 'صبر',
      },
      {
        id: 'impulse-control',
        de: 'Impulskontrolle',
        ar: 'ضبط الاندفاعية',
        en: 'Impulse Control',
        tr: 'Dürtü kontrolü',
        ur: 'جذباتی قابو',
      },
      {
        id: 'anger-management',
        de: 'Umgang mit Wut',
        ar: 'إدارة الغضب',
        en: 'Anger Management',
        tr: 'Öfke yönetimi',
        ur: 'غصے پر قابو',
      },
      {
        id: 'emotional-expression',
        de: 'Gefühle ausdrücken',
        ar: 'التعبير عن المشاعر',
        en: 'Emotional Expression',
        tr: 'Duyguları ifade etme',
        ur: 'جذبات کا اظہار',
      },
      {
        id: 'courage',
        de: 'Mut',
        ar: 'الشجاعة',
        en: 'Courage',
        tr: 'Cesaret',
        ur: 'ہمت',
      },
      {
        id: 'self-confidence',
        de: 'Selbstvertrauen',
        ar: 'الثقة بالنفس',
        en: 'Self-Confidence',
        tr: 'Özgüven',
        ur: 'خود اعتمادی',
      },
    ],
  },
  social: {
    de: 'Soziale Fähigkeiten',
    ar: 'المهارات الاجتماعية',
    en: 'Social Skills',
    tr: 'Sosyal Beceriler',
    ur: 'سماجی مہارتیں',
    skills: [
      {
        id: 'effective-communication',
        de: 'Kommunikation',
        ar: 'التواصل الفعال',
        en: 'Effective Communication',
        tr: 'Etkili iletişim',
        ur: 'موثر رابطہ',
      },
      {
        id: 'cooperation',
        de: 'Zusammenarbeit',
        ar: 'التعاون',
        en: 'Cooperation',
        tr: 'İşbirliği',
        ur: 'تعاون',
      },
      {
        id: 'conflict-resolution',
        de: 'Konfliktlösung',
        ar: 'حل النزاعات',
        en: 'Conflict Resolution',
        tr: 'Çatışma çözümü',
        ur: 'تنازعات کا حل',
      },
      {
        id: 'leadership',
        de: 'Führung',
        ar: 'القيادة',
        en: 'Leadership',
        tr: 'Liderlik',
        ur: 'قیادت',
      },
      {
        id: 'respect',
        de: 'Respekt',
        ar: 'الاحترام',
        en: 'Respect',
        tr: 'Saygı',
        ur: 'احترام',
      },
      {
        id: 'sharing',
        de: 'Teilen',
        ar: 'المشاركة',
        en: 'Sharing',
        tr: 'Paylaşma',
        ur: 'بانٹنا',
      },
      {
        id: 'generosity',
        de: 'Großzügigkeit',
        ar: 'الكرم',
        en: 'Generosity',
        tr: 'Cömertlik',
        ur: 'سخاوت',
      },
    ],
  },
  cognitive: {
    de: 'Kognitive Fähigkeiten',
    ar: 'المهارات المعرفية',
    en: 'Cognitive Skills',
    tr: 'Bilişsel Beceriler',
    ur: 'ذہنی مہارتیں',
    skills: [
      {
        id: 'problem-solving',
        de: 'Problemlösung',
        ar: 'حل المشكلات',
        en: 'Problem-Solving',
        tr: 'Problem çözme',
        ur: 'مسئلہ حل کرنا',
      },
      {
        id: 'decision-making',
        de: 'Entscheidungsfindung',
        ar: 'اتخاذ القرار',
        en: 'Decision-Making',
        tr: 'Karar verme',
        ur: 'فیصلہ سازی',
      },
      {
        id: 'critical-thinking',
        de: 'Kritisches Denken',
        ar: 'التفكير النقدي',
        en: 'Critical Thinking',
        tr: 'Eleştirel düşünme',
        ur: 'تنقیدی سوچ',
      },
      {
        id: 'adaptability',
        de: 'Anpassungsfähigkeit',
        ar: 'التكيف مع التغيير',
        en: 'Adaptability',
        tr: 'Uyum yeteneği',
        ur: 'موافقت',
      },
      {
        id: 'goal-setting',
        de: 'Zielsetzung',
        ar: 'تحديد الأهداف',
        en: 'Goal-Setting',
        tr: 'Hedef belirleme',
        ur: 'مقصد مقرر کرنا',
      },
      {
        id: 'focus',
        de: 'Konzentration',
        ar: 'التركيز',
        en: 'Focus',
        tr: 'Odaklanma',
        ur: 'توجہ',
      },
    ],
  },
  behavioral: {
    de: 'Verhaltensfähigkeiten',
    ar: 'المهارات السلوكية',
    en: 'Behavioral Skills',
    tr: 'Davranışsal Beceriler',
    ur: 'رویہ کی مہارتیں',
    skills: [
      {
        id: 'responsibility',
        de: 'Verantwortung',
        ar: 'المسؤولية',
        en: 'Responsibility',
        tr: 'Sorumluluk',
        ur: 'ذمہ داری',
      },
      {
        id: 'honesty',
        de: 'Ehrlichkeit',
        ar: 'الصدق',
        en: 'Honesty',
        tr: 'Dürüstlük',
        ur: 'ایمانداری',
      },
      {
        id: 'persistence',
        de: 'Durchhaltevermögen',
        ar: 'المثابرة',
        en: 'Persistence',
        tr: 'Sebat',
        ur: 'استقامت',
      },
      {
        id: 'self-discipline',
        de: 'Selbstdisziplin',
        ar: 'الانضباط الذاتي',
        en: 'Self-Discipline',
        tr: 'Öz disiplin',
        ur: 'خود نظم و ضبط',
      },
      {
        id: 'time-management',
        de: 'Zeitmanagement',
        ar: 'إدارة الوقت',
        en: 'Time Management',
        tr: 'Zaman yönetimi',
        ur: 'وقت کا انتظام',
      },
      {
        id: 'motivation',
        de: 'Motivation',
        ar: 'الدافعية',
        en: 'Motivation',
        tr: 'Motivasyon',
        ur: 'ترغیب',
      },
      {
        id: 'delayed-gratification',
        de: 'Belohnungsaufschub',
        ar: 'تأجيل الإشباع',
        en: 'Delayed Gratification',
        tr: 'Ödülü erteleme',
        ur: 'خواہش کو مؤخر کرنا',
      },
      {
        id: 'organization',
        de: 'Organisation',
        ar: 'التنظيم',
        en: 'Organization',
        tr: 'Düzen',
        ur: 'ترتیب',
      },
    ],
  },
};

export function getAllSkills(): Skill[] {
  return Object.values(skillsCategories).flatMap(category => category.skills);
}

export function getSkillById(id: string): Skill | undefined {
  return getAllSkills().find(skill => skill.id === id);
}

export function getSkillsByIds(ids: string[]): Skill[] {
  return ids.map(id => getSkillById(id)).filter((skill): skill is Skill => skill !== undefined);
}
