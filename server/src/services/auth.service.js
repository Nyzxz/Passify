import { db } from "../models/db.js";
import { HttpError } from "./studySet.service.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const publicUser = ({ password, ...u }) => u;
// MOCK token (not a real JWT, not secure). Swap for jsonwebtoken + hashed passwords later.
const sign = (u) => "mock." + Buffer.from(JSON.stringify({ sub: u.id, exp: Date.now() + 8 * 36e5 })).toString("base64url");

export const AuthService = {
  register({ name, email, password, role }) {
    if (!name?.trim()) throw new HttpError(400, "Full name is required");
    if (!EMAIL.test(email ?? "")) throw new HttpError(400, "Enter a valid email address");
    if ((password ?? "").length < 8) throw new HttpError(400, "Password must be at least 8 characters");
    if (!role) throw new HttpError(400, "Choose your student role or grade");
    if (db.users.some((u) => u.email === email.toLowerCase())) throw new HttpError(409, "An account with this email already exists");
    const user = { id: `u${db.users.length + 1}`, name: name.trim(), email: email.toLowerCase(), password, role };
    db.users.push(user);
    return { user: publicUser(user), token: sign(user) };
  },
  login({ email, password }) {
    const user = db.users.find((u) => u.email === email?.toLowerCase() && u.password === password);
    if (!user) throw new HttpError(401, "Email or password is incorrect");
    return { user: publicUser(user), token: sign(user) };
  },
  userFromToken(token) {
    try {
      const { sub, exp } = JSON.parse(Buffer.from(token.replace("mock.", ""), "base64url").toString());
      return exp > Date.now() ? db.users.find((u) => u.id === sub) : null;
    } catch { return null; }
  },
};
