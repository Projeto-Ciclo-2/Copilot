import "ts-node/register";

import dotenv from "dotenv";

dotenv.config();

const config = {
	development: {
		client: "pg",
		connection: {
			host: process.env.DB_HOST,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
			database: process.env.DB_DATABASE_NAME,
			port: Number(process.env.DB_PORT),
		},
		migrations: {
			directory: "knex/migrations",
			extension: "ts",
		},
	},
} as const;

export default config;
