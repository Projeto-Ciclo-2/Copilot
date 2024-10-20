import PollService from "../services/pollService";
import {
	BadRequestException,
	ErrorWhileGeneratingQuiz,
} from "../utils/Exception";
import WebSocket from "ws";
import { Message } from "../utils/Message";
import { VoteService } from "../services/voteService";

const pollService = new PollService();
const voteService = new VoteService();
const users = new Set<WebSocket>();

export const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
	users.add(ws);
	ws.send(""); //lista de polls
	ws.on("message", async (message) => {
		const data = JSON.parse(message.toString());
		switch (data.type) {
			case "postPolls":
				try {
					const poll = await pollService.createPoll(data.body);
					const messageServer = {
						type: "postPolls",
						body: poll,
					};
					broadcast(JSON.stringify(messageServer));
				} catch (error: any) {
					ws.send(JSON.stringify({ error: error.message }));
				}
				break;
			case "postVote":
				try {
					const vote = await voteService.createVote(data.body);
					const messageServer = {
						type: "postVote",
						body: vote,
					};
					broadcast(JSON.stringify(messageServer));
				} catch (error: any) {
					ws.send(JSON.stringify({ error: error.message }));
				}
				break;
			default:
				throw new BadRequestException(Message.INVALID_TYPE);
		}
	});
	ws.on("close", () => {
		users.delete(ws);
	});
});

function broadcast(data: string): void {
	for (const user of users) {
		user.send(data);
	}
}
