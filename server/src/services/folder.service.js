import { randomUUID } from "node:crypto";
import { db } from "../models/db.js";
import { HttpError } from "./studySet.service.js";

// Recursively nest flat folder rows: [{id, name, children: [...]}, ...]
const buildTree = (rows, parentId = null) =>
  rows.filter((f) => f.parentId === parentId).map((f) => ({ ...f, children: buildTree(rows, f.id) }));

export const FolderService = {
  tree: (ownerId) => buildTree(db.folders.filter((f) => f.ownerId === ownerId)),

  subfolders(ownerId, id) {
    if (!db.folders.some((f) => f.id === id && f.ownerId === ownerId)) throw new HttpError(404, "Folder not found");
    return db.folders.filter((f) => f.parentId === id && f.ownerId === ownerId);
  },

  create(ownerId, { name, parentId = null }) {
    if (!name?.trim()) throw new HttpError(400, "Folder name is required");
    if (parentId && !db.folders.some((f) => f.id === parentId && f.ownerId === ownerId)) throw new HttpError(404, "Parent folder not found");
    const clash = db.folders.some((f) => f.parentId === parentId && f.ownerId === ownerId && f.name.toLowerCase() === name.trim().toLowerCase());
    if (clash) throw new HttpError(409, "A folder with that name already exists here");
    const folder = { id: `f-${randomUUID().slice(0, 6)}`, name: name.trim(), parentId, ownerId };
    db.folders.push(folder);
    return folder;
  },
};
