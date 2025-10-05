import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';

export default defineConfig({
  integrations: [
    mdx(),
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
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
  }
});