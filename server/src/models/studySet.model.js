import { StudySet } from "./db.js";

const toPlain = (record) => {
  if (!record) return null;
  const value = record.toObject ? record.toObject({ versionKey: false }) : record;
  delete value._id;
  delete value.__v;
  return value;
};

export const StudySetModel = {
  findAll: async () => (await StudySet.find().sort({ updatedAt: -1 }).lean()).map(toPlain),
  findById: async (id) => toPlain(await StudySet.findOne({ id }).lean()),
  insert: async (record) => toPlain(await StudySet.create(record)),
};
