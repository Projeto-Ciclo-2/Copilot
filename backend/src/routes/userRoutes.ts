import { Request, Response, Router } from "express";

export const userRoutes = Router();

userRoutes.get("/", (_req: Request, res: Response) => {
	res.send("Hello World from userRoutes.ts");
});
