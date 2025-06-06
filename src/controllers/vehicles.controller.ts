import type { Request, Response } from 'express';

import { VehicleService } from '../services/vehicles.service';

export class VehicleController {
	private readonly vehicleService: VehicleService;

	constructor() {
		this.vehicleService = new VehicleService();
	}

	async getVehicle(req: Request, res: Response) {
		const { licensePlate } = req.query;

		const response = await this.vehicleService.getVehicle(licensePlate as string);

		res.status(response.status).json(response);
	}
}
