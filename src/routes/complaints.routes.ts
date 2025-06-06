import { Router } from 'express';

import { validateLicensePlate } from '../middleware/validateLicensePlate.middleware';
import { ComplaintsController } from '../controllers/complaints.controller';

const router = Router();

const complaintsController = new ComplaintsController();

// @desc Get complaints
// @route GET /complaints
// @access Public
router.get('/', validateLicensePlate, (req, res) => complaintsController.getComplaints(req, res));

export default router;
