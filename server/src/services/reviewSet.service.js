import { randomUUID } from "node:crypto";
import { db } from "../models/db.js";
import { HttpError } from "./studySet.service.js";

export const ReviewSetService = {
  list: (ownerId, folderId) =>
    db.reviewSets.filter((r) => r.ownerId === ownerId && (folderId === undefined || r.folderId === (folderId || null))),

  // Mock "processing": one review set per uploaded file, card count derived from file size.
  upload(ownerId, files = [], folderId = null) {
    if (!files.length) throw new HttpError(400, "Attach at least one file");
    if (folderId && !db.folders.some((f) => f.id === folderId && f.ownerId === ownerId)) throw new HttpError(404, "Folder not found");
    const created = files.map((f) => ({
      id: `rs-${randomUUID().slice(0, 6)}`, title: f.originalname.replace(/\.[^.]+$/, ""),
      folderId, cardCount: Math.max(5, Math.min(40, Math.round(f.size / 2000))), status: "ready", ownerId,
    }));
    db.reviewSets.unshift(...created);
    return created;
  },
};
