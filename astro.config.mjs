import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';

import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import partytown from '@astrojs/partytown';
import sitemap from '@astrojs/sitemap';

// A blank field in a hosting panel means unset, not empty.
const trimmed = (value) => {
  const text = value?.trim();
  return text ? text : undefined;
};

// This file runs before Astro loads .env, so read those files here too and let
// a real environment variable win. Hosts and CI set the latter.
const fileEnv = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');
const fromEnv = (name) => trimmed(process.env[name]) ?? trimmed(fileEnv[name]);

// Panels and workflows hand booleans over as strings, "false" included.
const isTruthy = (value) => {
  const text = trimmed(value)?.toLowerCase();
  return text !== undefined && text !== '0' && text !== 'false';
};

const normalizeBase = (path) => (path === '/' ? '/' : path.replace(/\/+$/, ''));

const rawSiteUrl = fromEnv('SITE_URL') ?? (process.argv.includes('build') ? undefined : 'http://localhost:4321');

if (!rawSiteUrl) {
  throw new Error(
    'Building requires SITE_URL: the public URL of this deploy, including any ' +
      'subpath (https://example.com or https://example.com/docs). Set it in the deploy environment.'
  );
}

let deployUrl;
try {
  deployUrl = new URL(rawSiteUrl);
} catch {
  throw new Error(`SITE_URL is not a valid URL: "${rawSiteUrl}". Include the scheme, e.g. https://example.com.`);
}

const SITE_URL = deployUrl.origin;

// SITE_URL carries the mount path. BASE_PATH overrides it behind a proxy, where
// the public URL and the mount path are not the same thing.
const BASE_PATH = normalizeBase(fromEnv('BASE_PATH') ?? deployUrl.pathname);

const NOINDEX = isTruthy(fromEnv('NOINDEX'));

// A wrong base shows up only as 404s on every asset.
console.log(`[deploy] site=${SITE_URL} base=${BASE_PATH} noindex=${NOINDEX}`);

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
  vite: {
    define: { 'import.meta.env.NOINDEX': JSON.stringify(NOINDEX) },
  },
  // Astro applies base to a redirect's source but not its destination, so a bare
  // '/' would send a subpath deploy off the site.
  redirects: {
    '/de': `${BASE_PATH === '/' ? '' : BASE_PATH}/`,
  },
  output: 'static',
  site: SITE_URL,
  base: BASE_PATH,
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
