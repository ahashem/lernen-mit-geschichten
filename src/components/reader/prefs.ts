// Device state only: nothing here is ever sent anywhere.
export interface Prefs {
  textStep: number;
  spacing: boolean;
  highlight: boolean;
  autoTurn: boolean;
  speed: number;
  sleep: number;
  theme: 'day' | 'lamp';
  narrate: boolean;
  voice: 'both' | 'first' | 'second';
  lang?: string;
  second?: string;
}

const PREFS_KEY = 'reader-prefs';
const DEFAULTS: Prefs = {
  textStep: 0,
  spacing: false,
  highlight: true,
  autoTurn: false,
  speed: 1,
  sleep: 0,
  theme: 'day',
  narrate: false,
  voice: 'both',
};

export const read = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
export const write = (key: string, value: string | null) => {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage can be blocked; the reader still works */
  }
};

export function loadPrefs(): Prefs {
  try {
    return { ...DEFAULTS, ...JSON.parse(read(PREFS_KEY) ?? '{}') };
  } catch {
    return { ...DEFAULTS };
  }
}

export function savePrefs(prefs: Prefs) {
  write(PREFS_KEY, JSON.stringify(prefs));
}

export function applyTheme(prefs: Prefs) {
  if (prefs.theme === 'lamp') document.documentElement.dataset.theme = 'lamp';
  else delete document.documentElement.dataset.theme;
}
