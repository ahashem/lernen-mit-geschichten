import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
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