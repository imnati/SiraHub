import { Router } from 'express';

const router = Router();

/**
 * Saved Jobs routes.
 * Full implementation in Phase 5.
 */

/** GET /api/saved-jobs — jobseeker, list own saved jobs */
router.get('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** POST /api/saved-jobs — jobseeker, save a job */
router.post('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** DELETE /api/saved-jobs/:jobId — jobseeker, unsave a job */
router.delete('/:jobId', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

export default router;
