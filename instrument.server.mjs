import * as Sentry from '@sentry/react-router';

Sentry.init({
	dsn: 'https://224e7164266a882db9b27c7e7481fa0d@o4508638897504256.ingest.de.sentry.io/4509309371744336',

	// Adds request headers and IP for users, for more info visit:
	// https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
	sendDefaultPii: true,
});
