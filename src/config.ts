import type { Config, Environment } from './lib/interfaces/config.interface';

import dotenv from 'dotenv';

dotenv.config();

const parseCorsOrigin = (corsOrigin?: string): string | string[] | undefined => {
	if (!corsOrigin) {
		return undefined;
	}

	const origins = corsOrigin.split(',').map((origin) => origin.trim());

	return origins.length === 1 ? origins[0] : origins;
};

const config: Config = {
	app: {
		port: parseInt(process.env.PORT ?? '3000'),
		env: (process.env.NODE_ENV as Environment) ?? 'development',
		corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN_WHITELIST) ?? 'http://localhost:5173',
	},
	services: {
		complaints: {
			baseURL: process.env.COMPLAINTS_BASE_URL ?? 'http://localhost:8000',
			timeout: parseInt(process.env.COMPLAINTS_TIMEOUT ?? '20000'),
		},
		vehicles: {
			baseURL: process.env.VEHICLES_BASE_URL ?? 'http://localhost:6000',
			timeout: parseInt(process.env.VEHICLES_TIMEOUT ?? '20000'),
		},
	},
};

export default config;
