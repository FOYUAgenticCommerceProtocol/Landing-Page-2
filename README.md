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
