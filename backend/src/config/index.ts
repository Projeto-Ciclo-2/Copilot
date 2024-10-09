import dotenv from "dotenv";
dotenv.config();

const dotenvIsConfig =
	process.env.PORT != null &&
	process.env.DB_HOST != null &&
	process.env.DB_USER != null &&
	process.env.DB_DATABASE_NAME != null &&
	process.env.DB_PASSWORD != null &&
	process.env.DB_PORT != null &&
	process.env.JWT != null;

if (!dotenvIsConfig)
	console.error(
		"O arquivo .env não possui todas as configurações necessárias, algumas funcionalidades podem não funcionar bem."
	);

export const config = {
	PORT: process.env.PORT || 5000,

	DB_HOST: process.env.DB_HOST || "localhost",
	DB_USER: process.env.DB_USER || "postgres",
	DB_DATABASE_NAME: process.env.DB_DATABASE_NAME || "db",
	DB_PASSWORD: process.env.DB_PASSWORD || "1234",
	DB_PORT: process.env.DB_PORT || "5423",

	JWT: process.env.JWT || "1234",
};
