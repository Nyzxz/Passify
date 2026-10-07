# Passify

Study app scaffold: React + Vite + Tailwind v4 client, Express MVC server, mock data only.

## Run it
```bash
npm run install:all   # installs root, /server and /client
npm run dev           # API on :4000, client on :5173 (concurrently)
```
Try the API: `curl localhost:4000/api/study-sets`

## Notes
- The client currently uses a Zustand store seeded from `client/src/data/mockData.js`.
  To switch to the API, replace the store actions with `fetch("/api/study-sets")` (Vite proxies `/api`).
- Server layers: routes -> controllers -> services -> models. Replace `models/` with a DB later.
- Flashcard keys: Space flips, Left/Right arrows move.
