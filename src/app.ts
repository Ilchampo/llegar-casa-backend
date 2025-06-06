import express from 'express';
import helmet from 'helmet';
import cors from 'cors';

import { apiRateLimit, dataFetchRateLimit, basicRateLimit } from './config/rateLimit';
import { getCacheStats } from './lib/utils/simpleCache';

import complaintsRoutes from './routes/complaints.routes';
import vehiclesRoutes from './routes/vehicles.routes';
import helmetOptions from './config/helmet';
import corsOptions from './config/cors';

import config from './config';

const app = express();

app.set('port', config.app.port);

app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.use(apiRateLimit);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/health', (req, res) => {
	res.json({
		message: 'Service is healthy',
		status: 200,
		data: {
			environment: config.app.env,
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			cache: getCacheStats(),
		},
	});
});

app.use('/api/complaints', dataFetchRateLimit, complaintsRoutes);
app.use('/api/vehicles', dataFetchRateLimit, vehiclesRoutes);

app.get('/', basicRateLimit, (req, res) => {
	res.send('Llegar a Casa Backend - Running on port ' + app.get('port'));
});

export default app;
