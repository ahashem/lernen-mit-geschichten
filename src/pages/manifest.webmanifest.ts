import type { APIRoute } from 'astro';
import { BASE_PATH, OFFLINE } from '@utils/site';
import { getTranslation } from '@utils/i18n';

// Linked from the layout only when offline reading is on; the favicon is the one vector icon the site has.
export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      OFFLINE
        ? {
            name: getTranslation('de', 'siteName'),
            short_name: getTranslation('de', 'siteName'),
            start_url: `${BASE_PATH}/`,
            scope: `${BASE_PATH}/`,
            display: 'standalone',
            background_color: '#fbf5ea',
            theme_color: '#fbf5ea',
            icons: [{ src: `${BASE_PATH}/favicon.svg`, sizes: 'any', type: 'image/svg+xml' }],
          }
        : {}
    ),
    { headers: { 'Content-Type': 'application/manifest+json' } }
  );
