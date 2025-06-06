import type { Response } from '../interfaces/response.interface';

export class ResponseHandler {
	/**
	 * Creates a standardized success response
	 * @param data - The response data
	 * @param message - Success message
	 * @param status - HTTP status code (defaults to 200)
	 */
	static success<T>(data?: T, message: string = 'Success', status: number = 200): Response<T> {
		return {
			message,
			status,
			data,
		};
	}

	/**
	 * Creates a standardized error response
	 * @param error - Error message
	 * @param status - HTTP status code (defaults to 500)
	 * @param message - General message (defaults to 'Error')
	 */
	static error<T = null>(error: string, status: number = 500, message: string = 'Error'): Response<T> {
		return {
			message,
			status,
			error,
			data: undefined as T,
		};
	}

	/**
	 * Handles external API responses and transforms them to our standard format
	 * @param apiResponse - The response from external API
	 * @param successMessage - Message for successful responses
	 */
	static handleApiResponse<T>(
		apiResponse: { data: T; status: number },
		successMessage: string = 'API request successful',
	): Response<T> {
		const { data, status } = apiResponse;

		if (status >= 200 && status < 500) {
			return this.success(data, successMessage, status);
		}

		return this.error<T>('External API server error', status, 'External service unavailable');
	}

	/**
	 * Handles database operation results
	 * @param dbResult - Result from database operation
	 * @param successMessage - Message for successful operations
	 */
	static handleDbResult<T>(
		dbResult: T | null,
		successMessage: string = 'Database operation successful',
	): Response<T> {
		if (dbResult !== null && dbResult !== undefined) {
			return this.success(dbResult, successMessage);
		}

		return this.error<T>('No data found', 404, 'Not found');
	}

	/**
	 * Handles database operations that might throw errors
	 * @param operation - Async database operation
	 * @param successMessage - Message for successful operations
	 */
	static async handleDbOperation<T>(
		operation: () => Promise<T>,
		successMessage: string = 'Database operation successful',
	): Promise<Response<T>> {
		try {
			const result = await operation();

			return this.handleDbResult(result, successMessage);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Database operation failed';

			return this.error<T>(errorMessage, 500, 'Database error');
		}
	}

	/**
	 * Wraps external API calls with proper error handling
	 * @param apiCall - Async API call function
	 * @param successMessage - Message for successful API calls
	 */
	static async handleApiCall<T>(
		apiCall: () => Promise<{ data: T; status: number }>,
		successMessage: string = 'API request successful',
	): Promise<Response<T>> {
		try {
			const apiResponse = await apiCall();

			return this.handleApiResponse(apiResponse, successMessage);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'API request failed';

			return this.error<T>(errorMessage, 503, 'Service unavailable');
		}
	}

	/**
	 * Validates if a response is successful
	 * @param response - Response to validate
	 */
	static isSuccess<T>(response: Response<T>): boolean {
		return response.status >= 200 && response.status < 400 && !response.error;
	}

	/**
	 * Validates if a response is an error
	 * @param response - Response to validate
	 */
	static isError<T>(response: Response<T>): boolean {
		return response.status >= 400 || !!response.error;
	}
}
