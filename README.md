# The Tesla Pod

The website for **The Tesla Pod** — a podcast recorded on Tesla FSD through San Francisco, hosted by Irosha de Silva ([Marketrix AI](https://marketrix.ai)).

Static site, no build step: `index.html` + `styles.css` + `app.js` + `data.js`.

## Highlights

- Episode grid with an in-page YouTube player (modal, keyboard navigable), synced live from the [@TeslaPod](https://www.youtube.com/@TeslaPod) channel via `/api/episodes` when available, with a baked-in fallback.
- A live map of San Francisco (Leaflet + CARTO tiles) where an animated "pod" navigates a real street-network graph between landmarks — click any landmark to reroute it, or let it wander on its own. Includes FSD speed profiles (Sloth → Mad Max), Studio Mode, Follow camera, Park/Resume, and a fullscreen mode.
- The guest-request form is styled as a Tesla center display, with a working app dock (vehicle status, climate, on-air episode, phone, settings).
- Light/dark theme, fully responsive.

## Running locally

```
node serve.mjs 4173
```

Then open `http://localhost:4173`.

## Structure

```
index.html   markup for all sections
styles.css   design system (editorial, ink-on-ivory, red as accent)
app.js       rendering, episode modal, map/pod logic, Tesla-screen apps
data.js      baked episode + guest data (fallback when the live API is unavailable)
assets/      portraits, thumbnails, brand assets
```
tools/       build scripts (below)
content/     optional per-episode transcripts (content/transcripts/<videoId>.json|.srt|.vtt)
```

## Building

Everything generated comes from one script. Run it after any content change:

```
node tools/build-thumbs.mjs   # WebP variants for new thumbnails (needs cwebp)
node tools/build-site.mjs     # insights/, episodes/, index.html pre-render, sitemap.xml, feed.xml, llms.txt
```

Never hand-edit `insights/*.html`, `episodes/*.html`, `sitemap.xml`, `feed.xml`, `llms.txt`
or the `<!-- build:… -->` blocks in `index.html` — the next build overwrites them.

## Adding an episode

1. `data.js`: new EPISODES entry at the top (with a `slug`) and a PEOPLE entry per guest.
2. `assets/thumbs/<videoId>.jpg` (from `i.ytimg.com/vi/<id>/maxresdefault.jpg`) and guest photos in `assets/people/`.
3. `app.js`: `COMPANIES` entry for a new company, `INSIGHT_SLUGS` entry once the article exists.
4. `tools/episodes-content.mjs`: show notes (SEO title, description, summary, topics).
5. `tools/build-site.mjs`: INSIGHTS entry for the article.
6. Optional: the episode's captions as `content/transcripts/<videoId>.srt` (YouTube Studio → Subtitles → Download).
7. Run both build scripts, commit, deploy.
