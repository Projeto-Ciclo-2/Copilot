export interface IUserEntity {
	id: string;
	name: string;
	password?: string;
	created_at: Date;
	wins: number;
	points: number;
	medals: number;
	played_polls: number;
}
