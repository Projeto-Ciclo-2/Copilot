import { IUserEntity } from "../entities/userEntity";
import dbConnection from "../database/dbConnection";

export default class UserRepository {
	public async createUser(user: Partial<IUserEntity>) {
		const [createdUser] = (await dbConnection("users")
			.insert(user)
			.returning("*")) as IUserEntity[];
		return createdUser;
	}

	public async getUserById(id: string) {
		const user = await dbConnection<IUserEntity>("users")
			.where({ id })
			.first();
		return user;
	}

	public async getAllUsers() {
		const users = await dbConnection<IUserEntity>("users").select("*");
		return users;
	}

	public async getUserByName(name: string) {
		const user = await dbConnection<IUserEntity>("users")
			.where({ name })
			.first();
		return user;
	}

	public async update(id: string, user: Partial<IUserEntity>) {
		console.log("chamou o update");
		const [updatedUser] = await dbConnection<IUserEntity>("users")
			.where({ id })
			.update(user)
			.returning("*");
		return updatedUser;
	}

	public async delete(id: string) {
		const [deletedUser] = await dbConnection<IUserEntity>("users")
			.where({ id })
			.del()
			.returning("*");
		return `Usuario ${deletedUser.name} deletado com sucesso!`;
	}
}
