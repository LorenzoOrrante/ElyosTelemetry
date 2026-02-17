import { Router } from "express";
import {
    createLap,
    endLap,
    getAllLaps
} from "../controllers/LapsController.js";

const router = Router();

// Create new lap
router.post('/', createLap);

// End lap
router.patch('/:id/end', endLap);

// Get all laps from a session
router.get('/:id/laps', getAllLaps);

export default router;