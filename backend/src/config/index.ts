import dotenv from "dotenv";
dotenv.config();

const dotenvIsConfig =
	process.env.OPENAI_KEY != null &&
	process.env.USE_GPT_KEY != null &&
	process.env.PORT != null &&
	process.env.BCRYPT_ROUNDS != null &&
	process.env.CLIENT_URL != null &&
	process.env.DB_USER != null &&
	process.env.DB_HOST != null &&
	process.env.DB_DATABASE_NAME != null &&
	process.env.DB_PASSWORD != null &&
	process.env.DB_PORT != null &&
	process.env.REDIS_PORT != null &&
	process.env.DATABASE_URL != null &&
	process.env.JWT != null;

if (!dotenvIsConfig)
	console.error(
		"O arquivo .env não possui todas as configurações necessárias, algumas funcionalidades podem não funcionar bem."
	);

export const config = {
	OPENAI_KEY: process.env.OPENAI_KEY || "",
	USE_GPT_KEY: process.env.USE_GPT_KEY || "0",

	PORT: process.env.PORT || 5000,

	BCRYPT_ROUNDS: process.env.BCRYPT_ROUNDS || 10,

	CLIENT_URL: process.env.CLIENT_URL || "http:localhost:3000",

	DB_USER: process.env.DB_USER || "postgres",
	DB_HOST: process.env.DB_HOST || "localhost",
	DB_DATABASE_NAME: process.env.DB_DATABASE_NAME || "db",
	DB_PASSWORD: process.env.DB_PASSWORD || "1234",
	DB_PORT: process.env.DB_PORT || "5432",
	REDIS_PORT: process.env.REDIS_PORT || 6379,
	DATABASE_URL: process.env.DATABASE_URL || "",
	JWT: process.env.JWT || "1234",
};
