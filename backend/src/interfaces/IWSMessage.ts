// WebSocket on upgrade

import { IPoll } from "./IQuiz";

// adicionar usuário na lista global de usuários ou numa classe controladora

/**	SERVER MESSAGES
 * messages that only server will send
 */
export interface IWSMessagePolls {
	type: "allPolls";
	polls: IPoll[];
}

export interface IWSMessageSendPoll {
	type: "sendPoll";
	poll: IPoll;
}

export interface IWSMessageOwnerChange {
	type: "ownerChange";
	userID: string;
}

export interface IWSMessageSendVote {
	type: "sendVote";
	userID: string;
	pollID: string;
	pollQuestionID: string;
	userChoice: string;
}

export interface IWSMessagePollRank {
	type: "pollRank";
	players: [
		{
			username: string;
			correctAnswers: number;
			points: number;
		}
	];
}

/**	CLIENT MESSAGES
 * messages that only client will send
 */
export interface IWSMessagePostPoll {
	type: "postPoll";
	body: {
		title: string;
		qntd_question: number;
		qntd_alternatives: number;
		theme: string;
		duration_in_minutes: number;
		owner: string;
	};
}

export interface IWSMessageOwnerGiveUp {
	type: "ownerGiveUp";
	userID: string;
}

export interface IWSMessageJoinQuiz {
	type: "joinQuiz";
	userID: string;
	pollID: string;
}

export interface IWSMessageLeftQuiz {
	type: "leftQuiz";
	userID: string;
	pollID: string;
}

export interface IWSMessageGameInit {
	type: "gameInit";
	userID: string;
}

export interface IWSMessagePostVote {
	type: "postVote";
	userID: string;
	pollID: string;
	pollQuestionID: string;
	userChoice: string;
	timestamp: string; //timestamp
}
