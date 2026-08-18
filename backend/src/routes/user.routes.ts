import { Router } from 'express';

const router = Router();

/**
 * User / profile routes — implemented in Phase 5.
 */
router.get('/me', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

router.put('/me', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

export default router;
