import { Router } from "express";
import { getStudySets, getStudySet, createStudySet } from "../controllers/studySet.controller.js";

const router = Router();
router.get("/", getStudySets);
router.post("/", createStudySet);
router.get("/:id", getStudySet);
export default router;
