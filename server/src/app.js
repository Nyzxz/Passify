import express from "express";
import cors from "cors";
import morgan from "morgan";
import studySetRoutes from "./routes/studySet.routes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(morgan("dev"));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/study-sets", studySetRoutes);

app.use(notFound);
app.use(errorHandler);
export default app;
