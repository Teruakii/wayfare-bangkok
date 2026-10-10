# Wayfare: Bangkok

A minimal, editorial travel guide to restaurants and attractions in Bangkok. It's built with Next.js 16 (App Router), TypeScript and Tailwind CSS v4.

Built with Claude Code (AI-assisted development).

## Features

- **Browse:** Home, Restaurants and Attractions pages, each with an area filter kept in the URL.
- **Place detail:** photo, description, location, price, opening hours, a small map with a "Directions" link, average rating and reviews.
- **Search:** text search plus type and area filters (`/search?q=&type=&area=`). The form works without JavaScript, and bad filter values show an error instead of crashing.
- **Map:** all places on one Leaflet map (`/map`), with terracotta pins for restaurants and green pins for attractions. The Restaurants and Attractions pages also have a Grid / Map toggle.
- **Accounts:** register, log in and log out. After logging in, you return to the page you came from (`?next=`, same-site links only).
- **Favorites and reviews:** save places, and post a 1–5 star rating with a comment. Each user can review a place once.
- **Dashboard:** tabs for "Saved places" and "My reviews". It is protected twice: by `src/proxy.ts`, and again on the page itself.
- **Sample data:** 8 restaurants and 8 attractions across 6 areas (Old Town, Chinatown, Silom, Sukhumvit, Thonglor, Ari & Chatuchak).

## Architecture

```
app (routes)  →  presentation  →  domain  ←  data
                        ↘  di/container.ts  ↙
```

- `src/domain/`: entities, repository and auth interfaces, and use cases. This layer is plain TypeScript with no React or Next.js.
- `src/data/`: in-memory repositories, sample data, and `MockAuthService` (bcrypt-hashed passwords, HTTP-only session cookie).
- `src/presentation/`: components, server actions, and design tokens generated from `DESIGN.md`.
- `src/di/container.ts`: the only file that picks the concrete implementations. To use a real database or auth provider, you change this file only.

## Running it

Requires Node.js 20.9 or later (developed on Node 24).

```bash
npm install
npm run dev          # http://localhost:3000
npm test             # 36 Vitest tests for the use cases, auth and formatting
npm run typecheck
npm run lint
npm run build
```

### Demo account

| Email | Password |
|---|---|
| `demo@wayfare.app` | `wayfare123` |

You can also register a new account. All data lives in memory, so new accounts, reviews and favorites are lost when the server restarts.

## Bugs fixed along the way

Tests, HTTP checks, headless Chrome screenshots and an automated 33-step browser run caught these bugs:

1. **The map tiles said "API KEY REQUIRED".** The CARTO tiles used at first now need a key. The map now uses OpenStreetMap tiles, shown in grayscale so the pins are the only color.
2. **The ฿ sign rendered as a fallback glyph.** Inter has no ฿, so Noto Sans Thai was added as a fallback font.
3. **The page crashed after registering ("This page couldn't load").** Next 16 keeps visited pages alive in the background, and react-leaflet crashed when one became visible again. Back/forward navigation to any map page hit the same crash. The fix was to rewrite the map to drive Leaflet directly with proper cleanup and to remove react-leaflet.
4. **Server errors on every logged-in page.** The session expiry check reads the current time, which Next 16 doesn't allow during prerendering. Session reads now wait for the real request (`connection()`).
5. **The "Directions" link was indented** by leftover button padding.

## Known gaps before launch

- **Mock auth and in-memory data.** Replace both with a real auth provider (for example Auth.js) and a database by changing `src/di/container.ts`.
- **Map tiles.** OpenStreetMap's free tiles allow only light use. Switch to a provider with a key (MapTiler, Stadia, CARTO) by changing `TILE_URL` in `src/presentation/components/map/leaflet-map.tsx`.
- **Placeholder photos.** Every place uses a local SVG placeholder in `public/images/places/`.
- **Sample data accuracy.** The places are real, but their prices, opening hours and coordinates are approximate and need checking.
- **Unknown place URLs return HTTP 200, not 404.** Visitors see the not-found page and it is marked `noindex`. The usual fix (`dynamicParams = false`) isn't available with this Next.js setup.
- **Two primary buttons on place pages** ("Save place" and "Post review"). DESIGN.md allows one per screen.
- **The browser test isn't in the repo yet.** It would need `puppeteer-core` as a dev dependency.
