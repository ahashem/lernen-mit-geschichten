# Reach and trust

## Privacy (a product feature, not a footnote)

- Zero third-party requests: self-host fonts, no CDN scripts, no embeds. Today `global.css` imports Google Fonts, which goes.
  `GTMTracking.astro` loads Google Tag Manager in production; it stays until the owner chooses a replacement, and the
  privacy page must say so plainly. Do not add any new third-party request.
- No cookies, no accounts, no PII. Device state (`localStorage`/IndexedDB) is described on a plain-language
  privacy page in all five locales, with a "clear my data on this device" control.
- Recordings and bookshelf data never leave the device.

## Accessibility

WCAG 2.1 AA verified, not asserted: keyboard path through every screen, visible focus, 44 px targets, 4.5:1 text
contrast, correct roles and live announcements for page changes and feedback, `prefers-reduced-motion`, mirrored
controls in RTL, a pre-reader path (icons and audio carry meaning). Options: larger text, dyslexia-friendly face,
high contrast. Screen-reader pass with VoiceOver on iOS and TalkBack on Android.

## Performance and offline

Budgets are in `01`. Method: responsive images (`astro:assets`), lazy loading below the fold, self-hosted font
subsets per script, no layout shift, minimal JavaScript on listing pages. Installable web app (manifest) and, behind `PUBLIC_OFFLINE=1` (off by default), a
service worker that caches the shell and every story the reader opened, including audio and images; must respect
the base path because staging lives under a subpath. Production builds with `npm run build` only (`AGENTS.md`).

## Discoverability

Per-story Open Graph and Twitter cards with the cover; `hreflang` between translations joined by `storyId`;
`Article` structured data; sitemap (already generated); unique titles and descriptions from `summary`; staging
stays `noindex`. Write for the searches parents and educators actually make: feelings and situations in each
language, not skill ids.

## Brand and voice

A warm, calm, trustworthy non-profit. The visual identity is defined in `ux/02-visual-language.md`. Voice for
adults: plain, reassuring, never preachy; for children: short, concrete, kind. The site says what it is and how
art is made (AI-assisted, human-reviewed) in an About page in five languages.

## Security and integrity

Static output only. Dependabot and `npm audit` clean; CI runs tests and build on pull requests; pinned Node;
no secrets in the repo (it is public). Moderator tooling never has write access beyond the content branch.
