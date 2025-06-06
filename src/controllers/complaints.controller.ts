import type { Request, Response } from 'express';

import { ComplaintsService } from '../services/complaints.service';

export class ComplaintsController {
	private readonly complaintsService: ComplaintsService;

	constructor() {
		this.complaintsService = new ComplaintsService();
	}

	async getComplaints(req: Request, res: Response) {
		const { licensePlate } = req.query;

		const response = await this.complaintsService.getComplaints(licensePlate as string);

		res.status(response.status).json(response);
	}
}
