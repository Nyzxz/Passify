import { create } from "zustand";
import { studySets } from "../data/mockData.js";

// Local-only state. Swap actions for fetch() calls to /api/study-sets when ready.
export const useStudyStore = create((set, get) => ({
  sets: studySets,
  progress: {},        // { [cardId]: "mastered" | "review" }
  quizScores: [],      // [{ setId, score, total, at }]
  cardsReviewed: 0,

  getSet: (id) => get().sets.find((s) => s.id === id),

  addSet: (data) => {
    const id = `set-${Date.now().toString(36)}`;
    const cards = data.cards.map((c, i) => ({ ...c, id: `${id}-${i}` }));
    set((s) => ({ sets: [{ ...data, id, cards, guide: [], updatedAt: new Date().toISOString() }, ...s.sets] }));
    return id;
  },

  markCard: (cardId, status) =>
    set((s) => ({ progress: { ...s.progress, [cardId]: status }, cardsReviewed: s.cardsReviewed + 1 })),

  recordQuiz: (setId, score, total) =>
    set((s) => ({ quizScores: [...s.quizScores, { setId, score, total, at: Date.now() }] })),
}));
