import { Pool } from "pg";
import { config } from "../config";

export const dbConnection = new Pool({
	database: config.DB_DATABASE_NAME,
	user: config.DB_USER,
	host: config.DB_HOST,
	password: config.DB_PASSWORD,
	port: parseInt(config.DB_PORT),
});
