import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./models/db.js";

const PORT = process.env.PORT || 4000;

await connectDatabase();
app.listen(PORT, () => console.log(`Passify API running on http://localhost:${PORT}`));
