import React, { useEffect, useState } from "react";

interface IPlayer {
	username: string;
	correctAnswers: number;
	points: number;
}

const RankQuiz = () => {
	const [players, setPlayers] = useState<IPlayer[] | null>(null);

	useEffect(() => {
		async function getRank() {
			const result = await fetch("http://localhost:3003/poll-rank");
			const data = await result.json();
			setPlayers(data.players);
		}

		setTimeout(() => {
			getRank();
		}, 2000);
	}, []);

	// ordenar usuários
	useEffect(() => {
		const sortedPlayers = [...players as IPlayer[]].sort((a, b) => b.points - a.points);
		setPlayers(sortedPlayers);
	}, [players]);

	return (
		<section id="rank-quiz-section">
			<p>sdaas</p>
		</section>
	);
};

export default RankQuiz;
