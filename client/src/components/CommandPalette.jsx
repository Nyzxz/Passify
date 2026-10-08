import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Folder, Layers, Plus, Sun, LayoutDashboard } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";

// Cmd/Ctrl+K quick switcher: actions, folders, and review sets in one fuzzy-ish list.
export default function CommandPalette() {
  const { paletteOpen, setPaletteOpen, setUploadOpen, toggleTheme, sets, folders } = useStudyStore();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const items = useMemo(() => {
    const all = [
      { label: "Create review set", icon: Plus, run: () => setUploadOpen(true) },
      { label: "Go to dashboard", icon: LayoutDashboard, run: () => navigate("/app") },
      { label: "Toggle light / dark", icon: Sun, run: toggleTheme },
      ...folders.map((f) => ({ label: f.name, hint: "Folder", icon: Folder, run: () => navigate(`/app/folders/${f.id}`) })),
      ...sets.map((s) => ({ label: s.title, hint: s.subject, icon: Layers, run: () => navigate(`/app/sets/${s.id}`) })),
    ];
    return all.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8);
  }, [q, sets, folders]); // eslint-disable-line

  const close = () => { setPaletteOpen(false); setQ(""); setActive(0); };
  const run = (i) => { close(); i?.run(); };
  const onKey = (e) => {
    if (e.key === "Escape") close();
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, items.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    if (e.key === "Enter") run(items[active]);
  };

  if (!paletteOpen) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-start bg-black/60 p-4 pt-[15vh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div role="dialog" aria-modal="true" aria-label="Command menu" onKeyDown={onKey} className="glass pop mx-auto w-full max-w-lg overflow-hidden rounded-2xl bg-paper/80 shadow-2xl">
        <div className="flex items-center gap-2 border-b border-line px-4">
          <Search size={18} className="text-muted" aria-hidden />
          <input autoFocus value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} aria-label="Search" placeholder="Search sets, folders, actions" className="w-full bg-transparent py-4 outline-none" />
        </div>
        <ul role="listbox" className="max-h-72 overflow-auto p-2">
          {items.length === 0 && <li className="p-3 text-muted">No matches for "{q}"</li>}
          {items.map((it, i) => (
            <li key={it.label + i} role="option" aria-selected={i === active} onMouseEnter={() => setActive(i)} onClick={() => run(it)}
                className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${i === active ? "bg-cobalt/25" : ""}`}>
              <it.icon size={16} className="text-cobalt" aria-hidden /> <span className="flex-1">{it.label}</span>
              {it.hint && <span className="text-sm text-muted">{it.hint}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
