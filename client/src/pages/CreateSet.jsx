import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";

const field = "w-full rounded-lg border-2 border-ink/15 bg-surface p-3 focus:border-cobalt";
const blank = () => ({ front: "", back: "" });

export default function CreateSet() {
  const addSet = useStudyStore((s) => s.addSet);
  const navigate = useNavigate();
  const [meta, setMeta] = useState({ title: "", subject: "", description: "", examDate: "" });
  const [cards, setCards] = useState([blank(), blank()]);
  const [error, setError] = useState("");

  const updateCard = (i, key, value) => setCards((cs) => cs.map((c, j) => (j === i ? { ...c, [key]: value } : c)));

  const submit = (e) => {
    e.preventDefault();
    const valid = cards.filter((c) => c.front.trim() && c.back.trim());
    if (!meta.title.trim()) return setError("Give your set a title.");
    if (!valid.length) return setError("Add at least one card with a question and an answer.");
    navigate(`/app/sets/${addSet({ ...meta, subject: meta.subject || "General", examDate: meta.examDate || null, cards: valid })}`);
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <h1 className="text-3xl font-extrabold">New review set</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">Title<input className={field} value={meta.title} onChange={(e) => setMeta({ ...meta, title: e.target.value })} /></label>
        <label className="block">Subject or course<input className={field} value={meta.subject} onChange={(e) => setMeta({ ...meta, subject: e.target.value })} /></label>
        <label className="block sm:col-span-2">Description<textarea className={field} rows={2} value={meta.description} onChange={(e) => setMeta({ ...meta, description: e.target.value })} /></label>
        <label className="block">Exam date<input type="date" className={field} value={meta.examDate} onChange={(e) => setMeta({ ...meta, examDate: e.target.value })} /></label>
      </div>

      <fieldset className="space-y-3">
        <legend className="mb-2 text-xl font-bold">Flashcards</legend>
        {cards.map((c, i) => (
          <div key={i} className="grid gap-3 rounded-2xl border border-ink/10 bg-surface p-4 sm:grid-cols-[1fr_1fr_auto]">
            <input aria-label={`Card ${i + 1} question`} placeholder="Question" className={field} value={c.front} onChange={(e) => updateCard(i, "front", e.target.value)} />
            <input aria-label={`Card ${i + 1} answer`} placeholder="Answer" className={field} value={c.back} onChange={(e) => updateCard(i, "back", e.target.value)} />
            <button type="button" aria-label={`Remove card ${i + 1}`} disabled={cards.length === 1}
                    onClick={() => setCards((cs) => cs.filter((_, j) => j !== i))}
                    className="rounded-lg p-3 text-muted transition hover:bg-amber/10 hover:text-amber disabled:opacity-30"><Trash2 size={18} /></button>
          </div>
        ))}
        <button type="button" onClick={() => setCards((cs) => [...cs, blank()])}
                className="flex items-center gap-1 rounded-lg border-2 border-dashed border-cobalt px-4 py-2 font-semibold text-cobalt transition hover:bg-cobalt/10">
          <Plus size={18} aria-hidden /> Add card
        </button>
      </fieldset>

      {error && <p role="alert" className="font-semibold text-amber">{error}</p>}
      <button className="rounded-lg bg-cobalt px-6 py-3 font-semibold text-white transition hover:brightness-110 active:scale-95">Save set</button>
    </form>
  );
}
