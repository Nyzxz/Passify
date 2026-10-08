import { ReviewSetService } from "../services/reviewSet.service.js";
export const getReviewSets = (req, res) => res.json({ data: ReviewSetService.list(req.user.id, req.query.folderId) });
export const uploadReviewSets = (req, res, next) => {
  try { res.status(201).json({ data: ReviewSetService.upload(req.user.id, req.files, req.body.folderId || null) }); } catch (e) { next(e); }
};
