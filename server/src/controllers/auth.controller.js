import { AuthService } from "../services/auth.service.js";
export const register = async (req, res, next) => {
	try { res.status(201).json({ data: await AuthService.register(req.body) }); } catch (e) { next(e); }
};
export const login = async (req, res, next) => {
	try { res.json({ data: await AuthService.login(req.body) }); } catch (e) { next(e); }
};
export const getCurrentUser = (req, res) => res.json({ data: req.user });
