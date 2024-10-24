import PollService from "../services/pollService";
import { BadRequestException, NotFoundException } from "../utils/Exception";
import WebSocket from "ws";
import { Message } from "../utils/Message";
import { VoteService } from "../services/voteService";
import {
	IWSMessageOwnerChange,
	IWSMessageGameInit,
	IWSMessageSendGameInit,
	IWSMessagePlayerJoin,
	IWSMessagePolls,
	IWSMessageSendPoll,
	IWSMessageSendVote,
	IWSMessageLeftQuiz,
	IWSMessagePollRank,
} from "../interfaces/IWSMessage";
import { config } from "../config";
import { UserService } from "../services/userService";
import { IncomingMessage } from "http";
import url from "url";

const pollService = new PollService();
const voteService = new VoteService();
const userService = new UserService();
const users = new Set<WsUser>();

interface WsUser {
	username: string;
	ws: WebSocket;
}

export const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
	const queryParams = url.parse(req.url!, true).query;
	const username = queryParams["username"] as string;

	if (!username) {
		ws.close(1008, "Missing username");
		return;
	}

	for (const user of users) {
		if(user.username === username) {
			ws.close(1000, "user already connected");
			return;
		}
	}

	const thisUser = { username: username, ws: ws };

	users.add(thisUser);
	sendAllPolls(ws);

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
					const vote = await voteService.createVote(data);
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
					console.log("enviando voto");
					broadcast(JSON.stringify(messageServer));
				} catch (error: any) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "joinQuiz":
				if (!data.userID || !data.pollID)
					return sendErr(
						ws,
						new Error("user don't provide userID and pollID")
					);
				try {
					const result = await pollService.joinGame(
						data.userID,
						data.pollID
					);
					const message: IWSMessagePlayerJoin = {
						type: "sendPlayerJoin",
						pollID: result.pollID,
						username: result.username,
					};
					broadcast(JSON.stringify(message));
					if (result.newOwner) {
						sendNewOwner(result.newOwner);
					}
				} catch (error) {
					if (error instanceof Error) return sendErr(ws, error);
					sendErr(ws);
				}
				break;
			case "gameInit":
				try {
					const poll = await pollService.updateRedis(data);

					if (!poll) {
						throw new BadRequestException(Message.POLL_NOT_FOUND);
					}

					const gameStartedAt = poll.started_at || Date.now();
					const messageServer: IWSMessageSendGameInit = {
						type: "sendGameInit",
						pollID: poll.id,
						started_at: gameStartedAt,
					};
					broadcast(JSON.stringify(messageServer));
					setEndGame(
						poll.id,
						gameStartedAt,
						poll.duration_in_minutes,
						poll.number_of_question
					);
				} catch (error: any) {
					ws.send(JSON.stringify({ error: error.message }));
				}
				break;
			case "leftQuiz":
				try {
					const result = await pollService.leftPoll(
						data.userID,
						data.pollID
					);
					const messageServer: IWSMessageLeftQuiz = {
						type: "leftQuiz",
						username: result.username,
						pollID: result.pollID,
					};
					broadcast(JSON.stringify(messageServer));
					if (result.newOwner) {
						sendNewOwner(result.newOwner);
					}
				} catch (error: any) {
					ws.send(JSON.stringify({ error: error.message }));
				}
				break;
			default:
				throw new BadRequestException(Message.INVALID_TYPE);
		}
	});
	ws.on("close", () => {
		users.delete(thisUser);
	});
});

function sendErr(ws: WebSocket, error?: Error) {
	ws.send(
		JSON.stringify({
			error: error ? error.message : "A internal error happen",
		})
	);
}

function broadcast(data: string): void {
	for (const user of users) {
		user.ws.send(data);
	}
}

function sendAllPolls(ws: WebSocket): void {
	pollService.getAllPollsFromRedis().then((e) => {
		const message: IWSMessagePolls = {
			type: "allPolls",
			polls: e,
		};
		ws.send(JSON.stringify(message));
	});
}

function sendNewOwner(newOwnerID: string) {
	const message: IWSMessageOwnerChange = {
		type: "ownerChange",
		userID: newOwnerID,
	};
	broadcast(JSON.stringify(message));
}

function setEndGame(
	id: string,
	timestamp: number,
	duration_in_minutes: number,
	qntd_question: number
) {
	const durationInMilliseconds = duration_in_minutes * 1000 * 60;
	const timeBetweenQuestion =
		config.PAUSE_TIME_BETWEEN_QUESTIONS * 1000 * qntd_question;
	const delayInMs = durationInMilliseconds + timeBetweenQuestion;
	setTimeout(async () => {
		const fnStarted = Date.now();
		console.log("iniciando função de encerrar quiz.");

		try {
			const poll = await pollService.read(id);
			if (!poll) throw new NotFoundException(Message.POLL_NOT_FOUND);

			const users = poll.playing_users;
			if (!users || !Array.isArray(users) || users.length <= 0)
				throw new NotFoundException(Message.NO_USERS);

			if (
				!poll.questions ||
				!Array.isArray(poll.questions) ||
				poll.questions.length <= 0
			)
				throw new NotFoundException(Message.NO_QUESTIONS);

			const votes: Array<{
				username: string;
				correctAnswers: number;
				points: number;
			}> = [];
			for (const userID of users) {
				const user = await userService.getUserById(userID);
				if (!user) return;

				const tempVotesOfThisPlayer = {
					username: user.name,
					correctAnswers: 0,
					points: 0,
				};

				for (const question of poll.questions) {
					const vote = await voteService.getVote(
						userID,
						poll.id,
						question.id
					);
					if (vote) {
						const correct = vote.userChoice === question.answer;
						const points = correct ? 10 : 0;
						tempVotesOfThisPlayer.correctAnswers += correct ? 1 : 0;
						tempVotesOfThisPlayer.points += points;
					} else {
						console.error("Alerta! um dos votos estava vazio");
					}
				}
				votes.push(tempVotesOfThisPlayer);
			}

			const message: IWSMessagePollRank = {
				type: "pollRank",
				poll: poll,
				players: votes,
			};
			broadcast(JSON.stringify(message));
			console.log("game ended", JSON.stringify(message));
			console.log("deleting everything related in redis");
			// deleting everything
			pollService.deleteRedis(poll.id);
			for (const userID of users) {
				for (const question of poll.questions) {
					console.log(
						userID.toString() +
							poll.id.toString() +
							question.id.toString()
					);
					voteService.deleteVote(
						userID,
						poll.id,
						question.id.toString()
					);
				}
			}
			console.log("done. ");
			console.log(
				"Function executed in " + (Date.now() - fnStarted) + "ms."
			);
		} catch (error) {
			if (error instanceof Error) {
			}
			console.error(error);
		}
	}, delayInMs);
	console.log(
		"função agendada para ser executada daqui " + delayInMs + "ms."
	);
	setTimeout(() => {
		console.log(
			"metade do tempo. função será executada daqui " +
				delayInMs / 2 +
				"ms."
		);
	}, delayInMs / 2);
}
