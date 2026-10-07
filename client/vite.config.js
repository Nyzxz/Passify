import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Proxy so the client can call /api/... without CORS pain once it's wired to the server.
  server: { port: 5173, proxy: { "/api": "http://localhost:4000" } },
});
