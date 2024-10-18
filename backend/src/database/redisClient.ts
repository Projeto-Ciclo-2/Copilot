import dotenv from "dotenv";
import Redis from "ioredis";

dotenv.config();

const redisClient = new Redis({
	port: Number(process.env.REDIS_PORT),
	host: process.env.DB_HOST,
});

export default redisClient;
