import { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Sun, Moon, UploadCloud, FolderTree, Zap, FileText } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";
import AuthModal from "../components/AuthModal.jsx";
import Flashcard from "../components/Flashcard.jsx";

// Interactive feature previews: each tab swaps a small live demo.
const TABS = [
  { id: "import", label: "Import notes", icon: UploadCloud, text: "Drop PDFs, Word docs or text files and get a review set per file." },
  { id: "organize", label: "Organize", icon: FolderTree, text: "Nest folders as deep as your course load needs, and drag sets in." },
  { id: "practice", label: "Practice", icon: Zap, text: "Flip cards, quiz yourself, and track what you've mastered." },
];

function Preview({ tab }) {
  const [flipped, setFlipped] = useState(false);
  if (tab === "import")
    return <ul className="space-y-2">{["Week 4 lecture.pdf", "Midterm study notes.docx", "Formulas.txt"].map((n) => (
      <li key={n} className="glass flex items-center gap-3 rounded-xl p-3"><FileText size={18} className="text-cobalt" aria-hidden /> {n}</li>))}</ul>;
  if (tab === "organize")
    return <ul className="font-mono text-sm leading-8"><li>Computer Science</li><li className="pl-5">Midterms 2026</li><li className="pl-10 text-cobalt">Algorithms</li><li>Biology</li></ul>;
  return <Flashcard front="What does O(n log n) describe?" back="Efficient comparison sorts, like merge sort" flipped={flipped} onFlip={() => setFlipped(!flipped)} />;
}

export default function LandingPage() {
  const { user, theme, toggleTheme } = useStudyStore();
  const [auth, setAuth] = useState(null); // null | "signin" | "signup"
  const [tab, setTab] = useState("import");
  const active = TABS.find((t) => t.id === tab);

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <span className="flex items-center gap-2 font-display text-xl font-extrabold"><GraduationCap className="text-cobalt" aria-hidden /> Passify</span>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} aria-label="Toggle theme" className="rounded-lg p-2 text-muted hover:bg-surface">{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</button>
          {user ? <Link to="/app" className="glow-btn rounded-xl px-4 py-2 font-semibold">Open app</Link> : (<>
            <button onClick={() => setAuth("signin")} className="rounded-xl px-4 py-2 font-semibold text-muted hover:text-ink">Sign in</button>
            <button onClick={() => setAuth("signup")} className="glow-btn rounded-xl px-4 py-2 font-semibold">Get started</button></>)}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">
        <section className="mx-auto max-w-3xl pb-16 pt-16 text-center">
          <h1 className="rise gradient-text text-5xl font-extrabold leading-[1.05] sm:text-7xl">Turn your notes into exam-ready review sets</h1>
          <p className="rise mx-auto mt-6 max-w-xl text-lg text-muted" style={{ animationDelay: ".1s" }}>Upload what you already have, organize it by course, and practice with flashcards and quizzes that keep you moving.</p>
          <div className="rise mt-8 flex flex-wrap justify-center gap-3" style={{ animationDelay: ".2s" }}>
            <button onClick={() => (user ? null : setAuth("signup"))} className="glow-btn rounded-xl px-6 py-3 text-lg font-semibold">{user ? <Link to="/app">Open your library</Link> : "Start studying free"}</button>
            {!user && <button onClick={() => setAuth("signin")} className="glass rounded-xl px-6 py-3 text-lg font-semibold transition hover:bg-surface">I have an account</button>}
          </div>
          <div className="rise mt-8 flex items-center justify-center gap-3 text-sm text-muted" style={{ animationDelay: ".3s" }}>
            <div className="flex -space-x-2" aria-hidden>{["#5566ee", "#7c5cff", "#2aa6a0", "#d4688f"].map((c) => <span key={c} className="h-7 w-7 rounded-full border-2 border-paper" style={{ background: c }} />)}</div>
            <span>Placeholder social proof: 4.9 rating from early students</span>
          </div>
        </section>

        <section aria-label="Features" className="glass mb-20 grid gap-8 rounded-3xl p-6 md:grid-cols-2 md:p-10">
          <div>
            <div role="tablist" aria-label="Feature previews" className="flex flex-col gap-2">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
                        className={`flex items-center gap-3 rounded-xl border p-4 text-left font-semibold transition ${tab === id ? "border-cobalt bg-cobalt/15" : "border-line hover:bg-surface"}`}>
                  <Icon size={20} className="text-cobalt" aria-hidden /> {label}
                </button>
              ))}
            </div>
            <p className="mt-4 text-muted">{active.text}</p>
          </div>
          <div role="tabpanel" className="grid min-h-64 place-items-center rounded-2xl bg-paper/40 p-6"><div className="w-full"><Preview key={tab} tab={tab} /></div></div>
        </section>
      </main>
      {auth && <AuthModal mode={auth} onClose={() => setAuth(null)} />}
    </div>
  );
}
