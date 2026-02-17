import { Router } from 'express';
import {
    startRecording,
    stopRecording,
    statusRecording,
    saveRecording,
    sendMessage,
    getMessage
} from '../controllers/RecordController.js';

const router = Router();

// Start recording
router.post('/start', startRecording);

// Stop recording
router.post('/pause', stopRecording);

// Status recording
router.get('/status', statusRecording);

// Send message
router.post('/message', sendMessage);

// Get message
router.get('/message', getMessage);

// Save recording
router.get('/save', saveRecording);

export default router;