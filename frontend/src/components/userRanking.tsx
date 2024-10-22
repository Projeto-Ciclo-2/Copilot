import React from "react";
import RankIcon from "../assets/icons/rankingOrder";
import { IPlayerWithRank } from "../pages/rankingQuiz";


interface User {
	name: string;
	wins: number;
	points: number;
	medals: number;
	played_polls: number;
}

interface UserRankingProps {
	user?: User;
	index: number;
	ranking_type?: "quiz";
	player?: IPlayerWithRank;
}

const UserRanking: React.FC<UserRankingProps> = ({
	user,
	index,
	ranking_type,
	player,
}) => {
	
	const top3 = (index: number) => {
		if (index === 0) return "rank0";
		if (index === 1) return "rank1";
		if (index === 2) return "rank2";
		return "";
		}
	

	return (
		<>
			{ranking_type
				? player && (
						<div
							className={`ranking-card ${top3(player.position_rank -1)}`}>
							<div className="medal-ranking">
								<RankIcon index={player.position_rank - 1} />
							</div>
							<div className="ranking-content">
								<div className="name">
									<h4>{player.username}</h4>
								</div>
								<div className="content">
									<p>
										{player.correctAnswers}{" "}
										<span>
											{Number(player.correctAnswers) <= 1
												? "resposta certa"
												: "respostas certas"}
										</span>
									</p>
									<p>{player.points} pontos</p>
								</div>
							</div>
						</div>
				  )
				: user && (
						<div
							className={`ranking-card ${top3(index)}`}>
							<div className="medal-ranking">
								<RankIcon index={index} />
							</div>
							<div className="ranking-content">
								<div className="name">
									<h4>{user.name}</h4>
								</div>
								<div className="content">
									<p>{user.wins} vitórias</p>
									<p>{user.points} pontos</p>
									<p>{user.medals} medalhas</p>
									<p>{user.played_polls} jogos concluídos</p>
								</div>
							</div>
						</div>
				  )}
		</>
	);
};

export default UserRanking;
