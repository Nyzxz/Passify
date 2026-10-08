import { StudySetService } from "../services/studySet.service.js";

// Controllers translate HTTP <-> service calls. Errors flow to the error middleware.
export const getStudySets = async (req, res, next) => {
  try { res.json({ data: await StudySetService.list() }); } catch (e) { next(e); }
};

export const getStudySet = async (req, res, next) => {
  try { res.json({ data: await StudySetService.get(req.params.id) }); } catch (e) { next(e); }
};

export const createStudySet = async (req, res, next) => {
  try { res.status(201).json({ data: await StudySetService.create(req.body) }); } catch (e) { next(e); }
};
