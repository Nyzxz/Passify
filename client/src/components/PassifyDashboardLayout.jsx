import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useMatch } from "react-router-dom";
import { GraduationCap, Plus, Search, Sun, Moon, Menu, LogOut } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";
import FolderTreeNavigation from "./FolderTreeNavigation.jsx";
import FileDropzoneModal from "./FileDropzoneModal.jsx";
import CommandPalette from "./CommandPalette.jsx";

export default function PassifyDashboardLayout() {
  const { user, logout, theme, toggleTheme, setUploadOpen, setPaletteOpen } = useStudyStore();
  const [navOpen, setNavOpen] = useState(false);
  const { pathname } = useLocation();
  const folderId = useMatch("/app/folders/:folderId")?.params.folderId ?? null;
  const isMac = typeof navigator !== "undefined" && /Mac/i.test(navigator.platform);

  useEffect(() => setNavOpen(false), [pathname]);
  // Global Cmd/Ctrl+K opens the command menu.
  useEffect(() => {
    const onKey = (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPaletteOpen(true); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPaletteOpen]);

  return (
    <div className="flex min-h-screen">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-2 focus:rounded focus:bg-paper focus:p-2">Skip to content</a>
      <aside className={`${navOpen ? "flex" : "hidden"} glass fixed inset-y-0 left-0 z-30 w-72 flex-col gap-4 rounded-none border-y-0 border-l-0 p-4 md:sticky md:top-0 md:flex md:h-screen`}>
        <Link to="/app" className="flex items-center gap-2 px-2 font-display text-xl font-extrabold"><GraduationCap className="text-cobalt" aria-hidden /> Passify</Link>
        <button onClick={() => setUploadOpen(true)} className="glow-btn flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-semibold"><Plus size={18} aria-hidden /> Create review set</button>
        <div className="-mx-1 flex-1 overflow-auto px-1"><FolderTreeNavigation /></div>
        <div className="flex items-center gap-2 border-t border-line pt-3">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-cobalt/30 text-sm font-bold">{user.name[0]?.toUpperCase()}</div>
          <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-muted">{user.role}</p></div>
          <button onClick={logout} aria-label="Sign out" className="rounded-lg p-2 text-muted hover:bg-surface hover:text-ink"><LogOut size={16} /></button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="glass sticky top-0 z-20 flex items-center gap-3 rounded-none border-x-0 border-t-0 px-4 py-3">
          <button className="rounded-lg p-2 md:hidden" aria-label="Open navigation" onClick={() => setNavOpen(!navOpen)}><Menu size={20} /></button>
          <button onClick={() => setPaletteOpen(true)} className="flex flex-1 items-center gap-2 rounded-xl border border-line px-3 py-2 text-left text-muted transition hover:bg-surface md:max-w-md">
            <Search size={16} aria-hidden /> <span className="flex-1">Search sets and folders</span>
            <kbd className="rounded border border-line px-1.5 text-xs">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <button onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} className="ml-auto rounded-lg p-2 text-muted hover:bg-surface hover:text-ink">
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>
        <main id="main" className="mx-auto max-w-5xl px-4 py-8"><Outlet /></main>
      </div>

      <FileDropzoneModal folderId={folderId} />
      <CommandPalette />
    </div>
  );
}
