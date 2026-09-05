/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Keep this deploy out of search results. Injected by astro.config.mjs. */
  readonly NOINDEX: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
