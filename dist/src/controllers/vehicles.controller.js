"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleController = void 0;
const vehicles_service_1 = require("../services/vehicles.service");
class VehicleController {
    vehicleService;
    constructor() {
        this.vehicleService = new vehicles_service_1.VehicleService();
    }
    async getVehicle(req, res) {
        const { licensePlate } = req.query;
        const response = await this.vehicleService.getVehicle(licensePlate);
        res.status(response.status).json(response);
    }
}
exports.VehicleController = VehicleController;
