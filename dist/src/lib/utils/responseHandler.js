"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHandler = void 0;
class ResponseHandler {
    /**
     * Creates a standardized success response
     * @param data - The response data
     * @param message - Success message
     * @param status - HTTP status code (defaults to 200)
     */
    static success(data, message = 'Success', status = 200) {
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
    static error(error, status = 500, message = 'Error') {
        return {
            message,
            status,
            error,
            data: undefined,
        };
    }
    /**
     * Handles external API responses and transforms them to our standard format
     * @param apiResponse - The response from external API
     * @param successMessage - Message for successful responses
     */
    static handleApiResponse(apiResponse, successMessage = 'API request successful') {
        const { data, status } = apiResponse;
        if (status >= 200 && status < 500) {
            return this.success(data, successMessage, status);
        }
        return this.error('External API server error', status, 'External service unavailable');
    }
    /**
     * Handles database operation results
     * @param dbResult - Result from database operation
     * @param successMessage - Message for successful operations
     */
    static handleDbResult(dbResult, successMessage = 'Database operation successful') {
        if (dbResult !== null && dbResult !== undefined) {
            return this.success(dbResult, successMessage);
        }
        return this.error('No data found', 404, 'Not found');
    }
    /**
     * Handles database operations that might throw errors
     * @param operation - Async database operation
     * @param successMessage - Message for successful operations
     */
    static async handleDbOperation(operation, successMessage = 'Database operation successful') {
        try {
            const result = await operation();
            return this.handleDbResult(result, successMessage);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Database operation failed';
            return this.error(errorMessage, 500, 'Database error');
        }
    }
    /**
     * Wraps external API calls with proper error handling
     * @param apiCall - Async API call function
     * @param successMessage - Message for successful API calls
     */
    static async handleApiCall(apiCall, successMessage = 'API request successful') {
        try {
            const apiResponse = await apiCall();
            return this.handleApiResponse(apiResponse, successMessage);
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'API request failed';
            return this.error(errorMessage, 503, 'Service unavailable');
        }
    }
    /**
     * Validates if a response is successful
     * @param response - Response to validate
     */
    static isSuccess(response) {
        return response.status >= 200 && response.status < 400 && !response.error;
    }
    /**
     * Validates if a response is an error
     * @param response - Response to validate
     */
    static isError(response) {
        return response.status >= 400 || !!response.error;
    }
}
exports.ResponseHandler = ResponseHandler;
