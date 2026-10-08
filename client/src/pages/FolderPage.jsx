import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Folder, FolderPlus, Plus } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";
import { Breadcrumbs } from "../components/FolderTreeNavigation.jsx";
import StudySetCard from "../components/StudySetCard.jsx";

export default function FolderPage() {
  const { folderId = null } = useParams();
  const { folders, sets, addFolder, setUploadOpen } = useStudyStore();
  const [name, setName] = useState("");
  const [adding, setAdding] = useState(false);
  const folder = folders.find((f) => f.id === folderId);
  if (folderId && !folder) return <p>Folder not found. <Link className="underline" to="/app/folders">Back to all sets</Link></p>;

  const subfolders = folders.filter((f) => f.parentId === folderId);
  const inFolder = sets.filter((s) => s.folderId === folderId);
  const create = (e) => { e.preventDefault(); if (name.trim()) addFolder(name.trim(), folderId); setName(""); setAdding(false); };

  return (
    <div className="space-y-8">
      <Breadcrumbs folderId={folderId} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-4xl font-extrabold">{folder?.name ?? "All review sets"}</h1>
        <div className="flex gap-2">
          <button onClick={() => setAdding(true)} className="flex items-center gap-1 rounded-xl border border-line px-4 py-2 font-semibold transition hover:bg-surface"><FolderPlus size={18} aria-hidden /> New folder</button>
          <button onClick={() => setUploadOpen(true)} className="glow-btn flex items-center gap-1 rounded-xl px-4 py-2 font-semibold"><Plus size={18} aria-hidden /> Create review set</button>
        </div>
      </div>
      {adding && (
        <form onSubmit={create} className="flex gap-2">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} aria-label="Folder name" placeholder="Folder name" className="glass flex-1 rounded-xl p-3" />
          <button className="glow-btn rounded-xl px-4 font-semibold">Create</button>
        </form>
      )}
      {subfolders.length > 0 && (
        <section aria-label="Folders" className="grid gap-3 sm:grid-cols-3">
          {subfolders.map((f) => (
            <Link key={f.id} to={`/app/folders/${f.id}`} className="glass flex items-center gap-3 rounded-xl p-4 font-semibold transition hover:border-cobalt">
              <Folder className="text-cobalt" aria-hidden /> {f.name}
            </Link>
          ))}
        </section>
      )}
      <section aria-label="Review sets">
        {inFolder.length === 0
          ? <p className="glass rounded-2xl p-8 text-center text-muted">No review sets here yet. Create one, or drag a set from another folder onto this one in the sidebar.</p>
          : <div className="grid gap-4 sm:grid-cols-2">{inFolder.map((s) => <StudySetCard key={s.id} set={s} />)}</div>}
      </section>
    </div>
  );
}
