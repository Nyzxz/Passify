import { randomUUID } from "node:crypto";
import { Folder } from "../models/db.js";
import { HttpError } from "./studySet.service.js";

const toPlain = (record) => {
  const value = record.toObject ? record.toObject({ versionKey: false }) : record;
  delete value._id;
  delete value.__v;
  delete value.normalizedName;
  return value;
};

// Recursively nest flat folder rows: [{id, name, children: [...]}, ...]
const buildTree = (rows, parentId = null) =>
  rows.filter((f) => f.parentId === parentId).map((f) => ({ ...f, children: buildTree(rows, f.id) }));

export const FolderService = {
  async tree(ownerId) {
    const rows = await Folder.find({ ownerId }).sort({ name: 1 }).lean();
    return buildTree(rows.map(toPlain));
  },

  async subfolders(ownerId, id) {
    if (!await Folder.exists({ id, ownerId })) throw new HttpError(404, "Folder not found");
    const rows = await Folder.find({ parentId: id, ownerId }).sort({ name: 1 }).lean();
    return rows.map(toPlain);
  },

  async create(ownerId, { name, parentId = null }) {
    if (!name?.trim()) throw new HttpError(400, "Folder name is required");
    if (parentId && !await Folder.exists({ id: parentId, ownerId })) throw new HttpError(404, "Parent folder not found");
    const normalizedName = name.trim().toLowerCase();
    const clash = await Folder.exists({ ownerId, parentId, normalizedName });
    if (clash) throw new HttpError(409, "A folder with that name already exists here");
    try {
      const folder = await Folder.create({ id: `f-${randomUUID().slice(0, 6)}`, name: name.trim(), normalizedName, parentId, ownerId });
      return toPlain(folder);
    } catch (error) {
      if (error.code === 11000) throw new HttpError(409, "A folder with that name already exists here");
      throw error;
    }
  },
};
