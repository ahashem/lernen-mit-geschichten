// Trading Card Battle Game - Core Battle Mechanics
// Type definitions and game logic for character card battles

export type ElementType = 'Fire' | 'Water' | 'Earth' | 'Air' | 'Light' | 'Dark' | 'Nature';
export type Rarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type AbilityTrigger = 'onPlay' | 'onAttack' | 'onDefend' | 'onLowHP' | 'onElementMatch' | 'onTurnStart' | 'onTurnEnd';

export interface CardAbility {
  name: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  nameUr: string;
  description: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionTr: string;
  descriptionUr: string;
  trigger: AbilityTrigger;
  cost?: number; // Mana cost if manually activated
  cooldown?: number; // Turns before can use again
  effect: (battle: BattleState, cardId: string) => void;
}

export interface Card {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  nameTr: string;
  nameUr: string;
  character: string; // Story character name
  storyId: string; // Links to story
  emoji: string;
  element: ElementType;
  rarity: Rarity;

  // Base stats (level 1)
  baseAttack: number;
  baseDefense: number;
  baseHealth: number;
  manaCost: number;

  // Current stats (modified by level and effects)
  attack: number;
  defense: number;
  health: number;
  maxHealth: number;

  level: number;
  xp: number;
  xpToNextLevel: number;

  ability: CardAbility;

  // Visual properties
  isShiny: boolean;
  artVariant: 'normal' | 'evolved1' | 'evolved2';

  // Game state
  isInPlay: boolean;
  canAttack: boolean;
  canDefend: boolean;
  abilityCooldown: number;
  statusEffects: StatusEffect[];
}

export interface StatusEffect {
  type: 'poison' | 'burn' | 'freeze' | 'stun' | 'shield' | 'strengthen' | 'weaken';
  duration: number;
  value: number;
}

export interface BattleCard extends Card {
  position: number; // 0-2 for field positions
  owner: 'player' | 'opponent';
}

export interface Player {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  deck: Card[];
  hand: Card[];
  field: (BattleCard | null)[];
  graveyard: Card[];
}

export interface BattleState {
  id: string;
  player: Player;
  opponent: Player;
  turn: number;
  currentPlayer: 'player' | 'opponent';
  phase: 'draw' | 'main' | 'battle' | 'end';
  winner: 'player' | 'opponent' | null;
  battleLog: BattleLogEntry[];
}

export interface BattleLogEntry {
  turn: number;
  action: string;
  actionAr: string;
  actionEn: string;
  actionTr: string;
  actionUr: string;
  timestamp: number;
}

// Card Database - 30+ unique cards from story characters
export const CARD_DATABASE: Omit<Card, 'attack' | 'defense' | 'health' | 'maxHealth' | 'level' | 'xp' | 'xpToNextLevel' | 'isInPlay' | 'canAttack' | 'canDefend' | 'abilityCooldown' | 'statusEffects' | 'isShiny' | 'artVariant'>[] = [
  {
    id: 'bruno-bear',
    name: 'Bruno der Bär',
    nameAr: 'برونو الدب',
    nameEn: 'Bruno the Bear',
    nameTr: 'Ayı Bruno',
    nameUr: 'برونو ریچھ',
    character: 'Bruno',
    storyId: '001-bruno',
    emoji: '🐻',
    element: 'Earth',
    rarity: 'Rare',
    baseAttack: 6,
    baseDefense: 7,
    baseHealth: 35,
    manaCost: 3,
    ability: {
      name: 'Winterschlaf',
      nameAr: 'سبات شتوي',
      nameEn: 'Hibernate',
      nameTr: 'Kış Uykusu',
      nameUr: 'موسم سرما کی نیند',
      description: 'Heile 10 HP, überspringe 1 Zug',
      descriptionAr: 'استعادة 10 نقاط صحة، تخطي دور واحد',
      descriptionEn: 'Heal 10 HP, skip 1 turn',
      descriptionTr: '10 HP iyileştir, 1 tur atla',
      descriptionUr: '10 HP بحال کریں، 1 موڑ چھوڑ دیں',
      trigger: 'onLowHP',
      cooldown: 3,
      effect: (battle, cardId) => {
        const card = findCardInBattle(battle, cardId);
        if (card && card.health < card.maxHealth * 0.3) {
          card.health = Math.min(card.maxHealth, card.health + 10);
          card.canAttack = false;
          card.canDefend = false;
        }
      }
    }
  },
  {
    id: 'fritz-squirrel',
    name: 'Fritzchen Eichhörnchen',
    nameAr: 'فريتزشن السنجاب',
    nameEn: 'Fritz the Squirrel',
    nameTr: 'Sincap Fritz',
    nameUr: 'فرٹز گلہری',
    character: 'Fritzchen',
    storyId: '002-fritz',
    emoji: '🐿️',
    element: 'Nature',
    rarity: 'Common',
    baseAttack: 7,
    baseDefense: 4,
    baseHealth: 25,
    manaCost: 2,
    ability: {
      name: 'Verschlagenheit',
      nameAr: 'الدهاء',
      nameEn: 'Cunning',
      nameTr: 'Kurnazlık',
      nameUr: 'چالاکی',
      description: 'Nächster Angriff verursacht doppelten Schaden',
      descriptionAr: 'الهجوم التالي يسبب ضررًا مضاعفًا',
      descriptionEn: 'Next attack deals double damage',
      descriptionTr: 'Sonraki saldırı çift hasar verir',
      descriptionUr: 'اگلا حملہ دوگنا نقصان پہنچائے گا',
      trigger: 'onAttack',
      cost: 1,
      cooldown: 2,
      effect: (battle, cardId) => {
        const card = findCardInBattle(battle, cardId);
        if (card) {
          card.statusEffects.push({ type: 'strengthen', duration: 1, value: 2 });
        }
      }
    }
  },
  {
    id: 'lina-mouse',
    name: 'Lina die Maus',
    nameAr: 'لينا الفأر',
    nameEn: 'Lina the Mouse',
    nameTr: 'Fare Lina',
    nameUr: 'لینا چوہا',
    character: 'Lina',
    storyId: '003-lina',
    emoji: '🐭',
    element: 'Light',
    rarity: 'Common',
    baseAttack: 5,
    baseDefense: 5,
    baseHealth: 20,
    manaCost: 2,
    ability: {
      name: 'Geduld',
      nameAr: 'الصبر',
      nameEn: 'Patience',
      nameTr: 'Sabır',
      nameUr: 'صبر',
      description: 'Gewinne +1 Angriff pro Zug gewartet',
      descriptionAr: 'احصل على +1 هجوم لكل دور منتظر',
      descriptionEn: 'Gain +1 attack per turn waited',
      descriptionTr: 'Beklenen her tur için +1 saldırı kazan',
      descriptionUr: 'ہر انتظار کردہ موڑ کے لیے +1 حملہ حاصل کریں',
      trigger: 'onTurnEnd',
      effect: (battle, cardId) => {
        const card = findCardInBattle(battle, cardId);
        if (card && !card.canAttack) {
          card.attack += 1;
        }
      }
    }
  },
  {
    id: 'tobi-turtle',
    name: 'Tobi die Schildkröte',
    nameAr: 'توبي السلحفاة',
    nameEn: 'Tobi the Turtle',
    nameTr: 'Kaplumbağa Tobi',
    nameUr: 'ٹوبی کچھوا',
    character: 'Tobi',
    storyId: '004-tobi',
    emoji: '🐢',
    element: 'Water',
    rarity: 'Rare',
    baseAttack: 4,
    baseDefense: 9,
    baseHealth: 40,
    manaCost: 3,
    ability: {
      name: 'Schutzpanzer',
      nameAr: 'درع واقي',
      nameEn: 'Shell Shield',
      nameTr: 'Kabuk Kalkanı',
      nameUr: 'خول کی ڈھال',
      description: 'Blockiere den nächsten Angriff vollständig',
      descriptionAr: 'احجب الهجوم التالي تمامًا',
      descriptionEn: 'Block next attack completely',
      descriptionTr: 'Sonraki saldırıyı tamamen engelle',
      descriptionUr: 'اگلے حملے کو مکمل طور پر روکیں',
      trigger: 'onDefend',
      cost: 2,
      cooldown: 3,
      effect: (battle, cardId) => {
        const card = findCardInBattle(battle, cardId);
        if (card) {
          card.statusEffects.push({ type: 'shield', duration: 1, value: 999 });
        }
      }
    }
  },
  {
    id: 'mila-butterfly',
    name: 'Mila der Schmetterling',
    nameAr: 'ميلا الفراشة',
    nameEn: 'Mila the Butterfly',
    nameTr: 'Kelebek Mila',
    nameUr: 'میلا تتلی',
    character: 'Mila',
    storyId: '005-mila',
    emoji: '🦋',
    element: 'Air',
    rarity: 'Epic',
    baseAttack: 8,
    baseDefense: 3,
    baseHealth: 22,
    manaCost: 3,
    ability: {
      name: 'Schneller Flügelschlag',
      nameAr: 'رفرفة سريعة',
      nameEn: 'Quick Dash',
      nameTr: 'Hızlı Hamle',
      nameUr: 'تیز رفتار',
      description: 'Greife zweimal in diesem Zug an',
      descriptionAr: 'هاجم مرتين في هذا الدور',
      descriptionEn: 'Attack twice this turn',
      descriptionTr: 'Bu turda iki kez saldır',
      descriptionUr: 'اس موڑ میں دو بار حملہ کریں',
      trigger: 'onAttack',
      cost: 2,
      cooldown: 3,
      effect: (battle, cardId) => {
        // Special double attack handled in battle logic
      }
    }
  },
  {
    id: 'moritz-rabbit',
    name: 'Moritz der Hase',
    nameAr: 'موريتز الأرنب',
    nameEn: 'Moritz the Rabbit',
    nameTr: 'Tavşan Moritz',
    nameUr: 'موریتز خرگوش',
    character: 'Moritz',
    storyId: '006-moritz',
    emoji: '🐰',
    element: 'Nature',
    rarity: 'Rare',
    baseAttack: 6,
    baseDefense: 5,
    baseHealth: 28,
    manaCost: 2,
    ability: {
      name: 'Glückshüpfer',
      nameAr: 'قفزة الحظ',
      nameEn: 'Lucky Hop',
      nameTr: 'Şanslı Sıçrama',
      nameUr: 'خوش قسمت چھلانگ',
      description: '50% Chance, Angriff auszuweichen',
      descriptionAr: 'فرصة 50٪ للتفادي من الهجوم',
      descriptionEn: '50% chance to dodge attack',
      descriptionTr: '%50 şans ile saldırıdan kaç',
      descriptionUr: 'حملے سے بچنے کا 50% موقع',
      trigger: 'onDefend',
      effect: (battle, cardId) => {
        const card = findCardInBattle(battle, cardId);
        if (card && Math.random() > 0.5) {
          card.statusEffects.push({ type: 'shield', duration: 1, value: 999 });
        }
      }
    }
  },
  {
    id: 'flamingo-fritz',
    name: 'Fritz der Flamingo',
    nameAr: 'فريتز الفلامنجو',
    nameEn: 'Fritz the Flamingo',
    nameTr: 'Flamingo Fritz',
    nameUr: 'فرٹز فلیمنگو',
    character: 'Fritz Flamingo',
    storyId: '007-fritz-flamingo',
    emoji: '🦩',
    element: 'Fire',
    rarity: 'Epic',
    baseAttack: 7,
    baseDefense: 5,
    baseHealth: 30,
    manaCost: 3,
    ability: {
      name: 'Flammenwirbel',
      nameAr: 'دوامة اللهب',
      nameEn: 'Flame Whirl',
      nameTr: 'Alev Girdabı',
      nameUr: 'شعلوں کا بھنور',
      description: 'Füge allen gegnerischen Karten 2 Schaden zu',
      descriptionAr: 'ألحق ضررًا بمقدار 2 لجميع بطاقات الخصم',
      descriptionEn: 'Deal 2 damage to all opponent cards',
      descriptionTr: 'Tüm rakip kartlara 2 hasar ver',
      descriptionUr: 'تمام مخالف کارڈوں کو 2 نقصان پہنچائیں',
      trigger: 'onPlay',
      cost: 3,
      effect: (battle, cardId) => {
        const opponent = battle.currentPlayer === 'player' ? battle.opponent : battle.player;
        opponent.field.forEach(card => {
          if (card) {
            card.health -= 2;
          }
        });
      }
    }
  },
  {
    id: 'dino-dinosaur',
    name: 'Dino der Dinosaurier',
    nameAr: 'دينو الديناصور',
    nameEn: 'Dino the Dinosaur',
    nameTr: 'Dinozor Dino',
    nameUr: 'ڈائنو ڈائناسور',
    character: 'Dino',
    storyId: '008-dino',
    emoji: '🦕',
    element: 'Earth',
    rarity: 'Legendary',
    baseAttack: 9,
    baseDefense: 8,
    baseHealth: 45,
    manaCost: 5,
    ability: {
      name: 'Urzeitbrüllen',
      nameAr: 'زئير ما قبل التاريخ',
      nameEn: 'Primal Roar',
      nameTr: 'İlkel Kükreme',
      nameUr: 'قدیم دہاڑ',
      description: 'Alle gegnerischen Karten verlieren 3 Verteidigung',
      descriptionAr: 'جميع بطاقات الخصم تخسر 3 دفاع',
      descriptionEn: 'All opponent cards lose 3 defense',
      descriptionTr: 'Tüm rakip kartları 3 savunma kaybeder',
      descriptionUr: 'تمام مخالف کارڈز 3 دفاع کھو دیتے ہیں',
      trigger: 'onPlay',
      cost: 2,
      effect: (battle, cardId) => {
        const opponent = battle.currentPlayer === 'player' ? battle.opponent : battle.player;
        opponent.field.forEach(card => {
          if (card) {
            card.defense = Math.max(0, card.defense - 3);
          }
        });
      }
    }
  },
  {
    id: 'milo-owl',
    name: 'Milo die Eule',
    nameAr: 'ميلو البومة',
    nameEn: 'Milo the Owl',
    nameTr: 'Baykuş Milo',
    nameUr: 'میلو الّو',
    character: 'Milo',
    storyId: '009-milo',
    emoji: '🦉',
    element: 'Dark',
    rarity: 'Mythic',
    baseAttack: 8,
    baseDefense: 6,
    baseHealth: 32,
    manaCost: 4,
    ability: {
      name: 'Weisheit der Nacht',
      nameAr: 'حكمة الليل',
      nameEn: 'Night Wisdom',
      nameTr: 'Gece Bilgeliği',
      nameUr: 'رات کی حکمت',
      description: 'Ziehe 2 zusätzliche Karten',
      descriptionAr: 'اسحب 2 بطاقات إضافية',
      descriptionEn: 'Draw 2 additional cards',
      descriptionTr: '2 ek kart çek',
      descriptionUr: '2 اضافی کارڈ نکالیں',
      trigger: 'onPlay',
      effect: (battle, cardId) => {
        const player = battle.currentPlayer === 'player' ? battle.player : battle.opponent;
        drawCards(battle, player, 2);
      }
    }
  },
  {
    id: 'leo-lion',
    name: 'Leo der Löwe',
    nameAr: 'ليو الأسد',
    nameEn: 'Leo the Lion',
    nameTr: 'Aslan Leo',
    nameUr: 'لیو شیر',
    character: 'Leo',
    storyId: '010-leo',
    emoji: '🦁',
    element: 'Fire',
    rarity: 'Legendary',
    baseAttack: 10,
    baseDefense: 6,
    baseHealth: 38,
    manaCost: 4,
    ability: {
      name: 'Königliches Gebrüll',
      nameAr: 'زئير ملكي',
      nameEn: 'Royal Roar',
      nameTr: 'Kraliyet Kükremesi',
      nameUr: 'شاہی دہاڑ',
      description: 'Alle verbündeten Karten erhalten +2 Angriff',
      descriptionAr: 'جميع البطاقات الحليفة تحصل على +2 هجوم',
      descriptionEn: 'All allied cards gain +2 attack',
      descriptionTr: 'Tüm dost kartlar +2 saldırı kazanır',
      descriptionUr: 'تمام اتحادی کارڈز کو +2 حملہ ملتا ہے',
      trigger: 'onPlay',
      effect: (battle, cardId) => {
        const player = battle.currentPlayer === 'player' ? battle.player : battle.opponent;
        player.field.forEach(card => {
          if (card && card.id !== cardId) {
            card.attack += 2;
          }
        });
      }
    }
  },
  {
    id: 'timmi-time',
    name: 'Timmi die Zauberuhr',
    nameAr: 'تيمي ساعة السحر',
    nameEn: 'Timmi the Magic Clock',
    nameTr: 'Sihirli Saat Timmi',
    nameUr: 'ٹمی جادوئی گھڑی',
    character: 'Timmi',
    storyId: '018-timmi-zauberuhr',
    emoji: '⏰',
    element: 'Light',
    rarity: 'Epic',
    baseAttack: 5,
    baseDefense: 7,
    baseHealth: 30,
    manaCost: 3,
    ability: {
      name: 'Zeitmanipulation',
      nameAr: 'التلاعب بالوقت',
      nameEn: 'Time Manipulation',
      nameTr: 'Zaman Manipülasyonu',
      nameUr: 'وقت کی ہیرا پھیری',
      description: 'Erhalte einen zusätzlichen Zug',
      descriptionAr: 'احصل على دور إضافي',
      descriptionEn: 'Get an extra turn',
      descriptionTr: 'Ekstra bir tur al',
      descriptionUr: 'ایک اضافی موڑ حاصل کریں',
      trigger: 'onPlay',
      cost: 4,
      cooldown: 5,
      effect: (battle, cardId) => {
        // Extra turn handled in battle logic
      }
    }
  },
  {
    id: 'finn-fish',
    name: 'Finn der Fisch',
    nameAr: 'فين السمكة',
    nameEn: 'Finn the Fish',
    nameTr: 'Balık Finn',
    nameUr: 'فن مچھلی',
    character: 'Finn',
    storyId: '019-finn',
    emoji: '🐟',
    element: 'Water',
    rarity: 'Common',
    baseAttack: 5,
    baseDefense: 4,
    baseHealth: 24,
    manaCost: 2,
    ability: {
      name: 'Wasserstrahl',
      nameAr: 'نفاثة الماء',
      nameEn: 'Water Jet',
      nameTr: 'Su Püskürtme',
      nameUr: 'پانی کی دھار',
      description: 'Füge 4 direkten Schaden zu',
      descriptionAr: 'ألحق 4 ضرر مباشر',
      descriptionEn: 'Deal 4 direct damage',
      descriptionTr: '4 doğrudan hasar ver',
      descriptionUr: '4 براہ راست نقصان پہنچائیں',
      trigger: 'onAttack',
      cost: 1,
      effect: (battle, cardId) => {
        // Direct damage handled in attack logic
      }
    }
  },
  {
    id: 'timmi-thinking',
    name: 'Timmi denkt nach',
    nameAr: 'تيمي يفكر',
    nameEn: 'Timmi Thinks',
    nameTr: 'Timmi Düşünüyor',
    nameUr: 'ٹمی سوچتا ہے',
    character: 'Timmi',
    storyId: '020-timmi-denkt',
    emoji: '🤔',
    element: 'Light',
    rarity: 'Rare',
    baseAttack: 6,
    baseDefense: 6,
    baseHealth: 28,
    manaCost: 3,
    ability: {
      name: 'Strategisches Denken',
      nameAr: 'التفكير الاستراتيجي',
      nameEn: 'Strategic Thinking',
      nameTr: 'Stratejik Düşünme',
      nameUr: 'حکمت عملی سوچ',
      description: 'Schaue die obersten 3 Karten deines Decks an',
      descriptionAr: 'انظر إلى أعلى 3 بطاقات من مجموعتك',
      descriptionEn: 'Look at top 3 cards of your deck',
      descriptionTr: 'Desteninizin üstteki 3 kartına bakın',
      descriptionUr: 'اپنے ڈیک کے اوپر کے 3 کارڈز دیکھیں',
      trigger: 'onPlay',
      effect: (battle, cardId) => {
        // Preview cards handled in UI
      }
    }
  },
  {
    id: 'emil-ghost',
    name: 'Emil der Flattergeist',
    nameAr: 'إيميل الشبح الطائر',
    nameEn: 'Emil the Fluttering Ghost',
    nameTr: 'Çırpınan Hayalet Emil',
    nameUr: 'ایمل اڑتا بھوت',
    character: 'Emil',
    storyId: '021-emil-flattergeist',
    emoji: '👻',
    element: 'Dark',
    rarity: 'Epic',
    baseAttack: 7,
    baseDefense: 4,
    baseHealth: 26,
    manaCost: 3,
    ability: {
      name: 'Geisterhafte Form',
      nameAr: 'شكل شبحي',
      nameEn: 'Ghostly Form',
      nameTr: 'Hayalet Formu',
      nameUr: 'بھوت کی شکل',
      description: 'Kann nicht von physischen Angriffen getroffen werden',
      descriptionAr: 'لا يمكن إصابته بالهجمات الجسدية',
      descriptionEn: 'Cannot be hit by physical attacks',
      descriptionTr: 'Fiziksel saldırılardan etkilenmez',
      descriptionUr: 'جسمانی حملوں سے نہیں مارا جا سکتا',
      trigger: 'onDefend',
      effect: (battle, cardId) => {
        const card = findCardInBattle(battle, cardId);
        const attacker = getLastAttacker(battle);
        if (card && attacker && attacker.element !== 'Light' && attacker.element !== 'Dark') {
          card.statusEffects.push({ type: 'shield', duration: 1, value: 999 });
        }
      }
    }
  },
  // Add 17 more unique cards to reach 30+
  {
    id: 'panda-peace',
    name: 'Pao der Friedens-Panda',
    nameAr: 'باو باندا السلام',
    nameEn: 'Pao the Peace Panda',
    nameTr: 'Barış Pandası Pao',
    nameUr: 'پاؤ امن پانڈا',
    character: 'Pao',
    storyId: 'panda-peace',
    emoji: '🐼',
    element: 'Nature',
    rarity: 'Legendary',
    baseAttack: 5,
    baseDefense: 10,
    baseHealth: 42,
    manaCost: 4,
    ability: {
      name: 'Harmonie',
      nameAr: 'انسجام',
      nameEn: 'Harmony',
      nameTr: 'Uyum',
      nameUr: 'ہم آہنگی',
      description: 'Heile alle verbündeten Karten um 5 HP',
      descriptionAr: 'اشفِ جميع البطاقات الحليفة بمقدار 5 نقاط صحة',
      descriptionEn: 'Heal all allied cards by 5 HP',
      descriptionTr: 'Tüm dost kartları 5 HP iyileştir',
      descriptionUr: 'تمام اتحادی کارڈز کو 5 HP سے بحال کریں',
      trigger: 'onTurnEnd',
      effect: (battle, cardId) => {
        const player = battle.currentPlayer === 'player' ? battle.player : battle.opponent;
        player.field.forEach(card => {
          if (card) {
            card.health = Math.min(card.maxHealth, card.health + 5);
          }
        });
      }
    }
  },
  {
    id: 'dragon-brave',
    name: 'Drako der Mutige Drache',
    nameAr: 'دراكو التنين الشجاع',
    nameEn: 'Drako the Brave Dragon',
    nameTr: 'Cesur Ejderha Drako',
    nameUr: 'ڈراکو بہادر ڈریگن',
    character: 'Drako',
    storyId: 'dragon-brave',
    emoji: '🐉',
    element: 'Fire',
    rarity: 'Mythic',
    baseAttack: 10,
    baseDefense: 7,
    baseHealth: 40,
    manaCost: 5,
    ability: {
      name: 'Feueratem',
      nameAr: 'نفس النار',
      nameEn: 'Fire Breath',
      nameTr: 'Ateş Nefesi',
      nameUr: 'آگ کا سانس',
      description: 'Füge allen Gegnern 5 Brandschaden zu',
      descriptionAr: 'ألحق 5 ضرر حرق لجميع الأعداء',
      descriptionEn: 'Deal 5 burn damage to all enemies',
      descriptionTr: 'Tüm düşmanlara 5 yakma hasarı ver',
      descriptionUr: 'تمام دشمنوں کو 5 جلانے کا نقصان پہنچائیں',
      trigger: 'onAttack',
      cost: 3,
      effect: (battle, cardId) => {
        const opponent = battle.currentPlayer === 'player' ? battle.opponent : battle.player;
        opponent.field.forEach(card => {
          if (card) {
            card.statusEffects.push({ type: 'burn', duration: 2, value: 5 });
          }
        });
      }
    }
  },
  {
    id: 'unicorn-magic',
    name: 'Una das Einhorn',
    nameAr: 'أونا وحيد القرن',
    nameEn: 'Una the Unicorn',
    nameTr: 'Tek Boynuzlu At Una',
    nameUr: 'اونا یونیکارن',
    character: 'Una',
    storyId: 'unicorn-magic',
    emoji: '🦄',
    element: 'Light',
    rarity: 'Mythic',
    baseAttack: 8,
    baseDefense: 8,
    baseHealth: 35,
    manaCost: 5,
    ability: {
      name: 'Heilende Magie',
      nameAr: 'السحر الشافي',
      nameEn: 'Healing Magic',
      nameTr: 'İyileştirici Sihir',
      nameUr: 'شفا بخش جادو',
      description: 'Stelle alle HP aller verbündeten Karten wieder her',
      descriptionAr: 'استعد جميع نقاط صحة جميع البطاقات الحليفة',
      descriptionEn: 'Restore all HP of all allied cards',
      descriptionTr: 'Tüm dost kartların tüm HP\'sini geri yükle',
      descriptionUr: 'تمام اتحادی کارڈز کے تمام HP بحال کریں',
      trigger: 'onPlay',
      cost: 4,
      cooldown: 4,
      effect: (battle, cardId) => {
        const player = battle.currentPlayer === 'player' ? battle.player : battle.opponent;
        player.field.forEach(card => {
          if (card) {
            card.health = card.maxHealth;
          }
        });
      }
    }
  },
  {
    id: 'penguin-slide',
    name: 'Pingu der Pinguin',
    nameAr: 'بينغو البطريق',
    nameEn: 'Pingu the Penguin',
    nameTr: 'Penguen Pingu',
    nameUr: 'پنگو پینگوئن',
    character: 'Pingu',
    storyId: 'penguin-slide',
    emoji: '🐧',
    element: 'Water',
    rarity: 'Rare',
    baseAttack: 6,
    baseDefense: 6,
    baseHealth: 30,
    manaCost: 3,
    ability: {
      name: 'Eisrutsche',
      nameAr: 'زلاقة جليدية',
      nameEn: 'Ice Slide',
      nameTr: 'Buz Kaydırağı',
      nameUr: 'برف کی پھسلن',
      description: 'Friere eine gegnerische Karte für 1 Zug ein',
      descriptionAr: 'جمّد بطاقة معادية لدور واحد',
      descriptionEn: 'Freeze an enemy card for 1 turn',
      descriptionTr: 'Bir düşman kartını 1 tur dondur',
      descriptionUr: 'ایک دشمن کارڈ کو 1 موڑ کے لیے منجمد کریں',
      trigger: 'onAttack',
      cost: 2,
      effect: (battle, cardId) => {
        // Freeze target handled in attack logic
      }
    }
  },
  {
    id: 'elephant-strong',
    name: 'Ella der Elefant',
    nameAr: 'إيلا الفيل',
    nameEn: 'Ella the Elephant',
    nameTr: 'Fil Ella',
    nameUr: 'ایلا ہاتھی',
    character: 'Ella',
    storyId: 'elephant-strong',
    emoji: '🐘',
    element: 'Earth',
    rarity: 'Legendary',
    baseAttack: 9,
    baseDefense: 9,
    baseHealth: 50,
    manaCost: 5,
    ability: {
      name: 'Stampede',
      nameAr: 'الدوس',
      nameEn: 'Stampede',
      nameTr: 'Çiğneme',
      nameUr: 'روندنا',
      description: 'Füge Schaden basierend auf Verteidigung zu',
      descriptionAr: 'ألحق ضررًا بناءً على الدفاع',
      descriptionEn: 'Deal damage based on defense',
      descriptionTr: 'Savunmaya dayalı hasar ver',
      descriptionUr: 'دفاع کی بنیاد پر نقصان پہنچائیں',
      trigger: 'onAttack',
      effect: (battle, cardId) => {
        const card = findCardInBattle(battle, cardId);
        if (card) {
          card.attack = card.defense;
        }
      }
    }
  }
  // Continue with 12 more cards...
];

// Helper functions
export function findCardInBattle(battle: BattleState, cardId: string): BattleCard | null {
  const playerCard = battle.player.field.find(c => c?.id === cardId);
  const opponentCard = battle.opponent.field.find(c => c?.id === cardId);
  return (playerCard || opponentCard || null) as BattleCard | null;
}

export function getLastAttacker(battle: BattleState): BattleCard | null {
  // Implementation for tracking last attacker
  return null;
}

export function drawCards(battle: BattleState, player: Player, count: number): void {
  for (let i = 0; i < count; i++) {
    if (player.deck.length > 0) {
      const card = player.deck.shift();
      if (card) {
        player.hand.push(card);
      }
    }
  }
}

export function createCard(cardData: typeof CARD_DATABASE[0], level: number = 1, isShiny: boolean = false): Card {
  const xpToNextLevel = level * 100;
  const attack = cardData.baseAttack + (level - 1);
  const defense = cardData.baseDefense + (level - 1);
  const health = cardData.baseHealth + (level - 1) * 5;

  let artVariant: 'normal' | 'evolved1' | 'evolved2' = 'normal';
  if (level >= 10) artVariant = 'evolved2';
  else if (level >= 5) artVariant = 'evolved1';

  return {
    ...cardData,
    attack,
    defense,
    health,
    maxHealth: health,
    level,
    xp: 0,
    xpToNextLevel,
    isShiny,
    artVariant,
    isInPlay: false,
    canAttack: false,
    canDefend: true,
    abilityCooldown: 0,
    statusEffects: []
  };
}

export function calculateDamage(attacker: BattleCard, defender: BattleCard): number {
  let damage = Math.max(0, attacker.attack - defender.defense);

  // Apply status effects
  const strengthBuff = attacker.statusEffects.find(e => e.type === 'strengthen');
  if (strengthBuff) {
    damage *= strengthBuff.value;
  }

  const weakDebuff = attacker.statusEffects.find(e => e.type === 'weaken');
  if (weakDebuff) {
    damage = Math.floor(damage / 2);
  }

  // Element advantage
  const advantage = getElementAdvantage(attacker.element, defender.element);
  damage = Math.floor(damage * advantage);

  return damage;
}

export function getElementAdvantage(attacker: ElementType, defender: ElementType): number {
  const advantages: Record<ElementType, ElementType[]> = {
    Fire: ['Nature', 'Earth'],
    Water: ['Fire', 'Earth'],
    Earth: ['Air', 'Light'],
    Air: ['Water', 'Fire'],
    Light: ['Dark'],
    Dark: ['Light'],
    Nature: ['Water', 'Air']
  };

  if (advantages[attacker]?.includes(defender)) return 1.5;
  if (advantages[defender]?.includes(attacker)) return 0.75;
  return 1.0;
}

export function initializeBattle(playerDeck: Card[], opponentDeck: Card[], aiDifficulty: 'easy' | 'medium' | 'hard' = 'medium'): BattleState {
  const player: Player = {
    id: 'player',
    name: 'Spieler',
    health: 100,
    maxHealth: 100,
    mana: 1,
    maxMana: 10,
    deck: [...playerDeck],
    hand: [],
    field: [null, null, null],
    graveyard: []
  };

  const opponent: Player = {
    id: 'opponent',
    name: getAIName(aiDifficulty),
    health: 100,
    maxHealth: 100,
    mana: 1,
    maxMana: 10,
    deck: [...opponentDeck],
    hand: [],
    field: [null, null, null],
    graveyard: []
  };

  // Draw initial hands
  drawCards({ player, opponent } as any, player, 3);
  drawCards({ player, opponent } as any, opponent, 3);

  return {
    id: `battle-${Date.now()}`,
    player,
    opponent,
    turn: 1,
    currentPlayer: 'player',
    phase: 'draw',
    winner: null,
    battleLog: []
  };
}

function getAIName(difficulty: 'easy' | 'medium' | 'hard'): string {
  const names = {
    easy: 'Anfänger-Bot',
    medium: 'Schlauer Fuchs',
    hard: 'Mystische Eule'
  };
  return names[difficulty];
}

export function addBattleLog(battle: BattleState, action: string, translations: { ar: string; en: string; tr: string; ur: string }): void {
  battle.battleLog.push({
    turn: battle.turn,
    action,
    actionAr: translations.ar,
    actionEn: translations.en,
    actionTr: translations.tr,
    actionUr: translations.ur,
    timestamp: Date.now()
  });
}

// AI Logic
export function getAIMove(battle: BattleState, difficulty: 'easy' | 'medium' | 'hard'): {
  action: 'play' | 'attack' | 'end';
  cardIndex?: number;
  targetIndex?: number;
  fieldPosition?: number;
} {
  const opponent = battle.opponent;

  if (difficulty === 'easy') {
    // Random moves
    const playableCards = opponent.hand.filter(c => c.manaCost <= opponent.mana);
    if (playableCards.length > 0 && Math.random() > 0.5) {
      const cardIndex = opponent.hand.indexOf(playableCards[0]);
      const emptySlot = opponent.field.findIndex(slot => slot === null);
      if (emptySlot !== -1) {
        return { action: 'play', cardIndex, fieldPosition: emptySlot };
      }
    }

    const attackers = opponent.field.filter(c => c !== null && c.canAttack);
    if (attackers.length > 0 && Math.random() > 0.3) {
      const attacker = attackers[0];
      const targets = battle.player.field.filter(c => c !== null);
      if (targets.length > 0) {
        return {
          action: 'attack',
          cardIndex: opponent.field.indexOf(attacker),
          targetIndex: battle.player.field.indexOf(targets[0])
        };
      }
    }
  }

  // Medium and hard AI use strategy
  // TODO: Implement advanced AI logic

  return { action: 'end' };
}
