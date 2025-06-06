import type { HelmetOptions } from 'helmet';

import config from '../config';

const helmetOptions: HelmetOptions = {
	contentSecurityPolicy: false,

	crossOriginEmbedderPolicy: false,
	crossOriginOpenerPolicy: false,
	crossOriginResourcePolicy: false,

	xContentTypeOptions: true,
	xFrameOptions: { action: 'deny' },
	xXssProtection: true,
	referrerPolicy: { policy: 'strict-origin-when-cross-origin' },

	hsts:
		config.app.env === 'production'
			? {
					maxAge: 31536000,
					includeSubDomains: true,
					preload: true,
				}
			: false,

	hidePoweredBy: true,
};

export default helmetOptions;
