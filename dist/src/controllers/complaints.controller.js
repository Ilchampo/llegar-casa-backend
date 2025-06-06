"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintsController = void 0;
const complaints_service_1 = require("../services/complaints.service");
class ComplaintsController {
    complaintsService;
    constructor() {
        this.complaintsService = new complaints_service_1.ComplaintsService();
    }
    async getComplaints(req, res) {
        const { licensePlate } = req.query;
        const response = await this.complaintsService.getComplaints(licensePlate);
        res.status(response.status).json(response);
    }
}
exports.ComplaintsController = ComplaintsController;
