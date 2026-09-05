// BASE_URL is '/' at root deploy and '/sub' (or '/sub/') under a subpath.
// Strip the trailing slash so `${BASE_PATH}/x` yields exactly one separator.
export const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');
