import React from "react";
import ImagesCards from "../icons/imagesCards";
import ArrowUp from "../icons/arrowUp";
import { IPoll } from "../interfaces/IQuiz";
import TimeIcon from "../icons/time";

export interface card {
	title: string;
	owner_name: string;
	number_players: number;
	number_image: number;
}

interface CardProps {
	poll: IPoll;
	index: number;
	onClick: () => void;
}

const CardQuiz: React.FC<CardProps> = ({ poll, index, onClick }) => {
	const number_image = Math.floor(Math.random() * 4) + 1;

	return (
		<div key={index} className="card-quiz" onClick={onClick}>
			<div className="div-img-card">
				{index % 2 === 0 ? (
					<ImagesCards number_image={number_image} color="#DCD0DC" />
				) : (
					<ImagesCards number_image={number_image} color="#4A464A" />
				)}
			</div>
			<div className="content-card">
				<h3>{poll.title}</h3>
				<p>{poll.theme}</p>
				{/* Ícone de tempo */}
				<div className="duration">
					{index % 2 === 0 ? (
						<TimeIcon color="#DCD0DC" />
					) : (
						<TimeIcon color="#4A464A" />
					)}

					{/* Minutos */}
					<p>
						{poll.duration_in_minutes}
						{poll.duration_in_minutes === 1
							? " Minuto"
							: " Minutos"}
					</p>
				</div>
				{/* Quiz iniciado? */}
				{poll.started && index % 2 === 0 ? (
					<div
						className="started"
						style={{
							border: "1px solid var(--accent)",
							borderRadius: "5px",
						}}
					>
						<p style={{ color: "var(--accent)" }}>iniciado</p>
					</div>
				) : (
					<div
						className="started"
						style={{
							border: "1px solid var(--red)",
							borderRadius: "5px",
						}}
					>
						<p style={{ color: "#4A464A" }}>iniciado</p>
					</div>
				)}
			</div>
			<div className="card-players">
				<span className="number-players">
					{poll.number_of_question}
				</span>
				<p>Questões</p>
			</div>
			<div className="btn-entrar">
				Entrar{" "}
				<ArrowUp color={(index + 1) % 2 === 0 ? "#000" : "#fff"} />
			</div>
		</div>
	);
};

export default CardQuiz;
