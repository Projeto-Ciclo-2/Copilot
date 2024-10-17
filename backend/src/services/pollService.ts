import { IPollEntity } from "../entities/PollEntity";
import WebSocket from "ws";
import PollRepository from "../repositories/pollRepository";
import {
	BadRequestException,
	ErrorWhileGeneratingQuiz,
	NotFoundException,
} from "../utils/Exception";
import { Message } from "../utils/Message";
import { QuizGenerator } from "../quiz-generator";
import { examples } from "../quiz-generator/responseExamples";

export default class PollService {
	private pollRepository: PollRepository;
	private wss = new WebSocket.Server({ port: 3000 });
	private quizGenerator: QuizGenerator;
	constructor() {
		this.quizGenerator = new QuizGenerator();
		this.pollRepository = new PollRepository();
	}
	public async createPoll(poll: Partial<IPollEntity>): Promise<String> {
		this.wss.on("postPoll", async () => {
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
				//duration_in_minutes
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
			await this.pollRepository.createPoll(poll);
		});

		this.wss.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(poll));
			}
		});

		return JSON.stringify(poll);
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
