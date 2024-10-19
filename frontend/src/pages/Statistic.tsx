import React, { useEffect, useState } from "react";
import Btn from "../components/button";
import ExitIcon from "../icons/exit";
import StarIcon from "../icons/star";
import TrophyIcon from "../icons/trophy";
import PlayedPollsIcon from "../icons/playedPolls";
import StarWinnerIcon from "../icons/starWinner";
import "./css/Statistic.css";
import { useNavigate } from "react-router-dom";
import { UserAPI } from "../api/users";
import { IUser } from "../interfaces/IUser";
import MedalIcon from "../icons/medal";

const Statistic = () => {
	const [user, setUser] = useState<IUser | null>(null);
	const userApi = new UserAPI();

	// data
	const date = new Date(user?.created_at as Date);
	const months = [
		"Janeiro",
		"Fevereiro",
		"Março",
		"Abril",
		"Maio",
		"Junho",
		"Julho",
		"Agosto",
		"Setembro",
		"Outubro",
		"Novembro",
		"Dezembro",
	];

	const navigate = useNavigate();

	function exit() {
		navigate("/home");
	}

	useEffect(() => {
		async function getUser() {
			const resut = await userApi.getMyUser();
			if (resut.statusCode === 200) {
				setUser(resut.data);
			}

			if (resut.error) {
				console.log("Erro ao buscar informações do usuário");
				console.log("Erro:", resut);
			}
		}

		getUser();
	}, []);

	return (
		<section id="statistic-section">
			<Btn
				type="button"
				text={null}
				icon={ExitIcon}
				className="btn-exit"
				onClick={exit}
			/>
			{user ? (
				/* Foto de perfil */
				/* <div id="img-profile-avatar"></div> */
				<div id="content-statistic">
					<h2>{user.name}</h2>
					<p>
						Por aqui desde {date.getDate()} de{" "}
						{months[date.getMonth()]} de {date.getFullYear()}
					</p>
					<p>
						Porcentagem de vitória{" "}
						{user.played_polls === 0
							? "0%"
							: ((user.wins / user.played_polls) * 100).toFixed(
									2
							  ) + "%"}
					</p>
					<article id="user-statistic">
						<section className="section-user-statistic">
							<TrophyIcon />
							<h3>Vitórias</h3>
							<p>{user.wins}</p>
						</section>
						<section className="section-user-statistic">
							<StarIcon />
							<h3>Pontos</h3>
							<p>{user.points}</p>
						</section>
						<section className="section-user-statistic">
							<PlayedPollsIcon />
							<h3>Partidas</h3>
							<p>{user.played_polls}</p>
						</section>
						<section className="section-user-statistic">
							<MedalIcon />
							<h3>Medalhas</h3>
							<p>{user.medals}</p>
						</section>
					</article>
					{/* Quizzes Jogados Recentemente */}
					{/* <article id="recent-quiz">
					<h4>Jogado Recentemente</h4>
					<ol id="div-played">
						<li>
							<div id="content-played">
								<div className="number-played">1</div>
								<p>Name quiz</p>
							</div>
							<StarWinnerIcon winner={false} />
						</li>
						<li>
							<div id="content-played">
								<div className="number-played">2</div>
								<p>Name quiz</p>
							</div>
							<StarWinnerIcon winner />
						</li>
						<li>
							<div id="content-played">
								<div className="number-played">3</div>
								<p>Name quiz</p>
							</div>
							<StarWinnerIcon winner={false} />
						</li>
						<li>
							<div id="content-played">
								<div className="number-played">4</div>
								<p>Name quiz</p>
							</div>
							<StarWinnerIcon winner={false} />
						</li>
						<li>
							<div id="content-played">
								<div className="number-played">5</div>
								<p>Name quiz</p>
							</div>
							<StarWinnerIcon winner />
						</li>
					</ol>
				</article> */}
				</div>
			) : (
				<p>carregando...</p>
			)}
		</section>
	);
};

export default Statistic;
