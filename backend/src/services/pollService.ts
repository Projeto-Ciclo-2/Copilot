import { IPollEntity } from "../entities/pollEntity";
import PollRepository from "../repositories/pollRepository";
import {
	BadRequestException,
	ErrorWhileGeneratingQuiz,
	NotFoundException,
} from "../utils/Exception";
import { Message } from "../utils/Message";
import { QuizGenerator } from "../quiz-generator";
import { IWSMessageGameInit } from "../interfaces/IWSMessage";

export default class PollService {
	private pollRepository: PollRepository;

	private quizGenerator: QuizGenerator;
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
				(id) => id === pollInit.userID && poll.owner === id
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
}
