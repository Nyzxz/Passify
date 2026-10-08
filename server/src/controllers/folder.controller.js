import { FolderService } from "../services/folder.service.js";
export const getFolders = (req, res) => res.json({ data: FolderService.tree(req.user.id) });
export const getSubfolders = (req, res, next) => { try { res.json({ data: FolderService.subfolders(req.user.id, req.params.id) }); } catch (e) { next(e); } };
export const createFolder = (req, res, next) => { try { res.status(201).json({ data: FolderService.create(req.user.id, req.body) }); } catch (e) { next(e); } };
