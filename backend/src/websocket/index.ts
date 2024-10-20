import PollService from "../services/pollService";
import { BadRequestException } from "../utils/Exception";
import WebSocket from "ws";
import { Message } from "../utils/Message";
import { VoteService } from "../services/voteService";
import {
	IWSMessageGameInit,
	IWSMessageSendGameInit,
	IWSMessageSendPoll,
	IWSMessageSendVote,
} from "../interfaces/IWSMessage";

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
			case "postPoll":
				try {
					const poll = await pollService.createPoll(data.body);
					const messageServer: IWSMessageSendPoll = {
						type: "sendPoll",
						poll: poll,
					};
					broadcast(JSON.stringify(messageServer));
				} catch (error: any) {
					ws.send(JSON.stringify({ error: error.message }));
				}
				break;
			case "postVote":
				try {
					const vote = await voteService.createVote(data.body);
					if (!vote) {
						return;
					}
					const messageServer: IWSMessageSendVote = {
						type: "sendVote",
						userID: vote.userID,
						pollID: vote.pollID,
						pollQuestionID: vote.pollQuestionID,
						userChoice: vote.userChoice,
					};
					broadcast(JSON.stringify(messageServer));
				} catch (error: any) {
					ws.send(JSON.stringify({ error: error.message }));
				}
				break;
			case "gameInit":
				try {
					const poll = await pollService.updateRedis(data.body);

					if (!poll) {
						throw new BadRequestException(Message.POLL_NOT_FOUND);
					}

					const messageServer: IWSMessageSendGameInit = {
						type: "sendGameInit",
						pollID: poll.id,
						started_at: poll.started_at || Date.now(),
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
