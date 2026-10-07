import { Link, NavLink } from "react-router-dom";
import { GraduationCap, Plus } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-ink/10 bg-white">
      <nav aria-label="Main" className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <GraduationCap aria-hidden className="text-cobalt" /> Passify
        </Link>
        <div className="flex items-center gap-2">
          <NavLink to="/" end className={({ isActive }) => `rounded px-3 py-2 font-medium transition-colors hover:bg-paper ${isActive ? "text-cobalt" : "text-muted"}`}>
            Dashboard
          </NavLink>
          <Link to="/create" className="flex items-center gap-1 rounded-lg bg-cobalt px-3 py-2 font-semibold text-white transition hover:brightness-110 active:scale-95">
            <Plus size={18} aria-hidden /> New set
          </Link>
        </div>
      </nav>
    </header>
  );
}
