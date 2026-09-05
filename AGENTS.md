# AGENTS.md

## This repository is public

No origins, credentials, personal data, or analytics IDs in source. Every deploy
supplies its own through the environment.

## Deployment

One variable describes a deploy. `SITE_URL` is its public URL, and any subpath
becomes Astro's `base`:

| `SITE_URL`                       | site                      | base      |
| -------------------------------- | ------------------------- | --------- |
| `https://example.com`            | `https://example.com`     | `/`       |
| `https://owner.github.io/a-repo` | `https://owner.github.io` | `/a-repo` |

`NOINDEX=1` keeps a deploy out of search results. `BASE_PATH` overrides the
derived base, which is only needed behind a proxy.

Real environment variables win over `.env.local`, which wins over `.env`. The
production host and CI set the first; local work uses the second.

There is one build script, and every deploy is a different environment for it.

Rules:

- A build with no `SITE_URL` fails. Never add a domain as a fallback.
- An unconfigured `npm run build` must stay production-shaped: root-mounted and
  indexable. The production host picks which script runs and we cannot change
  that, so the default has to be the safe one. Deviations opt in.
- Never rename the `build` script, and never put a domain in a package script.
- Branch on `import.meta.env.NOINDEX`, never on a hostname.
- `astro preview` re-reads the config, so it needs the same environment as the
  build that produced `dist`. Keeping it in `.env.local` is what makes
  `npm run build && npm run preview` agree.
- A wrong base shows up only as 404s on every asset. After touching
  `astro.config.mjs`, build once at a root URL and once at a subpath URL, then
  check the asset hrefs in `dist/index.html`.
