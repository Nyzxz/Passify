import { StudySetService } from "../services/studySet.service.js";

// Controllers translate HTTP <-> service calls. Errors flow to the error middleware.
export const getStudySets = (req, res) => res.json({ data: StudySetService.list() });

export const getStudySet = (req, res, next) => {
  try { res.json({ data: StudySetService.get(req.params.id) }); } catch (e) { next(e); }
};

export const createStudySet = (req, res, next) => {
  try { res.status(201).json({ data: StudySetService.create(req.body) }); } catch (e) { next(e); }
};
