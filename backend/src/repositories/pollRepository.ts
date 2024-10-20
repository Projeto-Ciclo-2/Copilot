import dbConnection from "../database/dbConnection";
import redisClient from "../database/redisClient";
import { IPollEntity } from "../entities/pollEntity";

export default class PollRepository {
	private POLL_KEY_PREFIX = "poll:";

	public async createPoll(poll: Partial<IPollEntity>) {
		const {
			title,
			theme,
			number_of_question,
			number_of_alternatives,
			duration_in_minutes,
		} = poll;
		const [createdPoll] = (await dbConnection<IPollEntity>("polls")
			.insert({
				title,
				theme,
				number_of_question,
				number_of_alternatives,
				duration_in_minutes,
			})
			.returning("*")) as IPollEntity[];

		return createdPoll;
	}
	public async createPollRedis(poll: Partial<IPollEntity>) {
		await redisClient.set(
			`${this.POLL_KEY_PREFIX}${poll.id}`,
			JSON.stringify(poll)
		);
	}
	public async getPollById(id: string) {
		const poll = await dbConnection<IPollEntity>("polls")
			.where({ id })
			.first();
		return poll;
	}

	public async getAllPolls() {
		const polls = await dbConnection<IPollEntity>("polls").select("*");
		return polls;
	}

	async read(id: string): Promise<IPollEntity | null> {
		const pollData = await redisClient.get(`${this.POLL_KEY_PREFIX}${id}`);
		return pollData ? JSON.parse(pollData) : null;
	}

	async updateRedis(
		id: string,
		updatedPoll: Partial<IPollEntity>
	): Promise<void> {
		await redisClient.set(
			`${this.POLL_KEY_PREFIX}${id}`,
			JSON.stringify(updatedPoll)
		);
	}

	async update(id: string, updatedPoll: Partial<IPollEntity>) {
		const {
			title,
			theme,
			number_of_question,
			number_of_alternatives,
			duration_in_minutes,
		} = updatedPoll;
		const [updatedPollData] = await dbConnection<IPollEntity>("polls")
			.where({ id })
			.update({
				title,
				theme,
				number_of_question,
				number_of_alternatives,
				duration_in_minutes,
			})
			.returning("*");
		await redisClient.set(
			`${this.POLL_KEY_PREFIX}${updatedPollData.id}`,
			JSON.stringify(updatedPollData)
		);
	}

	async deleteRedis(id: string): Promise<void> {
		await redisClient.del(`${this.POLL_KEY_PREFIX}${id}`);
	}

	async delete(id: string): Promise<void> {
		const [deletedPoll] = await dbConnection<IPollEntity>("polls")
			.where({ id })
			.del()
			.returning("*");
	}
}
