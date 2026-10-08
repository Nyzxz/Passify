// Presentational flip card. Parent owns the `flipped` state so keyboard shortcuts can drive it.
export default function Flashcard({ front, back, flipped, onFlip }) {
  const face = "flip-face absolute inset-0 flex items-center justify-center rounded-2xl border border-ink/10 p-8 text-center text-2xl font-display font-bold";
  return (
    <div className="flip-scene h-72 w-full cursor-pointer" onClick={onFlip}>
      <div className={`flip-inner relative h-full w-full ${flipped ? "is-flipped" : ""}`} role="group" aria-live="polite"
           aria-label={flipped ? "Answer side" : "Question side"}>
        <div className={`${face} bg-surface`} aria-hidden={flipped}>{front}</div>
        <div className={`${face} flip-back bg-cobalt text-white`} aria-hidden={!flipped}>{back}</div>
      </div>
    </div>
  );
}
