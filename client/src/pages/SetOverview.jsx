import { Link, useParams } from "react-router-dom";
import { BookOpen, ClipboardCheck, ScrollText } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";

export default function SetOverview() {
  const { id } = useParams();
  const set = useStudyStore((s) => s.getSet(id));
  if (!set) return <p>Set not found. <Link className="text-cobalt underline" to="/app">Back to dashboard</Link></p>;

  const modes = [
    { to: "flashcards", icon: BookOpen, label: "Flashcards", hint: `${set.cards.length} cards` },
    { to: "quiz", icon: ClipboardCheck, label: "Quiz", hint: "Test yourself" },
    { to: "guide", icon: ScrollText, label: "Study guide", hint: `${set.guide.length} sections` },
  ];
  return (
    <div>
      <p className="font-semibold text-cobalt">{set.subject}</p>
      <h1 className="text-4xl font-extrabold">{set.title}</h1>
      <p className="mt-2 max-w-prose text-muted">{set.description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {modes.map(({ to, icon: Icon, label, hint }) => (
          <Link key={to} to={to} className="rounded-2xl border border-ink/10 bg-surface p-6 transition hover:-translate-y-0.5 hover:border-cobalt">
            <Icon className="text-cobalt" aria-hidden /><h2 className="mt-3 text-xl font-bold">{label}</h2><p className="text-muted">{hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
