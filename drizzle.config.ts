import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not defined');
}

export default defineConfig({
	out: './drizzle',
	schema: './app/lib/db/schema.ts',
	dialect: 'postgresql',
	strict: true,
	verbose: true,
	dbCredentials: {
		url: DATABASE_URL,
	},
});
