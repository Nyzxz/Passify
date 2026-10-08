import { useState, useEffect } from "react";
import { Link, NavLink, useMatch } from "react-router-dom";
import { ChevronRight, Folder, FolderOpen, FolderPlus, Library } from "lucide-react";
import { useStudyStore, folderPath } from "../store/useStudyStore.js";

// Reads a dragged review set id from the HTML5 DnD payload and moves it.
function useDropTarget(folderId) {
  const moveSet = useStudyStore((s) => s.moveSet);
  const [over, setOver] = useState(false);
  return {
    over,
    props: {
      onDragOver: (e) => { e.preventDefault(); setOver(true); },
      onDragLeave: () => setOver(false),
      onDrop: (e) => { e.preventDefault(); setOver(false); const id = e.dataTransfer.getData("text/set-id"); if (id) moveSet(id, folderId); },
    },
  };
}

// One recursive node: renders itself, then its children with depth + 1.
function Node({ folder, depth, folders, activeId, trail }) {
  const kids = folders.filter((f) => f.parentId === folder.id);
  const addFolder = useStudyStore((s) => s.addFolder);
  const [open, setOpen] = useState(depth < 1);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const { over, props } = useDropTarget(folder.id);
  useEffect(() => { if (trail.includes(folder.id)) setOpen(true); }, [trail, folder.id]);

  const submit = (e) => {
    e.preventDefault();
    if (name.trim()) { addFolder(name.trim(), folder.id); setOpen(true); }
    setName(""); setAdding(false);
  };
  const Icon = open && kids.length ? FolderOpen : Folder;

  return (
    <li role="treeitem" aria-expanded={kids.length ? open : undefined} aria-selected={activeId === folder.id}>
      <div {...props} style={{ paddingLeft: depth * 14 }}
           className={`group flex items-center rounded-lg transition ${over ? "bg-cobalt/30 ring-2 ring-cobalt" : activeId === folder.id ? "bg-cobalt/20" : "hover:bg-surface"}`}>
        <button type="button" aria-label={open ? `Collapse ${folder.name}` : `Expand ${folder.name}`} onClick={() => setOpen(!open)}
                className={`p-1 text-muted ${kids.length ? "" : "invisible"}`}>
          <ChevronRight size={14} className={`transition-transform ${open ? "rotate-90" : ""}`} />
        </button>
        <NavLink to={`/app/folders/${folder.id}`} className="flex flex-1 items-center gap-2 truncate py-1.5 text-sm">
          <Icon size={16} aria-hidden className="shrink-0 text-cobalt" /> <span className="truncate">{folder.name}</span>
        </NavLink>
        <button type="button" aria-label={`New subfolder in ${folder.name}`} onClick={() => { setAdding(true); setOpen(true); }}
                className="p-1.5 text-muted opacity-0 transition hover:text-ink focus:opacity-100 group-hover:opacity-100">
          <FolderPlus size={14} />
        </button>
      </div>
      {adding && (
        <form onSubmit={submit} style={{ paddingLeft: depth * 14 + 26 }} className="py-1 pr-1">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onBlur={submit} aria-label="Subfolder name"
                 placeholder="Folder name" className="w-full rounded-md border border-line bg-transparent px-2 py-1 text-sm" />
        </form>
      )}
      {open && kids.length > 0 && (
        <ul role="group">{kids.map((k) => <Node key={k.id} folder={k} depth={depth + 1} folders={folders} activeId={activeId} trail={trail} />)}</ul>
      )}
    </li>
  );
}

export default function FolderTreeNavigation() {
  const folders = useStudyStore((s) => s.folders);
  const match = useMatch("/app/folders/:folderId");
  const activeId = match?.params.folderId;
  const trail = folderPath(folders, activeId).map((f) => f.id);
  const root = useDropTarget(null);
  return (
    <nav aria-label="Folders">
      <NavLink to="/app/folders" end {...root.props}
               className={({ isActive }) => `mb-1 flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition ${root.over ? "bg-cobalt/30 ring-2 ring-cobalt" : isActive ? "bg-cobalt/20" : "hover:bg-surface"}`}>
        <Library size={16} aria-hidden className="text-cobalt" /> All review sets
      </NavLink>
      <ul role="tree" aria-label="Folder tree">
        {folders.filter((f) => f.parentId === null).map((f) => (
          <Node key={f.id} folder={f} depth={0} folders={folders} activeId={activeId} trail={trail} />
        ))}
      </ul>
    </nav>
  );
}

// Home > Computer Science > Midterms 2026
export function Breadcrumbs({ folderId }) {
  const folders = useStudyStore((s) => s.folders);
  const path = folderPath(folders, folderId);
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        <li><Link to="/app" className="hover:text-ink">Home</Link></li>
        {path.map((f, i) => (
          <li key={f.id} className="flex items-center gap-1">
            <ChevronRight size={14} aria-hidden />
            {i === path.length - 1
              ? <span aria-current="page" className="font-semibold text-ink">{f.name}</span>
              : <Link to={`/app/folders/${f.id}`} className="hover:text-ink">{f.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
