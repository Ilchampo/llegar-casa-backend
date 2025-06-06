import { cleanExpiredCache } from './lib/utils/simpleCache';

import app from './app';

const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;

app.listen(app.get('port'), () => {
	console.log(`Server is running on port ${app.get('port')}`);
});

setInterval(() => {
	cleanExpiredCache();
}, CLEANUP_INTERVAL_MS);
