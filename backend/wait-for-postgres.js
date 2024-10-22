//this file will run only inside docker
// 	its function is to only run the backend when the Postgres is ready
const { Client } = require("pg");
const pConfig = require("./dist/config").config;

const client = new Client({
	host: pConfig.DB_HOST,
	user: pConfig.DB_USER,
	password: pConfig.DB_PASSWORD,
	database: "postgres", // Connect to the default 'postgres' database first
	port: pConfig.DB_PORT,
});

const retryInterval = 2000; // Retry every 2 seconds

(async function waitForPostgres() {
	while (true) {
		try {
			await client.connect();
			const res = await client.query("SELECT 1");
			if (res) {
				console.log("PostgreSQL is ready");
				await client.end();
				break;
			}
		} catch (err) {
			console.log("Waiting for PostgreSQL...");
			await new Promise((resolve) => setTimeout(resolve, retryInterval));
		}
	}
})();
