import { IPoll } from "../interfaces/IQuiz";
import { QuizGenerator } from "../quiz-generator";
import PollService from "../services/pollService";
import { ErrorWhileGeneratingQuiz } from "../utils/Exception";
import WebSocket from "ws";

// const pollService = new PollService();
const users = new Set<WebSocket>();

export const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", (ws: WebSocket) => {
	users.add(ws);
	ws.send(""); //lista de polls
	ws.on("message", (message) => {
		const data = JSON.parse(message.toString());
		if (!data.type) return;
		if (data.type === "postPoll") {
			//
			const { title, qntd_question, qntd_alternatives, theme, owner } =
				data.body;
			// validar
			// function
			return;
		}
		if(data.type === "postVote") {
			const vote = {}
			// redis
			broadcast(JSON.stringify(vote))
		}

	});
	ws.on("close", () => {
		users.delete(ws)
	});
});

function generateUUID() {
	return "Function not implemented.";
}

function broadcast(data: string):void {
	for (const user of users) {
		user.send(data)
	}
}
