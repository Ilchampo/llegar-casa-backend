"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateLicensePlate_middleware_1 = require("../middleware/validateLicensePlate.middleware");
const complaints_controller_1 = require("../controllers/complaints.controller");
const router = (0, express_1.Router)();
const complaintsController = new complaints_controller_1.ComplaintsController();
// @desc Get complaints
// @route GET /complaints
// @access Public
router.get('/', validateLicensePlate_middleware_1.validateLicensePlate, (req, res) => complaintsController.getComplaints(req, res));
exports.default = router;
