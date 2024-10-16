import React from "react";
import Btn from "../components/button";
import ExitIcon from "../icons/exit";
import StarIcon from "../icons/star";
import TrophyIcon from "../icons/trophy";
import PlayedPollsIcon from "../icons/playedPolls";
import StarWinnerIcon from "../icons/starWinner";
import "./css/Statistic.css";
import { useNavigate } from "react-router-dom";

const Statistic = () => {
	const navigate = useNavigate();

	function exit() {
		navigate('/home')
	}

	return (
		<section id="statistic-section">
			<Btn
				type="button"
				text={null}
				icon={<ExitIcon />}
				className="btn-exit"
				onClick={exit}
			/>
			<div id="img-profile-avatar"></div>
			<div id="content-statistic">
				<h2>Name user</h2>
				<article id="user-statistic">
					<section className="section-user-statistic">
						<TrophyIcon />
						<h3>Vitórias</h3>
						<p>5</p>
					</section>
					<hr />
					<section className="section-user-statistic">
						<StarIcon />
						<h3>Pontos</h3>
						<p>5</p>
					</section>
					<hr />
					<section className="section-user-statistic">
						<PlayedPollsIcon />
						<h3>Partidas</h3>
						<p>5</p>
					</section>
				</article>
				<article id="recent-quiz">
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
				</article>
			</div>
		</section>
	);
};

export default Statistic;
