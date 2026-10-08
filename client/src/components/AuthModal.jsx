import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Loader2 } from "lucide-react";
import { useStudyStore } from "../store/useStudyStore.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ROLES = ["High school", "Undergraduate", "Graduate", "Other"];
const input = "w-full rounded-xl border border-line bg-surface p-3 aria-[invalid=true]:border-red-400";

function validate(mode, v) {
  const e = {};
  if (mode === "signup" && !v.name.trim()) e.name = "Enter your full name.";
  if (!EMAIL.test(v.email)) e.email = "Enter a valid email address.";
  if (v.password.length < 8) e.password = "Use at least 8 characters.";
  if (mode === "signup" && !v.role) e.role = "Choose your role or grade.";
  return e;
}

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      {children}
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default function AuthModal({ mode: initial, onClose }) {
  const { login, register } = useStudyStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState(initial);
  const [v, setV] = useState({ name: "", email: "", password: "", role: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(mode, v);
    setErrors(errs); setFormError("");
    if (Object.keys(errs).length) return;
    setBusy(true);
    const res = await (mode === "signin" ? login(v) : register(v));
    setBusy(false);
    res.ok ? navigate("/app") : setFormError(res.error);
  };
  const ariaFor = (k) => ({ "aria-invalid": !!errors[k], "aria-describedby": errors[k] ? `${k}-err` : undefined });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-auto bg-black/60 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-label={mode === "signin" ? "Sign in" : "Create account"} className="glass pop w-full max-w-md rounded-3xl bg-paper/80 p-6 shadow-2xl">
        <div className="flex justify-between">
          <div role="tablist" className="flex gap-1 rounded-xl bg-surface p-1">
            {[["signin", "Sign in"], ["signup", "Sign up"]].map(([m, l]) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => { setMode(m); setErrors({}); setFormError(""); }}
                      className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${mode === m ? "bg-cobalt text-white" : "text-muted hover:text-ink"}`}>{l}</button>
            ))}
          </div>
          <button onClick={onClose} aria-label="Close" className="rounded-lg p-2 text-muted hover:bg-surface"><X size={18} /></button>
        </div>

        <p className="my-5 text-sm text-muted">Use your email and password to access your account on any device.</p>

        <form onSubmit={submit} noValidate className="space-y-3">
          {mode === "signup" && <Field id="name" label="Full name" error={errors.name}><input id="name" autoFocus autoComplete="name" className={input} value={v.name} onChange={set("name")} {...ariaFor("name")} /></Field>}
          <Field id="email" label="Email" error={errors.email}><input id="email" type="email" autoComplete="email" className={input} value={v.email} onChange={set("email")} {...ariaFor("email")} /></Field>
          <Field id="password" label="Password" error={errors.password}><input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} className={input} value={v.password} onChange={set("password")} {...ariaFor("password")} /></Field>
          {mode === "signup" && (
            <Field id="role" label="Student role or grade" error={errors.role}>
              <select id="role" className={input} value={v.role} onChange={set("role")} {...ariaFor("role")}>
                <option value="">Select one</option>{ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
          )}
          {formError && <p role="alert" className="text-sm text-red-400">{formError}</p>}
          <button disabled={busy} className="glow-btn flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold disabled:opacity-60">
            {busy && <Loader2 size={16} className="animate-spin" aria-hidden />} {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      </div>
    </div>
  );
}
