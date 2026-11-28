# Landing Page 2

The shopping agent landing site: one static page (`index.html`) plus its media.

- `index.html`: the whole site (Consumer, Merchant, Partner and Developer pages).
- `gallery.html`: the review gallery of the mockups.
- `media/`: films, posters, captions, compositions, mockups, icons and product photos.
- `netlify.toml`: Netlify settings. There is no build step; Netlify publishes the repository root.

## Deploy on Netlify

Import this repository in Netlify with:

- Branch: `main`
- Build command: leave empty
- Publish directory: `.` (the repository root)

Every push to `main` redeploys the site. Pull requests get their own preview link.

## Checks

`node scripts/check-site.mjs` runs on every pull request (workflow `site-check`). It checks that every page parses, every local link has a file or a redirect, `netlify.toml` proxies only to FOYU hosts and keeps its security headers, nothing looks like a secret key, and no page claims live money. Every Monday the same workflow asks foyu.ai for each page and opens a `site-check` issue if one does not answer.
