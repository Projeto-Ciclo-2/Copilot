import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/index";
import { router } from "./routes/router";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import { wss } from "./websocket";

const app: Express = express();
app.use(
	cors({
		origin: config.CLIENT_URL,
		credentials: true,
	})
);
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);
// app.listen(config.PORT, () =>
// 	console.log(`server running at port ${config.PORT}!`)
// );

const server = http.createServer(app);
server.listen(config.PORT, () => {
	console.log(`server running at port ${config.PORT}!`);
});

server.on("upgrade", (req, socket, head) => {
	wss.handleUpgrade(req, socket, head, (ws) => {
		wss.emit("connection", ws, req);
	});
});
