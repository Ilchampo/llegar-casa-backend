import type { CorsOptionsDelegate } from 'cors';
import type { Request } from 'express';

import config from '../config';
import cors from 'cors';

const corsOptions: CorsOptionsDelegate<Request> = (
	req: Request,
	callback: (err: Error | null, options?: cors.CorsOptions) => void,
) => {
	let options: cors.CorsOptions;

	if (config.app.env === 'development') {
		options = {
			origin: true,
			credentials: true,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
		};
	} else {
		const allowedOrigins = config.app.corsOrigin
			? Array.isArray(config.app.corsOrigin)
				? config.app.corsOrigin
				: [config.app.corsOrigin]
			: [];

		options = {
			origin: (origin, originCallback) => {
				if (!origin) {
					return originCallback(null, true);
				}

				if (allowedOrigins.includes(origin)) {
					originCallback(null, true);
				} else {
					originCallback(new Error('Not allowed by CORS'));
				}
			},
			credentials: false,
			methods: ['GET'],
			allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
			exposedHeaders: ['X-Total-Count'],
			maxAge: 86400,
			optionsSuccessStatus: 200,
		};
	}

	callback(null, options);
};

export default corsOptions;
