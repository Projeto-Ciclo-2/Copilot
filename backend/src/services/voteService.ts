import { IVoteEntity } from "../entities/voteEntity";
import PollRepository from "../repositories/pollRepository";
import UserRepository from "../repositories/userRepository";
import { VoteRepository } from "../repositories/voteRepository";
import { ConflictException, NotFoundException } from "../utils/Exception";
import { Message } from "../utils/Message";

export class VoteService {
	private voteRepository: VoteRepository;
	private pollRepository: PollRepository;
	private userRepository: UserRepository;

	constructor() {
		this.voteRepository = new VoteRepository();
		this.pollRepository = new PollRepository();
		this.userRepository = new UserRepository();
	}

	async createVote(vote: IVoteEntity): Promise<IVoteEntity | null> {
		const poll = await this.pollRepository.read(vote.pollID);
		const user = await this.userRepository.getUserById(vote.userID);

		if (!poll) {
			throw new NotFoundException(Message.POLL_NOT_FOUND);
		}

		if (!user || !poll.playing_users.includes(vote.userID)) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		const voteAlreadyExists = await this.voteRepository.readVote(
			vote.userID,
			vote.pollID,
			vote.pollQuestionID
		);

		if (voteAlreadyExists) {
			throw new ConflictException(Message.VOTE_ALREDY_DONE);
		}

		poll.questions.find(async (question) => {
			if (question.id === vote.pollQuestionID) {
				this.voteRepository.setQuestionVotes(vote);

				if (question.answer === vote.userChoice) {
					user.points += 10;
					await this.userRepository.update(user.id, user);
				}
			}
		});

		await this.voteRepository.createVote(vote);

		const votes = await this.voteRepository.getQuestionVotes(
			vote.pollID,
			vote.pollQuestionID
		);

		if (Object.keys(votes).length === 0) {
			return null;
		}

		return votes as IVoteEntity;
	}

	async getVote(
		userID: string,
		pollID: string,
		pollQuestionID: number
	): Promise<IVoteEntity | null> {
		return await this.voteRepository.readVote(
			userID,
			pollID,
			pollQuestionID
		);
	}

	async updateVote(
		userID: string,
		pollID: string,
		pollQuestionID: number,
		updatedVote: Partial<IVoteEntity>
	): Promise<void> {
		await this.voteRepository.updateVote(
			userID,
			pollID,
			pollQuestionID,
			updatedVote
		);
	}

	async deleteVote(
		userID: string,
		pollID: string,
		pollQuestionID: string
	): Promise<void> {
		await this.voteRepository.deleteVote(userID, pollID, pollQuestionID);
	}

	async getQuestionVotes(
		pollID: string,
		pollQuestionID: number
	): Promise<IVoteEntity | {}> {
		return await this.voteRepository.getQuestionVotes(
			pollID,
			pollQuestionID
		);
	}
}
