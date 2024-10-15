import React from "react";
import ImagesCards from "../icons/imagesCards";
import ArrowUp from "../icons/arrowUp";

export interface card {
	title: string;
	owner_name: string;
	number_players: number;
	number_image: number;
}

interface CardProps {
	card: card;
	index: number;
  }

const CardQuiz: React.FC<CardProps> = ({ card, index }) => {
	return (
		<div key={index} className="card-quiz">
			<div className="div-img-card">
				<ImagesCards number_image={card.number_image} />
			</div>
			<div className="content-card">
				<h3>{card.title}</h3>
				<p>{card.owner_name}</p>
			</div>
			<div className="card-players">
				<span className="number-players">{card.number_players}</span>
				<p>players</p>
			</div>
			<div className="btn-entrar">
				Entrar{" "}
				<ArrowUp color={(index + 1) % 2 === 0 ? "#000" : "#fff"} />
			</div>
		</div>
	);
}

export default CardQuiz;
