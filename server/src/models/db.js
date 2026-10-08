// Single in-memory "database". Folders are stored FLAT with a parentId (adjacency list),
// which supports unlimited nesting; services build the recursive tree on read.
export const db = {
  users: [{ id: "u1", name: "Demo Student", email: "demo@passify.app", password: "password123", role: "Undergraduate" }],
  folders: [
    { id: "f-cs", name: "Computer Science", parentId: null, ownerId: "u1" },
    { id: "f-mid", name: "Midterms 2026", parentId: "f-cs", ownerId: "u1" },
    { id: "f-alg", name: "Algorithms", parentId: "f-mid", ownerId: "u1" },
    { id: "f-bio", name: "Biology", parentId: null, ownerId: "u1" },
  ],
  reviewSets: [
    { id: "rs-1", title: "Sorting recap", folderId: "f-alg", cardCount: 12, status: "ready", ownerId: "u1" },
  ],
};
