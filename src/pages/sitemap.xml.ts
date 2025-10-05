import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

const SITE_URL = 'https://lernen-mit-geschichten.de';

export const GET: APIRoute = async () => {
  const stories = await getCollection('stories');

  // Group stories by slug (without language prefix)
  const storyMap = new Map<string, Set<string>>();

  stories.forEach(story => {
    const slug = story.slug.replace(/^[a-z]{2}\//, '');
    const lang = story.slug.split('/')[0];

    if (!storyMap.has(slug)) {
      storyMap.set(slug, new Set());
    }
    storyMap.get(slug)?.add(lang);
  });

  const locales = ['de', 'ar', 'en', 'tr', 'ur'];
  const staticPages = [
    { path: '', priority: '1.0' },
    { path: 'about', priority: '0.8' },
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Add homepage and static pages for each locale
  locales.forEach(locale => {
    staticPages.forEach(page => {
      const path = locale === 'de' ? `/${page.path}` : `/${locale}/${page.path}`;

      sitemap += `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
`;

      // Add alternate language links
      locales.forEach(altLocale => {
        const altPath = altLocale === 'de' ? `/${page.path}` : `/${altLocale}/${page.path}`;

        sitemap += `    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${SITE_URL}${altPath}" />
`;
      });

      sitemap += `  </url>
`;
    });
  });

  // Add story pages
  storyMap.forEach((languages, slug) => {
    languages.forEach(lang => {
      const path = lang === 'de' ? `/stories/${slug}` : `/${lang}/stories/${slug}`;

      sitemap += `  <url>
    <loc>${SITE_URL}${path}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
`;

      // Add alternate language links for available translations
      languages.forEach(altLang => {
        const altPath = altLang === 'de' ? `/stories/${slug}` : `/${altLang}/stories/${slug}`;

        sitemap += `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${SITE_URL}${altPath}" />
`;
      });

      sitemap += `  </url>
`;
    });
  });

  sitemap += `</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
