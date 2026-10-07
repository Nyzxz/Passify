import { Link, useParams } from "react-router-dom";
import { useStudyStore } from "../store/useStudyStore.js";
import FlashcardDeck from "../components/FlashcardDeck.jsx";

export default function FlashcardsPage() {
  const { id } = useParams();
  const set = useStudyStore((s) => s.getSet(id));
  if (!set) return <p>Set not found.</p>;
  return (
    <div className="mx-auto max-w-2xl">
      <Link to={`/sets/${id}`} className="text-cobalt underline">Back to {set.title}</Link>
      <h1 className="mb-6 mt-2 text-3xl font-extrabold">Flashcards</h1>
      <FlashcardDeck cards={set.cards} />
    </div>
  );
}
