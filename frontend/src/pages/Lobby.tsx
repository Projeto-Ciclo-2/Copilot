import React, { useState } from "react";
import "./css/Lobby.css";
import Btn from "../components/button";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
	const [usernames, setUsernames] = useState<string[]>([
		"johnDoe123",
		"coolGamer99",
		"techWiz45",
		"sarahSmith",
		"javaNerd",
	]);

	const navigate = useNavigate();

	function exitPage() {
		navigate("/home");
	}

	function navigatePageQuiz() {
		navigate("/quiz");
	}

	return (
		<section id="lobby-section">
			<Btn
				type="button"
				text="sair"
				className="btn-exit-quiz"
				onClick={exitPage}
			/>
			<div id="lobby-content">
				<div id="quiz-content">
					<h2>Quiz sobre hierógrifos</h2>
					<p>Hierógrifos</p>
					<p>5 perguntas</p>
				</div>
				<div id="div-message-show">
					<p>Se prepare que o show vai começar!</p>
				</div>
				<div id="div-players-present">
					<p>Chame seus amigos agora!</p>
					<div>
						<h4>Jogadores presentes</h4>
						{usernames.map((username, index) => (
							<p key={index}>{username}</p>
						))}
					</div>
				</div>
			</div>
			<Btn
				type="button"
				text="iniciar"
				className="btn-init-quiz"
				onClick={navigatePageQuiz}
			/>
		</section>
	);
};

export default Lobby;
