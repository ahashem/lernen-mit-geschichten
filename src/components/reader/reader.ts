import { fmt } from '@utils/i18n';
import { bestVoice, withoutEmoji } from '@utils/speech';
import { applyTheme, loadPrefs, read, savePrefs, write } from './prefs';
import { startChapters } from './chapters';
import { startClassroom } from './classroom';
import { startVoice } from './voice';
import { switchFor, switchView } from './view-switch';

interface Timing {
  w: number;
  start: number;
  end: number;
}

interface ReaderData {
  storyId: string;
  locale: string;
  title: string;
  siteName: string;
  endonyms: Record<string, string>;
  aligned: string[];
  audio: string[] | null;
  timings: (Timing[] | null)[] | null;
  pageCount: number;
  strings: Record<string, string>;
}

const $ = <T extends HTMLElement>(root: ParentNode, selector: string) =>
  root.querySelector<T>(selector);
const $$ = <T extends HTMLElement>(root: ParentNode, selector: string) => [
  ...root.querySelectorAll<T>(selector),
];
const speakable = (el: HTMLElement) => withoutEmoji(el.textContent ?? '');

export function startReader() {
  const app = $<HTMLElement>(document, '.story-app');
  const dataEl = document.getElementById('reader-data');
  if (!app || !dataEl) return;
  const data: ReaderData = JSON.parse(dataEl.textContent ?? '{}');
  const hasBook = app.dataset.hasBook === 'true';
  startClassroom(app, data.locale, data.strings);
  if (!hasBook && app.dataset.chapters) {
    startChapters(app, data.storyId, data.locale, data.strings);
    return;
  }
  const pageRtl = () => (book?.dir || document.documentElement.dir) === 'rtl';
  const isRtl = (locale: string) => locale === 'ar' || locale === 'ur';
  let pair: { first: string; second: string } | null = null;
  const t = data.strings;
  const prefs = loadPrefs();
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const resumeKey = `reader-resume:${data.storyId}:${data.locale}`;
  // The one story the home offers to continue; the home reads it, nothing else does.
  const LAST_KEY = 'reader-last';

  const views = $$(app, '.view');
  const book = $<HTMLElement>(app, '.view.book');
  const pages = book ? $$(book, '.page') : [];

  // Read-along keeps the sentence being read in view: a third of the way down the box, so the next lines show too.
  // Only scrolls when the sentence is not already comfortably visible, so short pages never move.
  const follow = (el: Element | undefined) => {
    const box = el?.closest<HTMLElement>('.texts');
    if (!el || !box || box.scrollHeight <= box.clientHeight) return;
    const r = el.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const margin = Math.min(48, b.height / 5);
    if (r.top >= b.top + margin && r.bottom <= b.bottom - margin) return;
    box.scrollTo({
      top: box.scrollTop + (r.top - b.top) - b.height / 3,
      behavior: reduceMotion.matches ? 'auto' : 'smooth',
    });
  };

  // A page whose text runs past the sheet says so (a fade and an arrow), so a child knows to scroll; once scrolled,
  // the top edge fades too, so lines pass softly under the picture instead of being cut by it.
  const markOverflow = (box: HTMLElement) => {
    box.toggleAttribute('data-more', box.scrollTop + box.clientHeight < box.scrollHeight - 4);
    box.toggleAttribute('data-scrolled', box.scrollTop > 4);
  };
  // Two languages on a phone: once the reader scrolls into the text, the picture steps back to a strip (StoryPage,
  // .page[data-compact]) and returns at the top of the text or on the next page. It only steps back when the text
  // would still need scrolling afterwards; otherwise the scroll would snap to the top and the picture bounce back.
  const phone = matchMedia('(max-width: 599px) and (orientation: portrait)');
  const COMPACT_SHARE = 0.2;
  // The strip is a layout change, which CSS may not transition (ux/04 allows transform and opacity only), so it is
  // played the FLIP way: the text box starts where it was and glides into place, the picture starts at its old size.
  const setCompact = (page: HTMLElement, on: boolean) => {
    if (page.hasAttribute('data-compact') === on) return;
    const frame = $<HTMLElement>(page, '.frame');
    const box = $<HTMLElement>(page, '.texts');
    const art = frame?.firstElementChild as HTMLElement | null;
    const before = frame?.getBoundingClientRect().height ?? 0;
    page.toggleAttribute('data-compact', on);
    if (!frame || !box || reduceMotion.matches || typeof box.animate !== 'function') return;
    const after = frame.getBoundingClientRect().height;
    if (!before || !after || before === after) return;
    const timing = { duration: dur(), easing: 'cubic-bezier(0.4, 0, 0.2, 1)' };
    box.animate(
      [{ transform: `translateY(${before - after}px)` }, { transform: 'translateY(0)' }],
      timing
    );
    art?.animate(
      [
        { transform: `scale(${before / after})`, transformOrigin: '50% 0' },
        { transform: 'scale(1)', transformOrigin: '50% 0' },
      ],
      timing
    );
  };
  const yieldPicture = (page: HTMLElement, box: HTMLElement) => {
    if (!phone.matches || !app.hasAttribute('data-pair') || box.scrollTop <= 0) {
      setCompact(page, false);
      return;
    }
    if (page.hasAttribute('data-compact') || box.scrollTop < 16) return;
    const frame = $<HTMLElement>(page, '.frame');
    const freed = (frame?.offsetHeight ?? 0) - page.clientHeight * COMPACT_SHARE;
    if (freed > 0 && box.scrollHeight - box.clientHeight > freed + 24) setCompact(page, true);
  };
  if (typeof ResizeObserver !== 'undefined') {
    const watch = new ResizeObserver(entries =>
      entries.forEach(e => markOverflow(e.target.closest<HTMLElement>('.texts')!))
    );
    pages.forEach(page => {
      const box = $<HTMLElement>(page, '.texts');
      if (!box) return;
      watch.observe(box);
      box.querySelectorAll<HTMLElement>('.text-block').forEach(b => watch.observe(b));
      box.addEventListener(
        'scroll',
        () => {
          markOverflow(box);
          yieldPicture(page, box);
        },
        { passive: true }
      );
    });
  }
  let current = 0;
  let narrating = false;
  let keyboardTurn = false;
  let lastTurn = 0;
  let talked = false;
  let wakeLock: WakeLockSentinel | null = null;
  // Recordings made on this device (voice.ts); they win over the bundled narration and the device voice.
  let own: (string | undefined)[] = [];

  app.dataset.ready = '';

  // Views switch instantly while the reader starts up (a shared #book link), and through a transition after that.
  let settled = false;

  function showView(name: string, push = true) {
    const kind = settled ? switchFor(app!.dataset.view, name) : null;
    // Into or out of the book, the current page's sheet and the cover are one picture that grows or shrinks.
    const sheet = kind === 'book' ? $<HTMLElement>(pages[current], '.sheet') : null;
    switchView(kind, () => applyView(name, push), sheet);
  }

  function applyView(name: string, push: boolean) {
    for (const v of views) v.hidden = v.dataset.view !== name;
    app!.dataset.view = name;
    const reading = name === 'book' || name === 'end' || name === 'cards';
    document.body.dataset.reading = String(reading);
    if (push && location.hash !== `#${name}`) history.pushState(null, '', `#${name}`);
    if (name !== 'book') {
      stopNarration();
      releaseWake();
    }
    const view = views.find(v => v.dataset.view === name);
    if (name === 'book') pages[current]?.focus({ preventScroll: true });
    else view?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    if (name === 'end') prepareEnd();
  }

  function view() {
    const name = location.hash.slice(1);
    if (!hasBook || !['book', 'end', 'cards', 'text'].includes(name)) return 'cover';
    return name;
  }

  /* ---- preferences ---- */
  function applyPrefs() {
    app!.style.setProperty('--text-step', String(prefs.textStep));
    app!.dataset.spacing = prefs.spacing ? 'wide' : 'normal';
    app!.dataset.highlight = prefs.highlight ? 'on' : 'off';
    applyTheme(prefs);
    for (const el of $$<HTMLInputElement>(app!, '[data-pref]')) {
      const key = el.dataset.pref;
      if (key === 'lamp') el.checked = prefs.theme === 'lamp';
      else if (el.type === 'checkbox') el.checked = Boolean(prefs[key as keyof Prefs]);
      else el.value = String(prefs[key as keyof Prefs]);
    }
    const lights = $<HTMLElement>(app!, '[data-action="lights-out"]');
    if (lights) lights.hidden = prefs.theme !== 'lamp';
  }

  /* ---- paging ---- */
  const dur = () =>
    parseFloat(getComputedStyle(app!).getPropertyValue('--dur-page')) ||
    (reduceMotion.matches ? 120 : 360);

  function go(next: number, fromKeyboard = false) {
    const now = Date.now();
    if (next === current || now - lastTurn < 500) return;
    if (next < 0) return;
    if (next >= pages.length) {
      write(resumeKey, null);
      write(LAST_KEY, null);
      return showView('end');
    }
    lastTurn = now;
    keyboardTurn = fromKeyboard;
    const forward = next > current;
    const out = pages[current];
    const into = pages[next];
    const sign = (forward ? -1 : 1) * (pageRtl() ? -1 : 1);
    stopNarration(true);
    into.hidden = false;
    // The motion is CSS (StoryPage, .is-leaving / .is-entering); here only the direction and the clean-up.
    for (const el of [out, into]) el.style.setProperty('--turn', String(sign));
    out.classList.add('is-leaving');
    into.classList.add('is-entering');
    let settled = false;
    const settle = (e?: Event) => {
      if (settled || (e && e.target !== out)) return;
      settled = true;
      out.hidden = true;
      out.classList.remove('is-leaving');
      into.classList.remove('is-entering');
      out.removeEventListener('animationend', settle);
      out.removeEventListener('animationcancel', settle);
    };
    out.addEventListener('animationend', settle);
    out.addEventListener('animationcancel', settle);
    // In case no animation runs at all, the old page still goes.
    window.setTimeout(settle, dur() + 100);
    current = next;
    write(resumeKey, String(current));
    write(LAST_KEY, `${data.storyId}:${data.locale}`);
    syncPageUi();
    // A page always opens at its first line, even if the reader scrolled it on an earlier visit.
    const intoText = $<HTMLElement>(into, '.texts');
    if (intoText) intoText.scrollTop = 0;
    into.removeAttribute('data-compact');
    // A message belongs to what was just tried on the page left behind.
    status('');
    into.focus({ preventScroll: true });
    if (narrating && !keyboardTurn) window.setTimeout(() => startNarration(), 400);
    else if (keyboardTurn && narrating) setNarrating(false);
  }

  function syncPageUi() {
    const dots = $<HTMLElement>(app!, '[data-dots]');
    if (dots) {
      dots.setAttribute('aria-label', fmt(t.pageOf, { n: current + 1, total: pages.length }));
      [...dots.children].forEach((d, i) => {
        d.classList.toggle('is-current', i === current);
        d.classList.toggle('is-done', i < current);
      });
    }
    $<HTMLButtonElement>(app!, '[data-action="prev"]')?.toggleAttribute('disabled', current === 0);
  }

  /* ---- narration ---- */
  const audio = new Audio();
  audio.preservesPitch = true;
  let sentenceIndex = 0;
  let raf = 0;
  let sleepTimer = 0;
  let token = 0;

  function status(message: string) {
    const el = $<HTMLElement>(app!, '[data-status]');
    if (!el) return;
    el.textContent = message;
    el.hidden = !message;
  }

  function clearMarks() {
    for (const el of $$(app!, '.is-on')) el.classList.remove('is-on');
  }

  function setNarrating(on: boolean) {
    narrating = on;
    prefs.narrate = on;
    const button = $<HTMLButtonElement>(app!, '[data-action="toggle-narration"]');
    button?.setAttribute('aria-pressed', String(on));
    $<HTMLElement>(button!, '[data-icon="play"]')!.hidden = on;
    $<HTMLElement>(button!, '[data-icon="pause"]')!.hidden = !on;
  }

  function stopNarration(keepState = false) {
    token++;
    cancelAnimationFrame(raf);
    audio.pause();
    speechSynthesis?.cancel();
    clearMarks();
    if (!keepState) setNarrating(false);
  }

  async function voice(locale: string): Promise<SpeechSynthesisVoice | null> {
    if (typeof speechSynthesis === 'undefined') return null;
    // Looked up on every use: a voice object from before a voiceschanged can go stale, and the browser then
    // falls back to the default voice, which reads only the punctuation of a script it cannot speak.
    const find = () => bestVoice(speechSynthesis.getVoices(), locale);
    const found = find();
    if (found) return found;
    await new Promise<void>(resolve => {
      speechSynthesis.addEventListener('voiceschanged', () => resolve(), { once: true });
      window.setTimeout(resolve, 1000);
    });
    return find();
  }

  function pageDone(mine: number) {
    if (mine !== token) return;
    if (prefs.autoTurn || prefs.theme === 'lamp') {
      window.setTimeout(() => mine === token && go(current + 1), 700);
    } else {
      const next = $<HTMLElement>(app!, '[data-action="next"]');
      next?.classList.add('pulse');
      window.setTimeout(() => next?.classList.remove('pulse'), 700);
      setNarrating(false);
    }
  }

  function playRecording(src: string, timings: Timing[] | null, mine: number, done: () => void) {
    const words = $$(block(current, data.locale), '.w');
    audio.src = src;
    audio.playbackRate = prefs.speed;
    audio.onended = done;
    audio.onerror = () => {
      status(t.noSoundNow);
      setNarrating(false);
    };
    audio.play().catch(() => {
      status(t.noSoundNow);
      setNarrating(false);
    });
    if (!timings) {
      // No word timings: the whole page is lit instead, and a long page scrolls along with the recording, so the
      // last lines are in view by the time they are read.
      $$(block(current, data.locale), '.s').forEach(el => el.classList.add('is-on'));
      const box = $<HTMLElement>(pages[current], '.texts');
      audio.ontimeupdate = () => {
        if (mine !== token || !box || !audio.duration) return;
        const max = box.scrollHeight - box.clientHeight;
        if (max <= 0) return;
        const progress = Math.min(
          1,
          Math.max(0, (audio.currentTime / audio.duration - 0.15) / 0.75)
        );
        box.scrollTop = max * progress;
      };
      return;
    }
    audio.ontimeupdate = null;
    let followed: Element | null = null;
    const tick = () => {
      const at = audio.currentTime;
      const active = timings.find(x => at >= x.start && at < x.end);
      words.forEach((el, i) => el.classList.toggle('is-on', active?.w === i));
      const lit = active ? words[active.w]?.closest('.s') : null;
      if (lit && lit !== followed) {
        followed = lit;
        follow(lit);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  }

  async function speakSentences(mine: number, locale: string, done: () => void) {
    const chosen = await voice(locale);
    if (mine !== token) return;
    if (!chosen) {
      status(fmt(t.noVoiceFor, { language: data.endonyms[locale] }));
      setNarrating(false);
      return;
    }
    const sentences = $$(block(current, locale), '.s');
    const next = async (i: number) => {
      if (mine !== token) return;
      const fresh = (await voice(locale)) ?? chosen;
      if (mine !== token) return;
      if (i >= sentences.length) return done();
      sentenceIndex = i;
      clearMarks();
      const sentence = sentences[i];
      sentence.classList.add('is-on');
      follow(sentence);
      const words = $$(sentence, '.w');
      const spoken = words.map(speakable);
      if (!spoken.some(Boolean)) return next(i + 1);
      const starts: number[] = [];
      let offset = 0;
      for (const w of spoken) {
        starts.push(offset);
        offset += w.length + 1;
      }
      const u = new SpeechSynthesisUtterance(spoken.join(' '));
      u.voice = fresh;
      u.lang = fresh.lang;
      u.rate = prefs.speed;
      u.onboundary = e => {
        if (mine !== token) return;
        const idx = starts.findLastIndex(s => s <= e.charIndex);
        words.forEach((w, n) => w.classList.toggle('is-on', n === idx));
      };
      u.onend = () => window.setTimeout(() => next(i + 1), band1Pause());
      u.onerror = () => mine === token && next(i + 1);
      speechSynthesis.speak(u);
    };
    next(sentenceIndex);
  }

  const block = (page: number, locale: string) =>
    $<HTMLElement>(pages[page], `[data-lang-block="${locale}"]`)!;

  const band1Pause = () => (app!.dataset.band === '1' ? 700 : 250);

  function startNarration(restart = false) {
    status('');
    token++;
    const mine = token;
    if (restart) sentenceIndex = 0;
    setNarrating(true);
    acquireWake();
    const order = pair
      ? prefs.voice === 'first'
        ? [pair.first]
        : prefs.voice === 'second'
          ? [pair.second]
          : [pair.first, pair.second]
      : [data.locale];
    const speak = (n: number) => {
      if (mine !== token) return;
      if (n >= order.length) return pageDone(mine);
      sentenceIndex = 0;
      const locale = order[n];
      const mineSrc = locale === data.locale ? own[current] : undefined;
      const src = mineSrc ?? (locale === data.locale ? data.audio?.[current] : undefined);
      const next = () => speak(n + 1);
      if (src) playRecording(src, mineSrc ? null : (data.timings?.[current] ?? null), mine, next);
      else speakSentences(mine, locale, next);
    };
    speak(0);
    armSleep();
    setMediaSession();
  }

  function armSleep() {
    window.clearTimeout(sleepTimer);
    if (!prefs.sleep) return;
    sleepTimer = window.setTimeout(() => {
      const steps = 20;
      let n = 0;
      const fade = window.setInterval(() => {
        audio.volume = Math.max(0, 1 - ++n / steps);
        if (n >= steps) {
          window.clearInterval(fade);
          stopNarration();
          audio.volume = 1;
        }
      }, 200);
      if (!own[current] && !data.audio?.[current]) {
        window.clearInterval(fade);
        stopNarration();
      }
    }, prefs.sleep * 60_000);
  }

  function setMediaSession() {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: data.title,
      artist: data.siteName,
    });
    navigator.mediaSession.setActionHandler('play', () => startNarration());
    navigator.mediaSession.setActionHandler('pause', () => stopNarration());
    navigator.mediaSession.setActionHandler('nexttrack', () => go(current + 1));
    navigator.mediaSession.setActionHandler('previoustrack', () => go(current - 1));
  }

  async function acquireWake() {
    try {
      wakeLock = (await navigator.wakeLock?.request('screen')) ?? null;
    } catch {
      wakeLock = null;
    }
  }

  function releaseWake() {
    wakeLock?.release().catch(() => {});
    wakeLock = null;
  }

  function speakWord(el: HTMLElement) {
    const idx = Number(el.dataset.w);
    const timing = data.timings?.[current]?.find(x => x.w === idx);
    const src = data.audio?.[current];
    const locale = el.closest<HTMLElement>('[data-lang-block]')?.dataset.langBlock ?? data.locale;
    stopNarration();
    if (src && timing && locale === data.locale) {
      audio.src = src;
      audio.currentTime = Math.max(0, timing.start - 0.03);
      const stop = () => {
        if (audio.currentTime >= timing.end + 0.06) {
          audio.pause();
          audio.removeEventListener('timeupdate', stop);
        }
      };
      audio.addEventListener('timeupdate', stop);
      audio.play().catch(() => {});
      return;
    }
    const text = speakable(el);
    if (!text) return;
    voice(locale).then(chosen => {
      if (!chosen) return status(fmt(t.noVoiceFor, { language: data.endonyms[locale] }));
      const u = new SpeechSynthesisUtterance(text);
      u.voice = chosen;
      u.lang = chosen.lang;
      u.rate = prefs.speed;
      speechSynthesis.speak(u);
    });
  }

  /* ---- two languages ---- */
  function applyPair() {
    if (!book) return;
    if (pair) app!.dataset.pair = '';
    else delete app!.dataset.pair;
    const first = pair?.first ?? data.locale;
    if (pair) book.dir = isRtl(first) ? 'rtl' : 'ltr';
    else book.removeAttribute('dir');
    if (pair) app!.dataset.pairWide = '';
    else delete app!.dataset.pairWide;
    for (const el of $$(book, '[data-lang-block]')) {
      const index = pair
        ? [pair.first, pair.second].indexOf(el.dataset.langBlock!)
        : el.dataset.langBlock === data.locale
          ? 0
          : -1;
      el.hidden = index < 0;
      el.style.order = String(index);
    }
  }

  const radios = (which: string) => $$<HTMLInputElement>(app!, `input[name="pair-${which}"]`);
  function syncRadios() {
    const chosen = (which: string) => radios(which).find(r => r.checked)?.value;
    for (const [mine, other] of [
      ['first', 'second'],
      ['second', 'first'],
    ]) {
      for (const r of radios(mine)) {
        const unavailable = !data.aligned.includes(r.value);
        r.disabled = unavailable || r.value === chosen(other);
      }
    }
    $<HTMLButtonElement>(app!, '[data-action="start-pair"]')!.disabled =
      !chosen('first') || !chosen('second');
  }

  function openPairSetup() {
    closeMenu();
    const first = prefs.lang && data.aligned.includes(prefs.lang) ? prefs.lang : data.locale;
    const second =
      prefs.second && prefs.second !== first && data.aligned.includes(prefs.second)
        ? prefs.second
        : data.aligned.find(l => l !== first);
    for (const r of radios('first')) r.checked = r.value === first;
    for (const r of radios('second')) r.checked = r.value === second;
    syncRadios();
    showView('pair');
  }

  /* ---- end, cards, lamp ---- */
  function prepareEnd() {
    const lamp = prefs.theme === 'lamp';
    const title = $<HTMLElement>(app!, '[data-end-title]');
    if (title) title.textContent = lamp ? t.goodNight : t.theEnd;
    // Questions are for daytime, so bedtime offers no talk cards.
    for (const el of $$(app!, '[data-action="talk"]')) el.hidden = lamp || talked;
  }

  function lightsOut(on: boolean) {
    const el = $<HTMLElement>(app!, '[data-blackout]');
    el?.classList.toggle('is-on', on);
    if (on) releaseWake();
    else if (narrating) acquireWake();
  }

  /* ---- wiring ---- */
  const actions: Record<string, () => void> = {
    'pair-setup': openPairSetup,
    'start-pair': () => {
      const pick = (which: string) => radios(which).find(r => r.checked)?.value;
      pair = { first: pick('first')!, second: pick('second')! };
      prefs.lang = pair.first;
      prefs.second = pair.second;
      savePrefs(prefs);
      applyPair();
      current = resumePage();
      showView('book');
      syncPageUi();
      offerRestart();
    },
    'read-with-me': () => {
      pair = null;
      applyPair();
      current = resumePage();
      showView('book');
      syncPageUi();
      offerRestart();
      startNarration();
    },
    'read-myself': () => {
      pair = null;
      applyPair();
      current = resumePage();
      showView('book');
      syncPageUi();
      offerRestart();
    },
    'full-text': () => showView('text'),
    prev: () => go(current - 1),
    next: () => go(current + 1),
    'toggle-narration': () => (narrating ? stopNarration() : startNarration()),
    repeat: () => {
      closeMenu();
      stopNarration(true);
      startNarration(true);
    },
    'to-cover': () => {
      closeMenu();
      showView('cover');
    },
    restart: () => {
      write(resumeKey, null);
      for (const p of pages) p.hidden = true;
      current = 0;
      pages[0].hidden = false;
      syncPageUi();
      pages[0].focus({ preventScroll: true });
      $<HTMLElement>(app!, '[data-action="restart"]')!.hidden = true;
    },
    again: () => {
      current = 0;
      talked = false;
      for (const p of pages) p.hidden = p !== pages[0];
      syncPageUi();
      showView('book');
    },
    talk: () => {
      for (const c of $$(app!, '[data-card]')) c.hidden = c.dataset.card !== '0';
      showView('cards');
    },
    'next-card': () => {
      const cards = $$(app!, '[data-card]');
      const i = cards.findIndex(c => !c.hidden);
      if (i < cards.length - 1) {
        cards[i].hidden = true;
        cards[i + 1].hidden = false;
        cards[i + 1].focus?.();
      } else {
        talked = true;
        showView('end');
      }
    },
    'lights-out': () => {
      closeMenu();
      lightsOut(true);
    },
    menu: () => (menuOpen() ? closeMenu() : openMenu()),
  };

  function resumePage() {
    const saved = Number(read(resumeKey));
    return saved > 0 && saved < pages.length ? saved : 0;
  }

  function offerRestart() {
    if (current === 0) return;
    const el = $<HTMLElement>(app!, '[data-action="restart"]');
    if (!el) return;
    el.hidden = false;
    window.setTimeout(() => (el.hidden = true), 5000);
  }

  const menu = $<HTMLElement>(app, '#reader-menu');
  const menuButton = $<HTMLElement>(app, '[data-action="menu"]');
  const menuOpen = () => (menu ? !menu.hidden : false);
  function openMenu() {
    if (!menu) return;
    menu.hidden = false;
    menuButton?.setAttribute('aria-expanded', 'true');
    $<HTMLElement>(menu, 'button, input, select')?.focus();
  }
  function closeMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    menuButton?.setAttribute('aria-expanded', 'false');
  }

  app.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const word = target.closest<HTMLElement>('.w');
    if (word && book?.contains(word)) return speakWord(word);
    const button = target.closest<HTMLElement>('[data-action]');
    if (button) actions[button.dataset.action ?? '']?.();
    const step = target.closest<HTMLElement>('[data-text-step]');
    if (step) {
      prefs.textStep = Math.max(-3, Math.min(3, prefs.textStep + Number(step.dataset.textStep)));
      applyPrefs();
      savePrefs(prefs);
    }
    if (menuOpen() && !menu!.contains(target) && !menuButton!.contains(target)) closeMenu();
  });

  app.addEventListener('change', e => {
    const el = e.target as HTMLInputElement;
    const key = el.dataset.pref;
    if (!key) return;
    if (key === 'lamp') {
      prefs.theme = el.checked ? 'lamp' : 'day';
      if (el.checked) status(t.lampTip);
    } else if (el.type === 'checkbox')
      (prefs as unknown as Record<string, unknown>)[key] = el.checked;
    else
      (prefs as unknown as Record<string, unknown>)[key] =
        key === 'voice' ? el.value : Number(el.value);
    applyPrefs();
    savePrefs(prefs);
    if (key === 'sleep') armSleep();
    if (key === 'speed' && narrating) startNarration();
  });

  app.addEventListener('change', e => {
    if ((e.target as HTMLInputElement).name?.startsWith('pair-')) syncRadios();
  });

  $<HTMLElement>(app, '[data-blackout]')?.addEventListener('click', () => lightsOut(false));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeMenu();
      lightsOut(false);
    }
    if (app!.dataset.view !== 'book' || (e.target as HTMLElement).closest('select, input')) return;
    const forward = pageRtl() ? 'ArrowLeft' : 'ArrowRight';
    const back = pageRtl() ? 'ArrowRight' : 'ArrowLeft';
    if (e.key === forward) go(current + 1, true);
    else if (e.key === back) go(current - 1, true);
  });

  /* Stage gestures: swipe 48px, tap the outer quarters to turn, the middle toggles controls. */
  const topbar = $<HTMLElement>(app, '[data-topbar]');
  let quietTimer = 0;
  const wake = () => {
    topbar?.classList.remove('is-quiet');
    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(() => topbar?.classList.add('is-quiet'), 3000);
  };
  const touches = new Set<number>();
  let down: { x: number; y: number } | null = null;
  const pagesEl = $<HTMLElement>(app, '.pages');
  pagesEl?.addEventListener('pointerdown', e => {
    touches.add(e.pointerId);
    down = touches.size === 1 ? { x: e.clientX, y: e.clientY } : null;
  });
  pagesEl?.addEventListener('pointercancel', e => {
    touches.delete(e.pointerId);
    down = null;
  });
  pagesEl?.addEventListener('pointerup', e => {
    touches.delete(e.pointerId);
    const start = down;
    down = null;
    if (!start || (e.target as HTMLElement).closest('.w')) return;
    const dx = e.clientX - start.x;
    const forward = pageRtl() ? -1 : 1;
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(e.clientY - start.y)) {
      return go(current + (dx * forward < 0 ? 1 : -1));
    }
    if (Math.hypot(dx, e.clientY - start.y) > 10) return;
    if (!(e.target as HTMLElement).closest('.frame')) return;
    const frame = (e.target as HTMLElement).closest('.frame')!.getBoundingClientRect();
    const rel = (e.clientX - frame.left) / frame.width;
    const startSide = pageRtl() ? 1 - rel : rel;
    if (startSide < 0.25) go(current - 1);
    else if (startSide > 0.75) go(current + 1);
    else if (topbar?.classList.contains('is-quiet')) wake();
    else topbar?.classList.add('is-quiet');
  });
  book?.addEventListener('pointermove', wake, { passive: true });
  book?.addEventListener('focusin', wake);

  window.addEventListener('popstate', () => showView(view(), false));
  window.addEventListener('pagehide', () => {
    stopNarration();
    releaseWake();
  });

  applyPrefs();
  if (hasBook) {
    syncPageUi();
    const initial = view();
    if (initial !== 'cover') {
      // A shared #book link has no gesture behind it, so it opens without narration.
      current = initial === 'book' ? resumePage() : 0;
      showView(initial === 'cards' ? 'cover' : initial, false);
      if (initial === 'book') syncPageUi();
    } else showView('cover', false);
    settled = true;
    startVoice(
      app,
      {
        storyId: data.storyId,
        locale: data.locale,
        strings: t,
        texts: pages.map((_, i) =>
          ($(block(i, data.locale), '.story-text').textContent ?? '').replace(/\s+/g, ' ').trim()
        ),
      },
      urls => (own = urls)
    );
  } else {
    for (const v of views) v.hidden = v.dataset.view !== 'cover' && v.dataset.view !== 'text';
  }
}
