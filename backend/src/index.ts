import express, { Express } from "express";
import cookieParser from "cookie-parser";
import { config } from "./config/index";
import { router } from "./routes/router";
import cors from "cors";
import bodyParser from "body-parser";

const app: Express = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());
app.use("/api", router);
app.listen(config.PORT, () =>
	console.log(`server running at port ${config.PORT}!`)
);
