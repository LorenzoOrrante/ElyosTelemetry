import { Router } from 'express';
import {
  getAllLectures,
  getBySessionId,
  getLectureById,
  createLecture
} from '../controllers/LectureController.js';

const router = Router();

// Get all the lectures
router.get('/', getAllLectures);

// Get lecture by session
router.get('/session/:sessionId', getBySessionId);

// Get lecture by ID
router.get('/:id', getLectureById);

// Create a new lecture
router.post('/', createLecture);

export default router;
