import { Router } from "express";
import { getCurrentUser, login, register } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
const r = Router();
r.post("/login", login);
r.post("/register", register);
r.get("/me", requireAuth, getCurrentUser);
export default r;
