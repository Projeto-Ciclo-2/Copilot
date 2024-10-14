import express, { Express } from "express";
import userRoutes from "./userRoutes";
export const router: Express = express();

router.use("/users", userRoutes);
