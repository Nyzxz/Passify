import { create } from "zustand";
import { persist } from "zustand/middleware";
import { studySets } from "../data/mockData.js";
import { mockFolders } from "../data/mockFolders.js";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 9);

async function apiRequest(path, { token, body } = {}) {
  const response = await fetch(`/api${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || `The server returned an unexpected response (${response.status}).`);
  return result.data;
}

// Walk parentId links upward: [root, ..., folder]. Used by breadcrumbs and tree auto-expand.
export const folderPath = (folders, id) => {
  const out = [];
  for (let cur = folders.find((f) => f.id === id); cur; cur = folders.find((f) => f.id === cur.parentId)) out.unshift(cur);
  return out;
};

// Authentication uses the API; study content remains local until its API is connected.
export const useStudyStore = create(
  persist(
    (set, get) => ({
      // --- session & UI ---
      user: null, token: null, authReady: false, theme: "dark", uploadOpen: false, paletteOpen: false,
      setUploadOpen: (uploadOpen) => set({ uploadOpen }),
      setPaletteOpen: (paletteOpen) => set({ paletteOpen }),
      toggleTheme: () => set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),

      async login({ email, password }) {
        try {
          const session = await apiRequest("/auth/login", { body: { email, password } });
          set({ user: session.user, token: session.token, authReady: true });
          return { ok: true };
        } catch (error) {
          return { ok: false, error: error.message };
        }
      },
      async register({ name, email, password, role }) {
        try {
          const session = await apiRequest("/auth/register", { body: { name, email, password, role } });
          set({ user: session.user, token: session.token, authReady: true });
          return { ok: true };
        } catch (error) {
          return { ok: false, error: error.message };
        }
      },
      async restoreSession() {
        const token = get().token;
        if (!token) {
          set({ user: null, authReady: true });
          return;
        }
        try {
          const user = await apiRequest("/auth/me", { token });
          set({ user, authReady: true });
        } catch {
          set({ user: null, token: null, authReady: true });
        }
      },
      logout: () => set({ user: null, token: null, authReady: true }),

      // --- folders & review sets (a "set" belongs to one folder, or null = unfiled) ---
      folders: mockFolders,
      sets: studySets.map((s) => ({ ...s, folderId: s.id === "set-bio-101" ? "f-bio" : null })),
      addFolder: (name, parentId = null) => set((s) => ({ folders: [...s.folders, { id: `f-${uid()}`, name, parentId }] })),
      moveSet: (setId, folderId) => set((s) => ({ sets: s.sets.map((x) => (x.id === setId ? { ...x, folderId } : x)) })),
      // Mock "generation": one starter set per uploaded file.
      addSetsFromFiles: (files, folderId = null) =>
        set((s) => ({
          sets: [
            ...files.map((f) => {
              const title = f.name.replace(/\.[^.]+$/, "");
              const id = `set-${uid()}`;
              return {
                id, title, subject: "Imported", description: `Generated from ${f.name}`, examDate: null, folderId,
                updatedAt: new Date().toISOString(), guide: [],
                cards: [1, 2, 3].map((n) => ({ id: `${id}-${n}`, front: `Key idea ${n} from ${title}`, back: "Replace with the real answer once generation is connected." })),
              };
            }),
            ...s.sets,
          ],
        })),

      // --- study progress ---
      progress: {}, quizScores: [], cardsReviewed: 0,
      getSet: (id) => get().sets.find((x) => x.id === id),
      addSet: (data) => {
        const id = `set-${uid()}`;
        set((s) => ({ sets: [{ folderId: null, ...data, id, cards: data.cards.map((c, i) => ({ ...c, id: `${id}-${i}` })), guide: [], updatedAt: new Date().toISOString() }, ...s.sets] }));
        return id;
      },
      markCard: (cardId, status) => set((s) => ({ progress: { ...s.progress, [cardId]: status }, cardsReviewed: s.cardsReviewed + 1 })),
      recordQuiz: (setId, score, total) => set((s) => ({ quizScores: [...s.quizScores, { setId, score, total, at: Date.now() }] })),
    }),
    { name: "passify", partialize: (s) => ({ user: s.user, token: s.token, theme: s.theme }) }
  )
);
