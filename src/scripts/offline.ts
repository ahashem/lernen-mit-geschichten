// Offline reading, only in builds with PUBLIC_OFFLINE=1: register the worker and tell the reader, once per session.
const bar = document.querySelector<HTMLElement>('[data-offline-bar]');
if (bar) {
  if ('serviceWorker' in navigator)
    navigator.serviceWorker.register(bar.dataset.sw!, { scope: bar.dataset.scope }).catch(() => {});

  const show = () => {
    try {
      if (sessionStorage.getItem('reader-offline-seen')) return;
      sessionStorage.setItem('reader-offline-seen', '1');
    } catch {
      /* storage blocked: the bar may show again */
    }
    bar.hidden = false;
  };
  if (!navigator.onLine) show();
  window.addEventListener('offline', show);
  bar.querySelector('button')?.addEventListener('click', () => (bar.hidden = true));
}
