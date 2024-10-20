export interface IPollQuestion {
	id: number;
	statement: string;
	options: string[];
	answer: string;
	explanation: string;
}

export interface IPoll {
	id: string;
	started: boolean;
	owner: string;
	title: string;
	theme: string;
	number_of_question: number;
	number_of_alternatives: number;
	duration_in_minutes: number;
	created_at?: number; //timestamp
	started_at?: number; //timestamp
	questions: IPollQuestion[];
	playing_users: []; //array com ids dos usuários
}

// redis:
export interface IVote {
	id: string;
	user_id: string;
	poll_id: string;
	poll_question_id: string;
	user_choice: string;
}
