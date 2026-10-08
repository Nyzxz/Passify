// Flat adjacency list (id, parentId). Nesting depth is unlimited.
export const mockFolders = [
  { id: "f-cs", name: "Computer Science", parentId: null },
  { id: "f-mid", name: "Midterms 2026", parentId: "f-cs" },
  { id: "f-alg", name: "Algorithms", parentId: "f-mid" },
  { id: "f-bio", name: "Biology", parentId: null },
];
