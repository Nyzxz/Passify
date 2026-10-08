import { AuthService } from "../services/auth.service.js";
import { HttpError } from "../services/studySet.service.js";

export const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  try {
    const user = token && await AuthService.userFromToken(token);
    if (!user) return next(new HttpError(401, "Sign in to continue"));
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
