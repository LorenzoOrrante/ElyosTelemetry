import { Router } from 'express';
import {
    getAllConfigurations,
    getConfigurationById,
    createConfiguration,
    updateConfiguration,
    deleteConfiguration
} from "../controllers/configurationController.js";

const router = Router();

// Get all configurations
router.get('/', getAllConfigurations);

// Get configuration by id
router.get('/:id', getConfigurationById);

// Create configuration
router.post('/', createConfiguration);

// Update configuration
router.put('/:id', updateConfiguration);

// Delete configuration
router.delete('/:id', deleteConfiguration);

export default router;
