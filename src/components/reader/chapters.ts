import { fmt } from '@utils/i18n';
import { applyTheme, loadPrefs, read, savePrefs, write } from './prefs';

const $ = <T extends HTMLElement>(root: ParentNode, selector: string) =>
  root.querySelector<T>(selector);

/**
 * The chapter reader for bands 3-4. Chapters are the `##` sections of the full text already on the page,
 * so the markup, the no-JS view and the booklet export all stay as they are.
 */
export function startChapters(
  app: HTMLElement,
  storyId: string,
  locale: string,
  strings: Record<string, string>
) {
  const prefs = loadPrefs();
  const source = $<HTMLElement>(app, '.story-content');
  const view = $<HTMLElement>(app, '.view.chapters');
  if (!source || !view) return;

  const chapters: Node[][] = [];
  for (const node of [...source.childNodes]) {
    if (node instanceof HTMLElement && node.tagName === 'H2') chapters.push([node]);
    else if (chapters.length && !(node instanceof HTMLElement && node.tagName === 'H1'))
      chapters[chapters.length - 1].push(node);
  }
  const total = chapters.length;
  app.dataset.ready = '';
  const views = [...app.querySelectorAll<HTMLElement>('.view')];
  const body = $<HTMLElement>(view, '[data-chapter-body]')!;
  const pos = $<HTMLElement>(view, '[data-chapter-pos]')!;
  const fill = $<HTMLElement>(view, '[data-chapter-fill]')!;
  const next = $<HTMLButtonElement>(view, '[data-action="chapter-next"]')!;
  const prev = $<HTMLButtonElement>(view, '[data-action="chapter-prev"]')!;
  const nextLabel = $<HTMLElement>(view, '[data-next-label]')!;
  const lamp = $<HTMLButtonElement>(view, '[data-action="chapters-lamp"]')!;
  const key = `reader-chapter:${storyId}:${locale}`;
  const lastKey = 'reader-last';
  let current = 0;

  // Bookmark: {chapter, offset}, offset being how far down the chapter the reader was.
  const saved = (read(key) ?? '').split(':').map(Number);
  const titleOf = (i: number) => chapters[i][0].textContent ?? '';

  function show(name: 'cover' | 'chapters' | 'text' | 'end', push = true) {
    for (const v of views) v.hidden = v.dataset.view !== name;
    app.dataset.view = name;
    document.body.dataset.reading = String(name === 'chapters');
    const hash =
      name === 'chapters' ? `#chapter-${current + 1}` : name === 'cover' ? '' : `#${name}`;
    if (push && hash !== location.hash)
      history.pushState(null, '', hash || location.pathname + location.search);
    $<HTMLElement>(app, `.view[data-view="${name}"]`)?.focus({ preventScroll: true });
  }

  function open(index: number, offset = 0, push = true) {
    current = Math.max(0, Math.min(total - 1, index));
    body.replaceChildren(...chapters[current].map(n => n.cloneNode(true)));
    pos.textContent = fmt(strings.chapterShort, { n: current + 1, total });
    prev.hidden = current === 0;
    nextLabel.textContent =
      current < total - 1
        ? fmt(strings.chapterDoneNext, { n: current + 1, title: titleOf(current + 1) })
        : strings.theEnd;
    next.setAttribute('aria-label', nextLabel.textContent);
    show('chapters', push);
    window.scrollTo(0, offset * (document.documentElement.scrollHeight - innerHeight));
    track();
  }

  function track() {
    const room = document.documentElement.scrollHeight - innerHeight;
    const offset = room > 0 ? Math.min(1, scrollY / room) : 1;
    fill.style.inlineSize = `${Math.round(offset * 100)}%`;
    if (app.dataset.view !== 'chapters') return;
    write(key, `${current}:${offset.toFixed(2)}`);
    write(lastKey, `${storyId}:${locale}`);
  }

  const label = $<HTMLElement>(app, '[data-resume-label]');
  if (label && read(key)) label.textContent = label.dataset.continue ?? label.textContent;

  const actions: Record<string, () => void> = {
    'start-chapters': () => open(read(key) ? saved[0] || 0 : 0, saved[1] || 0),
    'full-text': () => show('text'),
    'chapters-back': () => show('cover'),
    'chapter-prev': () => open(current - 1),
    'chapter-next': () => {
      if (current < total - 1) open(current + 1);
      else {
        write(key, null);
        write(lastKey, null);
        show('end');
      }
    },
    think: () => {
      const button = $<HTMLButtonElement>(app, '[data-action="think"]')!;
      const list = $<HTMLElement>(app, '#think-prompts')!;
      list.hidden = !list.hidden;
      button.setAttribute('aria-expanded', String(!list.hidden));
    },
    'chapters-lamp': () => {
      prefs.theme = prefs.theme === 'lamp' ? 'day' : 'lamp';
      applyTheme(prefs);
      lamp.setAttribute('aria-pressed', String(prefs.theme === 'lamp'));
      savePrefs(prefs);
    },
  };
  app.addEventListener('click', e => {
    const target = e.target as HTMLElement;
    const action = target.closest<HTMLElement>('[data-action]')?.dataset.action;
    if (action && actions[action]) return actions[action]();
    const chapter = target.closest<HTMLElement>('[data-chapter]');
    if (chapter) open(Number(chapter.dataset.chapter));
    const step = target.closest<HTMLElement>('[data-text-step]');
    if (step) {
      prefs.textStep = Math.max(-3, Math.min(3, prefs.textStep + Number(step.dataset.textStep)));
      app.style.setProperty('--text-step', String(prefs.textStep));
      savePrefs(prefs);
    }
  });

  // `[` and `]` jump chapters; Esc leaves the chapter (ux/03 5b). Arrow keys keep their scrolling job.
  document.addEventListener('keydown', e => {
    if (app.dataset.view !== 'chapters' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === ']' && current < total - 1) open(current + 1);
    else if (e.key === '[' && current > 0) open(current - 1);
    else if (e.key === 'Escape') show('cover');
  });
  addEventListener('scroll', () => requestAnimationFrame(track), { passive: true });

  const viewOf = (hash: string) => (hash === '#text' ? 'text' : hash === '#end' ? 'end' : 'cover');

  function fromHash() {
    const m = /^#chapter-(\d+)$/.exec(location.hash);
    if (m) open(Number(m[1]) - 1, 0, false);
    else show(viewOf(location.hash), false);
  }
  addEventListener('popstate', fromHash);

  app.style.setProperty('--text-step', String(prefs.textStep));
  applyTheme(prefs);
  lamp.setAttribute('aria-pressed', String(prefs.theme === 'lamp'));
  const initial = /^#chapter-(\d+)$/.exec(location.hash);
  if (initial)
    open(Number(initial[1]) - 1, (saved[0] === Number(initial[1]) - 1 && saved[1]) || 0, false);
  else show(viewOf(location.hash), false);
}
