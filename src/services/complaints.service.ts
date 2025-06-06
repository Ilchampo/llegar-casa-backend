import type { ComplaintResponse, ComplaintData } from '../lib/interfaces/complaints.interface';
import type { Response } from '../lib/interfaces/response.interface';

import { getFromCache, setInCache, CacheTTL } from '../lib/utils/simpleCache';
import { ResponseHandler } from '../lib/utils/responseHandler';
import { ApiCaller } from '../lib/utils/apiCaller';

import config from '../config';

export class ComplaintsService {
	private readonly apiCaller: ApiCaller;

	constructor() {
		this.apiCaller = new ApiCaller(config.services.complaints.baseURL);
	}

	async getComplaints(licensePlate: string): Promise<Response<ComplaintResponse>> {
		const cacheKey = `complaints:${licensePlate}`;
		const cached = getFromCache<Response<ComplaintResponse>>(cacheKey);

		if (cached) {
			return cached;
		}

		const result = await ResponseHandler.handleApiCall<ComplaintResponse>(async () => {
			const response = await this.apiCaller.get<ComplaintData>('/scraper/complaints', {
				params: {
					license_plate: licensePlate.replace('-', ''),
				},
			});

			if (!response.data.search_successful) {
				throw new Error(response.data.error_message ?? 'Scrapper service temporarily unavailable');
			}

			const transformedData: ComplaintResponse = {
				location: response.data.lugar,
				date: response.data.fecha,
				offense: response.data.delito,
			};

			return {
				data: transformedData,
				status: response.status,
			};
		}, 'Complaints retrieved successfully');

		if (result.status >= 200 && result.status < 400) {
			setInCache(cacheKey, result, CacheTTL.COMPLAINTS);
		}

		return result;
	}
}
