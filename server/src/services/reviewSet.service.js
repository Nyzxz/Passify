import { randomUUID } from "node:crypto";
import { Folder, ReviewSet } from "../models/db.js";
import { HttpError } from "./studySet.service.js";

const toPlain = (record) => {
  const value = record.toObject ? record.toObject({ versionKey: false }) : record;
  delete value._id;
  delete value.__v;
  return value;
};

export const ReviewSetService = {
  async list(ownerId, folderId) {
    const query = { ownerId };
    if (folderId !== undefined) query.folderId = folderId || null;
    const records = await ReviewSet.find(query).sort({ createdAt: -1 }).lean();
    return records.map(toPlain);
  },

  // Mock "processing": one review set per uploaded file, card count derived from file size.
  async upload(ownerId, files = [], folderId = null) {
    if (!files.length) throw new HttpError(400, "Attach at least one file");
    if (folderId && !await Folder.exists({ id: folderId, ownerId })) throw new HttpError(404, "Folder not found");
    const created = files.map((f) => ({
      id: `rs-${randomUUID().slice(0, 6)}`, title: f.originalname.replace(/\.[^.]+$/, ""),
      folderId, cardCount: Math.max(5, Math.min(40, Math.round(f.size / 2000))), status: "ready", ownerId,
    }));
    return (await ReviewSet.insertMany(created)).map(toPlain);
  },
};
