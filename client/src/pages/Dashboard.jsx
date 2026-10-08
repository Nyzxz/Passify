import { Link } from "react-router-dom";
import { Plus, CalendarDays } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";
import StudySetCard from "../components/StudySetCard.jsx";

export default function Dashboard() {
  const setUploadOpen = useStudyStore((s) => s.setUploadOpen);
  const { sets, progress, quizScores, cardsReviewed } = useStudyStore();
  const mastered = Object.values(progress).filter((p) => p === "mastered").length;
  const avg = quizScores.length
    ? Math.round(quizScores.reduce((a, q) => a + q.score / q.total, 0) / quizScores.length * 100) : null;
  const upcoming = sets.filter((s) => s.examDate).sort((a, b) => a.examDate.localeCompare(b.examDate));

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl font-extrabold">What are you studying today?</h1>
        <button type="button" onClick={() => setUploadOpen(true)} className="flex items-center gap-1 rounded-lg bg-cobalt px-4 py-2 font-semibold text-white transition hover:brightness-110 active:scale-95">
          <Plus size={18} aria-hidden /> Create new review set
        </button>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        {[["Cards reviewed", cardsReviewed], ["Cards mastered", mastered], ["Average quiz score", avg === null ? "No quizzes yet" : `${avg}%`]].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-ink/10 bg-surface p-5">
            <dt className="text-muted">{label}</dt>
            <dd className="mt-1 text-2xl font-bold">{value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="sets">
        <h2 id="sets" className="mb-4 text-2xl font-bold">Recent study sets</h2>
        <div className="grid gap-4 sm:grid-cols-2">{sets.map((s) => <StudySetCard key={s.id} set={s} />)}</div>
      </section>

      <section aria-labelledby="exams">
        <h2 id="exams" className="mb-4 text-2xl font-bold">Upcoming exams</h2>
        <ul className="divide-y divide-ink/10 rounded-2xl border border-ink/10 bg-surface">
          {upcoming.map((s) => (
            <li key={s.id} className="flex items-center justify-between p-4">
              <span className="font-semibold">{s.title}</span>
              <span className="flex items-center gap-1 text-muted"><CalendarDays size={16} aria-hidden />
                {new Date(s.examDate).toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
