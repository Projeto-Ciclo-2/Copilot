import { IPollQuestionEntity } from "./pollQuestionEntity";

export interface IPollEntity {
	id: string;
	title: string;
	theme: string;
	number_of_question: number;
	number_of_alternatives: number;
	duration_in_minutes: number;
	started: boolean;
	owner: string;
	created_at?: number; //timestamp
	started_at?: number | null; //timestamp
	questions: IPollQuestionEntity[];
	playing_users: Array<{ userID: string; username: string }>;
}
