import { IPollQuestionEntity } from "./PollQuestionEntity";

export interface IPollEntity {
	id: string;
	title: string;
	theme: string;
	number_of_question: number;
	number_of_alternatives: number;
	duration_in_minutes: number;
	created_at?: string; //timestamp
	questions: IPollQuestionEntity[];
}
