import rateLimit from 'express-rate-limit';
import config from '../config';

// Time windows (in milliseconds)
const ONE_MINUTE = 60 * 1000;
const FIFTEEN_MINUTES = 15 * 60 * 1000;

// Request limits for production environment
const PROD_GENERAL_API_LIMIT = 100;
const PROD_DATA_FETCH_LIMIT = 30;

// Request limits for development environment
const DEV_GENERAL_API_LIMIT = 1000;
const DEV_DATA_FETCH_LIMIT = 100;

// Request limits for basic endpoints
const BASIC_ENDPOINT_LIMIT = 60;

const rateLimitMessage = {
	message: 'Too many requests',
	status: 429,
	error: 'Rate limit exceeded. Please try again later.',
};

export const apiRateLimit = rateLimit({
	windowMs: config.app.env === 'production' ? FIFTEEN_MINUTES : ONE_MINUTE,
	max: config.app.env === 'production' ? PROD_GENERAL_API_LIMIT : DEV_GENERAL_API_LIMIT,
	message: rateLimitMessage,
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		res.status(429).json(rateLimitMessage);
	},
});

export const dataFetchRateLimit = rateLimit({
	windowMs: config.app.env === 'production' ? FIFTEEN_MINUTES : ONE_MINUTE,
	max: config.app.env === 'production' ? PROD_DATA_FETCH_LIMIT : DEV_DATA_FETCH_LIMIT,
	message: {
		message: 'Too many data requests',
		status: 429,
		error: 'Rate limit exceeded for data fetching. Please wait before making more requests.',
	},
	standardHeaders: true,
	legacyHeaders: false,
	handler: (req, res) => {
		res.status(429).json({
			message: 'Too many data requests',
			status: 429,
			error: 'Rate limit exceeded for data fetching. Please wait before making more requests.',
		});
	},
	skip: (req) => {
		return req.path === '/' || req.path === '/health';
	},
});

export const basicRateLimit = rateLimit({
	windowMs: ONE_MINUTE,
	max: BASIC_ENDPOINT_LIMIT,
	message: rateLimitMessage,
	standardHeaders: true,
	legacyHeaders: false,
});
