# Recipes PWA

Offline-friendly recipes browser built with React + Vite, Tailwind, shadcn/ui, and an Express proxy for TheMealDB.

## Features
- Search, browse by category, view recipe details
- Favorite/unfavorite recipes (IndexedDB) available fully offline
- Installable PWA with service worker precache + runtime caching and offline fallback
- Light/dark theme toggle, skeletons, toasts, and error boundary
- Secure backend proxy that hides TheMealDB key and adds basic caching

## Tech Stack
- Client: React 18, Vite, TypeScript, Tailwind, shadcn/ui-style components, TanStack Query, sonner toasts
- Server: Node.js, Express, helmet, compression, CORS, dotenv
- Storage: IndexedDB (via `idb`) for favorites

## Getting Started
```bash
# Server
cd server
cp .env.example .env
npm install
npm run dev  # starts http://localhost:5174

# Client (separate terminal)
cd ../client
npm install
npm run dev  # starts http://localhost:5173 with proxy to server
```

### Environment Variables (server)
- `MEALDB_API_BASE` (default `https://www.themealdb.com/api/json/v1`)
- `MEALDB_API_KEY` (default `1` for dev)
- `PORT` (default `5174`)

### Scripts
- Server: `npm run dev`, `npm run build`, `npm start`
- Client: `npm run dev`, `npm run build`, `npm run preview`

## shadcn/ui Notes
- Components are hand-authored in `client/src/components/ui/*` following shadcn conventions (button, card, input, badge, skeleton).
- If you want the full generator: install `shadcn-ui` CLI and run `npx shadcn-ui@latest init` in `client`, then generate components as needed.

## PWA Details
- Manifest: `client/public/manifest.webmanifest`
- Service worker: `client/public/sw.js` (manual, no Workbox)
- Offline fallback: `client/public/offline.html`
- Precache: app shell (`/`, `/index.html`, manifest, offline page)
- Runtime caching:
  - `/api/*`: Network-first with cache fallback (for search/details)
  - Images/categories: Stale-While-Revalidate
  - Navigations: offline fallback to `offline.html`
- Install prompt handled by browser; SW registered in `src/main.tsx`.

### Offline Testing
1. Run server and client.
2. Open the app, browse some recipes, open details to cache them.
3. Toggle DevTools → Network → Offline.
4. Refresh: app shell loads, favorites are available; search/detail use cached responses when present; navigations fall back to `offline.html` when not cached.

## Deploy Notes
- Server: Render/Fly/Heroku. Ensure env vars are set. Serve over HTTPS for PWA installability.
- Client: Netlify/Vercel/Static hosting. Set proxy/base URL to your server; update `vite.config.ts` proxy or use env `VITE_API_BASE` + adjust fetch base.
- Icons: placeholders live in `client/public/icons/`. Replace with proper 192/512/maskable PNGs for production.

## Post-Generation Checklist
- Replace placeholder icons with branded assets.
- Optional: add ESLint/Prettier.
- Optional: add analytics/monitoring.
- Verify service worker scope/path if hosting under a sub-path.

