import { Router } from "express";
import UserController from "../controllers/userController";

const userController: UserController = new UserController();
const userRoutes: Router = Router();

userRoutes.post("/", userController.createUser.bind(userController));
userRoutes.get("/:user_id", userController.getUserById.bind(userController));
userRoutes.put("/:user_id", userController.updateUser.bind(userController));
userRoutes.delete("/:user_id", userController.deleteUser.bind(userController));

export default userRoutes;
