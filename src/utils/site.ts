// BASE_URL is '/' at root deploy and '/sub' (or '/sub/') under a subpath.
// Strip the trailing slash so `${BASE_PATH}/x` yields exactly one separator.
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Where a language's pages live: German at the base, every other language under its code. No trailing slash. */
export const localePrefix = (locale: string) =>
  locale === 'de' ? BASE_PATH : `${BASE_PATH}/${locale}`;

/** The number a story is known by in every language: the one its id starts with (001, 002 …). */
export const storyNumber = (storyId: string) => storyId.split('-')[0];

// Offline reading ships off. Only a build that sets PUBLIC_OFFLINE=1 registers the service worker.
export const OFFLINE = ['1', 'true', true].includes(import.meta.env.PUBLIC_OFFLINE);

// Where the "Tell us about this story" link writes to. Supplied by the deploy; with none, the link is not rendered.
export const FEEDBACK_EMAIL = (import.meta.env.PUBLIC_FEEDBACK_EMAIL ?? '').trim();
