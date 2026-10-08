import { Link } from "react-router-dom";
import { Layers } from "lucide-react";

// Draggable: carries the set id so folder tree nodes can accept the drop.
export default function StudySetCard({ set }) {
  return (
    <Link to={`/app/sets/${set.id}`} draggable onDragStart={(e) => { e.dataTransfer.setData("text/set-id", set.id); e.dataTransfer.effectAllowed = "move"; }}
          className="glass group block rounded-2xl p-5 transition hover:-translate-y-0.5 hover:border-cobalt active:cursor-grabbing">
      <span className="rounded-full bg-cobalt/20 px-2 py-0.5 text-sm font-semibold text-ink">{set.subject}</span>
      <h3 className="mt-3 text-lg font-bold">{set.title}</h3>
      <p className="mt-1 text-muted">{set.description}</p>
      <p className="mt-3 flex items-center gap-1 text-sm text-muted"><Layers size={16} aria-hidden /> {set.cards.length} cards</p>
    </Link>
  );
}
