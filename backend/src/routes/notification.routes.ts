import { Router } from 'express';

const router = Router();

/**
 * Notification routes — implemented in Phase 8.
 */
router.get('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 8' });
});

router.put('/:id/read', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 8' });
});

router.put('/read-all', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 8' });
});

export default router;
