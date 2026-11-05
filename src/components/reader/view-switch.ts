/**
 * Switches between a story's views through a same-document view transition (ux/04), so a view never just blinks:
 * - `book`: the cover grows into the open book (the current page's sheet takes the cover's `story-art` name) and
 *   shrinks back into the cover on the way out.
 * - `sheet`: a view of text (the whole story, a chapter) is laid over the cover like a fresh sheet and lifted off
 *   again; this is the default page transition in global.css.
 * Without view transitions, under reduced motion, or with no kind, the views simply swap.
 */
export type ViewSwitch = 'book' | 'sheet';

let running = 0;

export function switchView(kind: ViewSwitch | null, update: () => void, art?: HTMLElement | null) {
  if (
    !kind ||
    !document.startViewTransition ||
    document.hidden ||
    matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    update();
    return;
  }
  const root = document.documentElement;
  const mine = ++running;
  if (art) art.style.viewTransitionName = 'story-art';
  root.dataset.vt = kind;
  const done = () => {
    if (art) art.style.viewTransitionName = '';
    if (mine === running) delete root.dataset.vt;
  };
  document.startViewTransition(update).finished.then(done, done);
}

/** Which switch a move between two views is: into or out of the book, onto or off a sheet of text, or none. */
export function switchFor(from: string | undefined, to: string): ViewSwitch | null {
  if (!from || from === to || (from !== 'cover' && to !== 'cover')) return null;
  const other = from === 'cover' ? to : from;
  if (other === 'book') return 'book';
  if (other === 'text' || other === 'chapters') return 'sheet';
  return null;
}
