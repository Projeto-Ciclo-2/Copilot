import React, { useEffect, useMemo, useState } from "react";
import "./css/globalRanking.css";
import Btn from "../components/button";
import Ranking from "../icons/ranking";
import UserRanking from "../components/userRanking";
import ExitIcon from "../icons/exit";
import { useNavigate } from "react-router-dom";
import WaitRanking from "../components/waitRanking/waitRanking";
import { usePolls } from "../context/PollsContext";

export interface IPlayer {
	username: string;
	correctAnswers: number;
	points: number;
}

// Interface extendida com o atributo position_rank
export interface IPlayerWithRank extends IPlayer {
	position_rank: number; // Atributo para armazenar a posição do jogador
}

const RankingQuiz = () => {
	const { currentRank } = usePolls();
	const players = useMemo(() => {
		if (currentRank) {
			const tempPlayers = orderPlayers(currentRank.players);
			if (tempPlayers) {
				return tempPlayers;
			}
		}
		return null;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentRank]);

	const navigate = useNavigate();

	if (currentRank) {
		console.log(currentRank.players);
	}

	function back() {
		navigate("/home");
	}

	function orderPlayers(players: IPlayer[]) {
		if (players) {
			const sortedPlayers = [...players].sort(
				(a, b) => b.points - a.points
			);
			return assignRanks(sortedPlayers);
		}
	}

	// Função para atribuir classificações, lidando com empates
	function assignRanks(sortedPlayers: IPlayer[]): IPlayerWithRank[] {
		const newRankings: IPlayerWithRank[] = [];
		let currentRank = 1;

		for (let i = 0; i < sortedPlayers.length; i++) {
			const player = sortedPlayers[i];

			if (i > 0 && player.points === sortedPlayers[i - 1].points) {
				// Empate: usa a mesma classificação do jogador anterior
				newRankings.push({
					...player,
					position_rank: newRankings[i - 1].position_rank,
				});
			} else {
				// Não há empate: nova classificação
				newRankings.push({ ...player, position_rank: currentRank });
			}
			currentRank++; // Incrementa a classificação para o próximo jogador
		}

		return newRankings; // Retorna a lista com as classificações
	}

	if (currentRank) {
		if (
			!Array.isArray(currentRank.players) ||
			currentRank.players.length <= 0
		) {
			return <>não tem votos</>;
		}
	}

	return players ? (
		<section id="ranking-quiz">
			<div id="header">
				<Btn
					type="button"
					id="back-btn"
					text={null}
					icon={ExitIcon}
					className="btn-exit"
					onClick={back}
				/>
				<h2>
					<Ranking /> Rank
				</h2>
			</div>
			<div id="ranking-container">
				{players &&
					players.map((player) => (
						<UserRanking
							key={player.username}
							index={player.position_rank} // Usa a posição do jogador
							player={player}
							ranking_type="quiz"
						/>
					))}
			</div>
		</section>
	) : (
		<WaitRanking />
	);
};

export default RankingQuiz;
