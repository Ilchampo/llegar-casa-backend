export interface ValidationError {
	field: string;
	message: string;
	received?: string;
}

export interface MiddlewareErrorResponse {
	success: false;
	error: string;
	details?: ValidationError[];
	timestamp: string;
}
