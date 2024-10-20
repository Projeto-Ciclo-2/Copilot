export interface IVoteEntity {
	userID: string;
	pollID: string;
	pollQuestionID: number;
	userChoice: string;
	voted_at: string; //o timestamp de quando o voto ocorreu no frontend
}
