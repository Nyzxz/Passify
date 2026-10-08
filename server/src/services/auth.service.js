import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { User } from "../models/db.js";
import { HttpError } from "./studySet.service.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const jwtSecret = () => {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("JWT_SECRET must be set to a random string of at least 32 characters");
  }
  return process.env.JWT_SECRET;
};
const publicUser = (user) => {
  const value = user.toObject ? user.toObject({ versionKey: false }) : user;
  delete value._id;
  delete value.__v;
  delete value.passwordHash;
  return value;
};
const sign = (user) => jwt.sign({ sub: user.id }, jwtSecret(), { expiresIn: "8h" });

export const AuthService = {
  async register({ name, email, password, role }) {
    if (!name?.trim()) throw new HttpError(400, "Full name is required");
    if (!EMAIL.test(email ?? "")) throw new HttpError(400, "Enter a valid email address");
    if ((password ?? "").length < 8) throw new HttpError(400, "Password must be at least 8 characters");
    if (!role) throw new HttpError(400, "Choose your student role or grade");
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) throw new HttpError(409, "An account with this email already exists");
    const user = await User.create({
      id: `u-${randomUUID()}`,
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      role,
    });
    return { user: publicUser(user), token: sign(user) };
  },
  async login({ email, password }) {
    const user = await User.findOne({ email: email?.trim().toLowerCase() }).select("+passwordHash");
    if (!user || !(await bcrypt.compare(password ?? "", user.passwordHash))) {
      throw new HttpError(401, "Email or password is incorrect");
    }
    return { user: publicUser(user), token: sign(user) };
  },
  async userFromToken(token) {
    try {
      const { sub } = jwt.verify(token, jwtSecret());
      const user = await User.findOne({ id: sub }).lean();
      return user ? publicUser(user) : null;
    } catch { return null; }
  },
};
