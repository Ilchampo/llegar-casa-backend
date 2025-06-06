import { Router } from 'express';

import { validateLicensePlate } from '../middleware/validateLicensePlate.middleware';
import { VehicleController } from '../controllers/vehicles.controller';

const router = Router();

const vehicleController = new VehicleController();

// @desc Get vehicle
// @route GET /vehicles
// @access Public
router.get('/', validateLicensePlate, (req, res) => vehicleController.getVehicle(req, res));

export default router;
