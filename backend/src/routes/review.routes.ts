import { Router } from 'express';

const router = Router();

/**
 * Reviews routes.
 * Full implementation in Phase 5.
 */

/** GET /api/reviews/company/:companyId — public, list company reviews */
router.get('/company/:companyId', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** POST /api/reviews/company/:companyId — jobseeker, create a review */
router.post('/company/:companyId', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** PUT /api/reviews/:id — jobseeker (own review) */
router.put('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** DELETE /api/reviews/:id — jobseeker (own) or admin */
router.delete('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

export default router;
