# Passify

React + Vite + Tailwind v4 client, Express MVC server. Mock data and simulated auth only.

## Run it
```bash
npm run install:all   # root, /server and /client
npm run dev           # API :4000, client :5173
```
Sign in with any valid email and an 8+ character password (client-side mock), or use Google/Apple/SSO buttons.

## Try the API
```bash
TOKEN=$(curl -s -X POST localhost:4000/api/auth/login -H 'Content-Type: application/json' \
  -d '{"email":"demo@passify.app","password":"password123"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).data.token')
curl -H "Authorization: Bearer $TOKEN" localhost:4000/api/folders                 # nested tree
curl -H "Authorization: Bearer $TOKEN" localhost:4000/api/folders/f-cs/subfolders
curl -H "Authorization: Bearer $TOKEN" -F files=@notes.txt localhost:4000/api/review-sets/upload
```

## Notes
- Folders are stored flat (id, parentId); the API returns a recursive tree, the client walks parentId links.
- Mock tokens and plaintext passwords are for scaffolding only.
- Shortcuts: Cmd/Ctrl+K command menu, Space/arrows in flashcards.
