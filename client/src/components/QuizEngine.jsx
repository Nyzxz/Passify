import { useMemo, useReducer } from "react";
import { useStudyStore } from "../store/useStudyStore.js";

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Build questions from flashcards: correct answer + up to 3 distractors from other cards.
function buildQuestions(cards, mode) {
  return shuffle(cards).map((c) => ({
    id: c.id, prompt: c.front, answer: c.back,
    options: mode === "mc"
      ? shuffle([c.back, ...shuffle(cards.filter((o) => o.id !== c.id)).slice(0, 3).map((o) => o.back)])
      : null,
  }));
}

const initial = { i: 0, score: 0, picked: null, done: false };
function reducer(state, action) {
  switch (action.type) {
    case "answer": return { ...state, picked: action.value, score: state.score + (action.correct ? 1 : 0) };
    case "next": return state.i + 1 >= action.total ? { ...state, done: true } : { ...state, i: state.i + 1, picked: null };
    case "reset": return initial;
    default: return state;
  }
}

export default function QuizEngine({ setId, cards }) {
  const [mode, setMode] = useReducer((_, m) => m, "mc");
  const [state, dispatch] = useReducer(reducer, initial);
  const recordQuiz = useStudyStore((s) => s.recordQuiz);
  const questions = useMemo(() => buildQuestions(cards, mode), [cards, mode, state.done]);
  const [typed, setTyped] = useReducer((_, v) => v, "");
  const q = questions[state.i];
  const norm = (s) => s.trim().toLowerCase().replace(/^the /, "");

  const submit = (value) => dispatch({ type: "answer", value, correct: norm(value) === norm(q.answer) });
  const next = () => {
    if (state.i + 1 >= questions.length) recordQuiz(setId, state.score, questions.length);
    setTyped(""); dispatch({ type: "next", total: questions.length });
  };

  if (state.done) {
    const pct = Math.round((state.score / questions.length) * 100);
    return (
      <div className="rounded-2xl bg-white p-8 text-center">
        <h2 className="text-3xl font-bold">{state.score} / {questions.length} correct ({pct}%)</h2>
        <button onClick={() => dispatch({ type: "reset" })} className="mt-6 rounded-lg bg-cobalt px-5 py-2 font-semibold text-white">Try again</button>
      </div>
    );
  }

  const answered = state.picked !== null;
  return (
    <div className="rounded-2xl bg-white p-6">
      <div className="mb-4 flex items-center justify-between text-sm text-muted">
        <span>Question {state.i + 1} of {questions.length}</span>
        <select aria-label="Quiz mode" value={mode} onChange={(e) => { setMode(e.target.value); dispatch({ type: "reset" }); }}
                className="rounded border border-ink/20 px-2 py-1">
          <option value="mc">Multiple choice</option>
          <option value="short">Short answer</option>
        </select>
      </div>
      <h2 className="mb-4 text-xl font-bold">{q.prompt}</h2>

      {mode === "mc" ? (
        <ul className="grid gap-2">
          {q.options.map((opt) => {
            const isRight = opt === q.answer, isPicked = opt === state.picked;
            const tone = !answered ? "hover:border-cobalt hover:bg-paper"
              : isRight ? "border-mint bg-mint/10" : isPicked ? "border-amber bg-amber/10" : "opacity-60";
            return (
              <li key={opt}>
                <button disabled={answered} onClick={() => submit(opt)}
                        className={`w-full rounded-lg border-2 border-ink/15 p-3 text-left transition ${tone}`}>{opt}</button>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex gap-2">
          <input value={typed} onChange={(e) => setTyped(e.target.value)} disabled={answered} aria-label="Your answer"
                 onKeyDown={(e) => e.key === "Enter" && !answered && typed && submit(typed)}
                 className="flex-1 rounded-lg border-2 border-ink/15 p-3" placeholder="Type your answer" />
          <button disabled={answered || !typed} onClick={() => submit(typed)} className="rounded-lg bg-cobalt px-4 font-semibold text-white disabled:opacity-40">Check</button>
        </div>
      )}

      {answered && (
        <div className="mt-4 flex items-center justify-between" aria-live="polite">
          <p className="font-semibold">{norm(state.picked) === norm(q.answer) ? "Correct" : `Not quite. Answer: ${q.answer}`}</p>
          <button onClick={next} className="rounded-lg bg-ink px-4 py-2 font-semibold text-white">
            {state.i + 1 >= questions.length ? "See score" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
