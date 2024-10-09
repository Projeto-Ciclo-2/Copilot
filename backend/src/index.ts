import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/index";
import { router } from "./routes/router";

const app: Express = express();

app.use(cookieParser());
app.use(express.json());
app.use(router);
app.listen(config.PORT, () =>
	console.log(`server running at port ${config.PORT}!`)
);
