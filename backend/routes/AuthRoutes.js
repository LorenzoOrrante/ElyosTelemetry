import { Router } from 'express';
import { checkControl } from '../controllers/AuthController.js';

const router = Router();

router.get('/check-control', checkControl);

export default router;