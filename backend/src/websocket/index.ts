import PollService from "../services/pollService";
import {
	BadRequestException,
	ErrorWhileGeneratingQuiz,
} from "../utils/Exception";
import WebSocket from "ws";
import { Message } from "../utils/Message";

const pollService = new PollService();
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
					broadcast(poll);
				} catch (error: any) {
					ws.send(JSON.stringify({ error: error.message }));
				}
				break;
			case "postVote":
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
