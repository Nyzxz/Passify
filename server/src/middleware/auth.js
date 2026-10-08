import { AuthService } from "../services/auth.service.js";
import { HttpError } from "../services/studySet.service.js";

// Mock auth middleware: reads "Authorization: Bearer mock.xxx" and attaches req.user.
export const requireAuth = (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const user = token && AuthService.userFromToken(token);
  if (!user) return next(new HttpError(401, "Sign in to continue"));
  req.user = user;
  next();
};
