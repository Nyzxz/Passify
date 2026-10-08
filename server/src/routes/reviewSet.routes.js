import { Router } from "express";
import multer from "multer";
import { getReviewSets, uploadReviewSets } from "../controllers/reviewSet.controller.js";
import { HttpError } from "../services/studySet.service.js";

const ALLOWED = [".pdf", ".docx", ".doc", ".txt"];
// Files stay in memory (mock): nothing is written to disk.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.slice(file.originalname.lastIndexOf(".")).toLowerCase();
    cb(ALLOWED.includes(ext) ? null : new HttpError(400, `Unsupported file type: ${file.originalname}`), ALLOWED.includes(ext));
  },
});

const r = Router();
r.get("/", getReviewSets);
r.post("/upload", upload.array("files", 10), uploadReviewSets);
export default r;
