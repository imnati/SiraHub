import { Router } from 'express';

const router = Router();

/**
 * Category routes — implemented in Phase 4/7.
 */
router.get('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

router.post('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

router.put('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

router.delete('/:id', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 4' });
});

export default router;
