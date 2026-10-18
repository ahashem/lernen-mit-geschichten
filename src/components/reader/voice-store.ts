// A grown-up's own narration, kept in this browser only (IndexedDB). Nothing here is ever sent anywhere.
const DB = 'lmg-voice';
const STORE = 'recordings';

interface Recording {
  blob: Blob;
  /** Fingerprint of the page text it was made against; a changed text no longer matches. */
  hash: string;
}

const key = (storyId: string, locale: string, page: number) => `${storyId}:${locale}:${page}`;

/** FNV-1a over the whitespace-normalised text: cheap, stable, and enough to notice an edit. */
export function hashText(text: string): string {
  let h = 0x811c9dc5;
  for (const ch of text.replace(/\s+/g, ' ').trim()) {
    h = Math.imul(h ^ ch.codePointAt(0)!, 0x01000193) >>> 0;
  }
  return h.toString(16);
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(
  mode: IDBTransactionMode,
  act: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  const db = await open();
  try {
    return await new Promise<T>((resolve, reject) => {
      const req = act(db.transaction(STORE, mode).objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } finally {
    db.close();
  }
}

export const canStore = () => typeof indexedDB !== 'undefined';

export const saveRecording = (
  storyId: string,
  locale: string,
  page: number,
  blob: Blob,
  text: string
) =>
  run('readwrite', s =>
    s.put({ blob, hash: hashText(text) } satisfies Recording, key(storyId, locale, page))
  );

export const removeRecording = (storyId: string, locale: string, page: number) =>
  run('readwrite', s => s.delete(key(storyId, locale, page)));

/** The saved recording of each page whose text still matches, or undefined where there is none. */
export async function loadRecordings(
  storyId: string,
  locale: string,
  texts: string[]
): Promise<(Blob | undefined)[]> {
  return Promise.all(
    texts.map(async (text, page) => {
      const found = (await run('readonly', s => s.get(key(storyId, locale, page)))) as
        Recording | undefined;
      return found && found.hash === hashText(text) ? found.blob : undefined;
    })
  );
}

export async function removeStoryRecordings(storyId: string, locale: string, pages: number) {
  for (let page = 0; page < pages; page++) await removeRecording(storyId, locale, page);
}

/** Privacy page: forget everything. */
export function forgetAllRecordings(): Promise<void> {
  return new Promise(resolve => {
    if (!canStore()) return resolve();
    const req = indexedDB.deleteDatabase(DB);
    req.onsuccess = req.onerror = req.onblocked = () => resolve();
  });
}
