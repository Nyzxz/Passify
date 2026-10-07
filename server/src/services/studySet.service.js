import { randomUUID } from "node:crypto";
import { StudySetModel } from "../models/studySet.model.js";

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export const StudySetService = {
  list: () => StudySetModel.findAll().map(({ cards, guide, ...meta }) => ({ ...meta, cardCount: cards.length })),

  get(id) {
    const set = StudySetModel.findById(id);
    if (!set) throw new HttpError(404, `Study set "${id}" not found`);
    return set;
  },

  create({ title, subject, description = "", examDate = null, cards = [] }) {
    if (!title?.trim()) throw new HttpError(400, "Title is required");
    const valid = cards.filter((c) => c.front?.trim() && c.back?.trim());
    if (valid.length === 0) throw new HttpError(400, "Add at least one complete flashcard");
    return StudySetModel.insert({
      id: `set-${randomUUID().slice(0, 8)}`,
      title: title.trim(), subject: subject?.trim() || "General", description, examDate,
      updatedAt: new Date().toISOString(),
      cards: valid.map((c) => ({ id: randomUUID().slice(0, 8), front: c.front.trim(), back: c.back.trim() })),
      guide: [],
    });
  },
};
