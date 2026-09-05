# AGENTS.md

## This repository is public

No origins, credentials, personal data, or analytics IDs in source. Every deploy
supplies its own through the environment.

## Once per clone

Git does not clone hooks. `make hooks` points `core.hooksPath` at `.githooks/`, which checks the
conventional prefix on every commit subject. Commit format is `CONTRIBUTING.md`; the short version
is that branch commits are squashed, so the squash subject is the one that has to read as a single
conventional line.

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

## Localization

Stories live at `src/content/stories/<locale>/<slug>.md` and are joined across locales by the
`storyId` in their frontmatter, not by filename. Coverage is uneven, so check before assuming a
translation exists:

```sh
node scripts/content-report.mjs            # which stories are missing which languages
node scripts/content-report.mjs --matrix   # the full per-story grid
```

**Unpublishing.** Set `status: draft` in a story's frontmatter — it then gets no page, no listing
and no sitemap entry. Read the collection through `getPublishedStories()` in `src/utils/stories.ts`;
calling `getCollection('stories')` directly bypasses the gate and leaks a draft into one surface
while the others hide it.

**Current policy — string freeze.** Do not merge work that adds new UI translation keys. The string
surface is the binding constraint on shipping the feature backlog, and it is being routed through a
translation pipeline before it is allowed to grow. Fixing or translating existing keys is always
fine. This lifts when the pipeline lands; until then, a change that needs new keys is a conversation,
not a merge.

## Verifying a build

`scripts/verify-build.mjs` walks every HTML file in `dist/`, resolves internal `href`/`src` against
real output, and cross-checks the sitemap. It detects the base path from the build itself, so it
works for a root deploy and a subpath deploy alike.

```sh
SITE_URL=https://example.com npm run build && node scripts/verify-build.mjs
```

It exits non-zero only on leaked runtime error strings. Broken links are reported without failing,
because pages that exist in German but not the other four locales would fail every run. Use it as a
diff against the previous run, not as a gate.
