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
