import { Router } from 'express';

const router = Router();

/**
 * Application routes — implemented in Phase 6.
 */
router.post('/apply', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 6' });
});

router.get('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 6' });
});

router.get('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 6' });
});

router.put('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 6' });
});

export default router;
