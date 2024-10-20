import { IPollEntity } from "../entities/pollEntity";
import WebSocket from "ws";
import PollRepository from "../repositories/pollRepository";
import {
	BadRequestException,
	ErrorWhileGeneratingQuiz,
	NotFoundException,
} from "../utils/Exception";
import { Message } from "../utils/Message";
import { QuizGenerator } from "../quiz-generator";

export default class PollService {
	private pollRepository: PollRepository;

	private quizGenerator: QuizGenerator;
	constructor() {
		this.quizGenerator = new QuizGenerator();
		this.pollRepository = new PollRepository();
	}

	public async createPoll(
		poll: Partial<IPollEntity>
	): Promise<Partial<IPollEntity>> {

		const {
			title,
			theme,
			number_of_question,
			number_of_alternatives,
			duration_in_minutes,
		} = poll;
		if (
			!title ||
			!theme ||
			!number_of_question ||
			!number_of_alternatives ||
			!duration_in_minutes
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
		poll.duration_in_minutes = duration_in_minutes;

		await this.pollRepository.createPoll(poll);

		return poll;
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

	public async write(id: string, poll: Partial<IPollEntity>) {
		await this.pollRepository.write(id, poll);
	}

	public async deleteRedis(id: string) {
		await this.pollRepository.deleteRedis(id);
	}

	public async delete(id: string) {
		await this.pollRepository.delete(id);
	}
}
