import { ReviewSetService } from "../services/reviewSet.service.js";
export const getReviewSets = async (req, res, next) => {
  try { res.json({ data: await ReviewSetService.list(req.user.id, req.query.folderId) }); } catch (e) { next(e); }
};
export const uploadReviewSets = async (req, res, next) => {
  try { res.status(201).json({ data: await ReviewSetService.upload(req.user.id, req.files, req.body.folderId || null) }); } catch (e) { next(e); }
};
