import { AuthService } from "../services/auth.service.js";
export const register = (req, res, next) => { try { res.status(201).json({ data: AuthService.register(req.body) }); } catch (e) { next(e); } };
export const login = (req, res, next) => { try { res.json({ data: AuthService.login(req.body) }); } catch (e) { next(e); } };
