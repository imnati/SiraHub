import { Router } from 'express';

const router = Router();

/**
 * Admin routes — implemented in Phase 7.
 */
router.get('/dashboard', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 7' });
});

router.get('/users', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 7' });
});

router.put('/users/:id/ban', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 7' });
});

router.get('/reports', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 7' });
});

export default router;
