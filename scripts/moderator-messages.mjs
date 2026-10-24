/**
 * Wording for the moderators' guide and the art-prep page (moderator-pages.mjs), in the languages the moderators work
 * in. English is the main language (the pages open in it) and the reference; German and Arabic are drafts for the
 * moderators to correct. Keep the guide in step with docs/roadmap/03 and the CMS labels in .pages.yml.
 * `{up}` is the preview root, `{l}` the language folder (empty for English, `ar/`, `de/`).
 * `{cms}` is replaced by the CMS address from the CMS_URL variable, or by a neutral phrase when it is not set.
 */
export const GUIDE = {
  de: {
    dir: 'ltr',
    title: 'Anleitung für Moderatorinnen und Moderatoren',
    intro: 'Alles, was du für eine Geschichte brauchst, vom ersten Entwurf bis zur Veröffentlichung. Diese Seiten sind nur für das Team und erscheinen nicht in Suchmaschinen.',
    cmsFallback: 'die CMS-Adresse, die du bekommen hast',
    reviewOptional: 'Zurzeit ist eine Prüfung nicht vorgeschrieben: Eine Datei mit dem Status <em>published</em> geht live. Prüft trotzdem, wann immer es geht, und tragt es ein.',
    sections: [
      [
        'Deine Seiten',
        [
          '<strong>CMS</strong> ({cms}): Geschichten schreiben, übersetzen und veröffentlichen.',
          '<a href="{up}">Vorschau</a>: die Seite mit allen Entwürfen, genau so, wie Leserinnen und Leser sie sehen werden. Sie wird wenige Minuten nach jedem Speichern neu gebaut.',
          '<a href="{up}status/{l}">Status</a>: ob dein letztes Speichern geklappt hat und was jeder Geschichte in jeder Sprache noch fehlt.',
          '<a href="{up}review/{l}">Prüfbogen</a>: alle Sprachen einer Geschichte nebeneinander, mit Bildern und Checklisten.',
          '<a href="{up}art/{l}">Bilder vorbereiten</a>: Bilder auf die richtige Größe und den richtigen Namen bringen.',
          'Die Live-Seite zeigt nur Geschichten mit dem Status <em>published</em>.',
        ],
      ],
      [
        'Eine neue Geschichte (immer zuerst auf Deutsch)',
        [
          'Im CMS: <em>Deutsch (Quelle)</em>, dann <em>Neu</em>.',
          '<em>Story id</em>: drei Ziffern, Bindestrich, ein kleingeschriebener Name, z. B. <code>023-nora</code>. Diese Id ändert sich nie und ist auch der Ordnername für Bilder und Audio.',
          'Titel, Emoji, 1 bis 3 Fähigkeiten, Stufe (Band), Zusammenfassung (1-2 Sätze) und <em>The one idea</em> (die eine Botschaft).',
          'Den Text schreibst du wie ein Dokument. Eine waagerechte Linie (Einfügen, Trennlinie) beginnt eine neue Seite; Seite 1 gehört zu Bild 1 und Aufnahme 1.',
          'Fragen und Impulse für Erwachsene ergänzen. Der Status bleibt <em>draft</em>.',
        ],
      ],
      [
        'Bilder und Audio',
        [
          'Bilder zuerst mit <a href="{up}art/{l}">Bilder vorbereiten</a> umwandeln: 1200 px breit, WebP, höchstens 120 KB, richtig benannt (<code>023-nora_cover.webp</code>, <code>023-nora_frame-01_colour.webp</code>).',
          'Im CMS unter <em>Story art</em> in den Ordner <code>023-nora</code> hochladen: genau die Story id, ohne Leerzeichen, keine anderen Ordnernamen.',
          'Audio (freiwillig): eine Aufnahme pro Seite, <code>01.m4a</code>, <code>02.m4a</code>, unter <em>Narration audio</em> im Ordner <code>de/023-nora</code>.',
          'Bilder in <em>Cover</em> und <em>Page pictures</em> auswählen und zu jedem Bild einen Alternativtext schreiben: beschreiben, was ein Kind sehen würde, das das Bild nicht sehen kann. Keine Bildunterschrift.',
          '<em>How the art was made</em> ausfüllen: Werkzeug und Modell, wer die Bilder geprüft hat und wann.',
        ],
      ],
      [
        'Übersetzen',
        [
          'Im CMS die Sammlung der Sprache öffnen (z. B. <em>العربية</em>), <em>Neu</em>, und bei <em>Story</em> das deutsche Original auswählen.',
          'Titel, Zusammenfassung, die eine Botschaft, Text, Fragen und die Alternativtexte in dieser Sprache. Alternativtexte in derselben Reihenfolge wie die deutschen Bilder.',
          'Gleich viele Seiten wie im Deutschen (gleich viele Trennlinien), sonst funktioniert das Lesen in zwei Sprachen nicht. Der Prüfbogen zeigt, ob die Seiten passen.',
          'Nacherzählen, nicht Wort für Wort übersetzen. Der Status bleibt <em>draft</em>.',
        ],
      ],
      [
        'Prüfen und abzeichnen',
        [
          'Eine andere Person prüft als die, die geschrieben oder übersetzt hat. Bei einer Übersetzung: jemand, der die Sprache fließend spricht.',
          'Den <a href="{up}review/{l}">Prüfbogen</a> der Geschichte öffnen und die Checklisten durchgehen. Dann die echte Seite in der Vorschau lesen, auch auf dem Handy, bei Arabisch und Urdu besonders auf das Layout achten.',
          'Wenn alles stimmt: im CMS in der Datei dieser Sprache <em>Reviewed by</em> (dein Name) und <em>Reviewed on</em> (das heutige Datum) ausfüllen.',
        ],
      ],
      [
        'Veröffentlichen und zurücknehmen',
        [
          'Nur fertige und geprüfte Dateien auf <em>published</em> setzen und speichern. Jede Sprache hat ihren eigenen Status.',
          'Nach wenigen Minuten zeigt die <a href="{up}status/{l}">Statusseite</a>: alles in Ordnung (dann ist die Geschichte bald live) oder blockiert, mit dem Grund.',
          'Eine blockierte Datei hält alle späteren Speicherungen auf. Entweder das Fehlende ergänzen oder die Datei wieder auf <em>draft</em> setzen.',
          'Zurücknehmen: Status auf <em>draft</em> setzen und speichern. Die Geschichte verschwindet nach wenigen Minuten von der Live-Seite.',
        ],
      ],
      [
        'Wenn etwas nicht klappt',
        [
          '„Die Vorschau konnte nicht gebaut werden“: Die Statusseite nennt die Datei und das Feld. Das Feld im CMS korrigieren und erneut speichern.',
          'Ein Bild fehlt in der Vorschau: Ordnername und Dateiname genau prüfen (Story id, zweistellige Nummer, .webp).',
          'Alles andere: der Inhaberin oder dem Inhaber der Seite schreiben, mit dem Link zur Statusseite.',
        ],
      ],
    ],
  },
  en: {
    dir: 'ltr',
    title: 'Guide for moderators',
    intro: 'Everything you need for a story, from first draft to publishing. These pages are for the team only and do not appear in search engines.',
    cmsFallback: 'the CMS address you were given',
    reviewOptional: 'For now a review is not required: a file set to <em>published</em> goes live. Review whenever you can anyway, and record it.',
    sections: [
      [
        'Your pages',
        [
          '<strong>CMS</strong> ({cms}): write, translate and publish stories.',
          '<a href="{up}">Preview</a>: the site with every draft, exactly as readers will see it. It is rebuilt a few minutes after every save.',
          '<a href="{up}status/{l}">Status</a>: whether your last save worked and what each story still needs in each language.',
          '<a href="{up}review/{l}">Review sheet</a>: every language of a story side by side, with the pictures and the checklists.',
          '<a href="{up}art/{l}">Prepare pictures</a>: get pictures to the right size and the right name.',
          'The live site shows only stories whose status is <em>published</em>.',
        ],
      ],
      [
        'A new story (always German first)',
        [
          'In the CMS: <em>Deutsch (Quelle)</em>, then <em>New</em>.',
          '<em>Story id</em>: three digits, a dash, a lowercase name, e.g. <code>023-nora</code>. It never changes and is also the folder name for pictures and audio.',
          'Title, emoji, 1 to 3 skills, band, summary (1-2 sentences) and <em>The one idea</em>.',
          'Write the text like a document. A horizontal line (Insert, divider) starts a new page; page 1 pairs with picture 1 and recording 1.',
          'Add the questions and the prompts for grown-ups. The status stays <em>draft</em>.',
        ],
      ],
      [
        'Pictures and audio',
        [
          'Convert pictures first with <a href="{up}art/{l}">Prepare pictures</a>: 1200 px wide, WebP, at most 120 KB, correctly named (<code>023-nora_cover.webp</code>, <code>023-nora_frame-01_colour.webp</code>).',
          'Upload them in the CMS under <em>Story art</em> into the folder <code>023-nora</code>: exactly the story id, no spaces, no other folder names.',
          'Audio (optional): one recording per page, <code>01.m4a</code>, <code>02.m4a</code>, under <em>Narration audio</em> in the folder <code>de/023-nora</code>.',
          'Choose the pictures in <em>Cover</em> and <em>Page pictures</em> and write alt text for each: describe what a child who cannot see the picture would need to know. Not a caption.',
          'Fill <em>How the art was made</em>: tool and model, who checked the pictures and when.',
        ],
      ],
      [
        'Translating',
        [
          'In the CMS open the language (e.g. <em>العربية</em>), <em>New</em>, and under <em>Story</em> pick the German original.',
          'Title, summary, the one idea, text, questions and the alt texts in this language. Alt texts in the same order as the German pictures.',
          'The same number of pages as the German (the same number of dividers), or two-language reading does not work. The review sheet shows whether the pages line up.',
          'Retell, do not translate word for word. The status stays <em>draft</em>.',
        ],
      ],
      [
        'Reviewing and signing',
        [
          'Someone other than the writer or translator reviews. For a translation: someone fluent in the language.',
          'Open the story\'s <a href="{up}review/{l}">review sheet</a> and go through the checklists. Then read the real page in the preview, on a phone too; for Arabic and Urdu check the layout.',
          'When everything is right: in the CMS, in that language\'s file, fill <em>Reviewed by</em> (your name) and <em>Reviewed on</em> (today).',
        ],
      ],
      [
        'Publishing and taking down',
        [
          'Set only finished, reviewed files to <em>published</em> and save. Each language has its own status.',
          'A few minutes later the <a href="{up}status/{l}">status page</a> shows either that everything passed (the story goes live shortly) or that it is blocked, and why.',
          'A blocked file holds back every later save. Either add what is missing or set the file back to <em>draft</em>.',
          'Taking down: set the status to <em>draft</em> and save. The story leaves the live site within minutes.',
        ],
      ],
      [
        'When something goes wrong',
        [
          '"The preview could not be built": the status page names the file and the field. Fix that field in the CMS and save again.',
          'A picture is missing in the preview: check the folder and file name exactly (story id, two-digit number, .webp).',
          'Anything else: write to the site owner with the link to the status page.',
        ],
      ],
    ],
  },
  ar: {
    dir: 'rtl',
    title: 'دليل المشرفين',
    intro: 'كل ما تحتاجونه لقصة، من المسودة الأولى حتى النشر. هذه الصفحات للفريق فقط ولا تظهر في محركات البحث.',
    cmsFallback: 'عنوان نظام إدارة المحتوى الذي حصلتم عليه',
    reviewOptional: 'حاليًا المراجعة ليست إلزامية: الملف الذي حالته <em>published</em> يُنشر. راجعوا متى أمكن مع ذلك وسجّلوا المراجعة.',
    sections: [
      [
        'صفحاتكم',
        [
          '<strong>نظام إدارة المحتوى</strong> ({cms}): كتابة القصص وترجمتها ونشرها.',
          '<a href="{up}">المعاينة</a>: الموقع مع كل المسودات، كما سيراه القراء تمامًا. يُعاد بناؤها بعد دقائق من كل حفظ.',
          '<a href="{up}status/{l}">الحالة</a>: هل نجح آخر حفظ، وما الذي ينقص كل قصة في كل لغة.',
          '<a href="{up}review/{l}">ورقة المراجعة</a>: كل لغات القصة جنبًا إلى جنب مع الصور وقوائم الفحص.',
          '<a href="{up}art/{l}">تجهيز الصور</a>: ضبط حجم الصور وأسمائها.',
          'الموقع المباشر يعرض فقط القصص التي حالتها <em>published</em>.',
        ],
      ],
      [
        'قصة جديدة (بالألمانية أولًا دائمًا)',
        [
          'في نظام إدارة المحتوى: <em>Deutsch (Quelle)</em> ثم <em>جديد</em>.',
          '<em>Story id</em>: ثلاثة أرقام وشرطة واسم بحروف لاتينية صغيرة، مثل <code dir="ltr">023-nora</code>. لا يتغير أبدًا، وهو أيضًا اسم مجلد الصور والصوت.',
          'العنوان والرمز التعبيري ومن مهارة إلى ثلاث والمستوى والملخص (جملة أو جملتان) و<em>The one idea</em> (الفكرة الواحدة).',
          'اكتبوا النص كمستند. الخط الأفقي (إدراج، فاصل) يبدأ صفحة جديدة؛ الصفحة 1 تقابل الصورة 1 والتسجيل 1.',
          'أضيفوا الأسئلة ومحفزات الحوار للكبار. تبقى الحالة <em>draft</em>.',
        ],
      ],
      [
        'الصور والصوت',
        [
          'حوّلوا الصور أولًا في <a href="{up}art/{l}">تجهيز الصور</a>: عرض 1200 بكسل، WebP، حتى 120 كيلوبايت، بالاسم الصحيح.',
          'ارفعوها في نظام إدارة المحتوى تحت <em>Story art</em> إلى مجلد <code dir="ltr">023-nora</code>: معرّف القصة نفسه، بلا مسافات ولا أسماء مجلدات أخرى.',
          'الصوت (اختياري): تسجيل لكل صفحة <code dir="ltr">01.m4a</code> و<code dir="ltr">02.m4a</code> تحت <em>Narration audio</em> في مجلد اللغة ثم معرّف القصة.',
          'اختاروا الصور في <em>Cover</em> و<em>Page pictures</em> واكتبوا لكل صورة نصًا بديلًا يصف ما يحتاج طفل لا يرى الصورة إلى معرفته. ليس تعليقًا.',
          'املؤوا <em>How the art was made</em>: الأداة والنموذج، ومن راجع الصور ومتى.',
        ],
      ],
      [
        'الترجمة',
        [
          'افتحوا لغة الترجمة في نظام إدارة المحتوى، ثم <em>جديد</em>، واختاروا الأصل الألماني في <em>Story</em>.',
          'العنوان والملخص والفكرة الواحدة والنص والأسئلة والنصوص البديلة بهذه اللغة، بترتيب الصور الألمانية نفسه.',
          'عدد الصفحات نفسه كما في الألمانية (عدد الفواصل نفسه)، وإلا لا تعمل القراءة بلغتين. ورقة المراجعة تبيّن تطابق الصفحات.',
          'أعيدوا السرد ولا تترجموا حرفيًا. تبقى الحالة <em>draft</em>.',
        ],
      ],
      [
        'المراجعة والتوقيع',
        [
          'يراجع شخص غير الكاتب أو المترجم. للترجمة: شخص يتقن اللغة.',
          'افتحوا <a href="{up}review/{l}">ورقة المراجعة</a> للقصة وراجعوا قوائم الفحص، ثم اقرؤوا الصفحة الحقيقية في المعاينة، على الهاتف أيضًا، وانتبهوا لتخطيط العربية والأردية.',
          'إذا كان كل شيء صحيحًا: في ملف هذه اللغة املؤوا <em>Reviewed by</em> (اسمكم) و<em>Reviewed on</em> (تاريخ اليوم).',
        ],
      ],
      [
        'النشر والسحب',
        [
          'اضبطوا فقط الملفات الجاهزة والمراجَعة على <em>published</em> واحفظوا. لكل لغة حالتها الخاصة.',
          'بعد دقائق تعرض <a href="{up}status/{l}">صفحة الحالة</a> أن كل شيء سليم (فتُنشر القصة قريبًا) أو أنه محجوب مع السبب.',
          'الملف المحجوب يوقف كل الحفظ اللاحق. أكملوا الناقص أو أعيدوا الملف إلى <em>draft</em>.',
          'السحب: اضبطوا الحالة على <em>draft</em> واحفظوا. تختفي القصة من الموقع المباشر خلال دقائق.',
        ],
      ],
      [
        'إذا حدثت مشكلة',
        [
          '«تعذّر بناء المعاينة»: صفحة الحالة تذكر الملف والحقل. صحّحوا الحقل واحفظوا من جديد.',
          'صورة لا تظهر في المعاينة: تحققوا من اسم المجلد واسم الملف بدقة (معرّف القصة، رقم من خانتين، .webp).',
          'أي شيء آخر: راسلوا صاحب الموقع مع رابط صفحة الحالة.',
        ],
      ],
    ],
  },
};

export const ART = {
  de: {
    dir: 'ltr',
    title: 'Bilder vorbereiten',
    intro: 'Bilder hineinziehen oder auswählen. Sie werden hier im Browser auf 1200 px Breite verkleinert, in WebP (höchstens 120 KB) umgewandelt und richtig benannt. Nichts wird hochgeladen; die Dateien bleiben auf diesem Gerät, bis du sie im CMS hochlädst.',
    storyId: 'Story id (z. B. 023-nora)',
    badId: 'Drei Ziffern, Bindestrich, kleingeschriebener Name.',
    choose: 'Bilder auswählen oder hierher ziehen',
    role: 'Verwendung',
    cover: 'Titelbild',
    frame: n => `Seite ${n}`,
    convert: 'Umwandeln',
    downloadAll: 'Alle als ZIP herunterladen',
    download: 'Herunterladen',
    small: w => `Nur ${w} px breit: wird nicht vergrößert. Besser eine größere Vorlage verwenden.`,
    big: kb => `Auch bei niedrigster Qualität ${kb} KB: bitte ein ruhigeres Bild oder eine kleinere Vorlage.`,
    duplicate: 'Zwei Bilder haben dieselbe Verwendung.',
    noWebp: 'Dieser Browser konnte keine WebP-Dateien erstellen. Bitte die Seite neu laden oder einen anderen Browser versuchen.',
    next: 'Danach im CMS unter Story art in den Ordner mit der Story id hochladen.',
    guide: 'Anleitung',
  },
  en: {
    dir: 'ltr',
    title: 'Prepare pictures',
    intro: 'Drop or choose pictures. They are resized here in the browser to 1200 px wide, converted to WebP (at most 120 KB) and named correctly. Nothing is uploaded; the files stay on this device until you upload them in the CMS.',
    storyId: 'Story id (e.g. 023-nora)',
    badId: 'Three digits, a dash, a lowercase name.',
    choose: 'Choose pictures or drop them here',
    role: 'Use',
    cover: 'Cover',
    frame: n => `Page ${n}`,
    convert: 'Convert',
    downloadAll: 'Download all as ZIP',
    download: 'Download',
    small: w => `Only ${w} px wide: it will not be enlarged. A larger original is better.`,
    big: kb => `Still ${kb} KB at the lowest quality: please use a calmer picture or a smaller original.`,
    duplicate: 'Two pictures have the same use.',
    noWebp: 'This browser could not make WebP files. Please reload the page or try another browser.',
    next: 'Then upload them in the CMS under Story art into the folder named after the story id.',
    guide: 'Guide',
  },
  ar: {
    dir: 'rtl',
    title: 'تجهيز الصور',
    intro: 'اسحبوا الصور أو اختاروها. تُصغَّر هنا في المتصفح إلى عرض 1200 بكسل وتُحوَّل إلى WebP (حتى 120 كيلوبايت) وتُسمّى بالاسم الصحيح. لا يُرفع شيء؛ تبقى الملفات على هذا الجهاز حتى ترفعوها في نظام إدارة المحتوى.',
    storyId: 'معرّف القصة (مثل 023-nora)',
    badId: 'ثلاثة أرقام وشرطة واسم بحروف لاتينية صغيرة.',
    choose: 'اختاروا الصور أو اسحبوها إلى هنا',
    role: 'الاستخدام',
    cover: 'الغلاف',
    frame: n => `الصفحة ${n}`,
    convert: 'تحويل',
    downloadAll: 'تنزيل الكل كملف ZIP',
    download: 'تنزيل',
    small: w => `العرض ${w} بكسل فقط: لن تُكبَّر. الأفضل استخدام أصل أكبر.`,
    big: kb => `ما زالت ${kb} كيلوبايت بأقل جودة: استخدموا صورة أهدأ أو أصلًا أصغر.`,
    duplicate: 'صورتان لهما الاستخدام نفسه.',
    noWebp: 'لم يتمكن هذا المتصفح من إنشاء ملفات WebP. أعيدوا تحميل الصفحة أو جرّبوا متصفحًا آخر.',
    next: 'بعد ذلك ارفعوها في نظام إدارة المحتوى تحت Story art إلى المجلد الذي يحمل معرّف القصة.',
    guide: 'الدليل',
  },
};
