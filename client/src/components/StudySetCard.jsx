import { Link } from "react-router-dom";
import { Layers } from "lucide-react";

export default function StudySetCard({ set }) {
  return (
    <Link to={`/sets/${set.id}`} className="group block rounded-2xl border border-ink/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-cobalt">
      <span className="rounded-full bg-cobalt/10 px-2 py-0.5 text-sm font-semibold text-cobalt">{set.subject}</span>
      <h3 className="mt-3 text-lg font-bold group-hover:text-cobalt">{set.title}</h3>
      <p className="mt-1 text-muted">{set.description}</p>
      <p className="mt-3 flex items-center gap-1 text-sm text-muted"><Layers size={16} aria-hidden /> {set.cards.length} cards</p>
    </Link>
  );
}
