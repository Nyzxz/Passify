import { FolderService } from "../services/folder.service.js";
export const getFolders = async (req, res, next) => {
	try { res.json({ data: await FolderService.tree(req.user.id) }); } catch (e) { next(e); }
};
export const getSubfolders = async (req, res, next) => {
	try { res.json({ data: await FolderService.subfolders(req.user.id, req.params.id) }); } catch (e) { next(e); }
};
export const createFolder = async (req, res, next) => {
	try { res.status(201).json({ data: await FolderService.create(req.user.id, req.body) }); } catch (e) { next(e); }
};
