import { IPollEntity } from "../entities/pollEntity";
import { IPoll } from "./IQuiz";

/**	SERVER MESSAGES
 * messages that only server will send
 */
export interface IWSMessagePolls {
	type: "allPolls";
	polls: IPoll[];
}

export interface IWSMessageSendPoll {
	type: "sendPoll";
	poll: IPollEntity;
}

export interface IWSMessagePlayerJoin {
	type: "sendPlayerJoin";
	pollID: string;
	username: string;
}

export interface IWSMessageLeftQuiz {
	type: "leftQuiz";
	username: string;
	pollID: string;
}

export interface IWSMessageOwnerChange {
	type: "ownerChange";
	userID: string;
}

export interface IWSMessageSendGameInit {
	type: "sendGameInit";
	pollID: string;
	started_at: number; //timestamp
}

export interface IWSMessageSendVote {
	type: "sendVote";
	userID: string;
	pollID: string;
	pollQuestionID: number;
	userChoice: string;
}

export interface IWSMessagePollRank {
	type: "pollRank";
	poll: IPoll,
	players: Array<{
		username: string;
		correctAnswers: number;
		points: number;
	}>;
}

/**	CLIENT MESSAGES
 * messages that only client will send
 */
export interface IWSMessagePostPoll {
	type: "postPoll";
	body: {
		title: string;
		theme: string;
		number_of_question: number;
		number_of_alternatives: number;
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

export interface IWSMessagePostLeftQuiz {
	type: "leftQuiz";
	userID: string;
	pollID: string;
}

export interface IWSMessageGameInit {
	type: "gameInit";
	userID: string; //todo: posteriormente validar no backend
	pollID: string;
}

export interface IWSMessagePostVote {
	type: "postVote";
	userID: string;
	pollID: string;
	pollQuestionID: string;
	userChoice: string;
	timestamp: string; //timestamp
}
