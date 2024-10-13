import { Request, Response, NextFunction } from "express";
import { IUserEntity } from "../entities/userEntity";
import { UserService } from "../services/userService";
import HttpResponse from "../utils/HttpResponse";
import { Message } from "../utils/Message";
import { BadRequestException } from "../utils/Exception";

export default class UserController {
	private userService: UserService;
	constructor() {
		this.userService = new UserService();
	}

	public async createUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const { name, password } = req.body;
			if (name === undefined || password === undefined) {
				throw new BadRequestException(
					Message.USERNAME_OR_PASSWORD_INCORRECT
				);
			}
			const user: IUserEntity = req.body;
			const result = await this.userService.createUser(user);

			const response = new HttpResponse({
				status: 201,
				data: result,
			});

			res.status(response.status).json(response);
		} catch (error) {
			next(error);
		}
	}

	public async getUserById(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const id = req.params.user_id;
			const result = await this.userService.getUserById(id);
			const response = new HttpResponse({
				status: 200,
				data: result,
			});
			res.status(response.status).json(response);
		} catch (error) {
			next(error);
		}
	}

	public async updateUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const id = req.params.user_id;
			console.log(req.params.user_id);
			const { name, password } = req.body;
			if (name === undefined || password === undefined) {
				throw new BadRequestException(
					Message.USERNAME_OR_PASSWORD_INCORRECT
				);
			}
			const result = await this.userService.update(id, req.body);
			const response = new HttpResponse({
				status: 200,
				data: result,
			});
			res.status(response.status).json(response);
		} catch (error) {
			next(error);
		}
	}

	public async deleteUser(
		req: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		try {
			const id = req.params.user_id;
			console.log(id);
			const result = await this.userService.delete(id);

			res.status(200).json(result);
		} catch (error) {
			next(error);
		}
	}
}
