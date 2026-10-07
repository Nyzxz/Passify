import { Link, useParams } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore.js";

// Reader view: serif body, ~65ch measure, generous leading.
export default function GuidePage() {
  const { id } = useParams();
  const set = useStudyStore((s) => s.getSet(id));
  if (!set) return <p>Set not found.</p>;
  return (
    <article className="mx-auto max-w-[65ch]">
      <Link to={`/sets/${id}`} className="text-cobalt underline">Back to {set.title}</Link>
      <h1 className="mb-8 mt-2 text-4xl font-extrabold">{set.title}: study guide</h1>
      {set.guide.length === 0 && <p className="text-muted">This set has no guide yet. Guides you write will appear here.</p>}
      {set.guide.map((s) => (
        <section key={s.heading} className="mb-8">
          <h2 className="mb-2 text-2xl font-bold">{s.heading}</h2>
          <p className="font-serif text-lg leading-8">{s.body}</p>
        </section>
      ))}
    </article>
  );
}
