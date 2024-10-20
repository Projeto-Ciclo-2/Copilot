export interface IVoteEntity {
	userID: string;
	pollID: string;
	pollQuestionID: number;
	userChoice: string;
	voted_at: number; //o timestamp de quando o voto ocorreu no frontend
}
