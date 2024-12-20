import { IPollEntity } from "../entities/pollEntity";
import PollRepository from "../repositories/pollRepository";
import {
	BadRequestException,
	ConflictException,
	ErrorWhileGeneratingQuiz,
	NotFoundException,
} from "../utils/Exception";
import { Message } from "../utils/Message";
import { QuizGenerator } from "../quiz-generator";
import {
	IWSMessageGameInit,
	IWSMessageLeftQuiz,
} from "../interfaces/IWSMessage";
import UserRepository from "../repositories/userRepository";

export default class PollService {
	private pollRepository: PollRepository;
	private quizGenerator: QuizGenerator;
	private userRepository = new UserRepository();

	constructor() {
		this.quizGenerator = new QuizGenerator();
		this.pollRepository = new PollRepository();
	}

	public async createPoll(poll: Partial<IPollEntity>): Promise<IPollEntity> {
		const {
			title,
			theme,
			number_of_question,
			number_of_alternatives,
			duration_in_minutes,
			owner,
		} = poll;
		if (
			!title ||
			!theme ||
			!number_of_question ||
			!number_of_alternatives ||
			!duration_in_minutes ||
			!owner
		) {
			throw new BadRequestException(Message.MISSING_FIELDS);
		}

		const prompt = this.quizGenerator.generatePrompt(
			title,
			theme,
			number_of_question,
			number_of_alternatives
		);

		const gptQuestions = await this.quizGenerator.create(prompt);

		if (gptQuestions instanceof ErrorWhileGeneratingQuiz) {
			throw new ErrorWhileGeneratingQuiz(gptQuestions.message);
		}

		const gptQuestionsWithID = gptQuestions.map((question, index) => {
			return {
				id: index,
				statement: question.statement,
				options: question.options,
				answer: question.answer,
				explanation: question.explanation,
			};
		});

		const createdPoll = await this.pollRepository.createPoll(poll);

		createdPoll.questions = gptQuestionsWithID;
		createdPoll.started = false;
		createdPoll.created_at = Date.now();
		createdPoll.started_at = null;
		createdPoll.playing_users = [];
		createdPoll.owner = owner;

		await this.pollRepository.createPollRedis(createdPoll);

		return createdPoll as IPollEntity;
	}

	public async getPollById(id: string) {
		const poll = await this.pollRepository.getPollById(id);
		if (!poll) {
			throw new NotFoundException(Message.POLL_NOT_FOUND);
		}
		return poll;
	}

	public async getAllPolls() {
		const polls = await this.pollRepository.getAllPolls();
		return polls;
	}

	public async getAllPollsFromRedis() {
		return await this.pollRepository.getAllPollsFromRedis();
	}

	public async read(id: string): Promise<IPollEntity | null> {
		const poll = await this.pollRepository.read(id);
		if (!poll) {
			throw new NotFoundException(Message.POLL_NOT_FOUND);
		}
		return poll;
	}

	public async updateRedis(
		pollInit: IWSMessageGameInit
	): Promise<IPollEntity> {
		try {
			const { pollID, userID } = pollInit;
			if (!pollID || !userID) {
				throw new BadRequestException(Message.MISSING_FIELDS);
			}

			const poll = await this.pollRepository.read(pollInit.pollID);
			if (!poll) {
				throw new NotFoundException(Message.POLL_NOT_FOUND);
			}

			const owner = poll.playing_users.find(
				(user) =>
					user.userID === pollInit.userID &&
					poll.owner === user.userID
			);

			if (!owner) {
				throw new NotFoundException(
					Message.USER_NOT_FOUND_OR_NOT_OWNER
				);
			}
			poll.started_at = Date.now();
			poll.started = true;
			await this.pollRepository.updateRedis(poll.id, poll);

			return poll;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	public async deleteRedis(id: string) {
		await this.pollRepository.deleteRedis(id);
	}

	public async delete(id: string) {
		await this.pollRepository.delete(id);
	}

	public async joinGame(
		userID: string,
		pollID: string
	): Promise<{
		username: string;
		pollID: string;
		newOwner: null | string;
		completePoll: IPollEntity;
	}> {
		const user = await this.userRepository.getUserById(userID);
		const poll = await this.pollRepository.read(pollID);
		let ownerChange = false;

		if (!poll) throw new NotFoundException(Message.POLL_NOT_FOUND);

		if (!user) throw new NotFoundException(Message.USER_NOT_FOUND);

		if (
			poll.playing_users &&
			Array.isArray(poll.playing_users) &&
			poll.playing_users.length > 0
		) {
			for (const tempUser of poll.playing_users) {
				if (tempUser.userID === user.id) {
					throw new ConflictException(Message.USER_ALREADY_IN_GAME);
				}
			}
		}

		if (!poll.playing_users || !Array.isArray(poll.playing_users)) {
			poll.playing_users = [];
		}
		poll.playing_users.push({ userID: user.id, username: user.name });

		if (!poll.owner) {
			// poll.owner = user.id;
			// ownerChange = true;
		}

		await this.pollRepository.updateRedis(poll.id, poll);

		if (ownerChange) {
			// return { pollID, username: user.name, newOwner: user.id };
		}

		return {
			pollID,
			username: user.name,
			newOwner: null,
			completePoll: poll,
		};
	}

	public async leftPoll(
		userID: string,
		pollID: string
	): Promise<{
		pollID: string;
		userID: string;
		username: string;
		newOwner: string | null;
		poll: IPollEntity;
	}> {
		if (!pollID || !userID) {
			throw new BadRequestException(Message.MISSING_FIELDS);
		}
		console.log(pollID);
		const user = await this.userRepository.getUserById(userID);
		const poll = await this.pollRepository.read(pollID);
		let ownerChange = false;

		if (!poll) {
			throw new NotFoundException(Message.POLL_NOT_FOUND);
		}

		if (!user) {
			throw new NotFoundException(Message.USER_NOT_FOUND);
		}

		poll.playing_users = poll.playing_users.filter(
			(u) => u.userID !== user.id
		);

		if (poll.owner === user.id) {
			// poll.owner = poll.playing_users[0].userID || "";
			// ownerChange = true;
		}

		await this.pollRepository.updateRedis(poll.id, poll);

		if (ownerChange) {
			// return {
			// 	pollID: poll.id,
			// 	userID: user.id,
			// 	username: user.name,
			// 	newOwner: user.id,
			// };
		}

		return {
			pollID: poll.id,
			userID: user.id,
			username: user.name,
			newOwner: null,
			poll: poll,
		};
	}
}
