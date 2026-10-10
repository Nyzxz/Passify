import express from "express";
import cors from "cors";
import morgan from "morgan";
import studySetRoutes from "./routes/studySet.routes.js";
import authRoutes from "./routes/auth.routes.js";
import folderRoutes from "./routes/folder.routes.js";
import reviewSetRoutes from "./routes/reviewSet.routes.js";
import { requireAuth } from "./middleware/auth.js";
import { connectDatabase } from "./models/db.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", async (req, res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (e) {
    console.error("Database connection failed:", e.message);
    const configIssue = /^(MONGODB_URI|JWT_SECRET)/.test(e.message);
    const err = new Error(
      configIssue
        ? "The server is missing configuration. Check MONGODB_URI and JWT_SECRET."
        : "Can't reach the database. In MongoDB Atlas, check Network Access and the connection string."
    );
    err.status = 503;
    next(err);
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/study-sets", studySetRoutes);
app.use("/api/folders", requireAuth, folderRoutes);
app.use("/api/review-sets", requireAuth, reviewSetRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
