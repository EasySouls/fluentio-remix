import 'dotenv/config';
import { reactRouter } from '@react-router/dev/vite';
import {
	type SentryReactRouterBuildOptions,
	sentryReactRouter,
} from '@sentry/react-router';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const SENTRY_ORG = process.env.SENTRY_ORG;
const SENTRY_PROJECT = process.env.SENTRY_PROJECT;
const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN;

if (!SENTRY_AUTH_TOKEN || !SENTRY_ORG || !SENTRY_PROJECT) {
	console.error(
		'Sentry environment variables are not set. Please set SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT.',
	);
	process.exit(1);
}

const sentryConfig: SentryReactRouterBuildOptions = {
	org: SENTRY_ORG,
	project: SENTRY_PROJECT,

	// An auth token is required for uploading source maps.
	authToken: SENTRY_AUTH_TOKEN,
};

export default defineConfig((config) => {
	return {
		plugins: [
			reactRouter(),
			tsconfigPaths(),
			sentryReactRouter(sentryConfig, config),
		],
	};
});
