import type { APIRoute } from 'astro';

import { BASE_PATH } from '@utils/site';

// A non-canonical deploy would compete with the real site for the same content.
export const GET: APIRoute = ({ site }) => {
  const origin = site?.origin ?? '';
  const isIndexable = !import.meta.env.NOINDEX;

  const body = isIndexable
    ? [
        '# Lernen mit Geschichten',
        '',
        'User-agent: *',
        'Allow: /',
        '',
        '# Sitemaps',
        `Sitemap: ${origin}${BASE_PATH}/sitemap-index.xml`,
        '',
      ].join('\n')
    : [
        '# Lernen mit Geschichten - not the canonical deploy, not for indexing',
        '',
        'User-agent: *',
        'Disallow: /',
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
