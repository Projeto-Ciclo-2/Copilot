export interface IPollQuestionEntity {
	id: number;
	statement: string;
	options: string[];
	answer: string;
	explanation: string;
}
