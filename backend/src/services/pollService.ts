import { IPollEntity } from "../entities/PollEntity";
import PollRepository from "../repositories/pollRepository";
import { NotFoundException } from "../utils/Exception";
import { Message } from "../utils/Message";

export default class PollService {
	private pollRepository: PollRepository;
	constructor() {
		this.pollRepository = new PollRepository();
	}
	public async createPoll(poll: Partial<IPollEntity>) {
		return await this.pollRepository.createPoll(poll);
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
