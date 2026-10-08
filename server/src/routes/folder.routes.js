import { Router } from "express";
import { getFolders, getSubfolders, createFolder } from "../controllers/folder.controller.js";
const r = Router();
r.get("/", getFolders);
r.post("/", createFolder);
r.get("/:id/subfolders", getSubfolders);
export default r;
