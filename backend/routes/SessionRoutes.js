import { Router } from 'express';
import {
    createSession,
    getAllSessions,
    getSessionById,
    deleteSession,
} from '../controllers/SessionsController.js';

const router = Router();

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/:id', getSessionById);
router.delete('/:id', deleteSession);

export default router;