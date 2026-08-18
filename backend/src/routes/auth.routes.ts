import { Router } from 'express';

const router = Router();

/**
 * Authentication routes — implemented in Phase 3.
 * Stubs return 501 to confirm routing is wired up.
 */
router.post('/register', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 3' });
});

router.post('/login', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 3' });
});

router.post('/logout', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 3' });
});

router.post('/forgot-password', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 3' });
});

router.post('/reset-password', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 3' });
});

router.get('/verify-email/:token', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 3' });
});

router.post('/refresh-token', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 3' });
});

export default router;
