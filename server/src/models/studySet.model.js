import { studySets } from "../data/mockData.js";

// In-memory "table". Replace these functions with DB queries later;
// the service layer above should not need to change.
const table = [...studySets];

export const StudySetModel = {
  findAll: () => table,
  findById: (id) => table.find((s) => s.id === id) ?? null,
  insert: (record) => { table.unshift(record); return record; },
};
