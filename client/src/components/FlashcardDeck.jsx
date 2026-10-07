import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Check, RotateCcw } from "lucide-react";
import Flashcard from "./Flashcard.jsx";
import { useStudyStore } from "../store/useStudyStore.js";

export default function FlashcardDeck({ cards }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const { progress, markCard } = useStudyStore();
  const card = cards[index];

  const go = useCallback((delta) => {
    setFlipped(false);
    setIndex((i) => Math.min(cards.length - 1, Math.max(0, i + delta)));
  }, [cards.length]);

  // Keyboard: Space flips, arrows navigate. Skip when a button/input has focus so native behavior still works.
  useEffect(() => {
    const onKey = (e) => {
      if (["INPUT", "TEXTAREA", "BUTTON", "A"].includes(e.target.tagName)) return;
      if (e.code === "Space") { e.preventDefault(); setFlipped((f) => !f); }
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const mark = (status) => { markCard(card.id, status); if (index < cards.length - 1) go(1); };
  const mastered = cards.filter((c) => progress[c.id] === "mastered").length;
  const btn = "flex items-center gap-1 rounded-lg px-4 py-2 font-semibold transition active:scale-95 disabled:opacity-40";

  return (
    <section aria-label="Flashcard deck">
      <div className="mb-3 flex justify-between text-sm text-muted">
        <span>Card {index + 1} of {cards.length}</span>
        <span>{mastered} mastered</span>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-ink/10" role="progressbar" aria-valuenow={mastered} aria-valuemax={cards.length}>
        <div className="h-full bg-mint transition-all" style={{ width: `${(mastered / cards.length) * 100}%` }} />
      </div>

      <Flashcard front={card.front} back={card.back} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
      <p className="mt-2 text-center text-sm text-muted">Press Space to flip, arrow keys to move</p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          <button className={`${btn} border border-ink/20 bg-white hover:bg-paper`} onClick={() => go(-1)} disabled={index === 0}>
            <ChevronLeft size={18} aria-hidden /> Previous
          </button>
          <button className={`${btn} border border-ink/20 bg-white hover:bg-paper`} onClick={() => go(1)} disabled={index === cards.length - 1}>
            Next <ChevronRight size={18} aria-hidden />
          </button>
        </div>
        <div className="flex gap-2">
          <button className={`${btn} bg-amber text-white hover:brightness-110`} onClick={() => mark("review")}>
            <RotateCcw size={18} aria-hidden /> Needs review
          </button>
          <button className={`${btn} bg-mint text-white hover:brightness-110`} onClick={() => mark("mastered")}>
            <Check size={18} aria-hidden /> Mastered
          </button>
        </div>
      </div>
    </section>
  );
}
