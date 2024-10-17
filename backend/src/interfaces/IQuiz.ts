export interface IPollQuestion {
	id: number;
	statement: string;
	options: string[];
	answer: string;
	explanation: string;
}

export interface IPoll {
	id: string;
	title: string;
	theme: string;
	number_of_question: number;
	number_of_alternatives: number;
	duration_in_minutes: number;
	created_at?: string; //timestamp
	questions: IPollQuestion[];
}

// redis:
export interface IVote {
	id: string;
	user_id: string;
	poll_id: string;
	poll_question_id: string;
	user_choice: string;
}

export interface IPlayersPoll {
	id: string;
	users: [];
}
