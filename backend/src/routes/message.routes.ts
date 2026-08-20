import { Router } from 'express';

const router = Router();

/**
 * Messages routes.
 * Full implementation in Phase 8.
 */

/** GET /api/messages/conversations — list conversation threads */
router.get('/conversations', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 8' });
});

/** GET /api/messages/:conversationId — get messages in thread */
router.get('/:conversationId', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 8' });
});

/** POST /api/messages — send a message */
router.post('/', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 8' });
});

/** PATCH /api/messages/:conversationId/read — mark thread as read */
router.patch('/:conversationId/read', (_req, res) => {
  res.status(501).json({ success: false, message: 'Not implemented — Phase 8' });
});

export default router;
