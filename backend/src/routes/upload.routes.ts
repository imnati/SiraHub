import { Router } from 'express';

const router = Router();

/**
 * File Upload routes (Cloudinary via Multer).
 * Full implementation in Phase 5.
 */

/** POST /api/uploads/avatar — authenticated, any role */
router.post('/avatar', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** POST /api/uploads/cv — jobseeker */
router.post('/cv', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** POST /api/uploads/certificate — jobseeker */
router.post('/certificate', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** POST /api/uploads/logo — employer */
router.post('/logo', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

/** DELETE /api/uploads/:publicId — authenticated, own files only */
router.delete('/:publicId', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 5' });
});

export default router;
