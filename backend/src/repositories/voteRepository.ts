import redisClient from "../database/redisClient";
import { IVoteEntity } from "../entities/VoteEntity";

export class VoteRepository {
	private VOTE_KEY_PREFIX = "vote:";
	async createVote(vote: IVoteEntity): Promise<void> {
		await redisClient.set(
			`${this.VOTE_KEY_PREFIX}${vote.userID}:${vote.pollID}:${vote.pollQuestionID}`,
			JSON.stringify(vote)
		);
	}

	async readVote(
		userID: string,
		pollID: string,
		pollQuestionID: number
	): Promise<IVoteEntity | null> {
		const voteData = await redisClient.get(
			`${this.VOTE_KEY_PREFIX}${userID}:${pollID}:${pollQuestionID}`
		);
		return voteData ? JSON.parse(voteData) : null;
	}

	async updateVote(
		userID: string,
		pollID: string,
		pollQuestionID: number,
		updatedVote: Partial<IVoteEntity>
	): Promise<void> {
		const vote = await this.readVote(userID, pollID, pollQuestionID);
		if (!vote) {
			throw new Error("Vote not found");
		}
		const newVote = { ...vote, ...updatedVote };
		await redisClient.set(
			`${this.VOTE_KEY_PREFIX}${userID}:${pollID}:${pollQuestionID}`,
			JSON.stringify(newVote)
		);
	}

	async deleteVote(
		userID: string,
		pollID: string,
		pollQuestionID: string
	): Promise<void> {
		await redisClient.del(
			`${this.VOTE_KEY_PREFIX}${userID}:${pollID}:${pollQuestionID}`
		);
	}

	async getQuestionVotes(
		pollID: string,
		pollQuestionID: number
	): Promise<IVoteEntity | {}> {
		const voteData = await redisClient.get(
			`${this.VOTE_KEY_PREFIX}${pollID}:${pollQuestionID}`
		);
		return voteData ? JSON.parse(voteData) : {};
	}

	async setQuestionVotes(vote: IVoteEntity): Promise<void> {
		const voteKey = `${this.VOTE_KEY_PREFIX}${vote.pollID}:${vote.pollQuestionID}`;
		const voteData = await redisClient.get(voteKey);
		const voteCounts = voteData ? JSON.parse(voteData) : {};

		voteCounts[vote.userChoice] = (voteCounts[vote.userChoice] || 0) + 1;

		await redisClient.set(voteKey, JSON.stringify(voteCounts));
	}
}
