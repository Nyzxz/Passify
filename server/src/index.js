import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 4000;

// Vercel runs the exported app as a function; only listen on a port when running locally.
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Passify API running on http://localhost:${PORT}`));
}

export default app;
