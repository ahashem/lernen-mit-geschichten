import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import partytown from '@astrojs/partytown';

export default defineConfig({
  integrations: [
    mdx(),
    react(),
    keystatic(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
  output: 'static',
  site: 'https://lernen-mit-geschichten.de',
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'ar', 'en', 'tr', 'ur'],
    routing: {
      prefixDefaultLocale: false
    }
  }
});