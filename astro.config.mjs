import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    mdx(),
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
    sitemap({
      i18n: {
        defaultLocale: 'de',
        locales: {
          de: 'de',
          ar: 'ar',
          en: 'en',
          tr: 'tr',
          ur: 'ur',
        },
      },
    }),
  ],
  output: 'static',
  site: 'https://ahashem.github.io',
  base: '/lernen-mit-geschichten',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'ar', 'en', 'tr', 'ur'],
    routing: {
      prefixDefaultLocale: false
    }
  },
  experimental: {
    clientPrerender: true,
  }
});