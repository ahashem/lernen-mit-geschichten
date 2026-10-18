import type { APIRoute } from 'astro';
import { BASE_PATH, OFFLINE } from '@utils/site';
import { buildMarker } from '@utils/build-marker';
import { getTranslation, isRTL, type Locale } from '@utils/i18n';

const locales: Locale[] = ['de', 'ar', 'en', 'tr', 'ur'];

// With the flag off this is a worker that removes itself and its caches, so a device that once ran an
// offline build returns to a normal site.
const off = `self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) if (name.startsWith('lmg-')) await caches.delete(name);
      await self.registration.unregister();
    })()
  );
});
`;

const offlinePage = () =>
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${getTranslation('de', 'siteName')}</title>` +
  `<body style="font:20px/1.5 system-ui;margin:2rem;background:#fbf5ea;color:#24212e">` +
  locales
    .map(
      l =>
        `<p lang="${l}" dir="${isRTL(l) ? 'rtl' : 'ltr'}">${getTranslation(l, 'offlineNeedsInternet')}</p>`
    )
    .join('') +
  `<p><a href="${BASE_PATH}/">${getTranslation('de', 'siteName')}</a></p>`;

// Every story page, its pictures and its audio are cached the first time they are read (the offline bar in
// 01), so a story opened once reads fully offline. Navigations try the network first and fall back to the cache.
const on = (cache: string, offline: string) => `const CACHE = ${JSON.stringify(cache)};
const BASE = ${JSON.stringify(BASE_PATH)};
const OFFLINE_PAGE = ${JSON.stringify(offline)};

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      for (const name of await caches.keys()) if (name.startsWith('lmg-') && name !== CACHE) await caches.delete(name);
      await self.clients.claim();
    })()
  );
});

async function ranged(request, cache) {
  const hit = await cache.match(request.url);
  if (!hit) {
    // Audio is asked for in ranges, which cannot be cached; fetch the whole file once in the background.
    cache.add(request.url).catch(() => {});
    return fetch(request);
  }
  const buffer = await hit.arrayBuffer();
  const [, from, to] = /bytes=(\\d*)-(\\d*)/.exec(request.headers.get('range')) || [];
  const start = from ? Number(from) : 0;
  const end = to ? Math.min(Number(to), buffer.byteLength - 1) : buffer.byteLength - 1;
  return new Response(buffer.slice(start, end + 1), {
    status: 206,
    headers: {
      'Content-Type': hit.headers.get('Content-Type') || 'audio/mp4',
      'Content-Range': 'bytes ' + start + '-' + end + '/' + buffer.byteLength,
      'Content-Length': String(end - start + 1),
    },
  });
}

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith(BASE + '/')) return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      if (request.headers.has('range')) return ranged(request, cache);
      if (request.mode === 'navigate') {
        try {
          const fresh = await fetch(request);
          if (fresh.ok) cache.put(request, fresh.clone());
          return fresh;
        } catch {
          return (await cache.match(request, { ignoreSearch: true })) || new Response(OFFLINE_PAGE, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
      }
      const hit = await cache.match(request);
      if (hit) return hit;
      const fresh = await fetch(request);
      if (fresh.ok) cache.put(request, fresh.clone());
      return fresh;
    })()
  );
});
`;

export const GET: APIRoute = () =>
  new Response(OFFLINE ? on(`lmg-${buildMarker()}`, offlinePage()) : off, {
    headers: { 'Content-Type': 'text/javascript; charset=utf-8' },
  });
