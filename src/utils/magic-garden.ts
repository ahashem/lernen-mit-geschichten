/**
 * Magic Garden System
 * A nurturing, calming system where plants grow as children learn
 * Visualizes learning progress in a beautiful garden environment
 */

export type PlantGrowthStage = 'seed' | 'sprout' | 'seedling' | 'plant' | 'flower';
export type PlantType = 'flower' | 'vegetable' | 'tree';
export type PlantRarity = 'common' | 'uncommon' | 'rare';
export type GardenTheme = 'cottage' | 'zen' | 'tropical' | 'winter';
export type WeatherType = 'sunny' | 'rainy' | 'cloudy';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';

export interface PlantDefinition {
  id: string;
  name: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
  type: PlantType;
  rarity: PlantRarity;
  emoji: string;
  growthTime: number; // days to fully grow
  careNeeded: boolean; // needs daily watering
  harvestReward: number; // stars earned on harvest
  funFact: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
}

export interface GardenPlot {
  plotId: number; // 0-19 (4x5 grid)
  plantId: string | null;
  growthStage: PlantGrowthStage;
  growthProgress: number; // 0-100
  lastWatered: number | null; // timestamp
  needsWater: boolean;
  isWilted: boolean;
  plantedDate: number | null; // timestamp
  hasFertilizer: boolean;
}

export interface GardenDecoration {
  id: string;
  name: {
    de: string;
    en: string;
    ar: string;
    tr: string;
    ur: string;
  };
  emoji: string;
  type: 'fence' | 'path' | 'pond' | 'statue' | 'gnome';
  cost: number; // stars
  unlocked: boolean;
}

export interface GardenState {
  plots: GardenPlot[];
  theme: GardenTheme;
  decorations: string[]; // IDs of placed decorations
  weather: WeatherType;
  season: SeasonType;
  lastVisit: number; // timestamp
  totalPlantsGrown: number;
  totalHarvests: number;
  consecutiveDaysCare: number;
  seeds: Map<string, number>; // plantId -> count
  harvestedPlants: string[]; // IDs of plants harvested
  achievements: string[];
}

// Plant definitions - 30 unique plants
export const PLANT_DEFINITIONS: PlantDefinition[] = [
  // FLOWERS (15)
  {
    id: 'rose',
    name: { de: 'Rose', en: 'Rose', ar: 'وردة', tr: 'Gül', ur: 'گلاب' },
    type: 'flower',
    rarity: 'common',
    emoji: '🌹',
    growthTime: 3,
    careNeeded: true,
    harvestReward: 10,
    funFact: {
      de: 'Rosen gibt es in vielen Farben!',
      en: 'Roses come in many colors!',
      ar: 'الورود تأتي بألوان عديدة!',
      tr: 'Güller birçok renkte gelir!',
      ur: 'گلاب بہت سے رنگوں میں آتے ہیں!'
    }
  },
  {
    id: 'sunflower',
    name: { de: 'Sonnenblume', en: 'Sunflower', ar: 'عباد الشمس', tr: 'Ayçiçeği', ur: 'سورج مکھی' },
    type: 'flower',
    rarity: 'common',
    emoji: '🌻',
    growthTime: 4,
    careNeeded: true,
    harvestReward: 12,
    funFact: {
      de: 'Sonnenblumen folgen der Sonne!',
      en: 'Sunflowers follow the sun!',
      ar: 'عباد الشمس يتبع الشمس!',
      tr: 'Ayçiçekleri güneşi takip eder!',
      ur: 'سورج مکھی سورج کی پیروی کرتی ہے!'
    }
  },
  {
    id: 'tulip',
    name: { de: 'Tulpe', en: 'Tulip', ar: 'توليب', tr: 'Lale', ur: 'ٹیولپ' },
    type: 'flower',
    rarity: 'common',
    emoji: '🌷',
    growthTime: 2,
    careNeeded: true,
    harvestReward: 10,
    funFact: {
      de: 'Tulpen stammen aus der Türkei!',
      en: 'Tulips are from Turkey!',
      ar: 'الزنبق من تركيا!',
      tr: 'Laleler Türkiye\'dendir!',
      ur: 'ٹیولپ ترکی سے ہیں!'
    }
  },
  {
    id: 'daisy',
    name: { de: 'Gänseblümchen', en: 'Daisy', ar: 'أقحوان', tr: 'Papatya', ur: 'گل داؤدی' },
    type: 'flower',
    rarity: 'common',
    emoji: '🌼',
    growthTime: 2,
    careNeeded: false,
    harvestReward: 8,
    funFact: {
      de: 'Gänseblümchen schließen sich nachts!',
      en: 'Daisies close at night!',
      ar: 'الأقحوان يغلق في الليل!',
      tr: 'Papatyalar geceleri kapanır!',
      ur: 'گل داؤدی رات کو بند ہو جاتی ہے!'
    }
  },
  {
    id: 'lily',
    name: { de: 'Lilie', en: 'Lily', ar: 'زنبق', tr: 'Zambak', ur: 'للی' },
    type: 'flower',
    rarity: 'uncommon',
    emoji: '🌺',
    growthTime: 5,
    careNeeded: true,
    harvestReward: 15,
    funFact: {
      de: 'Lilien duften wunderbar!',
      en: 'Lilies smell wonderful!',
      ar: 'الزنابق رائحتها رائعة!',
      tr: 'Zambaklarin harika kokusu var!',
      ur: 'للی خوشبو دار ہوتی ہے!'
    }
  },
  {
    id: 'orchid',
    name: { de: 'Orchidee', en: 'Orchid', ar: 'أوركيد', tr: 'Orkide', ur: 'آرکڈ' },
    type: 'flower',
    rarity: 'rare',
    emoji: '🌸',
    growthTime: 7,
    careNeeded: true,
    harvestReward: 25,
    funFact: {
      de: 'Orchideen sind exotische Schönheiten!',
      en: 'Orchids are exotic beauties!',
      ar: 'الأوركيد جمال غريب!',
      tr: 'Orkideler egzotik güzelliklerdir!',
      ur: 'آرکڈ غیر ملکی خوبصورتی ہے!'
    }
  },
  {
    id: 'lavender',
    name: { de: 'Lavendel', en: 'Lavender', ar: 'لافندر', tr: 'Lavanta', ur: 'لیونڈر' },
    type: 'flower',
    rarity: 'uncommon',
    emoji: '💜',
    growthTime: 4,
    careNeeded: true,
    harvestReward: 18,
    funFact: {
      de: 'Lavendel hilft beim Einschlafen!',
      en: 'Lavender helps you sleep!',
      ar: 'اللافندر يساعد على النوم!',
      tr: 'Lavanta uyumaya yardımcı olur!',
      ur: 'لیونڈر سونے میں مدد کرتا ہے!'
    }
  },
  {
    id: 'bluebell',
    name: { de: 'Glockenblume', en: 'Bluebell', ar: 'جرس أزرق', tr: 'Çan Çiçeği', ur: 'نیلی گھنٹی' },
    type: 'flower',
    rarity: 'uncommon',
    emoji: '🔵',
    growthTime: 3,
    careNeeded: true,
    harvestReward: 14,
    funFact: {
      de: 'Glockenblumen klingen wie kleine Glocken!',
      en: 'Bluebells look like tiny bells!',
      ar: 'الأجراس الزرقاء تبدو مثل أجراس صغيرة!',
      tr: 'Çan çiçekleri küçük çanlar gibi görünür!',
      ur: 'نیلی گھنٹیاں چھوٹی گھنٹیوں کی طرح لگتی ہیں!'
    }
  },
  {
    id: 'cherry-blossom',
    name: { de: 'Kirschblüte', en: 'Cherry Blossom', ar: 'زهر الكرز', tr: 'Kiraz Çiçeği', ur: 'چیری کا پھول' },
    type: 'flower',
    rarity: 'rare',
    emoji: '🌸',
    growthTime: 6,
    careNeeded: true,
    harvestReward: 22,
    funFact: {
      de: 'Kirschblüten blühen nur kurz im Frühling!',
      en: 'Cherry blossoms bloom briefly in spring!',
      ar: 'زهر الكرز يزهر بإيجاز في الربيع!',
      tr: 'Kiraz çiçekleri ilkbaharda kısaca açar!',
      ur: 'چیری کے پھول بہار میں مختصر طور پر کھلتے ہیں!'
    }
  },
  {
    id: 'poppy',
    name: { de: 'Mohn', en: 'Poppy', ar: 'خشخاش', tr: 'Gelincik', ur: 'خشخاش' },
    type: 'flower',
    rarity: 'common',
    emoji: '🌺',
    growthTime: 3,
    careNeeded: false,
    harvestReward: 10,
    funFact: {
      de: 'Mohnblumen sind sehr zart!',
      en: 'Poppies are very delicate!',
      ar: 'الخشخاش رقيق جدًا!',
      tr: 'Gelincikler çok narin!',
      ur: 'خشخاش بہت نازک ہیں!'
    }
  },
  {
    id: 'carnation',
    name: { de: 'Nelke', en: 'Carnation', ar: 'قرنفل', tr: 'Karanfil', ur: 'قرنفل' },
    type: 'flower',
    rarity: 'common',
    emoji: '🌷',
    growthTime: 3,
    careNeeded: true,
    harvestReward: 11,
    funFact: {
      de: 'Nelken duften wie Gewürznelken!',
      en: 'Carnations smell like cloves!',
      ar: 'القرنفل رائحته مثل القرنفل!',
      tr: 'Karanfiller karanfil gibi kokar!',
      ur: 'قرنفل لونگ کی طرح خوشبو دار ہے!'
    }
  },
  {
    id: 'peony',
    name: { de: 'Pfingstrose', en: 'Peony', ar: 'فاوانيا', tr: 'Şakayık', ur: 'پیونی' },
    type: 'flower',
    rarity: 'rare',
    emoji: '🌺',
    growthTime: 7,
    careNeeded: true,
    harvestReward: 28,
    funFact: {
      de: 'Pfingstrosen können 100 Jahre alt werden!',
      en: 'Peonies can live 100 years!',
      ar: 'الفاوانيا يمكن أن تعيش 100 سنة!',
      tr: 'Şakayıklar 100 yıl yaşayabilir!',
      ur: 'پیونی 100 سال تک زندہ رہ سکتی ہے!'
    }
  },
  {
    id: 'iris',
    name: { de: 'Schwertlilie', en: 'Iris', ar: 'سوسن', tr: 'İris', ur: 'آئرس' },
    type: 'flower',
    rarity: 'uncommon',
    emoji: '🌼',
    growthTime: 4,
    careNeeded: true,
    harvestReward: 16,
    funFact: {
      de: 'Schwertlilien symbolisieren Hoffnung!',
      en: 'Irises symbolize hope!',
      ar: 'السوسن يرمز إلى الأمل!',
      tr: 'İrisler umudu sembolize eder!',
      ur: 'آئرس امید کی علامت ہے!'
    }
  },
  {
    id: 'hibiscus',
    name: { de: 'Hibiskus', en: 'Hibiscus', ar: 'كركديه', tr: 'Ebegümeci', ur: 'گڑہل' },
    type: 'flower',
    rarity: 'uncommon',
    emoji: '🌺',
    growthTime: 5,
    careNeeded: true,
    harvestReward: 17,
    funFact: {
      de: 'Hibiskus macht leckeren Tee!',
      en: 'Hibiscus makes delicious tea!',
      ar: 'الكركديه يصنع شاي لذيذ!',
      tr: 'Ebegümeci lezzetli çay yapar!',
      ur: 'گڑہل سے لذیذ چائے بنتی ہے!'
    }
  },
  {
    id: 'marigold',
    name: { de: 'Ringelblume', en: 'Marigold', ar: 'آذريون', tr: 'Kadife Çiçeği', ur: 'گیندا' },
    type: 'flower',
    rarity: 'common',
    emoji: '🌼',
    growthTime: 2,
    careNeeded: false,
    harvestReward: 9,
    funFact: {
      de: 'Ringelblumen vertreiben Insekten!',
      en: 'Marigolds repel insects!',
      ar: 'الآذريون يطرد الحشرات!',
      tr: 'Kadife çiçekleri böcekleri kovur!',
      ur: 'گیندا کیڑوں کو بھگاتا ہے!'
    }
  },

  // VEGETABLES (10)
  {
    id: 'carrot',
    name: { de: 'Karotte', en: 'Carrot', ar: 'جزر', tr: 'Havuç', ur: 'گاجر' },
    type: 'vegetable',
    rarity: 'common',
    emoji: '🥕',
    growthTime: 3,
    careNeeded: true,
    harvestReward: 12,
    funFact: {
      de: 'Karotten sind gut für die Augen!',
      en: 'Carrots are good for your eyes!',
      ar: 'الجزر مفيد للعيون!',
      tr: 'Havuç gözlere iyi gelir!',
      ur: 'گاجر آنکھوں کے لیے اچھا ہے!'
    }
  },
  {
    id: 'tomato',
    name: { de: 'Tomate', en: 'Tomato', ar: 'طماطم', tr: 'Domates', ur: 'ٹماٹر' },
    type: 'vegetable',
    rarity: 'common',
    emoji: '🍅',
    growthTime: 4,
    careNeeded: true,
    harvestReward: 13,
    funFact: {
      de: 'Tomaten sind eigentlich Früchte!',
      en: 'Tomatoes are actually fruits!',
      ar: 'الطماطم في الواقع فواكه!',
      tr: 'Domatesler aslında meyve!',
      ur: 'ٹماٹر دراصل پھل ہیں!'
    }
  },
  {
    id: 'pumpkin',
    name: { de: 'Kürbis', en: 'Pumpkin', ar: 'يقطين', tr: 'Balkabağı', ur: 'کدو' },
    type: 'vegetable',
    rarity: 'uncommon',
    emoji: '🎃',
    growthTime: 6,
    careNeeded: true,
    harvestReward: 20,
    funFact: {
      de: 'Kürbisse können sehr groß werden!',
      en: 'Pumpkins can grow very large!',
      ar: 'اليقطين يمكن أن ينمو كبيرًا جدًا!',
      tr: 'Balkabakları çok büyük olabilir!',
      ur: 'کدو بہت بڑے ہو سکتے ہیں!'
    }
  },
  {
    id: 'corn',
    name: { de: 'Mais', en: 'Corn', ar: 'ذرة', tr: 'Mısır', ur: 'مکئی' },
    type: 'vegetable',
    rarity: 'common',
    emoji: '🌽',
    growthTime: 5,
    careNeeded: true,
    harvestReward: 14,
    funFact: {
      de: 'Mais wächst sehr hoch!',
      en: 'Corn grows very tall!',
      ar: 'الذرة تنمو طويلة جدًا!',
      tr: 'Mısır çok uzun büyür!',
      ur: 'مکئی بہت اونچا ہوتا ہے!'
    }
  },
  {
    id: 'lettuce',
    name: { de: 'Salat', en: 'Lettuce', ar: 'خس', tr: 'Marul', ur: 'سلاد' },
    type: 'vegetable',
    rarity: 'common',
    emoji: '🥬',
    growthTime: 2,
    careNeeded: true,
    harvestReward: 10,
    funFact: {
      de: 'Salat wächst schnell!',
      en: 'Lettuce grows quickly!',
      ar: 'الخس ينمو بسرعة!',
      tr: 'Marul hızlı büyür!',
      ur: 'سلاد جلدی اگتا ہے!'
    }
  },
  {
    id: 'pepper',
    name: { de: 'Paprika', en: 'Pepper', ar: 'فلفل', tr: 'Biber', ur: 'مرچ' },
    type: 'vegetable',
    rarity: 'uncommon',
    emoji: '🌶️',
    growthTime: 5,
    careNeeded: true,
    harvestReward: 16,
    funFact: {
      de: 'Paprika gibt es in vielen Farben!',
      en: 'Peppers come in many colors!',
      ar: 'الفلفل يأتي بألوان عديدة!',
      tr: 'Biberler birçok renkte gelir!',
      ur: 'مرچ بہت سے رنگوں میں آتی ہے!'
    }
  },
  {
    id: 'eggplant',
    name: { de: 'Aubergine', en: 'Eggplant', ar: 'باذنجان', tr: 'Patlıcan', ur: 'بینگن' },
    type: 'vegetable',
    rarity: 'uncommon',
    emoji: '🍆',
    growthTime: 5,
    careNeeded: true,
    harvestReward: 15,
    funFact: {
      de: 'Auberginen sind lila Wunderwerke!',
      en: 'Eggplants are purple wonders!',
      ar: 'الباذنجان عجائب بنفسجية!',
      tr: 'Patlıcanlar mor harikalar!',
      ur: 'بینگن جامنی رنگ کا عجوبہ ہے!'
    }
  },
  {
    id: 'radish',
    name: { de: 'Radieschen', en: 'Radish', ar: 'فجل', tr: 'Turp', ur: 'مولی' },
    type: 'vegetable',
    rarity: 'common',
    emoji: '🔴',
    growthTime: 2,
    careNeeded: false,
    harvestReward: 8,
    funFact: {
      de: 'Radieschen wachsen in 3 Wochen!',
      en: 'Radishes grow in 3 weeks!',
      ar: 'الفجل ينمو في 3 أسابيع!',
      tr: 'Turp 3 haftada büyür!',
      ur: 'مولی 3 ہفتوں میں اگتی ہے!'
    }
  },
  {
    id: 'broccoli',
    name: { de: 'Brokkoli', en: 'Broccoli', ar: 'بروكلي', tr: 'Brokoli', ur: 'بروکولی' },
    type: 'vegetable',
    rarity: 'uncommon',
    emoji: '🥦',
    growthTime: 4,
    careNeeded: true,
    harvestReward: 14,
    funFact: {
      de: 'Brokkoli ist wie ein kleiner Baum!',
      en: 'Broccoli looks like a tiny tree!',
      ar: 'البروكلي يبدو مثل شجرة صغيرة!',
      tr: 'Brokoli küçük bir ağaç gibi!',
      ur: 'بروکولی چھوٹے درخت کی طرح لگتا ہے!'
    }
  },
  {
    id: 'strawberry',
    name: { de: 'Erdbeere', en: 'Strawberry', ar: 'فراولة', tr: 'Çilek', ur: 'اسٹرابیری' },
    type: 'vegetable',
    rarity: 'rare',
    emoji: '🍓',
    growthTime: 7,
    careNeeded: true,
    harvestReward: 25,
    funFact: {
      de: 'Erdbeeren sind die einzige Frucht mit Samen außen!',
      en: 'Strawberries have seeds on the outside!',
      ar: 'الفراولة لها بذور على الخارج!',
      tr: 'Çileklerin dışında tohum var!',
      ur: 'اسٹرابیری کے بیج باہر ہوتے ہیں!'
    }
  },

  // TREES (5)
  {
    id: 'apple-tree',
    name: { de: 'Apfelbaum', en: 'Apple Tree', ar: 'شجرة التفاح', tr: 'Elma Ağacı', ur: 'سیب کا درخت' },
    type: 'tree',
    rarity: 'uncommon',
    emoji: '🍎',
    growthTime: 10,
    careNeeded: true,
    harvestReward: 30,
    funFact: {
      de: 'Apfelbäume können über 100 Jahre alt werden!',
      en: 'Apple trees can live over 100 years!',
      ar: 'شجرة التفاح يمكن أن تعيش أكثر من 100 سنة!',
      tr: 'Elma ağaçları 100 yıldan fazla yaşayabilir!',
      ur: 'سیب کے درخت 100 سال سے زیادہ زندہ رہ سکتے ہیں!'
    }
  },
  {
    id: 'orange-tree',
    name: { de: 'Orangenbaum', en: 'Orange Tree', ar: 'شجرة البرتقال', tr: 'Portakal Ağacı', ur: 'سنگترے کا درخت' },
    type: 'tree',
    rarity: 'uncommon',
    emoji: '🍊',
    growthTime: 10,
    careNeeded: true,
    harvestReward: 32,
    funFact: {
      de: 'Orangenbäume duften wunderbar!',
      en: 'Orange trees smell amazing!',
      ar: 'شجرة البرتقال رائحتها رائعة!',
      tr: 'Portakal ağaçları harika kokar!',
      ur: 'سنگترے کے درخت بہت خوشبو دار ہوتے ہیں!'
    }
  },
  {
    id: 'cherry-tree',
    name: { de: 'Kirschbaum', en: 'Cherry Tree', ar: 'شجرة الكرز', tr: 'Kiraz Ağacı', ur: 'چیری کا درخت' },
    type: 'tree',
    rarity: 'rare',
    emoji: '🍒',
    growthTime: 12,
    careNeeded: true,
    harvestReward: 40,
    funFact: {
      de: 'Kirschbäume blühen wunderschön im Frühling!',
      en: 'Cherry trees bloom beautifully in spring!',
      ar: 'شجرة الكرز تزهر بشكل جميل في الربيع!',
      tr: 'Kiraz ağaçları ilkbaharda güzel çiçek açar!',
      ur: 'چیری کے درخت بہار میں خوبصورتی سے کھلتے ہیں!'
    }
  },
  {
    id: 'oak-tree',
    name: { de: 'Eichenbaum', en: 'Oak Tree', ar: 'شجرة البلوط', tr: 'Meşe Ağacı', ur: 'بلوط کا درخت' },
    type: 'tree',
    rarity: 'rare',
    emoji: '🌳',
    growthTime: 14,
    careNeeded: true,
    harvestReward: 45,
    funFact: {
      de: 'Eichen können 1000 Jahre alt werden!',
      en: 'Oak trees can live 1000 years!',
      ar: 'شجرة البلوط يمكن أن تعيش 1000 سنة!',
      tr: 'Meşe ağaçları 1000 yıl yaşayabilir!',
      ur: 'بلوط کے درخت 1000 سال تک زندہ رہ سکتے ہیں!'
    }
  },
  {
    id: 'pine-tree',
    name: { de: 'Kiefernbaum', en: 'Pine Tree', ar: 'شجرة الصنوبر', tr: 'Çam Ağacı', ur: 'چیڑ کا درخت' },
    type: 'tree',
    rarity: 'uncommon',
    emoji: '🌲',
    growthTime: 11,
    careNeeded: true,
    harvestReward: 35,
    funFact: {
      de: 'Kiefern bleiben das ganze Jahr grün!',
      en: 'Pines stay green all year!',
      ar: 'الصنوبر يبقى أخضر طوال العام!',
      tr: 'Çamlar yıl boyunca yeşil kalır!',
      ur: 'چیڑ سارا سال سبز رہتا ہے!'
    }
  }
];

// Garden decorations
export const GARDEN_DECORATIONS: GardenDecoration[] = [
  {
    id: 'wooden-fence',
    name: { de: 'Holzzaun', en: 'Wooden Fence', ar: 'سياج خشبي', tr: 'Ahşap Çit', ur: 'لکڑی کی باڑ' },
    emoji: '🪵',
    type: 'fence',
    cost: 50,
    unlocked: false
  },
  {
    id: 'stone-path',
    name: { de: 'Steinweg', en: 'Stone Path', ar: 'طريق حجري', tr: 'Taş Yol', ur: 'پتھر کا راستہ' },
    emoji: '🪨',
    type: 'path',
    cost: 40,
    unlocked: false
  },
  {
    id: 'pond',
    name: { de: 'Teich', en: 'Pond', ar: 'بركة', tr: 'Gölet', ur: 'تالاب' },
    emoji: '🌊',
    type: 'pond',
    cost: 100,
    unlocked: false
  },
  {
    id: 'garden-gnome',
    name: { de: 'Gartenzwerg', en: 'Garden Gnome', ar: 'قزم الحديقة', tr: 'Bahçe Cücesi', ur: 'باغ کا بونا' },
    emoji: '🧙',
    type: 'gnome',
    cost: 75,
    unlocked: false
  },
  {
    id: 'bird-statue',
    name: { de: 'Vogelstatue', en: 'Bird Statue', ar: 'تمثال طائر', tr: 'Kuş Heykeli', ur: 'پرندے کا مجسمہ' },
    emoji: '🦅',
    type: 'statue',
    cost: 60,
    unlocked: false
  }
];

export class MagicGarden {
  private storageKey = 'magic-garden-state';
  private state: GardenState;

  constructor() {
    this.state = this.loadState();
    this.updateGardenOnLoad();
  }

  private loadState(): GardenState {
    if (typeof window === 'undefined') {
      return this.getDefaultState();
    }

    const saved = localStorage.getItem(this.storageKey);
    if (!saved) {
      return this.getDefaultState();
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        seeds: new Map(Object.entries(parsed.seeds || {})),
        lastVisit: parsed.lastVisit || Date.now()
      };
    } catch (error) {
      console.error('Failed to load garden state:', error);
      return this.getDefaultState();
    }
  }

  private getDefaultState(): GardenState {
    // Initialize 20 empty plots (4x5 grid)
    const plots: GardenPlot[] = [];
    for (let i = 0; i < 20; i++) {
      plots.push({
        plotId: i,
        plantId: null,
        growthStage: 'seed',
        growthProgress: 0,
        lastWatered: null,
        needsWater: false,
        isWilted: false,
        plantedDate: null,
        hasFertilizer: false
      });
    }

    // Give starter seeds
    const starterSeeds = new Map<string, number>();
    starterSeeds.set('daisy', 3);
    starterSeeds.set('carrot', 2);
    starterSeeds.set('sunflower', 1);

    return {
      plots,
      theme: 'cottage',
      decorations: [],
      weather: 'sunny',
      season: this.getCurrentSeason(),
      lastVisit: Date.now(),
      totalPlantsGrown: 0,
      totalHarvests: 0,
      consecutiveDaysCare: 0,
      seeds: starterSeeds,
      harvestedPlants: [],
      achievements: []
    };
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;

    const serializable = {
      ...this.state,
      seeds: Object.fromEntries(this.state.seeds)
    };

    localStorage.setItem(this.storageKey, JSON.stringify(serializable));
  }

  // Update garden when page loads (plant growth, wilting, etc.)
  private updateGardenOnLoad(): void {
    const now = Date.now();
    const timeSinceLastVisit = now - this.state.lastVisit;
    const hoursPassed = timeSinceLastVisit / (1000 * 60 * 60);

    this.state.plots.forEach(plot => {
      if (plot.plantId && plot.plantedDate) {
        const plant = this.getPlantDefinition(plot.plantId);
        if (!plant) return;

        // Check if plant needs water (every 48 hours)
        if (plot.lastWatered) {
          const hoursSinceWatered = (now - plot.lastWatered) / (1000 * 60 * 60);
          if (hoursSinceWatered > 48) {
            plot.needsWater = true;
            if (hoursSinceWatered > 72) {
              plot.isWilted = true;
            }
          }
        } else {
          const hoursSincePlanted = (now - plot.plantedDate) / (1000 * 60 * 60);
          if (hoursSincePlanted > 24) {
            plot.needsWater = true;
          }
        }

        // Calculate growth progress
        if (!plot.isWilted) {
          const daysSincePlanted = (now - plot.plantedDate) / (1000 * 60 * 60 * 24);
          const growthRate = plot.hasFertilizer ? 1.5 : 1.0;
          const weatherBonus = this.state.weather === 'rainy' ? 1.2 : 1.0;
          const totalProgress = (daysSincePlanted / plant.growthTime) * 100 * growthRate * weatherBonus;
          plot.growthProgress = Math.min(100, totalProgress);

          // Update growth stage
          plot.growthStage = this.getGrowthStageFromProgress(plot.growthProgress);
        }
      }
    });

    // Update weather randomly
    if (hoursPassed > 12) {
      this.updateWeather();
    }

    this.state.lastVisit = now;
    this.saveState();
  }

  private getGrowthStageFromProgress(progress: number): PlantGrowthStage {
    if (progress < 20) return 'seed';
    if (progress < 40) return 'sprout';
    if (progress < 60) return 'seedling';
    if (progress < 80) return 'plant';
    return 'flower';
  }

  private getCurrentSeason(): SeasonType {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  private updateWeather(): void {
    const random = Math.random();
    if (random < 0.6) {
      this.state.weather = 'sunny';
    } else if (random < 0.85) {
      this.state.weather = 'cloudy';
    } else {
      this.state.weather = 'rainy';
    }
  }

  // Plant a seed in a plot
  plantSeed(plotId: number, plantId: string): boolean {
    const plot = this.state.plots[plotId];
    if (!plot || plot.plantId) return false; // Plot already has a plant

    const seedCount = this.state.seeds.get(plantId) || 0;
    if (seedCount <= 0) return false; // No seeds available

    plot.plantId = plantId;
    plot.plantedDate = Date.now();
    plot.growthProgress = 0;
    plot.growthStage = 'seed';
    plot.needsWater = false;
    plot.isWilted = false;
    plot.lastWatered = null;
    plot.hasFertilizer = false;

    // Deduct seed
    this.state.seeds.set(plantId, seedCount - 1);
    this.state.totalPlantsGrown++;

    this.saveState();
    return true;
  }

  // Water a plant
  waterPlant(plotId: number): boolean {
    const plot = this.state.plots[plotId];
    if (!plot || !plot.plantId) return false;

    plot.lastWatered = Date.now();
    plot.needsWater = false;

    // Recover from wilting
    if (plot.isWilted) {
      plot.isWilted = false;
    }

    this.saveState();
    return true;
  }

  // Water all plants (daily care)
  waterAllPlants(): number {
    let watered = 0;
    this.state.plots.forEach(plot => {
      if (plot.plantId && this.waterPlant(plot.plotId)) {
        watered++;
      }
    });

    // Track consecutive days care
    const lastCare = localStorage.getItem('last-garden-care');
    const today = new Date().toDateString();
    if (lastCare && new Date(lastCare).toDateString() === new Date(Date.now() - 86400000).toDateString()) {
      this.state.consecutiveDaysCare++;
    } else if (!lastCare || lastCare !== today) {
      this.state.consecutiveDaysCare = 1;
    }
    localStorage.setItem('last-garden-care', today);

    this.saveState();
    return watered;
  }

  // Use fertilizer on a plant (speeds growth by 50%)
  useFertilizer(plotId: number): boolean {
    const plot = this.state.plots[plotId];
    if (!plot || !plot.plantId || plot.hasFertilizer) return false;

    plot.hasFertilizer = true;
    this.saveState();
    return true;
  }

  // Harvest a fully grown plant
  harvestPlant(plotId: number): { success: boolean; stars?: number; plantId?: string } {
    const plot = this.state.plots[plotId];
    if (!plot || !plot.plantId || plot.growthProgress < 100) {
      return { success: false };
    }

    const plant = this.getPlantDefinition(plot.plantId);
    if (!plant) return { success: false };

    // Award stars
    const stars = plant.harvestReward;

    // Add seed back to inventory
    const currentSeeds = this.state.seeds.get(plot.plantId) || 0;
    this.state.seeds.set(plot.plantId, currentSeeds + 1);

    // Track harvest
    if (!this.state.harvestedPlants.includes(plot.plantId)) {
      this.state.harvestedPlants.push(plot.plantId);
    }
    this.state.totalHarvests++;

    const plantId = plot.plantId;

    // Clear the plot
    plot.plantId = null;
    plot.plantedDate = null;
    plot.growthProgress = 0;
    plot.growthStage = 'seed';
    plot.lastWatered = null;
    plot.needsWater = false;
    plot.isWilted = false;
    plot.hasFertilizer = false;

    this.saveState();

    return { success: true, stars, plantId };
  }

  // Earn seeds from learning activities
  earnSeeds(activityType: 'story' | 'quiz' | 'perfect-quiz' | 'game' | 'login'): string[] {
    const earnedSeeds: string[] = [];
    let count = 0;

    switch (activityType) {
      case 'story':
        count = 1;
        break;
      case 'quiz':
        count = 1;
        break;
      case 'perfect-quiz':
        count = 2;
        break;
      case 'game':
        count = 1;
        break;
      case 'login':
        count = 1;
        break;
    }

    for (let i = 0; i < count; i++) {
      const randomPlant = this.getRandomPlantByRarity();
      const current = this.state.seeds.get(randomPlant.id) || 0;
      this.state.seeds.set(randomPlant.id, current + 1);
      earnedSeeds.push(randomPlant.id);
    }

    this.saveState();
    return earnedSeeds;
  }

  private getRandomPlantByRarity(): PlantDefinition {
    const random = Math.random();
    let rarity: PlantRarity;

    if (random < 0.6) {
      rarity = 'common';
    } else if (random < 0.85) {
      rarity = 'uncommon';
    } else {
      rarity = 'rare';
    }

    const plantsOfRarity = PLANT_DEFINITIONS.filter(p => p.rarity === rarity);
    return plantsOfRarity[Math.floor(Math.random() * plantsOfRarity.length)];
  }

  // Get plant definition by ID
  getPlantDefinition(plantId: string): PlantDefinition | undefined {
    return PLANT_DEFINITIONS.find(p => p.id === plantId);
  }

  // Get all plants
  getAllPlants(): PlantDefinition[] {
    return PLANT_DEFINITIONS;
  }

  // Get garden state
  getState(): GardenState {
    return this.state;
  }

  // Get seeds inventory
  getSeeds(): Map<string, number> {
    return this.state.seeds;
  }

  // Get plot by ID
  getPlot(plotId: number): GardenPlot | undefined {
    return this.state.plots[plotId];
  }

  // Get all plots
  getAllPlots(): GardenPlot[] {
    return this.state.plots;
  }

  // Change garden theme
  changeTheme(theme: GardenTheme): void {
    this.state.theme = theme;
    this.saveState();
  }

  // Get daily goal status
  getDailyGoal(): { watered: boolean; storyRead: boolean; complete: boolean } {
    const today = new Date().toDateString();
    const lastCare = localStorage.getItem('last-garden-care');
    const watered = lastCare === today;

    const storyRead = false; // This would be checked from progress tracker

    return {
      watered,
      storyRead,
      complete: watered && storyRead
    };
  }

  // Get statistics
  getStatistics(): {
    totalPlantsGrown: number;
    totalHarvests: number;
    uniquePlantsHarvested: number;
    consecutiveDaysCare: number;
    totalSeeds: number;
  } {
    const totalSeeds = Array.from(this.state.seeds.values()).reduce((sum, count) => sum + count, 0);

    return {
      totalPlantsGrown: this.state.totalPlantsGrown,
      totalHarvests: this.state.totalHarvests,
      uniquePlantsHarvested: this.state.harvestedPlants.length,
      consecutiveDaysCare: this.state.consecutiveDaysCare,
      totalSeeds
    };
  }
}

// Global instance
export const magicGarden = new MagicGarden();
