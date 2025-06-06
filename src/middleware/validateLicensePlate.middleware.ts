import type { MiddlewareErrorResponse, ValidationError } from '../lib/interfaces/middleware.interface';
import type { Request, Response, NextFunction } from 'express';

import { parseLicensePlate } from '../lib/utils/strUtils';

/**
 * Middleware to validate and normalize license plate query parameter
 * Validates Ecuadorian license plate format: AAA-0000 or AAA-000
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
export const validateLicensePlate = (req: Request, res: Response, next: NextFunction): void => {
	const { licensePlate } = req.query;

	if (!licensePlate) {
		const errorResponse: MiddlewareErrorResponse = {
			success: false,
			error: 'License plate is required',
			details: [
				{
					field: 'licensePlate',
					message: 'License plate query parameter is required',
				},
			],
			timestamp: new Date().toISOString(),
		};

		res.status(400).json(errorResponse);

		return;
	}

	const licensePlateStr = String(licensePlate).trim();

	if (licensePlateStr.length === 0) {
		const errorResponse: MiddlewareErrorResponse = {
			success: false,
			error: 'License plate cannot be empty',
			details: [
				{
					field: 'licensePlate',
					message: 'License plate must not be empty',
					received: licensePlateStr,
				},
			],
			timestamp: new Date().toISOString(),
		};

		res.status(400).json(errorResponse);
		return;
	}

	const ecuadorianPlateRegex = /^[A-Za-z]{3}-\d{3,4}$/;

	if (!ecuadorianPlateRegex.test(licensePlateStr)) {
		const errors: ValidationError[] = [];

		if (!/^[A-Za-z]{3}/.test(licensePlateStr)) {
			errors.push({
				field: 'licensePlate',
				message: 'License plate must start with exactly 3 letters (A-Z)',
				received: licensePlateStr,
			});
		}

		if (!/^[A-Za-z]{3}-/.test(licensePlateStr)) {
			errors.push({
				field: 'licensePlate',
				message: 'License plate must have a dash (-) after the 3 letters',
				received: licensePlateStr,
			});
		}

		if (!/\d{3,4}$/.test(licensePlateStr)) {
			errors.push({
				field: 'licensePlate',
				message: 'License plate must end with 3 or 4 digits after the dash',
				received: licensePlateStr,
			});
		}

		if (errors.length === 0) {
			errors.push({
				field: 'licensePlate',
				message: 'License plate must follow Ecuadorian format: AAA-0000 or AAA-000',
				received: licensePlateStr,
			});
		}

		const errorResponse: MiddlewareErrorResponse = {
			success: false,
			error: 'Invalid license plate format',
			details: errors,
			timestamp: new Date().toISOString(),
		};

		res.status(400).json(errorResponse);

		return;
	}

	try {
		const normalizedLicensePlate = parseLicensePlate(licensePlateStr);

		const letterPart = normalizedLicensePlate.substring(0, 3);
		const numberPart = normalizedLicensePlate.substring(3);
		const formattedLicensePlate = `${letterPart}-${numberPart}`;

		req.query.licensePlate = formattedLicensePlate;

		next();
	} catch (error) {
		const errorResponse: MiddlewareErrorResponse = {
			success: false,
			error: 'Error processing license plate',
			details: [
				{
					field: 'licensePlate',
					message: `Failed to normalize license plate: ${error instanceof Error ? error.message : 'Unknown error'}`,
					received: licensePlateStr,
				},
			],
			timestamp: new Date().toISOString(),
		};

		res.status(500).json(errorResponse);

		return;
	}
};
