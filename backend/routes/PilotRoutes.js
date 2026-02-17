import { Router } from 'express';
import {
    getAllPilots,
    getPilotByName,
    createPilot,
    updatePilot,
    deletePilot
} from '../controllers/PilotController.js';

const router = Router();

// Get all pilots
router.get('/', getAllPilots);

// Get pilot by name
router.get('/name/:name', getPilotByName);

// Create pilot
router.post('/', createPilot);

// Update pilot
router.put('/:id', updatePilot);

// Delete pilot
router.delete('/:id', deletePilot);

export default router;