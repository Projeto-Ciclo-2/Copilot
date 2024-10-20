import { IPollEntity } from "../entities/pollEntity";
import WebSocket from "ws";
import PollRepository from "../repositories/pollRepository";
import {
	BadRequestException,
	ConflictException,
	ErrorWhileGeneratingQuiz,
	NotFoundException,
} from "../utils/Exception";
import { Message } from "../utils/Message";
import { QuizGenerator } from "../quiz-generator";
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

		poll.questions = gptQuestionsWithID;
		poll.started = false;
		poll.created_at = Date.now();
		poll.started_at = null;
		poll.playing_users = [];

		await this.pollRepository.createPoll(poll);

		return poll as IPollEntity;
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

	public async write(id: string, poll: Partial<IPollEntity>) {
		await this.pollRepository.write(id, poll);
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
	): Promise<{ username: string; pollID: string; newOwner: null | string }> {
		const user = await this.userRepository.getUserById(userID);
		const poll = await this.pollRepository.read(pollID);
		let ownerChange = false;

		if (!poll) throw new NotFoundException(Message.POLL_NOT_FOUND);

		if (!user) throw new NotFoundException(Message.USER_NOT_FOUND);

		if (
			poll.playing_users &&
			Array.isArray(poll.playing_users) &&
			poll.playing_users.length > 0 &&
			poll.playing_users.includes(user.id)
		)
			throw new ConflictException(Message.USER_ALREADY_IN_GAME);

		if (!poll.playing_users || !Array.isArray(poll.playing_users)) {
			poll.playing_users = [];
		}
		poll.playing_users.push(user.id);

		if (!poll.owner) {
			poll.owner = user.id;
			ownerChange = true;
		}

		await this.pollRepository.write(poll.id, poll);

		if (ownerChange) {
			return { pollID, username: user.name, newOwner: user.id };
		}

		return { pollID, username: user.name, newOwner: null };
	}
}
