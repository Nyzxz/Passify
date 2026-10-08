import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";

const ACCEPT = [".pdf", ".docx", ".doc", ".txt"];
const MAX = 15 * 1024 * 1024;
const ext = (n) => n.slice(n.lastIndexOf(".")).toLowerCase();
const size = (b) => (b < 1048576 ? `${Math.ceil(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`);

export default function FileDropzoneModal({ folderId = null }) {
  const { uploadOpen, setUploadOpen, addSetsFromFiles } = useStudyStore();
  const [items, setItems] = useState([]);   // staged files: { id, file, error, progress }
  const [over, setOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const good = items.filter((i) => !i.error);

  const close = () => { if (!busy) { setItems([]); setUploadOpen(false); } };
  useEffect(() => {
    if (!uploadOpen) return;
    const onKey = (e) => e.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // Validate type and size up front, skip duplicates, then stage.
  const stage = (list) => {
    const next = [...list].map((file) => ({
      id: crypto.randomUUID(), file, progress: 0,
      error: !ACCEPT.includes(ext(file.name)) ? "Unsupported type. Use PDF, DOCX, DOC or TXT." : file.size > MAX ? "Larger than the 15 MB limit." : null,
    }));
    setItems((cur) => [...cur, ...next.filter((n) => !cur.some((c) => c.file.name === n.file.name && c.file.size === n.file.size))]);
  };

  // Simulated upload: progress ticks, then sets are created once every valid file hits 100%.
  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => setItems((cur) => cur.map((i) => (i.error ? i : { ...i, progress: Math.min(100, i.progress + 8 + Math.random() * 12) }))), 180);
    return () => clearInterval(t);
  }, [busy]);
  useEffect(() => {
    if (busy && good.length && good.every((i) => i.progress >= 100)) {
      addSetsFromFiles(good.map((i) => i.file), folderId);
      setBusy(false); setItems([]); setUploadOpen(false);
    }
  }, [items, busy]); // eslint-disable-line

  if (!uploadOpen) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div role="dialog" aria-modal="true" aria-labelledby="upload-title" className="glass pop w-full max-w-xl rounded-3xl bg-paper/80 p-6 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 id="upload-title" className="text-2xl font-extrabold">Create review set</h2>
            <p className="text-sm text-muted">Drop your notes or slides. We'll turn each file into a review set.</p>
          </div>
          <button onClick={close} aria-label="Close" className="rounded-lg p-2 text-muted hover:bg-surface"><X size={18} /></button>
        </div>

        <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
             onDrop={(e) => { e.preventDefault(); setOver(false); stage(e.dataTransfer.files); }}
             className={`mt-5 grid place-items-center rounded-2xl border-2 border-dashed p-8 text-center transition ${over ? "scale-[1.01] border-cobalt bg-cobalt/15 shadow-[0_0_40px_-10px_var(--color-cobalt)]" : "border-line"}`}>
          <UploadCloud size={36} className="text-cobalt" aria-hidden />
          <p className="mt-2 font-semibold">{over ? "Release to add files" : "Drag and drop files here"}</p>
          <p className="text-sm text-muted">PDF, DOCX, DOC or TXT, up to 15 MB each</p>
          <button type="button" onClick={() => inputRef.current.click()} className="mt-4 rounded-lg border border-line px-4 py-2 font-semibold transition hover:bg-surface">Browse files</button>
          <input ref={inputRef} type="file" multiple accept={ACCEPT.join(",")} className="sr-only" tabIndex={-1} onChange={(e) => { stage(e.target.files); e.target.value = ""; }} />
        </div>

        {items.length > 0 && (
          <ul className="mt-4 max-h-56 space-y-2 overflow-auto" aria-label="Staged files">
            {items.map((i) => (
              <li key={i.id} className="glass rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <FileText size={18} className="shrink-0 text-cobalt" aria-hidden />
                  <span className="flex-1 truncate text-sm font-medium">{i.file.name}</span>
                  <span className="rounded bg-cobalt/20 px-1.5 text-xs font-semibold">{ext(i.file.name).slice(1).toUpperCase()}</span>
                  <span className="text-xs text-muted">{size(i.file.size)}</span>
                  {!busy && <button aria-label={`Remove ${i.file.name}`} onClick={() => setItems((c) => c.filter((x) => x.id !== i.id))} className="text-muted hover:text-ink"><X size={16} /></button>}
                </div>
                {i.error
                  ? <p role="alert" className="mt-1 flex items-center gap-1 text-sm text-red-400"><AlertCircle size={14} aria-hidden /> {i.error}</p>
                  : busy && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(i.progress)}><div className="h-full bg-cobalt transition-all" style={{ width: `${i.progress}%` }} /></div>}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex items-center justify-between">
          <Link to="/app/create" onClick={close} className="text-sm text-muted underline hover:text-ink">Or write cards by hand</Link>
          <button disabled={!good.length || busy} onClick={() => setBusy(true)} className="glow-btn rounded-xl px-5 py-2.5 font-semibold disabled:opacity-40">
            {busy ? "Generating..." : `Generate ${good.length || ""} review set${good.length === 1 ? "" : "s"}`}
          </button>
        </div>
      </div>
    </div>
  );
}
