"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const validateLicensePlate_middleware_1 = require("../middleware/validateLicensePlate.middleware");
const vehicles_controller_1 = require("../controllers/vehicles.controller");
const router = (0, express_1.Router)();
const vehicleController = new vehicles_controller_1.VehicleController();
// @desc Get vehicle
// @route GET /vehicles
// @access Public
router.get('/', validateLicensePlate_middleware_1.validateLicensePlate, (req, res) => vehicleController.getVehicle(req, res));
exports.default = router;
