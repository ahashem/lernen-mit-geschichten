// Visit counting (Google Analytics through Google Tag Manager) runs only after a grown-up allows it on this device.
// The key starts with `reader-`, so "Forget this device" clears the choice with everything else.
export const CONSENT_KEY = 'reader-consent';

export type Consent = 'granted' | 'denied';

/** The GTM container from the build environment, or undefined when unset or malformed. */
export function gtmId(): string | undefined {
  const id = String(import.meta.env.PUBLIC_GTM_ID ?? '').trim();
  // A truthy check shipped `id=_` to production once; require a real container ID.
  return /^GTM-[A-Z0-9]+$/.test(id) ? id : undefined;
}

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === 'granted' || v === 'denied' ? v : null;
  } catch {
    return null;
  }
}

/** Google Analytics' own cookies (`_ga`, `_ga_<id>`), on this host and its parent domains. */
export function clearAnalyticsCookies() {
  const names = document.cookie
    .split(';')
    .map(c => c.split('=')[0].trim())
    .filter(n => n === '_ga' || n.startsWith('_ga_') || n === '_gid');
  const parts = location.hostname.split('.');
  const domains = [''];
  for (let i = 0; i < parts.length - 1; i++) domains.push(`; domain=.${parts.slice(i).join('.')}`);
  for (const n of names)
    for (const d of domains)
      document.cookie = `${n}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d}`;
}

/**
 * Stores the choice. Allowing loads the container now; withdrawing clears the cookies and reloads, because a loaded
 * container cannot be unloaded from the page.
 */
export function setConsent(value: Consent) {
  const before = readConsent();
  try {
    localStorage.setItem(CONSENT_KEY, value);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  if (value === 'granted') (window as unknown as { lmgLoadGtm?: () => void }).lmgLoadGtm?.();
  else {
    clearAnalyticsCookies();
    if (before === 'granted') location.reload();
  }
  document.dispatchEvent(new CustomEvent('lmg-consent', { detail: value }));
}
