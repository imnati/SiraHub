import { Router } from 'express';

const router = Router();

/**
 * Skills routes.
 * Full implementation in Phase 4.
 * Stubs confirm routing is wired.
 */

/** GET /api/skills — public, list/search skills */
router.get('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

/** GET /api/skills/:id — public */
router.get('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

/** POST /api/skills — admin only */
router.post('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

/** PUT /api/skills/:id — admin only */
router.put('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

/** DELETE /api/skills/:id — admin only */
router.delete('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

export default router;
