import { fmt } from '@utils/i18n';

const $ = <T extends HTMLElement>(root: ParentNode, selector: string) =>
  root.querySelector<T>(selector);

/**
 * Class room, single-screen (ux/03 10): the story on a projector or a held-up tablet.
 * Bands 1-2 read as Kamishibai (picture first, text behind a toggle); bands 3-4 as shared reading
 * (large text, one sentence marked at a time). Nothing is counted or stored.
 */
export function startClassroom(app: HTMLElement, locale: string, strings: Record<string, string>) {
  const room = $<HTMLElement>(app, '.view.classroom');
  const opener = $<HTMLElement>(app, '[data-action="class-room"]');
  if (!room || !opener) return;
  const book = $<HTMLElement>(app, '.view.book');
  const source = $<HTMLElement>(app, '.story-content');
  const bookPages = book ? [...book.querySelectorAll<HTMLElement>('.page')] : [];
  const shared = bookPages.length === 0;

  const frame = $<HTMLElement>(room, '[data-frame]')!;
  const caption = $<HTMLElement>(room, '[data-caption]')!;
  const notes = $<HTMLElement>(room, '[data-notes]')!;
  const notesText = $<HTMLElement>(room, '[data-notes-text]')!;
  const next = $<HTMLElement>(room, '[data-next-frame]')!;
  const pos = $<HTMLElement>(room, '[data-pos]')!;
  const black = $<HTMLElement>(room, '[data-black]')!;
  const text = $<HTMLElement>(room, '[data-shared]')!;

  // Shared reading: chapters from the `##` sections, sentences wrapped so one can be marked.
  const chapters: HTMLElement[][] = [];
  if (shared && source)
    for (const node of [...source.children] as HTMLElement[]) {
      if (node.tagName === 'H2') chapters.push([node]);
      else if (chapters.length && node.tagName !== 'H1') chapters[chapters.length - 1].push(node);
    }
  const total = shared ? chapters.length : bookPages.length;
  if (total === 0) return opener.remove();

  let index = 0;
  let sentence = -1;
  let hidden: HTMLElement[] = [];
  const seg = new Intl.Segmenter(locale, { granularity: 'sentence' });

  function render() {
    pos.textContent = fmt(strings[shared ? 'chapterShort' : 'pageOf'], { n: index + 1, total });
    if (shared) {
      text.replaceChildren(
        ...chapters[index].map(n => {
          const copy = n.cloneNode(true) as HTMLElement;
          if (copy.tagName === 'P') {
            const plain = copy.textContent ?? '';
            copy.replaceChildren(
              ...[...seg.segment(plain)].map(part => {
                const span = document.createElement('span');
                span.className = 'cr-s';
                span.textContent = part.segment;
                return span;
              })
            );
          }
          return copy;
        })
      );
      sentence = -1;
      hidden = [...text.querySelectorAll<HTMLElement>('.cr-s')];
      text.scrollTop = 0;
      return;
    }
    const page = bookPages[index];
    frame.replaceChildren(
      ...[...(page.querySelector('.frame')?.children ?? [])].map(n => n.cloneNode(true))
    );
    const block = page.querySelector<HTMLElement>(
      `.text-block[data-lang-block="${locale}"] .story-text`
    );
    const words = (block?.textContent ?? '').replace(/\s+/g, ' ').trim();
    caption.textContent = words;
    notesText.textContent = words;
    const upcoming = bookPages[index + 1]?.querySelector('.frame');
    next.replaceChildren(...(upcoming ? [...upcoming.children].map(n => n.cloneNode(true)) : []));
    next.hidden = !upcoming;
  }

  function go(step: number) {
    const to = index + step;
    if (to < 0 || to >= total) return;
    index = to;
    render();
  }

  function mark(step: number) {
    const to = Math.max(-1, Math.min(hidden.length - 1, sentence + step));
    hidden.forEach((el, i) => el.classList.toggle('is-marked', i === to));
    sentence = to;
    hidden[to]?.scrollIntoView({
      block: 'center',
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    });
  }

  let restore: HTMLElement[] = [];
  function open() {
    restore = [...app.querySelectorAll<HTMLElement>('.view')].filter(v => !v.hidden);
    for (const v of restore) v.hidden = true;
    room.hidden = false;
    room.dataset.mode = shared ? 'shared' : 'kamishibai';
    document.body.dataset.reading = 'true';
    black.hidden = true;
    render();
    room.focus({ preventScroll: true });
  }
  function close() {
    room.hidden = true;
    for (const v of restore) v.hidden = false;
    document.body.dataset.reading = String(app.dataset.view === 'book');
    opener!.focus();
  }
  const toggle = (el: HTMLElement) => (el.hidden = !el.hidden);

  const actions: Record<string, () => void> = {
    'class-exit': close,
    'class-prev': () => go(-1),
    'class-next': () => go(1),
    'class-captions': () => toggle(caption),
    'class-notes': () => toggle(notes),
    'class-black': () => toggle(black),
    'class-mark': () => mark(1),
  };
  room.addEventListener('click', e => {
    const action = (e.target as HTMLElement).closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action && actions[action]) actions[action]();
    else if (!black.hidden) black.hidden = true;
  });
  opener.addEventListener('click', open);

  document.addEventListener('keydown', e => {
    if (room.hidden || e.ctrlKey || e.metaKey || e.altKey) return;
    const rtl = document.documentElement.dir === 'rtl';
    const key = e.key;
    const forward =
      key === 'PageDown' ||
      (key === ' ' && !e.shiftKey) ||
      key === (rtl ? 'ArrowLeft' : 'ArrowRight');
    const back =
      key === 'PageUp' || (key === ' ' && e.shiftKey) || key === (rtl ? 'ArrowRight' : 'ArrowLeft');
    if (forward) go(1);
    else if (back) go(-1);
    else if (key === 'Escape') close();
    else if (key.toLowerCase() === 'b') toggle(black);
    else if (key.toLowerCase() === 'c') toggle(caption);
    else if (key.toLowerCase() === 't') toggle(notes);
    else if (shared && key === 'ArrowDown') mark(1);
    else if (shared && key === 'ArrowUp') mark(-1);
    else if (shared && key === ']') go(1);
    else if (shared && key === '[') go(-1);
    else return;
    e.preventDefault();
  });
}
