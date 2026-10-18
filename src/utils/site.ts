// BASE_URL is '/' at root deploy and '/sub' (or '/sub/') under a subpath.
// Strip the trailing slash so `${BASE_PATH}/x` yields exactly one separator.
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

// Offline reading ships off. Only a build that sets PUBLIC_OFFLINE=1 registers the service worker.
export const OFFLINE = ['1', 'true', true].includes(import.meta.env.PUBLIC_OFFLINE);
