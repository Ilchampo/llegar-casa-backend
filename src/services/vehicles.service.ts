import type { Response } from '../lib/interfaces/response.interface';
import type { Vehicle } from '../lib/interfaces/vehicle.interface';

import { getFromCache, setInCache, CacheTTL } from '../lib/utils/simpleCache';
import { ResponseHandler } from '../lib/utils/responseHandler';
import { parseHtmlVehice } from '../lib/utils/htmlParser';
import { ApiCaller } from '../lib/utils/apiCaller';

import FormData from 'form-data';

import config from '../config';

export class VehicleService {
	private readonly apiCaller: ApiCaller;

	constructor() {
		this.apiCaller = new ApiCaller(config.services.vehicles.baseURL);
	}

	async getVehicle(licensePlate: string): Promise<Response<Vehicle>> {
		const cacheKey = `vehicle:${licensePlate}`;
		const cached = getFromCache<Response<Vehicle>>(cacheKey);

		if (cached) {
			return cached;
		}

		const result = await ResponseHandler.handleApiCall<Vehicle>(async () => {
			const form = new FormData();

			form.append('placa_vehiculo', licensePlate.replace('-', ''));

			const response = await this.apiCaller.post<string, FormData>('/', form, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (response.data.length === 0) {
				throw new Error('No vehicle found');
			}

			const vehicle = parseHtmlVehice(response.data);

			return {
				data: vehicle,
				status: response.status,
			};
		}, 'Vehicle retrieved successfully');

		if (result.status >= 200 && result.status < 400) {
			setInCache(cacheKey, result, CacheTTL.VEHICLES);
		}

		return result;
	}
}
