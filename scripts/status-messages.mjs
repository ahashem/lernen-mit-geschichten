/**
 * The moderators' status page and checklist in the languages they work in. Every item readiness.mjs reports is a
 * `{code, params}`; this turns it into a sentence. English is the reference (and what status.json carries as text);
 * German and Arabic are for the moderators and are drafts for them to correct. Nothing here is shown to readers.
 */
export const LANGS = ['de', 'ar', 'en'];

const n = (c, one, many) => (c === 1 ? one : many);

export const MESSAGES = {
  summary: {
    en: () => 'Write the summary (one or two sentences).',
    de: () => 'Die Zusammenfassung schreiben (ein bis zwei Sätze).',
    ar: () => 'اكتبوا الملخّص (جملة أو جملتان).',
  },
  keyMessage: {
    en: () => 'Write the one idea (key message).',
    de: () => 'Die eine Kernidee (Kernbotschaft) schreiben.',
    ar: () => 'اكتبوا الفكرة الواحدة (الرسالة الأساسية).',
  },
  review: {
    en: () => 'Have someone else read it, then fill "Reviewed by" and the review date.',
    de: () => 'Eine andere Person lesen lassen und dann „Geprüft von“ und das Prüfdatum ausfüllen.',
    ar: () => 'اطلبوا من شخص آخر قراءتها، ثم املؤوا «راجعها» وتاريخ المراجعة.',
  },
  reviewerIsAuthor: {
    en: () => 'The reviewer must be a different person from the author.',
    de: () => 'Die prüfende Person muss eine andere sein als die Autorin oder der Autor.',
    ar: () => 'يجب أن يكون المراجع شخصًا غير الكاتب.',
  },
  band: {
    en: () => 'Choose the band.',
    de: () => 'Die Stufe (Band) wählen.',
    ar: () => 'اختاروا المستوى (Band).',
  },
  emoji: {
    en: () => 'Pick an emoji.',
    de: () => 'Ein Emoji auswählen.',
    ar: () => 'اختاروا رمزًا تعبيريًا.',
  },
  skills: {
    en: () => 'Pick 1 to 3 skills.',
    de: () => '1 bis 3 Fähigkeiten auswählen.',
    ar: () => 'اختاروا من مهارة إلى ثلاث مهارات.',
  },
  skillUnknown: {
    en: p => `The skill "${p.id}" does not exist.`,
    de: p => `Die Fähigkeit „${p.id}“ gibt es nicht.`,
    ar: p => `المهارة «${p.id}» غير موجودة.`,
  },
  castUnknown: {
    en: p => `The character "${p.id}" has no sheet yet.`,
    de: p => `Für die Figur „${p.id}“ gibt es noch kein Figurenblatt.`,
    ar: p => `لا توجد بطاقة بعد للشخصية «${p.id}».`,
  },
  castUnapproved: {
    en: p => `The character sheet of ${p.name} is not approved yet.`,
    de: p => `Das Figurenblatt von ${p.name} ist noch nicht freigegeben.`,
    ar: p => `بطاقة الشخصية ${p.name} لم تُعتمد بعد.`,
  },
  coverAltDe: {
    en: () => 'Write the alt text of the cover (German).',
    de: () => 'Den Alternativtext für das Titelbild schreiben (Deutsch).',
    ar: () => 'اكتبوا النص البديل لصورة الغلاف (بالألمانية).',
  },
  frameAltDe: {
    en: p => `Write the alt text of page picture ${p.i} (German).`,
    de: p => `Den Alternativtext für das Seitenbild ${p.i} schreiben (Deutsch).`,
    ar: p => `اكتبوا النص البديل لصورة الصفحة ${p.i} (بالألمانية).`,
  },
  pictureMissing: {
    en: p => `The picture ${p.src} has not been uploaded.`,
    de: p => `Das Bild ${p.src} wurde nicht hochgeladen.`,
    ar: p => `لم يتم رفع الصورة ${p.src}.`,
  },
  pictureFolder: {
    en: p => `${p.name} is not in the story's folder: upload it into Story art › ${p.id} and choose it again.`,
    de: p => `${p.name} liegt nicht im Ordner der Geschichte: in Story art › ${p.id} hochladen und neu auswählen.`,
    ar: p => `${p.name} ليست في مجلد القصة: ارفعوها في Story art › ${p.id} واختاروها من جديد.`,
  },
  pictureSize: {
    en: p => `${p.name} is ${p.kb} KB; the budget is 120 KB.`,
    de: p => `${p.name} hat ${p.kb} KB; das Limit sind 120 KB.`,
    ar: p => `حجم ${p.name} هو ${p.kb} كيلوبايت، والحد الأقصى 120 كيلوبايت.`,
  },
  artProvenance: {
    en: () => 'Fill in "How the art was made" (tool and who reviewed it).',
    de: () => '„Wie die Bilder entstanden sind“ ausfüllen (Werkzeug und wer sie geprüft hat).',
    ar: () => 'املؤوا «كيف أُنشئت الصور» (الأداة ومن راجعها).',
  },
  pagesDerived: {
    en: () => 'Pages are worked out from the paragraphs. Add a horizontal line between pages if you want control; recorded narration only plays with explicit pages.',
    de: () => 'Die Seiten werden aus den Absätzen abgeleitet. Eine waagerechte Linie zwischen den Seiten gibt Ihnen die Kontrolle; aufgenommene Vorlesestimmen werden nur bei festen Seiten abgespielt.',
    ar: () => 'تُستنتج الصفحات من الفقرات. أضيفوا خطًا أفقيًا بين الصفحات إن أردتم التحكم بها؛ التسجيلات الصوتية لا تعمل إلا مع صفحات محددة.',
  },
  moreFramesThanPages: {
    en: p => `${p.frames} page pictures but only ${p.pages} pages.`,
    de: p => `${p.frames} Seitenbilder, aber nur ${p.pages} Seiten.`,
    ar: p => `عدد صور الصفحات ${p.frames} لكن عدد الصفحات ${p.pages} فقط.`,
  },
  recordings: {
    en: p => `${p.n} ${n(p.n, 'recording', 'recordings')} for ${p.pages} ${n(p.pages, 'page', 'pages')}.`,
    de: p => `${p.n} ${n(p.n, 'Aufnahme', 'Aufnahmen')} für ${p.pages} ${n(p.pages, 'Seite', 'Seiten')}.`,
    ar: p => `${p.n} تسجيلات لـ ${p.pages} صفحات.`,
  },
  ownSkills: {
    en: () => 'This language has its own skills; leave them empty unless the story really differs.',
    de: () => 'Diese Sprache hat eigene Fähigkeiten; leer lassen, außer die Geschichte unterscheidet sich wirklich.',
    ar: () => 'لهذه اللغة مهارات خاصة بها؛ اتركوها فارغة ما لم تختلف القصة فعلًا.',
  },
  coverAltLocale: {
    en: () => 'Write the alt text of the cover in this language.',
    de: () => 'Den Alternativtext für das Titelbild in dieser Sprache schreiben.',
    ar: () => 'اكتبوا النص البديل لصورة الغلاف بهذه اللغة.',
  },
  frameAltsLocale: {
    en: p => `Write the alt text of ${p.frames} page ${n(p.frames, 'picture', 'pictures')} in this language (${p.have} written so far).`,
    de: p => `Die Alternativtexte für ${p.frames} Seitenbilder in dieser Sprache schreiben (bisher ${p.have}).`,
    ar: p => `اكتبوا النص البديل لـ ${p.frames} صور صفحات بهذه اللغة (المكتوب حتى الآن ${p.have}).`,
  },
  pagesAlign: {
    en: p => `Pages do not line up with German (German ${p.de}, here ${p.here}), so this language cannot be read beside German.`,
    de: p => `Die Seiten passen nicht zum Deutschen (Deutsch ${p.de}, hier ${p.here}); so kann diese Sprache nicht neben dem Deutschen gelesen werden.`,
    ar: p => `الصفحات لا تطابق الألمانية (الألمانية ${p.de}، هنا ${p.here})، لذلك لا يمكن قراءة هذه اللغة بجانب الألمانية.`,
  },
  noGerman: {
    en: () => 'There is no German original for this story.',
    de: () => 'Zu dieser Geschichte gibt es kein deutsches Original.',
    ar: () => 'لا توجد نسخة ألمانية أصلية لهذه القصة.',
  },
};

export const say = (item, lang = 'en') => (MESSAGES[item.code]?.[lang] ?? MESSAGES[item.code].en)(item.params ?? {});

/** The page's own words. */
export const UI = {
  en: {
    dir: 'ltr',
    title: 'Content check',
    nothingYet: 'No editorial branch yet.',
    buildFailed: 'The preview could not be built. Fix the error below and save again.',
    blocked: 'The preview is up to date, but these files cannot go live yet.',
    ok: 'Everything passes. Published stories go live a few minutes after saving.',
    checked: (sha, time) => `Checked commit ${sha} at ${time}.`,
    details: 'Details',
    heading: 'What each story needs',
    intro: '"Needed before it can go live" is what the publishing check enforces; "Worth fixing" never blocks. Closest to ready first.',
    story: 'Story',
    band: 'Band',
    must: 'Needed before it can go live',
    should: 'Worth fixing',
    nothing: 'Nothing to do.',
    ready: 'ready',
    toDo: c => `${c} ${n(c, 'thing', 'things')} to do`,
    blocksNothing: 'nothing blocks it',
    draft: 'draft',
    published: 'published',
    open: 'Open the preview',
    reviewSheet: 'Open the review sheet',
    guide: 'Guide for moderators',
    art: 'Prepare pictures',
    buildProblem: (file, problems) => `The story file ${file} has a field the site cannot read${problems ? ` (${problems})` : ''}. Fix that field in the CMS and save again.`,
  },
  de: {
    dir: 'ltr',
    title: 'Inhalts-Check',
    nothingYet: 'Es gibt noch keinen Editorial-Zweig.',
    buildFailed: 'Die Vorschau konnte nicht gebaut werden. Den Fehler unten beheben und erneut speichern.',
    blocked: 'Die Vorschau ist aktuell, aber diese Dateien können noch nicht veröffentlicht werden.',
    ok: 'Alles in Ordnung. Veröffentlichte Geschichten sind wenige Minuten nach dem Speichern online.',
    checked: (sha, time) => `Geprüfter Stand ${sha} um ${time}.`,
    details: 'Details',
    heading: 'Was jede Geschichte noch braucht',
    intro: '„Nötig vor der Veröffentlichung“ prüft die Veröffentlichungskontrolle; „Besser beheben“ blockiert nie. Die fast fertigen zuerst.',
    story: 'Geschichte',
    band: 'Stufe',
    must: 'Nötig vor der Veröffentlichung',
    should: 'Besser beheben',
    nothing: 'Nichts zu tun.',
    ready: 'fertig',
    toDo: c => `${c} ${n(c, 'Punkt', 'Punkte')} offen`,
    blocksNothing: 'nichts blockiert',
    draft: 'Entwurf',
    published: 'veröffentlicht',
    open: 'Vorschau öffnen',
    reviewSheet: 'Prüfbogen öffnen',
    guide: 'Anleitung',
    art: 'Bilder vorbereiten',
    buildProblem: (file, problems) => `Die Geschichtsdatei ${file} enthält ein Feld, das die Seite nicht lesen kann${problems ? ` (${problems})` : ''}. Das Feld im CMS korrigieren und erneut speichern.`,
  },
  ar: {
    dir: 'rtl',
    title: 'فحص المحتوى',
    nothingYet: 'لا يوجد فرع تحريري بعد.',
    buildFailed: 'تعذّر بناء المعاينة. أصلحوا الخطأ أدناه ثم احفظوا من جديد.',
    blocked: 'المعاينة محدّثة، لكن هذه الملفات لا يمكن نشرها بعد.',
    ok: 'كل شيء سليم. تُنشر القصص المنشورة بعد دقائق من الحفظ.',
    checked: (sha, time) => `النسخة التي فُحصت ${sha} عند ${time}.`,
    details: 'التفاصيل',
    heading: 'ما تحتاجه كل قصة',
    intro: '«مطلوب قبل النشر» هو ما يفرضه فحص النشر؛ «يستحق الإصلاح» لا يمنع شيئًا. الأقرب إلى الجاهزية أولًا.',
    story: 'القصة',
    band: 'المستوى',
    must: 'مطلوب قبل النشر',
    should: 'يستحق الإصلاح',
    nothing: 'لا شيء مطلوب.',
    ready: 'جاهزة',
    toDo: c => `${c} ${c === 1 ? 'أمر' : 'أمور'} متبقية`,
    blocksNothing: 'لا شيء يمنعها',
    draft: 'مسودة',
    published: 'منشورة',
    open: 'افتحوا المعاينة',
    reviewSheet: 'افتحوا ورقة المراجعة',
    guide: 'دليل المشرفين',
    art: 'تجهيز الصور',
    buildProblem: (file, problems) => `ملف القصة ${file} فيه حقل لا يستطيع الموقع قراءته${problems ? ` (${problems})` : ''}. صحّحوا الحقل في نظام إدارة المحتوى واحفظوا من جديد.`,
  },
};
